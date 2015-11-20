// Compiled by ClojureScript 1.7.170 {}
goog.provide('datascript.core');
goog.require('cljs.core');
goog.require('datascript.query');
goog.require('datascript.btset');
goog.require('datascript.db');
goog.require('datascript.pull_api');
goog.require('datascript.impl.entity');
datascript.core.q = datascript.query.q;
datascript.core.entity = datascript.impl.entity.entity;
datascript.core.entity_db = (function datascript$core$entity_db(entity){
if(cljs.core.truth_(datascript.impl.entity.entity_QMARK_.call(null,entity))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("de","entity?","de/entity?",555337042,null),new cljs.core.Symbol(null,"entity","entity",1189561251,null))))].join('')));
}

return entity.db;
});
datascript.core.datom = datascript.db.datom;
datascript.core.pull = datascript.pull_api.pull;
datascript.core.pull_many = datascript.pull_api.pull_many;
datascript.core.touch = datascript.impl.entity.touch;
datascript.core.empty_db = datascript.db.empty_db;
datascript.core.init_db = datascript.db.init_db;
datascript.core.datom_QMARK_ = datascript.db.datom_QMARK_;
datascript.core.db_QMARK_ = datascript.db.db_QMARK_;
datascript.core.tx0 = datascript.db.tx0;
datascript.core.is_filtered = (function datascript$core$is_filtered(x){
return (x instanceof datascript.db.FilteredDB);
});
datascript.core.filter = (function datascript$core$filter(db,pred){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

if(cljs.core.truth_(datascript.core.is_filtered.call(null,db))){
var fdb = db;
var u = fdb.unfiltered_db;
return (new datascript.db.FilteredDB(u,((function (fdb,u){
return (function (p1__22101_SHARP_){
var and__16720__auto__ = pred.call(null,u,p1__22101_SHARP_);
if(cljs.core.truth_(and__16720__auto__)){
return fdb.pred.call(null,p1__22101_SHARP_);
} else {
return and__16720__auto__;
}
});})(fdb,u))
,null,null,null));
} else {
return (new datascript.db.FilteredDB(db,(function (p1__22102_SHARP_){
return pred.call(null,db,p1__22102_SHARP_);
}),null,null,null));
}
});
datascript.core.with$ = (function datascript$core$with(var_args){
var args22103 = [];
var len__17790__auto___22106 = arguments.length;
var i__17791__auto___22107 = (0);
while(true){
if((i__17791__auto___22107 < len__17790__auto___22106)){
args22103.push((arguments[i__17791__auto___22107]));

var G__22108 = (i__17791__auto___22107 + (1));
i__17791__auto___22107 = G__22108;
continue;
} else {
}
break;
}

var G__22105 = args22103.length;
switch (G__22105) {
case 2:
return datascript.core.with$.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return datascript.core.with$.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22103.length)].join('')));

}
});

datascript.core.with$.cljs$core$IFn$_invoke$arity$2 = (function (db,tx_data){
return datascript.core.with$.call(null,db,tx_data,null);
});

datascript.core.with$.cljs$core$IFn$_invoke$arity$3 = (function (db,tx_data,tx_meta){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

if(cljs.core.truth_(datascript.core.is_filtered.call(null,db))){
throw cljs.core.ex_info.call(null,"Filtered DB cannot be modified",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword("transaction","filtered","transaction/filtered",1699706605)], null));
} else {
return datascript.db.transact_tx_data.call(null,datascript.db.map__GT_TxReport.call(null,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"db-before","db-before",-553691536),db,new cljs.core.Keyword(null,"db-after","db-after",-571884666),db,new cljs.core.Keyword(null,"tx-data","tx-data",934159761),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"tempids","tempids",1767509089),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"tx-meta","tx-meta",1159283194),tx_meta], null)),tx_data);
}
});

