// Compiled by ClojureScript 1.7.170 {}
goog.provide('posh.tx_match');
goog.require('cljs.core');
goog.require('datascript.core');
posh.tx_match.tx_item_match_QMARK_ = (function posh$tx_match$tx_item_match_QMARK_(pattern_item,tx_datom_item){
if(cljs.core._EQ_.call(null,pattern_item,new cljs.core.Symbol(null,"_","_",-1201019570,null))){
return true;
} else {
if(cljs.core.coll_QMARK_.call(null,pattern_item)){
return cljs.core.some.call(null,cljs.core.PersistentHashSet.fromArray([tx_datom_item], true),pattern_item);
} else {
if(cljs.core.fn_QMARK_.call(null,pattern_item)){
return pattern_item.call(null,tx_datom_item);
} else {
return cljs.core._EQ_.call(null,pattern_item,tx_datom_item);

}
}
}
});
posh.tx_match.tx_pattern_match_QMARK_ = (function posh$tx_match$tx_pattern_match_QMARK_(pattern,tx_datom){
while(true){
if(cljs.core.empty_QMARK_.call(null,pattern)){
return true;
} else {
if(cljs.core.truth_(posh.tx_match.tx_item_match_QMARK_.call(null,cljs.core.first.call(null,pattern),cljs.core.first.call(null,tx_datom)))){
var G__22250 = cljs.core.rest.call(null,pattern);
var G__22251 = cljs.core.rest.call(null,tx_datom);
pattern = G__22250;
tx_datom = G__22251;
continue;
} else {
return false;

}
}
break;
}
});
posh.tx_match.tx_patterns_match_QMARK_ = (function posh$tx_match$tx_patterns_match_QMARK_(patterns,tx_datoms){
return cljs.core.first.call(null,cljs.core.filter.call(null,(function (b){
return b;
}),(function (){var iter__17504__auto__ = (function posh$tx_match$tx_patterns_match_QMARK__$_iter__22258(s__22259){
return (new cljs.core.LazySeq(null,(function (){
var s__22259__$1 = s__22259;
while(true){
var temp__4425__auto__ = cljs.core.seq.call(null,s__22259__$1);
if(temp__4425__auto__){
var xs__4977__auto__ = temp__4425__auto__;
var p = cljs.core.first.call(null,xs__4977__auto__);
var iterys__17500__auto__ = ((function (s__22259__$1,p,xs__4977__auto__,temp__4425__auto__){
return (function posh$tx_match$tx_patterns_match_QMARK__$_iter__22258_$_iter__22260(s__22261){
return (new cljs.core.LazySeq(null,((function (s__22259__$1,p,xs__4977__auto__,temp__4425__auto__){
return (function (){
var s__22261__$1 = s__22261;
while(true){
var temp__4425__auto____$1 = cljs.core.seq.call(null,s__22261__$1);
if(temp__4425__auto____$1){
var s__22261__$2 = temp__4425__auto____$1;
if(cljs.core.chunked_seq_QMARK_.call(null,s__22261__$2)){
var c__17502__auto__ = cljs.core.chunk_first.call(null,s__22261__$2);
var size__17503__auto__ = cljs.core.count.call(null,c__17502__auto__);
var b__22263 = cljs.core.chunk_buffer.call(null,size__17503__auto__);
if((function (){var i__22262 = (0);
while(true){
if((i__22262 < size__17503__auto__)){
var d = cljs.core._nth.call(null,c__17502__auto__,i__22262);
cljs.core.chunk_append.call(null,b__22263,(cljs.core.truth_(posh.tx_match.tx_pattern_match_QMARK_.call(null,p,d))?d:null));

var G__22264 = (i__22262 + (1));
i__22262 = G__22264;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__22263),posh$tx_match$tx_patterns_match_QMARK__$_iter__22258_$_iter__22260.call(null,cljs.core.chunk_rest.call(null,s__22261__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__22263),null);
}
} else {
var d = cljs.core.first.call(null,s__22261__$2);
return cljs.core.cons.call(null,(cljs.core.truth_(posh.tx_match.tx_pattern_match_QMARK_.call(null,p,d))?d:null),posh$tx_match$tx_patterns_match_QMARK__$_iter__22258_$_iter__22260.call(null,cljs.core.rest.call(null,s__22261__$2)));
}
} else {
return null;
}
break;
}
});})(s__22259__$1,p,xs__4977__auto__,temp__4425__auto__))
,null,null));
});})(s__22259__$1,p,xs__4977__auto__,temp__4425__auto__))
;
var fs__17501__auto__ = cljs.core.seq.call(null,iterys__17500__auto__.call(null,tx_datoms));
if(fs__17501__auto__){
return cljs.core.concat.call(null,fs__17501__auto__,posh$tx_match$tx_patterns_match_QMARK__$_iter__22258.call(null,cljs.core.rest.call(null,s__22259__$1)));
} else {
var G__22265 = cljs.core.rest.call(null,s__22259__$1);
s__22259__$1 = G__22265;
continue;
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__17504__auto__.call(null,patterns);
})()));
});
posh.tx_match.query_symbol_QMARK_ = (function posh$tx_match$query_symbol_QMARK_(s){
return ((s instanceof cljs.core.Symbol)) && (cljs.core._EQ_.call(null,cljs.core.first.call(null,[cljs.core.str(s)].join('')),"?"));
});
posh.tx_match.tx_item_match_q_QMARK_ = (function posh$tx_match$tx_item_match_q_QMARK_(pattern_item,tx_datom_item){
if(cljs.core._EQ_.call(null,pattern_item,new cljs.core.Symbol(null,"_","_",-1201019570,null))){
return true;
} else {
if(cljs.core.truth_(posh.tx_match.query_symbol_QMARK_.call(null,pattern_item))){
return cljs.core.PersistentArrayMap.fromArray([pattern_item,tx_datom_item], true, false);
} else {
if(cljs.core.coll_QMARK_.call(null,pattern_item)){
return cljs.core.some.call(null,cljs.core.PersistentHashSet.fromArray([tx_datom_item], true),pattern_item);
} else {
if(cljs.core.fn_QMARK_.call(null,pattern_item)){
return pattern_item.call(null,tx_datom_item);
} else {
return cljs.core._EQ_.call(null,pattern_item,tx_datom_item);

}
}
}
}
});
posh.tx_match.tx_pattern_match_q_QMARK_ = (function posh$tx_match$tx_pattern_match_q_QMARK_(pattern,tx_datom){
var pattern__$1 = pattern;
var tx_datom__$1 = tx_datom;
var vars = cljs.core.PersistentArrayMap.EMPTY;
while(true){
if(cljs.core.empty_QMARK_.call(null,pattern__$1)){
return vars;
} else {
var temp__4425__auto__ = posh.tx_match.tx_item_match_q_QMARK_.call(null,cljs.core.first.call(null,pattern__$1),cljs.core.first.call(null,tx_datom__$1));
if(cljs.core.truth_(temp__4425__auto__)){
var v = temp__4425__auto__;
var G__22266 = cljs.core.rest.call(null,pattern__$1);
var G__22267 = cljs.core.rest.call(null,tx_datom__$1);
var G__22268 = ((cljs.core.map_QMARK_.call(null,v))?cljs.core.merge.call(null,v,vars):vars);
pattern__$1 = G__22266;
tx_datom__$1 = G__22267;
vars = G__22268;
continue;
} else {
return null;
}
}
break;
}
});
posh.tx_match.query_unifies_QMARK_;
posh.tx_match.tx_patterns_match_q_QMARK_ = (function posh$tx_match$tx_patterns_match_q_QMARK_(db,patterns,tx_datoms){
return cljs.core.first.call(null,cljs.core.remove.call(null,cljs.core.nil_QMARK_,(function (){var iter__17504__auto__ = (function posh$tx_match$tx_patterns_match_q_QMARK__$_iter__22275(s__22276){
return (new cljs.core.LazySeq(null,(function (){
var s__22276__$1 = s__22276;
while(true){
var temp__4425__auto__ = cljs.core.seq.call(null,s__22276__$1);
if(temp__4425__auto__){
var xs__4977__auto__ = temp__4425__auto__;
var p = cljs.core.first.call(null,xs__4977__auto__);
var iterys__17500__auto__ = ((function (s__22276__$1,p,xs__4977__auto__,temp__4425__auto__){
return (function posh$tx_match$tx_patterns_match_q_QMARK__$_iter__22275_$_iter__22277(s__22278){
return (new cljs.core.LazySeq(null,((function (s__22276__$1,p,xs__4977__auto__,temp__4425__auto__){
return (function (){
var s__22278__$1 = s__22278;
while(true){
var temp__4425__auto____$1 = cljs.core.seq.call(null,s__22278__$1);
if(temp__4425__auto____$1){
var s__22278__$2 = temp__4425__auto____$1;
if(cljs.core.chunked_seq_QMARK_.call(null,s__22278__$2)){
var c__17502__auto__ = cljs.core.chunk_first.call(null,s__22278__$2);
var size__17503__auto__ = cljs.core.count.call(null,c__17502__auto__);
var b__22280 = cljs.core.chunk_buffer.call(null,size__17503__auto__);
if((function (){var i__22279 = (0);
while(true){
if((i__22279 < size__17503__auto__)){
var d = cljs.core._nth.call(null,c__17502__auto__,i__22279);
cljs.core.chunk_append.call(null,b__22280,((cljs.core.map_QMARK_.call(null,p))?(function (){var temp__4425__auto____$2 = posh.tx_match.tx_pattern_match_q_QMARK_.call(null,cljs.core.first.call(null,cljs.core.keys.call(null,p)),d);
if(cljs.core.truth_(temp__4425__auto____$2)){
var vars = temp__4425__auto____$2;
if(cljs.core.truth_(posh.tx_match.query_unifies_QMARK_.call(null,db,vars,cljs.core.first.call(null,cljs.core.vals.call(null,p))))){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
return null;
}
} else {
return null;
}
})():posh.tx_match.tx_pattern_match_q_QMARK_.call(null,p,d)));

var G__22281 = (i__22279 + (1));
i__22279 = G__22281;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__22280),posh$tx_match$tx_patterns_match_q_QMARK__$_iter__22275_$_iter__22277.call(null,cljs.core.chunk_rest.call(null,s__22278__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__22280),null);
}
} else {
var d = cljs.core.first.call(null,s__22278__$2);
return cljs.core.cons.call(null,((cljs.core.map_QMARK_.call(null,p))?(function (){var temp__4425__auto____$2 = posh.tx_match.tx_pattern_match_q_QMARK_.call(null,cljs.core.first.call(null,cljs.core.keys.call(null,p)),d);
if(cljs.core.truth_(temp__4425__auto____$2)){
var vars = temp__4425__auto____$2;
if(cljs.core.truth_(posh.tx_match.query_unifies_QMARK_.call(null,db,vars,cljs.core.first.call(null,cljs.core.vals.call(null,p))))){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
return null;
}
} else {
return null;
}
})():posh.tx_match.tx_pattern_match_q_QMARK_.call(null,p,d)),posh$tx_match$tx_patterns_match_q_QMARK__$_iter__22275_$_iter__22277.call(null,cljs.core.rest.call(null,s__22278__$2)));
}
} else {
return null;
}
break;
}
});})(s__22276__$1,p,xs__4977__auto__,temp__4425__auto__))
,null,null));
});})(s__22276__$1,p,xs__4977__auto__,temp__4425__auto__))
;
var fs__17501__auto__ = cljs.core.seq.call(null,iterys__17500__auto__.call(null,tx_datoms));
if(fs__17501__auto__){
return cljs.core.concat.call(null,fs__17501__auto__,posh$tx_match$tx_patterns_match_q_QMARK__$_iter__22275.call(null,cljs.core.rest.call(null,s__22276__$1)));
} else {
var G__22282 = cljs.core.rest.call(null,s__22276__$1);
s__22276__$1 = G__22282;
continue;
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__17504__auto__.call(null,patterns);
})()));
});
posh.tx_match.build_query = (function posh$tx_match$build_query(vars,query){
var ks = cljs.core.keys.call(null,vars);
return cljs.core.vec.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"find","find",496279456),cljs.core.vec.call(null,ks)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"in","in",-1531184865),new cljs.core.Symbol(null,"$","$",-1580747756,null)], null),ks,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"where","where",-2044795965)], null),query));
});
posh.tx_match.query_unifies_QMARK_ = (function posh$tx_match$query_unifies_QMARK_(db,vars,query){
cljs.core.println.call(null,cljs.core.pr_str.call(null,vars),"   ",cljs.core.pr_str.call(null,query),"  ",cljs.core.pr_str.call(null,cljs.core.apply.call(null,cljs.core.partial.call(null,datascript.core.q,posh.tx_match.build_query.call(null,vars,query)),cljs.core.cons.call(null,db,cljs.core.vals.call(null,vars)))));

return !(cljs.core.empty_QMARK_.call(null,cljs.core.apply.call(null,cljs.core.partial.call(null,datascript.core.q,posh.tx_match.build_query.call(null,vars,query)),cljs.core.cons.call(null,db,cljs.core.vals.call(null,vars)))));
});
posh.tx_match.tx_match_QMARK_ = (function posh$tx_match$tx_match_QMARK_(db,patterns,query,tx_datoms){
var temp__4425__auto__ = posh.tx_match.tx_patterns_match_q_QMARK_.call(null,db,patterns,tx_datoms);
if(cljs.core.truth_(temp__4425__auto__)){
var vars = temp__4425__auto__;
if(cljs.core.truth_((function (){var and__16720__auto__ = query;
if(cljs.core.truth_(and__16720__auto__)){
return !(cljs.core.empty_QMARK_.call(null,query));
} else {
return and__16720__auto__;
}
})())){
return posh.tx_match.query_unifies_QMARK_.call(null,db,vars,query);
} else {
return vars;
}
} else {
return null;
}
});

//# sourceMappingURL=tx_match.js.map