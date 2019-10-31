(defproject denistakeda/posh "0.5.8"
  :description "Luxuriously easy and powerful Reagent / Datascript front-end framework"
  :url "http://github.com/denistakeda/posh/"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.10.1" :scope "provided"]
                 [org.clojure/clojurescript "1.10.520" :scope "provided"]
                 #_[datascript "0.18.7"]
                 #_[com.datomic/datomic-free "0.9.5407"]
                 [org.clojure/core.match "0.3.0"]]
  :plugins [[lein-cljsbuild "1.1.3"]]
  :profiles {:dev {:plugins [[lein-githooks "0.1.0"]]
                   :githooks {:auto-install true
                              :pre-push ["lein kaocha"]}}
             :test {:dependencies [[datascript "0.18.6"]
                                   [reagent "0.9.0-rc2"]
                                   [org.clojure/clojure "1.10.1"]
                                   [org.clojure/clojurescript "1.10.520"]]}
             :kaocha {:dependencies [[lambdaisland/kaocha "0.0-554"]
                                     [datascript "0.18.6"]
                                     [com.datomic/datomic-free "0.9.5407"]
                                     [reagent "0.9.0-rc2"]
                                     [org.clojure/clojure "1.10.1"]
                                     [org.clojure/clojurescript "1.10.520"]
                                     [org.clojure/test.check "0.9.0"]
                                     ]}}
  :cljsbuild {:builds [ {:id "posh"
                         :source-paths ["src/"]
                         :figwheel false
                         :compiler {:main "posh.core"
                                    :asset-path "js"
                                    :output-to "resources/public/js/main.js"
                                    :output-dir "resources/public/js"} } ]}
  :scm {:name "git"
        :url "https://github.com/denistakeda/posh"}
  :aliases {"kaocha" ["with-profile" "+kaocha" "run" "-m" "kaocha.runner"]})