datascript.core.with$.cljs$lang$maxFixedArity = 3;
datascript.core.db_with = (function datascript$core$db_with(db,tx_data){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return new cljs.core.Keyword(null,"db-after","db-after",-571884666).cljs$core$IFn$_invoke$arity$1(datascript.core.with$.call(null,db,tx_data));
});
datascript.core.datoms = (function datascript$core$datoms(var_args){
var args22110 = [];
var len__17790__auto___22113 = arguments.length;
var i__17791__auto___22114 = (0);
while(true){
if((i__17791__auto___22114 < len__17790__auto___22113)){
args22110.push((arguments[i__17791__auto___22114]));

var G__22115 = (i__17791__auto___22114 + (1));
i__17791__auto___22114 = G__22115;
continue;
} else {
}
break;
}

var G__22112 = args22110.length;
switch (G__22112) {
case 2:
return datascript.core.datoms.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return datascript.core.datoms.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return datascript.core.datoms.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return datascript.core.datoms.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return datascript.core.datoms.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22110.length)].join('')));

}
});

datascript.core.datoms.cljs$core$IFn$_invoke$arity$2 = (function (db,index){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._datoms.call(null,db,index,cljs.core.PersistentVector.EMPTY);
});

datascript.core.datoms.cljs$core$IFn$_invoke$arity$3 = (function (db,index,c1){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._datoms.call(null,db,index,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c1], null));
});

datascript.core.datoms.cljs$core$IFn$_invoke$arity$4 = (function (db,index,c1,c2){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._datoms.call(null,db,index,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [c1,c2], null));
});

datascript.core.datoms.cljs$core$IFn$_invoke$arity$5 = (function (db,index,c1,c2,c3){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._datoms.call(null,db,index,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [c1,c2,c3], null));
});

datascript.core.datoms.cljs$core$IFn$_invoke$arity$6 = (function (db,index,c1,c2,c3,c4){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._datoms.call(null,db,index,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [c1,c2,c3,c4], null));
});

datascript.core.datoms.cljs$lang$maxFixedArity = 6;
datascript.core.seek_datoms = (function datascript$core$seek_datoms(var_args){
var args22117 = [];
var len__17790__auto___22120 = arguments.length;
var i__17791__auto___22121 = (0);
while(true){
if((i__17791__auto___22121 < len__17790__auto___22120)){
args22117.push((arguments[i__17791__auto___22121]));

var G__22122 = (i__17791__auto___22121 + (1));
i__17791__auto___22121 = G__22122;
continue;
} else {
}
break;
}

var G__22119 = args22117.length;
switch (G__22119) {
case 2:
return datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22117.length)].join('')));

}
});

datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$2 = (function (db,index){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._seek_datoms.call(null,db,index,cljs.core.PersistentVector.EMPTY);
});

datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$3 = (function (db,index,c1){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._seek_datoms.call(null,db,index,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c1], null));
});

datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$4 = (function (db,index,c1,c2){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._seek_datoms.call(null,db,index,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [c1,c2], null));
});

datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$5 = (function (db,index,c1,c2,c3){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._seek_datoms.call(null,db,index,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [c1,c2,c3], null));
});

datascript.core.seek_datoms.cljs$core$IFn$_invoke$arity$6 = (function (db,index,c1,c2,c3,c4){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._seek_datoms.call(null,db,index,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [c1,c2,c3,c4], null));
});

datascript.core.seek_datoms.cljs$lang$maxFixedArity = 6;
datascript.core.index_range = (function datascript$core$index_range(db,attr,start,end){
if(cljs.core.truth_(datascript.db.db_QMARK_.call(null,db))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol("db","db?","db/db?",1715868458,null),new cljs.core.Symbol(null,"db","db",-1661185010,null))))].join('')));
}

