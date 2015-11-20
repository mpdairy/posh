// Compiled by ClojureScript 1.7.170 {}
goog.provide('datascript.lru');
goog.require('cljs.core');
datascript.lru.assoc_lru;

datascript.lru.cleanup_lru;

/**
* @constructor
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.ILookup}
*/
datascript.lru.LRU = (function (key_value,gen_key,key_gen,gen,limit){
this.key_value = key_value;
this.gen_key = gen_key;
this.key_gen = key_gen;
this.gen = gen;
this.limit = limit;
this.cljs$lang$protocol_mask$partition0$ = 2147484416;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
datascript.lru.LRU.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this$,k,v){
var self__ = this;
var this$__$1 = this;
return datascript.lru.assoc_lru.call(null,this$__$1,k,v);
});

datascript.lru.LRU.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (_,k){
var self__ = this;
var ___$1 = this;
return cljs.core._contains_key_QMARK_.call(null,self__.key_value,k);
});

datascript.lru.LRU.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (_,k){
var self__ = this;
var ___$1 = this;
return cljs.core._lookup.call(null,self__.key_value,k,null);
});

datascript.lru.LRU.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (_,k,nf){
var self__ = this;
var ___$1 = this;
return cljs.core._lookup.call(null,self__.key_value,k,nf);
});

datascript.lru.LRU.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (_,writer,opts){
var self__ = this;
var ___$1 = this;
return cljs.core._pr_writer.call(null,cljs.core.persistent_BANG_.call(null,self__.key_value),writer,opts);
});

datascript.lru.LRU.getBasis = (function (){
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"key-value","key-value",1605624688,null),new cljs.core.Symbol(null,"gen-key","gen-key",392707442,null),new cljs.core.Symbol(null,"key-gen","key-gen",415199034,null),new cljs.core.Symbol(null,"gen","gen",1783106829,null),new cljs.core.Symbol(null,"limit","limit",284709164,null)], null);
});

datascript.lru.LRU.cljs$lang$type = true;

datascript.lru.LRU.cljs$lang$ctorStr = "datascript.lru/LRU";

datascript.lru.LRU.cljs$lang$ctorPrWriter = (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"datascript.lru/LRU");
});

datascript.lru.__GT_LRU = (function datascript$lru$__GT_LRU(key_value,gen_key,key_gen,gen,limit){
return (new datascript.lru.LRU(key_value,gen_key,key_gen,gen,limit));
});

datascript.lru.assoc_lru = (function datascript$lru$assoc_lru(lru,k,v){
var key_value = lru.key_value;
var gen_key = lru.gen_key;
var key_gen = lru.key_gen;
var gen = lru.gen;
var limit = lru.limit;
var temp__4423__auto__ = key_gen.call(null,k,null);
if(cljs.core.truth_(temp__4423__auto__)){
var g = temp__4423__auto__;
return datascript.lru.__GT_LRU.call(null,key_value,cljs.core.assoc.call(null,cljs.core.dissoc.call(null,gen_key,g),gen,k),cljs.core.assoc.call(null,key_gen,k,gen),(gen + (1)),limit);
} else {
return datascript.lru.cleanup_lru.call(null,datascript.lru.__GT_LRU.call(null,cljs.core.assoc.call(null,key_value,k,v),cljs.core.assoc.call(null,gen_key,gen,k),cljs.core.assoc.call(null,key_gen,k,gen),(gen + (1)),limit));
}
});
datascript.lru.cleanup_lru = (function datascript$lru$cleanup_lru(lru){
if((cljs.core.count.call(null,lru.key_value) > lru.limit)){
var key_value = lru.key_value;
var gen_key = lru.gen_key;
var key_gen = lru.key_gen;
var gen = lru.gen;
var limit = lru.limit;
var vec__21411 = cljs.core.first.call(null,gen_key);
var g = cljs.core.nth.call(null,vec__21411,(0),null);
var k = cljs.core.nth.call(null,vec__21411,(1),null);
return datascript.lru.__GT_LRU.call(null,cljs.core.dissoc.call(null,key_value,k),cljs.core.dissoc.call(null,gen_key,g),cljs.core.dissoc.call(null,key_gen,k),gen,limit);
} else {
return lru;
}
});
datascript.lru.lru = (function datascript$lru$lru(limit){
return datascript.lru.__GT_LRU.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.sorted_map.call(null),cljs.core.PersistentArrayMap.EMPTY,(0),limit);
});

//# sourceMappingURL=lru.js.map