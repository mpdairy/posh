(ns posh.lib.ratom
  "Ported to .cljc from reagent.ratom by alexandergunnarson."
  (:refer-clojure :exclude [atom run!])
  (:require        [clojure.set           :as s]
                   [cljs.analyzer :as analyzer])
  #?(:cljs (:require-macros [posh.lib.ratom
                             :refer [getm setm! getf setf! add! array-list alength* aset* aget*]]))
  #?(:clj  (:import         [java.util ArrayList]
                            [clojure.lang IDeref IAtom IRef IMeta IHashEq])))

;;; Misc utils

(defn upper-first [s] (apply str (.toUpperCase (str (first s))) (rest s)))

(defn cljs-env?
  "Given an &env from a macro, tells whether it is expanding into CLJS."
  [env]
  (boolean (:ns env)))

#?(:clj
(defmacro if-cljs
  "Return @then if the macro is generating CLJS code and @else for CLJ code."
  {:from "https://groups.google.com/d/msg/clojurescript/iBY5HaQda4A/w1lAQi9_AwsJ"}
  ([env then else] `(if (cljs-env? ~env) ~then ~else))))

;;; Mutability

#?(:clj
(definterface IMutable
  (get [])
  (set [x])))

; TODO CLJ create for necessary primitive datatypes as well
#?(:clj
(deftype Mutable [^:unsynchronized-mutable val]
  IMutable
  (get [this] val)
  (set [this x] (set! val x))
  IDeref
  (deref [this] val)))

#?(:clj (defmacro mut [x] `(Mutable. ~x)))

#?(:clj
(defmacro getm
  "Get mutable"
  [x]
  (if-cljs &env x
                `(.get ~(with-meta x {:tag 'posh.lib.ratom.Mutable})))))

#?(:clj
(defmacro setm!
  "Set mutable"
  [x v]
  (if-cljs &env `(set!            ~x                                        ~v)
                `(.set ~(with-meta x {:tag 'posh.lib.ratom.Mutable}) ~v))))

#?(:clj
(defmacro getf
  "Get field"
  [x field]
  (let [accessor (symbol
                   (str "."
                     (if-cljs &env (str "-" (name field))
                                   (str "get" (upper-first (name field))))))]
    `(~accessor ~x))))

#?(:clj
(defmacro setf!
  "Set field"
  [x field v]
  (let [accessor (symbol
                   (str "."
                     (if-cljs &env (str "-" (name field))
                                   (str "set" (upper-first (name field))))))]
    (if-cljs &env `(set! (~accessor ~x) ~v)
                  `(~accessor ~x ~v)))))