return datascript.db._index_range.call(null,db,attr,start,end);
});
datascript.core.entid = datascript.db.entid;
datascript.core.conn_QMARK_ = (function datascript$core$conn_QMARK_(conn){
var and__16720__auto__ = ((!((conn == null)))?((((conn.cljs$lang$protocol_mask$partition0$ & (32768))) || (conn.cljs$core$IDeref$))?true:(((!conn.cljs$lang$protocol_mask$partition0$))?cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IDeref,conn):false)):cljs.core.native_satisfies_QMARK_.call(null,cljs.core.IDeref,conn));
if(and__16720__auto__){
return datascript.db.db_QMARK_.call(null,cljs.core.deref.call(null,conn));
} else {
return and__16720__auto__;
}
});
datascript.core.create_conn = (function datascript$core$create_conn(var_args){
var args22128 = [];
var len__17790__auto___22131 = arguments.length;
var i__17791__auto___22132 = (0);
while(true){
if((i__17791__auto___22132 < len__17790__auto___22131)){
args22128.push((arguments[i__17791__auto___22132]));

var G__22133 = (i__17791__auto___22132 + (1));
i__17791__auto___22132 = G__22133;
continue;
} else {
}
break;
}

var G__22130 = args22128.length;
switch (G__22130) {
case 0:
return datascript.core.create_conn.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return datascript.core.create_conn.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22128.length)].join('')));

}
});

datascript.core.create_conn.cljs$core$IFn$_invoke$arity$0 = (function (){
return datascript.core.create_conn.call(null,datascript.db.default_schema);
});

datascript.core.create_conn.cljs$core$IFn$_invoke$arity$1 = (function (schema){
return cljs.core.atom.call(null,datascript.core.empty_db.call(null,schema),new cljs.core.Keyword(null,"meta","meta",1499536964),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"listeners","listeners",394544445),cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY)], null));
});

datascript.core.create_conn.cljs$lang$maxFixedArity = 1;
datascript.core._transact_BANG_ = (function datascript$core$_transact_BANG_(conn,tx_data,tx_meta){
if(cljs.core.truth_(datascript.core.conn_QMARK_.call(null,conn))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol(null,"conn?","conn?",1807755802,null),new cljs.core.Symbol(null,"conn","conn",1918841190,null))))].join('')));
}

var report = cljs.core.atom.call(null,null);
cljs.core.swap_BANG_.call(null,conn,((function (report){
return (function (db){
var r = datascript.core.with$.call(null,db,tx_data,tx_meta);
cljs.core.reset_BANG_.call(null,report,r);

return new cljs.core.Keyword(null,"db-after","db-after",-571884666).cljs$core$IFn$_invoke$arity$1(r);
});})(report))
);

return cljs.core.deref.call(null,report);
});
datascript.core.transact_BANG_ = (function datascript$core$transact_BANG_(var_args){
var args22135 = [];
var len__17790__auto___22144 = arguments.length;
var i__17791__auto___22145 = (0);
while(true){
if((i__17791__auto___22145 < len__17790__auto___22144)){
args22135.push((arguments[i__17791__auto___22145]));

var G__22146 = (i__17791__auto___22145 + (1));
i__17791__auto___22145 = G__22146;
continue;
} else {
}
break;
}

var G__22137 = args22135.length;
switch (G__22137) {
case 2:
return datascript.core.transact_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return datascript.core.transact_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22135.length)].join('')));

}
});

datascript.core.transact_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (conn,tx_data){
return datascript.core.transact_BANG_.call(null,conn,tx_data,null);
});

datascript.core.transact_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (conn,tx_data,tx_meta){
if(cljs.core.truth_(datascript.core.conn_QMARK_.call(null,conn))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol(null,"conn?","conn?",1807755802,null),new cljs.core.Symbol(null,"conn","conn",1918841190,null))))].join('')));
}

