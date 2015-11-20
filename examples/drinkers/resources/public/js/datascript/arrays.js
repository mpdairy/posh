// Compiled by ClojureScript 1.7.170 {}
goog.provide('datascript.arrays');
goog.require('cljs.core');
goog.require('clojure.string');
datascript.arrays.if_cljs = (function datascript$arrays$if_cljs(env,then,else$){
if(cljs.core.truth_(new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(env))){
return then;
} else {
return else$;
}
});
datascript.arrays.make_array = cljs.core.make_array;
datascript.arrays.into_array = cljs.core.into_array;
datascript.arrays.aclone = (function datascript$arrays$aclone(from){
return from.slice((0));
});
datascript.arrays.aconcat = (function datascript$arrays$aconcat(a,b){
return a.concat(b);
});
datascript.arrays.amap = (function datascript$arrays$amap(f,arr){
return arr.map(f);
});
datascript.arrays.asort = (function datascript$arrays$asort(arr,cmp){
return arr.sort(cmp);
});
datascript.arrays.array_QMARK_ = cljs.core.array_QMARK_;

//# sourceMappingURL=arrays.js.map