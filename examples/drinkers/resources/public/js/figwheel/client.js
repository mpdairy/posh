// Compiled by ClojureScript 1.7.170 {}
goog.provide('figwheel.client');
goog.require('cljs.core');
goog.require('goog.userAgent.product');
goog.require('goog.Uri');
goog.require('cljs.core.async');
goog.require('figwheel.client.socket');
goog.require('figwheel.client.file_reloading');
goog.require('clojure.string');
goog.require('figwheel.client.utils');
goog.require('cljs.repl');
goog.require('figwheel.client.heads_up');
figwheel.client.figwheel_repl_print = (function figwheel$client$figwheel_repl_print(args){
figwheel.client.socket.send_BANG_.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"figwheel-event","figwheel-event",519570592),"callback",new cljs.core.Keyword(null,"callback-name","callback-name",336964714),"figwheel-repl-print",new cljs.core.Keyword(null,"content","content",15833224),args], null));

return args;
});
figwheel.client.autoload_QMARK_ = (cljs.core.truth_(figwheel.client.utils.html_env_QMARK_.call(null))?(function (){
var pred__27433 = cljs.core._EQ_;
var expr__27434 = (function (){var or__16732__auto__ = localStorage.getItem("figwheel_autoload");
if(cljs.core.truth_(or__16732__auto__)){
return or__16732__auto__;
} else {
return "true";
}
})();
if(cljs.core.truth_(pred__27433.call(null,"true",expr__27434))){
return true;
} else {
if(cljs.core.truth_(pred__27433.call(null,"false",expr__27434))){
return false;
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__27434)].join('')));
}
}
}):(function (){
return true;
}));
figwheel.client.toggle_autoload = (function figwheel$client$toggle_autoload(){
if(cljs.core.truth_(figwheel.client.utils.html_env_QMARK_.call(null))){
localStorage.setItem("figwheel_autoload",cljs.core.not.call(null,figwheel.client.autoload_QMARK_.call(null)));

return figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"info","info",-317069002),[cljs.core.str("Figwheel autoloading "),cljs.core.str((cljs.core.truth_(figwheel.client.autoload_QMARK_.call(null))?"ON":"OFF"))].join(''));
} else {
return null;
}
});
goog.exportSymbol('figwheel.client.toggle_autoload', figwheel.client.toggle_autoload);
figwheel.client.console_print = (function figwheel$client$console_print(args){
console.log.apply(console,cljs.core.into_array.call(null,args));

return args;
});
figwheel.client.enable_repl_print_BANG_ = (function figwheel$client$enable_repl_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

return cljs.core._STAR_print_fn_STAR_ = (function() { 
var G__27436__delegate = function (args){
return figwheel.client.figwheel_repl_print.call(null,figwheel.client.console_print.call(null,args));
};
var G__27436 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__27437__i = 0, G__27437__a = new Array(arguments.length -  0);
while (G__27437__i < G__27437__a.length) {G__27437__a[G__27437__i] = arguments[G__27437__i + 0]; ++G__27437__i;}
  args = new cljs.core.IndexedSeq(G__27437__a,0);
} 
return G__27436__delegate.call(this,args);};
G__27436.cljs$lang$maxFixedArity = 0;
G__27436.cljs$lang$applyTo = (function (arglist__27438){
var args = cljs.core.seq(arglist__27438);
return G__27436__delegate(args);
});
G__27436.cljs$core$IFn$_invoke$arity$variadic = G__27436__delegate;
return G__27436;
})()
;
});
figwheel.client.get_essential_messages = (function figwheel$client$get_essential_messages(ed){
if(cljs.core.truth_(ed)){
return cljs.core.cons.call(null,cljs.core.select_keys.call(null,ed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"class","class",-2030961996)], null)),figwheel$client$get_essential_messages.call(null,new cljs.core.Keyword(null,"cause","cause",231901252).cljs$core$IFn$_invoke$arity$1(ed)));
} else {
return null;
}
});
figwheel.client.error_msg_format = (function figwheel$client$error_msg_format(p__27439){
var map__27442 = p__27439;
var map__27442__$1 = ((((!((map__27442 == null)))?((((map__27442.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27442.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27442):map__27442);
var message = cljs.core.get.call(null,map__27442__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var class$ = cljs.core.get.call(null,map__27442__$1,new cljs.core.Keyword(null,"class","class",-2030961996));
return [cljs.core.str(class$),cljs.core.str(" : "),cljs.core.str(message)].join('');
});
figwheel.client.format_messages = cljs.core.comp.call(null,cljs.core.partial.call(null,cljs.core.map,figwheel.client.error_msg_format),figwheel.client.get_essential_messages);
figwheel.client.focus_msgs = (function figwheel$client$focus_msgs(name_set,msg_hist){
return cljs.core.cons.call(null,cljs.core.first.call(null,msg_hist),cljs.core.filter.call(null,cljs.core.comp.call(null,name_set,new cljs.core.Keyword(null,"msg-name","msg-name",-353709863)),cljs.core.rest.call(null,msg_hist)));
});
figwheel.client.reload_file_QMARK__STAR_ = (function figwheel$client$reload_file_QMARK__STAR_(msg_name,opts){
var or__16732__auto__ = new cljs.core.Keyword(null,"load-warninged-code","load-warninged-code",-2030345223).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__16732__auto__)){
return or__16732__auto__;
} else {
return cljs.core.not_EQ_.call(null,msg_name,new cljs.core.Keyword(null,"compile-warning","compile-warning",43425356));
}
});
figwheel.client.reload_file_state_QMARK_ = (function figwheel$client$reload_file_state_QMARK_(msg_names,opts){
var and__16720__auto__ = cljs.core._EQ_.call(null,cljs.core.first.call(null,msg_names),new cljs.core.Keyword(null,"files-changed","files-changed",-1418200563));
if(and__16720__auto__){
return figwheel.client.reload_file_QMARK__STAR_.call(null,cljs.core.second.call(null,msg_names),opts);
} else {
return and__16720__auto__;
}
});
figwheel.client.block_reload_file_state_QMARK_ = (function figwheel$client$block_reload_file_state_QMARK_(msg_names,opts){
return (cljs.core._EQ_.call(null,cljs.core.first.call(null,msg_names),new cljs.core.Keyword(null,"files-changed","files-changed",-1418200563))) && (cljs.core.not.call(null,figwheel.client.reload_file_QMARK__STAR_.call(null,cljs.core.second.call(null,msg_names),opts)));
});
figwheel.client.warning_append_state_QMARK_ = (function figwheel$client$warning_append_state_QMARK_(msg_names){
return cljs.core._EQ_.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"compile-warning","compile-warning",43425356),new cljs.core.Keyword(null,"compile-warning","compile-warning",43425356)], null),cljs.core.take.call(null,(2),msg_names));
});
figwheel.client.warning_state_QMARK_ = (function figwheel$client$warning_state_QMARK_(msg_names){
return cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"compile-warning","compile-warning",43425356),cljs.core.first.call(null,msg_names));
});
figwheel.client.rewarning_state_QMARK_ = (function figwheel$client$rewarning_state_QMARK_(msg_names){
return cljs.core._EQ_.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"compile-warning","compile-warning",43425356),new cljs.core.Keyword(null,"files-changed","files-changed",-1418200563),new cljs.core.Keyword(null,"compile-warning","compile-warning",43425356)], null),cljs.core.take.call(null,(3),msg_names));
});
figwheel.client.compile_fail_state_QMARK_ = (function figwheel$client$compile_fail_state_QMARK_(msg_names){
return cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"compile-failed","compile-failed",-477639289),cljs.core.first.call(null,msg_names));
});
figwheel.client.compile_refail_state_QMARK_ = (function figwheel$client$compile_refail_state_QMARK_(msg_names){
return cljs.core._EQ_.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"compile-failed","compile-failed",-477639289),new cljs.core.Keyword(null,"compile-failed","compile-failed",-477639289)], null),cljs.core.take.call(null,(2),msg_names));
});
figwheel.client.css_loaded_state_QMARK_ = (function figwheel$client$css_loaded_state_QMARK_(msg_names){
return cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"css-files-changed","css-files-changed",720773874),cljs.core.first.call(null,msg_names));
});
figwheel.client.file_reloader_plugin = (function figwheel$client$file_reloader_plugin(opts){
var ch = cljs.core.async.chan.call(null);
var c__23272__auto___27604 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___27604,ch){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___27604,ch){
return (function (state_27573){
var state_val_27574 = (state_27573[(1)]);
if((state_val_27574 === (7))){
var inst_27569 = (state_27573[(2)]);
var state_27573__$1 = state_27573;
var statearr_27575_27605 = state_27573__$1;
(statearr_27575_27605[(2)] = inst_27569);

(statearr_27575_27605[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (1))){
var state_27573__$1 = state_27573;
var statearr_27576_27606 = state_27573__$1;
(statearr_27576_27606[(2)] = null);

(statearr_27576_27606[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (4))){
var inst_27526 = (state_27573[(7)]);
var inst_27526__$1 = (state_27573[(2)]);
var state_27573__$1 = (function (){var statearr_27577 = state_27573;
(statearr_27577[(7)] = inst_27526__$1);

return statearr_27577;
})();
if(cljs.core.truth_(inst_27526__$1)){
var statearr_27578_27607 = state_27573__$1;
(statearr_27578_27607[(1)] = (5));

} else {
var statearr_27579_27608 = state_27573__$1;
(statearr_27579_27608[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (15))){
var inst_27533 = (state_27573[(8)]);
var inst_27548 = new cljs.core.Keyword(null,"files","files",-472457450).cljs$core$IFn$_invoke$arity$1(inst_27533);
var inst_27549 = cljs.core.first.call(null,inst_27548);
var inst_27550 = new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(inst_27549);
var inst_27551 = [cljs.core.str("Figwheel: Not loading code with warnings - "),cljs.core.str(inst_27550)].join('');
var inst_27552 = figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"warn","warn",-436710552),inst_27551);
var state_27573__$1 = state_27573;
var statearr_27580_27609 = state_27573__$1;
(statearr_27580_27609[(2)] = inst_27552);

(statearr_27580_27609[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (13))){
var inst_27557 = (state_27573[(2)]);
var state_27573__$1 = state_27573;
var statearr_27581_27610 = state_27573__$1;
(statearr_27581_27610[(2)] = inst_27557);

(statearr_27581_27610[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (6))){
var state_27573__$1 = state_27573;
var statearr_27582_27611 = state_27573__$1;
(statearr_27582_27611[(2)] = null);

(statearr_27582_27611[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (17))){
var inst_27555 = (state_27573[(2)]);
var state_27573__$1 = state_27573;
var statearr_27583_27612 = state_27573__$1;
(statearr_27583_27612[(2)] = inst_27555);

(statearr_27583_27612[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (3))){
var inst_27571 = (state_27573[(2)]);
var state_27573__$1 = state_27573;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_27573__$1,inst_27571);
} else {
if((state_val_27574 === (12))){
var inst_27532 = (state_27573[(9)]);
var inst_27546 = figwheel.client.block_reload_file_state_QMARK_.call(null,inst_27532,opts);
var state_27573__$1 = state_27573;
if(cljs.core.truth_(inst_27546)){
var statearr_27584_27613 = state_27573__$1;
(statearr_27584_27613[(1)] = (15));

} else {
var statearr_27585_27614 = state_27573__$1;
(statearr_27585_27614[(1)] = (16));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (2))){
var state_27573__$1 = state_27573;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27573__$1,(4),ch);
} else {
if((state_val_27574 === (11))){
var inst_27533 = (state_27573[(8)]);
var inst_27538 = cljs.core.PersistentVector.EMPTY_NODE;
var inst_27539 = figwheel.client.file_reloading.reload_js_files.call(null,opts,inst_27533);
var inst_27540 = cljs.core.async.timeout.call(null,(1000));
var inst_27541 = [inst_27539,inst_27540];
var inst_27542 = (new cljs.core.PersistentVector(null,2,(5),inst_27538,inst_27541,null));
var state_27573__$1 = state_27573;
return cljs.core.async.ioc_alts_BANG_.call(null,state_27573__$1,(14),inst_27542);
} else {
if((state_val_27574 === (9))){
var inst_27533 = (state_27573[(8)]);
var inst_27559 = figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"warn","warn",-436710552),"Figwheel: code autoloading is OFF");
var inst_27560 = new cljs.core.Keyword(null,"files","files",-472457450).cljs$core$IFn$_invoke$arity$1(inst_27533);
var inst_27561 = cljs.core.map.call(null,new cljs.core.Keyword(null,"file","file",-1269645878),inst_27560);
var inst_27562 = [cljs.core.str("Not loading: "),cljs.core.str(inst_27561)].join('');
var inst_27563 = figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"info","info",-317069002),inst_27562);
var state_27573__$1 = (function (){var statearr_27586 = state_27573;
(statearr_27586[(10)] = inst_27559);

return statearr_27586;
})();
var statearr_27587_27615 = state_27573__$1;
(statearr_27587_27615[(2)] = inst_27563);

(statearr_27587_27615[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (5))){
var inst_27526 = (state_27573[(7)]);
var inst_27528 = [new cljs.core.Keyword(null,"compile-warning","compile-warning",43425356),null,new cljs.core.Keyword(null,"files-changed","files-changed",-1418200563),null];
var inst_27529 = (new cljs.core.PersistentArrayMap(null,2,inst_27528,null));
var inst_27530 = (new cljs.core.PersistentHashSet(null,inst_27529,null));
var inst_27531 = figwheel.client.focus_msgs.call(null,inst_27530,inst_27526);
var inst_27532 = cljs.core.map.call(null,new cljs.core.Keyword(null,"msg-name","msg-name",-353709863),inst_27531);
var inst_27533 = cljs.core.first.call(null,inst_27531);
var inst_27534 = figwheel.client.autoload_QMARK_.call(null);
var state_27573__$1 = (function (){var statearr_27588 = state_27573;
(statearr_27588[(8)] = inst_27533);

(statearr_27588[(9)] = inst_27532);

return statearr_27588;
})();
if(cljs.core.truth_(inst_27534)){
var statearr_27589_27616 = state_27573__$1;
(statearr_27589_27616[(1)] = (8));

} else {
var statearr_27590_27617 = state_27573__$1;
(statearr_27590_27617[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (14))){
var inst_27544 = (state_27573[(2)]);
var state_27573__$1 = state_27573;
var statearr_27591_27618 = state_27573__$1;
(statearr_27591_27618[(2)] = inst_27544);

(statearr_27591_27618[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (16))){
var state_27573__$1 = state_27573;
var statearr_27592_27619 = state_27573__$1;
(statearr_27592_27619[(2)] = null);

(statearr_27592_27619[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (10))){
var inst_27565 = (state_27573[(2)]);
var state_27573__$1 = (function (){var statearr_27593 = state_27573;
(statearr_27593[(11)] = inst_27565);

return statearr_27593;
})();
var statearr_27594_27620 = state_27573__$1;
(statearr_27594_27620[(2)] = null);

(statearr_27594_27620[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27574 === (8))){
var inst_27532 = (state_27573[(9)]);
var inst_27536 = figwheel.client.reload_file_state_QMARK_.call(null,inst_27532,opts);
var state_27573__$1 = state_27573;
if(cljs.core.truth_(inst_27536)){
var statearr_27595_27621 = state_27573__$1;
(statearr_27595_27621[(1)] = (11));

} else {
var statearr_27596_27622 = state_27573__$1;
(statearr_27596_27622[(1)] = (12));

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
});})(c__23272__auto___27604,ch))
;
return ((function (switch__23207__auto__,c__23272__auto___27604,ch){
return (function() {
var figwheel$client$file_reloader_plugin_$_state_machine__23208__auto__ = null;
var figwheel$client$file_reloader_plugin_$_state_machine__23208__auto____0 = (function (){
var statearr_27600 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_27600[(0)] = figwheel$client$file_reloader_plugin_$_state_machine__23208__auto__);

(statearr_27600[(1)] = (1));

return statearr_27600;
});
var figwheel$client$file_reloader_plugin_$_state_machine__23208__auto____1 = (function (state_27573){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_27573);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e27601){if((e27601 instanceof Object)){
var ex__23211__auto__ = e27601;
var statearr_27602_27623 = state_27573;
(statearr_27602_27623[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_27573);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e27601;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__27624 = state_27573;
state_27573 = G__27624;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
figwheel$client$file_reloader_plugin_$_state_machine__23208__auto__ = function(state_27573){
switch(arguments.length){
case 0:
return figwheel$client$file_reloader_plugin_$_state_machine__23208__auto____0.call(this);
case 1:
return figwheel$client$file_reloader_plugin_$_state_machine__23208__auto____1.call(this,state_27573);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
figwheel$client$file_reloader_plugin_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = figwheel$client$file_reloader_plugin_$_state_machine__23208__auto____0;
figwheel$client$file_reloader_plugin_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = figwheel$client$file_reloader_plugin_$_state_machine__23208__auto____1;
return figwheel$client$file_reloader_plugin_$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___27604,ch))
})();
var state__23274__auto__ = (function (){var statearr_27603 = f__23273__auto__.call(null);
(statearr_27603[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___27604);

return statearr_27603;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___27604,ch))
);


return ((function (ch){
return (function (msg_hist){
cljs.core.async.put_BANG_.call(null,ch,msg_hist);

return msg_hist;
});
;})(ch))
});
figwheel.client.truncate_stack_trace = (function figwheel$client$truncate_stack_trace(stack_str){
return cljs.core.take_while.call(null,(function (p1__27625_SHARP_){
return cljs.core.not.call(null,cljs.core.re_matches.call(null,/.*eval_javascript_STAR__STAR_.*/,p1__27625_SHARP_));
}),clojure.string.split_lines.call(null,stack_str));
});
figwheel.client.get_ua_product = (function figwheel$client$get_ua_product(){
if(cljs.core.truth_(figwheel.client.utils.node_env_QMARK_.call(null))){
return new cljs.core.Keyword(null,"chrome","chrome",1718738387);
} else {
if(cljs.core.truth_(goog.userAgent.product.SAFARI)){
return new cljs.core.Keyword(null,"safari","safari",497115653);
} else {
if(cljs.core.truth_(goog.userAgent.product.CHROME)){
return new cljs.core.Keyword(null,"chrome","chrome",1718738387);
} else {
if(cljs.core.truth_(goog.userAgent.product.FIREFOX)){
return new cljs.core.Keyword(null,"firefox","firefox",1283768880);
} else {
if(cljs.core.truth_(goog.userAgent.product.IE)){
return new cljs.core.Keyword(null,"ie","ie",2038473780);
} else {
return null;
}
}
}
}
}
});
var base_path_27632 = figwheel.client.utils.base_url_path.call(null);
figwheel.client.eval_javascript_STAR__STAR_ = ((function (base_path_27632){
return (function figwheel$client$eval_javascript_STAR__STAR_(code,opts,result_handler){
try{var _STAR_print_fn_STAR_27630 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR_27631 = cljs.core._STAR_print_newline_STAR_;
cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_fn_STAR_27630,_STAR_print_newline_STAR_27631,base_path_27632){
return (function() { 
var G__27633__delegate = function (args){
return figwheel.client.figwheel_repl_print.call(null,figwheel.client.console_print.call(null,args));
};
var G__27633 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__27634__i = 0, G__27634__a = new Array(arguments.length -  0);
while (G__27634__i < G__27634__a.length) {G__27634__a[G__27634__i] = arguments[G__27634__i + 0]; ++G__27634__i;}
  args = new cljs.core.IndexedSeq(G__27634__a,0);
} 
return G__27633__delegate.call(this,args);};
G__27633.cljs$lang$maxFixedArity = 0;
G__27633.cljs$lang$applyTo = (function (arglist__27635){
var args = cljs.core.seq(arglist__27635);
return G__27633__delegate(args);
});
G__27633.cljs$core$IFn$_invoke$arity$variadic = G__27633__delegate;
return G__27633;
})()
;})(_STAR_print_fn_STAR_27630,_STAR_print_newline_STAR_27631,base_path_27632))
;

cljs.core._STAR_print_newline_STAR_ = false;

try{return result_handler.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"success","success",1890645906),new cljs.core.Keyword(null,"ua-product","ua-product",938384227),figwheel.client.get_ua_product.call(null),new cljs.core.Keyword(null,"value","value",305978217),[cljs.core.str(figwheel.client.utils.eval_helper.call(null,code,opts))].join('')], null));
}finally {cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_27631;

cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_27630;
}}catch (e27629){if((e27629 instanceof Error)){
var e = e27629;
return result_handler.call(null,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"exception","exception",-335277064),new cljs.core.Keyword(null,"value","value",305978217),cljs.core.pr_str.call(null,e),new cljs.core.Keyword(null,"ua-product","ua-product",938384227),figwheel.client.get_ua_product.call(null),new cljs.core.Keyword(null,"stacktrace","stacktrace",-95588394),clojure.string.join.call(null,"\n",figwheel.client.truncate_stack_trace.call(null,e.stack)),new cljs.core.Keyword(null,"base-path","base-path",495760020),base_path_27632], null));
} else {
var e = e27629;
return result_handler.call(null,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"exception","exception",-335277064),new cljs.core.Keyword(null,"ua-product","ua-product",938384227),figwheel.client.get_ua_product.call(null),new cljs.core.Keyword(null,"value","value",305978217),cljs.core.pr_str.call(null,e),new cljs.core.Keyword(null,"stacktrace","stacktrace",-95588394),"No stacktrace available."], null));

}
}});})(base_path_27632))
;
/**
 * The REPL can disconnect and reconnect lets ensure cljs.user exists at least.
 */
