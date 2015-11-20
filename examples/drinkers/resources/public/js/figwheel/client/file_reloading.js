// Compiled by ClojureScript 1.7.170 {}
goog.provide('figwheel.client.file_reloading');
goog.require('cljs.core');
goog.require('goog.string');
goog.require('goog.Uri');
goog.require('goog.net.jsloader');
goog.require('cljs.core.async');
goog.require('goog.object');
goog.require('clojure.set');
goog.require('clojure.string');
goog.require('figwheel.client.utils');
figwheel.client.file_reloading.queued_file_reload;
if(typeof figwheel.client.file_reloading.figwheel_meta_pragmas !== 'undefined'){
} else {
figwheel.client.file_reloading.figwheel_meta_pragmas = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
}
figwheel.client.file_reloading.on_jsload_custom_event = (function figwheel$client$file_reloading$on_jsload_custom_event(url){
return figwheel.client.utils.dispatch_custom_event.call(null,"figwheel.js-reload",url);
});
figwheel.client.file_reloading.before_jsload_custom_event = (function figwheel$client$file_reloading$before_jsload_custom_event(files){
return figwheel.client.utils.dispatch_custom_event.call(null,"figwheel.before-js-reload",files);
});
figwheel.client.file_reloading.namespace_file_map_QMARK_ = (function figwheel$client$file_reloading$namespace_file_map_QMARK_(m){
var or__16732__auto__ = (cljs.core.map_QMARK_.call(null,m)) && (typeof new cljs.core.Keyword(null,"namespace","namespace",-377510372).cljs$core$IFn$_invoke$arity$1(m) === 'string') && (((new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(m) == null)) || (typeof new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(m) === 'string')) && (cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(m),new cljs.core.Keyword(null,"namespace","namespace",-377510372)));
if(or__16732__auto__){
return or__16732__auto__;
} else {
cljs.core.println.call(null,"Error not namespace-file-map",cljs.core.pr_str.call(null,m));

return false;
}
});
figwheel.client.file_reloading.add_cache_buster = (function figwheel$client$file_reloading$add_cache_buster(url){

return goog.Uri.parse(url).makeUnique();
});
figwheel.client.file_reloading.name__GT_path = (function figwheel$client$file_reloading$name__GT_path(ns){

return (goog.dependencies_.nameToPath[ns]);
});
figwheel.client.file_reloading.provided_QMARK_ = (function figwheel$client$file_reloading$provided_QMARK_(ns){
return (goog.dependencies_.written[figwheel.client.file_reloading.name__GT_path.call(null,ns)]);
});
figwheel.client.file_reloading.fix_node_request_url = (function figwheel$client$file_reloading$fix_node_request_url(url){

if(cljs.core.truth_(goog.string.startsWith(url,"../"))){
return clojure.string.replace.call(null,url,"../","");
} else {
return [cljs.core.str("goog/"),cljs.core.str(url)].join('');
}
});
figwheel.client.file_reloading.immutable_ns_QMARK_ = (function figwheel$client$file_reloading$immutable_ns_QMARK_(name){
var or__16732__auto__ = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 9, ["svgpan.SvgPan",null,"far.out",null,"testDep.bar",null,"someprotopackage.TestPackageTypes",null,"goog",null,"an.existing.path",null,"cljs.core",null,"ns",null,"dup.base",null], null), null).call(null,name);
if(cljs.core.truth_(or__16732__auto__)){
return or__16732__auto__;
} else {
return cljs.core.some.call(null,cljs.core.partial.call(null,goog.string.startsWith,name),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, ["goog.","cljs.","clojure.","fake.","proto2."], null));
}
});
figwheel.client.file_reloading.get_requires = (function figwheel$client$file_reloading$get_requires(ns){
return cljs.core.set.call(null,cljs.core.filter.call(null,(function (p1__26105_SHARP_){
return cljs.core.not.call(null,figwheel.client.file_reloading.immutable_ns_QMARK_.call(null,p1__26105_SHARP_));
}),goog.object.getKeys((goog.dependencies_.requires[figwheel.client.file_reloading.name__GT_path.call(null,ns)]))));
});
if(typeof figwheel.client.file_reloading.dependency_data !== 'undefined'){
} else {
figwheel.client.file_reloading.dependency_data = cljs.core.atom.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"pathToName","pathToName",-1236616181),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"dependents","dependents",136812837),cljs.core.PersistentArrayMap.EMPTY], null));
}
figwheel.client.file_reloading.path_to_name_BANG_ = (function figwheel$client$file_reloading$path_to_name_BANG_(path,name){
return cljs.core.swap_BANG_.call(null,figwheel.client.file_reloading.dependency_data,cljs.core.update_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"pathToName","pathToName",-1236616181),path], null),cljs.core.fnil.call(null,clojure.set.union,cljs.core.PersistentHashSet.EMPTY),cljs.core.PersistentHashSet.fromArray([name], true));
});
/**
 * Setup a path to name dependencies map.
 * That goes from path -> #{ ns-names }
 */
figwheel.client.file_reloading.setup_path__GT_name_BANG_ = (function figwheel$client$file_reloading$setup_path__GT_name_BANG_(){
var nameToPath = goog.object.filter(goog.dependencies_.nameToPath,(function (v,k,o){
return goog.string.startsWith(v,"../");
}));
return goog.object.forEach(nameToPath,((function (nameToPath){
return (function (v,k,o){
return figwheel.client.file_reloading.path_to_name_BANG_.call(null,v,k);
});})(nameToPath))
);
});
/**
 * returns a set of namespaces defined by a path
 */
figwheel.client.file_reloading.path__GT_name = (function figwheel$client$file_reloading$path__GT_name(path){
return cljs.core.get_in.call(null,cljs.core.deref.call(null,figwheel.client.file_reloading.dependency_data),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"pathToName","pathToName",-1236616181),path], null));
});
figwheel.client.file_reloading.name_to_parent_BANG_ = (function figwheel$client$file_reloading$name_to_parent_BANG_(ns,parent_ns){
return cljs.core.swap_BANG_.call(null,figwheel.client.file_reloading.dependency_data,cljs.core.update_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"dependents","dependents",136812837),ns], null),cljs.core.fnil.call(null,clojure.set.union,cljs.core.PersistentHashSet.EMPTY),cljs.core.PersistentHashSet.fromArray([parent_ns], true));
});
/**
 * This reverses the goog.dependencies_.requires for looking up ns-dependents.
 */