var report = datascript.core._transact_BANG_.call(null,conn,tx_data,tx_meta);
var seq__22138_22148 = cljs.core.seq.call(null,cljs.core.deref.call(null,new cljs.core.Keyword(null,"listeners","listeners",394544445).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,conn))));
var chunk__22139_22149 = null;
var count__22140_22150 = (0);
var i__22141_22151 = (0);
while(true){
if((i__22141_22151 < count__22140_22150)){
var vec__22142_22152 = cljs.core._nth.call(null,chunk__22139_22149,i__22141_22151);
var __22153 = cljs.core.nth.call(null,vec__22142_22152,(0),null);
var callback_22154 = cljs.core.nth.call(null,vec__22142_22152,(1),null);
callback_22154.call(null,report);

var G__22155 = seq__22138_22148;
var G__22156 = chunk__22139_22149;
var G__22157 = count__22140_22150;
var G__22158 = (i__22141_22151 + (1));
seq__22138_22148 = G__22155;
chunk__22139_22149 = G__22156;
count__22140_22150 = G__22157;
i__22141_22151 = G__22158;
continue;
} else {
var temp__4425__auto___22159 = cljs.core.seq.call(null,seq__22138_22148);
if(temp__4425__auto___22159){
var seq__22138_22160__$1 = temp__4425__auto___22159;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__22138_22160__$1)){
var c__17535__auto___22161 = cljs.core.chunk_first.call(null,seq__22138_22160__$1);
var G__22162 = cljs.core.chunk_rest.call(null,seq__22138_22160__$1);
var G__22163 = c__17535__auto___22161;
var G__22164 = cljs.core.count.call(null,c__17535__auto___22161);
var G__22165 = (0);
seq__22138_22148 = G__22162;
chunk__22139_22149 = G__22163;
count__22140_22150 = G__22164;
i__22141_22151 = G__22165;
continue;
} else {
var vec__22143_22166 = cljs.core.first.call(null,seq__22138_22160__$1);
var __22167 = cljs.core.nth.call(null,vec__22143_22166,(0),null);
var callback_22168 = cljs.core.nth.call(null,vec__22143_22166,(1),null);
callback_22168.call(null,report);

var G__22169 = cljs.core.next.call(null,seq__22138_22160__$1);
var G__22170 = null;
var G__22171 = (0);
var G__22172 = (0);
seq__22138_22148 = G__22169;
chunk__22139_22149 = G__22170;
count__22140_22150 = G__22171;
i__22141_22151 = G__22172;
continue;
}
} else {
}
}
break;
}

return report;
});

datascript.core.transact_BANG_.cljs$lang$maxFixedArity = 3;
datascript.core.listen_BANG_ = (function datascript$core$listen_BANG_(var_args){
var args22173 = [];
var len__17790__auto___22176 = arguments.length;
var i__17791__auto___22177 = (0);
while(true){
if((i__17791__auto___22177 < len__17790__auto___22176)){
args22173.push((arguments[i__17791__auto___22177]));

var G__22178 = (i__17791__auto___22177 + (1));
i__17791__auto___22177 = G__22178;
continue;
} else {
}
break;
}

var G__22175 = args22173.length;
switch (G__22175) {
case 2:
return datascript.core.listen_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return datascript.core.listen_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22173.length)].join('')));

}
});

datascript.core.listen_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (conn,callback){
return datascript.core.listen_BANG_.call(null,conn,cljs.core.rand.call(null),callback);
});

datascript.core.listen_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (conn,key,callback){
if(cljs.core.truth_(datascript.core.conn_QMARK_.call(null,conn))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol(null,"conn?","conn?",1807755802,null),new cljs.core.Symbol(null,"conn","conn",1918841190,null))))].join('')));
}

cljs.core.swap_BANG_.call(null,new cljs.core.Keyword(null,"listeners","listeners",394544445).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,conn)),cljs.core.assoc,key,callback);

return key;
});

datascript.core.listen_BANG_.cljs$lang$maxFixedArity = 3;
datascript.core.unlisten_BANG_ = (function datascript$core$unlisten_BANG_(conn,key){
if(cljs.core.truth_(datascript.core.conn_QMARK_.call(null,conn))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol(null,"conn?","conn?",1807755802,null),new cljs.core.Symbol(null,"conn","conn",1918841190,null))))].join('')));
}

