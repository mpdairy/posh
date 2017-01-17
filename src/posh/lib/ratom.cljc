(ns posh.lib.ratom
  "Ported to .cljc from reagent.ratom by alexandergunnarson."
           (:refer-clojure :exclude [atom run!])
           (:require        [#?(:clj  clojure.core
                                :cljs cljs.core) :as core]
                            [clojure.set  :as s]
                            [posh.lib.util
                              :refer [#?(:clj if-cljs)]])
  #?(:cljs (:require-macros [posh.lib.ratom
                              :refer [getm setm! getum setum! getf setf! add! array-list alength* aset* aget* umut run!]]))
  #?(:clj  (:import         [java.util ArrayList]
                            [clojure.lang IDeref IAtom IRef IMeta IHashEq])))

; According to `posh.lib.ratom-test/ratom-perf`,
; the unsynchronized-mutable CLJ version takes ~177.315377 ms, while
; the clojure.core/atom version takes ~345.78108 ms

; If you want to use mutability here, you need to make sure all transacts (really, listener updates)
; and all derefs are on the same thread. Changing the appropriate macros from atomic to mutable (or
; vice versa) is pretty easy — much more so than changing all the places where the macro affects.

;;; Misc utils

(defn upper-first [s] (apply str (.toUpperCase (str (first s))) (rest s)))

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

#?(:clj (defmacro mut "Mutable" [x] #_`(Mutable. ~x)
                                   `(clojure.core/atom ~x)))

#?(:clj (defmacro umut "Unsynchronized mutable" [x]
          (if-cljs &env x `(clojure.core/atom ~x))))

#?(:clj
(defmacro getm
  "Get mutable"
  [x]
  (if-cljs &env x
                #_`(.get ~(with-meta x {:tag 'posh.lib.ratom.Mutable}))
                `(deref ~x))))

#?(:clj
(defmacro setm!
  "Set mutable"
  [x v]
  (if-cljs &env `(set!            ~x                                        ~v)
                #_`(.set ~(with-meta x {:tag 'posh.lib.ratom.Mutable}) ~v)
                `(reset! ~x ~v))))

#?(:clj
(defmacro getum
  "Get unsynchronized-mutable"
  [x]
  (if-cljs &env x
                #_x
                `(deref ~x))))