figwheel.client.file_reloading.setup_ns__GT_dependents_BANG_ = (function figwheel$client$file_reloading$setup_ns__GT_dependents_BANG_(){
var requires = goog.object.filter(goog.dependencies_.requires,(function (v,k,o){
return goog.string.startsWith(k,"../");
}));
return goog.object.forEach(requires,((function (requires){
return (function (v,k,_){
return goog.object.forEach(v,((function (requires){
return (function (v_SINGLEQUOTE_,k_SINGLEQUOTE_,___$1){
var seq__26110 = cljs.core.seq.call(null,figwheel.client.file_reloading.path__GT_name.call(null,k));
var chunk__26111 = null;
var count__26112 = (0);
var i__26113 = (0);
while(true){
if((i__26113 < count__26112)){
var n = cljs.core._nth.call(null,chunk__26111,i__26113);
figwheel.client.file_reloading.name_to_parent_BANG_.call(null,k_SINGLEQUOTE_,n);

var G__26114 = seq__26110;
var G__26115 = chunk__26111;
var G__26116 = count__26112;
var G__26117 = (i__26113 + (1));
seq__26110 = G__26114;
chunk__26111 = G__26115;
count__26112 = G__26116;
i__26113 = G__26117;
continue;
} else {
var temp__4425__auto__ = cljs.core.seq.call(null,seq__26110);
if(temp__4425__auto__){
var seq__26110__$1 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__26110__$1)){
var c__17535__auto__ = cljs.core.chunk_first.call(null,seq__26110__$1);
var G__26118 = cljs.core.chunk_rest.call(null,seq__26110__$1);
var G__26119 = c__17535__auto__;
var G__26120 = cljs.core.count.call(null,c__17535__auto__);
var G__26121 = (0);
seq__26110 = G__26118;
chunk__26111 = G__26119;
count__26112 = G__26120;
i__26113 = G__26121;
continue;
} else {
var n = cljs.core.first.call(null,seq__26110__$1);
figwheel.client.file_reloading.name_to_parent_BANG_.call(null,k_SINGLEQUOTE_,n);

var G__26122 = cljs.core.next.call(null,seq__26110__$1);
var G__26123 = null;
var G__26124 = (0);
var G__26125 = (0);
seq__26110 = G__26122;
chunk__26111 = G__26123;
count__26112 = G__26124;
i__26113 = G__26125;
continue;
}
} else {
return null;
}
}
break;
}
});})(requires))
);
});})(requires))
);
});
figwheel.client.file_reloading.ns__GT_dependents = (function figwheel$client$file_reloading$ns__GT_dependents(ns){
return cljs.core.get_in.call(null,cljs.core.deref.call(null,figwheel.client.file_reloading.dependency_data),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"dependents","dependents",136812837),ns], null));
});
figwheel.client.file_reloading.build_topo_sort = (function figwheel$client$file_reloading$build_topo_sort(get_deps){
var get_deps__$1 = cljs.core.memoize.call(null,get_deps);
var topo_sort_helper_STAR_ = ((function (get_deps__$1){
return (function figwheel$client$file_reloading$build_topo_sort_$_topo_sort_helper_STAR_(x,depth,state){
var deps = get_deps__$1.call(null,x);
if(cljs.core.empty_QMARK_.call(null,deps)){
return null;
} else {
return topo_sort_STAR_.call(null,deps,depth,state);
}
});})(get_deps__$1))
;
var topo_sort_STAR_ = ((function (get_deps__$1){
return (function() {
var figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR_ = null;
var figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR___1 = (function (deps){
return figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR_.call(null,deps,(0),cljs.core.atom.call(null,cljs.core.sorted_map.call(null)));
});
var figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR___3 = (function (deps,depth,state){
cljs.core.swap_BANG_.call(null,state,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [depth], null),cljs.core.fnil.call(null,cljs.core.into,cljs.core.PersistentHashSet.EMPTY),deps);

var seq__26164_26171 = cljs.core.seq.call(null,deps);
var chunk__26165_26172 = null;
var count__26166_26173 = (0);
var i__26167_26174 = (0);
while(true){
if((i__26167_26174 < count__26166_26173)){
var dep_26175 = cljs.core._nth.call(null,chunk__26165_26172,i__26167_26174);
topo_sort_helper_STAR_.call(null,dep_26175,(depth + (1)),state);

var G__26176 = seq__26164_26171;
var G__26177 = chunk__26165_26172;
var G__26178 = count__26166_26173;
var G__26179 = (i__26167_26174 + (1));
seq__26164_26171 = G__26176;
chunk__26165_26172 = G__26177;
count__26166_26173 = G__26178;
i__26167_26174 = G__26179;
continue;
} else {
var temp__4425__auto___26180 = cljs.core.seq.call(null,seq__26164_26171);
if(temp__4425__auto___26180){
var seq__26164_26181__$1 = temp__4425__auto___26180;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__26164_26181__$1)){
var c__17535__auto___26182 = cljs.core.chunk_first.call(null,seq__26164_26181__$1);
var G__26183 = cljs.core.chunk_rest.call(null,seq__26164_26181__$1);
var G__26184 = c__17535__auto___26182;
var G__26185 = cljs.core.count.call(null,c__17535__auto___26182);
var G__26186 = (0);
seq__26164_26171 = G__26183;
chunk__26165_26172 = G__26184;
count__26166_26173 = G__26185;
i__26167_26174 = G__26186;
continue;
} else {
var dep_26187 = cljs.core.first.call(null,seq__26164_26181__$1);
topo_sort_helper_STAR_.call(null,dep_26187,(depth + (1)),state);

var G__26188 = cljs.core.next.call(null,seq__26164_26181__$1);
var G__26189 = null;
var G__26190 = (0);
var G__26191 = (0);
seq__26164_26171 = G__26188;
chunk__26165_26172 = G__26189;
count__26166_26173 = G__26190;
i__26167_26174 = G__26191;
continue;
}
} else {
}
}
break;
}

if(cljs.core._EQ_.call(null,depth,(0))){
return elim_dups_STAR_.call(null,cljs.core.reverse.call(null,cljs.core.vals.call(null,cljs.core.deref.call(null,state))));
} else {
return null;
}
});
figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR_ = function(deps,depth,state){
switch(arguments.length){
case 1:
return figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR___1.call(this,deps);
case 3:
return figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR___3.call(this,deps,depth,state);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR_.cljs$core$IFn$_invoke$arity$1 = figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR___1;
figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR_.cljs$core$IFn$_invoke$arity$3 = figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR___3;
return figwheel$client$file_reloading$build_topo_sort_$_topo_sort_STAR_;
})()
;})(get_deps__$1))
;
var elim_dups_STAR_ = ((function (get_deps__$1){
return (function figwheel$client$file_reloading$build_topo_sort_$_elim_dups_STAR_(p__26168){
var vec__26170 = p__26168;
var x = cljs.core.nth.call(null,vec__26170,(0),null);
var xs = cljs.core.nthnext.call(null,vec__26170,(1));
if((x == null)){
return cljs.core.List.EMPTY;
} else {
return cljs.core.cons.call(null,x,figwheel$client$file_reloading$build_topo_sort_$_elim_dups_STAR_.call(null,cljs.core.map.call(null,((function (vec__26170,x,xs,get_deps__$1){
return (function (p1__26126_SHARP_){
return clojure.set.difference.call(null,p1__26126_SHARP_,x);
});})(vec__26170,x,xs,get_deps__$1))
,xs)));
}
});})(get_deps__$1))
;
return topo_sort_STAR_;
});
figwheel.client.file_reloading.get_all_dependencies = (function figwheel$client$file_reloading$get_all_dependencies(ns){
var topo_sort_SINGLEQUOTE_ = figwheel.client.file_reloading.build_topo_sort.call(null,figwheel.client.file_reloading.get_requires);
return cljs.core.apply.call(null,cljs.core.concat,topo_sort_SINGLEQUOTE_.call(null,cljs.core.set.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [ns], null))));
});
figwheel.client.file_reloading.get_all_dependents = (function figwheel$client$file_reloading$get_all_dependents(nss){
var topo_sort_SINGLEQUOTE_ = figwheel.client.file_reloading.build_topo_sort.call(null,figwheel.client.file_reloading.ns__GT_dependents);
return cljs.core.reverse.call(null,cljs.core.apply.call(null,cljs.core.concat,topo_sort_SINGLEQUOTE_.call(null,cljs.core.set.call(null,nss))));
});
figwheel.client.file_reloading.unprovide_BANG_ = (function figwheel$client$file_reloading$unprovide_BANG_(ns){
var path = figwheel.client.file_reloading.name__GT_path.call(null,ns);
goog.object.remove(goog.dependencies_.visited,path);

goog.object.remove(goog.dependencies_.written,path);

return goog.object.remove(goog.dependencies_.written,[cljs.core.str(goog.basePath),cljs.core.str(path)].join(''));
});
figwheel.client.file_reloading.resolve_ns = (function figwheel$client$file_reloading$resolve_ns(ns){
return [cljs.core.str(goog.basePath),cljs.core.str(figwheel.client.file_reloading.name__GT_path.call(null,ns))].join('');
});
figwheel.client.file_reloading.addDependency = (function figwheel$client$file_reloading$addDependency(path,provides,requires){
var seq__26204 = cljs.core.seq.call(null,provides);
var chunk__26205 = null;
var count__26206 = (0);
var i__26207 = (0);
while(true){
if((i__26207 < count__26206)){
var prov = cljs.core._nth.call(null,chunk__26205,i__26207);
figwheel.client.file_reloading.path_to_name_BANG_.call(null,path,prov);

var seq__26208_26216 = cljs.core.seq.call(null,requires);
var chunk__26209_26217 = null;
var count__26210_26218 = (0);
var i__26211_26219 = (0);
while(true){
if((i__26211_26219 < count__26210_26218)){
var req_26220 = cljs.core._nth.call(null,chunk__26209_26217,i__26211_26219);
figwheel.client.file_reloading.name_to_parent_BANG_.call(null,req_26220,prov);

var G__26221 = seq__26208_26216;
var G__26222 = chunk__26209_26217;
var G__26223 = count__26210_26218;
var G__26224 = (i__26211_26219 + (1));
seq__26208_26216 = G__26221;
chunk__26209_26217 = G__26222;
count__26210_26218 = G__26223;
i__26211_26219 = G__26224;
continue;
} else {
var temp__4425__auto___26225 = cljs.core.seq.call(null,seq__26208_26216);
if(temp__4425__auto___26225){
var seq__26208_26226__$1 = temp__4425__auto___26225;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__26208_26226__$1)){
var c__17535__auto___26227 = cljs.core.chunk_first.call(null,seq__26208_26226__$1);
var G__26228 = cljs.core.chunk_rest.call(null,seq__26208_26226__$1);
var G__26229 = c__17535__auto___26227;
var G__26230 = cljs.core.count.call(null,c__17535__auto___26227);
var G__26231 = (0);
seq__26208_26216 = G__26228;
chunk__26209_26217 = G__26229;
count__26210_26218 = G__26230;
i__26211_26219 = G__26231;
continue;
} else {
var req_26232 = cljs.core.first.call(null,seq__26208_26226__$1);
figwheel.client.file_reloading.name_to_parent_BANG_.call(null,req_26232,prov);

var G__26233 = cljs.core.next.call(null,seq__26208_26226__$1);
var G__26234 = null;
var G__26235 = (0);
var G__26236 = (0);
seq__26208_26216 = G__26233;
chunk__26209_26217 = G__26234;
count__26210_26218 = G__26235;
i__26211_26219 = G__26236;
continue;
}
} else {
}
}
break;
}

var G__26237 = seq__26204;
var G__26238 = chunk__26205;
var G__26239 = count__26206;
var G__26240 = (i__26207 + (1));
seq__26204 = G__26237;
chunk__26205 = G__26238;
count__26206 = G__26239;
i__26207 = G__26240;
continue;
} else {
var temp__4425__auto__ = cljs.core.seq.call(null,seq__26204);
if(temp__4425__auto__){
var seq__26204__$1 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__26204__$1)){
var c__17535__auto__ = cljs.core.chunk_first.call(null,seq__26204__$1);
var G__26241 = cljs.core.chunk_rest.call(null,seq__26204__$1);
var G__26242 = c__17535__auto__;
var G__26243 = cljs.core.count.call(null,c__17535__auto__);
var G__26244 = (0);
seq__26204 = G__26241;
chunk__26205 = G__26242;
count__26206 = G__26243;
i__26207 = G__26244;
continue;
} else {
var prov = cljs.core.first.call(null,seq__26204__$1);
figwheel.client.file_reloading.path_to_name_BANG_.call(null,path,prov);

var seq__26212_26245 = cljs.core.seq.call(null,requires);
var chunk__26213_26246 = null;
var count__26214_26247 = (0);
var i__26215_26248 = (0);
while(true){
if((i__26215_26248 < count__26214_26247)){
var req_26249 = cljs.core._nth.call(null,chunk__26213_26246,i__26215_26248);
figwheel.client.file_reloading.name_to_parent_BANG_.call(null,req_26249,prov);

var G__26250 = seq__26212_26245;
var G__26251 = chunk__26213_26246;
var G__26252 = count__26214_26247;
var G__26253 = (i__26215_26248 + (1));
seq__26212_26245 = G__26250;
chunk__26213_26246 = G__26251;
count__26214_26247 = G__26252;
i__26215_26248 = G__26253;
continue;
} else {
var temp__4425__auto___26254__$1 = cljs.core.seq.call(null,seq__26212_26245);
if(temp__4425__auto___26254__$1){
var seq__26212_26255__$1 = temp__4425__auto___26254__$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__26212_26255__$1)){
var c__17535__auto___26256 = cljs.core.chunk_first.call(null,seq__26212_26255__$1);
var G__26257 = cljs.core.chunk_rest.call(null,seq__26212_26255__$1);
var G__26258 = c__17535__auto___26256;
var G__26259 = cljs.core.count.call(null,c__17535__auto___26256);
var G__26260 = (0);
seq__26212_26245 = G__26257;
chunk__26213_26246 = G__26258;
count__26214_26247 = G__26259;
i__26215_26248 = G__26260;
continue;
} else {
var req_26261 = cljs.core.first.call(null,seq__26212_26255__$1);
figwheel.client.file_reloading.name_to_parent_BANG_.call(null,req_26261,prov);

var G__26262 = cljs.core.next.call(null,seq__26212_26255__$1);
var G__26263 = null;
var G__26264 = (0);
var G__26265 = (0);
seq__26212_26245 = G__26262;
chunk__26213_26246 = G__26263;
count__26214_26247 = G__26264;
i__26215_26248 = G__26265;
continue;
}
} else {
}
}
break;
}

var G__26266 = cljs.core.next.call(null,seq__26204__$1);
var G__26267 = null;
var G__26268 = (0);
var G__26269 = (0);
seq__26204 = G__26266;
chunk__26205 = G__26267;
count__26206 = G__26268;
i__26207 = G__26269;
continue;
}
} else {
return null;
}
}
break;
}
});
figwheel.client.file_reloading.figwheel_require = (function figwheel$client$file_reloading$figwheel_require(src,reload){
goog.require = figwheel$client$file_reloading$figwheel_require;

if(cljs.core._EQ_.call(null,reload,"reload-all")){
var seq__26274_26278 = cljs.core.seq.call(null,figwheel.client.file_reloading.get_all_dependencies.call(null,src));
var chunk__26275_26279 = null;
var count__26276_26280 = (0);
var i__26277_26281 = (0);
while(true){
if((i__26277_26281 < count__26276_26280)){
var ns_26282 = cljs.core._nth.call(null,chunk__26275_26279,i__26277_26281);
figwheel.client.file_reloading.unprovide_BANG_.call(null,ns_26282);

var G__26283 = seq__26274_26278;
var G__26284 = chunk__26275_26279;
var G__26285 = count__26276_26280;
var G__26286 = (i__26277_26281 + (1));
seq__26274_26278 = G__26283;
chunk__26275_26279 = G__26284;
count__26276_26280 = G__26285;
i__26277_26281 = G__26286;
continue;
} else {
var temp__4425__auto___26287 = cljs.core.seq.call(null,seq__26274_26278);
if(temp__4425__auto___26287){
var seq__26274_26288__$1 = temp__4425__auto___26287;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__26274_26288__$1)){
var c__17535__auto___26289 = cljs.core.chunk_first.call(null,seq__26274_26288__$1);
var G__26290 = cljs.core.chunk_rest.call(null,seq__26274_26288__$1);
var G__26291 = c__17535__auto___26289;
var G__26292 = cljs.core.count.call(null,c__17535__auto___26289);
var G__26293 = (0);
seq__26274_26278 = G__26290;
chunk__26275_26279 = G__26291;
count__26276_26280 = G__26292;
i__26277_26281 = G__26293;
continue;
} else {
var ns_26294 = cljs.core.first.call(null,seq__26274_26288__$1);
figwheel.client.file_reloading.unprovide_BANG_.call(null,ns_26294);

var G__26295 = cljs.core.next.call(null,seq__26274_26288__$1);
var G__26296 = null;
var G__26297 = (0);
var G__26298 = (0);
seq__26274_26278 = G__26295;
chunk__26275_26279 = G__26296;
count__26276_26280 = G__26297;
i__26277_26281 = G__26298;
continue;
}
} else {
}
}
break;
}
} else {
}