return cljs.core.swap_BANG_.call(null,new cljs.core.Keyword(null,"listeners","listeners",394544445).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,conn)),cljs.core.dissoc,key);
});
datascript.core.data_readers = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Symbol("datascript","Datom","datascript/Datom",-901340080,null),datascript.db.datom_from_reader,new cljs.core.Symbol("datascript","DB","datascript/DB",-487332776,null),datascript.db.db_from_reader], null);
var seq__22180_22186 = cljs.core.seq.call(null,datascript.core.data_readers);
var chunk__22181_22187 = null;
var count__22182_22188 = (0);
var i__22183_22189 = (0);
while(true){
if((i__22183_22189 < count__22182_22188)){
var vec__22184_22190 = cljs.core._nth.call(null,chunk__22181_22187,i__22183_22189);
var tag_22191 = cljs.core.nth.call(null,vec__22184_22190,(0),null);
var cb_22192 = cljs.core.nth.call(null,vec__22184_22190,(1),null);
cljs.reader.register_tag_parser_BANG_.call(null,tag_22191,cb_22192);

var G__22193 = seq__22180_22186;
var G__22194 = chunk__22181_22187;
var G__22195 = count__22182_22188;
var G__22196 = (i__22183_22189 + (1));
seq__22180_22186 = G__22193;
chunk__22181_22187 = G__22194;
count__22182_22188 = G__22195;
i__22183_22189 = G__22196;
continue;
} else {
var temp__4425__auto___22197 = cljs.core.seq.call(null,seq__22180_22186);
if(temp__4425__auto___22197){
var seq__22180_22198__$1 = temp__4425__auto___22197;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__22180_22198__$1)){
var c__17535__auto___22199 = cljs.core.chunk_first.call(null,seq__22180_22198__$1);
var G__22200 = cljs.core.chunk_rest.call(null,seq__22180_22198__$1);
var G__22201 = c__17535__auto___22199;
var G__22202 = cljs.core.count.call(null,c__17535__auto___22199);
var G__22203 = (0);
seq__22180_22186 = G__22200;
chunk__22181_22187 = G__22201;
count__22182_22188 = G__22202;
i__22183_22189 = G__22203;
continue;
} else {
var vec__22185_22204 = cljs.core.first.call(null,seq__22180_22198__$1);
var tag_22205 = cljs.core.nth.call(null,vec__22185_22204,(0),null);
var cb_22206 = cljs.core.nth.call(null,vec__22185_22204,(1),null);
cljs.reader.register_tag_parser_BANG_.call(null,tag_22205,cb_22206);

var G__22207 = cljs.core.next.call(null,seq__22180_22198__$1);
var G__22208 = null;
var G__22209 = (0);
var G__22210 = (0);
seq__22180_22186 = G__22207;
chunk__22181_22187 = G__22208;
count__22182_22188 = G__22209;
i__22183_22189 = G__22210;
continue;
}
} else {
}
}
break;
}
datascript.core.last_tempid = cljs.core.atom.call(null,(-1000000));
datascript.core.tempid = (function datascript$core$tempid(var_args){
var args22211 = [];
var len__17790__auto___22214 = arguments.length;
var i__17791__auto___22215 = (0);
while(true){
if((i__17791__auto___22215 < len__17790__auto___22214)){
args22211.push((arguments[i__17791__auto___22215]));

var G__22216 = (i__17791__auto___22215 + (1));
i__17791__auto___22215 = G__22216;
continue;
} else {
}
break;
}

var G__22213 = args22211.length;
switch (G__22213) {
case 1:
return datascript.core.tempid.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return datascript.core.tempid.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22211.length)].join('')));

}
});

datascript.core.tempid.cljs$core$IFn$_invoke$arity$1 = (function (part){
if(cljs.core._EQ_.call(null,part,new cljs.core.Keyword("db.part","tx","db.part/tx",-1480923213))){
return new cljs.core.Keyword("db","current-tx","db/current-tx",1600722132);
} else {
return cljs.core.swap_BANG_.call(null,datascript.core.last_tempid,cljs.core.dec);
}
});

datascript.core.tempid.cljs$core$IFn$_invoke$arity$2 = (function (part,x){
if(cljs.core._EQ_.call(null,part,new cljs.core.Keyword("db.part","tx","db.part/tx",-1480923213))){
return new cljs.core.Keyword("db","current-tx","db/current-tx",1600722132);
} else {
return x;
}
});

datascript.core.tempid.cljs$lang$maxFixedArity = 2;
datascript.core.resolve_tempid = (function datascript$core$resolve_tempid(_db,tempids,tempid){
return cljs.core.get.call(null,tempids,tempid);
});
datascript.core.db = (function datascript$core$db(conn){
if(cljs.core.truth_(datascript.core.conn_QMARK_.call(null,conn))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol(null,"conn?","conn?",1807755802,null),new cljs.core.Symbol(null,"conn","conn",1918841190,null))))].join('')));
}