figwheel.client.ensure_cljs_user = (function figwheel$client$ensure_cljs_user(){
if(cljs.core.truth_(cljs.user)){
return null;
} else {
return cljs.user = {};
}
});
figwheel.client.repl_plugin = (function figwheel$client$repl_plugin(p__27636){
var map__27643 = p__27636;
var map__27643__$1 = ((((!((map__27643 == null)))?((((map__27643.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27643.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27643):map__27643);
var opts = map__27643__$1;
var build_id = cljs.core.get.call(null,map__27643__$1,new cljs.core.Keyword(null,"build-id","build-id",1642831089));
return ((function (map__27643,map__27643__$1,opts,build_id){
return (function (p__27645){
var vec__27646 = p__27645;
var map__27647 = cljs.core.nth.call(null,vec__27646,(0),null);
var map__27647__$1 = ((((!((map__27647 == null)))?((((map__27647.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27647.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27647):map__27647);
var msg = map__27647__$1;
var msg_name = cljs.core.get.call(null,map__27647__$1,new cljs.core.Keyword(null,"msg-name","msg-name",-353709863));
var _ = cljs.core.nthnext.call(null,vec__27646,(1));
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"repl-eval","repl-eval",-1784727398),msg_name)){
figwheel.client.ensure_cljs_user.call(null);

return figwheel.client.eval_javascript_STAR__STAR_.call(null,new cljs.core.Keyword(null,"code","code",1586293142).cljs$core$IFn$_invoke$arity$1(msg),opts,((function (vec__27646,map__27647,map__27647__$1,msg,msg_name,_,map__27643,map__27643__$1,opts,build_id){
return (function (res){
return figwheel.client.socket.send_BANG_.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"figwheel-event","figwheel-event",519570592),"callback",new cljs.core.Keyword(null,"callback-name","callback-name",336964714),new cljs.core.Keyword(null,"callback-name","callback-name",336964714).cljs$core$IFn$_invoke$arity$1(msg),new cljs.core.Keyword(null,"content","content",15833224),res], null));
});})(vec__27646,map__27647,map__27647__$1,msg,msg_name,_,map__27643,map__27643__$1,opts,build_id))
);
} else {
return null;
}
});
;})(map__27643,map__27643__$1,opts,build_id))
});
figwheel.client.css_reloader_plugin = (function figwheel$client$css_reloader_plugin(opts){
return (function (p__27653){
var vec__27654 = p__27653;
var map__27655 = cljs.core.nth.call(null,vec__27654,(0),null);
var map__27655__$1 = ((((!((map__27655 == null)))?((((map__27655.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27655.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27655):map__27655);
var msg = map__27655__$1;
var msg_name = cljs.core.get.call(null,map__27655__$1,new cljs.core.Keyword(null,"msg-name","msg-name",-353709863));
var _ = cljs.core.nthnext.call(null,vec__27654,(1));
if(cljs.core._EQ_.call(null,msg_name,new cljs.core.Keyword(null,"css-files-changed","css-files-changed",720773874))){
return figwheel.client.file_reloading.reload_css_files.call(null,opts,msg);
} else {
return null;
}
});
});
figwheel.client.compile_fail_warning_plugin = (function figwheel$client$compile_fail_warning_plugin(p__27657){
var map__27667 = p__27657;
var map__27667__$1 = ((((!((map__27667 == null)))?((((map__27667.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27667.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27667):map__27667);
var on_compile_warning = cljs.core.get.call(null,map__27667__$1,new cljs.core.Keyword(null,"on-compile-warning","on-compile-warning",-1195585947));
var on_compile_fail = cljs.core.get.call(null,map__27667__$1,new cljs.core.Keyword(null,"on-compile-fail","on-compile-fail",728013036));
return ((function (map__27667,map__27667__$1,on_compile_warning,on_compile_fail){
return (function (p__27669){
var vec__27670 = p__27669;
var map__27671 = cljs.core.nth.call(null,vec__27670,(0),null);
var map__27671__$1 = ((((!((map__27671 == null)))?((((map__27671.cljs$lang$protocol_mask$partition0$ & (64))) || (map__27671.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__27671):map__27671);
var msg = map__27671__$1;
var msg_name = cljs.core.get.call(null,map__27671__$1,new cljs.core.Keyword(null,"msg-name","msg-name",-353709863));
var _ = cljs.core.nthnext.call(null,vec__27670,(1));
var pred__27673 = cljs.core._EQ_;
var expr__27674 = msg_name;
if(cljs.core.truth_(pred__27673.call(null,new cljs.core.Keyword(null,"compile-warning","compile-warning",43425356),expr__27674))){
return on_compile_warning.call(null,msg);
} else {
if(cljs.core.truth_(pred__27673.call(null,new cljs.core.Keyword(null,"compile-failed","compile-failed",-477639289),expr__27674))){
return on_compile_fail.call(null,msg);
} else {
return null;
}
}
});
;})(map__27667,map__27667__$1,on_compile_warning,on_compile_fail))
});
figwheel.client.heads_up_plugin_msg_handler = (function figwheel$client$heads_up_plugin_msg_handler(opts,msg_hist_SINGLEQUOTE_){
var msg_hist = figwheel.client.focus_msgs.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"compile-failed","compile-failed",-477639289),null,new cljs.core.Keyword(null,"compile-warning","compile-warning",43425356),null,new cljs.core.Keyword(null,"files-changed","files-changed",-1418200563),null], null), null),msg_hist_SINGLEQUOTE_);
var msg_names = cljs.core.map.call(null,new cljs.core.Keyword(null,"msg-name","msg-name",-353709863),msg_hist);
var msg = cljs.core.first.call(null,msg_hist);
var c__23272__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto__,msg_hist,msg_names,msg){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto__,msg_hist,msg_names,msg){
return (function (state_27890){
var state_val_27891 = (state_27890[(1)]);
if((state_val_27891 === (7))){
var inst_27814 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
if(cljs.core.truth_(inst_27814)){
var statearr_27892_27938 = state_27890__$1;
(statearr_27892_27938[(1)] = (8));

} else {
var statearr_27893_27939 = state_27890__$1;
(statearr_27893_27939[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (20))){
var inst_27884 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27894_27940 = state_27890__$1;
(statearr_27894_27940[(2)] = inst_27884);

(statearr_27894_27940[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (27))){
var inst_27880 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27895_27941 = state_27890__$1;
(statearr_27895_27941[(2)] = inst_27880);

(statearr_27895_27941[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (1))){
var inst_27807 = figwheel.client.reload_file_state_QMARK_.call(null,msg_names,opts);
var state_27890__$1 = state_27890;
if(cljs.core.truth_(inst_27807)){
var statearr_27896_27942 = state_27890__$1;
(statearr_27896_27942[(1)] = (2));

} else {
var statearr_27897_27943 = state_27890__$1;
(statearr_27897_27943[(1)] = (3));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (24))){
var inst_27882 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27898_27944 = state_27890__$1;
(statearr_27898_27944[(2)] = inst_27882);

(statearr_27898_27944[(1)] = (20));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (4))){
var inst_27888 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_27890__$1,inst_27888);
} else {
if((state_val_27891 === (15))){
var inst_27886 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27899_27945 = state_27890__$1;
(statearr_27899_27945[(2)] = inst_27886);

(statearr_27899_27945[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (21))){
var inst_27845 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27900_27946 = state_27890__$1;
(statearr_27900_27946[(2)] = inst_27845);

(statearr_27900_27946[(1)] = (20));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (31))){
var inst_27869 = figwheel.client.css_loaded_state_QMARK_.call(null,msg_names);
var state_27890__$1 = state_27890;
if(cljs.core.truth_(inst_27869)){
var statearr_27901_27947 = state_27890__$1;
(statearr_27901_27947[(1)] = (34));

} else {
var statearr_27902_27948 = state_27890__$1;
(statearr_27902_27948[(1)] = (35));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (32))){
var inst_27878 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27903_27949 = state_27890__$1;
(statearr_27903_27949[(2)] = inst_27878);

(statearr_27903_27949[(1)] = (27));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (33))){
var inst_27867 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27904_27950 = state_27890__$1;
(statearr_27904_27950[(2)] = inst_27867);

(statearr_27904_27950[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (13))){
var inst_27828 = figwheel.client.heads_up.clear.call(null);
var state_27890__$1 = state_27890;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27890__$1,(16),inst_27828);
} else {
if((state_val_27891 === (22))){
var inst_27849 = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(msg);
var inst_27850 = figwheel.client.heads_up.append_message.call(null,inst_27849);
var state_27890__$1 = state_27890;
var statearr_27905_27951 = state_27890__$1;
(statearr_27905_27951[(2)] = inst_27850);

(statearr_27905_27951[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (36))){
var inst_27876 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27906_27952 = state_27890__$1;
(statearr_27906_27952[(2)] = inst_27876);

(statearr_27906_27952[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (29))){
var inst_27860 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27907_27953 = state_27890__$1;
(statearr_27907_27953[(2)] = inst_27860);

(statearr_27907_27953[(1)] = (27));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (6))){
var inst_27809 = (state_27890[(7)]);
var state_27890__$1 = state_27890;
var statearr_27908_27954 = state_27890__$1;
(statearr_27908_27954[(2)] = inst_27809);

(statearr_27908_27954[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (28))){
var inst_27856 = (state_27890[(2)]);
var inst_27857 = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(msg);
var inst_27858 = figwheel.client.heads_up.display_warning.call(null,inst_27857);
var state_27890__$1 = (function (){var statearr_27909 = state_27890;
(statearr_27909[(8)] = inst_27856);

return statearr_27909;
})();
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27890__$1,(29),inst_27858);
} else {
if((state_val_27891 === (25))){
var inst_27854 = figwheel.client.heads_up.clear.call(null);
var state_27890__$1 = state_27890;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27890__$1,(28),inst_27854);
} else {
if((state_val_27891 === (34))){
var inst_27871 = figwheel.client.heads_up.flash_loaded.call(null);
var state_27890__$1 = state_27890;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27890__$1,(37),inst_27871);
} else {
if((state_val_27891 === (17))){
var inst_27836 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27910_27955 = state_27890__$1;
(statearr_27910_27955[(2)] = inst_27836);

(statearr_27910_27955[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (3))){
var inst_27826 = figwheel.client.compile_refail_state_QMARK_.call(null,msg_names);
var state_27890__$1 = state_27890;
if(cljs.core.truth_(inst_27826)){
var statearr_27911_27956 = state_27890__$1;
(statearr_27911_27956[(1)] = (13));

} else {
var statearr_27912_27957 = state_27890__$1;
(statearr_27912_27957[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (12))){
var inst_27822 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27913_27958 = state_27890__$1;
(statearr_27913_27958[(2)] = inst_27822);

(statearr_27913_27958[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (2))){
var inst_27809 = (state_27890[(7)]);
var inst_27809__$1 = figwheel.client.autoload_QMARK_.call(null);
var state_27890__$1 = (function (){var statearr_27914 = state_27890;
(statearr_27914[(7)] = inst_27809__$1);

return statearr_27914;
})();
if(cljs.core.truth_(inst_27809__$1)){
var statearr_27915_27959 = state_27890__$1;
(statearr_27915_27959[(1)] = (5));

} else {
var statearr_27916_27960 = state_27890__$1;
(statearr_27916_27960[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (23))){
var inst_27852 = figwheel.client.rewarning_state_QMARK_.call(null,msg_names);
var state_27890__$1 = state_27890;
if(cljs.core.truth_(inst_27852)){
var statearr_27917_27961 = state_27890__$1;
(statearr_27917_27961[(1)] = (25));

} else {
var statearr_27918_27962 = state_27890__$1;
(statearr_27918_27962[(1)] = (26));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (35))){
var state_27890__$1 = state_27890;
var statearr_27919_27963 = state_27890__$1;
(statearr_27919_27963[(2)] = null);

(statearr_27919_27963[(1)] = (36));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (19))){
var inst_27847 = figwheel.client.warning_append_state_QMARK_.call(null,msg_names);
var state_27890__$1 = state_27890;
if(cljs.core.truth_(inst_27847)){
var statearr_27920_27964 = state_27890__$1;
(statearr_27920_27964[(1)] = (22));

} else {
var statearr_27921_27965 = state_27890__$1;
(statearr_27921_27965[(1)] = (23));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (11))){
var inst_27818 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27922_27966 = state_27890__$1;
(statearr_27922_27966[(2)] = inst_27818);

(statearr_27922_27966[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (9))){
var inst_27820 = figwheel.client.heads_up.clear.call(null);
var state_27890__$1 = state_27890;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27890__$1,(12),inst_27820);
} else {
if((state_val_27891 === (5))){
var inst_27811 = new cljs.core.Keyword(null,"autoload","autoload",-354122500).cljs$core$IFn$_invoke$arity$1(opts);
var state_27890__$1 = state_27890;
var statearr_27923_27967 = state_27890__$1;
(statearr_27923_27967[(2)] = inst_27811);

(statearr_27923_27967[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (14))){
var inst_27838 = figwheel.client.compile_fail_state_QMARK_.call(null,msg_names);
var state_27890__$1 = state_27890;
if(cljs.core.truth_(inst_27838)){
var statearr_27924_27968 = state_27890__$1;
(statearr_27924_27968[(1)] = (18));

} else {
var statearr_27925_27969 = state_27890__$1;
(statearr_27925_27969[(1)] = (19));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (26))){
var inst_27862 = figwheel.client.warning_state_QMARK_.call(null,msg_names);
var state_27890__$1 = state_27890;
if(cljs.core.truth_(inst_27862)){
var statearr_27926_27970 = state_27890__$1;
(statearr_27926_27970[(1)] = (30));

} else {
var statearr_27927_27971 = state_27890__$1;
(statearr_27927_27971[(1)] = (31));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (16))){
var inst_27830 = (state_27890[(2)]);
var inst_27831 = new cljs.core.Keyword(null,"exception-data","exception-data",-512474886).cljs$core$IFn$_invoke$arity$1(msg);
var inst_27832 = figwheel.client.format_messages.call(null,inst_27831);
var inst_27833 = new cljs.core.Keyword(null,"cause","cause",231901252).cljs$core$IFn$_invoke$arity$1(msg);
var inst_27834 = figwheel.client.heads_up.display_error.call(null,inst_27832,inst_27833);
var state_27890__$1 = (function (){var statearr_27928 = state_27890;
(statearr_27928[(9)] = inst_27830);

return statearr_27928;
})();
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27890__$1,(17),inst_27834);
} else {
if((state_val_27891 === (30))){
var inst_27864 = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(msg);
var inst_27865 = figwheel.client.heads_up.display_warning.call(null,inst_27864);
var state_27890__$1 = state_27890;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27890__$1,(33),inst_27865);
} else {
if((state_val_27891 === (10))){
var inst_27824 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27929_27972 = state_27890__$1;
(statearr_27929_27972[(2)] = inst_27824);

(statearr_27929_27972[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (18))){
var inst_27840 = new cljs.core.Keyword(null,"exception-data","exception-data",-512474886).cljs$core$IFn$_invoke$arity$1(msg);
var inst_27841 = figwheel.client.format_messages.call(null,inst_27840);
var inst_27842 = new cljs.core.Keyword(null,"cause","cause",231901252).cljs$core$IFn$_invoke$arity$1(msg);
var inst_27843 = figwheel.client.heads_up.display_error.call(null,inst_27841,inst_27842);
var state_27890__$1 = state_27890;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27890__$1,(21),inst_27843);
} else {
if((state_val_27891 === (37))){
var inst_27873 = (state_27890[(2)]);
var state_27890__$1 = state_27890;
var statearr_27930_27973 = state_27890__$1;
(statearr_27930_27973[(2)] = inst_27873);

(statearr_27930_27973[(1)] = (36));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_27891 === (8))){
var inst_27816 = figwheel.client.heads_up.flash_loaded.call(null);
var state_27890__$1 = state_27890;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_27890__$1,(11),inst_27816);
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
});})(c__23272__auto__,msg_hist,msg_names,msg))
;
return ((function (switch__23207__auto__,c__23272__auto__,msg_hist,msg_names,msg){
return (function() {
var figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto__ = null;
var figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto____0 = (function (){
var statearr_27934 = [null,null,null,null,null,null,null,null,null,null];
(statearr_27934[(0)] = figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto__);

(statearr_27934[(1)] = (1));

return statearr_27934;
});
var figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto____1 = (function (state_27890){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_27890);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e27935){if((e27935 instanceof Object)){
var ex__23211__auto__ = e27935;
var statearr_27936_27974 = state_27890;
(statearr_27936_27974[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_27890);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e27935;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__27975 = state_27890;
state_27890 = G__27975;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto__ = function(state_27890){
switch(arguments.length){
case 0:
return figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto____0.call(this);
case 1:
return figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto____1.call(this,state_27890);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto____0;
figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto____1;
return figwheel$client$heads_up_plugin_msg_handler_$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto__,msg_hist,msg_names,msg))
})();
var state__23274__auto__ = (function (){var statearr_27937 = f__23273__auto__.call(null);
(statearr_27937[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto__);

return statearr_27937;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto__,msg_hist,msg_names,msg))
);

return c__23272__auto__;
});
figwheel.client.heads_up_plugin = (function figwheel$client$heads_up_plugin(opts){
var ch = cljs.core.async.chan.call(null);
figwheel.client.heads_up_config_options_STAR__STAR_ = opts;

var c__23272__auto___28038 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___28038,ch){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___28038,ch){
return (function (state_28021){
var state_val_28022 = (state_28021[(1)]);
if((state_val_28022 === (1))){
var state_28021__$1 = state_28021;
var statearr_28023_28039 = state_28021__$1;
(statearr_28023_28039[(2)] = null);

(statearr_28023_28039[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_28022 === (2))){
var state_28021__$1 = state_28021;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_28021__$1,(4),ch);
} else {
if((state_val_28022 === (3))){
var inst_28019 = (state_28021[(2)]);
var state_28021__$1 = state_28021;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_28021__$1,inst_28019);
} else {
if((state_val_28022 === (4))){
var inst_28009 = (state_28021[(7)]);
var inst_28009__$1 = (state_28021[(2)]);
var state_28021__$1 = (function (){var statearr_28024 = state_28021;
(statearr_28024[(7)] = inst_28009__$1);

return statearr_28024;
})();
if(cljs.core.truth_(inst_28009__$1)){
var statearr_28025_28040 = state_28021__$1;
(statearr_28025_28040[(1)] = (5));

} else {
var statearr_28026_28041 = state_28021__$1;
(statearr_28026_28041[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_28022 === (5))){
var inst_28009 = (state_28021[(7)]);
var inst_28011 = figwheel.client.heads_up_plugin_msg_handler.call(null,opts,inst_28009);
var state_28021__$1 = state_28021;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_28021__$1,(8),inst_28011);
} else {
if((state_val_28022 === (6))){
var state_28021__$1 = state_28021;
var statearr_28027_28042 = state_28021__$1;
(statearr_28027_28042[(2)] = null);

(statearr_28027_28042[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_28022 === (7))){
var inst_28017 = (state_28021[(2)]);
var state_28021__$1 = state_28021;
var statearr_28028_28043 = state_28021__$1;
(statearr_28028_28043[(2)] = inst_28017);

(statearr_28028_28043[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_28022 === (8))){
var inst_28013 = (state_28021[(2)]);
var state_28021__$1 = (function (){var statearr_28029 = state_28021;
(statearr_28029[(8)] = inst_28013);

return statearr_28029;
})();
var statearr_28030_28044 = state_28021__$1;
(statearr_28030_28044[(2)] = null);

(statearr_28030_28044[(1)] = (2));


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
});})(c__23272__auto___28038,ch))
;
return ((function (switch__23207__auto__,c__23272__auto___28038,ch){
return (function() {
var figwheel$client$heads_up_plugin_$_state_machine__23208__auto__ = null;
var figwheel$client$heads_up_plugin_$_state_machine__23208__auto____0 = (function (){
var statearr_28034 = [null,null,null,null,null,null,null,null,null];
(statearr_28034[(0)] = figwheel$client$heads_up_plugin_$_state_machine__23208__auto__);

(statearr_28034[(1)] = (1));

return statearr_28034;
});
var figwheel$client$heads_up_plugin_$_state_machine__23208__auto____1 = (function (state_28021){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_28021);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e28035){if((e28035 instanceof Object)){
var ex__23211__auto__ = e28035;
var statearr_28036_28045 = state_28021;
(statearr_28036_28045[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_28021);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e28035;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__28046 = state_28021;
state_28021 = G__28046;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
figwheel$client$heads_up_plugin_$_state_machine__23208__auto__ = function(state_28021){
switch(arguments.length){
case 0:
return figwheel$client$heads_up_plugin_$_state_machine__23208__auto____0.call(this);
case 1:
return figwheel$client$heads_up_plugin_$_state_machine__23208__auto____1.call(this,state_28021);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
figwheel$client$heads_up_plugin_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = figwheel$client$heads_up_plugin_$_state_machine__23208__auto____0;
figwheel$client$heads_up_plugin_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = figwheel$client$heads_up_plugin_$_state_machine__23208__auto____1;
return figwheel$client$heads_up_plugin_$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___28038,ch))
})();
var state__23274__auto__ = (function (){var statearr_28037 = f__23273__auto__.call(null);
(statearr_28037[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___28038);

return statearr_28037;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___28038,ch))
);


figwheel.client.heads_up.ensure_container.call(null);

return ((function (ch){
return (function (msg_hist){
cljs.core.async.put_BANG_.call(null,ch,msg_hist);

return msg_hist;
});
;})(ch))
});
figwheel.client.enforce_project_plugin = (function figwheel$client$enforce_project_plugin(opts){
return (function (msg_hist){
if(((1) < cljs.core.count.call(null,cljs.core.set.call(null,cljs.core.keep.call(null,new cljs.core.Keyword(null,"project-id","project-id",206449307),cljs.core.take.call(null,(5),msg_hist)))))){
figwheel.client.socket.close_BANG_.call(null);

console.error("Figwheel: message received from different project. Shutting socket down.");

if(cljs.core.truth_(new cljs.core.Keyword(null,"heads-up-display","heads-up-display",-896577202).cljs$core$IFn$_invoke$arity$1(opts))){
var c__23272__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto__){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto__){
return (function (state_28067){
var state_val_28068 = (state_28067[(1)]);
if((state_val_28068 === (1))){
var inst_28062 = cljs.core.async.timeout.call(null,(3000));
var state_28067__$1 = state_28067;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_28067__$1,(2),inst_28062);
} else {
if((state_val_28068 === (2))){
var inst_28064 = (state_28067[(2)]);
var inst_28065 = figwheel.client.heads_up.display_system_warning.call(null,"Connection from different project","Shutting connection down!!!!!");
var state_28067__$1 = (function (){var statearr_28069 = state_28067;
(statearr_28069[(7)] = inst_28064);

return statearr_28069;
})();
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_28067__$1,inst_28065);
} else {
return null;
}
}
});})(c__23272__auto__))
;
return ((function (switch__23207__auto__,c__23272__auto__){
return (function() {
var figwheel$client$enforce_project_plugin_$_state_machine__23208__auto__ = null;
var figwheel$client$enforce_project_plugin_$_state_machine__23208__auto____0 = (function (){
var statearr_28073 = [null,null,null,null,null,null,null,null];
(statearr_28073[(0)] = figwheel$client$enforce_project_plugin_$_state_machine__23208__auto__);

(statearr_28073[(1)] = (1));

return statearr_28073;
});
var figwheel$client$enforce_project_plugin_$_state_machine__23208__auto____1 = (function (state_28067){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_28067);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e28074){if((e28074 instanceof Object)){
var ex__23211__auto__ = e28074;
var statearr_28075_28077 = state_28067;
(statearr_28075_28077[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_28067);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e28074;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__28078 = state_28067;
state_28067 = G__28078;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
figwheel$client$enforce_project_plugin_$_state_machine__23208__auto__ = function(state_28067){
switch(arguments.length){
case 0:
return figwheel$client$enforce_project_plugin_$_state_machine__23208__auto____0.call(this);
case 1:
return figwheel$client$enforce_project_plugin_$_state_machine__23208__auto____1.call(this,state_28067);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
figwheel$client$enforce_project_plugin_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = figwheel$client$enforce_project_plugin_$_state_machine__23208__auto____0;
figwheel$client$enforce_project_plugin_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = figwheel$client$enforce_project_plugin_$_state_machine__23208__auto____1;
return figwheel$client$enforce_project_plugin_$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto__))
})();
var state__23274__auto__ = (function (){var statearr_28076 = f__23273__auto__.call(null);
(statearr_28076[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto__);

return statearr_28076;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto__))
);

return c__23272__auto__;
} else {
return null;
}
} else {
return null;
}
});
});
figwheel.client.default_on_jsload = cljs.core.identity;
figwheel.client.default_on_compile_fail = (function figwheel$client$default_on_compile_fail(p__28079){
var map__28086 = p__28079;
var map__28086__$1 = ((((!((map__28086 == null)))?((((map__28086.cljs$lang$protocol_mask$partition0$ & (64))) || (map__28086.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__28086):map__28086);
var ed = map__28086__$1;
var formatted_exception = cljs.core.get.call(null,map__28086__$1,new cljs.core.Keyword(null,"formatted-exception","formatted-exception",-116489026));
var exception_data = cljs.core.get.call(null,map__28086__$1,new cljs.core.Keyword(null,"exception-data","exception-data",-512474886));
var cause = cljs.core.get.call(null,map__28086__$1,new cljs.core.Keyword(null,"cause","cause",231901252));
figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"debug","debug",-1608172596),"Figwheel: Compile Exception");

var seq__28088_28092 = cljs.core.seq.call(null,figwheel.client.format_messages.call(null,exception_data));
var chunk__28089_28093 = null;
var count__28090_28094 = (0);
var i__28091_28095 = (0);
while(true){
if((i__28091_28095 < count__28090_28094)){
var msg_28096 = cljs.core._nth.call(null,chunk__28089_28093,i__28091_28095);
figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"info","info",-317069002),msg_28096);

var G__28097 = seq__28088_28092;
var G__28098 = chunk__28089_28093;
var G__28099 = count__28090_28094;
var G__28100 = (i__28091_28095 + (1));
seq__28088_28092 = G__28097;
chunk__28089_28093 = G__28098;
count__28090_28094 = G__28099;
i__28091_28095 = G__28100;
continue;
} else {
var temp__4425__auto___28101 = cljs.core.seq.call(null,seq__28088_28092);
if(temp__4425__auto___28101){
var seq__28088_28102__$1 = temp__4425__auto___28101;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__28088_28102__$1)){
var c__17535__auto___28103 = cljs.core.chunk_first.call(null,seq__28088_28102__$1);
var G__28104 = cljs.core.chunk_rest.call(null,seq__28088_28102__$1);
var G__28105 = c__17535__auto___28103;
var G__28106 = cljs.core.count.call(null,c__17535__auto___28103);
var G__28107 = (0);
seq__28088_28092 = G__28104;
chunk__28089_28093 = G__28105;
count__28090_28094 = G__28106;
i__28091_28095 = G__28107;
continue;
} else {
var msg_28108 = cljs.core.first.call(null,seq__28088_28102__$1);
figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"info","info",-317069002),msg_28108);

var G__28109 = cljs.core.next.call(null,seq__28088_28102__$1);
var G__28110 = null;
var G__28111 = (0);
var G__28112 = (0);
seq__28088_28092 = G__28109;
chunk__28089_28093 = G__28110;
count__28090_28094 = G__28111;
i__28091_28095 = G__28112;
continue;
}
} else {
}
}
break;
}

if(cljs.core.truth_(cause)){
figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"info","info",-317069002),[cljs.core.str("Error on file "),cljs.core.str(new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(cause)),cljs.core.str(", line "),cljs.core.str(new cljs.core.Keyword(null,"line","line",212345235).cljs$core$IFn$_invoke$arity$1(cause)),cljs.core.str(", column "),cljs.core.str(new cljs.core.Keyword(null,"column","column",2078222095).cljs$core$IFn$_invoke$arity$1(cause))].join(''));
} else {
}

return ed;
});
figwheel.client.default_on_compile_warning = (function figwheel$client$default_on_compile_warning(p__28113){
var map__28116 = p__28113;
var map__28116__$1 = ((((!((map__28116 == null)))?((((map__28116.cljs$lang$protocol_mask$partition0$ & (64))) || (map__28116.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__28116):map__28116);
var w = map__28116__$1;
var message = cljs.core.get.call(null,map__28116__$1,new cljs.core.Keyword(null,"message","message",-406056002));
figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"warn","warn",-436710552),[cljs.core.str("Figwheel: Compile Warning - "),cljs.core.str(message)].join(''));

return w;
});
figwheel.client.default_before_load = (function figwheel$client$default_before_load(files){
figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"debug","debug",-1608172596),"Figwheel: notified of file changes");

return files;
});
figwheel.client.default_on_cssload = (function figwheel$client$default_on_cssload(files){
figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"debug","debug",-1608172596),"Figwheel: loaded CSS files");

figwheel.client.utils.log.call(null,new cljs.core.Keyword(null,"info","info",-317069002),cljs.core.pr_str.call(null,cljs.core.map.call(null,new cljs.core.Keyword(null,"file","file",-1269645878),files)));

return files;
});
if(typeof figwheel.client.config_defaults !== 'undefined'){
} else {
figwheel.client.config_defaults = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"on-compile-warning","on-compile-warning",-1195585947),new cljs.core.Keyword(null,"on-jsload","on-jsload",-395756602),new cljs.core.Keyword(null,"reload-dependents","reload-dependents",-956865430),new cljs.core.Keyword(null,"on-compile-fail","on-compile-fail",728013036),new cljs.core.Keyword(null,"debug","debug",-1608172596),new cljs.core.Keyword(null,"heads-up-display","heads-up-display",-896577202),new cljs.core.Keyword(null,"websocket-url","websocket-url",-490444938),new cljs.core.Keyword(null,"before-jsload","before-jsload",-847513128),new cljs.core.Keyword(null,"load-warninged-code","load-warninged-code",-2030345223),new cljs.core.Keyword(null,"eval-fn","eval-fn",-1111644294),new cljs.core.Keyword(null,"retry-count","retry-count",1936122875),new cljs.core.Keyword(null,"autoload","autoload",-354122500),new cljs.core.Keyword(null,"on-cssload","on-cssload",1825432318)],[figwheel.client.default_on_compile_warning,figwheel.client.default_on_jsload,true,figwheel.client.default_on_compile_fail,false,true,[cljs.core.str("ws://"),cljs.core.str((cljs.core.truth_(figwheel.client.utils.html_env_QMARK_.call(null))?location.host:"localhost:3449")),cljs.core.str("/figwheel-ws")].join(''),figwheel.client.default_before_load,false,false,(100),true,figwheel.client.default_on_cssload]);
}
figwheel.client.handle_deprecated_jsload_callback = (function figwheel$client$handle_deprecated_jsload_callback(config){
if(cljs.core.truth_(new cljs.core.Keyword(null,"jsload-callback","jsload-callback",-1949628369).cljs$core$IFn$_invoke$arity$1(config))){
return cljs.core.dissoc.call(null,cljs.core.assoc.call(null,config,new cljs.core.Keyword(null,"on-jsload","on-jsload",-395756602),new cljs.core.Keyword(null,"jsload-callback","jsload-callback",-1949628369).cljs$core$IFn$_invoke$arity$1(config)),new cljs.core.Keyword(null,"jsload-callback","jsload-callback",-1949628369));
} else {
return config;
}
});
figwheel.client.base_plugins = (function figwheel$client$base_plugins(system_options){
var base = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"enforce-project-plugin","enforce-project-plugin",959402899),figwheel.client.enforce_project_plugin,new cljs.core.Keyword(null,"file-reloader-plugin","file-reloader-plugin",-1792964733),figwheel.client.file_reloader_plugin,new cljs.core.Keyword(null,"comp-fail-warning-plugin","comp-fail-warning-plugin",634311),figwheel.client.compile_fail_warning_plugin,new cljs.core.Keyword(null,"css-reloader-plugin","css-reloader-plugin",2002032904),figwheel.client.css_reloader_plugin,new cljs.core.Keyword(null,"repl-plugin","repl-plugin",-1138952371),figwheel.client.repl_plugin], null);
var base__$1 = ((cljs.core.not.call(null,figwheel.client.utils.html_env_QMARK_.call(null)))?cljs.core.select_keys.call(null,base,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"file-reloader-plugin","file-reloader-plugin",-1792964733),new cljs.core.Keyword(null,"comp-fail-warning-plugin","comp-fail-warning-plugin",634311),new cljs.core.Keyword(null,"repl-plugin","repl-plugin",-1138952371)], null)):base);
var base__$2 = ((new cljs.core.Keyword(null,"autoload","autoload",-354122500).cljs$core$IFn$_invoke$arity$1(system_options) === false)?cljs.core.dissoc.call(null,base__$1,new cljs.core.Keyword(null,"file-reloader-plugin","file-reloader-plugin",-1792964733)):base__$1);
if(cljs.core.truth_((function (){var and__16720__auto__ = new cljs.core.Keyword(null,"heads-up-display","heads-up-display",-896577202).cljs$core$IFn$_invoke$arity$1(system_options);
if(cljs.core.truth_(and__16720__auto__)){
return figwheel.client.utils.html_env_QMARK_.call(null);
} else {
return and__16720__auto__;
}
})())){
return cljs.core.assoc.call(null,base__$2,new cljs.core.Keyword(null,"heads-up-display-plugin","heads-up-display-plugin",1745207501),figwheel.client.heads_up_plugin);
} else {
return base__$2;
}
});
figwheel.client.add_message_watch = (function figwheel$client$add_message_watch(key,callback){
return cljs.core.add_watch.call(null,figwheel.client.socket.message_history_atom,key,(function (_,___$1,___$2,msg_hist){
return callback.call(null,cljs.core.first.call(null,msg_hist));
}));
});
figwheel.client.add_plugins = (function figwheel$client$add_plugins(plugins,system_options){
var seq__28124 = cljs.core.seq.call(null,plugins);
var chunk__28125 = null;
var count__28126 = (0);
var i__28127 = (0);
while(true){
if((i__28127 < count__28126)){
var vec__28128 = cljs.core._nth.call(null,chunk__28125,i__28127);
var k = cljs.core.nth.call(null,vec__28128,(0),null);
var plugin = cljs.core.nth.call(null,vec__28128,(1),null);
if(cljs.core.truth_(plugin)){
var pl_28130 = plugin.call(null,system_options);
cljs.core.add_watch.call(null,figwheel.client.socket.message_history_atom,k,((function (seq__28124,chunk__28125,count__28126,i__28127,pl_28130,vec__28128,k,plugin){
return (function (_,___$1,___$2,msg_hist){
return pl_28130.call(null,msg_hist);
});})(seq__28124,chunk__28125,count__28126,i__28127,pl_28130,vec__28128,k,plugin))
);
} else {
}

var G__28131 = seq__28124;
var G__28132 = chunk__28125;
var G__28133 = count__28126;
var G__28134 = (i__28127 + (1));
seq__28124 = G__28131;
chunk__28125 = G__28132;
count__28126 = G__28133;
i__28127 = G__28134;
continue;
} else {
var temp__4425__auto__ = cljs.core.seq.call(null,seq__28124);
if(temp__4425__auto__){
var seq__28124__$1 = temp__4425__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__28124__$1)){
var c__17535__auto__ = cljs.core.chunk_first.call(null,seq__28124__$1);
var G__28135 = cljs.core.chunk_rest.call(null,seq__28124__$1);
var G__28136 = c__17535__auto__;
var G__28137 = cljs.core.count.call(null,c__17535__auto__);
var G__28138 = (0);
seq__28124 = G__28135;
chunk__28125 = G__28136;
count__28126 = G__28137;
i__28127 = G__28138;
continue;
} else {
var vec__28129 = cljs.core.first.call(null,seq__28124__$1);
var k = cljs.core.nth.call(null,vec__28129,(0),null);
var plugin = cljs.core.nth.call(null,vec__28129,(1),null);
if(cljs.core.truth_(plugin)){
var pl_28139 = plugin.call(null,system_options);
cljs.core.add_watch.call(null,figwheel.client.socket.message_history_atom,k,((function (seq__28124,chunk__28125,count__28126,i__28127,pl_28139,vec__28129,k,plugin,seq__28124__$1,temp__4425__auto__){
return (function (_,___$1,___$2,msg_hist){
return pl_28139.call(null,msg_hist);
});})(seq__28124,chunk__28125,count__28126,i__28127,pl_28139,vec__28129,k,plugin,seq__28124__$1,temp__4425__auto__))
);
} else {
}

var G__28140 = cljs.core.next.call(null,seq__28124__$1);
var G__28141 = null;
var G__28142 = (0);
var G__28143 = (0);
seq__28124 = G__28140;
chunk__28125 = G__28141;
count__28126 = G__28142;
i__28127 = G__28143;
continue;
}
} else {
return null;
}
}
break;
}
});
figwheel.client.start = (function figwheel$client$start(var_args){
var args28144 = [];
var len__17790__auto___28147 = arguments.length;
var i__17791__auto___28148 = (0);
while(true){
if((i__17791__auto___28148 < len__17790__auto___28147)){
args28144.push((arguments[i__17791__auto___28148]));

var G__28149 = (i__17791__auto___28148 + (1));
i__17791__auto___28148 = G__28149;
continue;
} else {
}
break;
}

var G__28146 = args28144.length;
switch (G__28146) {
case 1:
return figwheel.client.start.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 0:
return figwheel.client.start.cljs$core$IFn$_invoke$arity$0();

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args28144.length)].join('')));

}
});

figwheel.client.start.cljs$core$IFn$_invoke$arity$1 = (function (opts){
if((goog.dependencies_ == null)){
return null;
} else {
if(typeof figwheel.client.__figwheel_start_once__ !== 'undefined'){
return null;
} else {
figwheel.client.__figwheel_start_once__ = setTimeout((function (){
var plugins_SINGLEQUOTE_ = new cljs.core.Keyword(null,"plugins","plugins",1900073717).cljs$core$IFn$_invoke$arity$1(opts);
var merge_plugins = new cljs.core.Keyword(null,"merge-plugins","merge-plugins",-1193912370).cljs$core$IFn$_invoke$arity$1(opts);
var system_options = figwheel.client.handle_deprecated_jsload_callback.call(null,cljs.core.merge.call(null,figwheel.client.config_defaults,cljs.core.dissoc.call(null,opts,new cljs.core.Keyword(null,"plugins","plugins",1900073717),new cljs.core.Keyword(null,"merge-plugins","merge-plugins",-1193912370))));
var plugins = (cljs.core.truth_(plugins_SINGLEQUOTE_)?plugins_SINGLEQUOTE_:cljs.core.merge.call(null,figwheel.client.base_plugins.call(null,system_options),merge_plugins));
figwheel.client.utils._STAR_print_debug_STAR_ = new cljs.core.Keyword(null,"debug","debug",-1608172596).cljs$core$IFn$_invoke$arity$1(opts);

figwheel.client.add_plugins.call(null,plugins,system_options);

figwheel.client.file_reloading.patch_goog_base.call(null);

return figwheel.client.socket.open.call(null,system_options);
}));
}
}
});

figwheel.client.start.cljs$core$IFn$_invoke$arity$0 = (function (){
return figwheel.client.start.call(null,cljs.core.PersistentArrayMap.EMPTY);
});

figwheel.client.start.cljs$lang$maxFixedArity = 1;
figwheel.client.watch_and_reload_with_opts = figwheel.client.start;
figwheel.client.watch_and_reload = (function figwheel$client$watch_and_reload(var_args){
var args__17797__auto__ = [];
var len__17790__auto___28155 = arguments.length;
var i__17791__auto___28156 = (0);
while(true){
if((i__17791__auto___28156 < len__17790__auto___28155)){
args__17797__auto__.push((arguments[i__17791__auto___28156]));

var G__28157 = (i__17791__auto___28156 + (1));
i__17791__auto___28156 = G__28157;
continue;
} else {
}
break;
}

var argseq__17798__auto__ = ((((0) < args__17797__auto__.length))?(new cljs.core.IndexedSeq(args__17797__auto__.slice((0)),(0))):null);
return figwheel.client.watch_and_reload.cljs$core$IFn$_invoke$arity$variadic(argseq__17798__auto__);
});

figwheel.client.watch_and_reload.cljs$core$IFn$_invoke$arity$variadic = (function (p__28152){
var map__28153 = p__28152;
var map__28153__$1 = ((((!((map__28153 == null)))?((((map__28153.cljs$lang$protocol_mask$partition0$ & (64))) || (map__28153.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__28153):map__28153);
var opts = map__28153__$1;
return figwheel.client.start.call(null,opts);
});

figwheel.client.watch_and_reload.cljs$lang$maxFixedArity = (0);

figwheel.client.watch_and_reload.cljs$lang$applyTo = (function (seq28151){
return figwheel.client.watch_and_reload.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq.call(null,seq28151));
});

//# sourceMappingURL=client.js.map