if(cljs.core.truth_(reload)){
figwheel.client.file_reloading.unprovide_BANG_.call(null,src);
} else {
}

return goog.require_figwheel_backup_(src);
});
/**
 * Reusable browser REPL bootstrapping. Patches the essential functions
 *   in goog.base to support re-loading of namespaces after page load.
 */
figwheel.client.file_reloading.bootstrap_goog_base = (function figwheel$client$file_reloading$bootstrap_goog_base(){
if(cljs.core.truth_(COMPILED)){
return null;
} else {
goog.require_figwheel_backup_ = (function (){var or__16732__auto__ = goog.require__;
if(cljs.core.truth_(or__16732__auto__)){
return or__16732__auto__;
} else {
return goog.require;
}
})();

goog.isProvided_ = (function (name){
return false;
});

figwheel.client.file_reloading.setup_path__GT_name_BANG_.call(null);

figwheel.client.file_reloading.setup_ns__GT_dependents_BANG_.call(null);

goog.addDependency_figwheel_backup_ = goog.addDependency;

goog.addDependency = (function() { 
var G__26299__delegate = function (args){
cljs.core.apply.call(null,figwheel.client.file_reloading.addDependency,args);

return cljs.core.apply.call(null,goog.addDependency_figwheel_backup_,args);
};
var G__26299 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__26300__i = 0, G__26300__a = new Array(arguments.length -  0);
while (G__26300__i < G__26300__a.length) {G__26300__a[G__26300__i] = arguments[G__26300__i + 0]; ++G__26300__i;}
  args = new cljs.core.IndexedSeq(G__26300__a,0);
} 
return G__26299__delegate.call(this,args);};
G__26299.cljs$lang$maxFixedArity = 0;
G__26299.cljs$lang$applyTo = (function (arglist__26301){
var args = cljs.core.seq(arglist__26301);
return G__26299__delegate(args);
});
G__26299.cljs$core$IFn$_invoke$arity$variadic = G__26299__delegate;
return G__26299;
})()
;

goog.constructNamespace_("cljs.user");

goog.global.CLOSURE_IMPORT_SCRIPT = figwheel.client.file_reloading.queued_file_reload;

return goog.require = figwheel.client.file_reloading.figwheel_require;
}
});
figwheel.client.file_reloading.patch_goog_base = (function figwheel$client$file_reloading$patch_goog_base(){
if(typeof figwheel.client.file_reloading.bootstrapped_cljs !== 'undefined'){
return null;
} else {
figwheel.client.file_reloading.bootstrapped_cljs = (function (){
figwheel.client.file_reloading.bootstrap_goog_base.call(null);

return true;
})()
;
}
});
figwheel.client.file_reloading.reload_file_STAR_ = (function (){var pred__26303 = cljs.core._EQ_;
var expr__26304 = figwheel.client.utils.host_env_QMARK_.call(null);
if(cljs.core.truth_(pred__26303.call(null,new cljs.core.Keyword(null,"node","node",581201198),expr__26304))){
var path_parts = ((function (pred__26303,expr__26304){
return (function (p1__26302_SHARP_){
return clojure.string.split.call(null,p1__26302_SHARP_,/[\/\\]/);
});})(pred__26303,expr__26304))
;
var sep = (cljs.core.truth_(cljs.core.re_matches.call(null,/win.*/,process.platform))?"\\":"/");
var root = clojure.string.join.call(null,sep,cljs.core.pop.call(null,cljs.core.pop.call(null,path_parts.call(null,__dirname))));
return ((function (path_parts,sep,root,pred__26303,expr__26304){
return (function (request_url,callback){

var cache_path = clojure.string.join.call(null,sep,cljs.core.cons.call(null,root,path_parts.call(null,figwheel.client.file_reloading.fix_node_request_url.call(null,request_url))));
(require.cache[cache_path] = null);

return callback.call(null,(function (){try{return require(cache_path);
}catch (e26306){if((e26306 instanceof Error)){
var e = e26306;
figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"error","error",-978969032),[cljs.core.str("Figwheel: Error loading file "),cljs.core.str(cache_path)].join(''));

figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"error","error",-978969032),e.stack);

return false;
} else {
throw e26306;

}
}})());
});
;})(path_parts,sep,root,pred__26303,expr__26304))
} else {
if(cljs.core.truth_(pred__26303.call(null,new cljs.core.Keyword(null,"html","html",-998796897),expr__26304))){
return ((function (pred__26303,expr__26304){
return (function (request_url,callback){

var deferred = goog.net.jsloader.load(figwheel.client.file_reloading.add_cache_buster.call(null,request_url),{"cleanupWhenDone": true});
deferred.addCallback(((function (deferred,pred__26303,expr__26304){
return (function (){
return cljs.core.apply.call(null,callback,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [true], null));
});})(deferred,pred__26303,expr__26304))
);

return deferred.addErrback(((function (deferred,pred__26303,expr__26304){
return (function (){
return cljs.core.apply.call(null,callback,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [false], null));
});})(deferred,pred__26303,expr__26304))
);
});
;})(pred__26303,expr__26304))
} else {
return ((function (pred__26303,expr__26304){
return (function (a,b){
throw "Reload not defined for this platform";
});
;})(pred__26303,expr__26304))
}
}
})();
figwheel.client.file_reloading.reload_file = (function figwheel$client$file_reloading$reload_file(p__26307,callback){
var map__26310 = p__26307;
var map__26310__$1 = ((((!((map__26310 == null)))?((((map__26310.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26310.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26310):map__26310);
var file_msg = map__26310__$1;
var request_url = cljs.core.get.call(null,map__26310__$1,new cljs.core.Keyword(null,"request-url","request-url",2100346596));

figwheel.client.utils.debug_prn.call(null,[cljs.core.str("FigWheel: Attempting to load "),cljs.core.str(request_url)].join(''));

return figwheel.client.file_reloading.reload_file_STAR_.call(null,request_url,((function (map__26310,map__26310__$1,file_msg,request_url){
return (function (success_QMARK_){
if(cljs.core.truth_(success_QMARK_)){
figwheel.client.utils.debug_prn.call(null,[cljs.core.str("FigWheel: Successfully loaded "),cljs.core.str(request_url)].join(''));

return cljs.core.apply.call(null,callback,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.assoc.call(null,file_msg,new cljs.core.Keyword(null,"loaded-file","loaded-file",-168399375),true)], null));
} else {
figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"error","error",-978969032),[cljs.core.str("Figwheel: Error loading file "),cljs.core.str(request_url)].join(''));

return cljs.core.apply.call(null,callback,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [file_msg], null));
}
});})(map__26310,map__26310__$1,file_msg,request_url))
);
});
if(typeof figwheel.client.file_reloading.reload_chan !== 'undefined'){
} else {
figwheel.client.file_reloading.reload_chan = cljs.core.async.chan.call(null);
}
if(typeof figwheel.client.file_reloading.on_load_callbacks !== 'undefined'){
} else {
figwheel.client.file_reloading.on_load_callbacks = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
}
if(typeof figwheel.client.file_reloading.dependencies_loaded !== 'undefined'){
} else {
figwheel.client.file_reloading.dependencies_loaded = cljs.core.atom.call(null,cljs.core.PersistentVector.EMPTY);
}
figwheel.client.file_reloading.blocking_load = (function figwheel$client$file_reloading$blocking_load(url){
var out = cljs.core.async.chan.call(null);
figwheel.client.file_reloading.reload_file.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"request-url","request-url",2100346596),url], null),((function (out){
return (function (file_msg){
cljs.core.async.put_BANG_.call(null,out,file_msg);

return cljs.core.async.close_BANG_.call(null,out);
});})(out))
);

