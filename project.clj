(defproject posh "0.5.7"
  :description "Luxuriously easy and powerful Reagent / Datascript front-end framework"
  :url "http://github.com/mpdairy/posh/"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.228"]
                 #_[datascript "0.15.0"]
                 #_[com.datomic/datomic-free "0.9.5407"]
                 [org.clojure/core.match "0.3.0-alpha4"]]
  :plugins [[lein-cljsbuild "1.1.3"]]
  :cljsbuild {
              :builds [ {:id "posh"
                         :source-paths ["src/"]
                         :figwheel false
                         :compiler {:main "posh.core"
                                    :asset-path "js"
                                    :output-to "resources/public/js/main.js"
                                    :output-dir "resources/public/js"}}]}

  :scm {:name "git"
        :url "https://github.com/mpdairy/posh"})
