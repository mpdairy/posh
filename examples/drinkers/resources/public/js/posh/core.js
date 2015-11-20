// Compiled by ClojureScript 1.7.170 {}
goog.provide('posh.core');
goog.require('cljs.core');
goog.require('goog.dom');
goog.require('reagent.core');
goog.require('datascript.core');
goog.require('posh.tx_match');
posh.core.posh_conn = cljs.core.atom.call(null,datascript.core.create_conn.call(null));
if(typeof posh.core.last_tx_report !== 'undefined'){
} else {
posh.core.last_tx_report = reagent.core.atom.call(null,cljs.core.PersistentVector.EMPTY);
}
posh.core.newly_registered_tx_listeners = cljs.core.atom.call(null,cljs.core.PersistentVector.EMPTY);
posh.core.tx_listeners;
posh.core.try_tx_listener;
posh.core.setup = (function posh$core$setup(uconn){
cljs.core.reset_BANG_.call(null,posh.core.tx_listeners,cljs.core.deref.call(null,posh.core.newly_registered_tx_listeners));

cljs.core.reset_BANG_.call(null,posh.core.newly_registered_tx_listeners,cljs.core.PersistentVector.EMPTY);

cljs.core.reset_BANG_.call(null,posh.core.posh_conn,uconn);

return datascript.core.listen_BANG_.call(null,cljs.core.deref.call(null,posh.core.posh_conn),new cljs.core.Keyword(null,"history","history",-247395220),(function (tx_report){
cljs.core.doall.call(null,cljs.core.map.call(null,cljs.core.partial.call(null,posh.core.try_tx_listener,tx_report),cljs.core.deref.call(null,posh.core.tx_listeners)));

return cljs.core.reset_BANG_.call(null,posh.core.last_tx_report,tx_report);
}));
});
posh.core.transact = (function posh$core$transact(tx){
return cljs.core.partial.call(null,datascript.core.transact_BANG_,cljs.core.deref.call(null,posh.core.posh_conn)).call(null,tx);
});
posh.core.established_reactions = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
posh.core.db_tx = (function posh$core$db_tx(var_args){
var args22285 = [];
var len__17790__auto___22288 = arguments.length;
var i__17791__auto___22289 = (0);
while(true){
if((i__17791__auto___22289 < len__17790__auto___22288)){
args22285.push((arguments[i__17791__auto___22289]));

var G__22290 = (i__17791__auto___22289 + (1));
i__17791__auto___22289 = G__22290;
continue;
} else {
}
break;
}

var G__22287 = args22285.length;
switch (G__22287) {
case 1:
return posh.core.db_tx.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return posh.core.db_tx.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22285.length)].join('')));

}
});

posh.core.db_tx.cljs$core$IFn$_invoke$arity$1 = (function (patterns){
return posh.core.db_tx.call(null,patterns,null);
});

posh.core.db_tx.cljs$core$IFn$_invoke$arity$2 = (function (patterns,query){
var temp__4423__auto__ = cljs.core.deref.call(null,posh.core.established_reactions).call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [patterns,query], null));
if(cljs.core.truth_(temp__4423__auto__)){
var r = temp__4423__auto__;
return r;
} else {
var new_reaction = (function (){var saved_db = cljs.core.atom.call(null,datascript.core.db.call(null,cljs.core.deref.call(null,posh.core.posh_conn)));
return reagent.ratom.make_reaction.call(null,((function (saved_db,temp__4423__auto__){
return (function (){
if(cljs.core.truth_(posh.tx_match.tx_match_QMARK_.call(null,cljs.core.deref.call(null,saved_db),patterns,query,new cljs.core.Keyword(null,"tx-data","tx-data",934159761).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,posh.core.last_tx_report))))){
return cljs.core.reset_BANG_.call(null,saved_db,new cljs.core.Keyword(null,"db-after","db-after",-571884666).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,posh.core.last_tx_report)));
} else {
return cljs.core.deref.call(null,saved_db);
}
});})(saved_db,temp__4423__auto__))
);
})();
cljs.core.swap_BANG_.call(null,posh.core.established_reactions,cljs.core.merge,cljs.core.PersistentArrayMap.fromArray([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [patterns,query], null),new_reaction], true, false));

return new_reaction;
}
});

posh.core.db_tx.cljs$lang$maxFixedArity = 2;
posh.core.tx_listeners = cljs.core.atom.call(null,cljs.core.PersistentVector.EMPTY);
cljs.core.reset_BANG_.call(null,posh.core.tx_listeners,cljs.core.vec.call(null,cljs.core.set.call(null,cljs.core.deref.call(null,posh.core.tx_listeners))));
posh.core.try_tx_listener = (function posh$core$try_tx_listener(tx_report,p__22292){
var vec__22294 = p__22292;
var patterns = cljs.core.nth.call(null,vec__22294,(0),null);
var handler_fn = cljs.core.nth.call(null,vec__22294,(1),null);
var temp__4425__auto__ = posh.tx_match.tx_patterns_match_QMARK_.call(null,patterns,new cljs.core.Keyword(null,"tx-data","tx-data",934159761).cljs$core$IFn$_invoke$arity$1(tx_report));
if(cljs.core.truth_(temp__4425__auto__)){
var matching_datom = temp__4425__auto__;
return handler_fn.call(null,matching_datom,new cljs.core.Keyword(null,"db-after","db-after",-571884666).cljs$core$IFn$_invoke$arity$1(tx_report));
} else {
return null;
}
});
posh.core.when_tx = (function posh$core$when_tx(patterns,handler_fn){
return cljs.core.swap_BANG_.call(null,posh.core.tx_listeners,cljs.core.conj,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [patterns,handler_fn], null));
});

//# sourceMappingURL=core.js.map