return out;
});
if(typeof figwheel.client.file_reloading.reloader_loop !== 'undefined'){
} else {
figwheel.client.file_reloading.reloader_loop = (function (){var c__23272__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto__){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto__){
return (function (state_26334){
var state_val_26335 = (state_26334[(1)]);
if((state_val_26335 === (7))){
var inst_26330 = (state_26334[(2)]);
var state_26334__$1 = state_26334;
var statearr_26336_26356 = state_26334__$1;
(statearr_26336_26356[(2)] = inst_26330);

(statearr_26336_26356[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26335 === (1))){
var state_26334__$1 = state_26334;
var statearr_26337_26357 = state_26334__$1;
(statearr_26337_26357[(2)] = null);

(statearr_26337_26357[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26335 === (4))){
var inst_26314 = (state_26334[(7)]);
var inst_26314__$1 = (state_26334[(2)]);
var state_26334__$1 = (function (){var statearr_26338 = state_26334;
(statearr_26338[(7)] = inst_26314__$1);

return statearr_26338;
})();
if(cljs.core.truth_(inst_26314__$1)){
var statearr_26339_26358 = state_26334__$1;
(statearr_26339_26358[(1)] = (5));

} else {
var statearr_26340_26359 = state_26334__$1;
(statearr_26340_26359[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26335 === (6))){
var state_26334__$1 = state_26334;
var statearr_26341_26360 = state_26334__$1;
(statearr_26341_26360[(2)] = null);

(statearr_26341_26360[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26335 === (3))){
var inst_26332 = (state_26334[(2)]);
var state_26334__$1 = state_26334;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_26334__$1,inst_26332);
} else {
if((state_val_26335 === (2))){
var state_26334__$1 = state_26334;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_26334__$1,(4),figwheel.client.file_reloading.reload_chan);
} else {
if((state_val_26335 === (11))){
var inst_26326 = (state_26334[(2)]);
var state_26334__$1 = (function (){var statearr_26342 = state_26334;
(statearr_26342[(8)] = inst_26326);

return statearr_26342;
})();
var statearr_26343_26361 = state_26334__$1;
(statearr_26343_26361[(2)] = null);

(statearr_26343_26361[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26335 === (9))){
var inst_26318 = (state_26334[(9)]);
var inst_26320 = (state_26334[(10)]);
var inst_26322 = inst_26320.call(null,inst_26318);
var state_26334__$1 = state_26334;
var statearr_26344_26362 = state_26334__$1;
(statearr_26344_26362[(2)] = inst_26322);

(statearr_26344_26362[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26335 === (5))){
var inst_26314 = (state_26334[(7)]);
var inst_26316 = figwheel.client.file_reloading.blocking_load.call(null,inst_26314);
var state_26334__$1 = state_26334;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_26334__$1,(8),inst_26316);
} else {
if((state_val_26335 === (10))){
var inst_26318 = (state_26334[(9)]);
var inst_26324 = cljs.core.swap_BANG_.call(null,figwheel.client.file_reloading.dependencies_loaded,cljs.core.conj,inst_26318);
var state_26334__$1 = state_26334;
var statearr_26345_26363 = state_26334__$1;
(statearr_26345_26363[(2)] = inst_26324);

(statearr_26345_26363[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26335 === (8))){
var inst_26314 = (state_26334[(7)]);
var inst_26320 = (state_26334[(10)]);
var inst_26318 = (state_26334[(2)]);
var inst_26319 = cljs.core.deref.call(null,figwheel.client.file_reloading.on_load_callbacks);
var inst_26320__$1 = cljs.core.get.call(null,inst_26319,inst_26314);
var state_26334__$1 = (function (){var statearr_26346 = state_26334;
(statearr_26346[(9)] = inst_26318);

(statearr_26346[(10)] = inst_26320__$1);

return statearr_26346;
})();
if(cljs.core.truth_(inst_26320__$1)){
var statearr_26347_26364 = state_26334__$1;
(statearr_26347_26364[(1)] = (9));

} else {
var statearr_26348_26365 = state_26334__$1;
(statearr_26348_26365[(1)] = (10));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
});})(c__23272__auto__))
;
return ((function (switch__23207__auto__,c__23272__auto__){
return (function() {
var figwheel$client$file_reloading$state_machine__23208__auto__ = null;
var figwheel$client$file_reloading$state_machine__23208__auto____0 = (function (){
var statearr_26352 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_26352[(0)] = figwheel$client$file_reloading$state_machine__23208__auto__);

(statearr_26352[(1)] = (1));

return statearr_26352;
});
var figwheel$client$file_reloading$state_machine__23208__auto____1 = (function (state_26334){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_26334);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e26353){if((e26353 instanceof Object)){
var ex__23211__auto__ = e26353;
var statearr_26354_26366 = state_26334;
(statearr_26354_26366[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_26334);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e26353;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__26367 = state_26334;
state_26334 = G__26367;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
figwheel$client$file_reloading$state_machine__23208__auto__ = function(state_26334){
switch(arguments.length){
case 0:
return figwheel$client$file_reloading$state_machine__23208__auto____0.call(this);
case 1:
return figwheel$client$file_reloading$state_machine__23208__auto____1.call(this,state_26334);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
figwheel$client$file_reloading$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = figwheel$client$file_reloading$state_machine__23208__auto____0;
figwheel$client$file_reloading$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = figwheel$client$file_reloading$state_machine__23208__auto____1;
return figwheel$client$file_reloading$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto__))
})();
var state__23274__auto__ = (function (){var statearr_26355 = f__23273__auto__.call(null);
(statearr_26355[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto__);

return statearr_26355;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto__))
);

return c__23272__auto__;
})();
}
figwheel.client.file_reloading.queued_file_reload = (function figwheel$client$file_reloading$queued_file_reload(url){
return cljs.core.async.put_BANG_.call(null,figwheel.client.file_reloading.reload_chan,url);
});
figwheel.client.file_reloading.require_with_callback = (function figwheel$client$file_reloading$require_with_callback(p__26368,callback){
var map__26371 = p__26368;
var map__26371__$1 = ((((!((map__26371 == null)))?((((map__26371.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26371.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26371):map__26371);
var file_msg = map__26371__$1;
var namespace = cljs.core.get.call(null,map__26371__$1,new cljs.core.Keyword(null,"namespace","namespace",-377510372));
var request_url = figwheel.client.file_reloading.resolve_ns.call(null,namespace);
cljs.core.swap_BANG_.call(null,figwheel.client.file_reloading.on_load_callbacks,cljs.core.assoc,request_url,((function (request_url,map__26371,map__26371__$1,file_msg,namespace){
return (function (file_msg_SINGLEQUOTE_){
cljs.core.swap_BANG_.call(null,figwheel.client.file_reloading.on_load_callbacks,cljs.core.dissoc,request_url);

return cljs.core.apply.call(null,callback,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.merge.call(null,file_msg,cljs.core.select_keys.call(null,file_msg_SINGLEQUOTE_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"loaded-file","loaded-file",-168399375)], null)))], null));
});})(request_url,map__26371,map__26371__$1,file_msg,namespace))
);

return figwheel.client.file_reloading.figwheel_require.call(null,cljs.core.name.call(null,namespace),true);
});
figwheel.client.file_reloading.reload_file_QMARK_ = (function figwheel$client$file_reloading$reload_file_QMARK_(p__26373){
var map__26376 = p__26373;
var map__26376__$1 = ((((!((map__26376 == null)))?((((map__26376.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26376.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26376):map__26376);
var file_msg = map__26376__$1;
var namespace = cljs.core.get.call(null,map__26376__$1,new cljs.core.Keyword(null,"namespace","namespace",-377510372));

var meta_pragmas = cljs.core.get.call(null,cljs.core.deref.call(null,figwheel.client.file_reloading.figwheel_meta_pragmas),cljs.core.name.call(null,namespace));
var and__16720__auto__ = cljs.core.not.call(null,new cljs.core.Keyword(null,"figwheel-no-load","figwheel-no-load",-555840179).cljs$core$IFn$_invoke$arity$1(meta_pragmas));
if(and__16720__auto__){
var or__16732__auto__ = new cljs.core.Keyword(null,"figwheel-always","figwheel-always",799819691).cljs$core$IFn$_invoke$arity$1(meta_pragmas);
if(cljs.core.truth_(or__16732__auto__)){
return or__16732__auto__;
} else {
var or__16732__auto____$1 = new cljs.core.Keyword(null,"figwheel-load","figwheel-load",1316089175).cljs$core$IFn$_invoke$arity$1(meta_pragmas);
if(cljs.core.truth_(or__16732__auto____$1)){
return or__16732__auto____$1;
} else {
return figwheel.client.file_reloading.provided_QMARK_.call(null,cljs.core.name.call(null,namespace));
}
}
} else {
return and__16720__auto__;
}
});
figwheel.client.file_reloading.js_reload = (function figwheel$client$file_reloading$js_reload(p__26378,callback){
var map__26381 = p__26378;
var map__26381__$1 = ((((!((map__26381 == null)))?((((map__26381.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26381.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26381):map__26381);
var file_msg = map__26381__$1;
var request_url = cljs.core.get.call(null,map__26381__$1,new cljs.core.Keyword(null,"request-url","request-url",2100346596));
var namespace = cljs.core.get.call(null,map__26381__$1,new cljs.core.Keyword(null,"namespace","namespace",-377510372));

if(cljs.core.truth_(figwheel.client.file_reloading.reload_file_QMARK_.call(null,file_msg))){
return figwheel.client.file_reloading.require_with_callback.call(null,file_msg,callback);
} else {
figwheel.client.utils.debug_prn.call(null,[cljs.core.str("Figwheel: Not trying to load file "),cljs.core.str(request_url)].join(''));

return cljs.core.apply.call(null,callback,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [file_msg], null));
}
});
figwheel.client.file_reloading.reload_js_file = (function figwheel$client$file_reloading$reload_js_file(file_msg){
var out = cljs.core.async.chan.call(null);
figwheel.client.file_reloading.js_reload.call(null,file_msg,((function (out){
return (function (url){
cljs.core.async.put_BANG_.call(null,out,url);

return cljs.core.async.close_BANG_.call(null,out);
});})(out))
);

return out;
});
/**
 * Returns a chanel with one collection of loaded filenames on it.
 */
figwheel.client.file_reloading.load_all_js_files = (function figwheel$client$file_reloading$load_all_js_files(files){
var out = cljs.core.async.chan.call(null);
var c__23272__auto___26469 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___26469,out){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___26469,out){
return (function (state_26451){
var state_val_26452 = (state_26451[(1)]);
if((state_val_26452 === (1))){
var inst_26429 = cljs.core.nth.call(null,files,(0),null);
var inst_26430 = cljs.core.nthnext.call(null,files,(1));
var inst_26431 = files;
var state_26451__$1 = (function (){var statearr_26453 = state_26451;
(statearr_26453[(7)] = inst_26430);

(statearr_26453[(8)] = inst_26429);

(statearr_26453[(9)] = inst_26431);

return statearr_26453;
})();
var statearr_26454_26470 = state_26451__$1;
(statearr_26454_26470[(2)] = null);

(statearr_26454_26470[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26452 === (2))){
var inst_26434 = (state_26451[(10)]);
var inst_26431 = (state_26451[(9)]);
var inst_26434__$1 = cljs.core.nth.call(null,inst_26431,(0),null);
var inst_26435 = cljs.core.nthnext.call(null,inst_26431,(1));
var inst_26436 = (inst_26434__$1 == null);
var inst_26437 = cljs.core.not.call(null,inst_26436);
var state_26451__$1 = (function (){var statearr_26455 = state_26451;
(statearr_26455[(10)] = inst_26434__$1);

(statearr_26455[(11)] = inst_26435);

return statearr_26455;
})();
if(inst_26437){
var statearr_26456_26471 = state_26451__$1;
(statearr_26456_26471[(1)] = (4));

} else {
var statearr_26457_26472 = state_26451__$1;
(statearr_26457_26472[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26452 === (3))){
var inst_26449 = (state_26451[(2)]);
var state_26451__$1 = state_26451;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_26451__$1,inst_26449);
} else {
if((state_val_26452 === (4))){
var inst_26434 = (state_26451[(10)]);
var inst_26439 = figwheel.client.file_reloading.reload_js_file.call(null,inst_26434);
var state_26451__$1 = state_26451;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_26451__$1,(7),inst_26439);
} else {
if((state_val_26452 === (5))){
var inst_26445 = cljs.core.async.close_BANG_.call(null,out);
var state_26451__$1 = state_26451;
var statearr_26458_26473 = state_26451__$1;
(statearr_26458_26473[(2)] = inst_26445);

(statearr_26458_26473[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26452 === (6))){
var inst_26447 = (state_26451[(2)]);
var state_26451__$1 = state_26451;
var statearr_26459_26474 = state_26451__$1;
(statearr_26459_26474[(2)] = inst_26447);

(statearr_26459_26474[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26452 === (7))){
var inst_26435 = (state_26451[(11)]);
var inst_26441 = (state_26451[(2)]);
var inst_26442 = cljs.core.async.put_BANG_.call(null,out,inst_26441);
var inst_26431 = inst_26435;
var state_26451__$1 = (function (){var statearr_26460 = state_26451;
(statearr_26460[(12)] = inst_26442);

(statearr_26460[(9)] = inst_26431);

return statearr_26460;
})();
var statearr_26461_26475 = state_26451__$1;
(statearr_26461_26475[(2)] = null);

(statearr_26461_26475[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}
}
}
}
}
}
});})(c__23272__auto___26469,out))
;
return ((function (switch__23207__auto__,c__23272__auto___26469,out){
return (function() {
var figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto__ = null;
var figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto____0 = (function (){
var statearr_26465 = [null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_26465[(0)] = figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto__);

(statearr_26465[(1)] = (1));

return statearr_26465;
});
var figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto____1 = (function (state_26451){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_26451);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e26466){if((e26466 instanceof Object)){
var ex__23211__auto__ = e26466;
var statearr_26467_26476 = state_26451;
(statearr_26467_26476[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_26451);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e26466;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__26477 = state_26451;
state_26451 = G__26477;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto__ = function(state_26451){
switch(arguments.length){
case 0:
return figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto____0.call(this);
case 1:
return figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto____1.call(this,state_26451);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto____0;
figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto____1;
return figwheel$client$file_reloading$load_all_js_files_$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___26469,out))
})();
var state__23274__auto__ = (function (){var statearr_26468 = f__23273__auto__.call(null);
(statearr_26468[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___26469);

return statearr_26468;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___26469,out))
);


return cljs.core.async.into.call(null,cljs.core.PersistentVector.EMPTY,out);
});
figwheel.client.file_reloading.eval_body = (function figwheel$client$file_reloading$eval_body(p__26478,opts){
var map__26482 = p__26478;
var map__26482__$1 = ((((!((map__26482 == null)))?((((map__26482.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26482.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26482):map__26482);
var eval_body__$1 = cljs.core.get.call(null,map__26482__$1,new cljs.core.Keyword(null,"eval-body","eval-body",-907279883));
var file = cljs.core.get.call(null,map__26482__$1,new cljs.core.Keyword(null,"file","file",-1269645878));
if(cljs.core.truth_((function (){var and__16720__auto__ = eval_body__$1;
if(cljs.core.truth_(and__16720__auto__)){
return typeof eval_body__$1 === 'string';
} else {
return and__16720__auto__;
}
})())){
var code = eval_body__$1;
try{figwheel.client.utils.debug_prn.call(null,[cljs.core.str("Evaling file "),cljs.core.str(file)].join(''));

return figwheel.client.utils.eval_helper.call(null,code,opts);
}catch (e26484){var e = e26484;
return figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"error","error",-978969032),[cljs.core.str("Unable to evaluate "),cljs.core.str(file)].join(''));
}} else {
return null;
}
});
figwheel.client.file_reloading.expand_files = (function figwheel$client$file_reloading$expand_files(files){
var deps = figwheel.client.file_reloading.get_all_dependents.call(null,cljs.core.map.call(null,new cljs.core.Keyword(null,"namespace","namespace",-377510372),files));
return cljs.core.filter.call(null,cljs.core.comp.call(null,cljs.core.not,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, ["figwheel.connect",null], null), null),new cljs.core.Keyword(null,"namespace","namespace",-377510372)),cljs.core.map.call(null,((function (deps){
return (function (n){
var temp__4423__auto__ = cljs.core.first.call(null,cljs.core.filter.call(null,((function (deps){
return (function (p1__26485_SHARP_){
return cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"namespace","namespace",-377510372).cljs$core$IFn$_invoke$arity$1(p1__26485_SHARP_),n);
});})(deps))
,files));
if(cljs.core.truth_(temp__4423__auto__)){
var file_msg = temp__4423__auto__;
return file_msg;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"namespace","namespace",-377510372),new cljs.core.Keyword(null,"namespace","namespace",-377510372),n], null);
}
});})(deps))
,deps));
});
figwheel.client.file_reloading.sort_files = (function figwheel$client$file_reloading$sort_files(files){
if((cljs.core.count.call(null,files) <= (1))){
return files;
} else {
var keep_files = cljs.core.set.call(null,cljs.core.keep.call(null,new cljs.core.Keyword(null,"namespace","namespace",-377510372),files));
return cljs.core.filter.call(null,cljs.core.comp.call(null,keep_files,new cljs.core.Keyword(null,"namespace","namespace",-377510372)),figwheel.client.file_reloading.expand_files.call(null,files));
}
});
figwheel.client.file_reloading.get_figwheel_always = (function figwheel$client$file_reloading$get_figwheel_always(){
return cljs.core.map.call(null,(function (p__26490){
var vec__26491 = p__26490;
var k = cljs.core.nth.call(null,vec__26491,(0),null);
var v = cljs.core.nth.call(null,vec__26491,(1),null);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"namespace","namespace",-377510372),k,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"namespace","namespace",-377510372)], null);
}),cljs.core.filter.call(null,(function (p__26492){
var vec__26493 = p__26492;
var k = cljs.core.nth.call(null,vec__26493,(0),null);
var v = cljs.core.nth.call(null,vec__26493,(1),null);
return new cljs.core.Keyword(null,"figwheel-always","figwheel-always",799819691).cljs$core$IFn$_invoke$arity$1(v);
}),cljs.core.deref.call(null,figwheel.client.file_reloading.figwheel_meta_pragmas)));
});
figwheel.client.file_reloading.reload_js_files = (function figwheel$client$file_reloading$reload_js_files(p__26497,p__26498){
var map__26745 = p__26497;
var map__26745__$1 = ((((!((map__26745 == null)))?((((map__26745.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26745.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26745):map__26745);
var opts = map__26745__$1;
var before_jsload = cljs.core.get.call(null,map__26745__$1,new cljs.core.Keyword(null,"before-jsload","before-jsload",-847513128));
var on_jsload = cljs.core.get.call(null,map__26745__$1,new cljs.core.Keyword(null,"on-jsload","on-jsload",-395756602));
var reload_dependents = cljs.core.get.call(null,map__26745__$1,new cljs.core.Keyword(null,"reload-dependents","reload-dependents",-956865430));
var map__26746 = p__26498;
var map__26746__$1 = ((((!((map__26746 == null)))?((((map__26746.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26746.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26746):map__26746);
var msg = map__26746__$1;
var files = cljs.core.get.call(null,map__26746__$1,new cljs.core.Keyword(null,"files","files",-472457450));
var figwheel_meta = cljs.core.get.call(null,map__26746__$1,new cljs.core.Keyword(null,"figwheel-meta","figwheel-meta",-225970237));
var recompile_dependents = cljs.core.get.call(null,map__26746__$1,new cljs.core.Keyword(null,"recompile-dependents","recompile-dependents",523804171));
if(cljs.core.empty_QMARK_.call(null,figwheel_meta)){
} else {
cljs.core.reset_BANG_.call(null,figwheel.client.file_reloading.figwheel_meta_pragmas,figwheel_meta);
}

var c__23272__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function (state_26899){
var state_val_26900 = (state_26899[(1)]);
if((state_val_26900 === (7))){
var inst_26760 = (state_26899[(7)]);
var inst_26761 = (state_26899[(8)]);
var inst_26762 = (state_26899[(9)]);
var inst_26763 = (state_26899[(10)]);
var inst_26768 = cljs.core._nth.call(null,inst_26761,inst_26763);
var inst_26769 = figwheel.client.file_reloading.eval_body.call(null,inst_26768,opts);
var inst_26770 = (inst_26763 + (1));
var tmp26901 = inst_26760;
var tmp26902 = inst_26761;
var tmp26903 = inst_26762;
var inst_26760__$1 = tmp26901;
var inst_26761__$1 = tmp26902;
var inst_26762__$1 = tmp26903;
var inst_26763__$1 = inst_26770;
var state_26899__$1 = (function (){var statearr_26904 = state_26899;
(statearr_26904[(7)] = inst_26760__$1);

(statearr_26904[(8)] = inst_26761__$1);

(statearr_26904[(11)] = inst_26769);

(statearr_26904[(9)] = inst_26762__$1);

(statearr_26904[(10)] = inst_26763__$1);

return statearr_26904;
})();
var statearr_26905_26991 = state_26899__$1;
(statearr_26905_26991[(2)] = null);

(statearr_26905_26991[(1)] = (5));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (20))){
var inst_26803 = (state_26899[(12)]);
var inst_26811 = figwheel.client.file_reloading.sort_files.call(null,inst_26803);
var state_26899__$1 = state_26899;
var statearr_26906_26992 = state_26899__$1;
(statearr_26906_26992[(2)] = inst_26811);

(statearr_26906_26992[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (27))){
var state_26899__$1 = state_26899;
var statearr_26907_26993 = state_26899__$1;
(statearr_26907_26993[(2)] = null);

(statearr_26907_26993[(1)] = (28));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (1))){
var inst_26752 = (state_26899[(13)]);
var inst_26749 = before_jsload.call(null,files);
var inst_26750 = figwheel.client.file_reloading.before_jsload_custom_event.call(null,files);
var inst_26751 = (function (){return ((function (inst_26752,inst_26749,inst_26750,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function (p1__26494_SHARP_){
return new cljs.core.Keyword(null,"eval-body","eval-body",-907279883).cljs$core$IFn$_invoke$arity$1(p1__26494_SHARP_);
});
;})(inst_26752,inst_26749,inst_26750,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
})();
var inst_26752__$1 = cljs.core.filter.call(null,inst_26751,files);
var inst_26753 = cljs.core.not_empty.call(null,inst_26752__$1);
var state_26899__$1 = (function (){var statearr_26908 = state_26899;
(statearr_26908[(14)] = inst_26750);

(statearr_26908[(13)] = inst_26752__$1);

(statearr_26908[(15)] = inst_26749);

return statearr_26908;
})();
if(cljs.core.truth_(inst_26753)){
var statearr_26909_26994 = state_26899__$1;
(statearr_26909_26994[(1)] = (2));

} else {
var statearr_26910_26995 = state_26899__$1;
(statearr_26910_26995[(1)] = (3));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (24))){
var state_26899__$1 = state_26899;
var statearr_26911_26996 = state_26899__$1;
(statearr_26911_26996[(2)] = null);

(statearr_26911_26996[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (39))){
var inst_26853 = (state_26899[(16)]);
var state_26899__$1 = state_26899;
var statearr_26912_26997 = state_26899__$1;
(statearr_26912_26997[(2)] = inst_26853);

(statearr_26912_26997[(1)] = (40));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (46))){
var inst_26894 = (state_26899[(2)]);
var state_26899__$1 = state_26899;
var statearr_26913_26998 = state_26899__$1;
(statearr_26913_26998[(2)] = inst_26894);

(statearr_26913_26998[(1)] = (31));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (4))){
var inst_26797 = (state_26899[(2)]);
var inst_26798 = cljs.core.List.EMPTY;
var inst_26799 = cljs.core.reset_BANG_.call(null,figwheel.client.file_reloading.dependencies_loaded,inst_26798);
var inst_26800 = (function (){return ((function (inst_26797,inst_26798,inst_26799,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function (p1__26495_SHARP_){
var and__16720__auto__ = new cljs.core.Keyword(null,"namespace","namespace",-377510372).cljs$core$IFn$_invoke$arity$1(p1__26495_SHARP_);
if(cljs.core.truth_(and__16720__auto__)){
return cljs.core.not.call(null,new cljs.core.Keyword(null,"eval-body","eval-body",-907279883).cljs$core$IFn$_invoke$arity$1(p1__26495_SHARP_));
} else {
return and__16720__auto__;
}
});
;})(inst_26797,inst_26798,inst_26799,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
})();
var inst_26801 = cljs.core.filter.call(null,inst_26800,files);
var inst_26802 = figwheel.client.file_reloading.get_figwheel_always.call(null);
var inst_26803 = cljs.core.concat.call(null,inst_26801,inst_26802);
var state_26899__$1 = (function (){var statearr_26914 = state_26899;
(statearr_26914[(17)] = inst_26797);

(statearr_26914[(18)] = inst_26799);

(statearr_26914[(12)] = inst_26803);

return statearr_26914;
})();
if(cljs.core.truth_(reload_dependents)){
var statearr_26915_26999 = state_26899__$1;
(statearr_26915_26999[(1)] = (16));

} else {
var statearr_26916_27000 = state_26899__$1;
(statearr_26916_27000[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (15))){
var inst_26787 = (state_26899[(2)]);
var state_26899__$1 = state_26899;
var statearr_26917_27001 = state_26899__$1;
(statearr_26917_27001[(2)] = inst_26787);

(statearr_26917_27001[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (21))){
var inst_26813 = (state_26899[(19)]);
var inst_26813__$1 = (state_26899[(2)]);
var inst_26814 = figwheel.client.file_reloading.load_all_js_files.call(null,inst_26813__$1);
var state_26899__$1 = (function (){var statearr_26918 = state_26899;
(statearr_26918[(19)] = inst_26813__$1);

return statearr_26918;
})();
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_26899__$1,(22),inst_26814);
} else {
if((state_val_26900 === (31))){
var inst_26897 = (state_26899[(2)]);
var state_26899__$1 = state_26899;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_26899__$1,inst_26897);
} else {
if((state_val_26900 === (32))){
var inst_26853 = (state_26899[(16)]);
var inst_26858 = inst_26853.cljs$lang$protocol_mask$partition0$;
var inst_26859 = (inst_26858 & (64));
var inst_26860 = inst_26853.cljs$core$ISeq$;
var inst_26861 = (inst_26859) || (inst_26860);
var state_26899__$1 = state_26899;
if(cljs.core.truth_(inst_26861)){
var statearr_26919_27002 = state_26899__$1;
(statearr_26919_27002[(1)] = (35));

} else {
var statearr_26920_27003 = state_26899__$1;
(statearr_26920_27003[(1)] = (36));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (40))){
var inst_26874 = (state_26899[(20)]);
var inst_26873 = (state_26899[(2)]);
var inst_26874__$1 = cljs.core.get.call(null,inst_26873,new cljs.core.Keyword(null,"figwheel-no-load","figwheel-no-load",-555840179));
var inst_26875 = cljs.core.get.call(null,inst_26873,new cljs.core.Keyword(null,"not-required","not-required",-950359114));
var inst_26876 = cljs.core.not_empty.call(null,inst_26874__$1);
var state_26899__$1 = (function (){var statearr_26921 = state_26899;
(statearr_26921[(21)] = inst_26875);

(statearr_26921[(20)] = inst_26874__$1);

return statearr_26921;
})();
if(cljs.core.truth_(inst_26876)){
var statearr_26922_27004 = state_26899__$1;
(statearr_26922_27004[(1)] = (41));

} else {
var statearr_26923_27005 = state_26899__$1;
(statearr_26923_27005[(1)] = (42));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (33))){
var state_26899__$1 = state_26899;
var statearr_26924_27006 = state_26899__$1;
(statearr_26924_27006[(2)] = false);

(statearr_26924_27006[(1)] = (34));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (13))){
var inst_26773 = (state_26899[(22)]);
var inst_26777 = cljs.core.chunk_first.call(null,inst_26773);
var inst_26778 = cljs.core.chunk_rest.call(null,inst_26773);
var inst_26779 = cljs.core.count.call(null,inst_26777);
var inst_26760 = inst_26778;
var inst_26761 = inst_26777;
var inst_26762 = inst_26779;
var inst_26763 = (0);
var state_26899__$1 = (function (){var statearr_26925 = state_26899;
(statearr_26925[(7)] = inst_26760);

(statearr_26925[(8)] = inst_26761);

(statearr_26925[(9)] = inst_26762);

(statearr_26925[(10)] = inst_26763);

return statearr_26925;
})();
var statearr_26926_27007 = state_26899__$1;
(statearr_26926_27007[(2)] = null);

(statearr_26926_27007[(1)] = (5));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (22))){
var inst_26821 = (state_26899[(23)]);
var inst_26816 = (state_26899[(24)]);
var inst_26813 = (state_26899[(19)]);
var inst_26817 = (state_26899[(25)]);
var inst_26816__$1 = (state_26899[(2)]);
var inst_26817__$1 = cljs.core.filter.call(null,new cljs.core.Keyword(null,"loaded-file","loaded-file",-168399375),inst_26816__$1);
var inst_26818 = (function (){var all_files = inst_26813;
var res_SINGLEQUOTE_ = inst_26816__$1;
var res = inst_26817__$1;
return ((function (all_files,res_SINGLEQUOTE_,res,inst_26821,inst_26816,inst_26813,inst_26817,inst_26816__$1,inst_26817__$1,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function (p1__26496_SHARP_){
return cljs.core.not.call(null,new cljs.core.Keyword(null,"loaded-file","loaded-file",-168399375).cljs$core$IFn$_invoke$arity$1(p1__26496_SHARP_));
});
;})(all_files,res_SINGLEQUOTE_,res,inst_26821,inst_26816,inst_26813,inst_26817,inst_26816__$1,inst_26817__$1,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
})();
var inst_26819 = cljs.core.filter.call(null,inst_26818,inst_26816__$1);
var inst_26820 = cljs.core.deref.call(null,figwheel.client.file_reloading.dependencies_loaded);
var inst_26821__$1 = cljs.core.filter.call(null,new cljs.core.Keyword(null,"loaded-file","loaded-file",-168399375),inst_26820);
var inst_26822 = cljs.core.not_empty.call(null,inst_26821__$1);
var state_26899__$1 = (function (){var statearr_26927 = state_26899;
(statearr_26927[(23)] = inst_26821__$1);

(statearr_26927[(24)] = inst_26816__$1);

(statearr_26927[(26)] = inst_26819);

(statearr_26927[(25)] = inst_26817__$1);

return statearr_26927;
})();
if(cljs.core.truth_(inst_26822)){
var statearr_26928_27008 = state_26899__$1;
(statearr_26928_27008[(1)] = (23));

} else {
var statearr_26929_27009 = state_26899__$1;
(statearr_26929_27009[(1)] = (24));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (36))){
var state_26899__$1 = state_26899;
var statearr_26930_27010 = state_26899__$1;
(statearr_26930_27010[(2)] = false);

(statearr_26930_27010[(1)] = (37));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (41))){
var inst_26874 = (state_26899[(20)]);
var inst_26878 = cljs.core.comp.call(null,figwheel.client.file_reloading.name__GT_path,new cljs.core.Keyword(null,"namespace","namespace",-377510372));
var inst_26879 = cljs.core.map.call(null,inst_26878,inst_26874);
var inst_26880 = cljs.core.pr_str.call(null,inst_26879);
var inst_26881 = [cljs.core.str("figwheel-no-load meta-data: "),cljs.core.str(inst_26880)].join('');
var inst_26882 = figwheel.client.utils.log.call(null,inst_26881);
var state_26899__$1 = state_26899;
var statearr_26931_27011 = state_26899__$1;
(statearr_26931_27011[(2)] = inst_26882);

(statearr_26931_27011[(1)] = (43));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (43))){
var inst_26875 = (state_26899[(21)]);
var inst_26885 = (state_26899[(2)]);
var inst_26886 = cljs.core.not_empty.call(null,inst_26875);
var state_26899__$1 = (function (){var statearr_26932 = state_26899;
(statearr_26932[(27)] = inst_26885);

return statearr_26932;
})();
if(cljs.core.truth_(inst_26886)){
var statearr_26933_27012 = state_26899__$1;
(statearr_26933_27012[(1)] = (44));

} else {
var statearr_26934_27013 = state_26899__$1;
(statearr_26934_27013[(1)] = (45));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (29))){
var inst_26853 = (state_26899[(16)]);
var inst_26821 = (state_26899[(23)]);
var inst_26816 = (state_26899[(24)]);
var inst_26813 = (state_26899[(19)]);
var inst_26819 = (state_26899[(26)]);
var inst_26817 = (state_26899[(25)]);
var inst_26849 = figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"debug","debug",-1608172596),"Figwheel: NOT loading these files ");
var inst_26852 = (function (){var all_files = inst_26813;
var res_SINGLEQUOTE_ = inst_26816;
var res = inst_26817;
var files_not_loaded = inst_26819;
var dependencies_that_loaded = inst_26821;
return ((function (all_files,res_SINGLEQUOTE_,res,files_not_loaded,dependencies_that_loaded,inst_26853,inst_26821,inst_26816,inst_26813,inst_26819,inst_26817,inst_26849,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function (p__26851){
var map__26935 = p__26851;
var map__26935__$1 = ((((!((map__26935 == null)))?((((map__26935.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26935.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26935):map__26935);
var namespace = cljs.core.get.call(null,map__26935__$1,new cljs.core.Keyword(null,"namespace","namespace",-377510372));
var meta_data = cljs.core.get.call(null,cljs.core.deref.call(null,figwheel.client.file_reloading.figwheel_meta_pragmas),cljs.core.name.call(null,namespace));
if((meta_data == null)){
return new cljs.core.Keyword(null,"not-required","not-required",-950359114);
} else {
if(cljs.core.truth_(meta_data.call(null,new cljs.core.Keyword(null,"figwheel-no-load","figwheel-no-load",-555840179)))){
return new cljs.core.Keyword(null,"figwheel-no-load","figwheel-no-load",-555840179);
} else {
return new cljs.core.Keyword(null,"not-required","not-required",-950359114);

}
}
});
;})(all_files,res_SINGLEQUOTE_,res,files_not_loaded,dependencies_that_loaded,inst_26853,inst_26821,inst_26816,inst_26813,inst_26819,inst_26817,inst_26849,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
})();
var inst_26853__$1 = cljs.core.group_by.call(null,inst_26852,inst_26819);
var inst_26855 = (inst_26853__$1 == null);
var inst_26856 = cljs.core.not.call(null,inst_26855);
var state_26899__$1 = (function (){var statearr_26937 = state_26899;
(statearr_26937[(28)] = inst_26849);

(statearr_26937[(16)] = inst_26853__$1);

return statearr_26937;
})();
if(inst_26856){
var statearr_26938_27014 = state_26899__$1;
(statearr_26938_27014[(1)] = (32));

} else {
var statearr_26939_27015 = state_26899__$1;
(statearr_26939_27015[(1)] = (33));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (44))){
var inst_26875 = (state_26899[(21)]);
var inst_26888 = cljs.core.map.call(null,new cljs.core.Keyword(null,"file","file",-1269645878),inst_26875);
var inst_26889 = cljs.core.pr_str.call(null,inst_26888);
var inst_26890 = [cljs.core.str("not required: "),cljs.core.str(inst_26889)].join('');
var inst_26891 = figwheel.client.utils.log.call(null,inst_26890);
var state_26899__$1 = state_26899;
var statearr_26940_27016 = state_26899__$1;
(statearr_26940_27016[(2)] = inst_26891);

(statearr_26940_27016[(1)] = (46));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (6))){
var inst_26794 = (state_26899[(2)]);
var state_26899__$1 = state_26899;
var statearr_26941_27017 = state_26899__$1;
(statearr_26941_27017[(2)] = inst_26794);

(statearr_26941_27017[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (28))){
var inst_26819 = (state_26899[(26)]);
var inst_26846 = (state_26899[(2)]);
var inst_26847 = cljs.core.not_empty.call(null,inst_26819);
var state_26899__$1 = (function (){var statearr_26942 = state_26899;
(statearr_26942[(29)] = inst_26846);

return statearr_26942;
})();
if(cljs.core.truth_(inst_26847)){
var statearr_26943_27018 = state_26899__$1;
(statearr_26943_27018[(1)] = (29));

} else {
var statearr_26944_27019 = state_26899__$1;
(statearr_26944_27019[(1)] = (30));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (25))){
var inst_26817 = (state_26899[(25)]);
var inst_26833 = (state_26899[(2)]);
var inst_26834 = cljs.core.not_empty.call(null,inst_26817);
var state_26899__$1 = (function (){var statearr_26945 = state_26899;
(statearr_26945[(30)] = inst_26833);

return statearr_26945;
})();
if(cljs.core.truth_(inst_26834)){
var statearr_26946_27020 = state_26899__$1;
(statearr_26946_27020[(1)] = (26));

} else {
var statearr_26947_27021 = state_26899__$1;
(statearr_26947_27021[(1)] = (27));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (34))){
var inst_26868 = (state_26899[(2)]);
var state_26899__$1 = state_26899;
if(cljs.core.truth_(inst_26868)){
var statearr_26948_27022 = state_26899__$1;
(statearr_26948_27022[(1)] = (38));

} else {
var statearr_26949_27023 = state_26899__$1;
(statearr_26949_27023[(1)] = (39));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (17))){
var state_26899__$1 = state_26899;
var statearr_26950_27024 = state_26899__$1;
(statearr_26950_27024[(2)] = recompile_dependents);

(statearr_26950_27024[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (3))){
var state_26899__$1 = state_26899;
var statearr_26951_27025 = state_26899__$1;
(statearr_26951_27025[(2)] = null);

(statearr_26951_27025[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (12))){
var inst_26790 = (state_26899[(2)]);
var state_26899__$1 = state_26899;
var statearr_26952_27026 = state_26899__$1;
(statearr_26952_27026[(2)] = inst_26790);

(statearr_26952_27026[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (2))){
var inst_26752 = (state_26899[(13)]);
var inst_26759 = cljs.core.seq.call(null,inst_26752);
var inst_26760 = inst_26759;
var inst_26761 = null;
var inst_26762 = (0);
var inst_26763 = (0);
var state_26899__$1 = (function (){var statearr_26953 = state_26899;
(statearr_26953[(7)] = inst_26760);

(statearr_26953[(8)] = inst_26761);

(statearr_26953[(9)] = inst_26762);

(statearr_26953[(10)] = inst_26763);

return statearr_26953;
})();
var statearr_26954_27027 = state_26899__$1;
(statearr_26954_27027[(2)] = null);

(statearr_26954_27027[(1)] = (5));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (23))){
var inst_26821 = (state_26899[(23)]);
var inst_26816 = (state_26899[(24)]);
var inst_26813 = (state_26899[(19)]);
var inst_26819 = (state_26899[(26)]);
var inst_26817 = (state_26899[(25)]);
var inst_26824 = figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"debug","debug",-1608172596),"Figwheel: loaded these dependencies");
var inst_26826 = (function (){var all_files = inst_26813;
var res_SINGLEQUOTE_ = inst_26816;
var res = inst_26817;
var files_not_loaded = inst_26819;
var dependencies_that_loaded = inst_26821;
return ((function (all_files,res_SINGLEQUOTE_,res,files_not_loaded,dependencies_that_loaded,inst_26821,inst_26816,inst_26813,inst_26819,inst_26817,inst_26824,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function (p__26825){
var map__26955 = p__26825;
var map__26955__$1 = ((((!((map__26955 == null)))?((((map__26955.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26955.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26955):map__26955);
var request_url = cljs.core.get.call(null,map__26955__$1,new cljs.core.Keyword(null,"request-url","request-url",2100346596));
return clojure.string.replace.call(null,request_url,goog.basePath,"");
});
;})(all_files,res_SINGLEQUOTE_,res,files_not_loaded,dependencies_that_loaded,inst_26821,inst_26816,inst_26813,inst_26819,inst_26817,inst_26824,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
})();
var inst_26827 = cljs.core.reverse.call(null,inst_26821);
var inst_26828 = cljs.core.map.call(null,inst_26826,inst_26827);
var inst_26829 = cljs.core.pr_str.call(null,inst_26828);
var inst_26830 = figwheel.client.utils.log.call(null,inst_26829);
var state_26899__$1 = (function (){var statearr_26957 = state_26899;
(statearr_26957[(31)] = inst_26824);

return statearr_26957;
})();
var statearr_26958_27028 = state_26899__$1;
(statearr_26958_27028[(2)] = inst_26830);

(statearr_26958_27028[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (35))){
var state_26899__$1 = state_26899;
var statearr_26959_27029 = state_26899__$1;
(statearr_26959_27029[(2)] = true);

(statearr_26959_27029[(1)] = (37));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (19))){
var inst_26803 = (state_26899[(12)]);
var inst_26809 = figwheel.client.file_reloading.expand_files.call(null,inst_26803);
var state_26899__$1 = state_26899;
var statearr_26960_27030 = state_26899__$1;
(statearr_26960_27030[(2)] = inst_26809);

(statearr_26960_27030[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (11))){
var state_26899__$1 = state_26899;
var statearr_26961_27031 = state_26899__$1;
(statearr_26961_27031[(2)] = null);

(statearr_26961_27031[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (9))){
var inst_26792 = (state_26899[(2)]);
var state_26899__$1 = state_26899;
var statearr_26962_27032 = state_26899__$1;
(statearr_26962_27032[(2)] = inst_26792);

(statearr_26962_27032[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (5))){
var inst_26762 = (state_26899[(9)]);
var inst_26763 = (state_26899[(10)]);
var inst_26765 = (inst_26763 < inst_26762);
var inst_26766 = inst_26765;
var state_26899__$1 = state_26899;
if(cljs.core.truth_(inst_26766)){
var statearr_26963_27033 = state_26899__$1;
(statearr_26963_27033[(1)] = (7));

} else {
var statearr_26964_27034 = state_26899__$1;
(statearr_26964_27034[(1)] = (8));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (14))){
var inst_26773 = (state_26899[(22)]);
var inst_26782 = cljs.core.first.call(null,inst_26773);
var inst_26783 = figwheel.client.file_reloading.eval_body.call(null,inst_26782,opts);
var inst_26784 = cljs.core.next.call(null,inst_26773);
var inst_26760 = inst_26784;
var inst_26761 = null;
var inst_26762 = (0);
var inst_26763 = (0);
var state_26899__$1 = (function (){var statearr_26965 = state_26899;
(statearr_26965[(7)] = inst_26760);

(statearr_26965[(8)] = inst_26761);

(statearr_26965[(32)] = inst_26783);

(statearr_26965[(9)] = inst_26762);

(statearr_26965[(10)] = inst_26763);

return statearr_26965;
})();
var statearr_26966_27035 = state_26899__$1;
(statearr_26966_27035[(2)] = null);

(statearr_26966_27035[(1)] = (5));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (45))){
var state_26899__$1 = state_26899;
var statearr_26967_27036 = state_26899__$1;
(statearr_26967_27036[(2)] = null);

(statearr_26967_27036[(1)] = (46));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (26))){
var inst_26821 = (state_26899[(23)]);
var inst_26816 = (state_26899[(24)]);
var inst_26813 = (state_26899[(19)]);
var inst_26819 = (state_26899[(26)]);
var inst_26817 = (state_26899[(25)]);
var inst_26836 = figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"debug","debug",-1608172596),"Figwheel: loaded these files");
var inst_26838 = (function (){var all_files = inst_26813;
var res_SINGLEQUOTE_ = inst_26816;
var res = inst_26817;
var files_not_loaded = inst_26819;
var dependencies_that_loaded = inst_26821;
return ((function (all_files,res_SINGLEQUOTE_,res,files_not_loaded,dependencies_that_loaded,inst_26821,inst_26816,inst_26813,inst_26819,inst_26817,inst_26836,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function (p__26837){
var map__26968 = p__26837;
var map__26968__$1 = ((((!((map__26968 == null)))?((((map__26968.cljs$lang$protocol_mask$partition0$ & (64))) || (map__26968.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__26968):map__26968);
var namespace = cljs.core.get.call(null,map__26968__$1,new cljs.core.Keyword(null,"namespace","namespace",-377510372));
var file = cljs.core.get.call(null,map__26968__$1,new cljs.core.Keyword(null,"file","file",-1269645878));
if(cljs.core.truth_(namespace)){
return figwheel.client.file_reloading.name__GT_path.call(null,cljs.core.name.call(null,namespace));
} else {
return file;
}
});
;})(all_files,res_SINGLEQUOTE_,res,files_not_loaded,dependencies_that_loaded,inst_26821,inst_26816,inst_26813,inst_26819,inst_26817,inst_26836,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
})();
var inst_26839 = cljs.core.map.call(null,inst_26838,inst_26817);
var inst_26840 = cljs.core.pr_str.call(null,inst_26839);
var inst_26841 = figwheel.client.utils.log.call(null,inst_26840);
var inst_26842 = (function (){var all_files = inst_26813;
var res_SINGLEQUOTE_ = inst_26816;
var res = inst_26817;
var files_not_loaded = inst_26819;
var dependencies_that_loaded = inst_26821;
return ((function (all_files,res_SINGLEQUOTE_,res,files_not_loaded,dependencies_that_loaded,inst_26821,inst_26816,inst_26813,inst_26819,inst_26817,inst_26836,inst_26838,inst_26839,inst_26840,inst_26841,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function (){
figwheel.client.file_reloading.on_jsload_custom_event.call(null,res);

return cljs.core.apply.call(null,on_jsload,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [res], null));
});
;})(all_files,res_SINGLEQUOTE_,res,files_not_loaded,dependencies_that_loaded,inst_26821,inst_26816,inst_26813,inst_26819,inst_26817,inst_26836,inst_26838,inst_26839,inst_26840,inst_26841,state_val_26900,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
})();
var inst_26843 = setTimeout(inst_26842,(10));
var state_26899__$1 = (function (){var statearr_26970 = state_26899;
(statearr_26970[(33)] = inst_26836);

(statearr_26970[(34)] = inst_26841);

return statearr_26970;
})();
var statearr_26971_27037 = state_26899__$1;
(statearr_26971_27037[(2)] = inst_26843);

(statearr_26971_27037[(1)] = (28));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (16))){
var state_26899__$1 = state_26899;
var statearr_26972_27038 = state_26899__$1;
(statearr_26972_27038[(2)] = reload_dependents);

(statearr_26972_27038[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (38))){
var inst_26853 = (state_26899[(16)]);
var inst_26870 = cljs.core.apply.call(null,cljs.core.hash_map,inst_26853);
var state_26899__$1 = state_26899;
var statearr_26973_27039 = state_26899__$1;
(statearr_26973_27039[(2)] = inst_26870);

(statearr_26973_27039[(1)] = (40));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (30))){
var state_26899__$1 = state_26899;
var statearr_26974_27040 = state_26899__$1;
(statearr_26974_27040[(2)] = null);

(statearr_26974_27040[(1)] = (31));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (10))){
var inst_26773 = (state_26899[(22)]);
var inst_26775 = cljs.core.chunked_seq_QMARK_.call(null,inst_26773);
var state_26899__$1 = state_26899;
if(inst_26775){
var statearr_26975_27041 = state_26899__$1;
(statearr_26975_27041[(1)] = (13));

} else {
var statearr_26976_27042 = state_26899__$1;
(statearr_26976_27042[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (18))){
var inst_26807 = (state_26899[(2)]);
var state_26899__$1 = state_26899;
if(cljs.core.truth_(inst_26807)){
var statearr_26977_27043 = state_26899__$1;
(statearr_26977_27043[(1)] = (19));

} else {
var statearr_26978_27044 = state_26899__$1;
(statearr_26978_27044[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (42))){
var state_26899__$1 = state_26899;
var statearr_26979_27045 = state_26899__$1;
(statearr_26979_27045[(2)] = null);

(statearr_26979_27045[(1)] = (43));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (37))){
var inst_26865 = (state_26899[(2)]);
var state_26899__$1 = state_26899;
var statearr_26980_27046 = state_26899__$1;
(statearr_26980_27046[(2)] = inst_26865);

(statearr_26980_27046[(1)] = (34));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_26900 === (8))){
var inst_26760 = (state_26899[(7)]);
var inst_26773 = (state_26899[(22)]);
var inst_26773__$1 = cljs.core.seq.call(null,inst_26760);
var state_26899__$1 = (function (){var statearr_26981 = state_26899;
(statearr_26981[(22)] = inst_26773__$1);

return statearr_26981;
})();
if(inst_26773__$1){
var statearr_26982_27047 = state_26899__$1;
(statearr_26982_27047[(1)] = (10));

} else {
var statearr_26983_27048 = state_26899__$1;
(statearr_26983_27048[(1)] = (11));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
;
return ((function (switch__23207__auto__,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents){
return (function() {
var figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto__ = null;
var figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto____0 = (function (){
var statearr_26987 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_26987[(0)] = figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto__);

(statearr_26987[(1)] = (1));

return statearr_26987;
});
var figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto____1 = (function (state_26899){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_26899);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e26988){if((e26988 instanceof Object)){
var ex__23211__auto__ = e26988;
var statearr_26989_27049 = state_26899;
(statearr_26989_27049[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_26899);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e26988;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__27050 = state_26899;
state_26899 = G__27050;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto__ = function(state_26899){
switch(arguments.length){
case 0:
return figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto____0.call(this);
case 1:
return figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto____1.call(this,state_26899);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto____0;
figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto____1;
return figwheel$client$file_reloading$reload_js_files_$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
})();
var state__23274__auto__ = (function (){var statearr_26990 = f__23273__auto__.call(null);
(statearr_26990[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto__);

return statearr_26990;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto__,map__26745,map__26745__$1,opts,before_jsload,on_jsload,reload_dependents,map__26746,map__26746__$1,msg,files,figwheel_meta,recompile_dependents))
);

return c__23272__auto__;
});
figwheel.client.file_reloading.current_links = (function figwheel$client$file_reloading$current_links(){
return Array.prototype.slice.call(document.getElementsByTagName("link"));
});
figwheel.client.file_reloading.truncate_url = (function figwheel$client$file_reloading$truncate_url(url){
return clojure.string.replace_first.call(null,clojure.string.replace_first.call(null,clojure.string.replace_first.call(null,clojure.string.replace_first.call(null,cljs.core.first.call(null,clojure.string.split.call(null,url,/\?/)),[cljs.core.str(location.protocol),cljs.core.str("//")].join(''),""),".*://",""),/^\/\//,""),/[^\\/]*/,"");
});
figwheel.client.file_reloading.matches_file_QMARK_ = (function figwheel$client$file_reloading$matches_file_QMARK_(p__27053,link){
var map__27056 = p__27053;
var map__27056__$1 = ((((!((map__27056 == null)))?((((map__27056.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27056.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27056):map__27056);
var file = cljs.core.get.call(null,map__27056__$1,new cljs.core.Keyword(null,"file","file",-1269645878));
var temp__4425__auto__ = link.href;
if(cljs.core.truth_(temp__4425__auto__)){
var link_href = temp__4425__auto__;
var match = clojure.string.join.call(null,"/",cljs.core.take_while.call(null,cljs.core.identity,cljs.core.map.call(null,((function (link_href,temp__4425__auto__,map__27056,map__27056__$1,file){
return (function (p1__27051_SHARP_,p2__27052_SHARP_){
if(cljs.core._EQ_.call(null,p1__27051_SHARP_,p2__27052_SHARP_)){
return p1__27051_SHARP_;
} else {
return false;
}
});})(link_href,temp__4425__auto__,map__27056,map__27056__$1,file))
,cljs.core.reverse.call(null,clojure.string.split.call(null,file,"/")),cljs.core.reverse.call(null,clojure.string.split.call(null,figwheel.client.file_reloading.truncate_url.call(null,link_href),"/")))));
var match_length = cljs.core.count.call(null,match);
var file_name_length = cljs.core.count.call(null,cljs.core.last.call(null,clojure.string.split.call(null,file,"/")));
if((match_length >= file_name_length)){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"link","link",-1769163468),link,new cljs.core.Keyword(null,"link-href","link-href",-250644450),link_href,new cljs.core.Keyword(null,"match-length","match-length",1101537310),match_length,new cljs.core.Keyword(null,"current-url-length","current-url-length",380404083),cljs.core.count.call(null,figwheel.client.file_reloading.truncate_url.call(null,link_href))], null);
} else {
return null;
}
} else {
return null;
}
});
figwheel.client.file_reloading.get_correct_link = (function figwheel$client$file_reloading$get_correct_link(f_data){
var temp__4425__auto__ = cljs.core.first.call(null,cljs.core.sort_by.call(null,(function (p__27062){
var map__27063 = p__27062;
var map__27063__$1 = ((((!((map__27063 == null)))?((((map__27063.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27063.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27063):map__27063);
var match_length = cljs.core.get.call(null,map__27063__$1,new cljs.core.Keyword(null,"match-length","match-length",1101537310));
var current_url_length = cljs.core.get.call(null,map__27063__$1,new cljs.core.Keyword(null,"current-url-length","current-url-length",380404083));
return (current_url_length - match_length);
}),cljs.core.keep.call(null,(function (p1__27058_SHARP_){
return figwheel.client.file_reloading.matches_file_QMARK_.call(null,f_data,p1__27058_SHARP_);
}),figwheel.client.file_reloading.current_links.call(null))));
if(cljs.core.truth_(temp__4425__auto__)){
var res = temp__4425__auto__;
return new cljs.core.Keyword(null,"link","link",-1769163468).cljs$core$IFn$_invoke$arity$1(res);
} else {
return null;
}
});
figwheel.client.file_reloading.clone_link = (function figwheel$client$file_reloading$clone_link(link,url){
var clone = document.createElement("link");
clone.rel = "stylesheet";

clone.media = link.media;

clone.disabled = link.disabled;

clone.href = figwheel.client.file_reloading.add_cache_buster.call(null,url);

return clone;
});
figwheel.client.file_reloading.create_link = (function figwheel$client$file_reloading$create_link(url){
var link = document.createElement("link");
link.rel = "stylesheet";

link.href = figwheel.client.file_reloading.add_cache_buster.call(null,url);

return link;
});
figwheel.client.file_reloading.add_link_to_doc = (function figwheel$client$file_reloading$add_link_to_doc(var_args){
var args27065 = [];
var len__17790__auto___27068 = arguments.length;
var i__17791__auto___27069 = (0);
while(true){
if((i__17791__auto___27069 < len__17790__auto___27068)){
args27065.push((arguments[i__17791__auto___27069]));

var G__27070 = (i__17791__auto___27069 + (1));
i__17791__auto___27069 = G__27070;
continue;
} else {
}
break;
}

var G__27067 = args27065.length;
switch (G__27067) {
case 1:
return figwheel.client.file_reloading.add_link_to_doc.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return figwheel.client.file_reloading.add_link_to_doc.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args27065.length)].join('')));

}
});

figwheel.client.file_reloading.add_link_to_doc.cljs$core$IFn$_invoke$arity$1 = (function (new_link){
return (document.getElementsByTagName("head")[(0)]).appendChild(new_link);
});

figwheel.client.file_reloading.add_link_to_doc.cljs$core$IFn$_invoke$arity$2 = (function (orig_link,klone){
var parent = orig_link.parentNode;
if(cljs.core._EQ_.call(null,orig_link,parent.lastChild)){
parent.appendChild(klone);
} else {
parent.insertBefore(klone,orig_link.nextSibling);
}

return setTimeout(((function (parent){
return (function (){
return parent.removeChild(orig_link);
});})(parent))
,(300));
});

figwheel.client.file_reloading.add_link_to_doc.cljs$lang$maxFixedArity = 2;
figwheel.client.file_reloading.distictify = (function figwheel$client$file_reloading$distictify(key,seqq){
return cljs.core.vals.call(null,cljs.core.reduce.call(null,(function (p1__27072_SHARP_,p2__27073_SHARP_){
return cljs.core.assoc.call(null,p1__27072_SHARP_,cljs.core.get.call(null,p2__27073_SHARP_,key),p2__27073_SHARP_);
}),cljs.core.PersistentArrayMap.EMPTY,seqq));
});
figwheel.client.file_reloading.reload_css_file = (function figwheel$client$file_reloading$reload_css_file(p__27074){
var map__27077 = p__27074;
var map__27077__$1 = ((((!((map__27077 == null)))?((((map__27077.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27077.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27077):map__27077);
var f_data = map__27077__$1;
var file = cljs.core.get.call(null,map__27077__$1,new cljs.core.Keyword(null,"file","file",-1269645878));
var temp__4425__auto__ = figwheel.client.file_reloading.get_correct_link.call(null,f_data);
if(cljs.core.truth_(temp__4425__auto__)){
var link = temp__4425__auto__;
return figwheel.client.file_reloading.add_link_to_doc.call(null,link,figwheel.client.file_reloading.clone_link.call(null,link,link.href));
} else {
return null;
}
});
figwheel.client.file_reloading.reload_css_files = (function figwheel$client$file_reloading$reload_css_files(p__27079,files_msg){
var map__27086 = p__27079;
var map__27086__$1 = ((((!((map__27086 == null)))?((((map__27086.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27086.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27086):map__27086);
var opts = map__27086__$1;
var on_cssload = cljs.core.get.call(null,map__27086__$1,new cljs.core.Keyword(null,"on-cssload","on-cssload",1825432318));
if(cljs.core.truth_(figwheel.client.utils.html_env_QMARK_.call(null))){
var seq__27088_27092 = cljs.core.seq.call(null,figwheel.client.file_reloading.distictify.call(null,new cljs.core.Keyword(null,"file","file",-1269645878),new cljs.core.Keyword(null,"files","files",-472457450).cljs$core$IFn$_invoke$arity$1(files_msg)));
var chunk__27089_27093 = null;
var count__27090_27094 = (0);
var i__27091_27095 = (0);
while(true){
if((i__27091_27095 < count__27090_27094)){
var f_27096 = cljs.core._nth.call(null,chunk__27089_27093,i__27091_27095);
figwheel.client.file_reloading.reload_css_file.call(null,f_27096);

var G__27097 = seq__27088_27092;
var G__27098 = chunk__27089_27093;
var G__27099 = count__27090_27094;
var G__27100 = (i__27091_27095 + (1));
seq__27088_27092 = G__27097;
chunk__27089_27093 = G__27098;
count__27090_27094 = G__27099;
i__27091_27095 = G__27100;
continue;
} else {
var temp__4425__auto___27101 = cljs.core.seq.call(null,seq__27088_27092);
if(temp__4425__auto___27101){
var seq__27088_27102__$1 = temp__4425__auto___27101;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__27088_27102__$1)){
var c__17535__auto___27103 = cljs.core.chunk_first.call(null,seq__27088_27102__$1);
var G__27104 = cljs.core.chunk_rest.call(null,seq__27088_27102__$1);
var G__27105 = c__17535__auto___27103;
var G__27106 = cljs.core.count.call(null,c__17535__auto___27103);
var G__27107 = (0);
seq__27088_27092 = G__27104;
chunk__27089_27093 = G__27105;
count__27090_27094 = G__27106;
i__27091_27095 = G__27107;
continue;
} else {
var f_27108 = cljs.core.first.call(null,seq__27088_27102__$1);
figwheel.client.file_reloading.reload_css_file.call(null,f_27108);

var G__27109 = cljs.core.next.call(null,seq__27088_27102__$1);
var G__27110 = null;
var G__27111 = (0);
var G__27112 = (0);
seq__27088_27092 = G__27109;
chunk__27089_27093 = G__27110;
count__27090_27094 = G__27111;
i__27091_27095 = G__27112;
continue;
}
} else {
}
}
break;
}

return setTimeout(((function (map__27086,map__27086__$1,opts,on_cssload){
return (function (){
return on_cssload.call(null,new cljs.core.Keyword(null,"files","files",-472457450).cljs$core$IFn$_invoke$arity$1(files_msg));
});})(map__27086,map__27086__$1,opts,on_cssload))
,(100));
} else {
return null;
}
});

//# sourceMappingURL=file_reloading.js.map