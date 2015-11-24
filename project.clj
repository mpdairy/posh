(defproject posh "0.3.2"
  :description "Luxuriously easy and powerful Reagant / Datascript front-end framework"
  :url "http://github.com/mpdairy/posh/"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.170"]
                 [reagent "0.5.1"]
                 [datascript "0.13.3"]
                 ;;[figwheel-sidecar "0.5.0-SNAPSHOT" :scope "test"]
                 ]
  :plugins [[lein-cljsbuild "1.1.1"]]
  :cljsbuild {
              :builds [ {:id "posh" 
                         :source-paths ["src/"]
                         :figwheel true
                         :compiler {  :main "posh.core"
                                    :asset-path "js"
                                    :output-to "resources/public/js/main.js"
                                    :output-dir "resources/public/js"} } ]
              }
  :scm {:name "git"
        :url "https://github.com/mpdairy/posh"})