#?(:clj
(defmacro getum*
  "Get unsynchronized-mutable, handling nil"
  [x]
  (if-cljs &env x
                #_x
                `(let [x# ~x] (if (nil? x#) x# (deref x#))))))

#?(:clj
(defmacro setum!
  "Set unsynchronized-mutable"
  [x v]
  (if-cljs &env `(set!   ~x ~v)
                #_`(set! ~x ~v)
                `(reset! ~x ~v))))

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
                #_`(.add ~(with-meta x {:tag 'java.util.ArrayList}) ~v)
                `(swap! ~x conj ~v))))

#?(:clj
(defmacro array-list [& args]
  (if-cljs &env `(array ~@args)
                #_`(doto (ArrayList.) ~@(for [arg args] `(.add ~arg)))
                `(clojure.core/atom [~@args]))))

#?(:clj
(defmacro alength* [x]
  (if-cljs &env `(alength ~x)
                #_`(.size ~(with-meta x {:tag 'java.util.ArrayList}))
                `(count (deref ~x)))))

#?(:clj
(defmacro aget* [x i]
  (if-cljs &env `(aget ~x)
                #_`(.get ~(with-meta x {:tag 'java.util.ArrayList}) ~i)
                `(get (deref ~x) ~i))))

#?(:clj
(defmacro aset* [x i v]
  (if-cljs &env `(aset ~x ~i ~v)
                #_`(.set ~(with-meta x {:tag 'java.util.ArrayList}) ~i ~v)
                `(swap! ~x assoc ~i ~v))))

;;; Interfaces and (certain) types

#?(:clj
(definterface IHasCaptured
  (getCaptured [])
  (setCaptured [v])))

#?(:clj
(deftype HasCaptured
  [^:mutable captured]
  IHasCaptured
  (getCaptured [this] (getum captured))
  (setCaptured [this v] (setum! captured v))))

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
                 (reduce-kv #(doto %1 (add! %2) (add! %3)) (array-list))
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
  (let [x (getm rea-queue)] (add! x r))) ; For anti-reflection

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
  [^:mutable state
   meta
   validator
   ^:mutable watches
   ^:mutable watchesArr]
  #?(:cljs IAtom)
  IReactiveAtom

  #?(:clj Object :cljs IEquiv)
  (#?(:clj equals :cljs -equiv) [o other] (identical? o other))

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (notify-deref-watcher! this)
    (getum state))

  #?(:clj IAtom :cljs IReset)
  (#?(:clj reset :cljs -reset!) [a new-value]
    (when-not (nil? validator)
      (assert (validator new-value) "Validator rejected reference state"))
    (let [old-value state]
      (setum! state new-value)
      (when-not (nil? (getum watches))
        (notify-w a old-value new-value))
      new-value))

  #?(:cljs ISwap)
  (#?(:clj swap :cljs -swap!) [a f]          (#?(:clj .reset :cljs -reset!) a (f (getum state))))
  (#?(:clj swap :cljs -swap!) [a f x]        (#?(:clj .reset :cljs -reset!) a (f (getum state) x)))
  (#?(:clj swap :cljs -swap!) [a f x y]      (#?(:clj .reset :cljs -reset!) a (f (getum state) x y)))
  (#?(:clj swap :cljs -swap!) [a f x y more] (#?(:clj .reset :cljs -reset!) a (apply f (getum state) x y more)))

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
  (getWatches    [this]   (getum watches))
  (setWatches    [this v] (setum! watches v))
  (getWatchesArr [this]   (getum watchesArr))
  (setWatchesArr [this v] (setum! watchesArr v))]))

(defn atom
  "Like clojure.core/atom, except that it keeps track of derefs."
  ([x] (RAtom. (umut x) nil nil (umut nil) (umut nil)))
  ([x & {:keys [meta validator]}] (RAtom. (umut x) meta validator (umut nil) (umut nil))))

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
  [^:mutable f args ; Note: `f` is not marked mutable in Reagent but is nonetheless mutable
   ^:mutable reaction]
  IReactiveAtom

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (if-some [^IDeref r (getum reaction)]
      (#?(:clj .deref :cljs -deref) r)
      (cached-reaction #(apply (getum f) args) (getum f) args this nil)))

  #?(:clj Object :cljs IEquiv)
  (#?(:clj equals :cljs -equiv) [_ other]
    (and (instance? Track other)
         (= (getum f) (getf ^Track other f))
         (= args (getf ^Track other args))))

  #?(:clj IHashEq :cljs IHash)
  (#?(:clj hasheq :cljs -hash) [_] (hash [(getum f) args]))

  #?(:cljs IPrintWithWriter)
  #?(:cljs (-pr-writer [a w opts] (pr-atom a w opts "Track:")))

  #?@(:clj
 [IHasF
  (getF    [this]   (getum f))
  (setF    [this v] (setum! f v))

  ITrack
  (getArgs [this]   args)]))

(defn make-track [f args]
  (Track. (umut f) args (umut nil)))

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
  [ratom path
   ^:mutable reaction
   ^:mutable state
   ^:mutable watches]
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
      (setum! state newstate)
      (when (some? (getum watches))
        (notify-w this oldstate newstate))))

  #?@(:clj
  [(getPath  [this] path)
   (getRatom [this] ratom)])

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (let [oldstate (getum state)
          newstate (if-some [^IDeref r (getum reaction)]
                     (#?(:clj .deref :cljs -deref) r)
                     (let [f (if (satisfies? IDeref ratom)
                               #(get-in @ratom path)
                               #(ratom path))]
                       (cached-reaction f ratom path this nil)))]
      (.setState this oldstate newstate)
      newstate))

  #?(:clj IAtom :cljs IReset)
  (#?(:clj reset :cljs -reset!) [this new-value]
    (let [oldstate (getum state)]
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
  (RCursor. src path (umut nil) (umut nil) (umut nil)))

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
  ; Note: `f`, `dirty?`, and `no-cache?` are not marked mutable in Reagent but are nonetheless mutable
  [^:mutable f
   ^:mutable state
   #?(:clj ^:mutable dirty?
      :cljs ^:mutable ^boolean dirty?)
   #?(:clj ^:mutable no-cache?
      :cljs ^:mutable ^boolean no-cache?)
   ^:mutable watching
   ^:mutable watches
   ^:mutable autoRun
   ^:mutable caught
   ^:mutable on-set
   ^:mutable on-dispose
   ^:mutable on-dispose-arr
   ^:mutable captured
   ^:mutable ratomGeneration
   ^:mutable watchesArr]
  #?(:cljs IAtom)
  IReactiveAtom

  #?(:clj IRef :cljs IWatchable)
  #?(:cljs (-notify-watches [this old new] (notify-w this old new))) ; TODO CLJ
  (#?(:clj addWatch    :cljs -add-watch   ) [this key f]        (add-w this key f))
  (#?(:clj removeWatch :cljs -remove-watch) [this key]
    (let [was-empty (empty? (getum watches))]
      (remove-w this key)
      (when (and (not was-empty)
                 (empty? (getum watches))
                 (nil? (getum autoRun)))
        (#?(:clj .dispose :cljs dispose) this))))

  #?(:clj IAtom :cljs IReset)
  (#?(:clj reset :cljs -reset!) [a newval]
    (assert (fn? (getum on-set)) "Reaction is read only.")
    (let [oldval (getum state)]
      (setum! state newval)
      ((getum on-set) oldval newval)
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
                  (getum dirty?))
      (if (nil? (getum autoRun))
        (do
          (setum! dirty? true)
          (rea-enqueue this))
        (if (true? (getum autoRun))
          (.run this false)
          ((getum autoRun) this)))))

  (updateWatching [this derefed]
    (let [new (set derefed)
          old (set (getum watching))]
      (setum! watching derefed)
      (doseq [#?(:clj ^IRef w :cljs w) (s/difference new old)]
        (#?(:clj .addWatch :cljs -add-watch) w this handle-reaction-change))
      (doseq [#?(:clj ^IRef w :cljs w) (s/difference old new)]
        (#?(:clj .removeWatch :cljs -remove-watch) w this))))

  (queuedRun [this]
    (when (and (getum dirty?) (some? (getum watching)))
      (.run this true)))

  (tryCapture [this f]
    (try
      (setum! caught nil)
      (deref-capture f this)
      (catch #?(:clj Throwable :cljs :default) e
        (setum! state e)
        (setum! caught e)
        (setum! dirty? false))))

  (run [this check]
    (let [oldstate (getum state)
          res (if check
                (.tryCapture this (getum f))
                (deref-capture (getum f) this))]
      (when-not (getum no-cache?)
        (setum! state res)
        ;; Use = to determine equality from reactions, since
        ;; they are likely to produce new data structures.
        (when-not (or (nil? (getum watches))
                      (= oldstate res))
          (notify-w this oldstate res)))
      res))

  (setOpts [this opts]
    (let [auto-run*   (:auto-run   opts)
          on-set*     (:on-set     opts)
          on-dispose* (:on-dispose opts)
          no-cache*   (:no-cache   opts)]
      (when (some? auto-run*)
        (setum! autoRun auto-run*))
      (when (some? on-set*)
        (setum! on-set on-set*))
      (when (some? on-dispose*)
        (setum! on-dispose on-dispose*))
      (when (some? no-cache*)
        (setum! no-cache? no-cache*))))

  #?@(:clj
 [(getRatomGeneration [this]   (getum ratomGeneration))
  (setRatomGeneration [this v] (setum! ratomGeneration v))
  (getIsDirty         [this]   (getum dirty?))
  (setIsDirty         [this v] (setum! dirty? v))
  (getWatching        [this]   (getum watching))
  (setWatching        [this v] (setum! watching v))
  (getAutoRun         [this]   (getum autoRun))
  (setAutoRun         [this v] (setum! autoRun v))

  IHasF
  (getF               [this]   (getum f))
  (setF               [this v] (setum! f v))

  IHasCaptured
  (getCaptured        [this]   (getum captured))
  (setCaptured        [this v] (setum! captured v))

  IHasWatches
  (getWatches    [this]   (getum watches))
  (setWatches    [this v] (setum! watches v))
  (getWatchesArr [this]   (getum watchesArr))
  (setWatchesArr [this v] (setum! watchesArr v))])

  IRunnable
  (run [this]
    (flush!)
    (.run this false))

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (when-some [e (getum caught)]
      (throw e))
    (let [non-reactive (nil? *ratom-context*)]
      (when non-reactive
        (flush!))
      (if (and non-reactive (nil? (getum autoRun)))
        (when (getum dirty?)
          (let [oldstate (getum state)]
            (setum! state ((getum f)))
            (when-not (or (nil? (getum watches)) (= oldstate (getum state)))
              (notify-w this oldstate (getum state)))))
        (do
          (notify-deref-watcher! this)
          (when (getum dirty?)
            (.run this false)))))
    (getum state))

  IDisposable
  (dispose [this]
    (let [s (getum state)
          wg (getum watching)]
      (setum! watching nil)
      (setum! state    nil)
      (setum! autoRun  nil)
      (setum! dirty?   true)
      (doseq [#?(:clj ^IRef w :cljs w) (set wg)]
        (#?(:clj .removeWatch :cljs -remove-watch) w this))
      (when (some? (getum on-dispose))
        ((getum on-dispose) s))
      (when-some [a (getum on-dispose-arr)]
        (dotimes [i (alength* a)]
          ((aget* a i) this)))))
  (addOnDispose [this f]
    ;; f is called with the reaction as argument when it is no longer active
    (if-some [a (getum on-dispose-arr)]
      (add! a f)
      (setum! on-dispose-arr (array-list f))))

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
        c   (getum* (getf r captured))] ; `getum*` because it'll be an `array-list`
    (setf! r #?(:clj isDirty :cljs dirty?) false)
    ;; Optimize common case where derefs occur in same order
    (when-not (#?(:clj = :cljs arr-eq) c (getf r watching))
      (.updateWatching r c))
    res))

(defn make-reaction [f & {:keys [auto-run on-set on-dispose]}]
  (let [reaction (Reaction. (umut f  ) (umut nil) (umut true) (umut false) (umut nil) (umut nil)
                            (umut nil) (umut nil) (umut nil ) (umut nil  ) (umut nil) (umut nil)
                            (umut nil) (umut nil))]
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
  [^:mutable state callback
   #?(:clj  ^:mutable changed
      :cljs ^:mutable ^boolean changed)
   ^:mutable watches]
  #?(:cljs IAtom)

  IDeref
  (#?(:clj deref :cljs -deref) [this]
    (when (dev?)
      (when (and (getum changed) (some? *ratom-context*))
        (#?(:clj println :cljs warn) "derefing stale wrap: "
              (pr-str this))))
    (getum state))

  #?(:clj IAtom :cljs IReset)
  (#?(:clj reset :cljs -reset!) [this newval]
    (let [oldval (getum state)]
      (setum! changed true)
      (setum! state newval)
      (when (some? (getum watches))
        (notify-w this oldval newval))
      (callback newval)
      newval))

  #?(:cljs ISwap)
  (#?(:clj swap :cljs -swap!) [a f]          (#?(:clj .reset :cljs -reset!) a (f (getum state))))
  (#?(:clj swap :cljs -swap!) [a f x]        (#?(:clj .reset :cljs -reset!) a (f (getum state) x)))
  (#?(:clj swap :cljs -swap!) [a f x y]      (#?(:clj .reset :cljs -reset!) a (f (getum state) x y)))
  (#?(:clj swap :cljs -swap!) [a f x y more] (#?(:clj .reset :cljs -reset!) a (apply f (getum state) x y more)))

  #?(:clj Object :cljs IEquiv)
  (#?(:clj equals :cljs -equiv) [_ other]
    (and (instance? Wrapper other)
         ;; If either of the wrappers have changed, equality
         ;; cannot be relied on.
         (not (getum changed))
         (not (getf ^Wrapper other changed))
         (= (getum state) (getf ^Wrapper other state))
         (= callback (getf ^Wrapper other callback))))

  #?(:clj IRef :cljs IWatchable)
  #?(:cljs (-notify-watches [this old new] (notify-w this old new))) ; TODO CLJ
  (#?(:clj addWatch    :cljs -add-watch   ) [this key f] (add-w this key f))
  (#?(:clj removeWatch :cljs -remove-watch) [this key]   (remove-w this key))

  #?(:cljs IPrintWithWriter)
  #?(:cljs (-pr-writer [a w opts] (pr-atom a w opts "Wrap:")))

  #?@(:clj
 [IWrapper
  (getState    [this]   (getum state))
  (setState    [this v] (setum! state v))
  (getCallback [this]   callback)
  (getChanged  [this]   (getum changed))
  (setChanged  [this v] (setum! changed v))]))

(deftype PartialIFn [f args ^:mutable p]
  #?(:clj clojure.lang.IFn :cljs IFn)
  (#?(:clj invoke :cljs -invoke) [_ & a]
    (or p (setum! p (apply core/partial f args)))
    (apply p a))
  #?(:clj Object :cljs IEquiv)
  (#?(:clj equals :cljs -equiv) [_ other]
    (and (= f (.-f ^PartialIFn other)) (= args (.-args ^PartialIFn other))))
  #?(:clj IHashEq :cljs IHash)
  (#?(:clj hasheq :cljs -hash) [_] (hash [f args])))

(defn make-wrapper
  ([value callback-fn]
    (Wrapper. (umut value)
              callback-fn
              (umut false) (umut nil)))
  ([value callback-fn args]
    (Wrapper. (umut value)
              (PartialIFn. callback-fn args (umut nil))
              (umut false) (umut nil))))

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
(defmacro reaction [& body] `(make-reaction (fn [] ~@body))))

#?(:clj
(defmacro run!
  "Runs body immediately, and runs again whenever atoms deferenced in the body change. Body should side effect."
  [& body]
  `(let [co# (make-reaction (fn [] ~@body) :auto-run true)]
     (deref co#)
     co#)))

(defn add-eager-watch [r k f]
  (let [deref-times (atom 0)
        f' (fn [k a oldv newv]
             (when (> #?(:clj  (long @deref-times)
                         :cljs @deref-times) 0)
               (f k a oldv newv)))]
    (run! @r (swap! deref-times inc)) ; TODO deregister when `remove-watch`
    (add-watch r k f')))

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
