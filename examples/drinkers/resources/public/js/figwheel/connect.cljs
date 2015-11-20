(ns figwheel.connect (:require [figwheel.client] [posh.example] [figwheel.client.utils]))
(figwheel.client/start {:build-id "dev", :websocket-url "ws://localhost:3449/figwheel-ws"})