return cljs.core.deref.call(null,conn);
});
datascript.core.transact = (function datascript$core$transact(var_args){
var args22218 = [];
var len__17790__auto___22224 = arguments.length;
var i__17791__auto___22225 = (0);
while(true){
if((i__17791__auto___22225 < len__17790__auto___22224)){
args22218.push((arguments[i__17791__auto___22225]));

var G__22226 = (i__17791__auto___22225 + (1));
i__17791__auto___22225 = G__22226;
continue;
} else {
}
break;
}

var G__22220 = args22218.length;
switch (G__22220) {
case 2:
return datascript.core.transact.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return datascript.core.transact.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22218.length)].join('')));

}
});

datascript.core.transact.cljs$core$IFn$_invoke$arity$2 = (function (conn,tx_data){
return datascript.core.transact.call(null,conn,tx_data,null);
});

datascript.core.transact.cljs$core$IFn$_invoke$arity$3 = (function (conn,tx_data,tx_meta){
if(cljs.core.truth_(datascript.core.conn_QMARK_.call(null,conn))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol(null,"conn?","conn?",1807755802,null),new cljs.core.Symbol(null,"conn","conn",1918841190,null))))].join('')));
}

var res = datascript.core.transact_BANG_.call(null,conn,tx_data,tx_meta);
if(typeof datascript.core.t_datascript$core22221 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.IDerefWithTimeout}
 * @implements {cljs.core.IPending}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IDeref}
 * @implements {cljs.core.IWithMeta}
*/
datascript.core.t_datascript$core22221 = (function (conn,tx_data,tx_meta,res,meta22222){
this.conn = conn;
this.tx_data = tx_data;
this.tx_meta = tx_meta;
this.res = res;
this.meta22222 = meta22222;
this.cljs$lang$protocol_mask$partition0$ = 491520;
this.cljs$lang$protocol_mask$partition1$ = 1;
})
datascript.core.t_datascript$core22221.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (res){
return (function (_22223,meta22222__$1){
var self__ = this;
var _22223__$1 = this;
return (new datascript.core.t_datascript$core22221(self__.conn,self__.tx_data,self__.tx_meta,self__.res,meta22222__$1));
});})(res))
;

datascript.core.t_datascript$core22221.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (res){
return (function (_22223){
var self__ = this;
var _22223__$1 = this;
return self__.meta22222;
});})(res))
;

datascript.core.t_datascript$core22221.prototype.cljs$core$IDeref$_deref$arity$1 = ((function (res){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.res;
});})(res))
;

datascript.core.t_datascript$core22221.prototype.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3 = ((function (res){
return (function (_,___$1,___$2){
var self__ = this;
var ___$3 = this;
return self__.res;
});})(res))
;

datascript.core.t_datascript$core22221.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = ((function (res){
return (function (_){
var self__ = this;
var ___$1 = this;
return true;
});})(res))
;

datascript.core.t_datascript$core22221.getBasis = ((function (res){
return (function (){
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"conn","conn",1918841190,null),new cljs.core.Symbol(null,"tx-data","tx-data",-1720276008,null),new cljs.core.Symbol(null,"tx-meta","tx-meta",-1495152575,null),new cljs.core.Symbol(null,"res","res",245523648,null),new cljs.core.Symbol(null,"meta22222","meta22222",2120061395,null)], null);
});})(res))
;

datascript.core.t_datascript$core22221.cljs$lang$type = true;

datascript.core.t_datascript$core22221.cljs$lang$ctorStr = "datascript.core/t_datascript$core22221";

datascript.core.t_datascript$core22221.cljs$lang$ctorPrWriter = ((function (res){
return (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"datascript.core/t_datascript$core22221");
});})(res))
;

datascript.core.__GT_t_datascript$core22221 = ((function (res){
return (function datascript$core$__GT_t_datascript$core22221(conn__$1,tx_data__$1,tx_meta__$1,res__$1,meta22222){
return (new datascript.core.t_datascript$core22221(conn__$1,tx_data__$1,tx_meta__$1,res__$1,meta22222));
});})(res))
;

}