#?(:clj
(defmacro add! [x v]
  (if-cljs &env `(.push ~x ~v)
                `(.add ~(with-meta x {:tag 'java.util.ArrayList}) ~v))))

#?(:clj
(defmacro array-list [& args]
  (if-cljs &env `(array ~@args)
                `(doto (ArrayList.) ~@(for [arg args] `(.add ~arg))))))

#?(:clj
(defmacro alength* [x]
  (if-cljs &env `(alength ~x)
                `(.size ~(with-meta x {:tag 'java.util.ArrayList})))))

#?(:clj
(defmacro aget* [x i]
  (if-cljs &env `(aget ~x)
                `(.get ~(with-meta x {:tag 'java.util.ArrayList}) ~i))))

#?(:clj
(defmacro aset* [x i v]
  (if-cljs &env `(aset ~x ~i ~v)
                `(.set ~(with-meta x {:tag 'java.util.ArrayList}) ~i ~v))))

;;; Interfaces and (certain) types

#?(:clj
(definterface IHasCaptured
  (getCaptured [])
  (setCaptured [v])))

#?(:clj
(deftype HasCaptured
  [^:unsynchronized-mutable captured]
  IHasCaptured
  (getCaptured [this] captured)
  (setCaptured [this v] (set! captured v))))

#?(:clj
(definterface IHasWatches
  (getWatches    [])
  (setWatches    [v])
  (getWatchesArr [])
  (setWatchesArr [v])))

#?(:clj
(definterface IReaction
  (peekAt [])
  (handleChange [sender oldval newval])
  (updateWatching [derefed])
  (queuedRun [])
  (tryCapture [f])
  (run [check])
  (setOpts [opts])
  (getRatomGeneration [])
  (setRatomGeneration [v])
  (getIsDirty         [])
  (setIsDirty         [v])
  (getWatching        [])
  (setWatching        [v])
  (getAutoRun         [])
  (setAutoRun         [v])))

#?(:clj
(definterface IHasReaction
  (getReaction [])
  (setReaction [v])))

#?(:clj
(definterface IHasDestroy
  (getDestroy [])
  (setDestroy [v])))

#?(:clj
(definterface IHasF
  (getF [])
  (setF [v])))

;;; Logging

#?(:clj (defn dev? [] false)) ; TODO CLJ

;;; Vars

#?(:clj  (def     ^:dynamic *ratom-context* nil)
   :cljs (declare ^:dynamic *ratom-context*))
#?(:clj  (defonce          debug (mut false))
   :cljs (defonce ^boolean debug false))
(defonce ^:private generation #?(:clj (mut 0) :cljs 0))
(defonce ^:private -running (clojure.core/atom 0))

(defn ^boolean reactive? []
  (some? *ratom-context*))

;;; Utilities

(defn running [] (+ @-running))

#?(:cljs
(defn- ^number arr-len [x]
  (if (nil? x) 0 (alength* x))))

#?(:cljs
(defn- ^boolean arr-eq [x y]
  (let [len (arr-len x)]
    (and (== len (arr-len y))
         (loop [i 0]
           (or (== i len)
               (if (identical? (aget* x i) (aget* y i))
                 (recur (inc i))
                 false)))))))

(defn- in-context [obj f]
  (binding [*ratom-context* obj]
    (f)))

(declare deref-capture)

(defn- notify-deref-watcher! [derefed]
  (when-some [#?(:clj ^IHasCaptured r
                 :cljs              r) *ratom-context*]
    (let [c (getf r captured)]
      (if (nil? c)
        (setf! r captured (array-list derefed))
        (add! c derefed)))))

(defn- check-watches [old new]
  (when (getm debug)
    (swap! -running + (- (count new) (count old))))
  new)

(defn- add-w [#?(:clj ^IHasWatches this :cljs this) key f]
  (let [w (getf this watches)]
    (setf! this watches (check-watches w (assoc w key f)))
    (setf! this watchesArr nil)))

(defn- remove-w [#?(:clj ^IHasWatches this :cljs this) key]
  (let [w (getf this watches)]
    (setf! this watches (check-watches w (dissoc w key)))
    (setf! this watchesArr nil)))

(defn- notify-w [#?(:clj ^IHasWatches this :cljs this) old new]
  (let [w (getf this watchesArr)
        a (if (nil? w)
            ;; Copy watches to array(-list) for speed
            (->> (getf this watches)
                 (reduce-kv #(doto %1 (add! %2) (add! %3)) #?(:clj (ArrayList.) :cljs #js[]))
                 (setf! this watchesArr))
            w)]
    (let [len (alength* a)]
      (loop [i 0]
        (when (< i len)
          (let [k (aget* a i)
                f (aget* a (inc i))]
            (f k this old new))
          (recur (+ 2 i)))))))

#?(:cljs
(defn- pr-atom [a writer opts s]
  (-write writer (str "#<" s " "))
  (pr-writer (binding [*ratom-context* nil] (-deref a)) writer opts)
  (-write writer ">")))

; ;;; Queueing

(defonce ^:private rea-queue #?(:clj (mut nil) :cljs nil))

(defn- rea-enqueue [r]
  (when (nil? (getm rea-queue))
    (setm! rea-queue (array-list))
    #_(:cljs (reagent.impl.batching/schedule)))
  (add! (getm rea-queue) r))

(defn flush! []
  (loop []
    (let [q (getm rea-queue)]
      (when-not (nil? q)
        (setm! rea-queue nil)
        (dotimes [i (alength* q)]
          (let [#?(:clj ^IReaction r
                   :cljs           r) (aget* q i)]
            (.queuedRun r)))
        (recur)))))

#_(:cljs (set! reagent.impl.batching/ratom-flush flush!))

;;; Atom

(defprotocol IReactiveAtom)

(deftype RAtom
  #?(:clj  [^:unsynchronized-mutable state
            meta
            validator
            ^:unsynchronized-mutable watches
            ^:unsynchronized-mutable watchesArr]
     :cljs [^:mutable state
            meta
            validator
            ^:mutable watches
            ^:mutable watchesArr])
  #?(:cljs IAtom)
  IReactiveAtom

  #?(:clj Object :cljs IEquiv)
  (#?(:clj equals :cljs -equiv) [o other] (identical? o other))

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (notify-deref-watcher! this)
    state)

  #?(:clj IAtom :cljs IReset)
  (#?(:clj reset :cljs -reset!) [a new-value]
    (when-not (nil? validator)
      (assert (validator new-value) "Validator rejected reference state"))
    (let [old-value state]
      (set! state new-value)
      (when-not (nil? watches)
        (notify-w a old-value new-value))
      new-value))

  #?(:cljs ISwap)
  (#?(:clj swap :cljs -swap!) [a f]          (#?(:clj .reset :cljs -reset!) a (f state)))
  (#?(:clj swap :cljs -swap!) [a f x]        (#?(:clj .reset :cljs -reset!) a (f state x)))
  (#?(:clj swap :cljs -swap!) [a f x y]      (#?(:clj .reset :cljs -reset!) a (f state x y)))
  (#?(:clj swap :cljs -swap!) [a f x y more] (#?(:clj .reset :cljs -reset!) a (apply f state x y more)))

  IMeta
  (#?(:clj meta :cljs -meta) [_] meta)

  #?(:cljs IPrintWithWriter)
  #?(:cljs (-pr-writer [a w opts] (pr-atom a w opts "Atom:")))

  #?(:clj IRef :cljs IWatchable)
  #?(:cljs (-notify-watches [this old new] (notify-w this old new))) ; TODO CLJ
  (#?(:clj addWatch :cljs -add-watch) [this key f]        (add-w this key f))
  (#?(:clj removeWatch :cljs -remove-watch) [this key]       (remove-w this key))

  #?(:cljs IHash)
  #?(:cljs (-hash [this] (goog/getUid this)))

  #?@(:clj
 [IHasWatches
  (getWatches    [this]   watches)
  (setWatches    [this v] (set! watches v))
  (getWatchesArr [this]   watchesArr)
  (setWatchesArr [this v] (set! watchesArr v))]))

(defn atom
  "Like clojure.core/atom, except that it keeps track of derefs."
  ([x] (RAtom. x nil nil nil nil))
  ([x & {:keys [meta validator]}] (RAtom. x meta validator nil nil)))

;;; track

(declare make-reaction)

(def ^{:private true :const true} cache-key #?(:clj "reactionCache" :cljs "reagReactionCache"))

(defn- cached-reaction [f o k #?(:clj ^IHasReaction obj :cljs obj) destroy]
  (let [m (aget* o cache-key)
        m (if (nil? m) {} m)
        ^IDeref r (m k nil)]
    (cond
      (some? r) (#?(:clj .deref :cljs -deref) r)
      (nil? *ratom-context*) (f)
      :else (let [^IDeref r (make-reaction
                     f :on-dispose (fn [x]
                                     (when (getm debug) (swap! -running dec))
                                     (as-> (aget* o cache-key) _
                                       (dissoc _ k)
                                       (aset* o cache-key _))
                                     (when (some? obj)
                                       (setf! obj reaction nil))
                                     (when (some? destroy)
                                       (destroy x))))
                  v (#?(:clj .deref :cljs -deref) r)]
              (aset* o cache-key (assoc m k r))
              (when (getm debug) (swap! -running inc))
              (when (some? obj)
                (setf! obj reaction r))
              v))))

#?(:clj
(definterface ITrack
  (getArgs [])))

(deftype Track
  #?(:clj  [^:unsynchronized-mutable f args
            ^:unsynchronized-mutable reaction]
     :cljs [f args ^:mutable reaction])
  IReactiveAtom

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (if-some [^IDeref r reaction]
      (#?(:clj .deref :cljs -deref) r)
      (cached-reaction #(apply f args) f args this nil)))

  #?(:clj Object :cljs IEquiv)
  (#?(:clj equals :cljs -equiv) [_ other]
    (and (instance? Track other)
         (= f (getf ^Track other f))
         (= args (getf ^Track other args))))

  #?(:clj IHashEq :cljs IHash)
  (#?(:clj hasheq :cljs -hash) [_] (hash [f args]))

  #?(:cljs IPrintWithWriter)
  #?(:cljs (-pr-writer [a w opts] (pr-atom a w opts "Track:")))

  #?@(:clj
 [IHasF
  (getF    [this]   f)
  (setF    [this v] (set! f v))

  ITrack
  (getArgs [this]   args)]))

(defn make-track [f args]
  (Track. f args nil))

(defn make-track! [f args]
  (let [^Track t (make-track f args)
        r (make-reaction #(#?(:clj .deref :cljs -deref) t)
                         :auto-run true)]
    @r
    r))

(defn track [f & args]
  {:pre [(ifn? f)]}
  (make-track f args))

(defn track! [f & args]
  {:pre [(ifn? f)]}
  (make-track! f args))

;;; cursor

#?(:clj
(definterface IRCursor
  (peekAt   [])
  (setState [oldstate newstate])
  (getPath  [])
  (getRatom [])))

(deftype RCursor
  #?(:clj  [ratom path
            ^:unsynchronized-mutable reaction
            ^:unsynchronized-mutable state
            ^:unsynchronized-mutable watches]
     :cljs [ratom path
            ^:mutable reaction
            ^:mutable state
            ^:mutable watches])
  #?(:cljs IAtom)
  IReactiveAtom

  #?(:clj Object :cljs IEquiv)
  (#?(:clj equals :cljs -equiv) [_ other]
    (and (instance? RCursor other)
         (= path (getf ^RCursor other path))
         (= ratom (getf ^RCursor other ratom))))

  #?(:clj IRCursor :cljs Object)
  (peekAt [this]
    (binding [*ratom-context* nil]
      (#?(:clj .deref :cljs -deref) this)))

  (setState [this oldstate newstate]
    (when-not (identical? oldstate newstate)
      (set! state newstate)
      (when (some? watches)
        (notify-w this oldstate newstate))))

  #?@(:clj
  [(getPath  [this] path)
   (getRatom [this] ratom)])

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (let [oldstate state
          newstate (if-some [^IDeref r reaction]
                     (#?(:clj .deref :cljs -deref) r)
                     (let [f (if (satisfies? IDeref ratom)
                               #(get-in @ratom path)
                               #(ratom path))]
                       (cached-reaction f ratom path this nil)))]
      (.setState this oldstate newstate)
      newstate))

  #?(:clj IAtom :cljs IReset)
  (#?(:clj reset :cljs -reset!) [this new-value]
    (let [oldstate state]
      (.setState this oldstate new-value)
      (if (satisfies? IDeref ratom)
        (if (= path [])
          (reset! ratom new-value)
          (swap! ratom assoc-in path new-value))
        (ratom path new-value))
      new-value))

  #?(:cljs ISwap)
  (#?(:clj swap :cljs -swap!) [a f]          (#?(:clj .reset :cljs -reset!) a (f (.peekAt a))))
  (#?(:clj swap :cljs -swap!) [a f x]        (#?(:clj .reset :cljs -reset!) a (f (.peekAt a) x)))
  (#?(:clj swap :cljs -swap!) [a f x y]      (#?(:clj .reset :cljs -reset!) a (f (.peekAt a) x y)))
  (#?(:clj swap :cljs -swap!) [a f x y more] (#?(:clj .reset :cljs -reset!) a (apply f (.peekAt a) x y more)))

  #?(:cljs IPrintWithWriter)
  #?(:cljs (-pr-writer [a w opts] (pr-atom a w opts (str "Cursor: " path))))

  #?(:clj IRef :cljs IWatchable)
  #?(:cljs (-notify-watches [this old new] (notify-w this old new))) ; TODO CLJ
  (#?(:clj addWatch    :cljs -add-watch   ) [this key f] (add-w    this key f))
  (#?(:clj removeWatch :cljs -remove-watch) [this key]   (remove-w this key))

  #?(:clj IHashEq :cljs IHash)
  (#?(:clj hasheq :cljs -hash) [_] (hash [ratom path])))

(defn cursor
  [src path]
  (assert (or (satisfies? IReactiveAtom src)
              (and (ifn? src)
                   (not (vector? src))))
          (str "src must be a reactive atom or a function, not "
               (pr-str src)))
  (RCursor. src path nil nil nil))


;;; with-let support

(defn with-let-destroy [#?(:clj ^IHasDestroy v :cljs v)]
  (when-some [f (getf v destroy)]
    (f)))

(defn with-let-values [key]
  (if-some [c *ratom-context*]
    (cached-reaction #?(:clj #(ArrayList.) :cljs array) c key
                     nil with-let-destroy)
    (array-list)))


;;; reaction

(#?(:clj definterface :cljs defprotocol) IDisposable
  (dispose      [#?(:cljs this)])
  (addOnDispose [#?(:cljs this) f]))

(#?(:clj definterface :cljs defprotocol) IRunnable
  (run [#?(:cljs this)]))

(declare handle-reaction-change)

(deftype Reaction
  #?(:clj  [^:unsynchronized-mutable f
            ^:unsynchronized-mutable state
            ^:unsynchronized-mutable dirty?
            ^:unsynchronized-mutable no-cache?
            ^:unsynchronized-mutable watching
            ^:unsynchronized-mutable watches
            ^:unsynchronized-mutable autoRun
            ^:unsynchronized-mutable caught
            ^:unsynchronized-mutable on-set
            ^:unsynchronized-mutable on-dispose
            ^:unsynchronized-mutable on-dispose-arr
            ^:unsynchronized-mutable captured
            ^:unsynchronized-mutable ratomGeneration
            ^:unsynchronized-mutable watchesArr]
     :cljs [f ^:mutable state
            ^:mutable
            ^boolean dirty?
            ^boolean no-cache?
            ^:mutable watching
            ^:mutable watches
            ^:mutable autoRun
            ^:mutable caught
            ^:mutable on-set
            ^:mutable on-dispose
            ^:mutable on-dispose-arr
            ^:mutable captured
            ^:mutable ratomGeneration
            ^:mutable watchesArr])
  #?(:cljs IAtom)
  IReactiveAtom

  #?(:clj IRef :cljs IWatchable)
  #?(:cljs (-notify-watches [this old new] (notify-w this old new))) ; TODO CLJ
  (#?(:clj addWatch    :cljs -add-watch   ) [this key f]        (add-w this key f))
  (#?(:clj removeWatch :cljs -remove-watch) [this key]
    (let [was-empty (empty? watches)]
      (remove-w this key)
      (when (and (not was-empty)
                 (empty? watches)
                 (nil? autoRun))
        (#?(:clj .dispose :cljs dispose) this))))

  #?(:clj IAtom :cljs IReset)
  (#?(:clj reset :cljs -reset!) [a newval]
    (assert (fn? (.-on-set a)) "Reaction is read only.")
    (let [oldval state]
      (set! state newval)
      (on-set oldval newval)
      (notify-w a oldval newval)
      newval))

  #?(:cljs ISwap)
  (#?(:clj swap :cljs -swap!) [a f]          (#?(:clj .reset :cljs -reset!) a (f (.peekAt a))))
  (#?(:clj swap :cljs -swap!) [a f x]        (#?(:clj .reset :cljs -reset!) a (f (.peekAt a) x)))
  (#?(:clj swap :cljs -swap!) [a f x y]      (#?(:clj .reset :cljs -reset!) a (f (.peekAt a) x y)))
  (#?(:clj swap :cljs -swap!) [a f x y more] (#?(:clj .reset :cljs -reset!) a (apply f (.peekAt a) x y more)))

  #?(:clj IReaction :cljs Object)
  (peekAt [this]
    (binding [*ratom-context* nil]
      (#?(:clj .deref :cljs -deref) this)))

  (handleChange [this sender oldval newval]
    (when-not (or (identical? oldval newval)
                  dirty?)
      (if (nil? autoRun)
        (do
          (set! dirty? true)
          (rea-enqueue this))
        (if (true? autoRun)
          (.run this false)
          (autoRun this)))))

  (updateWatching [this derefed]
    (let [new (set derefed)
          old (set watching)]
      (set! watching derefed)
      (doseq [#?(:clj ^IRef w :cljs w) (s/difference new old)]
        (#?(:clj .addWatch :cljs -add-watch) w this handle-reaction-change))
      (doseq [#?(:clj ^IRef w :cljs w) (s/difference old new)]
        (#?(:clj .removeWatch :cljs -remove-watch) w this))))

  (queuedRun [this]
    (when (and dirty? (some? watching))
      (.run this true)))

  (tryCapture [this f]
    (try
      (set! caught nil)
      (deref-capture f this)
      (catch #?(:clj Throwable :cljs :default) e
        (set! state e)
        (set! caught e)
        (set! dirty? false))))

  (run [this check]
    (let [oldstate state
          res (if check
                (.tryCapture this f)
                (deref-capture f this))]
      (when-not no-cache?
        (set! state res)
        ;; Use = to determine equality from reactions, since
        ;; they are likely to produce new data structures.
        (when-not (or (nil? watches)
                      (= oldstate res))
          (notify-w this oldstate res)))
      res))

  (setOpts [this opts]
    (let [auto-run*   (:auto-run   opts)
          on-set*     (:on-set     opts)
          on-dispose* (:on-dispose opts)
          no-cache*   (:no-cache   opts)]
      (when (some? auto-run*)
        (set! autoRun auto-run*))
      (when (some? on-set*)
        (set! on-set on-set*))
      (when (some? on-dispose*)
        (set! on-dispose on-dispose*))
      (when (some? no-cache*)
        (set! no-cache? no-cache*))))

  #?@(:clj
 [(getRatomGeneration [this]   ratomGeneration)
  (setRatomGeneration [this v] (set! ratomGeneration v))
  (getIsDirty         [this]   dirty?)
  (setIsDirty         [this v] (set! dirty? v))
  (getWatching        [this]   watching)
  (setWatching        [this v] (set! watching v))
  (getAutoRun         [this]   autoRun)
  (setAutoRun         [this v] (set! autoRun v))

  IHasF
  (getF               [this]   f)
  (setF               [this v] (set! f v))

  IHasCaptured
  (getCaptured        [this]   captured)
  (setCaptured        [this v] (set! captured v))

  IHasWatches
  (getWatches    [this]   watches)
  (setWatches    [this v] (set! watches v))
  (getWatchesArr [this]   watchesArr)
  (setWatchesArr [this v] (set! watchesArr v))])

  IRunnable
  (run [this]
    (flush!)
    (.run this false))

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (when-some [e caught]
      (throw e))
    (let [non-reactive (nil? *ratom-context*)]
      (when non-reactive
        (flush!))
      (if (and non-reactive (nil? autoRun))
        (when dirty?
          (let [oldstate state]
            (set! state (f))
            (when-not (or (nil? watches) (= oldstate state))
              (notify-w this oldstate state))))
        (do
          (notify-deref-watcher! this)
          (when dirty?
            (.run this false)))))
    state)

  IDisposable
  (dispose [this]
    (let [s state
          wg watching]
      (set! watching nil)
      (set! state    nil)
      (set! autoRun  nil)
      (set! dirty?   true)
      (doseq [#?(:clj ^IRef w :cljs w) (set wg)]
        (#?(:clj .removeWatch :cljs -remove-watch) w this))
      (when (some? on-dispose)
        (on-dispose s))
      (when-some [a on-dispose-arr]
        (dotimes [i (alength* a)]
          ((aget* a i) this)))))
  (addOnDispose [this f]
    ;; f is called with the reaction as argument when it is no longer active
    (if-some [a on-dispose-arr]
      (add! a f)
      (set! on-dispose-arr (array-list f))))

  #?(:clj Object :cljs IEquiv)
  (#?(:clj equals :cljs -equiv) [o other] (identical? o other))

  #?(:cljs IPrintWithWriter)
  #?(:cljs (-pr-writer [a w opts] (pr-atom a w opts (str "Reaction " (hash a) ":"))))

  #?(:cljs IHash)
  #?(:cljs (-hash [this] (goog/getUid this))))

(defn- handle-reaction-change [^Reaction this sender old new]
  (.handleChange this sender old new))

(defn- deref-capture [f ^Reaction r]
  (setf! r captured nil)
  (when (dev?)
    (setf! r ratomGeneration (setm! generation (inc generation))))
  (let [res (in-context r f)
        c (getf r captured)]
    (setf! r #?(:clj isDirty :cljs dirty?) false)
    ;; Optimize common case where derefs occur in same order
    (when-not (#?(:clj = :cljs arr-eq) c (getf r watching))
      (.updateWatching r c))
    res))

(defn make-reaction [f & {:keys [auto-run on-set on-dispose]}]
  (let [reaction (Reaction. f nil true false nil nil nil nil nil nil nil nil nil nil)]
    (.setOpts reaction {:auto-run   auto-run
                        :on-set     on-set
                        :on-dispose on-dispose})
    reaction))

(def ^:private temp-reaction (make-reaction nil))

(defn run-in-reaction [f obj key run opts]
  (let [^Reaction r temp-reaction
        res (deref-capture f r)]
    (when-not (nil? (getf r watching))
      (set! temp-reaction (make-reaction nil))
      (.setOpts r opts)
      (setf! r f f)
      (setf! r autoRun #(run obj))
      (aset* obj key r))
    res))

(defn check-derefs [f]
  (let [#?(:clj  ^IHasCaptured ctx
           :cljs               ctx) (#?(:clj (HasCaptured. nil) :cljs js-obj))
        res (in-context ctx f)]
    [res (some? (getf ctx captured))]))

;;; wrap

#?(:clj
(definterface IWrapper
  (getState    [])
  (setState    [v])
  (getCallback [])
  (getChanged  [])
  (setChanged  [v])))

(deftype Wrapper
  #?(:clj  [^:unsynchronized-mutable state callback
            ^:unsynchronized-mutable changed
            ^:unsynchronized-mutable watches]
     :cljs [^:mutable state callback
            ^:mutable ^boolean changed
            ^:mutable watches])
  #?(:cljs IAtom)

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (when (dev?)
      (when (and changed (some? *ratom-context*))
        (#?(:clj println :cljs warn) "derefing stale wrap: "
              (pr-str this))))
    state)

  #?(:clj IAtom :cljs IReset)
  (#?(:clj reset :cljs -reset!) [this newval]
    (let [oldval state]
      (set! changed true)
      (set! state newval)
      (when (some? watches)
        (notify-w this oldval newval))
      (callback newval)
      newval))

  #?(:cljs ISwap)
  (#?(:clj swap :cljs -swap!) [a f]          (#?(:clj .reset :cljs -reset!) a (f state)))
  (#?(:clj swap :cljs -swap!) [a f x]        (#?(:clj .reset :cljs -reset!) a (f state x)))
  (#?(:clj swap :cljs -swap!) [a f x y]      (#?(:clj .reset :cljs -reset!) a (f state x y)))
  (#?(:clj swap :cljs -swap!) [a f x y more] (#?(:clj .reset :cljs -reset!) a (apply f state x y more)))

  #?(:clj Object :cljs IEquiv)
  (#?(:clj equals :cljs -equiv) [_ other]
    (and (instance? Wrapper other)
         ;; If either of the wrappers have changed, equality
         ;; cannot be relied on.
         (not changed)
         (not (getf ^Wrapper other changed))
         (= state (getf ^Wrapper other state))
         (= callback (getf ^Wrapper other callback))))

  #?(:clj IRef :cljs IWatchable)
  #?(:cljs (-notify-watches [this old new] (notify-w this old new))) ; TODO CLJ
  (#?(:clj addWatch    :cljs -add-watch   ) [this key f] (add-w this key f))
  (#?(:clj removeWatch :cljs -remove-watch) [this key]   (remove-w this key))

  #?(:cljs IPrintWithWriter)
  #?(:cljs (-pr-writer [a w opts] (pr-atom a w opts "Wrap:")))

  #?@(:clj
 [IWrapper
  (getState    [this]   state)
  (setState    [this v] (set! state v))
  (getCallback [this]   callback)
  (getChanged  [this]   changed)
  (setChanged  [this v] (set! changed v))]))

#_(:cljs
(defn make-wrapper [value callback-fn args]
  (Wrapper. value
            (reagent.impl.util/partial-ifn. callback-fn args nil)
            false nil)))

#?(:cljs ; TODO CLJ
(defn rswap!
  "Swaps the value of a to be (apply f current-value-of-atom args).
  rswap! works like swap!, except that recursive calls to rswap! on
  the same atom are allowed – and it always returns nil."
  [a f & args]
  {:pre [(satisfies? IAtom a)
         (ifn? f)]}
  (if a.rswapping
    (-> (or a.rswapfs (set! a.rswapfs (array)))
        (.push #(apply f % args)))
    (do (set! a.rswapping true)
        (try (swap! a (fn [state]
                        (loop [s (apply f state args)]
                          (if-some [sf (some-> a.rswapfs .shift)]
                            (recur (sf s))
                            s))))
             (finally
               (set! a.rswapping false)))))
  nil))

#?(:clj
(defmacro reaction [& body]
  `(make-reaction (fn [] ~@body))))

#?(:clj
(defmacro run!
  "Runs body immediately, and runs again whenever atoms deferenced in the body change. Body should side effect."
  [& body]
  `(let [co# (make-reaction (fn [] ~@body) :auto-run true)]
     (deref co#)
     co#)))

#?(:clj
(defmacro with-let [bindings & body]
  (assert (vector? bindings))
  (let [v (gensym "with-let")
        k (keyword v)
        init (gensym "init")
        bs (into [init `(zero? (alength* ~v))]
                 (map-indexed (fn [^long i x]
                                (if (even? i)
                                  x
                                  (let [j (quot i 2)]
                                    `(if ~init
                                       (aset* ~v ~j ~x)
                                       (aget* ~v ~j)))))
                              bindings))
        [forms destroy-] (let [fin (last body)]
                           (if (and (list? fin)
                                    (= 'finally (first fin)))
                             [(butlast body) `(fn [] ~@(rest fin))]
                             [body nil]))
        add-destroy (when destroy-
                      `(let [destroy# ~destroy-]
                         (if (reactive?)
                           (when (nil? (getf ~v destroy))
                             (setf! ~v destroy destroy#))
                           (destroy#))))
        asserting (if *assert* true false)]
    `(let [~v (with-let-values ~k)]
       (when ~asserting
         (when-some [c# *ratom-context*]
           (when (== (getf ~v generation) (getf c# ratomGeneration))
             (~(if-cljs &env 'd/error 'println)
               "Warning: The same with-let is being used more "
               "than once in the same reactive context."))
           (setf! ~v generation (getf c# ratomGeneration))))
       (let ~bs
         (let [res# (do ~@forms)]
           ~add-destroy
           res#))))))
