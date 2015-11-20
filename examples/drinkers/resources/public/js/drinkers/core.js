// Compiled by ClojureScript 1.7.170 {}
goog.provide('drinkers.core');
goog.require('cljs.core');
goog.require('reagent.core');
goog.require('posh.core');
goog.require('datascript.core');
cljs.core.enable_console_print_BANG_.call(null);
drinkers.core.conn = datascript.core.create_conn.call(null);
datascript.core.transact_BANG_.call(null,drinkers.core.conn,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-1),new cljs.core.Keyword("group","name","group/name",1606764202),"Pine Club",new cljs.core.Keyword("group","sort-by","group/sort-by",-420965382),new cljs.core.Keyword("person","name","person/name",549444500)], null),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-2),new cljs.core.Keyword("group","name","group/name",1606764202),"Oak Club",new cljs.core.Keyword("group","sort-by","group/sort-by",-420965382),new cljs.core.Keyword("person","age","person/age",387881455)], null)], null));
var groups_22297 = datascript.core.q.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"find","find",496279456),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?g","?g",589440221,null),new cljs.core.Symbol(null,"...","...",-1926939749,null)], null),new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?g","?g",589440221,null),new cljs.core.Keyword("group","name","group/name",1606764202),new cljs.core.Symbol(null,"_","_",-1201019570,null)], null)], null),cljs.core.deref.call(null,drinkers.core.conn));
datascript.core.transact_BANG_.call(null,drinkers.core.conn,new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-3),new cljs.core.Keyword("person","name","person/name",549444500),"Bob",new cljs.core.Keyword("person","age","person/age",387881455),(30),new cljs.core.Keyword("person","group","person/group",1608391413),cljs.core.rand_nth.call(null,groups_22297)], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-4),new cljs.core.Keyword("person","name","person/name",549444500),"Sally",new cljs.core.Keyword("person","age","person/age",387881455),(25),new cljs.core.Keyword("person","group","person/group",1608391413),cljs.core.rand_nth.call(null,groups_22297)], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-5),new cljs.core.Keyword("person","name","person/name",549444500),"Lodock",new cljs.core.Keyword("person","age","person/age",387881455),(45),new cljs.core.Keyword("person","group","person/group",1608391413),cljs.core.rand_nth.call(null,groups_22297)], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-6),new cljs.core.Keyword("person","name","person/name",549444500),"Janis",new cljs.core.Keyword("person","age","person/age",387881455),(22),new cljs.core.Keyword("person","group","person/group",1608391413),cljs.core.rand_nth.call(null,groups_22297)], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-7),new cljs.core.Keyword("person","name","person/name",549444500),"Angel-Bad",new cljs.core.Keyword("person","age","person/age",387881455),(14),new cljs.core.Keyword("person","group","person/group",1608391413),cljs.core.rand_nth.call(null,groups_22297)], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-8),new cljs.core.Keyword("person","name","person/name",549444500),"Shomo",new cljs.core.Keyword("person","age","person/age",387881455),(16),new cljs.core.Keyword("person","group","person/group",1608391413),cljs.core.rand_nth.call(null,groups_22297)], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-9),new cljs.core.Keyword("person","name","person/name",549444500),"Miagianna",new cljs.core.Keyword("person","age","person/age",387881455),(33),new cljs.core.Keyword("person","group","person/group",1608391413),cljs.core.rand_nth.call(null,groups_22297)], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-10),new cljs.core.Keyword("person","name","person/name",549444500),"Macy",new cljs.core.Keyword("person","age","person/age",387881455),(4),new cljs.core.Keyword("person","group","person/group",1608391413),cljs.core.rand_nth.call(null,groups_22297)], null),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("db","id","db/id",-1388397098),(-11),new cljs.core.Keyword("person","name","person/name",549444500),"Ojoto",new cljs.core.Keyword("person","age","person/age",387881455),(20),new cljs.core.Keyword("person","group","person/group",1608391413),cljs.core.rand_nth.call(null,groups_22297)], null)], null));
posh.core.setup.call(null,drinkers.core.conn);
posh.core.when_tx.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.Keyword("person","age","person/age",387881455),(21),new cljs.core.Symbol(null,"_","_",-1201019570,null),true], null)], null),(function (p__22298,db){
var vec__22299 = p__22298;
var e = cljs.core.nth.call(null,vec__22299,(0),null);
var a = cljs.core.nth.call(null,vec__22299,(1),null);
var v = cljs.core.nth.call(null,vec__22299,(2),null);
return alert([cljs.core.str("You have come of age, "),cljs.core.str(new cljs.core.Keyword("person","name","person/name",549444500).cljs$core$IFn$_invoke$arity$1(datascript.core.entity.call(null,db,e))),cljs.core.str(".")].join(''));
}));
drinkers.core.ents = (function drinkers$core$ents(db,ids){
return cljs.core.map.call(null,cljs.core.partial.call(null,datascript.core.entity,db),ids);
});
drinkers.core.drunkard_club = (function drinkers$core$drunkard_club(){
var db = posh.core.db_tx.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.Keyword("person","age","person/age",387881455),(function (p1__22300_SHARP_){
return (p1__22300_SHARP_ >= (21));
})], null)], null));
var drunkards = drinkers.core.ents.call(null,cljs.core.deref.call(null,db),datascript.core.q.call(null,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"find","find",496279456),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Symbol(null,"...","...",-1926939749,null)], null),new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Keyword("person","age","person/age",387881455),new cljs.core.Symbol(null,"?a","?a",1314302913,null)], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.list(new cljs.core.Symbol(null,">=",">=",1016916022,null),new cljs.core.Symbol(null,"?a","?a",1314302913,null),(21))], null)], null),cljs.core.deref.call(null,db)));
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),"^^^^^  Drunkard Club  ^^^^^^",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ul","ul",-1349521403),(function (){var iter__17504__auto__ = ((function (db,drunkards){
return (function drinkers$core$drunkard_club_$_iter__22305(s__22306){
return (new cljs.core.LazySeq(null,((function (db,drunkards){
return (function (){
var s__22306__$1 = s__22306;
while(true){
var temp__4425__auto__ = cljs.core.seq.call(null,s__22306__$1);
if(temp__4425__auto__){
var s__22306__$2 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__22306__$2)){
var c__17502__auto__ = cljs.core.chunk_first.call(null,s__22306__$2);
var size__17503__auto__ = cljs.core.count.call(null,c__17502__auto__);
var b__22308 = cljs.core.chunk_buffer.call(null,size__17503__auto__);
if((function (){var i__22307 = (0);
while(true){
if((i__22307 < size__17503__auto__)){
var p = cljs.core._nth.call(null,c__17502__auto__,i__22307);
cljs.core.chunk_append.call(null,b__22308,cljs.core.with_meta(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"li","li",723558921),new cljs.core.Keyword("person","name","person/name",549444500).cljs$core$IFn$_invoke$arity$1(p)], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"key","key",-1516042587),new cljs.core.Keyword("db","id","db/id",-1388397098).cljs$core$IFn$_invoke$arity$1(p)], null)));

var G__22309 = (i__22307 + (1));
i__22307 = G__22309;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__22308),drinkers$core$drunkard_club_$_iter__22305.call(null,cljs.core.chunk_rest.call(null,s__22306__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__22308),null);
}
} else {
var p = cljs.core.first.call(null,s__22306__$2);
return cljs.core.cons.call(null,cljs.core.with_meta(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"li","li",723558921),new cljs.core.Keyword("person","name","person/name",549444500).cljs$core$IFn$_invoke$arity$1(p)], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"key","key",-1516042587),new cljs.core.Keyword("db","id","db/id",-1388397098).cljs$core$IFn$_invoke$arity$1(p)], null)),drinkers$core$drunkard_club_$_iter__22305.call(null,cljs.core.rest.call(null,s__22306__$2)));
}
} else {
return null;
}
break;
}
});})(db,drunkards))
,null,null));
});})(db,drunkards))
;
return iter__17504__auto__.call(null,drunkards);
})()], null)], null);
});
drinkers.core.person = (function drinkers$core$person(id){
var db = posh.core.db_tx.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [id], null)], null));
return ((function (db){
return (function (id__$1){
var p = datascript.core.entity.call(null,cljs.core.deref.call(null,db),id__$1);
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"on-click","on-click",1632826543),((function (p,db){
return (function (){
return posh.core.transact.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("db","add","db/add",235286841),id__$1,new cljs.core.Keyword("person","age","person/age",387881455),cljs.core.rand_int.call(null,(30))], null)], null));
});})(p,db))
], null),cljs.core.pr_str.call(null,datascript.core.touch.call(null,p))], null);
});
;})(db))
});
drinkers.core.group = (function drinkers$core$group(group_id){
var db = posh.core.db_tx.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [group_id], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.Keyword("person","group","person/group",1608391413),group_id], null),cljs.core.PersistentArrayMap.fromArray([new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Keyword("person","name","person/name",549444500),new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.Symbol(null,"_","_",-1201019570,null),true], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Keyword("person","group","person/group",1608391413),group_id], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Keyword("person","group","person/group",1608391413),new cljs.core.Symbol(null,"?g","?g",589440221,null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?g","?g",589440221,null),new cljs.core.Keyword("group","sort-by","group/sort-by",-420965382),new cljs.core.Keyword("person","name","person/name",549444500)], null)], null)], true, false),cljs.core.PersistentArrayMap.fromArray([new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Keyword("person","age","person/age",387881455),new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.Symbol(null,"_","_",-1201019570,null),true], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Keyword("person","group","person/group",1608391413),group_id], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Keyword("person","group","person/group",1608391413),new cljs.core.Symbol(null,"?g","?g",589440221,null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?g","?g",589440221,null),new cljs.core.Keyword("group","sort-by","group/sort-by",-420965382),new cljs.core.Keyword("person","age","person/age",387881455)], null)], null)], true, false)], null));
return ((function (db){
return (function (){
var g = datascript.core.entity.call(null,cljs.core.deref.call(null,db),group_id);
var members = cljs.core.map.call(null,((function (g,db){
return (function (p1__22310_SHARP_){
return datascript.core.entity.call(null,cljs.core.deref.call(null,db),p1__22310_SHARP_);
});})(g,db))
,datascript.core.q.call(null,new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"find","find",496279456),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Symbol(null,"...","...",-1926939749,null)], null),new cljs.core.Keyword(null,"in","in",-1531184865),new cljs.core.Symbol(null,"$","$",-1580747756,null),new cljs.core.Symbol(null,"?g","?g",589440221,null),new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?p","?p",-10896580,null),new cljs.core.Keyword("person","group","person/group",1608391413),new cljs.core.Symbol(null,"?g","?g",589440221,null)], null)], null),cljs.core.deref.call(null,db),group_id));
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632)," +++++ ",g.call(null,new cljs.core.Keyword("group","name","group/name",1606764202))," +++++ "], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ul","ul",-1349521403),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),cljs.core.pr_str.call(null,cljs.core.map.call(null,new cljs.core.Keyword("person","age","person/age",387881455),cljs.core.sort_by.call(null,new cljs.core.Keyword("person","age","person/age",387881455),members)))], null),cljs.core.map.call(null,((function (g,members,db){
return (function (p){
return cljs.core.with_meta(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [drinkers.core.person,new cljs.core.Keyword("db","id","db/id",-1388397098).cljs$core$IFn$_invoke$arity$1(p)], null)], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"key","key",-1516042587),p], null));
});})(g,members,db))
,cljs.core.sort_by.call(null,g.call(null,new cljs.core.Keyword("group","sort-by","group/sort-by",-420965382)),members))], null)], null);
});
;})(db))
});
drinkers.core.groups = (function drinkers$core$groups(){
var db = posh.core.db_tx.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.Keyword("group","name","group/name",1606764202)], null)], null));
return ((function (db){
return (function (){
var group_ids = datascript.core.q.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"find","find",496279456),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?id","?id",928433279,null),new cljs.core.Symbol(null,"...","...",-1926939749,null)], null),new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?id","?id",928433279,null),new cljs.core.Keyword("group","name","group/name",1606764202),new cljs.core.Symbol(null,"_","_",-1201019570,null)], null)], null),cljs.core.deref.call(null,db));
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),"-----------------GROUPS----------------",cljs.core.map.call(null,((function (group_ids,db){
return (function (g){
return cljs.core.with_meta(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [drinkers.core.group,g], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"key","key",-1516042587),g], null));
});})(group_ids,db))
,group_ids)], null);
});
;})(db))
});
drinkers.core.app = (function drinkers$core$app(){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"div","div",1057191632),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [drinkers.core.drunkard_club], null),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [drinkers.core.groups], null)], null);
});
drinkers.core.start = (function drinkers$core$start(){
return reagent.core.render_component.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [drinkers.core.app], null),document.getElementById("app"));
});
drinkers.core.start.call(null);

//# sourceMappingURL=core.js.map