return (new datascript.core.t_datascript$core22221(conn,tx_data,tx_meta,res,cljs.core.PersistentArrayMap.EMPTY));
});

datascript.core.transact.cljs$lang$maxFixedArity = 3;
datascript.core.future_call = (function datascript$core$future_call(f){
var res = cljs.core.atom.call(null,null);
var realized = cljs.core.atom.call(null,false);
setTimeout(((function (res,realized){
return (function (){
cljs.core.reset_BANG_.call(null,res,f.call(null));

return cljs.core.reset_BANG_.call(null,realized,true);
});})(res,realized))
,(0));

if(typeof datascript.core.t_datascript$core22231 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.IDerefWithTimeout}
 * @implements {cljs.core.IPending}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IDeref}
 * @implements {cljs.core.IWithMeta}
*/
datascript.core.t_datascript$core22231 = (function (future_call,f,res,realized,meta22232){
this.future_call = future_call;
this.f = f;
this.res = res;
this.realized = realized;
this.meta22232 = meta22232;
this.cljs$lang$protocol_mask$partition0$ = 491520;
this.cljs$lang$protocol_mask$partition1$ = 1;
})
datascript.core.t_datascript$core22231.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (res,realized){
return (function (_22233,meta22232__$1){
var self__ = this;
var _22233__$1 = this;
return (new datascript.core.t_datascript$core22231(self__.future_call,self__.f,self__.res,self__.realized,meta22232__$1));
});})(res,realized))
;

datascript.core.t_datascript$core22231.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (res,realized){
return (function (_22233){
var self__ = this;
var _22233__$1 = this;
return self__.meta22232;
});})(res,realized))
;

datascript.core.t_datascript$core22231.prototype.cljs$core$IDeref$_deref$arity$1 = ((function (res,realized){
return (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.deref.call(null,self__.res);
});})(res,realized))
;

datascript.core.t_datascript$core22231.prototype.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3 = ((function (res,realized){
return (function (_,___$1,timeout_val){
var self__ = this;
var ___$2 = this;
if(cljs.core.truth_(cljs.core.deref.call(null,self__.realized))){
return cljs.core.deref.call(null,self__.res);
} else {
return timeout_val;
}
});})(res,realized))
;

datascript.core.t_datascript$core22231.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = ((function (res,realized){
return (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.deref.call(null,self__.realized);
});})(res,realized))
;

datascript.core.t_datascript$core22231.getBasis = ((function (res,realized){
return (function (){
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"future-call","future-call",96010083,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"private","private",-558947994),true,new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null)], null)))], null)),new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"res","res",245523648,null),new cljs.core.Symbol(null,"realized","realized",1487343404,null),new cljs.core.Symbol(null,"meta22232","meta22232",-899738929,null)], null);
});})(res,realized))
;

datascript.core.t_datascript$core22231.cljs$lang$type = true;

datascript.core.t_datascript$core22231.cljs$lang$ctorStr = "datascript.core/t_datascript$core22231";

datascript.core.t_datascript$core22231.cljs$lang$ctorPrWriter = ((function (res,realized){
return (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"datascript.core/t_datascript$core22231");
});})(res,realized))
;

datascript.core.__GT_t_datascript$core22231 = ((function (res,realized){
return (function datascript$core$future_call_$___GT_t_datascript$core22231(future_call__$1,f__$1,res__$1,realized__$1,meta22232){
return (new datascript.core.t_datascript$core22231(future_call__$1,f__$1,res__$1,realized__$1,meta22232));
});})(res,realized))
;

}

return (new datascript.core.t_datascript$core22231(datascript$core$future_call,f,res,realized,cljs.core.PersistentArrayMap.EMPTY));
});
datascript.core.transact_async = (function datascript$core$transact_async(var_args){
var args22234 = [];
var len__17790__auto___22237 = arguments.length;
var i__17791__auto___22238 = (0);
while(true){
if((i__17791__auto___22238 < len__17790__auto___22237)){
args22234.push((arguments[i__17791__auto___22238]));

var G__22239 = (i__17791__auto___22238 + (1));
i__17791__auto___22238 = G__22239;
continue;
} else {
}
break;
}

var G__22236 = args22234.length;
switch (G__22236) {
case 2:
return datascript.core.transact_async.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return datascript.core.transact_async.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22234.length)].join('')));

}
});

