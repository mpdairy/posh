// Compiled by ClojureScript 1.7.170 {}
goog.provide('figwheel.client.utils');
goog.require('cljs.core');
goog.require('clojure.string');
figwheel.client.utils._STAR_print_debug_STAR_ = false;
figwheel.client.utils.html_env_QMARK_ = (function figwheel$client$utils$html_env_QMARK_(){
return goog.inHtmlDocument_();
});
figwheel.client.utils.node_env_QMARK_ = (function figwheel$client$utils$node_env_QMARK_(){
return !((goog.nodeGlobalRequire == null));
});
figwheel.client.utils.host_env_QMARK_ = (function figwheel$client$utils$host_env_QMARK_(){
if(cljs.core.truth_(figwheel.client.utils.node_env_QMARK_.call(null))){
return new cljs.core.Keyword(null,"node","node",581201198);
} else {
return new cljs.core.Keyword(null,"html","html",-998796897);
}
});
figwheel.client.utils.base_url_path = (function figwheel$client$utils$base_url_path(){
return clojure.string.replace.call(null,goog.basePath,/(.*)goog\//,"$1");
});
figwheel.client.utils.dispatch_custom_event = (function figwheel$client$utils$dispatch_custom_event(event_name,data){
if(cljs.core.truth_((function (){var and__16720__auto__ = figwheel.client.utils.html_env_QMARK_.call(null);
if(cljs.core.truth_(and__16720__auto__)){
return (window["CustomEvent"]);
} else {
return and__16720__auto__;
}
})())){
return document.body.dispatchEvent((new CustomEvent(event_name,(function (){var obj26049 = {"detail":data};
return obj26049;
})())));
} else {
return null;
}
});
figwheel.client.utils.debug_prn = (function figwheel$client$utils$debug_prn(o){
if(cljs.core.truth_(figwheel.client.utils._STAR_print_debug_STAR_)){
var o__$1 = (((cljs.core.map_QMARK_.call(null,o)) || (cljs.core.seq_QMARK_.call(null,o)))?cljs.core.prn_str.call(null,o):o);
return console.log(o__$1);
} else {
return null;
}
});
figwheel.client.utils.log = (function figwheel$client$utils$log(var_args){
var args26054 = [];
var len__17790__auto___26060 = arguments.length;
var i__17791__auto___26061 = (0);
while(true){
if((i__17791__auto___26061 < len__17790__auto___26060)){
args26054.push((arguments[i__17791__auto___26061]));

var G__26062 = (i__17791__auto___26061 + (1));
i__17791__auto___26061 = G__26062;
continue;
} else {
}
break;
}

var G__26056 = args26054.length;
switch (G__26056) {
case 1:
return figwheel.client.utils.log.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return figwheel.client.utils.log.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args26054.length)].join('')));

}
});

figwheel.client.utils.log.cljs$core$IFn$_invoke$arity$1 = (function (x){
return figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"info","info",-317069002),x);
});

figwheel.client.utils.log.cljs$core$IFn$_invoke$arity$2 = (function (level,arg){
var f = (function (){var pred__26057 = cljs.core._EQ_;
var expr__26058 = (cljs.core.truth_(figwheel.client.utils.html_env_QMARK_.call(null))?level:new cljs.core.Keyword(null,"info","info",-317069002));
if(cljs.core.truth_(pred__26057.call(null,new cljs.core.Keyword(null,"warn","warn",-436710552),expr__26058))){
return ((function (pred__26057,expr__26058){
return (function (p1__26050_SHARP_){
return console.warn(p1__26050_SHARP_);
});
;})(pred__26057,expr__26058))
} else {
if(cljs.core.truth_(pred__26057.call(null,new cljs.core.Keyword(null,"debug","debug",-1608172596),expr__26058))){
return ((function (pred__26057,expr__26058){
return (function (p1__26051_SHARP_){
return console.debug(p1__26051_SHARP_);
});
;})(pred__26057,expr__26058))
} else {
if(cljs.core.truth_(pred__26057.call(null,new cljs.core.Keyword(null,"error","error",-978969032),expr__26058))){
return ((function (pred__26057,expr__26058){
return (function (p1__26052_SHARP_){
return console.error(p1__26052_SHARP_);
});
;})(pred__26057,expr__26058))
} else {
return ((function (pred__26057,expr__26058){
return (function (p1__26053_SHARP_){
return console.log(p1__26053_SHARP_);
});
;})(pred__26057,expr__26058))
}
}
}
})();
return f.call(null,arg);
});

figwheel.client.utils.log.cljs$lang$maxFixedArity = 2;
figwheel.client.utils.eval_helper = (function figwheel$client$utils$eval_helper(code,p__26064){
var map__26067 = p__26064;
var map__26067__$1 = ((((!((map__26067 == null)))?((((map__26067.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26067.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26067):map__26067);
var opts = map__26067__$1;
var eval_fn = cljs.core.get.call(null,map__26067__$1,new cljs.core.Keyword(null,"eval-fn","eval-fn",-1111644294));
if(cljs.core.truth_(eval_fn)){
return eval_fn.call(null,code,opts);
} else {
return eval(code);
}
});

//# sourceMappingURL=utils.js.map