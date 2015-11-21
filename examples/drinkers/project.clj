(defproject drinkers "0.1.0-SNAPSHOT"
  :description "An example using Posh"
  :url "http://github.com/mpdairy/posh/"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.170"]
                 [reagent "0.5.1"]
                 [posh "0.2.2"]
                 [figwheel-sidecar "0.5.0-SNAPSHOT" :scope "test"]
                 [datascript "0.13.3"]]
  :plugins [[lein-cljsbuild "1.1.1"]])