datascript.core.transact_async.cljs$core$IFn$_invoke$arity$2 = (function (conn,tx_data){
return datascript.core.transact_async.call(null,conn,tx_data,null);
});

datascript.core.transact_async.cljs$core$IFn$_invoke$arity$3 = (function (conn,tx_data,tx_meta){
if(cljs.core.truth_(datascript.core.conn_QMARK_.call(null,conn))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol(null,"conn?","conn?",1807755802,null),new cljs.core.Symbol(null,"conn","conn",1918841190,null))))].join('')));
}

return datascript.core.future_call.call(null,(function (){
return datascript.core.transact_BANG_.call(null,conn,tx_data,tx_meta);
}));
});

datascript.core.transact_async.cljs$lang$maxFixedArity = 3;
datascript.core.rand_bits = (function datascript$core$rand_bits(pow){
return cljs.core.rand_int.call(null,((1) << pow));
});
datascript.core.to_hex_string = (function datascript$core$to_hex_string(n,l){
var s = n.toString((16));
var c = cljs.core.count.call(null,s);
if((c > l)){
return cljs.core.subs.call(null,s,(0),l);
} else {
if((c < l)){
return [cljs.core.str(cljs.core.apply.call(null,cljs.core.str,cljs.core.repeat.call(null,(l - c),"0"))),cljs.core.str(s)].join('');
} else {
return s;

}
}
});
datascript.core.squuid = (function datascript$core$squuid(var_args){
var args22241 = [];
var len__17790__auto___22244 = arguments.length;
var i__17791__auto___22245 = (0);
while(true){
if((i__17791__auto___22245 < len__17790__auto___22244)){
args22241.push((arguments[i__17791__auto___22245]));

var G__22246 = (i__17791__auto___22245 + (1));
i__17791__auto___22245 = G__22246;
continue;
} else {
}
break;
}

var G__22243 = args22241.length;
switch (G__22243) {
case 0:
return datascript.core.squuid.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return datascript.core.squuid.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22241.length)].join('')));

}
});

datascript.core.squuid.cljs$core$IFn$_invoke$arity$0 = (function (){
return datascript.core.squuid.call(null,(new Date()).getTime());
});

datascript.core.squuid.cljs$core$IFn$_invoke$arity$1 = (function (msec){
return cljs.core.uuid.call(null,[cljs.core.str(datascript.core.to_hex_string.call(null,((msec / (1000)) | (0)),(8))),cljs.core.str("-"),cljs.core.str(datascript.core.to_hex_string.call(null,datascript.core.rand_bits.call(null,(16)),(4))),cljs.core.str("-"),cljs.core.str(datascript.core.to_hex_string.call(null,((datascript.core.rand_bits.call(null,(16)) & (4095)) | (16384)),(4))),cljs.core.str("-"),cljs.core.str(datascript.core.to_hex_string.call(null,((datascript.core.rand_bits.call(null,(16)) & (16383)) | (32768)),(4))),cljs.core.str("-"),cljs.core.str(datascript.core.to_hex_string.call(null,datascript.core.rand_bits.call(null,(16)),(4))),cljs.core.str(datascript.core.to_hex_string.call(null,datascript.core.rand_bits.call(null,(16)),(4))),cljs.core.str(datascript.core.to_hex_string.call(null,datascript.core.rand_bits.call(null,(16)),(4)))].join(''));
});

datascript.core.squuid.cljs$lang$maxFixedArity = 1;
datascript.core.squuid_time_millis = (function datascript$core$squuid_time_millis(uuid){
return (parseInt(cljs.core.subs.call(null,[cljs.core.str(uuid)].join(''),(0),(8)),(16)) * (1000));
});

//# sourceMappingURL=core.js.map