// Compiled by ClojureScript 1.7.170 {}
goog.provide('cljs.repl');
goog.require('cljs.core');
cljs.repl.print_doc = (function cljs$repl$print_doc(m){
cljs.core.println.call(null,"-------------------------");

cljs.core.println.call(null,[cljs.core.str((function (){var temp__4425__auto__ = new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(temp__4425__auto__)){
var ns = temp__4425__auto__;
return [cljs.core.str(ns),cljs.core.str("/")].join('');
} else {
return null;
}
})()),cljs.core.str(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join(''));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Protocol");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m))){
var seq__27129_27143 = cljs.core.seq.call(null,new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m));
var chunk__27130_27144 = null;
var count__27131_27145 = (0);
var i__27132_27146 = (0);
while(true){
if((i__27132_27146 < count__27131_27145)){
var f_27147 = cljs.core._nth.call(null,chunk__27130_27144,i__27132_27146);
cljs.core.println.call(null,"  ",f_27147);

var G__27148 = seq__27129_27143;
var G__27149 = chunk__27130_27144;
var G__27150 = count__27131_27145;
var G__27151 = (i__27132_27146 + (1));
seq__27129_27143 = G__27148;
chunk__27130_27144 = G__27149;
count__27131_27145 = G__27150;
i__27132_27146 = G__27151;
continue;
} else {
var temp__4425__auto___27152 = cljs.core.seq.call(null,seq__27129_27143);
if(temp__4425__auto___27152){
var seq__27129_27153__$1 = temp__4425__auto___27152;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__27129_27153__$1)){
var c__17535__auto___27154 = cljs.core.chunk_first.call(null,seq__27129_27153__$1);
var G__27155 = cljs.core.chunk_rest.call(null,seq__27129_27153__$1);
var G__27156 = c__17535__auto___27154;
var G__27157 = cljs.core.count.call(null,c__17535__auto___27154);
var G__27158 = (0);
seq__27129_27143 = G__27155;
chunk__27130_27144 = G__27156;
count__27131_27145 = G__27157;
i__27132_27146 = G__27158;
continue;
} else {
var f_27159 = cljs.core.first.call(null,seq__27129_27153__$1);
cljs.core.println.call(null,"  ",f_27159);

var G__27160 = cljs.core.next.call(null,seq__27129_27153__$1);
var G__27161 = null;
var G__27162 = (0);
var G__27163 = (0);
seq__27129_27143 = G__27160;
chunk__27130_27144 = G__27161;
count__27131_27145 = G__27162;
i__27132_27146 = G__27163;
continue;
}
} else {
}
}
break;
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m))){
var arglists_27164 = new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_((function (){var or__16732__auto__ = new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__16732__auto__)){
return or__16732__auto__;
} else {
return new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m);
}
})())){
cljs.core.prn.call(null,arglists_27164);
} else {
cljs.core.prn.call(null,((cljs.core._EQ_.call(null,new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.first.call(null,arglists_27164)))?cljs.core.second.call(null,arglists_27164):arglists_27164));
}
} else {
}
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"special-form","special-form",-1326536374).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Special Form");

cljs.core.println.call(null," ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m));

if(cljs.core.contains_QMARK_.call(null,m,new cljs.core.Keyword(null,"url","url",276297046))){
if(cljs.core.truth_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))){
return cljs.core.println.call(null,[cljs.core.str("\n  Please see http://clojure.org/"),cljs.core.str(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))].join(''));
} else {
return null;
}
} else {
return cljs.core.println.call(null,[cljs.core.str("\n  Please see http://clojure.org/special_forms#"),cljs.core.str(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join(''));
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Macro");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"REPL Special Function");
} else {
}

cljs.core.println.call(null," ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
var seq__27133 = cljs.core.seq.call(null,new cljs.core.Keyword(null,"methods","methods",453930866).cljs$core$IFn$_invoke$arity$1(m));
var chunk__27134 = null;
var count__27135 = (0);
var i__27136 = (0);
while(true){
if((i__27136 < count__27135)){
var vec__27137 = cljs.core._nth.call(null,chunk__27134,i__27136);
var name = cljs.core.nth.call(null,vec__27137,(0),null);
var map__27138 = cljs.core.nth.call(null,vec__27137,(1),null);
var map__27138__$1 = ((((!((map__27138 == null)))?((((map__27138.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27138.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27138):map__27138);
var doc = cljs.core.get.call(null,map__27138__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists = cljs.core.get.call(null,map__27138__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println.call(null);

cljs.core.println.call(null," ",name);

cljs.core.println.call(null," ",arglists);

if(cljs.core.truth_(doc)){
cljs.core.println.call(null," ",doc);
} else {
}

var G__27165 = seq__27133;
var G__27166 = chunk__27134;
var G__27167 = count__27135;
var G__27168 = (i__27136 + (1));
seq__27133 = G__27165;
chunk__27134 = G__27166;
count__27135 = G__27167;
i__27136 = G__27168;
continue;
} else {
var temp__4425__auto__ = cljs.core.seq.call(null,seq__27133);
if(temp__4425__auto__){
var seq__27133__$1 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__27133__$1)){
var c__17535__auto__ = cljs.core.chunk_first.call(null,seq__27133__$1);
var G__27169 = cljs.core.chunk_rest.call(null,seq__27133__$1);
var G__27170 = c__17535__auto__;
var G__27171 = cljs.core.count.call(null,c__17535__auto__);
var G__27172 = (0);
seq__27133 = G__27169;
chunk__27134 = G__27170;
count__27135 = G__27171;
i__27136 = G__27172;
continue;
} else {
var vec__27140 = cljs.core.first.call(null,seq__27133__$1);
var name = cljs.core.nth.call(null,vec__27140,(0),null);
var map__27141 = cljs.core.nth.call(null,vec__27140,(1),null);
var map__27141__$1 = ((((!((map__27141 == null)))?((((map__27141.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27141.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27141):map__27141);
var doc = cljs.core.get.call(null,map__27141__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists = cljs.core.get.call(null,map__27141__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println.call(null);

cljs.core.println.call(null," ",name);

cljs.core.println.call(null," ",arglists);

if(cljs.core.truth_(doc)){
cljs.core.println.call(null," ",doc);
} else {
}

var G__27173 = cljs.core.next.call(null,seq__27133__$1);
var G__27174 = null;
var G__27175 = (0);
var G__27176 = (0);
seq__27133 = G__27173;
chunk__27134 = G__27174;
count__27135 = G__27175;
i__27136 = G__27176;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
}
});

//# sourceMappingURL=repl.js.map