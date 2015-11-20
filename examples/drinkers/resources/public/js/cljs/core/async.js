// Compiled by ClojureScript 1.7.170 {}
goog.provide('cljs.core.async');
goog.require('cljs.core');
goog.require('cljs.core.async.impl.channels');
goog.require('cljs.core.async.impl.dispatch');
goog.require('cljs.core.async.impl.ioc_helpers');
goog.require('cljs.core.async.impl.protocols');
goog.require('cljs.core.async.impl.buffers');
goog.require('cljs.core.async.impl.timers');
cljs.core.async.fn_handler = (function cljs$core$async$fn_handler(var_args){
var args23317 = [];
var len__17790__auto___23323 = arguments.length;
var i__17791__auto___23324 = (0);
while(true){
if((i__17791__auto___23324 < len__17790__auto___23323)){
args23317.push((arguments[i__17791__auto___23324]));

var G__23325 = (i__17791__auto___23324 + (1));
i__17791__auto___23324 = G__23325;
continue;
} else {
}
break;
}

var G__23319 = args23317.length;
switch (G__23319) {
case 1:
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23317.length)].join('')));

}
});

cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1 = (function (f){
return cljs.core.async.fn_handler.call(null,f,true);
});

cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2 = (function (f,blockable){
if(typeof cljs.core.async.t_cljs$core$async23320 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async23320 = (function (f,blockable,meta23321){
this.f = f;
this.blockable = blockable;
this.meta23321 = meta23321;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async23320.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_23322,meta23321__$1){
var self__ = this;
var _23322__$1 = this;
return (new cljs.core.async.t_cljs$core$async23320(self__.f,self__.blockable,meta23321__$1));
});

cljs.core.async.t_cljs$core$async23320.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_23322){
var self__ = this;
var _23322__$1 = this;
return self__.meta23321;
});

cljs.core.async.t_cljs$core$async23320.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async23320.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
});

cljs.core.async.t_cljs$core$async23320.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.blockable;
});

cljs.core.async.t_cljs$core$async23320.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.f;
});

cljs.core.async.t_cljs$core$async23320.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"blockable","blockable",-28395259,null),new cljs.core.Symbol(null,"meta23321","meta23321",-1140517690,null)], null);
});

cljs.core.async.t_cljs$core$async23320.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async23320.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async23320";

cljs.core.async.t_cljs$core$async23320.cljs$lang$ctorPrWriter = (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async23320");
});

cljs.core.async.__GT_t_cljs$core$async23320 = (function cljs$core$async$__GT_t_cljs$core$async23320(f__$1,blockable__$1,meta23321){
return (new cljs.core.async.t_cljs$core$async23320(f__$1,blockable__$1,meta23321));
});

}

return (new cljs.core.async.t_cljs$core$async23320(f,blockable,cljs.core.PersistentArrayMap.EMPTY));
});

cljs.core.async.fn_handler.cljs$lang$maxFixedArity = 2;
/**
 * Returns a fixed buffer of size n. When full, puts will block/park.
 */
cljs.core.async.buffer = (function cljs$core$async$buffer(n){
return cljs.core.async.impl.buffers.fixed_buffer.call(null,n);
});
/**
 * Returns a buffer of size n. When full, puts will complete but
 *   val will be dropped (no transfer).
 */
cljs.core.async.dropping_buffer = (function cljs$core$async$dropping_buffer(n){
return cljs.core.async.impl.buffers.dropping_buffer.call(null,n);
});
/**
 * Returns a buffer of size n. When full, puts will complete, and be
 *   buffered, but oldest elements in buffer will be dropped (not
 *   transferred).
 */
cljs.core.async.sliding_buffer = (function cljs$core$async$sliding_buffer(n){
return cljs.core.async.impl.buffers.sliding_buffer.call(null,n);
});
/**
 * Returns true if a channel created with buff will never block. That is to say,
 * puts into this buffer will never cause the buffer to be full. 
 */
cljs.core.async.unblocking_buffer_QMARK_ = (function cljs$core$async$unblocking_buffer_QMARK_(buff){
if(!((buff == null))){
if((false) || (buff.cljs$core$async$impl$protocols$UnblockingBuffer$)){
return true;
} else {
if((!buff.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_.call(null,cljs.core.async.impl.protocols.UnblockingBuffer,buff);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_.call(null,cljs.core.async.impl.protocols.UnblockingBuffer,buff);
}
});
/**
 * Creates a channel with an optional buffer, an optional transducer (like (map f),
 *   (filter p) etc or a composition thereof), and an optional exception handler.
 *   If buf-or-n is a number, will create and use a fixed buffer of that size. If a
 *   transducer is supplied a buffer must be specified. ex-handler must be a
 *   fn of one argument - if an exception occurs during transformation it will be called
 *   with the thrown value as an argument, and any non-nil return value will be placed
 *   in the channel.
 */
cljs.core.async.chan = (function cljs$core$async$chan(var_args){
var args23329 = [];
var len__17790__auto___23332 = arguments.length;
var i__17791__auto___23333 = (0);
while(true){
if((i__17791__auto___23333 < len__17790__auto___23332)){
args23329.push((arguments[i__17791__auto___23333]));

var G__23334 = (i__17791__auto___23333 + (1));
i__17791__auto___23333 = G__23334;
continue;
} else {
}
break;
}

var G__23331 = args23329.length;
switch (G__23331) {
case 0:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23329.length)].join('')));

}
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.core.async.chan.call(null,null);
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1 = (function (buf_or_n){
return cljs.core.async.chan.call(null,buf_or_n,null,null);
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$2 = (function (buf_or_n,xform){
return cljs.core.async.chan.call(null,buf_or_n,xform,null);
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3 = (function (buf_or_n,xform,ex_handler){
var buf_or_n__$1 = ((cljs.core._EQ_.call(null,buf_or_n,(0)))?null:buf_or_n);
if(cljs.core.truth_(xform)){
if(cljs.core.truth_(buf_or_n__$1)){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str("buffer must be supplied when transducer is"),cljs.core.str("\n"),cljs.core.str(cljs.core.pr_str.call(null,new cljs.core.Symbol(null,"buf-or-n","buf-or-n",-1646815050,null)))].join('')));
}
} else {
}

return cljs.core.async.impl.channels.chan.call(null,((typeof buf_or_n__$1 === 'number')?cljs.core.async.buffer.call(null,buf_or_n__$1):buf_or_n__$1),xform,ex_handler);
});

cljs.core.async.chan.cljs$lang$maxFixedArity = 3;
/**
 * Creates a promise channel with an optional transducer, and an optional
 *   exception-handler. A promise channel can take exactly one value that consumers
 *   will receive. Once full, puts complete but val is dropped (no transfer).
 *   Consumers will block until either a value is placed in the channel or the
 *   channel is closed. See chan for the semantics of xform and ex-handler.
 */
cljs.core.async.promise_chan = (function cljs$core$async$promise_chan(var_args){
var args23336 = [];
var len__17790__auto___23339 = arguments.length;
var i__17791__auto___23340 = (0);
while(true){
if((i__17791__auto___23340 < len__17790__auto___23339)){
args23336.push((arguments[i__17791__auto___23340]));

var G__23341 = (i__17791__auto___23340 + (1));
i__17791__auto___23340 = G__23341;
continue;
} else {
}
break;
}

var G__23338 = args23336.length;
switch (G__23338) {
case 0:
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23336.length)].join('')));

}
});

cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.core.async.promise_chan.call(null,null);
});

cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$1 = (function (xform){
return cljs.core.async.promise_chan.call(null,xform,null);
});

cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$2 = (function (xform,ex_handler){
return cljs.core.async.chan.call(null,cljs.core.async.impl.buffers.promise_buffer.call(null),xform,ex_handler);
});

cljs.core.async.promise_chan.cljs$lang$maxFixedArity = 2;
/**
 * Returns a channel that will close after msecs
 */
cljs.core.async.timeout = (function cljs$core$async$timeout(msecs){
return cljs.core.async.impl.timers.timeout.call(null,msecs);
});
/**
 * takes a val from port. Must be called inside a (go ...) block. Will
 *   return nil if closed. Will park if nothing is available.
 *   Returns true unless port is already closed
 */
cljs.core.async._LT__BANG_ = (function cljs$core$async$_LT__BANG_(port){
throw (new Error("<! used not in (go ...) block"));
});
/**
 * Asynchronously takes a val from port, passing to fn1. Will pass nil
 * if closed. If on-caller? (default true) is true, and value is
 * immediately available, will call fn1 on calling thread.
 * Returns nil.
 */
cljs.core.async.take_BANG_ = (function cljs$core$async$take_BANG_(var_args){
var args23343 = [];
var len__17790__auto___23346 = arguments.length;
var i__17791__auto___23347 = (0);
while(true){
if((i__17791__auto___23347 < len__17790__auto___23346)){
args23343.push((arguments[i__17791__auto___23347]));

var G__23348 = (i__17791__auto___23347 + (1));
i__17791__auto___23347 = G__23348;
continue;
} else {
}
break;
}

var G__23345 = args23343.length;
switch (G__23345) {
case 2:
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23343.length)].join('')));

}
});

cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (port,fn1){
return cljs.core.async.take_BANG_.call(null,port,fn1,true);
});

cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (port,fn1,on_caller_QMARK_){
var ret = cljs.core.async.impl.protocols.take_BANG_.call(null,port,cljs.core.async.fn_handler.call(null,fn1));
if(cljs.core.truth_(ret)){
var val_23350 = cljs.core.deref.call(null,ret);
if(cljs.core.truth_(on_caller_QMARK_)){
fn1.call(null,val_23350);
} else {
cljs.core.async.impl.dispatch.run.call(null,((function (val_23350,ret){
return (function (){
return fn1.call(null,val_23350);
});})(val_23350,ret))
);
}
} else {
}

return null;
});

cljs.core.async.take_BANG_.cljs$lang$maxFixedArity = 3;
cljs.core.async.nop = (function cljs$core$async$nop(_){
return null;
});
cljs.core.async.fhnop = cljs.core.async.fn_handler.call(null,cljs.core.async.nop);
/**
 * puts a val into port. nil values are not allowed. Must be called
 *   inside a (go ...) block. Will park if no buffer space is available.
 *   Returns true unless port is already closed.
 */
cljs.core.async._GT__BANG_ = (function cljs$core$async$_GT__BANG_(port,val){
throw (new Error(">! used not in (go ...) block"));
});
/**
 * Asynchronously puts a val into port, calling fn0 (if supplied) when
 * complete. nil values are not allowed. Will throw if closed. If
 * on-caller? (default true) is true, and the put is immediately
 * accepted, will call fn0 on calling thread.  Returns nil.
 */
cljs.core.async.put_BANG_ = (function cljs$core$async$put_BANG_(var_args){
var args23351 = [];
var len__17790__auto___23354 = arguments.length;
var i__17791__auto___23355 = (0);
while(true){
if((i__17791__auto___23355 < len__17790__auto___23354)){
args23351.push((arguments[i__17791__auto___23355]));

var G__23356 = (i__17791__auto___23355 + (1));
i__17791__auto___23355 = G__23356;
continue;
} else {
}
break;
}

var G__23353 = args23351.length;
switch (G__23353) {
case 2:
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23351.length)].join('')));

}
});

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (port,val){
var temp__4423__auto__ = cljs.core.async.impl.protocols.put_BANG_.call(null,port,val,cljs.core.async.fhnop);
if(cljs.core.truth_(temp__4423__auto__)){
var ret = temp__4423__auto__;
return cljs.core.deref.call(null,ret);
} else {
return true;
}
});

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (port,val,fn1){
return cljs.core.async.put_BANG_.call(null,port,val,fn1,true);
});

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (port,val,fn1,on_caller_QMARK_){
var temp__4423__auto__ = cljs.core.async.impl.protocols.put_BANG_.call(null,port,val,cljs.core.async.fn_handler.call(null,fn1));
if(cljs.core.truth_(temp__4423__auto__)){
var retb = temp__4423__auto__;
var ret = cljs.core.deref.call(null,retb);
if(cljs.core.truth_(on_caller_QMARK_)){
fn1.call(null,ret);
} else {
cljs.core.async.impl.dispatch.run.call(null,((function (ret,retb,temp__4423__auto__){
return (function (){
return fn1.call(null,ret);
});})(ret,retb,temp__4423__auto__))
);
}

return ret;
} else {
return true;
}
});

cljs.core.async.put_BANG_.cljs$lang$maxFixedArity = 4;
cljs.core.async.close_BANG_ = (function cljs$core$async$close_BANG_(port){
return cljs.core.async.impl.protocols.close_BANG_.call(null,port);
});
cljs.core.async.random_array = (function cljs$core$async$random_array(n){
var a = (new Array(n));
var n__17635__auto___23358 = n;
var x_23359 = (0);
while(true){
if((x_23359 < n__17635__auto___23358)){
(a[x_23359] = (0));

var G__23360 = (x_23359 + (1));
x_23359 = G__23360;
continue;
} else {
}
break;
}

var i = (1);
while(true){
if(cljs.core._EQ_.call(null,i,n)){
return a;
} else {
var j = cljs.core.rand_int.call(null,i);
(a[i] = (a[j]));

(a[j] = i);

var G__23361 = (i + (1));
i = G__23361;
continue;
}
break;
}
});
cljs.core.async.alt_flag = (function cljs$core$async$alt_flag(){
var flag = cljs.core.atom.call(null,true);
if(typeof cljs.core.async.t_cljs$core$async23365 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async23365 = (function (alt_flag,flag,meta23366){
this.alt_flag = alt_flag;
this.flag = flag;
this.meta23366 = meta23366;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async23365.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (flag){
return (function (_23367,meta23366__$1){
var self__ = this;
var _23367__$1 = this;
return (new cljs.core.async.t_cljs$core$async23365(self__.alt_flag,self__.flag,meta23366__$1));
});})(flag))
;

cljs.core.async.t_cljs$core$async23365.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (flag){
return (function (_23367){
var self__ = this;
var _23367__$1 = this;
return self__.meta23366;
});})(flag))
;

cljs.core.async.t_cljs$core$async23365.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async23365.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = ((function (flag){
return (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.deref.call(null,self__.flag);
});})(flag))
;

cljs.core.async.t_cljs$core$async23365.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = ((function (flag){
return (function (_){
var self__ = this;
var ___$1 = this;
return true;
});})(flag))
;

cljs.core.async.t_cljs$core$async23365.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = ((function (flag){
return (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_.call(null,self__.flag,null);

return true;
});})(flag))
;

cljs.core.async.t_cljs$core$async23365.getBasis = ((function (flag){
return (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"alt-flag","alt-flag",-1794972754,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"private","private",-558947994),true,new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(cljs.core.PersistentVector.EMPTY))], null)),new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"meta23366","meta23366",-734022749,null)], null);
});})(flag))
;

cljs.core.async.t_cljs$core$async23365.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async23365.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async23365";

cljs.core.async.t_cljs$core$async23365.cljs$lang$ctorPrWriter = ((function (flag){
return (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async23365");
});})(flag))
;

cljs.core.async.__GT_t_cljs$core$async23365 = ((function (flag){
return (function cljs$core$async$alt_flag_$___GT_t_cljs$core$async23365(alt_flag__$1,flag__$1,meta23366){
return (new cljs.core.async.t_cljs$core$async23365(alt_flag__$1,flag__$1,meta23366));
});})(flag))
;

}

return (new cljs.core.async.t_cljs$core$async23365(cljs$core$async$alt_flag,flag,cljs.core.PersistentArrayMap.EMPTY));
});
cljs.core.async.alt_handler = (function cljs$core$async$alt_handler(flag,cb){
if(typeof cljs.core.async.t_cljs$core$async23371 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async23371 = (function (alt_handler,flag,cb,meta23372){
this.alt_handler = alt_handler;
this.flag = flag;
this.cb = cb;
this.meta23372 = meta23372;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async23371.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_23373,meta23372__$1){
var self__ = this;
var _23373__$1 = this;
return (new cljs.core.async.t_cljs$core$async23371(self__.alt_handler,self__.flag,self__.cb,meta23372__$1));
});

cljs.core.async.t_cljs$core$async23371.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_23373){
var self__ = this;
var _23373__$1 = this;
return self__.meta23372;
});

cljs.core.async.t_cljs$core$async23371.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async23371.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.active_QMARK_.call(null,self__.flag);
});

cljs.core.async.t_cljs$core$async23371.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
});

cljs.core.async.t_cljs$core$async23371.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.async.impl.protocols.commit.call(null,self__.flag);

return self__.cb;
});

cljs.core.async.t_cljs$core$async23371.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"alt-handler","alt-handler",963786170,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"private","private",-558947994),true,new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"cb","cb",-2064487928,null)], null)))], null)),new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"cb","cb",-2064487928,null),new cljs.core.Symbol(null,"meta23372","meta23372",-2073255450,null)], null);
});

cljs.core.async.t_cljs$core$async23371.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async23371.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async23371";

cljs.core.async.t_cljs$core$async23371.cljs$lang$ctorPrWriter = (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async23371");
});

cljs.core.async.__GT_t_cljs$core$async23371 = (function cljs$core$async$alt_handler_$___GT_t_cljs$core$async23371(alt_handler__$1,flag__$1,cb__$1,meta23372){
return (new cljs.core.async.t_cljs$core$async23371(alt_handler__$1,flag__$1,cb__$1,meta23372));
});

}

return (new cljs.core.async.t_cljs$core$async23371(cljs$core$async$alt_handler,flag,cb,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * returns derefable [val port] if immediate, nil if enqueued
 */
cljs.core.async.do_alts = (function cljs$core$async$do_alts(fret,ports,opts){
var flag = cljs.core.async.alt_flag.call(null);
var n = cljs.core.count.call(null,ports);
var idxs = cljs.core.async.random_array.call(null,n);
var priority = new cljs.core.Keyword(null,"priority","priority",1431093715).cljs$core$IFn$_invoke$arity$1(opts);
var ret = (function (){var i = (0);
while(true){
if((i < n)){
var idx = (cljs.core.truth_(priority)?i:(idxs[i]));
var port = cljs.core.nth.call(null,ports,idx);
var wport = ((cljs.core.vector_QMARK_.call(null,port))?port.call(null,(0)):null);
var vbox = (cljs.core.truth_(wport)?(function (){var val = port.call(null,(1));
return cljs.core.async.impl.protocols.put_BANG_.call(null,wport,val,cljs.core.async.alt_handler.call(null,flag,((function (i,val,idx,port,wport,flag,n,idxs,priority){
return (function (p1__23374_SHARP_){
return fret.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__23374_SHARP_,wport], null));
});})(i,val,idx,port,wport,flag,n,idxs,priority))
));
})():cljs.core.async.impl.protocols.take_BANG_.call(null,port,cljs.core.async.alt_handler.call(null,flag,((function (i,idx,port,wport,flag,n,idxs,priority){
return (function (p1__23375_SHARP_){
return fret.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__23375_SHARP_,port], null));
});})(i,idx,port,wport,flag,n,idxs,priority))
)));
if(cljs.core.truth_(vbox)){
return cljs.core.async.impl.channels.box.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.deref.call(null,vbox),(function (){var or__16732__auto__ = wport;
if(cljs.core.truth_(or__16732__auto__)){
return or__16732__auto__;
} else {
return port;
}
})()], null));
} else {
var G__23376 = (i + (1));
i = G__23376;
continue;
}
} else {
return null;
}
break;
}
})();
var or__16732__auto__ = ret;
if(cljs.core.truth_(or__16732__auto__)){
return or__16732__auto__;
} else {
if(cljs.core.contains_QMARK_.call(null,opts,new cljs.core.Keyword(null,"default","default",-1987822328))){
var temp__4425__auto__ = (function (){var and__16720__auto__ = cljs.core.async.impl.protocols.active_QMARK_.call(null,flag);
if(cljs.core.truth_(and__16720__auto__)){
return cljs.core.async.impl.protocols.commit.call(null,flag);
} else {
return and__16720__auto__;
}
})();
if(cljs.core.truth_(temp__4425__auto__)){
var got = temp__4425__auto__;
return cljs.core.async.impl.channels.box.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"default","default",-1987822328).cljs$core$IFn$_invoke$arity$1(opts),new cljs.core.Keyword(null,"default","default",-1987822328)], null));
} else {
return null;
}
} else {
return null;
}
}
});
/**
 * Completes at most one of several channel operations. Must be called
 * inside a (go ...) block. ports is a vector of channel endpoints,
 * which can be either a channel to take from or a vector of
 *   [channel-to-put-to val-to-put], in any combination. Takes will be
 *   made as if by <!, and puts will be made as if by >!. Unless
 *   the :priority option is true, if more than one port operation is
 *   ready a non-deterministic choice will be made. If no operation is
 *   ready and a :default value is supplied, [default-val :default] will
 *   be returned, otherwise alts! will park until the first operation to
 *   become ready completes. Returns [val port] of the completed
 *   operation, where val is the value taken for takes, and a
 *   boolean (true unless already closed, as per put!) for puts.
 * 
 *   opts are passed as :key val ... Supported options:
 * 
 *   :default val - the value to use if none of the operations are immediately ready
 *   :priority true - (default nil) when true, the operations will be tried in order.
 * 
 *   Note: there is no guarantee that the port exps or val exprs will be
 *   used, nor in what order should they be, so they should not be
 *   depended upon for side effects.
 */
cljs.core.async.alts_BANG_ = (function cljs$core$async$alts_BANG_(var_args){
var args__17797__auto__ = [];
var len__17790__auto___23382 = arguments.length;
var i__17791__auto___23383 = (0);
while(true){
if((i__17791__auto___23383 < len__17790__auto___23382)){
args__17797__auto__.push((arguments[i__17791__auto___23383]));

var G__23384 = (i__17791__auto___23383 + (1));
i__17791__auto___23383 = G__23384;
continue;
} else {
}
break;
}

var argseq__17798__auto__ = ((((1) < args__17797__auto__.length))?(new cljs.core.IndexedSeq(args__17797__auto__.slice((1)),(0))):null);
return cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__17798__auto__);
});

cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (ports,p__23379){
var map__23380 = p__23379;
var map__23380__$1 = ((((!((map__23380 == null)))?((((map__23380.cljs$lang$protocol_mask$partition0$ & (64))) || (map__23380.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__23380):map__23380);
var opts = map__23380__$1;
throw (new Error("alts! used not in (go ...) block"));
});

cljs.core.async.alts_BANG_.cljs$lang$maxFixedArity = (1);

cljs.core.async.alts_BANG_.cljs$lang$applyTo = (function (seq23377){
var G__23378 = cljs.core.first.call(null,seq23377);
var seq23377__$1 = cljs.core.next.call(null,seq23377);
return cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic(G__23378,seq23377__$1);
});
/**
 * Puts a val into port if it's possible to do so immediately.
 *   nil values are not allowed. Never blocks. Returns true if offer succeeds.
 */
cljs.core.async.offer_BANG_ = (function cljs$core$async$offer_BANG_(port,val){
var ret = cljs.core.async.impl.protocols.put_BANG_.call(null,port,val,cljs.core.async.fn_handler.call(null,cljs.core.async.nop,false));
if(cljs.core.truth_(ret)){
return cljs.core.deref.call(null,ret);
} else {
return null;
}
});
/**
 * Takes a val from port if it's possible to do so immediately.
 *   Never blocks. Returns value if successful, nil otherwise.
 */
cljs.core.async.poll_BANG_ = (function cljs$core$async$poll_BANG_(port){
var ret = cljs.core.async.impl.protocols.take_BANG_.call(null,port,cljs.core.async.fn_handler.call(null,cljs.core.async.nop,false));
if(cljs.core.truth_(ret)){
return cljs.core.deref.call(null,ret);
} else {
return null;
}
});
/**
 * Takes elements from the from channel and supplies them to the to
 * channel. By default, the to channel will be closed when the from
 * channel closes, but can be determined by the close?  parameter. Will
 * stop consuming the from channel if the to channel closes
 */
cljs.core.async.pipe = (function cljs$core$async$pipe(var_args){
var args23385 = [];
var len__17790__auto___23435 = arguments.length;
var i__17791__auto___23436 = (0);
while(true){
if((i__17791__auto___23436 < len__17790__auto___23435)){
args23385.push((arguments[i__17791__auto___23436]));

var G__23437 = (i__17791__auto___23436 + (1));
i__17791__auto___23436 = G__23437;
continue;
} else {
}
break;
}

var G__23387 = args23385.length;
switch (G__23387) {
case 2:
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23385.length)].join('')));

}
});

cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$2 = (function (from,to){
return cljs.core.async.pipe.call(null,from,to,true);
});

cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3 = (function (from,to,close_QMARK_){
var c__23272__auto___23439 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___23439){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___23439){
return (function (state_23411){
var state_val_23412 = (state_23411[(1)]);
if((state_val_23412 === (7))){
var inst_23407 = (state_23411[(2)]);
var state_23411__$1 = state_23411;
var statearr_23413_23440 = state_23411__$1;
(statearr_23413_23440[(2)] = inst_23407);

(statearr_23413_23440[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (1))){
var state_23411__$1 = state_23411;
var statearr_23414_23441 = state_23411__$1;
(statearr_23414_23441[(2)] = null);

(statearr_23414_23441[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (4))){
var inst_23390 = (state_23411[(7)]);
var inst_23390__$1 = (state_23411[(2)]);
var inst_23391 = (inst_23390__$1 == null);
var state_23411__$1 = (function (){var statearr_23415 = state_23411;
(statearr_23415[(7)] = inst_23390__$1);

return statearr_23415;
})();
if(cljs.core.truth_(inst_23391)){
var statearr_23416_23442 = state_23411__$1;
(statearr_23416_23442[(1)] = (5));

} else {
var statearr_23417_23443 = state_23411__$1;
(statearr_23417_23443[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (13))){
var state_23411__$1 = state_23411;
var statearr_23418_23444 = state_23411__$1;
(statearr_23418_23444[(2)] = null);

(statearr_23418_23444[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (6))){
var inst_23390 = (state_23411[(7)]);
var state_23411__$1 = state_23411;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_23411__$1,(11),to,inst_23390);
} else {
if((state_val_23412 === (3))){
var inst_23409 = (state_23411[(2)]);
var state_23411__$1 = state_23411;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_23411__$1,inst_23409);
} else {
if((state_val_23412 === (12))){
var state_23411__$1 = state_23411;
var statearr_23419_23445 = state_23411__$1;
(statearr_23419_23445[(2)] = null);

(statearr_23419_23445[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (2))){
var state_23411__$1 = state_23411;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_23411__$1,(4),from);
} else {
if((state_val_23412 === (11))){
var inst_23400 = (state_23411[(2)]);
var state_23411__$1 = state_23411;
if(cljs.core.truth_(inst_23400)){
var statearr_23420_23446 = state_23411__$1;
(statearr_23420_23446[(1)] = (12));

} else {
var statearr_23421_23447 = state_23411__$1;
(statearr_23421_23447[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (9))){
var state_23411__$1 = state_23411;
var statearr_23422_23448 = state_23411__$1;
(statearr_23422_23448[(2)] = null);

(statearr_23422_23448[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (5))){
var state_23411__$1 = state_23411;
if(cljs.core.truth_(close_QMARK_)){
var statearr_23423_23449 = state_23411__$1;
(statearr_23423_23449[(1)] = (8));

} else {
var statearr_23424_23450 = state_23411__$1;
(statearr_23424_23450[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (14))){
var inst_23405 = (state_23411[(2)]);
var state_23411__$1 = state_23411;
var statearr_23425_23451 = state_23411__$1;
(statearr_23425_23451[(2)] = inst_23405);

(statearr_23425_23451[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (10))){
var inst_23397 = (state_23411[(2)]);
var state_23411__$1 = state_23411;
var statearr_23426_23452 = state_23411__$1;
(statearr_23426_23452[(2)] = inst_23397);

(statearr_23426_23452[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23412 === (8))){
var inst_23394 = cljs.core.async.close_BANG_.call(null,to);
var state_23411__$1 = state_23411;
var statearr_23427_23453 = state_23411__$1;
(statearr_23427_23453[(2)] = inst_23394);

(statearr_23427_23453[(1)] = (10));


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
});})(c__23272__auto___23439))
;
return ((function (switch__23207__auto__,c__23272__auto___23439){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_23431 = [null,null,null,null,null,null,null,null];
(statearr_23431[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_23431[(1)] = (1));

return statearr_23431;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_23411){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_23411);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e23432){if((e23432 instanceof Object)){
var ex__23211__auto__ = e23432;
var statearr_23433_23454 = state_23411;
(statearr_23433_23454[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_23411);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e23432;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__23455 = state_23411;
state_23411 = G__23455;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_23411){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_23411);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___23439))
})();
var state__23274__auto__ = (function (){var statearr_23434 = f__23273__auto__.call(null);
(statearr_23434[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___23439);

return statearr_23434;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___23439))
);


return to;
});

cljs.core.async.pipe.cljs$lang$maxFixedArity = 3;
cljs.core.async.pipeline_STAR_ = (function cljs$core$async$pipeline_STAR_(n,to,xf,from,close_QMARK_,ex_handler,type){
if((n > (0))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol(null,"pos?","pos?",-244377722,null),new cljs.core.Symbol(null,"n","n",-2092305744,null))))].join('')));
}

var jobs = cljs.core.async.chan.call(null,n);
var results = cljs.core.async.chan.call(null,n);
var process = ((function (jobs,results){
return (function (p__23639){
var vec__23640 = p__23639;
var v = cljs.core.nth.call(null,vec__23640,(0),null);
var p = cljs.core.nth.call(null,vec__23640,(1),null);
var job = vec__23640;
if((job == null)){
cljs.core.async.close_BANG_.call(null,results);

return null;
} else {
var res = cljs.core.async.chan.call(null,(1),xf,ex_handler);
var c__23272__auto___23822 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___23822,res,vec__23640,v,p,job,jobs,results){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___23822,res,vec__23640,v,p,job,jobs,results){
return (function (state_23645){
var state_val_23646 = (state_23645[(1)]);
if((state_val_23646 === (1))){
var state_23645__$1 = state_23645;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_23645__$1,(2),res,v);
} else {
if((state_val_23646 === (2))){
var inst_23642 = (state_23645[(2)]);
var inst_23643 = cljs.core.async.close_BANG_.call(null,res);
var state_23645__$1 = (function (){var statearr_23647 = state_23645;
(statearr_23647[(7)] = inst_23642);

return statearr_23647;
})();
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_23645__$1,inst_23643);
} else {
return null;
}
}
});})(c__23272__auto___23822,res,vec__23640,v,p,job,jobs,results))
;
return ((function (switch__23207__auto__,c__23272__auto___23822,res,vec__23640,v,p,job,jobs,results){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0 = (function (){
var statearr_23651 = [null,null,null,null,null,null,null,null];
(statearr_23651[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__);

(statearr_23651[(1)] = (1));

return statearr_23651;
});
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1 = (function (state_23645){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_23645);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e23652){if((e23652 instanceof Object)){
var ex__23211__auto__ = e23652;
var statearr_23653_23823 = state_23645;
(statearr_23653_23823[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_23645);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e23652;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__23824 = state_23645;
state_23645 = G__23824;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = function(state_23645){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1.call(this,state_23645);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___23822,res,vec__23640,v,p,job,jobs,results))
})();
var state__23274__auto__ = (function (){var statearr_23654 = f__23273__auto__.call(null);
(statearr_23654[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___23822);

return statearr_23654;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___23822,res,vec__23640,v,p,job,jobs,results))
);


cljs.core.async.put_BANG_.call(null,p,res);

return true;
}
});})(jobs,results))
;
var async = ((function (jobs,results,process){
return (function (p__23655){
var vec__23656 = p__23655;
var v = cljs.core.nth.call(null,vec__23656,(0),null);
var p = cljs.core.nth.call(null,vec__23656,(1),null);
var job = vec__23656;
if((job == null)){
cljs.core.async.close_BANG_.call(null,results);

return null;
} else {
var res = cljs.core.async.chan.call(null,(1));
xf.call(null,v,res);

cljs.core.async.put_BANG_.call(null,p,res);

return true;
}
});})(jobs,results,process))
;
var n__17635__auto___23825 = n;
var __23826 = (0);
while(true){
if((__23826 < n__17635__auto___23825)){
var G__23657_23827 = (((type instanceof cljs.core.Keyword))?type.fqn:null);
switch (G__23657_23827) {
case "compute":
var c__23272__auto___23829 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (__23826,c__23272__auto___23829,G__23657_23827,n__17635__auto___23825,jobs,results,process,async){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (__23826,c__23272__auto___23829,G__23657_23827,n__17635__auto___23825,jobs,results,process,async){
return (function (state_23670){
var state_val_23671 = (state_23670[(1)]);
if((state_val_23671 === (1))){
var state_23670__$1 = state_23670;
var statearr_23672_23830 = state_23670__$1;
(statearr_23672_23830[(2)] = null);

(statearr_23672_23830[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23671 === (2))){
var state_23670__$1 = state_23670;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_23670__$1,(4),jobs);
} else {
if((state_val_23671 === (3))){
var inst_23668 = (state_23670[(2)]);
var state_23670__$1 = state_23670;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_23670__$1,inst_23668);
} else {
if((state_val_23671 === (4))){
var inst_23660 = (state_23670[(2)]);
var inst_23661 = process.call(null,inst_23660);
var state_23670__$1 = state_23670;
if(cljs.core.truth_(inst_23661)){
var statearr_23673_23831 = state_23670__$1;
(statearr_23673_23831[(1)] = (5));

} else {
var statearr_23674_23832 = state_23670__$1;
(statearr_23674_23832[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23671 === (5))){
var state_23670__$1 = state_23670;
var statearr_23675_23833 = state_23670__$1;
(statearr_23675_23833[(2)] = null);

(statearr_23675_23833[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23671 === (6))){
var state_23670__$1 = state_23670;
var statearr_23676_23834 = state_23670__$1;
(statearr_23676_23834[(2)] = null);

(statearr_23676_23834[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23671 === (7))){
var inst_23666 = (state_23670[(2)]);
var state_23670__$1 = state_23670;
var statearr_23677_23835 = state_23670__$1;
(statearr_23677_23835[(2)] = inst_23666);

(statearr_23677_23835[(1)] = (3));


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
});})(__23826,c__23272__auto___23829,G__23657_23827,n__17635__auto___23825,jobs,results,process,async))
;
return ((function (__23826,switch__23207__auto__,c__23272__auto___23829,G__23657_23827,n__17635__auto___23825,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0 = (function (){
var statearr_23681 = [null,null,null,null,null,null,null];
(statearr_23681[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__);

(statearr_23681[(1)] = (1));

return statearr_23681;
});
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1 = (function (state_23670){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_23670);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e23682){if((e23682 instanceof Object)){
var ex__23211__auto__ = e23682;
var statearr_23683_23836 = state_23670;
(statearr_23683_23836[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_23670);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e23682;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__23837 = state_23670;
state_23670 = G__23837;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = function(state_23670){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1.call(this,state_23670);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__;
})()
;})(__23826,switch__23207__auto__,c__23272__auto___23829,G__23657_23827,n__17635__auto___23825,jobs,results,process,async))
})();
var state__23274__auto__ = (function (){var statearr_23684 = f__23273__auto__.call(null);
(statearr_23684[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___23829);

return statearr_23684;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(__23826,c__23272__auto___23829,G__23657_23827,n__17635__auto___23825,jobs,results,process,async))
);


break;
case "async":
var c__23272__auto___23838 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (__23826,c__23272__auto___23838,G__23657_23827,n__17635__auto___23825,jobs,results,process,async){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (__23826,c__23272__auto___23838,G__23657_23827,n__17635__auto___23825,jobs,results,process,async){
return (function (state_23697){
var state_val_23698 = (state_23697[(1)]);
if((state_val_23698 === (1))){
var state_23697__$1 = state_23697;
var statearr_23699_23839 = state_23697__$1;
(statearr_23699_23839[(2)] = null);

(statearr_23699_23839[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23698 === (2))){
var state_23697__$1 = state_23697;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_23697__$1,(4),jobs);
} else {
if((state_val_23698 === (3))){
var inst_23695 = (state_23697[(2)]);
var state_23697__$1 = state_23697;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_23697__$1,inst_23695);
} else {
if((state_val_23698 === (4))){
var inst_23687 = (state_23697[(2)]);
var inst_23688 = async.call(null,inst_23687);
var state_23697__$1 = state_23697;
if(cljs.core.truth_(inst_23688)){
var statearr_23700_23840 = state_23697__$1;
(statearr_23700_23840[(1)] = (5));

} else {
var statearr_23701_23841 = state_23697__$1;
(statearr_23701_23841[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23698 === (5))){
var state_23697__$1 = state_23697;
var statearr_23702_23842 = state_23697__$1;
(statearr_23702_23842[(2)] = null);

(statearr_23702_23842[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23698 === (6))){
var state_23697__$1 = state_23697;
var statearr_23703_23843 = state_23697__$1;
(statearr_23703_23843[(2)] = null);

(statearr_23703_23843[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23698 === (7))){
var inst_23693 = (state_23697[(2)]);
var state_23697__$1 = state_23697;
var statearr_23704_23844 = state_23697__$1;
(statearr_23704_23844[(2)] = inst_23693);

(statearr_23704_23844[(1)] = (3));


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
});})(__23826,c__23272__auto___23838,G__23657_23827,n__17635__auto___23825,jobs,results,process,async))
;
return ((function (__23826,switch__23207__auto__,c__23272__auto___23838,G__23657_23827,n__17635__auto___23825,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0 = (function (){
var statearr_23708 = [null,null,null,null,null,null,null];
(statearr_23708[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__);

(statearr_23708[(1)] = (1));

return statearr_23708;
});
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1 = (function (state_23697){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_23697);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e23709){if((e23709 instanceof Object)){
var ex__23211__auto__ = e23709;
var statearr_23710_23845 = state_23697;
(statearr_23710_23845[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_23697);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e23709;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__23846 = state_23697;
state_23697 = G__23846;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = function(state_23697){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1.call(this,state_23697);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__;
})()
;})(__23826,switch__23207__auto__,c__23272__auto___23838,G__23657_23827,n__17635__auto___23825,jobs,results,process,async))
})();
var state__23274__auto__ = (function (){var statearr_23711 = f__23273__auto__.call(null);
(statearr_23711[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___23838);

return statearr_23711;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(__23826,c__23272__auto___23838,G__23657_23827,n__17635__auto___23825,jobs,results,process,async))
);


break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(type)].join('')));

}

var G__23847 = (__23826 + (1));
__23826 = G__23847;
continue;
} else {
}
break;
}

var c__23272__auto___23848 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___23848,jobs,results,process,async){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___23848,jobs,results,process,async){
return (function (state_23733){
var state_val_23734 = (state_23733[(1)]);
if((state_val_23734 === (1))){
var state_23733__$1 = state_23733;
var statearr_23735_23849 = state_23733__$1;
(statearr_23735_23849[(2)] = null);

(statearr_23735_23849[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23734 === (2))){
var state_23733__$1 = state_23733;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_23733__$1,(4),from);
} else {
if((state_val_23734 === (3))){
var inst_23731 = (state_23733[(2)]);
var state_23733__$1 = state_23733;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_23733__$1,inst_23731);
} else {
if((state_val_23734 === (4))){
var inst_23714 = (state_23733[(7)]);
var inst_23714__$1 = (state_23733[(2)]);
var inst_23715 = (inst_23714__$1 == null);
var state_23733__$1 = (function (){var statearr_23736 = state_23733;
(statearr_23736[(7)] = inst_23714__$1);

return statearr_23736;
})();
if(cljs.core.truth_(inst_23715)){
var statearr_23737_23850 = state_23733__$1;
(statearr_23737_23850[(1)] = (5));

} else {
var statearr_23738_23851 = state_23733__$1;
(statearr_23738_23851[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23734 === (5))){
var inst_23717 = cljs.core.async.close_BANG_.call(null,jobs);
var state_23733__$1 = state_23733;
var statearr_23739_23852 = state_23733__$1;
(statearr_23739_23852[(2)] = inst_23717);

(statearr_23739_23852[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23734 === (6))){
var inst_23714 = (state_23733[(7)]);
var inst_23719 = (state_23733[(8)]);
var inst_23719__$1 = cljs.core.async.chan.call(null,(1));
var inst_23720 = cljs.core.PersistentVector.EMPTY_NODE;
var inst_23721 = [inst_23714,inst_23719__$1];
var inst_23722 = (new cljs.core.PersistentVector(null,2,(5),inst_23720,inst_23721,null));
var state_23733__$1 = (function (){var statearr_23740 = state_23733;
(statearr_23740[(8)] = inst_23719__$1);

return statearr_23740;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_23733__$1,(8),jobs,inst_23722);
} else {
if((state_val_23734 === (7))){
var inst_23729 = (state_23733[(2)]);
var state_23733__$1 = state_23733;
var statearr_23741_23853 = state_23733__$1;
(statearr_23741_23853[(2)] = inst_23729);

(statearr_23741_23853[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23734 === (8))){
var inst_23719 = (state_23733[(8)]);
var inst_23724 = (state_23733[(2)]);
var state_23733__$1 = (function (){var statearr_23742 = state_23733;
(statearr_23742[(9)] = inst_23724);

return statearr_23742;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_23733__$1,(9),results,inst_23719);
} else {
if((state_val_23734 === (9))){
var inst_23726 = (state_23733[(2)]);
var state_23733__$1 = (function (){var statearr_23743 = state_23733;
(statearr_23743[(10)] = inst_23726);

return statearr_23743;
})();
var statearr_23744_23854 = state_23733__$1;
(statearr_23744_23854[(2)] = null);

(statearr_23744_23854[(1)] = (2));


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
});})(c__23272__auto___23848,jobs,results,process,async))
;
return ((function (switch__23207__auto__,c__23272__auto___23848,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0 = (function (){
var statearr_23748 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_23748[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__);

(statearr_23748[(1)] = (1));

return statearr_23748;
});
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1 = (function (state_23733){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_23733);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e23749){if((e23749 instanceof Object)){
var ex__23211__auto__ = e23749;
var statearr_23750_23855 = state_23733;
(statearr_23750_23855[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_23733);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e23749;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__23856 = state_23733;
state_23733 = G__23856;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = function(state_23733){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1.call(this,state_23733);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___23848,jobs,results,process,async))
})();
var state__23274__auto__ = (function (){var statearr_23751 = f__23273__auto__.call(null);
(statearr_23751[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___23848);

return statearr_23751;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___23848,jobs,results,process,async))
);


var c__23272__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto__,jobs,results,process,async){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto__,jobs,results,process,async){
return (function (state_23789){
var state_val_23790 = (state_23789[(1)]);
if((state_val_23790 === (7))){
var inst_23785 = (state_23789[(2)]);
var state_23789__$1 = state_23789;
var statearr_23791_23857 = state_23789__$1;
(statearr_23791_23857[(2)] = inst_23785);

(statearr_23791_23857[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (20))){
var state_23789__$1 = state_23789;
var statearr_23792_23858 = state_23789__$1;
(statearr_23792_23858[(2)] = null);

(statearr_23792_23858[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (1))){
var state_23789__$1 = state_23789;
var statearr_23793_23859 = state_23789__$1;
(statearr_23793_23859[(2)] = null);

(statearr_23793_23859[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (4))){
var inst_23754 = (state_23789[(7)]);
var inst_23754__$1 = (state_23789[(2)]);
var inst_23755 = (inst_23754__$1 == null);
var state_23789__$1 = (function (){var statearr_23794 = state_23789;
(statearr_23794[(7)] = inst_23754__$1);

return statearr_23794;
})();
if(cljs.core.truth_(inst_23755)){
var statearr_23795_23860 = state_23789__$1;
(statearr_23795_23860[(1)] = (5));

} else {
var statearr_23796_23861 = state_23789__$1;
(statearr_23796_23861[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (15))){
var inst_23767 = (state_23789[(8)]);
var state_23789__$1 = state_23789;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_23789__$1,(18),to,inst_23767);
} else {
if((state_val_23790 === (21))){
var inst_23780 = (state_23789[(2)]);
var state_23789__$1 = state_23789;
var statearr_23797_23862 = state_23789__$1;
(statearr_23797_23862[(2)] = inst_23780);

(statearr_23797_23862[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (13))){
var inst_23782 = (state_23789[(2)]);
var state_23789__$1 = (function (){var statearr_23798 = state_23789;
(statearr_23798[(9)] = inst_23782);

return statearr_23798;
})();
var statearr_23799_23863 = state_23789__$1;
(statearr_23799_23863[(2)] = null);

(statearr_23799_23863[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (6))){
var inst_23754 = (state_23789[(7)]);
var state_23789__$1 = state_23789;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_23789__$1,(11),inst_23754);
} else {
if((state_val_23790 === (17))){
var inst_23775 = (state_23789[(2)]);
var state_23789__$1 = state_23789;
if(cljs.core.truth_(inst_23775)){
var statearr_23800_23864 = state_23789__$1;
(statearr_23800_23864[(1)] = (19));

} else {
var statearr_23801_23865 = state_23789__$1;
(statearr_23801_23865[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (3))){
var inst_23787 = (state_23789[(2)]);
var state_23789__$1 = state_23789;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_23789__$1,inst_23787);
} else {
if((state_val_23790 === (12))){
var inst_23764 = (state_23789[(10)]);
var state_23789__$1 = state_23789;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_23789__$1,(14),inst_23764);
} else {
if((state_val_23790 === (2))){
var state_23789__$1 = state_23789;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_23789__$1,(4),results);
} else {
if((state_val_23790 === (19))){
var state_23789__$1 = state_23789;
var statearr_23802_23866 = state_23789__$1;
(statearr_23802_23866[(2)] = null);

(statearr_23802_23866[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (11))){
var inst_23764 = (state_23789[(2)]);
var state_23789__$1 = (function (){var statearr_23803 = state_23789;
(statearr_23803[(10)] = inst_23764);

return statearr_23803;
})();
var statearr_23804_23867 = state_23789__$1;
(statearr_23804_23867[(2)] = null);

(statearr_23804_23867[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (9))){
var state_23789__$1 = state_23789;
var statearr_23805_23868 = state_23789__$1;
(statearr_23805_23868[(2)] = null);

(statearr_23805_23868[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (5))){
var state_23789__$1 = state_23789;
if(cljs.core.truth_(close_QMARK_)){
var statearr_23806_23869 = state_23789__$1;
(statearr_23806_23869[(1)] = (8));

} else {
var statearr_23807_23870 = state_23789__$1;
(statearr_23807_23870[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (14))){
var inst_23769 = (state_23789[(11)]);
var inst_23767 = (state_23789[(8)]);
var inst_23767__$1 = (state_23789[(2)]);
var inst_23768 = (inst_23767__$1 == null);
var inst_23769__$1 = cljs.core.not.call(null,inst_23768);
var state_23789__$1 = (function (){var statearr_23808 = state_23789;
(statearr_23808[(11)] = inst_23769__$1);

(statearr_23808[(8)] = inst_23767__$1);

return statearr_23808;
})();
if(inst_23769__$1){
var statearr_23809_23871 = state_23789__$1;
(statearr_23809_23871[(1)] = (15));

} else {
var statearr_23810_23872 = state_23789__$1;
(statearr_23810_23872[(1)] = (16));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (16))){
var inst_23769 = (state_23789[(11)]);
var state_23789__$1 = state_23789;
var statearr_23811_23873 = state_23789__$1;
(statearr_23811_23873[(2)] = inst_23769);

(statearr_23811_23873[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (10))){
var inst_23761 = (state_23789[(2)]);
var state_23789__$1 = state_23789;
var statearr_23812_23874 = state_23789__$1;
(statearr_23812_23874[(2)] = inst_23761);

(statearr_23812_23874[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (18))){
var inst_23772 = (state_23789[(2)]);
var state_23789__$1 = state_23789;
var statearr_23813_23875 = state_23789__$1;
(statearr_23813_23875[(2)] = inst_23772);

(statearr_23813_23875[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23790 === (8))){
var inst_23758 = cljs.core.async.close_BANG_.call(null,to);
var state_23789__$1 = state_23789;
var statearr_23814_23876 = state_23789__$1;
(statearr_23814_23876[(2)] = inst_23758);

(statearr_23814_23876[(1)] = (10));


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
});})(c__23272__auto__,jobs,results,process,async))
;
return ((function (switch__23207__auto__,c__23272__auto__,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0 = (function (){
var statearr_23818 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_23818[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__);

(statearr_23818[(1)] = (1));

return statearr_23818;
});
var cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1 = (function (state_23789){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_23789);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e23819){if((e23819 instanceof Object)){
var ex__23211__auto__ = e23819;
var statearr_23820_23877 = state_23789;
(statearr_23820_23877[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_23789);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e23819;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__23878 = state_23789;
state_23789 = G__23878;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__ = function(state_23789){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1.call(this,state_23789);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__23208__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto__,jobs,results,process,async))
})();
var state__23274__auto__ = (function (){var statearr_23821 = f__23273__auto__.call(null);
(statearr_23821[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto__);

return statearr_23821;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto__,jobs,results,process,async))
);

return c__23272__auto__;
});
/**
 * Takes elements from the from channel and supplies them to the to
 *   channel, subject to the async function af, with parallelism n. af
 *   must be a function of two arguments, the first an input value and
 *   the second a channel on which to place the result(s). af must close!
 *   the channel before returning.  The presumption is that af will
 *   return immediately, having launched some asynchronous operation
 *   whose completion/callback will manipulate the result channel. Outputs
 *   will be returned in order relative to  the inputs. By default, the to
 *   channel will be closed when the from channel closes, but can be
 *   determined by the close?  parameter. Will stop consuming the from
 *   channel if the to channel closes.
 */
cljs.core.async.pipeline_async = (function cljs$core$async$pipeline_async(var_args){
var args23879 = [];
var len__17790__auto___23882 = arguments.length;
var i__17791__auto___23883 = (0);
while(true){
if((i__17791__auto___23883 < len__17790__auto___23882)){
args23879.push((arguments[i__17791__auto___23883]));

var G__23884 = (i__17791__auto___23883 + (1));
i__17791__auto___23883 = G__23884;
continue;
} else {
}
break;
}

var G__23881 = args23879.length;
switch (G__23881) {
case 4:
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23879.length)].join('')));

}
});

cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$4 = (function (n,to,af,from){
return cljs.core.async.pipeline_async.call(null,n,to,af,from,true);
});

cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5 = (function (n,to,af,from,close_QMARK_){
return cljs.core.async.pipeline_STAR_.call(null,n,to,af,from,close_QMARK_,null,new cljs.core.Keyword(null,"async","async",1050769601));
});

cljs.core.async.pipeline_async.cljs$lang$maxFixedArity = 5;
/**
 * Takes elements from the from channel and supplies them to the to
 *   channel, subject to the transducer xf, with parallelism n. Because
 *   it is parallel, the transducer will be applied independently to each
 *   element, not across elements, and may produce zero or more outputs
 *   per input.  Outputs will be returned in order relative to the
 *   inputs. By default, the to channel will be closed when the from
 *   channel closes, but can be determined by the close?  parameter. Will
 *   stop consuming the from channel if the to channel closes.
 * 
 *   Note this is supplied for API compatibility with the Clojure version.
 *   Values of N > 1 will not result in actual concurrency in a
 *   single-threaded runtime.
 */
cljs.core.async.pipeline = (function cljs$core$async$pipeline(var_args){
var args23886 = [];
var len__17790__auto___23889 = arguments.length;
var i__17791__auto___23890 = (0);
while(true){
if((i__17791__auto___23890 < len__17790__auto___23889)){
args23886.push((arguments[i__17791__auto___23890]));

var G__23891 = (i__17791__auto___23890 + (1));
i__17791__auto___23890 = G__23891;
continue;
} else {
}
break;
}

var G__23888 = args23886.length;
switch (G__23888) {
case 4:
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23886.length)].join('')));

}
});

cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$4 = (function (n,to,xf,from){
return cljs.core.async.pipeline.call(null,n,to,xf,from,true);
});

cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$5 = (function (n,to,xf,from,close_QMARK_){
return cljs.core.async.pipeline.call(null,n,to,xf,from,close_QMARK_,null);
});

cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$6 = (function (n,to,xf,from,close_QMARK_,ex_handler){
return cljs.core.async.pipeline_STAR_.call(null,n,to,xf,from,close_QMARK_,ex_handler,new cljs.core.Keyword(null,"compute","compute",1555393130));
});

cljs.core.async.pipeline.cljs$lang$maxFixedArity = 6;
/**
 * Takes a predicate and a source channel and returns a vector of two
 *   channels, the first of which will contain the values for which the
 *   predicate returned true, the second those for which it returned
 *   false.
 * 
 *   The out channels will be unbuffered by default, or two buf-or-ns can
 *   be supplied. The channels will close after the source channel has
 *   closed.
 */
cljs.core.async.split = (function cljs$core$async$split(var_args){
var args23893 = [];
var len__17790__auto___23946 = arguments.length;
var i__17791__auto___23947 = (0);
while(true){
if((i__17791__auto___23947 < len__17790__auto___23946)){
args23893.push((arguments[i__17791__auto___23947]));

var G__23948 = (i__17791__auto___23947 + (1));
i__17791__auto___23947 = G__23948;
continue;
} else {
}
break;
}

var G__23895 = args23893.length;
switch (G__23895) {
case 2:
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 4:
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23893.length)].join('')));

}
});

cljs.core.async.split.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.split.call(null,p,ch,null,null);
});

cljs.core.async.split.cljs$core$IFn$_invoke$arity$4 = (function (p,ch,t_buf_or_n,f_buf_or_n){
var tc = cljs.core.async.chan.call(null,t_buf_or_n);
var fc = cljs.core.async.chan.call(null,f_buf_or_n);
var c__23272__auto___23950 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___23950,tc,fc){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___23950,tc,fc){
return (function (state_23921){
var state_val_23922 = (state_23921[(1)]);
if((state_val_23922 === (7))){
var inst_23917 = (state_23921[(2)]);
var state_23921__$1 = state_23921;
var statearr_23923_23951 = state_23921__$1;
(statearr_23923_23951[(2)] = inst_23917);

(statearr_23923_23951[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (1))){
var state_23921__$1 = state_23921;
var statearr_23924_23952 = state_23921__$1;
(statearr_23924_23952[(2)] = null);

(statearr_23924_23952[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (4))){
var inst_23898 = (state_23921[(7)]);
var inst_23898__$1 = (state_23921[(2)]);
var inst_23899 = (inst_23898__$1 == null);
var state_23921__$1 = (function (){var statearr_23925 = state_23921;
(statearr_23925[(7)] = inst_23898__$1);

return statearr_23925;
})();
if(cljs.core.truth_(inst_23899)){
var statearr_23926_23953 = state_23921__$1;
(statearr_23926_23953[(1)] = (5));

} else {
var statearr_23927_23954 = state_23921__$1;
(statearr_23927_23954[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (13))){
var state_23921__$1 = state_23921;
var statearr_23928_23955 = state_23921__$1;
(statearr_23928_23955[(2)] = null);

(statearr_23928_23955[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (6))){
var inst_23898 = (state_23921[(7)]);
var inst_23904 = p.call(null,inst_23898);
var state_23921__$1 = state_23921;
if(cljs.core.truth_(inst_23904)){
var statearr_23929_23956 = state_23921__$1;
(statearr_23929_23956[(1)] = (9));

} else {
var statearr_23930_23957 = state_23921__$1;
(statearr_23930_23957[(1)] = (10));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (3))){
var inst_23919 = (state_23921[(2)]);
var state_23921__$1 = state_23921;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_23921__$1,inst_23919);
} else {
if((state_val_23922 === (12))){
var state_23921__$1 = state_23921;
var statearr_23931_23958 = state_23921__$1;
(statearr_23931_23958[(2)] = null);

(statearr_23931_23958[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (2))){
var state_23921__$1 = state_23921;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_23921__$1,(4),ch);
} else {
if((state_val_23922 === (11))){
var inst_23898 = (state_23921[(7)]);
var inst_23908 = (state_23921[(2)]);
var state_23921__$1 = state_23921;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_23921__$1,(8),inst_23908,inst_23898);
} else {
if((state_val_23922 === (9))){
var state_23921__$1 = state_23921;
var statearr_23932_23959 = state_23921__$1;
(statearr_23932_23959[(2)] = tc);

(statearr_23932_23959[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (5))){
var inst_23901 = cljs.core.async.close_BANG_.call(null,tc);
var inst_23902 = cljs.core.async.close_BANG_.call(null,fc);
var state_23921__$1 = (function (){var statearr_23933 = state_23921;
(statearr_23933[(8)] = inst_23901);

return statearr_23933;
})();
var statearr_23934_23960 = state_23921__$1;
(statearr_23934_23960[(2)] = inst_23902);

(statearr_23934_23960[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (14))){
var inst_23915 = (state_23921[(2)]);
var state_23921__$1 = state_23921;
var statearr_23935_23961 = state_23921__$1;
(statearr_23935_23961[(2)] = inst_23915);

(statearr_23935_23961[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (10))){
var state_23921__$1 = state_23921;
var statearr_23936_23962 = state_23921__$1;
(statearr_23936_23962[(2)] = fc);

(statearr_23936_23962[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_23922 === (8))){
var inst_23910 = (state_23921[(2)]);
var state_23921__$1 = state_23921;
if(cljs.core.truth_(inst_23910)){
var statearr_23937_23963 = state_23921__$1;
(statearr_23937_23963[(1)] = (12));

} else {
var statearr_23938_23964 = state_23921__$1;
(statearr_23938_23964[(1)] = (13));

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
});})(c__23272__auto___23950,tc,fc))
;
return ((function (switch__23207__auto__,c__23272__auto___23950,tc,fc){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_23942 = [null,null,null,null,null,null,null,null,null];
(statearr_23942[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_23942[(1)] = (1));

return statearr_23942;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_23921){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_23921);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e23943){if((e23943 instanceof Object)){
var ex__23211__auto__ = e23943;
var statearr_23944_23965 = state_23921;
(statearr_23944_23965[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_23921);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e23943;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__23966 = state_23921;
state_23921 = G__23966;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_23921){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_23921);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___23950,tc,fc))
})();
var state__23274__auto__ = (function (){var statearr_23945 = f__23273__auto__.call(null);
(statearr_23945[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___23950);

return statearr_23945;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___23950,tc,fc))
);


return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [tc,fc], null);
});

cljs.core.async.split.cljs$lang$maxFixedArity = 4;
/**
 * f should be a function of 2 arguments. Returns a channel containing
 *   the single result of applying f to init and the first item from the
 *   channel, then applying f to that result and the 2nd item, etc. If
 *   the channel closes without yielding items, returns init and f is not
 *   called. ch must close before reduce produces a result.
 */
cljs.core.async.reduce = (function cljs$core$async$reduce(f,init,ch){
var c__23272__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto__){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto__){
return (function (state_24030){
var state_val_24031 = (state_24030[(1)]);
if((state_val_24031 === (7))){
var inst_24026 = (state_24030[(2)]);
var state_24030__$1 = state_24030;
var statearr_24032_24053 = state_24030__$1;
(statearr_24032_24053[(2)] = inst_24026);

(statearr_24032_24053[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24031 === (1))){
var inst_24010 = init;
var state_24030__$1 = (function (){var statearr_24033 = state_24030;
(statearr_24033[(7)] = inst_24010);

return statearr_24033;
})();
var statearr_24034_24054 = state_24030__$1;
(statearr_24034_24054[(2)] = null);

(statearr_24034_24054[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24031 === (4))){
var inst_24013 = (state_24030[(8)]);
var inst_24013__$1 = (state_24030[(2)]);
var inst_24014 = (inst_24013__$1 == null);
var state_24030__$1 = (function (){var statearr_24035 = state_24030;
(statearr_24035[(8)] = inst_24013__$1);

return statearr_24035;
})();
if(cljs.core.truth_(inst_24014)){
var statearr_24036_24055 = state_24030__$1;
(statearr_24036_24055[(1)] = (5));

} else {
var statearr_24037_24056 = state_24030__$1;
(statearr_24037_24056[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24031 === (6))){
var inst_24017 = (state_24030[(9)]);
var inst_24010 = (state_24030[(7)]);
var inst_24013 = (state_24030[(8)]);
var inst_24017__$1 = f.call(null,inst_24010,inst_24013);
var inst_24018 = cljs.core.reduced_QMARK_.call(null,inst_24017__$1);
var state_24030__$1 = (function (){var statearr_24038 = state_24030;
(statearr_24038[(9)] = inst_24017__$1);

return statearr_24038;
})();
if(inst_24018){
var statearr_24039_24057 = state_24030__$1;
(statearr_24039_24057[(1)] = (8));

} else {
var statearr_24040_24058 = state_24030__$1;
(statearr_24040_24058[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24031 === (3))){
var inst_24028 = (state_24030[(2)]);
var state_24030__$1 = state_24030;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_24030__$1,inst_24028);
} else {
if((state_val_24031 === (2))){
var state_24030__$1 = state_24030;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_24030__$1,(4),ch);
} else {
if((state_val_24031 === (9))){
var inst_24017 = (state_24030[(9)]);
var inst_24010 = inst_24017;
var state_24030__$1 = (function (){var statearr_24041 = state_24030;
(statearr_24041[(7)] = inst_24010);

return statearr_24041;
})();
var statearr_24042_24059 = state_24030__$1;
(statearr_24042_24059[(2)] = null);

(statearr_24042_24059[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24031 === (5))){
var inst_24010 = (state_24030[(7)]);
var state_24030__$1 = state_24030;
var statearr_24043_24060 = state_24030__$1;
(statearr_24043_24060[(2)] = inst_24010);

(statearr_24043_24060[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24031 === (10))){
var inst_24024 = (state_24030[(2)]);
var state_24030__$1 = state_24030;
var statearr_24044_24061 = state_24030__$1;
(statearr_24044_24061[(2)] = inst_24024);

(statearr_24044_24061[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24031 === (8))){
var inst_24017 = (state_24030[(9)]);
var inst_24020 = cljs.core.deref.call(null,inst_24017);
var state_24030__$1 = state_24030;
var statearr_24045_24062 = state_24030__$1;
(statearr_24045_24062[(2)] = inst_24020);

(statearr_24045_24062[(1)] = (10));


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
});})(c__23272__auto__))
;
return ((function (switch__23207__auto__,c__23272__auto__){
return (function() {
var cljs$core$async$reduce_$_state_machine__23208__auto__ = null;
var cljs$core$async$reduce_$_state_machine__23208__auto____0 = (function (){
var statearr_24049 = [null,null,null,null,null,null,null,null,null,null];
(statearr_24049[(0)] = cljs$core$async$reduce_$_state_machine__23208__auto__);

(statearr_24049[(1)] = (1));

return statearr_24049;
});
var cljs$core$async$reduce_$_state_machine__23208__auto____1 = (function (state_24030){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_24030);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e24050){if((e24050 instanceof Object)){
var ex__23211__auto__ = e24050;
var statearr_24051_24063 = state_24030;
(statearr_24051_24063[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_24030);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e24050;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__24064 = state_24030;
state_24030 = G__24064;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$reduce_$_state_machine__23208__auto__ = function(state_24030){
switch(arguments.length){
case 0:
return cljs$core$async$reduce_$_state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$reduce_$_state_machine__23208__auto____1.call(this,state_24030);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$reduce_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$reduce_$_state_machine__23208__auto____0;
cljs$core$async$reduce_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$reduce_$_state_machine__23208__auto____1;
return cljs$core$async$reduce_$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto__))
})();
var state__23274__auto__ = (function (){var statearr_24052 = f__23273__auto__.call(null);
(statearr_24052[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto__);

return statearr_24052;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto__))
);

return c__23272__auto__;
});
/**
 * Puts the contents of coll into the supplied channel.
 * 
 *   By default the channel will be closed after the items are copied,
 *   but can be determined by the close? parameter.
 * 
 *   Returns a channel which will close after the items are copied.
 */
cljs.core.async.onto_chan = (function cljs$core$async$onto_chan(var_args){
var args24065 = [];
var len__17790__auto___24117 = arguments.length;
var i__17791__auto___24118 = (0);
while(true){
if((i__17791__auto___24118 < len__17790__auto___24117)){
args24065.push((arguments[i__17791__auto___24118]));

var G__24119 = (i__17791__auto___24118 + (1));
i__17791__auto___24118 = G__24119;
continue;
} else {
}
break;
}

var G__24067 = args24065.length;
switch (G__24067) {
case 2:
return cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24065.length)].join('')));

}
});

cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$2 = (function (ch,coll){
return cljs.core.async.onto_chan.call(null,ch,coll,true);
});

cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$3 = (function (ch,coll,close_QMARK_){
var c__23272__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto__){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto__){
return (function (state_24092){
var state_val_24093 = (state_24092[(1)]);
if((state_val_24093 === (7))){
var inst_24074 = (state_24092[(2)]);
var state_24092__$1 = state_24092;
var statearr_24094_24121 = state_24092__$1;
(statearr_24094_24121[(2)] = inst_24074);

(statearr_24094_24121[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (1))){
var inst_24068 = cljs.core.seq.call(null,coll);
var inst_24069 = inst_24068;
var state_24092__$1 = (function (){var statearr_24095 = state_24092;
(statearr_24095[(7)] = inst_24069);

return statearr_24095;
})();
var statearr_24096_24122 = state_24092__$1;
(statearr_24096_24122[(2)] = null);

(statearr_24096_24122[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (4))){
var inst_24069 = (state_24092[(7)]);
var inst_24072 = cljs.core.first.call(null,inst_24069);
var state_24092__$1 = state_24092;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_24092__$1,(7),ch,inst_24072);
} else {
if((state_val_24093 === (13))){
var inst_24086 = (state_24092[(2)]);
var state_24092__$1 = state_24092;
var statearr_24097_24123 = state_24092__$1;
(statearr_24097_24123[(2)] = inst_24086);

(statearr_24097_24123[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (6))){
var inst_24077 = (state_24092[(2)]);
var state_24092__$1 = state_24092;
if(cljs.core.truth_(inst_24077)){
var statearr_24098_24124 = state_24092__$1;
(statearr_24098_24124[(1)] = (8));

} else {
var statearr_24099_24125 = state_24092__$1;
(statearr_24099_24125[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (3))){
var inst_24090 = (state_24092[(2)]);
var state_24092__$1 = state_24092;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_24092__$1,inst_24090);
} else {
if((state_val_24093 === (12))){
var state_24092__$1 = state_24092;
var statearr_24100_24126 = state_24092__$1;
(statearr_24100_24126[(2)] = null);

(statearr_24100_24126[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (2))){
var inst_24069 = (state_24092[(7)]);
var state_24092__$1 = state_24092;
if(cljs.core.truth_(inst_24069)){
var statearr_24101_24127 = state_24092__$1;
(statearr_24101_24127[(1)] = (4));

} else {
var statearr_24102_24128 = state_24092__$1;
(statearr_24102_24128[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (11))){
var inst_24083 = cljs.core.async.close_BANG_.call(null,ch);
var state_24092__$1 = state_24092;
var statearr_24103_24129 = state_24092__$1;
(statearr_24103_24129[(2)] = inst_24083);

(statearr_24103_24129[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (9))){
var state_24092__$1 = state_24092;
if(cljs.core.truth_(close_QMARK_)){
var statearr_24104_24130 = state_24092__$1;
(statearr_24104_24130[(1)] = (11));

} else {
var statearr_24105_24131 = state_24092__$1;
(statearr_24105_24131[(1)] = (12));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (5))){
var inst_24069 = (state_24092[(7)]);
var state_24092__$1 = state_24092;
var statearr_24106_24132 = state_24092__$1;
(statearr_24106_24132[(2)] = inst_24069);

(statearr_24106_24132[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (10))){
var inst_24088 = (state_24092[(2)]);
var state_24092__$1 = state_24092;
var statearr_24107_24133 = state_24092__$1;
(statearr_24107_24133[(2)] = inst_24088);

(statearr_24107_24133[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24093 === (8))){
var inst_24069 = (state_24092[(7)]);
var inst_24079 = cljs.core.next.call(null,inst_24069);
var inst_24069__$1 = inst_24079;
var state_24092__$1 = (function (){var statearr_24108 = state_24092;
(statearr_24108[(7)] = inst_24069__$1);

return statearr_24108;
})();
var statearr_24109_24134 = state_24092__$1;
(statearr_24109_24134[(2)] = null);

(statearr_24109_24134[(1)] = (2));


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
});})(c__23272__auto__))
;
return ((function (switch__23207__auto__,c__23272__auto__){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_24113 = [null,null,null,null,null,null,null,null];
(statearr_24113[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_24113[(1)] = (1));

return statearr_24113;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_24092){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_24092);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e24114){if((e24114 instanceof Object)){
var ex__23211__auto__ = e24114;
var statearr_24115_24135 = state_24092;
(statearr_24115_24135[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_24092);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e24114;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__24136 = state_24092;
state_24092 = G__24136;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_24092){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_24092);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto__))
})();
var state__23274__auto__ = (function (){var statearr_24116 = f__23273__auto__.call(null);
(statearr_24116[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto__);

return statearr_24116;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto__))
);

return c__23272__auto__;
});

cljs.core.async.onto_chan.cljs$lang$maxFixedArity = 3;
/**
 * Creates and returns a channel which contains the contents of coll,
 *   closing when exhausted.
 */
cljs.core.async.to_chan = (function cljs$core$async$to_chan(coll){
var ch = cljs.core.async.chan.call(null,cljs.core.bounded_count.call(null,(100),coll));
cljs.core.async.onto_chan.call(null,ch,coll);

return ch;
});

/**
 * @interface
 */
cljs.core.async.Mux = function(){};

cljs.core.async.muxch_STAR_ = (function cljs$core$async$muxch_STAR_(_){
if((!((_ == null))) && (!((_.cljs$core$async$Mux$muxch_STAR_$arity$1 == null)))){
return _.cljs$core$async$Mux$muxch_STAR_$arity$1(_);
} else {
var x__17387__auto__ = (((_ == null))?null:_);
var m__17388__auto__ = (cljs.core.async.muxch_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,_);
} else {
var m__17388__auto____$1 = (cljs.core.async.muxch_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,_);
} else {
throw cljs.core.missing_protocol.call(null,"Mux.muxch*",_);
}
}
}
});


/**
 * @interface
 */
cljs.core.async.Mult = function(){};

cljs.core.async.tap_STAR_ = (function cljs$core$async$tap_STAR_(m,ch,close_QMARK_){
if((!((m == null))) && (!((m.cljs$core$async$Mult$tap_STAR_$arity$3 == null)))){
return m.cljs$core$async$Mult$tap_STAR_$arity$3(m,ch,close_QMARK_);
} else {
var x__17387__auto__ = (((m == null))?null:m);
var m__17388__auto__ = (cljs.core.async.tap_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,m,ch,close_QMARK_);
} else {
var m__17388__auto____$1 = (cljs.core.async.tap_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,m,ch,close_QMARK_);
} else {
throw cljs.core.missing_protocol.call(null,"Mult.tap*",m);
}
}
}
});

cljs.core.async.untap_STAR_ = (function cljs$core$async$untap_STAR_(m,ch){
if((!((m == null))) && (!((m.cljs$core$async$Mult$untap_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mult$untap_STAR_$arity$2(m,ch);
} else {
var x__17387__auto__ = (((m == null))?null:m);
var m__17388__auto__ = (cljs.core.async.untap_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,m,ch);
} else {
var m__17388__auto____$1 = (cljs.core.async.untap_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,m,ch);
} else {
throw cljs.core.missing_protocol.call(null,"Mult.untap*",m);
}
}
}
});

cljs.core.async.untap_all_STAR_ = (function cljs$core$async$untap_all_STAR_(m){
if((!((m == null))) && (!((m.cljs$core$async$Mult$untap_all_STAR_$arity$1 == null)))){
return m.cljs$core$async$Mult$untap_all_STAR_$arity$1(m);
} else {
var x__17387__auto__ = (((m == null))?null:m);
var m__17388__auto__ = (cljs.core.async.untap_all_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,m);
} else {
var m__17388__auto____$1 = (cljs.core.async.untap_all_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,m);
} else {
throw cljs.core.missing_protocol.call(null,"Mult.untap-all*",m);
}
}
}
});

/**
 * Creates and returns a mult(iple) of the supplied channel. Channels
 *   containing copies of the channel can be created with 'tap', and
 *   detached with 'untap'.
 * 
 *   Each item is distributed to all taps in parallel and synchronously,
 *   i.e. each tap must accept before the next item is distributed. Use
 *   buffering/windowing to prevent slow taps from holding up the mult.
 * 
 *   Items received when there are no taps get dropped.
 * 
 *   If a tap puts to a closed channel, it will be removed from the mult.
 */
cljs.core.async.mult = (function cljs$core$async$mult(ch){
var cs = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var m = (function (){
if(typeof cljs.core.async.t_cljs$core$async24358 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.Mult}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async24358 = (function (mult,ch,cs,meta24359){
this.mult = mult;
this.ch = ch;
this.cs = cs;
this.meta24359 = meta24359;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async24358.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (cs){
return (function (_24360,meta24359__$1){
var self__ = this;
var _24360__$1 = this;
return (new cljs.core.async.t_cljs$core$async24358(self__.mult,self__.ch,self__.cs,meta24359__$1));
});})(cs))
;

cljs.core.async.t_cljs$core$async24358.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (cs){
return (function (_24360){
var self__ = this;
var _24360__$1 = this;
return self__.meta24359;
});})(cs))
;

cljs.core.async.t_cljs$core$async24358.prototype.cljs$core$async$Mux$ = true;

cljs.core.async.t_cljs$core$async24358.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = ((function (cs){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
});})(cs))
;

cljs.core.async.t_cljs$core$async24358.prototype.cljs$core$async$Mult$ = true;

cljs.core.async.t_cljs$core$async24358.prototype.cljs$core$async$Mult$tap_STAR_$arity$3 = ((function (cs){
return (function (_,ch__$1,close_QMARK_){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.assoc,ch__$1,close_QMARK_);

return null;
});})(cs))
;

cljs.core.async.t_cljs$core$async24358.prototype.cljs$core$async$Mult$untap_STAR_$arity$2 = ((function (cs){
return (function (_,ch__$1){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.dissoc,ch__$1);

return null;
});})(cs))
;

cljs.core.async.t_cljs$core$async24358.prototype.cljs$core$async$Mult$untap_all_STAR_$arity$1 = ((function (cs){
return (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_.call(null,self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return null;
});})(cs))
;

cljs.core.async.t_cljs$core$async24358.getBasis = ((function (cs){
return (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"mult","mult",-1187640995,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Creates and returns a mult(iple) of the supplied channel. Channels\n  containing copies of the channel can be created with 'tap', and\n  detached with 'untap'.\n\n  Each item is distributed to all taps in parallel and synchronously,\n  i.e. each tap must accept before the next item is distributed. Use\n  buffering/windowing to prevent slow taps from holding up the mult.\n\n  Items received when there are no taps get dropped.\n\n  If a tap puts to a closed channel, it will be removed from the mult."], null)),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"meta24359","meta24359",-618474003,null)], null);
});})(cs))
;

cljs.core.async.t_cljs$core$async24358.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async24358.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async24358";

cljs.core.async.t_cljs$core$async24358.cljs$lang$ctorPrWriter = ((function (cs){
return (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async24358");
});})(cs))
;

cljs.core.async.__GT_t_cljs$core$async24358 = ((function (cs){
return (function cljs$core$async$mult_$___GT_t_cljs$core$async24358(mult__$1,ch__$1,cs__$1,meta24359){
return (new cljs.core.async.t_cljs$core$async24358(mult__$1,ch__$1,cs__$1,meta24359));
});})(cs))
;

}

return (new cljs.core.async.t_cljs$core$async24358(cljs$core$async$mult,ch,cs,cljs.core.PersistentArrayMap.EMPTY));
})()
;
var dchan = cljs.core.async.chan.call(null,(1));
var dctr = cljs.core.atom.call(null,null);
var done = ((function (cs,m,dchan,dctr){
return (function (_){
if((cljs.core.swap_BANG_.call(null,dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.call(null,dchan,true);
} else {
return null;
}
});})(cs,m,dchan,dctr))
;
var c__23272__auto___24579 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___24579,cs,m,dchan,dctr,done){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___24579,cs,m,dchan,dctr,done){
return (function (state_24491){
var state_val_24492 = (state_24491[(1)]);
if((state_val_24492 === (7))){
var inst_24487 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
var statearr_24493_24580 = state_24491__$1;
(statearr_24493_24580[(2)] = inst_24487);

(statearr_24493_24580[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (20))){
var inst_24392 = (state_24491[(7)]);
var inst_24402 = cljs.core.first.call(null,inst_24392);
var inst_24403 = cljs.core.nth.call(null,inst_24402,(0),null);
var inst_24404 = cljs.core.nth.call(null,inst_24402,(1),null);
var state_24491__$1 = (function (){var statearr_24494 = state_24491;
(statearr_24494[(8)] = inst_24403);

return statearr_24494;
})();
if(cljs.core.truth_(inst_24404)){
var statearr_24495_24581 = state_24491__$1;
(statearr_24495_24581[(1)] = (22));

} else {
var statearr_24496_24582 = state_24491__$1;
(statearr_24496_24582[(1)] = (23));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (27))){
var inst_24439 = (state_24491[(9)]);
var inst_24432 = (state_24491[(10)]);
var inst_24363 = (state_24491[(11)]);
var inst_24434 = (state_24491[(12)]);
var inst_24439__$1 = cljs.core._nth.call(null,inst_24432,inst_24434);
var inst_24440 = cljs.core.async.put_BANG_.call(null,inst_24439__$1,inst_24363,done);
var state_24491__$1 = (function (){var statearr_24497 = state_24491;
(statearr_24497[(9)] = inst_24439__$1);

return statearr_24497;
})();
if(cljs.core.truth_(inst_24440)){
var statearr_24498_24583 = state_24491__$1;
(statearr_24498_24583[(1)] = (30));

} else {
var statearr_24499_24584 = state_24491__$1;
(statearr_24499_24584[(1)] = (31));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (1))){
var state_24491__$1 = state_24491;
var statearr_24500_24585 = state_24491__$1;
(statearr_24500_24585[(2)] = null);

(statearr_24500_24585[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (24))){
var inst_24392 = (state_24491[(7)]);
var inst_24409 = (state_24491[(2)]);
var inst_24410 = cljs.core.next.call(null,inst_24392);
var inst_24372 = inst_24410;
var inst_24373 = null;
var inst_24374 = (0);
var inst_24375 = (0);
var state_24491__$1 = (function (){var statearr_24501 = state_24491;
(statearr_24501[(13)] = inst_24409);

(statearr_24501[(14)] = inst_24372);

(statearr_24501[(15)] = inst_24375);

(statearr_24501[(16)] = inst_24374);

(statearr_24501[(17)] = inst_24373);

return statearr_24501;
})();
var statearr_24502_24586 = state_24491__$1;
(statearr_24502_24586[(2)] = null);

(statearr_24502_24586[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (39))){
var state_24491__$1 = state_24491;
var statearr_24506_24587 = state_24491__$1;
(statearr_24506_24587[(2)] = null);

(statearr_24506_24587[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (4))){
var inst_24363 = (state_24491[(11)]);
var inst_24363__$1 = (state_24491[(2)]);
var inst_24364 = (inst_24363__$1 == null);
var state_24491__$1 = (function (){var statearr_24507 = state_24491;
(statearr_24507[(11)] = inst_24363__$1);

return statearr_24507;
})();
if(cljs.core.truth_(inst_24364)){
var statearr_24508_24588 = state_24491__$1;
(statearr_24508_24588[(1)] = (5));

} else {
var statearr_24509_24589 = state_24491__$1;
(statearr_24509_24589[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (15))){
var inst_24372 = (state_24491[(14)]);
var inst_24375 = (state_24491[(15)]);
var inst_24374 = (state_24491[(16)]);
var inst_24373 = (state_24491[(17)]);
var inst_24388 = (state_24491[(2)]);
var inst_24389 = (inst_24375 + (1));
var tmp24503 = inst_24372;
var tmp24504 = inst_24374;
var tmp24505 = inst_24373;
var inst_24372__$1 = tmp24503;
var inst_24373__$1 = tmp24505;
var inst_24374__$1 = tmp24504;
var inst_24375__$1 = inst_24389;
var state_24491__$1 = (function (){var statearr_24510 = state_24491;
(statearr_24510[(14)] = inst_24372__$1);

(statearr_24510[(15)] = inst_24375__$1);

(statearr_24510[(18)] = inst_24388);

(statearr_24510[(16)] = inst_24374__$1);

(statearr_24510[(17)] = inst_24373__$1);

return statearr_24510;
})();
var statearr_24511_24590 = state_24491__$1;
(statearr_24511_24590[(2)] = null);

(statearr_24511_24590[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (21))){
var inst_24413 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
var statearr_24515_24591 = state_24491__$1;
(statearr_24515_24591[(2)] = inst_24413);

(statearr_24515_24591[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (31))){
var inst_24439 = (state_24491[(9)]);
var inst_24443 = done.call(null,null);
var inst_24444 = cljs.core.async.untap_STAR_.call(null,m,inst_24439);
var state_24491__$1 = (function (){var statearr_24516 = state_24491;
(statearr_24516[(19)] = inst_24443);

return statearr_24516;
})();
var statearr_24517_24592 = state_24491__$1;
(statearr_24517_24592[(2)] = inst_24444);

(statearr_24517_24592[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (32))){
var inst_24432 = (state_24491[(10)]);
var inst_24431 = (state_24491[(20)]);
var inst_24433 = (state_24491[(21)]);
var inst_24434 = (state_24491[(12)]);
var inst_24446 = (state_24491[(2)]);
var inst_24447 = (inst_24434 + (1));
var tmp24512 = inst_24432;
var tmp24513 = inst_24431;
var tmp24514 = inst_24433;
var inst_24431__$1 = tmp24513;
var inst_24432__$1 = tmp24512;
var inst_24433__$1 = tmp24514;
var inst_24434__$1 = inst_24447;
var state_24491__$1 = (function (){var statearr_24518 = state_24491;
(statearr_24518[(10)] = inst_24432__$1);

(statearr_24518[(20)] = inst_24431__$1);

(statearr_24518[(21)] = inst_24433__$1);

(statearr_24518[(22)] = inst_24446);

(statearr_24518[(12)] = inst_24434__$1);

return statearr_24518;
})();
var statearr_24519_24593 = state_24491__$1;
(statearr_24519_24593[(2)] = null);

(statearr_24519_24593[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (40))){
var inst_24459 = (state_24491[(23)]);
var inst_24463 = done.call(null,null);
var inst_24464 = cljs.core.async.untap_STAR_.call(null,m,inst_24459);
var state_24491__$1 = (function (){var statearr_24520 = state_24491;
(statearr_24520[(24)] = inst_24463);

return statearr_24520;
})();
var statearr_24521_24594 = state_24491__$1;
(statearr_24521_24594[(2)] = inst_24464);

(statearr_24521_24594[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (33))){
var inst_24450 = (state_24491[(25)]);
var inst_24452 = cljs.core.chunked_seq_QMARK_.call(null,inst_24450);
var state_24491__$1 = state_24491;
if(inst_24452){
var statearr_24522_24595 = state_24491__$1;
(statearr_24522_24595[(1)] = (36));

} else {
var statearr_24523_24596 = state_24491__$1;
(statearr_24523_24596[(1)] = (37));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (13))){
var inst_24382 = (state_24491[(26)]);
var inst_24385 = cljs.core.async.close_BANG_.call(null,inst_24382);
var state_24491__$1 = state_24491;
var statearr_24524_24597 = state_24491__$1;
(statearr_24524_24597[(2)] = inst_24385);

(statearr_24524_24597[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (22))){
var inst_24403 = (state_24491[(8)]);
var inst_24406 = cljs.core.async.close_BANG_.call(null,inst_24403);
var state_24491__$1 = state_24491;
var statearr_24525_24598 = state_24491__$1;
(statearr_24525_24598[(2)] = inst_24406);

(statearr_24525_24598[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (36))){
var inst_24450 = (state_24491[(25)]);
var inst_24454 = cljs.core.chunk_first.call(null,inst_24450);
var inst_24455 = cljs.core.chunk_rest.call(null,inst_24450);
var inst_24456 = cljs.core.count.call(null,inst_24454);
var inst_24431 = inst_24455;
var inst_24432 = inst_24454;
var inst_24433 = inst_24456;
var inst_24434 = (0);
var state_24491__$1 = (function (){var statearr_24526 = state_24491;
(statearr_24526[(10)] = inst_24432);

(statearr_24526[(20)] = inst_24431);

(statearr_24526[(21)] = inst_24433);

(statearr_24526[(12)] = inst_24434);

return statearr_24526;
})();
var statearr_24527_24599 = state_24491__$1;
(statearr_24527_24599[(2)] = null);

(statearr_24527_24599[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (41))){
var inst_24450 = (state_24491[(25)]);
var inst_24466 = (state_24491[(2)]);
var inst_24467 = cljs.core.next.call(null,inst_24450);
var inst_24431 = inst_24467;
var inst_24432 = null;
var inst_24433 = (0);
var inst_24434 = (0);
var state_24491__$1 = (function (){var statearr_24528 = state_24491;
(statearr_24528[(10)] = inst_24432);

(statearr_24528[(27)] = inst_24466);

(statearr_24528[(20)] = inst_24431);

(statearr_24528[(21)] = inst_24433);

(statearr_24528[(12)] = inst_24434);

return statearr_24528;
})();
var statearr_24529_24600 = state_24491__$1;
(statearr_24529_24600[(2)] = null);

(statearr_24529_24600[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (43))){
var state_24491__$1 = state_24491;
var statearr_24530_24601 = state_24491__$1;
(statearr_24530_24601[(2)] = null);

(statearr_24530_24601[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (29))){
var inst_24475 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
var statearr_24531_24602 = state_24491__$1;
(statearr_24531_24602[(2)] = inst_24475);

(statearr_24531_24602[(1)] = (26));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (44))){
var inst_24484 = (state_24491[(2)]);
var state_24491__$1 = (function (){var statearr_24532 = state_24491;
(statearr_24532[(28)] = inst_24484);

return statearr_24532;
})();
var statearr_24533_24603 = state_24491__$1;
(statearr_24533_24603[(2)] = null);

(statearr_24533_24603[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (6))){
var inst_24423 = (state_24491[(29)]);
var inst_24422 = cljs.core.deref.call(null,cs);
var inst_24423__$1 = cljs.core.keys.call(null,inst_24422);
var inst_24424 = cljs.core.count.call(null,inst_24423__$1);
var inst_24425 = cljs.core.reset_BANG_.call(null,dctr,inst_24424);
var inst_24430 = cljs.core.seq.call(null,inst_24423__$1);
var inst_24431 = inst_24430;
var inst_24432 = null;
var inst_24433 = (0);
var inst_24434 = (0);
var state_24491__$1 = (function (){var statearr_24534 = state_24491;
(statearr_24534[(30)] = inst_24425);

(statearr_24534[(10)] = inst_24432);

(statearr_24534[(20)] = inst_24431);

(statearr_24534[(21)] = inst_24433);

(statearr_24534[(29)] = inst_24423__$1);

(statearr_24534[(12)] = inst_24434);

return statearr_24534;
})();
var statearr_24535_24604 = state_24491__$1;
(statearr_24535_24604[(2)] = null);

(statearr_24535_24604[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (28))){
var inst_24431 = (state_24491[(20)]);
var inst_24450 = (state_24491[(25)]);
var inst_24450__$1 = cljs.core.seq.call(null,inst_24431);
var state_24491__$1 = (function (){var statearr_24536 = state_24491;
(statearr_24536[(25)] = inst_24450__$1);

return statearr_24536;
})();
if(inst_24450__$1){
var statearr_24537_24605 = state_24491__$1;
(statearr_24537_24605[(1)] = (33));

} else {
var statearr_24538_24606 = state_24491__$1;
(statearr_24538_24606[(1)] = (34));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (25))){
var inst_24433 = (state_24491[(21)]);
var inst_24434 = (state_24491[(12)]);
var inst_24436 = (inst_24434 < inst_24433);
var inst_24437 = inst_24436;
var state_24491__$1 = state_24491;
if(cljs.core.truth_(inst_24437)){
var statearr_24539_24607 = state_24491__$1;
(statearr_24539_24607[(1)] = (27));

} else {
var statearr_24540_24608 = state_24491__$1;
(statearr_24540_24608[(1)] = (28));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (34))){
var state_24491__$1 = state_24491;
var statearr_24541_24609 = state_24491__$1;
(statearr_24541_24609[(2)] = null);

(statearr_24541_24609[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (17))){
var state_24491__$1 = state_24491;
var statearr_24542_24610 = state_24491__$1;
(statearr_24542_24610[(2)] = null);

(statearr_24542_24610[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (3))){
var inst_24489 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_24491__$1,inst_24489);
} else {
if((state_val_24492 === (12))){
var inst_24418 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
var statearr_24543_24611 = state_24491__$1;
(statearr_24543_24611[(2)] = inst_24418);

(statearr_24543_24611[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (2))){
var state_24491__$1 = state_24491;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_24491__$1,(4),ch);
} else {
if((state_val_24492 === (23))){
var state_24491__$1 = state_24491;
var statearr_24544_24612 = state_24491__$1;
(statearr_24544_24612[(2)] = null);

(statearr_24544_24612[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (35))){
var inst_24473 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
var statearr_24545_24613 = state_24491__$1;
(statearr_24545_24613[(2)] = inst_24473);

(statearr_24545_24613[(1)] = (29));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (19))){
var inst_24392 = (state_24491[(7)]);
var inst_24396 = cljs.core.chunk_first.call(null,inst_24392);
var inst_24397 = cljs.core.chunk_rest.call(null,inst_24392);
var inst_24398 = cljs.core.count.call(null,inst_24396);
var inst_24372 = inst_24397;
var inst_24373 = inst_24396;
var inst_24374 = inst_24398;
var inst_24375 = (0);
var state_24491__$1 = (function (){var statearr_24546 = state_24491;
(statearr_24546[(14)] = inst_24372);

(statearr_24546[(15)] = inst_24375);

(statearr_24546[(16)] = inst_24374);

(statearr_24546[(17)] = inst_24373);

return statearr_24546;
})();
var statearr_24547_24614 = state_24491__$1;
(statearr_24547_24614[(2)] = null);

(statearr_24547_24614[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (11))){
var inst_24392 = (state_24491[(7)]);
var inst_24372 = (state_24491[(14)]);
var inst_24392__$1 = cljs.core.seq.call(null,inst_24372);
var state_24491__$1 = (function (){var statearr_24548 = state_24491;
(statearr_24548[(7)] = inst_24392__$1);

return statearr_24548;
})();
if(inst_24392__$1){
var statearr_24549_24615 = state_24491__$1;
(statearr_24549_24615[(1)] = (16));

} else {
var statearr_24550_24616 = state_24491__$1;
(statearr_24550_24616[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (9))){
var inst_24420 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
var statearr_24551_24617 = state_24491__$1;
(statearr_24551_24617[(2)] = inst_24420);

(statearr_24551_24617[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (5))){
var inst_24370 = cljs.core.deref.call(null,cs);
var inst_24371 = cljs.core.seq.call(null,inst_24370);
var inst_24372 = inst_24371;
var inst_24373 = null;
var inst_24374 = (0);
var inst_24375 = (0);
var state_24491__$1 = (function (){var statearr_24552 = state_24491;
(statearr_24552[(14)] = inst_24372);

(statearr_24552[(15)] = inst_24375);

(statearr_24552[(16)] = inst_24374);

(statearr_24552[(17)] = inst_24373);

return statearr_24552;
})();
var statearr_24553_24618 = state_24491__$1;
(statearr_24553_24618[(2)] = null);

(statearr_24553_24618[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (14))){
var state_24491__$1 = state_24491;
var statearr_24554_24619 = state_24491__$1;
(statearr_24554_24619[(2)] = null);

(statearr_24554_24619[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (45))){
var inst_24481 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
var statearr_24555_24620 = state_24491__$1;
(statearr_24555_24620[(2)] = inst_24481);

(statearr_24555_24620[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (26))){
var inst_24423 = (state_24491[(29)]);
var inst_24477 = (state_24491[(2)]);
var inst_24478 = cljs.core.seq.call(null,inst_24423);
var state_24491__$1 = (function (){var statearr_24556 = state_24491;
(statearr_24556[(31)] = inst_24477);

return statearr_24556;
})();
if(inst_24478){
var statearr_24557_24621 = state_24491__$1;
(statearr_24557_24621[(1)] = (42));

} else {
var statearr_24558_24622 = state_24491__$1;
(statearr_24558_24622[(1)] = (43));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (16))){
var inst_24392 = (state_24491[(7)]);
var inst_24394 = cljs.core.chunked_seq_QMARK_.call(null,inst_24392);
var state_24491__$1 = state_24491;
if(inst_24394){
var statearr_24559_24623 = state_24491__$1;
(statearr_24559_24623[(1)] = (19));

} else {
var statearr_24560_24624 = state_24491__$1;
(statearr_24560_24624[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (38))){
var inst_24470 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
var statearr_24561_24625 = state_24491__$1;
(statearr_24561_24625[(2)] = inst_24470);

(statearr_24561_24625[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (30))){
var state_24491__$1 = state_24491;
var statearr_24562_24626 = state_24491__$1;
(statearr_24562_24626[(2)] = null);

(statearr_24562_24626[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (10))){
var inst_24375 = (state_24491[(15)]);
var inst_24373 = (state_24491[(17)]);
var inst_24381 = cljs.core._nth.call(null,inst_24373,inst_24375);
var inst_24382 = cljs.core.nth.call(null,inst_24381,(0),null);
var inst_24383 = cljs.core.nth.call(null,inst_24381,(1),null);
var state_24491__$1 = (function (){var statearr_24563 = state_24491;
(statearr_24563[(26)] = inst_24382);

return statearr_24563;
})();
if(cljs.core.truth_(inst_24383)){
var statearr_24564_24627 = state_24491__$1;
(statearr_24564_24627[(1)] = (13));

} else {
var statearr_24565_24628 = state_24491__$1;
(statearr_24565_24628[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (18))){
var inst_24416 = (state_24491[(2)]);
var state_24491__$1 = state_24491;
var statearr_24566_24629 = state_24491__$1;
(statearr_24566_24629[(2)] = inst_24416);

(statearr_24566_24629[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (42))){
var state_24491__$1 = state_24491;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_24491__$1,(45),dchan);
} else {
if((state_val_24492 === (37))){
var inst_24363 = (state_24491[(11)]);
var inst_24459 = (state_24491[(23)]);
var inst_24450 = (state_24491[(25)]);
var inst_24459__$1 = cljs.core.first.call(null,inst_24450);
var inst_24460 = cljs.core.async.put_BANG_.call(null,inst_24459__$1,inst_24363,done);
var state_24491__$1 = (function (){var statearr_24567 = state_24491;
(statearr_24567[(23)] = inst_24459__$1);

return statearr_24567;
})();
if(cljs.core.truth_(inst_24460)){
var statearr_24568_24630 = state_24491__$1;
(statearr_24568_24630[(1)] = (39));

} else {
var statearr_24569_24631 = state_24491__$1;
(statearr_24569_24631[(1)] = (40));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24492 === (8))){
var inst_24375 = (state_24491[(15)]);
var inst_24374 = (state_24491[(16)]);
var inst_24377 = (inst_24375 < inst_24374);
var inst_24378 = inst_24377;
var state_24491__$1 = state_24491;
if(cljs.core.truth_(inst_24378)){
var statearr_24570_24632 = state_24491__$1;
(statearr_24570_24632[(1)] = (10));

} else {
var statearr_24571_24633 = state_24491__$1;
(statearr_24571_24633[(1)] = (11));

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
});})(c__23272__auto___24579,cs,m,dchan,dctr,done))
;
return ((function (switch__23207__auto__,c__23272__auto___24579,cs,m,dchan,dctr,done){
return (function() {
var cljs$core$async$mult_$_state_machine__23208__auto__ = null;
var cljs$core$async$mult_$_state_machine__23208__auto____0 = (function (){
var statearr_24575 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_24575[(0)] = cljs$core$async$mult_$_state_machine__23208__auto__);

(statearr_24575[(1)] = (1));

return statearr_24575;
});
var cljs$core$async$mult_$_state_machine__23208__auto____1 = (function (state_24491){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_24491);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e24576){if((e24576 instanceof Object)){
var ex__23211__auto__ = e24576;
var statearr_24577_24634 = state_24491;
(statearr_24577_24634[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_24491);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e24576;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__24635 = state_24491;
state_24491 = G__24635;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$mult_$_state_machine__23208__auto__ = function(state_24491){
switch(arguments.length){
case 0:
return cljs$core$async$mult_$_state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$mult_$_state_machine__23208__auto____1.call(this,state_24491);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mult_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mult_$_state_machine__23208__auto____0;
cljs$core$async$mult_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mult_$_state_machine__23208__auto____1;
return cljs$core$async$mult_$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___24579,cs,m,dchan,dctr,done))
})();
var state__23274__auto__ = (function (){var statearr_24578 = f__23273__auto__.call(null);
(statearr_24578[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___24579);

return statearr_24578;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___24579,cs,m,dchan,dctr,done))
);


return m;
});
/**
 * Copies the mult source onto the supplied channel.
 * 
 *   By default the channel will be closed when the source closes,
 *   but can be determined by the close? parameter.
 */
cljs.core.async.tap = (function cljs$core$async$tap(var_args){
var args24636 = [];
var len__17790__auto___24639 = arguments.length;
var i__17791__auto___24640 = (0);
while(true){
if((i__17791__auto___24640 < len__17790__auto___24639)){
args24636.push((arguments[i__17791__auto___24640]));

var G__24641 = (i__17791__auto___24640 + (1));
i__17791__auto___24640 = G__24641;
continue;
} else {
}
break;
}

var G__24638 = args24636.length;
switch (G__24638) {
case 2:
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24636.length)].join('')));

}
});

cljs.core.async.tap.cljs$core$IFn$_invoke$arity$2 = (function (mult,ch){
return cljs.core.async.tap.call(null,mult,ch,true);
});

cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3 = (function (mult,ch,close_QMARK_){
cljs.core.async.tap_STAR_.call(null,mult,ch,close_QMARK_);

return ch;
});

cljs.core.async.tap.cljs$lang$maxFixedArity = 3;
/**
 * Disconnects a target channel from a mult
 */
cljs.core.async.untap = (function cljs$core$async$untap(mult,ch){
return cljs.core.async.untap_STAR_.call(null,mult,ch);
});
/**
 * Disconnects all target channels from a mult
 */
cljs.core.async.untap_all = (function cljs$core$async$untap_all(mult){
return cljs.core.async.untap_all_STAR_.call(null,mult);
});

/**
 * @interface
 */
cljs.core.async.Mix = function(){};

cljs.core.async.admix_STAR_ = (function cljs$core$async$admix_STAR_(m,ch){
if((!((m == null))) && (!((m.cljs$core$async$Mix$admix_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mix$admix_STAR_$arity$2(m,ch);
} else {
var x__17387__auto__ = (((m == null))?null:m);
var m__17388__auto__ = (cljs.core.async.admix_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,m,ch);
} else {
var m__17388__auto____$1 = (cljs.core.async.admix_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,m,ch);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.admix*",m);
}
}
}
});

cljs.core.async.unmix_STAR_ = (function cljs$core$async$unmix_STAR_(m,ch){
if((!((m == null))) && (!((m.cljs$core$async$Mix$unmix_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mix$unmix_STAR_$arity$2(m,ch);
} else {
var x__17387__auto__ = (((m == null))?null:m);
var m__17388__auto__ = (cljs.core.async.unmix_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,m,ch);
} else {
var m__17388__auto____$1 = (cljs.core.async.unmix_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,m,ch);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.unmix*",m);
}
}
}
});

cljs.core.async.unmix_all_STAR_ = (function cljs$core$async$unmix_all_STAR_(m){
if((!((m == null))) && (!((m.cljs$core$async$Mix$unmix_all_STAR_$arity$1 == null)))){
return m.cljs$core$async$Mix$unmix_all_STAR_$arity$1(m);
} else {
var x__17387__auto__ = (((m == null))?null:m);
var m__17388__auto__ = (cljs.core.async.unmix_all_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,m);
} else {
var m__17388__auto____$1 = (cljs.core.async.unmix_all_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,m);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.unmix-all*",m);
}
}
}
});

cljs.core.async.toggle_STAR_ = (function cljs$core$async$toggle_STAR_(m,state_map){
if((!((m == null))) && (!((m.cljs$core$async$Mix$toggle_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mix$toggle_STAR_$arity$2(m,state_map);
} else {
var x__17387__auto__ = (((m == null))?null:m);
var m__17388__auto__ = (cljs.core.async.toggle_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,m,state_map);
} else {
var m__17388__auto____$1 = (cljs.core.async.toggle_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,m,state_map);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.toggle*",m);
}
}
}
});

cljs.core.async.solo_mode_STAR_ = (function cljs$core$async$solo_mode_STAR_(m,mode){
if((!((m == null))) && (!((m.cljs$core$async$Mix$solo_mode_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mix$solo_mode_STAR_$arity$2(m,mode);
} else {
var x__17387__auto__ = (((m == null))?null:m);
var m__17388__auto__ = (cljs.core.async.solo_mode_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,m,mode);
} else {
var m__17388__auto____$1 = (cljs.core.async.solo_mode_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,m,mode);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.solo-mode*",m);
}
}
}
});

cljs.core.async.ioc_alts_BANG_ = (function cljs$core$async$ioc_alts_BANG_(var_args){
var args__17797__auto__ = [];
var len__17790__auto___24653 = arguments.length;
var i__17791__auto___24654 = (0);
while(true){
if((i__17791__auto___24654 < len__17790__auto___24653)){
args__17797__auto__.push((arguments[i__17791__auto___24654]));

var G__24655 = (i__17791__auto___24654 + (1));
i__17791__auto___24654 = G__24655;
continue;
} else {
}
break;
}

var argseq__17798__auto__ = ((((3) < args__17797__auto__.length))?(new cljs.core.IndexedSeq(args__17797__auto__.slice((3)),(0))):null);
return cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__17798__auto__);
});

cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (state,cont_block,ports,p__24647){
var map__24648 = p__24647;
var map__24648__$1 = ((((!((map__24648 == null)))?((((map__24648.cljs$lang$protocol_mask$partition0$ & (64))) || (map__24648.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__24648):map__24648);
var opts = map__24648__$1;
var statearr_24650_24656 = state;
(statearr_24650_24656[cljs.core.async.impl.ioc_helpers.STATE_IDX] = cont_block);


var temp__4425__auto__ = cljs.core.async.do_alts.call(null,((function (map__24648,map__24648__$1,opts){
return (function (val){
var statearr_24651_24657 = state;
(statearr_24651_24657[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = val);


return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state);
});})(map__24648,map__24648__$1,opts))
,ports,opts);
if(cljs.core.truth_(temp__4425__auto__)){
var cb = temp__4425__auto__;
var statearr_24652_24658 = state;
(statearr_24652_24658[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = cljs.core.deref.call(null,cb));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
});

cljs.core.async.ioc_alts_BANG_.cljs$lang$maxFixedArity = (3);

cljs.core.async.ioc_alts_BANG_.cljs$lang$applyTo = (function (seq24643){
var G__24644 = cljs.core.first.call(null,seq24643);
var seq24643__$1 = cljs.core.next.call(null,seq24643);
var G__24645 = cljs.core.first.call(null,seq24643__$1);
var seq24643__$2 = cljs.core.next.call(null,seq24643__$1);
var G__24646 = cljs.core.first.call(null,seq24643__$2);
var seq24643__$3 = cljs.core.next.call(null,seq24643__$2);
return cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic(G__24644,G__24645,G__24646,seq24643__$3);
});
/**
 * Creates and returns a mix of one or more input channels which will
 *   be put on the supplied out channel. Input sources can be added to
 *   the mix with 'admix', and removed with 'unmix'. A mix supports
 *   soloing, muting and pausing multiple inputs atomically using
 *   'toggle', and can solo using either muting or pausing as determined
 *   by 'solo-mode'.
 * 
 *   Each channel can have zero or more boolean modes set via 'toggle':
 * 
 *   :solo - when true, only this (ond other soloed) channel(s) will appear
 *        in the mix output channel. :mute and :pause states of soloed
 *        channels are ignored. If solo-mode is :mute, non-soloed
 *        channels are muted, if :pause, non-soloed channels are
 *        paused.
 * 
 *   :mute - muted channels will have their contents consumed but not included in the mix
 *   :pause - paused channels will not have their contents consumed (and thus also not included in the mix)
 */
cljs.core.async.mix = (function cljs$core$async$mix(out){
var cs = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var solo_modes = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"pause","pause",-2095325672),null,new cljs.core.Keyword(null,"mute","mute",1151223646),null], null), null);
var attrs = cljs.core.conj.call(null,solo_modes,new cljs.core.Keyword(null,"solo","solo",-316350075));
var solo_mode = cljs.core.atom.call(null,new cljs.core.Keyword(null,"mute","mute",1151223646));
var change = cljs.core.async.chan.call(null);
var changed = ((function (cs,solo_modes,attrs,solo_mode,change){
return (function (){
return cljs.core.async.put_BANG_.call(null,change,true);
});})(cs,solo_modes,attrs,solo_mode,change))
;
var pick = ((function (cs,solo_modes,attrs,solo_mode,change,changed){
return (function (attr,chs){
return cljs.core.reduce_kv.call(null,((function (cs,solo_modes,attrs,solo_mode,change,changed){
return (function (ret,c,v){
if(cljs.core.truth_(attr.call(null,v))){
return cljs.core.conj.call(null,ret,c);
} else {
return ret;
}
});})(cs,solo_modes,attrs,solo_mode,change,changed))
,cljs.core.PersistentHashSet.EMPTY,chs);
});})(cs,solo_modes,attrs,solo_mode,change,changed))
;
var calc_state = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick){
return (function (){
var chs = cljs.core.deref.call(null,cs);
var mode = cljs.core.deref.call(null,solo_mode);
var solos = pick.call(null,new cljs.core.Keyword(null,"solo","solo",-316350075),chs);
var pauses = pick.call(null,new cljs.core.Keyword(null,"pause","pause",-2095325672),chs);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"solos","solos",1441458643),solos,new cljs.core.Keyword(null,"mutes","mutes",1068806309),pick.call(null,new cljs.core.Keyword(null,"mute","mute",1151223646),chs),new cljs.core.Keyword(null,"reads","reads",-1215067361),cljs.core.conj.call(null,(((cljs.core._EQ_.call(null,mode,new cljs.core.Keyword(null,"pause","pause",-2095325672))) && (!(cljs.core.empty_QMARK_.call(null,solos))))?cljs.core.vec.call(null,solos):cljs.core.vec.call(null,cljs.core.remove.call(null,pauses,cljs.core.keys.call(null,chs)))),change)], null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick))
;
var m = (function (){
if(typeof cljs.core.async.t_cljs$core$async24822 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mix}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async24822 = (function (change,mix,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta24823){
this.change = change;
this.mix = mix;
this.solo_mode = solo_mode;
this.pick = pick;
this.cs = cs;
this.calc_state = calc_state;
this.out = out;
this.changed = changed;
this.solo_modes = solo_modes;
this.attrs = attrs;
this.meta24823 = meta24823;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_24824,meta24823__$1){
var self__ = this;
var _24824__$1 = this;
return (new cljs.core.async.t_cljs$core$async24822(self__.change,self__.mix,self__.solo_mode,self__.pick,self__.cs,self__.calc_state,self__.out,self__.changed,self__.solo_modes,self__.attrs,meta24823__$1));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_24824){
var self__ = this;
var _24824__$1 = this;
return self__.meta24823;
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$async$Mux$ = true;

cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.out;
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$async$Mix$ = true;

cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$async$Mix$admix_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.assoc,ch,cljs.core.PersistentArrayMap.EMPTY);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$async$Mix$unmix_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.dissoc,ch);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$async$Mix$unmix_all_STAR_$arity$1 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_.call(null,self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$async$Mix$toggle_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,state_map){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.partial.call(null,cljs.core.merge_with,cljs.core.merge),state_map);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24822.prototype.cljs$core$async$Mix$solo_mode_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,mode){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(self__.solo_modes.call(null,mode))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str([cljs.core.str("mode must be one of: "),cljs.core.str(self__.solo_modes)].join('')),cljs.core.str("\n"),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.list(new cljs.core.Symbol(null,"solo-modes","solo-modes",882180540,null),new cljs.core.Symbol(null,"mode","mode",-2000032078,null))))].join('')));
}

cljs.core.reset_BANG_.call(null,self__.solo_mode,mode);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24822.getBasis = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (){
return new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"change","change",477485025,null),cljs.core.with_meta(new cljs.core.Symbol(null,"mix","mix",2121373763,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"out","out",729986010,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Creates and returns a mix of one or more input channels which will\n  be put on the supplied out channel. Input sources can be added to\n  the mix with 'admix', and removed with 'unmix'. A mix supports\n  soloing, muting and pausing multiple inputs atomically using\n  'toggle', and can solo using either muting or pausing as determined\n  by 'solo-mode'.\n\n  Each channel can have zero or more boolean modes set via 'toggle':\n\n  :solo - when true, only this (ond other soloed) channel(s) will appear\n          in the mix output channel. :mute and :pause states of soloed\n          channels are ignored. If solo-mode is :mute, non-soloed\n          channels are muted, if :pause, non-soloed channels are\n          paused.\n\n  :mute - muted channels will have their contents consumed but not included in the mix\n  :pause - paused channels will not have their contents consumed (and thus also not included in the mix)\n"], null)),new cljs.core.Symbol(null,"solo-mode","solo-mode",2031788074,null),new cljs.core.Symbol(null,"pick","pick",1300068175,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"calc-state","calc-state",-349968968,null),new cljs.core.Symbol(null,"out","out",729986010,null),new cljs.core.Symbol(null,"changed","changed",-2083710852,null),new cljs.core.Symbol(null,"solo-modes","solo-modes",882180540,null),new cljs.core.Symbol(null,"attrs","attrs",-450137186,null),new cljs.core.Symbol(null,"meta24823","meta24823",-710460545,null)], null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24822.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async24822.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async24822";

cljs.core.async.t_cljs$core$async24822.cljs$lang$ctorPrWriter = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async24822");
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.__GT_t_cljs$core$async24822 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function cljs$core$async$mix_$___GT_t_cljs$core$async24822(change__$1,mix__$1,solo_mode__$1,pick__$1,cs__$1,calc_state__$1,out__$1,changed__$1,solo_modes__$1,attrs__$1,meta24823){
return (new cljs.core.async.t_cljs$core$async24822(change__$1,mix__$1,solo_mode__$1,pick__$1,cs__$1,calc_state__$1,out__$1,changed__$1,solo_modes__$1,attrs__$1,meta24823));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

}

return (new cljs.core.async.t_cljs$core$async24822(change,cljs$core$async$mix,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,cljs.core.PersistentArrayMap.EMPTY));
})()
;
var c__23272__auto___24985 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___24985,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___24985,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m){
return (function (state_24922){
var state_val_24923 = (state_24922[(1)]);
if((state_val_24923 === (7))){
var inst_24840 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
var statearr_24924_24986 = state_24922__$1;
(statearr_24924_24986[(2)] = inst_24840);

(statearr_24924_24986[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (20))){
var inst_24852 = (state_24922[(7)]);
var state_24922__$1 = state_24922;
var statearr_24925_24987 = state_24922__$1;
(statearr_24925_24987[(2)] = inst_24852);

(statearr_24925_24987[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (27))){
var state_24922__$1 = state_24922;
var statearr_24926_24988 = state_24922__$1;
(statearr_24926_24988[(2)] = null);

(statearr_24926_24988[(1)] = (28));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (1))){
var inst_24828 = (state_24922[(8)]);
var inst_24828__$1 = calc_state.call(null);
var inst_24830 = (inst_24828__$1 == null);
var inst_24831 = cljs.core.not.call(null,inst_24830);
var state_24922__$1 = (function (){var statearr_24927 = state_24922;
(statearr_24927[(8)] = inst_24828__$1);

return statearr_24927;
})();
if(inst_24831){
var statearr_24928_24989 = state_24922__$1;
(statearr_24928_24989[(1)] = (2));

} else {
var statearr_24929_24990 = state_24922__$1;
(statearr_24929_24990[(1)] = (3));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (24))){
var inst_24882 = (state_24922[(9)]);
var inst_24896 = (state_24922[(10)]);
var inst_24875 = (state_24922[(11)]);
var inst_24896__$1 = inst_24875.call(null,inst_24882);
var state_24922__$1 = (function (){var statearr_24930 = state_24922;
(statearr_24930[(10)] = inst_24896__$1);

return statearr_24930;
})();
if(cljs.core.truth_(inst_24896__$1)){
var statearr_24931_24991 = state_24922__$1;
(statearr_24931_24991[(1)] = (29));

} else {
var statearr_24932_24992 = state_24922__$1;
(statearr_24932_24992[(1)] = (30));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (4))){
var inst_24843 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
if(cljs.core.truth_(inst_24843)){
var statearr_24933_24993 = state_24922__$1;
(statearr_24933_24993[(1)] = (8));

} else {
var statearr_24934_24994 = state_24922__$1;
(statearr_24934_24994[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (15))){
var inst_24869 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
if(cljs.core.truth_(inst_24869)){
var statearr_24935_24995 = state_24922__$1;
(statearr_24935_24995[(1)] = (19));

} else {
var statearr_24936_24996 = state_24922__$1;
(statearr_24936_24996[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (21))){
var inst_24874 = (state_24922[(12)]);
var inst_24874__$1 = (state_24922[(2)]);
var inst_24875 = cljs.core.get.call(null,inst_24874__$1,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_24876 = cljs.core.get.call(null,inst_24874__$1,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_24877 = cljs.core.get.call(null,inst_24874__$1,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var state_24922__$1 = (function (){var statearr_24937 = state_24922;
(statearr_24937[(13)] = inst_24876);

(statearr_24937[(12)] = inst_24874__$1);

(statearr_24937[(11)] = inst_24875);

return statearr_24937;
})();
return cljs.core.async.ioc_alts_BANG_.call(null,state_24922__$1,(22),inst_24877);
} else {
if((state_val_24923 === (31))){
var inst_24904 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
if(cljs.core.truth_(inst_24904)){
var statearr_24938_24997 = state_24922__$1;
(statearr_24938_24997[(1)] = (32));

} else {
var statearr_24939_24998 = state_24922__$1;
(statearr_24939_24998[(1)] = (33));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (32))){
var inst_24881 = (state_24922[(14)]);
var state_24922__$1 = state_24922;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_24922__$1,(35),out,inst_24881);
} else {
if((state_val_24923 === (33))){
var inst_24874 = (state_24922[(12)]);
var inst_24852 = inst_24874;
var state_24922__$1 = (function (){var statearr_24940 = state_24922;
(statearr_24940[(7)] = inst_24852);

return statearr_24940;
})();
var statearr_24941_24999 = state_24922__$1;
(statearr_24941_24999[(2)] = null);

(statearr_24941_24999[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (13))){
var inst_24852 = (state_24922[(7)]);
var inst_24859 = inst_24852.cljs$lang$protocol_mask$partition0$;
var inst_24860 = (inst_24859 & (64));
var inst_24861 = inst_24852.cljs$core$ISeq$;
var inst_24862 = (inst_24860) || (inst_24861);
var state_24922__$1 = state_24922;
if(cljs.core.truth_(inst_24862)){
var statearr_24942_25000 = state_24922__$1;
(statearr_24942_25000[(1)] = (16));

} else {
var statearr_24943_25001 = state_24922__$1;
(statearr_24943_25001[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (22))){
var inst_24882 = (state_24922[(9)]);
var inst_24881 = (state_24922[(14)]);
var inst_24880 = (state_24922[(2)]);
var inst_24881__$1 = cljs.core.nth.call(null,inst_24880,(0),null);
var inst_24882__$1 = cljs.core.nth.call(null,inst_24880,(1),null);
var inst_24883 = (inst_24881__$1 == null);
var inst_24884 = cljs.core._EQ_.call(null,inst_24882__$1,change);
var inst_24885 = (inst_24883) || (inst_24884);
var state_24922__$1 = (function (){var statearr_24944 = state_24922;
(statearr_24944[(9)] = inst_24882__$1);

(statearr_24944[(14)] = inst_24881__$1);

return statearr_24944;
})();
if(cljs.core.truth_(inst_24885)){
var statearr_24945_25002 = state_24922__$1;
(statearr_24945_25002[(1)] = (23));

} else {
var statearr_24946_25003 = state_24922__$1;
(statearr_24946_25003[(1)] = (24));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (36))){
var inst_24874 = (state_24922[(12)]);
var inst_24852 = inst_24874;
var state_24922__$1 = (function (){var statearr_24947 = state_24922;
(statearr_24947[(7)] = inst_24852);

return statearr_24947;
})();
var statearr_24948_25004 = state_24922__$1;
(statearr_24948_25004[(2)] = null);

(statearr_24948_25004[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (29))){
var inst_24896 = (state_24922[(10)]);
var state_24922__$1 = state_24922;
var statearr_24949_25005 = state_24922__$1;
(statearr_24949_25005[(2)] = inst_24896);

(statearr_24949_25005[(1)] = (31));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (6))){
var state_24922__$1 = state_24922;
var statearr_24950_25006 = state_24922__$1;
(statearr_24950_25006[(2)] = false);

(statearr_24950_25006[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (28))){
var inst_24892 = (state_24922[(2)]);
var inst_24893 = calc_state.call(null);
var inst_24852 = inst_24893;
var state_24922__$1 = (function (){var statearr_24951 = state_24922;
(statearr_24951[(15)] = inst_24892);

(statearr_24951[(7)] = inst_24852);

return statearr_24951;
})();
var statearr_24952_25007 = state_24922__$1;
(statearr_24952_25007[(2)] = null);

(statearr_24952_25007[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (25))){
var inst_24918 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
var statearr_24953_25008 = state_24922__$1;
(statearr_24953_25008[(2)] = inst_24918);

(statearr_24953_25008[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (34))){
var inst_24916 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
var statearr_24954_25009 = state_24922__$1;
(statearr_24954_25009[(2)] = inst_24916);

(statearr_24954_25009[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (17))){
var state_24922__$1 = state_24922;
var statearr_24955_25010 = state_24922__$1;
(statearr_24955_25010[(2)] = false);

(statearr_24955_25010[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (3))){
var state_24922__$1 = state_24922;
var statearr_24956_25011 = state_24922__$1;
(statearr_24956_25011[(2)] = false);

(statearr_24956_25011[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (12))){
var inst_24920 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_24922__$1,inst_24920);
} else {
if((state_val_24923 === (2))){
var inst_24828 = (state_24922[(8)]);
var inst_24833 = inst_24828.cljs$lang$protocol_mask$partition0$;
var inst_24834 = (inst_24833 & (64));
var inst_24835 = inst_24828.cljs$core$ISeq$;
var inst_24836 = (inst_24834) || (inst_24835);
var state_24922__$1 = state_24922;
if(cljs.core.truth_(inst_24836)){
var statearr_24957_25012 = state_24922__$1;
(statearr_24957_25012[(1)] = (5));

} else {
var statearr_24958_25013 = state_24922__$1;
(statearr_24958_25013[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (23))){
var inst_24881 = (state_24922[(14)]);
var inst_24887 = (inst_24881 == null);
var state_24922__$1 = state_24922;
if(cljs.core.truth_(inst_24887)){
var statearr_24959_25014 = state_24922__$1;
(statearr_24959_25014[(1)] = (26));

} else {
var statearr_24960_25015 = state_24922__$1;
(statearr_24960_25015[(1)] = (27));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (35))){
var inst_24907 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
if(cljs.core.truth_(inst_24907)){
var statearr_24961_25016 = state_24922__$1;
(statearr_24961_25016[(1)] = (36));

} else {
var statearr_24962_25017 = state_24922__$1;
(statearr_24962_25017[(1)] = (37));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (19))){
var inst_24852 = (state_24922[(7)]);
var inst_24871 = cljs.core.apply.call(null,cljs.core.hash_map,inst_24852);
var state_24922__$1 = state_24922;
var statearr_24963_25018 = state_24922__$1;
(statearr_24963_25018[(2)] = inst_24871);

(statearr_24963_25018[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (11))){
var inst_24852 = (state_24922[(7)]);
var inst_24856 = (inst_24852 == null);
var inst_24857 = cljs.core.not.call(null,inst_24856);
var state_24922__$1 = state_24922;
if(inst_24857){
var statearr_24964_25019 = state_24922__$1;
(statearr_24964_25019[(1)] = (13));

} else {
var statearr_24965_25020 = state_24922__$1;
(statearr_24965_25020[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (9))){
var inst_24828 = (state_24922[(8)]);
var state_24922__$1 = state_24922;
var statearr_24966_25021 = state_24922__$1;
(statearr_24966_25021[(2)] = inst_24828);

(statearr_24966_25021[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (5))){
var state_24922__$1 = state_24922;
var statearr_24967_25022 = state_24922__$1;
(statearr_24967_25022[(2)] = true);

(statearr_24967_25022[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (14))){
var state_24922__$1 = state_24922;
var statearr_24968_25023 = state_24922__$1;
(statearr_24968_25023[(2)] = false);

(statearr_24968_25023[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (26))){
var inst_24882 = (state_24922[(9)]);
var inst_24889 = cljs.core.swap_BANG_.call(null,cs,cljs.core.dissoc,inst_24882);
var state_24922__$1 = state_24922;
var statearr_24969_25024 = state_24922__$1;
(statearr_24969_25024[(2)] = inst_24889);

(statearr_24969_25024[(1)] = (28));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (16))){
var state_24922__$1 = state_24922;
var statearr_24970_25025 = state_24922__$1;
(statearr_24970_25025[(2)] = true);

(statearr_24970_25025[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (38))){
var inst_24912 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
var statearr_24971_25026 = state_24922__$1;
(statearr_24971_25026[(2)] = inst_24912);

(statearr_24971_25026[(1)] = (34));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (30))){
var inst_24882 = (state_24922[(9)]);
var inst_24876 = (state_24922[(13)]);
var inst_24875 = (state_24922[(11)]);
var inst_24899 = cljs.core.empty_QMARK_.call(null,inst_24875);
var inst_24900 = inst_24876.call(null,inst_24882);
var inst_24901 = cljs.core.not.call(null,inst_24900);
var inst_24902 = (inst_24899) && (inst_24901);
var state_24922__$1 = state_24922;
var statearr_24972_25027 = state_24922__$1;
(statearr_24972_25027[(2)] = inst_24902);

(statearr_24972_25027[(1)] = (31));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (10))){
var inst_24828 = (state_24922[(8)]);
var inst_24848 = (state_24922[(2)]);
var inst_24849 = cljs.core.get.call(null,inst_24848,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_24850 = cljs.core.get.call(null,inst_24848,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_24851 = cljs.core.get.call(null,inst_24848,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var inst_24852 = inst_24828;
var state_24922__$1 = (function (){var statearr_24973 = state_24922;
(statearr_24973[(16)] = inst_24851);

(statearr_24973[(17)] = inst_24849);

(statearr_24973[(18)] = inst_24850);

(statearr_24973[(7)] = inst_24852);

return statearr_24973;
})();
var statearr_24974_25028 = state_24922__$1;
(statearr_24974_25028[(2)] = null);

(statearr_24974_25028[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (18))){
var inst_24866 = (state_24922[(2)]);
var state_24922__$1 = state_24922;
var statearr_24975_25029 = state_24922__$1;
(statearr_24975_25029[(2)] = inst_24866);

(statearr_24975_25029[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (37))){
var state_24922__$1 = state_24922;
var statearr_24976_25030 = state_24922__$1;
(statearr_24976_25030[(2)] = null);

(statearr_24976_25030[(1)] = (38));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_24923 === (8))){
var inst_24828 = (state_24922[(8)]);
var inst_24845 = cljs.core.apply.call(null,cljs.core.hash_map,inst_24828);
var state_24922__$1 = state_24922;
var statearr_24977_25031 = state_24922__$1;
(statearr_24977_25031[(2)] = inst_24845);

(statearr_24977_25031[(1)] = (10));


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
});})(c__23272__auto___24985,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m))
;
return ((function (switch__23207__auto__,c__23272__auto___24985,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m){
return (function() {
var cljs$core$async$mix_$_state_machine__23208__auto__ = null;
var cljs$core$async$mix_$_state_machine__23208__auto____0 = (function (){
var statearr_24981 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_24981[(0)] = cljs$core$async$mix_$_state_machine__23208__auto__);

(statearr_24981[(1)] = (1));

return statearr_24981;
});
var cljs$core$async$mix_$_state_machine__23208__auto____1 = (function (state_24922){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_24922);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e24982){if((e24982 instanceof Object)){
var ex__23211__auto__ = e24982;
var statearr_24983_25032 = state_24922;
(statearr_24983_25032[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_24922);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e24982;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__25033 = state_24922;
state_24922 = G__25033;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$mix_$_state_machine__23208__auto__ = function(state_24922){
switch(arguments.length){
case 0:
return cljs$core$async$mix_$_state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$mix_$_state_machine__23208__auto____1.call(this,state_24922);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mix_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mix_$_state_machine__23208__auto____0;
cljs$core$async$mix_$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mix_$_state_machine__23208__auto____1;
return cljs$core$async$mix_$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___24985,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m))
})();
var state__23274__auto__ = (function (){var statearr_24984 = f__23273__auto__.call(null);
(statearr_24984[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___24985);

return statearr_24984;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___24985,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m))
);


return m;
});
/**
 * Adds ch as an input to the mix
 */
cljs.core.async.admix = (function cljs$core$async$admix(mix,ch){
return cljs.core.async.admix_STAR_.call(null,mix,ch);
});
/**
 * Removes ch as an input to the mix
 */
cljs.core.async.unmix = (function cljs$core$async$unmix(mix,ch){
return cljs.core.async.unmix_STAR_.call(null,mix,ch);
});
/**
 * removes all inputs from the mix
 */
cljs.core.async.unmix_all = (function cljs$core$async$unmix_all(mix){
return cljs.core.async.unmix_all_STAR_.call(null,mix);
});
/**
 * Atomically sets the state(s) of one or more channels in a mix. The
 *   state map is a map of channels -> channel-state-map. A
 *   channel-state-map is a map of attrs -> boolean, where attr is one or
 *   more of :mute, :pause or :solo. Any states supplied are merged with
 *   the current state.
 * 
 *   Note that channels can be added to a mix via toggle, which can be
 *   used to add channels in a particular (e.g. paused) state.
 */
cljs.core.async.toggle = (function cljs$core$async$toggle(mix,state_map){
return cljs.core.async.toggle_STAR_.call(null,mix,state_map);
});
/**
 * Sets the solo mode of the mix. mode must be one of :mute or :pause
 */
cljs.core.async.solo_mode = (function cljs$core$async$solo_mode(mix,mode){
return cljs.core.async.solo_mode_STAR_.call(null,mix,mode);
});

/**
 * @interface
 */
cljs.core.async.Pub = function(){};

cljs.core.async.sub_STAR_ = (function cljs$core$async$sub_STAR_(p,v,ch,close_QMARK_){
if((!((p == null))) && (!((p.cljs$core$async$Pub$sub_STAR_$arity$4 == null)))){
return p.cljs$core$async$Pub$sub_STAR_$arity$4(p,v,ch,close_QMARK_);
} else {
var x__17387__auto__ = (((p == null))?null:p);
var m__17388__auto__ = (cljs.core.async.sub_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,p,v,ch,close_QMARK_);
} else {
var m__17388__auto____$1 = (cljs.core.async.sub_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,p,v,ch,close_QMARK_);
} else {
throw cljs.core.missing_protocol.call(null,"Pub.sub*",p);
}
}
}
});

cljs.core.async.unsub_STAR_ = (function cljs$core$async$unsub_STAR_(p,v,ch){
if((!((p == null))) && (!((p.cljs$core$async$Pub$unsub_STAR_$arity$3 == null)))){
return p.cljs$core$async$Pub$unsub_STAR_$arity$3(p,v,ch);
} else {
var x__17387__auto__ = (((p == null))?null:p);
var m__17388__auto__ = (cljs.core.async.unsub_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,p,v,ch);
} else {
var m__17388__auto____$1 = (cljs.core.async.unsub_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,p,v,ch);
} else {
throw cljs.core.missing_protocol.call(null,"Pub.unsub*",p);
}
}
}
});

cljs.core.async.unsub_all_STAR_ = (function cljs$core$async$unsub_all_STAR_(var_args){
var args25034 = [];
var len__17790__auto___25037 = arguments.length;
var i__17791__auto___25038 = (0);
while(true){
if((i__17791__auto___25038 < len__17790__auto___25037)){
args25034.push((arguments[i__17791__auto___25038]));

var G__25039 = (i__17791__auto___25038 + (1));
i__17791__auto___25038 = G__25039;
continue;
} else {
}
break;
}

var G__25036 = args25034.length;
switch (G__25036) {
case 1:
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25034.length)].join('')));

}
});

cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$1 = (function (p){
if((!((p == null))) && (!((p.cljs$core$async$Pub$unsub_all_STAR_$arity$1 == null)))){
return p.cljs$core$async$Pub$unsub_all_STAR_$arity$1(p);
} else {
var x__17387__auto__ = (((p == null))?null:p);
var m__17388__auto__ = (cljs.core.async.unsub_all_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,p);
} else {
var m__17388__auto____$1 = (cljs.core.async.unsub_all_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,p);
} else {
throw cljs.core.missing_protocol.call(null,"Pub.unsub-all*",p);
}
}
}
});

cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2 = (function (p,v){
if((!((p == null))) && (!((p.cljs$core$async$Pub$unsub_all_STAR_$arity$2 == null)))){
return p.cljs$core$async$Pub$unsub_all_STAR_$arity$2(p,v);
} else {
var x__17387__auto__ = (((p == null))?null:p);
var m__17388__auto__ = (cljs.core.async.unsub_all_STAR_[goog.typeOf(x__17387__auto__)]);
if(!((m__17388__auto__ == null))){
return m__17388__auto__.call(null,p,v);
} else {
var m__17388__auto____$1 = (cljs.core.async.unsub_all_STAR_["_"]);
if(!((m__17388__auto____$1 == null))){
return m__17388__auto____$1.call(null,p,v);
} else {
throw cljs.core.missing_protocol.call(null,"Pub.unsub-all*",p);
}
}
}
});

cljs.core.async.unsub_all_STAR_.cljs$lang$maxFixedArity = 2;

/**
 * Creates and returns a pub(lication) of the supplied channel,
 *   partitioned into topics by the topic-fn. topic-fn will be applied to
 *   each value on the channel and the result will determine the 'topic'
 *   on which that value will be put. Channels can be subscribed to
 *   receive copies of topics using 'sub', and unsubscribed using
 *   'unsub'. Each topic will be handled by an internal mult on a
 *   dedicated channel. By default these internal channels are
 *   unbuffered, but a buf-fn can be supplied which, given a topic,
 *   creates a buffer with desired properties.
 * 
 *   Each item is distributed to all subs in parallel and synchronously,
 *   i.e. each sub must accept before the next item is distributed. Use
 *   buffering/windowing to prevent slow subs from holding up the pub.
 * 
 *   Items received when there are no matching subs get dropped.
 * 
 *   Note that if buf-fns are used then each topic is handled
 *   asynchronously, i.e. if a channel is subscribed to more than one
 *   topic it should not expect them to be interleaved identically with
 *   the source.
 */
cljs.core.async.pub = (function cljs$core$async$pub(var_args){
var args25042 = [];
var len__17790__auto___25167 = arguments.length;
var i__17791__auto___25168 = (0);
while(true){
if((i__17791__auto___25168 < len__17790__auto___25167)){
args25042.push((arguments[i__17791__auto___25168]));

var G__25169 = (i__17791__auto___25168 + (1));
i__17791__auto___25168 = G__25169;
continue;
} else {
}
break;
}

var G__25044 = args25042.length;
switch (G__25044) {
case 2:
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25042.length)].join('')));

}
});

cljs.core.async.pub.cljs$core$IFn$_invoke$arity$2 = (function (ch,topic_fn){
return cljs.core.async.pub.call(null,ch,topic_fn,cljs.core.constantly.call(null,null));
});

cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3 = (function (ch,topic_fn,buf_fn){
var mults = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var ensure_mult = ((function (mults){
return (function (topic){
var or__16732__auto__ = cljs.core.get.call(null,cljs.core.deref.call(null,mults),topic);
if(cljs.core.truth_(or__16732__auto__)){
return or__16732__auto__;
} else {
return cljs.core.get.call(null,cljs.core.swap_BANG_.call(null,mults,((function (or__16732__auto__,mults){
return (function (p1__25041_SHARP_){
if(cljs.core.truth_(p1__25041_SHARP_.call(null,topic))){
return p1__25041_SHARP_;
} else {
return cljs.core.assoc.call(null,p1__25041_SHARP_,topic,cljs.core.async.mult.call(null,cljs.core.async.chan.call(null,buf_fn.call(null,topic))));
}
});})(or__16732__auto__,mults))
),topic);
}
});})(mults))
;
var p = (function (){
if(typeof cljs.core.async.t_cljs$core$async25045 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.Pub}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async25045 = (function (ch,topic_fn,buf_fn,mults,ensure_mult,meta25046){
this.ch = ch;
this.topic_fn = topic_fn;
this.buf_fn = buf_fn;
this.mults = mults;
this.ensure_mult = ensure_mult;
this.meta25046 = meta25046;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async25045.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (mults,ensure_mult){
return (function (_25047,meta25046__$1){
var self__ = this;
var _25047__$1 = this;
return (new cljs.core.async.t_cljs$core$async25045(self__.ch,self__.topic_fn,self__.buf_fn,self__.mults,self__.ensure_mult,meta25046__$1));
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async25045.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (mults,ensure_mult){
return (function (_25047){
var self__ = this;
var _25047__$1 = this;
return self__.meta25046;
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async25045.prototype.cljs$core$async$Mux$ = true;

cljs.core.async.t_cljs$core$async25045.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = ((function (mults,ensure_mult){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async25045.prototype.cljs$core$async$Pub$ = true;

cljs.core.async.t_cljs$core$async25045.prototype.cljs$core$async$Pub$sub_STAR_$arity$4 = ((function (mults,ensure_mult){
return (function (p,topic,ch__$1,close_QMARK_){
var self__ = this;
var p__$1 = this;
var m = self__.ensure_mult.call(null,topic);
return cljs.core.async.tap.call(null,m,ch__$1,close_QMARK_);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async25045.prototype.cljs$core$async$Pub$unsub_STAR_$arity$3 = ((function (mults,ensure_mult){
return (function (p,topic,ch__$1){
var self__ = this;
var p__$1 = this;
var temp__4425__auto__ = cljs.core.get.call(null,cljs.core.deref.call(null,self__.mults),topic);
if(cljs.core.truth_(temp__4425__auto__)){
var m = temp__4425__auto__;
return cljs.core.async.untap.call(null,m,ch__$1);
} else {
return null;
}
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async25045.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$1 = ((function (mults,ensure_mult){
return (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.reset_BANG_.call(null,self__.mults,cljs.core.PersistentArrayMap.EMPTY);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async25045.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$2 = ((function (mults,ensure_mult){
return (function (_,topic){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.call(null,self__.mults,cljs.core.dissoc,topic);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async25045.getBasis = ((function (mults,ensure_mult){
return (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"topic-fn","topic-fn",-862449736,null),new cljs.core.Symbol(null,"buf-fn","buf-fn",-1200281591,null),new cljs.core.Symbol(null,"mults","mults",-461114485,null),new cljs.core.Symbol(null,"ensure-mult","ensure-mult",1796584816,null),new cljs.core.Symbol(null,"meta25046","meta25046",4552774,null)], null);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async25045.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async25045.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async25045";

cljs.core.async.t_cljs$core$async25045.cljs$lang$ctorPrWriter = ((function (mults,ensure_mult){
return (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async25045");
});})(mults,ensure_mult))
;

cljs.core.async.__GT_t_cljs$core$async25045 = ((function (mults,ensure_mult){
return (function cljs$core$async$__GT_t_cljs$core$async25045(ch__$1,topic_fn__$1,buf_fn__$1,mults__$1,ensure_mult__$1,meta25046){
return (new cljs.core.async.t_cljs$core$async25045(ch__$1,topic_fn__$1,buf_fn__$1,mults__$1,ensure_mult__$1,meta25046));
});})(mults,ensure_mult))
;

}

return (new cljs.core.async.t_cljs$core$async25045(ch,topic_fn,buf_fn,mults,ensure_mult,cljs.core.PersistentArrayMap.EMPTY));
})()
;
var c__23272__auto___25171 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___25171,mults,ensure_mult,p){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___25171,mults,ensure_mult,p){
return (function (state_25119){
var state_val_25120 = (state_25119[(1)]);
if((state_val_25120 === (7))){
var inst_25115 = (state_25119[(2)]);
var state_25119__$1 = state_25119;
var statearr_25121_25172 = state_25119__$1;
(statearr_25121_25172[(2)] = inst_25115);

(statearr_25121_25172[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (20))){
var state_25119__$1 = state_25119;
var statearr_25122_25173 = state_25119__$1;
(statearr_25122_25173[(2)] = null);

(statearr_25122_25173[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (1))){
var state_25119__$1 = state_25119;
var statearr_25123_25174 = state_25119__$1;
(statearr_25123_25174[(2)] = null);

(statearr_25123_25174[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (24))){
var inst_25098 = (state_25119[(7)]);
var inst_25107 = cljs.core.swap_BANG_.call(null,mults,cljs.core.dissoc,inst_25098);
var state_25119__$1 = state_25119;
var statearr_25124_25175 = state_25119__$1;
(statearr_25124_25175[(2)] = inst_25107);

(statearr_25124_25175[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (4))){
var inst_25050 = (state_25119[(8)]);
var inst_25050__$1 = (state_25119[(2)]);
var inst_25051 = (inst_25050__$1 == null);
var state_25119__$1 = (function (){var statearr_25125 = state_25119;
(statearr_25125[(8)] = inst_25050__$1);

return statearr_25125;
})();
if(cljs.core.truth_(inst_25051)){
var statearr_25126_25176 = state_25119__$1;
(statearr_25126_25176[(1)] = (5));

} else {
var statearr_25127_25177 = state_25119__$1;
(statearr_25127_25177[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (15))){
var inst_25092 = (state_25119[(2)]);
var state_25119__$1 = state_25119;
var statearr_25128_25178 = state_25119__$1;
(statearr_25128_25178[(2)] = inst_25092);

(statearr_25128_25178[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (21))){
var inst_25112 = (state_25119[(2)]);
var state_25119__$1 = (function (){var statearr_25129 = state_25119;
(statearr_25129[(9)] = inst_25112);

return statearr_25129;
})();
var statearr_25130_25179 = state_25119__$1;
(statearr_25130_25179[(2)] = null);

(statearr_25130_25179[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (13))){
var inst_25074 = (state_25119[(10)]);
var inst_25076 = cljs.core.chunked_seq_QMARK_.call(null,inst_25074);
var state_25119__$1 = state_25119;
if(inst_25076){
var statearr_25131_25180 = state_25119__$1;
(statearr_25131_25180[(1)] = (16));

} else {
var statearr_25132_25181 = state_25119__$1;
(statearr_25132_25181[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (22))){
var inst_25104 = (state_25119[(2)]);
var state_25119__$1 = state_25119;
if(cljs.core.truth_(inst_25104)){
var statearr_25133_25182 = state_25119__$1;
(statearr_25133_25182[(1)] = (23));

} else {
var statearr_25134_25183 = state_25119__$1;
(statearr_25134_25183[(1)] = (24));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (6))){
var inst_25100 = (state_25119[(11)]);
var inst_25098 = (state_25119[(7)]);
var inst_25050 = (state_25119[(8)]);
var inst_25098__$1 = topic_fn.call(null,inst_25050);
var inst_25099 = cljs.core.deref.call(null,mults);
var inst_25100__$1 = cljs.core.get.call(null,inst_25099,inst_25098__$1);
var state_25119__$1 = (function (){var statearr_25135 = state_25119;
(statearr_25135[(11)] = inst_25100__$1);

(statearr_25135[(7)] = inst_25098__$1);

return statearr_25135;
})();
if(cljs.core.truth_(inst_25100__$1)){
var statearr_25136_25184 = state_25119__$1;
(statearr_25136_25184[(1)] = (19));

} else {
var statearr_25137_25185 = state_25119__$1;
(statearr_25137_25185[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (25))){
var inst_25109 = (state_25119[(2)]);
var state_25119__$1 = state_25119;
var statearr_25138_25186 = state_25119__$1;
(statearr_25138_25186[(2)] = inst_25109);

(statearr_25138_25186[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (17))){
var inst_25074 = (state_25119[(10)]);
var inst_25083 = cljs.core.first.call(null,inst_25074);
var inst_25084 = cljs.core.async.muxch_STAR_.call(null,inst_25083);
var inst_25085 = cljs.core.async.close_BANG_.call(null,inst_25084);
var inst_25086 = cljs.core.next.call(null,inst_25074);
var inst_25060 = inst_25086;
var inst_25061 = null;
var inst_25062 = (0);
var inst_25063 = (0);
var state_25119__$1 = (function (){var statearr_25139 = state_25119;
(statearr_25139[(12)] = inst_25085);

(statearr_25139[(13)] = inst_25063);

(statearr_25139[(14)] = inst_25060);

(statearr_25139[(15)] = inst_25062);

(statearr_25139[(16)] = inst_25061);

return statearr_25139;
})();
var statearr_25140_25187 = state_25119__$1;
(statearr_25140_25187[(2)] = null);

(statearr_25140_25187[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (3))){
var inst_25117 = (state_25119[(2)]);
var state_25119__$1 = state_25119;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_25119__$1,inst_25117);
} else {
if((state_val_25120 === (12))){
var inst_25094 = (state_25119[(2)]);
var state_25119__$1 = state_25119;
var statearr_25141_25188 = state_25119__$1;
(statearr_25141_25188[(2)] = inst_25094);

(statearr_25141_25188[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (2))){
var state_25119__$1 = state_25119;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_25119__$1,(4),ch);
} else {
if((state_val_25120 === (23))){
var state_25119__$1 = state_25119;
var statearr_25142_25189 = state_25119__$1;
(statearr_25142_25189[(2)] = null);

(statearr_25142_25189[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (19))){
var inst_25100 = (state_25119[(11)]);
var inst_25050 = (state_25119[(8)]);
var inst_25102 = cljs.core.async.muxch_STAR_.call(null,inst_25100);
var state_25119__$1 = state_25119;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25119__$1,(22),inst_25102,inst_25050);
} else {
if((state_val_25120 === (11))){
var inst_25074 = (state_25119[(10)]);
var inst_25060 = (state_25119[(14)]);
var inst_25074__$1 = cljs.core.seq.call(null,inst_25060);
var state_25119__$1 = (function (){var statearr_25143 = state_25119;
(statearr_25143[(10)] = inst_25074__$1);

return statearr_25143;
})();
if(inst_25074__$1){
var statearr_25144_25190 = state_25119__$1;
(statearr_25144_25190[(1)] = (13));

} else {
var statearr_25145_25191 = state_25119__$1;
(statearr_25145_25191[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (9))){
var inst_25096 = (state_25119[(2)]);
var state_25119__$1 = state_25119;
var statearr_25146_25192 = state_25119__$1;
(statearr_25146_25192[(2)] = inst_25096);

(statearr_25146_25192[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (5))){
var inst_25057 = cljs.core.deref.call(null,mults);
var inst_25058 = cljs.core.vals.call(null,inst_25057);
var inst_25059 = cljs.core.seq.call(null,inst_25058);
var inst_25060 = inst_25059;
var inst_25061 = null;
var inst_25062 = (0);
var inst_25063 = (0);
var state_25119__$1 = (function (){var statearr_25147 = state_25119;
(statearr_25147[(13)] = inst_25063);

(statearr_25147[(14)] = inst_25060);

(statearr_25147[(15)] = inst_25062);

(statearr_25147[(16)] = inst_25061);

return statearr_25147;
})();
var statearr_25148_25193 = state_25119__$1;
(statearr_25148_25193[(2)] = null);

(statearr_25148_25193[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (14))){
var state_25119__$1 = state_25119;
var statearr_25152_25194 = state_25119__$1;
(statearr_25152_25194[(2)] = null);

(statearr_25152_25194[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (16))){
var inst_25074 = (state_25119[(10)]);
var inst_25078 = cljs.core.chunk_first.call(null,inst_25074);
var inst_25079 = cljs.core.chunk_rest.call(null,inst_25074);
var inst_25080 = cljs.core.count.call(null,inst_25078);
var inst_25060 = inst_25079;
var inst_25061 = inst_25078;
var inst_25062 = inst_25080;
var inst_25063 = (0);
var state_25119__$1 = (function (){var statearr_25153 = state_25119;
(statearr_25153[(13)] = inst_25063);

(statearr_25153[(14)] = inst_25060);

(statearr_25153[(15)] = inst_25062);

(statearr_25153[(16)] = inst_25061);

return statearr_25153;
})();
var statearr_25154_25195 = state_25119__$1;
(statearr_25154_25195[(2)] = null);

(statearr_25154_25195[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (10))){
var inst_25063 = (state_25119[(13)]);
var inst_25060 = (state_25119[(14)]);
var inst_25062 = (state_25119[(15)]);
var inst_25061 = (state_25119[(16)]);
var inst_25068 = cljs.core._nth.call(null,inst_25061,inst_25063);
var inst_25069 = cljs.core.async.muxch_STAR_.call(null,inst_25068);
var inst_25070 = cljs.core.async.close_BANG_.call(null,inst_25069);
var inst_25071 = (inst_25063 + (1));
var tmp25149 = inst_25060;
var tmp25150 = inst_25062;
var tmp25151 = inst_25061;
var inst_25060__$1 = tmp25149;
var inst_25061__$1 = tmp25151;
var inst_25062__$1 = tmp25150;
var inst_25063__$1 = inst_25071;
var state_25119__$1 = (function (){var statearr_25155 = state_25119;
(statearr_25155[(13)] = inst_25063__$1);

(statearr_25155[(14)] = inst_25060__$1);

(statearr_25155[(15)] = inst_25062__$1);

(statearr_25155[(17)] = inst_25070);

(statearr_25155[(16)] = inst_25061__$1);

return statearr_25155;
})();
var statearr_25156_25196 = state_25119__$1;
(statearr_25156_25196[(2)] = null);

(statearr_25156_25196[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (18))){
var inst_25089 = (state_25119[(2)]);
var state_25119__$1 = state_25119;
var statearr_25157_25197 = state_25119__$1;
(statearr_25157_25197[(2)] = inst_25089);

(statearr_25157_25197[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25120 === (8))){
var inst_25063 = (state_25119[(13)]);
var inst_25062 = (state_25119[(15)]);
var inst_25065 = (inst_25063 < inst_25062);
var inst_25066 = inst_25065;
var state_25119__$1 = state_25119;
if(cljs.core.truth_(inst_25066)){
var statearr_25158_25198 = state_25119__$1;
(statearr_25158_25198[(1)] = (10));

} else {
var statearr_25159_25199 = state_25119__$1;
(statearr_25159_25199[(1)] = (11));

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
});})(c__23272__auto___25171,mults,ensure_mult,p))
;
return ((function (switch__23207__auto__,c__23272__auto___25171,mults,ensure_mult,p){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_25163 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_25163[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_25163[(1)] = (1));

return statearr_25163;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_25119){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_25119);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e25164){if((e25164 instanceof Object)){
var ex__23211__auto__ = e25164;
var statearr_25165_25200 = state_25119;
(statearr_25165_25200[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25119);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e25164;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__25201 = state_25119;
state_25119 = G__25201;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_25119){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_25119);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___25171,mults,ensure_mult,p))
})();
var state__23274__auto__ = (function (){var statearr_25166 = f__23273__auto__.call(null);
(statearr_25166[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___25171);

return statearr_25166;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___25171,mults,ensure_mult,p))
);


return p;
});

cljs.core.async.pub.cljs$lang$maxFixedArity = 3;
/**
 * Subscribes a channel to a topic of a pub.
 * 
 *   By default the channel will be closed when the source closes,
 *   but can be determined by the close? parameter.
 */
cljs.core.async.sub = (function cljs$core$async$sub(var_args){
var args25202 = [];
var len__17790__auto___25205 = arguments.length;
var i__17791__auto___25206 = (0);
while(true){
if((i__17791__auto___25206 < len__17790__auto___25205)){
args25202.push((arguments[i__17791__auto___25206]));

var G__25207 = (i__17791__auto___25206 + (1));
i__17791__auto___25206 = G__25207;
continue;
} else {
}
break;
}

var G__25204 = args25202.length;
switch (G__25204) {
case 3:
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25202.length)].join('')));

}
});

cljs.core.async.sub.cljs$core$IFn$_invoke$arity$3 = (function (p,topic,ch){
return cljs.core.async.sub.call(null,p,topic,ch,true);
});

cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4 = (function (p,topic,ch,close_QMARK_){
return cljs.core.async.sub_STAR_.call(null,p,topic,ch,close_QMARK_);
});

cljs.core.async.sub.cljs$lang$maxFixedArity = 4;
/**
 * Unsubscribes a channel from a topic of a pub
 */
cljs.core.async.unsub = (function cljs$core$async$unsub(p,topic,ch){
return cljs.core.async.unsub_STAR_.call(null,p,topic,ch);
});
/**
 * Unsubscribes all channels from a pub, or a topic of a pub
 */
cljs.core.async.unsub_all = (function cljs$core$async$unsub_all(var_args){
var args25209 = [];
var len__17790__auto___25212 = arguments.length;
var i__17791__auto___25213 = (0);
while(true){
if((i__17791__auto___25213 < len__17790__auto___25212)){
args25209.push((arguments[i__17791__auto___25213]));

var G__25214 = (i__17791__auto___25213 + (1));
i__17791__auto___25213 = G__25214;
continue;
} else {
}
break;
}

var G__25211 = args25209.length;
switch (G__25211) {
case 1:
return cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25209.length)].join('')));

}
});

cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$1 = (function (p){
return cljs.core.async.unsub_all_STAR_.call(null,p);
});

cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$2 = (function (p,topic){
return cljs.core.async.unsub_all_STAR_.call(null,p,topic);
});

cljs.core.async.unsub_all.cljs$lang$maxFixedArity = 2;
/**
 * Takes a function and a collection of source channels, and returns a
 *   channel which contains the values produced by applying f to the set
 *   of first items taken from each source channel, followed by applying
 *   f to the set of second items from each channel, until any one of the
 *   channels is closed, at which point the output channel will be
 *   closed. The returned channel will be unbuffered by default, or a
 *   buf-or-n can be supplied
 */
cljs.core.async.map = (function cljs$core$async$map(var_args){
var args25216 = [];
var len__17790__auto___25287 = arguments.length;
var i__17791__auto___25288 = (0);
while(true){
if((i__17791__auto___25288 < len__17790__auto___25287)){
args25216.push((arguments[i__17791__auto___25288]));

var G__25289 = (i__17791__auto___25288 + (1));
i__17791__auto___25288 = G__25289;
continue;
} else {
}
break;
}

var G__25218 = args25216.length;
switch (G__25218) {
case 2:
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25216.length)].join('')));

}
});

cljs.core.async.map.cljs$core$IFn$_invoke$arity$2 = (function (f,chs){
return cljs.core.async.map.call(null,f,chs,null);
});

cljs.core.async.map.cljs$core$IFn$_invoke$arity$3 = (function (f,chs,buf_or_n){
var chs__$1 = cljs.core.vec.call(null,chs);
var out = cljs.core.async.chan.call(null,buf_or_n);
var cnt = cljs.core.count.call(null,chs__$1);
var rets = cljs.core.object_array.call(null,cnt);
var dchan = cljs.core.async.chan.call(null,(1));
var dctr = cljs.core.atom.call(null,null);
var done = cljs.core.mapv.call(null,((function (chs__$1,out,cnt,rets,dchan,dctr){
return (function (i){
return ((function (chs__$1,out,cnt,rets,dchan,dctr){
return (function (ret){
(rets[i] = ret);

if((cljs.core.swap_BANG_.call(null,dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.call(null,dchan,rets.slice((0)));
} else {
return null;
}
});
;})(chs__$1,out,cnt,rets,dchan,dctr))
});})(chs__$1,out,cnt,rets,dchan,dctr))
,cljs.core.range.call(null,cnt));
var c__23272__auto___25291 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___25291,chs__$1,out,cnt,rets,dchan,dctr,done){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___25291,chs__$1,out,cnt,rets,dchan,dctr,done){
return (function (state_25257){
var state_val_25258 = (state_25257[(1)]);
if((state_val_25258 === (7))){
var state_25257__$1 = state_25257;
var statearr_25259_25292 = state_25257__$1;
(statearr_25259_25292[(2)] = null);

(statearr_25259_25292[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (1))){
var state_25257__$1 = state_25257;
var statearr_25260_25293 = state_25257__$1;
(statearr_25260_25293[(2)] = null);

(statearr_25260_25293[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (4))){
var inst_25221 = (state_25257[(7)]);
var inst_25223 = (inst_25221 < cnt);
var state_25257__$1 = state_25257;
if(cljs.core.truth_(inst_25223)){
var statearr_25261_25294 = state_25257__$1;
(statearr_25261_25294[(1)] = (6));

} else {
var statearr_25262_25295 = state_25257__$1;
(statearr_25262_25295[(1)] = (7));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (15))){
var inst_25253 = (state_25257[(2)]);
var state_25257__$1 = state_25257;
var statearr_25263_25296 = state_25257__$1;
(statearr_25263_25296[(2)] = inst_25253);

(statearr_25263_25296[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (13))){
var inst_25246 = cljs.core.async.close_BANG_.call(null,out);
var state_25257__$1 = state_25257;
var statearr_25264_25297 = state_25257__$1;
(statearr_25264_25297[(2)] = inst_25246);

(statearr_25264_25297[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (6))){
var state_25257__$1 = state_25257;
var statearr_25265_25298 = state_25257__$1;
(statearr_25265_25298[(2)] = null);

(statearr_25265_25298[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (3))){
var inst_25255 = (state_25257[(2)]);
var state_25257__$1 = state_25257;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_25257__$1,inst_25255);
} else {
if((state_val_25258 === (12))){
var inst_25243 = (state_25257[(8)]);
var inst_25243__$1 = (state_25257[(2)]);
var inst_25244 = cljs.core.some.call(null,cljs.core.nil_QMARK_,inst_25243__$1);
var state_25257__$1 = (function (){var statearr_25266 = state_25257;
(statearr_25266[(8)] = inst_25243__$1);

return statearr_25266;
})();
if(cljs.core.truth_(inst_25244)){
var statearr_25267_25299 = state_25257__$1;
(statearr_25267_25299[(1)] = (13));

} else {
var statearr_25268_25300 = state_25257__$1;
(statearr_25268_25300[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (2))){
var inst_25220 = cljs.core.reset_BANG_.call(null,dctr,cnt);
var inst_25221 = (0);
var state_25257__$1 = (function (){var statearr_25269 = state_25257;
(statearr_25269[(7)] = inst_25221);

(statearr_25269[(9)] = inst_25220);

return statearr_25269;
})();
var statearr_25270_25301 = state_25257__$1;
(statearr_25270_25301[(2)] = null);

(statearr_25270_25301[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (11))){
var inst_25221 = (state_25257[(7)]);
var _ = cljs.core.async.impl.ioc_helpers.add_exception_frame.call(null,state_25257,(10),Object,null,(9));
var inst_25230 = chs__$1.call(null,inst_25221);
var inst_25231 = done.call(null,inst_25221);
var inst_25232 = cljs.core.async.take_BANG_.call(null,inst_25230,inst_25231);
var state_25257__$1 = state_25257;
var statearr_25271_25302 = state_25257__$1;
(statearr_25271_25302[(2)] = inst_25232);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25257__$1);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (9))){
var inst_25221 = (state_25257[(7)]);
var inst_25234 = (state_25257[(2)]);
var inst_25235 = (inst_25221 + (1));
var inst_25221__$1 = inst_25235;
var state_25257__$1 = (function (){var statearr_25272 = state_25257;
(statearr_25272[(10)] = inst_25234);

(statearr_25272[(7)] = inst_25221__$1);

return statearr_25272;
})();
var statearr_25273_25303 = state_25257__$1;
(statearr_25273_25303[(2)] = null);

(statearr_25273_25303[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (5))){
var inst_25241 = (state_25257[(2)]);
var state_25257__$1 = (function (){var statearr_25274 = state_25257;
(statearr_25274[(11)] = inst_25241);

return statearr_25274;
})();
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_25257__$1,(12),dchan);
} else {
if((state_val_25258 === (14))){
var inst_25243 = (state_25257[(8)]);
var inst_25248 = cljs.core.apply.call(null,f,inst_25243);
var state_25257__$1 = state_25257;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25257__$1,(16),out,inst_25248);
} else {
if((state_val_25258 === (16))){
var inst_25250 = (state_25257[(2)]);
var state_25257__$1 = (function (){var statearr_25275 = state_25257;
(statearr_25275[(12)] = inst_25250);

return statearr_25275;
})();
var statearr_25276_25304 = state_25257__$1;
(statearr_25276_25304[(2)] = null);

(statearr_25276_25304[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (10))){
var inst_25225 = (state_25257[(2)]);
var inst_25226 = cljs.core.swap_BANG_.call(null,dctr,cljs.core.dec);
var state_25257__$1 = (function (){var statearr_25277 = state_25257;
(statearr_25277[(13)] = inst_25225);

return statearr_25277;
})();
var statearr_25278_25305 = state_25257__$1;
(statearr_25278_25305[(2)] = inst_25226);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25257__$1);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25258 === (8))){
var inst_25239 = (state_25257[(2)]);
var state_25257__$1 = state_25257;
var statearr_25279_25306 = state_25257__$1;
(statearr_25279_25306[(2)] = inst_25239);

(statearr_25279_25306[(1)] = (5));


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
});})(c__23272__auto___25291,chs__$1,out,cnt,rets,dchan,dctr,done))
;
return ((function (switch__23207__auto__,c__23272__auto___25291,chs__$1,out,cnt,rets,dchan,dctr,done){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_25283 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_25283[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_25283[(1)] = (1));

return statearr_25283;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_25257){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_25257);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e25284){if((e25284 instanceof Object)){
var ex__23211__auto__ = e25284;
var statearr_25285_25307 = state_25257;
(statearr_25285_25307[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25257);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e25284;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__25308 = state_25257;
state_25257 = G__25308;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_25257){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_25257);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___25291,chs__$1,out,cnt,rets,dchan,dctr,done))
})();
var state__23274__auto__ = (function (){var statearr_25286 = f__23273__auto__.call(null);
(statearr_25286[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___25291);

return statearr_25286;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___25291,chs__$1,out,cnt,rets,dchan,dctr,done))
);


return out;
});

cljs.core.async.map.cljs$lang$maxFixedArity = 3;
/**
 * Takes a collection of source channels and returns a channel which
 *   contains all values taken from them. The returned channel will be
 *   unbuffered by default, or a buf-or-n can be supplied. The channel
 *   will close after all the source channels have closed.
 */
cljs.core.async.merge = (function cljs$core$async$merge(var_args){
var args25310 = [];
var len__17790__auto___25366 = arguments.length;
var i__17791__auto___25367 = (0);
while(true){
if((i__17791__auto___25367 < len__17790__auto___25366)){
args25310.push((arguments[i__17791__auto___25367]));

var G__25368 = (i__17791__auto___25367 + (1));
i__17791__auto___25367 = G__25368;
continue;
} else {
}
break;
}

var G__25312 = args25310.length;
switch (G__25312) {
case 1:
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25310.length)].join('')));

}
});

cljs.core.async.merge.cljs$core$IFn$_invoke$arity$1 = (function (chs){
return cljs.core.async.merge.call(null,chs,null);
});

cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2 = (function (chs,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__23272__auto___25370 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___25370,out){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___25370,out){
return (function (state_25342){
var state_val_25343 = (state_25342[(1)]);
if((state_val_25343 === (7))){
var inst_25322 = (state_25342[(7)]);
var inst_25321 = (state_25342[(8)]);
var inst_25321__$1 = (state_25342[(2)]);
var inst_25322__$1 = cljs.core.nth.call(null,inst_25321__$1,(0),null);
var inst_25323 = cljs.core.nth.call(null,inst_25321__$1,(1),null);
var inst_25324 = (inst_25322__$1 == null);
var state_25342__$1 = (function (){var statearr_25344 = state_25342;
(statearr_25344[(7)] = inst_25322__$1);

(statearr_25344[(8)] = inst_25321__$1);

(statearr_25344[(9)] = inst_25323);

return statearr_25344;
})();
if(cljs.core.truth_(inst_25324)){
var statearr_25345_25371 = state_25342__$1;
(statearr_25345_25371[(1)] = (8));

} else {
var statearr_25346_25372 = state_25342__$1;
(statearr_25346_25372[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25343 === (1))){
var inst_25313 = cljs.core.vec.call(null,chs);
var inst_25314 = inst_25313;
var state_25342__$1 = (function (){var statearr_25347 = state_25342;
(statearr_25347[(10)] = inst_25314);

return statearr_25347;
})();
var statearr_25348_25373 = state_25342__$1;
(statearr_25348_25373[(2)] = null);

(statearr_25348_25373[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25343 === (4))){
var inst_25314 = (state_25342[(10)]);
var state_25342__$1 = state_25342;
return cljs.core.async.ioc_alts_BANG_.call(null,state_25342__$1,(7),inst_25314);
} else {
if((state_val_25343 === (6))){
var inst_25338 = (state_25342[(2)]);
var state_25342__$1 = state_25342;
var statearr_25349_25374 = state_25342__$1;
(statearr_25349_25374[(2)] = inst_25338);

(statearr_25349_25374[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25343 === (3))){
var inst_25340 = (state_25342[(2)]);
var state_25342__$1 = state_25342;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_25342__$1,inst_25340);
} else {
if((state_val_25343 === (2))){
var inst_25314 = (state_25342[(10)]);
var inst_25316 = cljs.core.count.call(null,inst_25314);
var inst_25317 = (inst_25316 > (0));
var state_25342__$1 = state_25342;
if(cljs.core.truth_(inst_25317)){
var statearr_25351_25375 = state_25342__$1;
(statearr_25351_25375[(1)] = (4));

} else {
var statearr_25352_25376 = state_25342__$1;
(statearr_25352_25376[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25343 === (11))){
var inst_25314 = (state_25342[(10)]);
var inst_25331 = (state_25342[(2)]);
var tmp25350 = inst_25314;
var inst_25314__$1 = tmp25350;
var state_25342__$1 = (function (){var statearr_25353 = state_25342;
(statearr_25353[(11)] = inst_25331);

(statearr_25353[(10)] = inst_25314__$1);

return statearr_25353;
})();
var statearr_25354_25377 = state_25342__$1;
(statearr_25354_25377[(2)] = null);

(statearr_25354_25377[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25343 === (9))){
var inst_25322 = (state_25342[(7)]);
var state_25342__$1 = state_25342;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25342__$1,(11),out,inst_25322);
} else {
if((state_val_25343 === (5))){
var inst_25336 = cljs.core.async.close_BANG_.call(null,out);
var state_25342__$1 = state_25342;
var statearr_25355_25378 = state_25342__$1;
(statearr_25355_25378[(2)] = inst_25336);

(statearr_25355_25378[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25343 === (10))){
var inst_25334 = (state_25342[(2)]);
var state_25342__$1 = state_25342;
var statearr_25356_25379 = state_25342__$1;
(statearr_25356_25379[(2)] = inst_25334);

(statearr_25356_25379[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25343 === (8))){
var inst_25322 = (state_25342[(7)]);
var inst_25314 = (state_25342[(10)]);
var inst_25321 = (state_25342[(8)]);
var inst_25323 = (state_25342[(9)]);
var inst_25326 = (function (){var cs = inst_25314;
var vec__25319 = inst_25321;
var v = inst_25322;
var c = inst_25323;
return ((function (cs,vec__25319,v,c,inst_25322,inst_25314,inst_25321,inst_25323,state_val_25343,c__23272__auto___25370,out){
return (function (p1__25309_SHARP_){
return cljs.core.not_EQ_.call(null,c,p1__25309_SHARP_);
});
;})(cs,vec__25319,v,c,inst_25322,inst_25314,inst_25321,inst_25323,state_val_25343,c__23272__auto___25370,out))
})();
var inst_25327 = cljs.core.filterv.call(null,inst_25326,inst_25314);
var inst_25314__$1 = inst_25327;
var state_25342__$1 = (function (){var statearr_25357 = state_25342;
(statearr_25357[(10)] = inst_25314__$1);

return statearr_25357;
})();
var statearr_25358_25380 = state_25342__$1;
(statearr_25358_25380[(2)] = null);

(statearr_25358_25380[(1)] = (2));


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
});})(c__23272__auto___25370,out))
;
return ((function (switch__23207__auto__,c__23272__auto___25370,out){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_25362 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_25362[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_25362[(1)] = (1));

return statearr_25362;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_25342){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_25342);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e25363){if((e25363 instanceof Object)){
var ex__23211__auto__ = e25363;
var statearr_25364_25381 = state_25342;
(statearr_25364_25381[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25342);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e25363;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__25382 = state_25342;
state_25342 = G__25382;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_25342){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_25342);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___25370,out))
})();
var state__23274__auto__ = (function (){var statearr_25365 = f__23273__auto__.call(null);
(statearr_25365[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___25370);

return statearr_25365;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___25370,out))
);


return out;
});

cljs.core.async.merge.cljs$lang$maxFixedArity = 2;
/**
 * Returns a channel containing the single (collection) result of the
 *   items taken from the channel conjoined to the supplied
 *   collection. ch must close before into produces a result.
 */
cljs.core.async.into = (function cljs$core$async$into(coll,ch){
return cljs.core.async.reduce.call(null,cljs.core.conj,coll,ch);
});
/**
 * Returns a channel that will return, at most, n items from ch. After n items
 * have been returned, or ch has been closed, the return chanel will close.
 * 
 *   The output channel is unbuffered by default, unless buf-or-n is given.
 */
cljs.core.async.take = (function cljs$core$async$take(var_args){
var args25383 = [];
var len__17790__auto___25432 = arguments.length;
var i__17791__auto___25433 = (0);
while(true){
if((i__17791__auto___25433 < len__17790__auto___25432)){
args25383.push((arguments[i__17791__auto___25433]));

var G__25434 = (i__17791__auto___25433 + (1));
i__17791__auto___25433 = G__25434;
continue;
} else {
}
break;
}

var G__25385 = args25383.length;
switch (G__25385) {
case 2:
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25383.length)].join('')));

}
});

cljs.core.async.take.cljs$core$IFn$_invoke$arity$2 = (function (n,ch){
return cljs.core.async.take.call(null,n,ch,null);
});

cljs.core.async.take.cljs$core$IFn$_invoke$arity$3 = (function (n,ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__23272__auto___25436 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___25436,out){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___25436,out){
return (function (state_25409){
var state_val_25410 = (state_25409[(1)]);
if((state_val_25410 === (7))){
var inst_25391 = (state_25409[(7)]);
var inst_25391__$1 = (state_25409[(2)]);
var inst_25392 = (inst_25391__$1 == null);
var inst_25393 = cljs.core.not.call(null,inst_25392);
var state_25409__$1 = (function (){var statearr_25411 = state_25409;
(statearr_25411[(7)] = inst_25391__$1);

return statearr_25411;
})();
if(inst_25393){
var statearr_25412_25437 = state_25409__$1;
(statearr_25412_25437[(1)] = (8));

} else {
var statearr_25413_25438 = state_25409__$1;
(statearr_25413_25438[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25410 === (1))){
var inst_25386 = (0);
var state_25409__$1 = (function (){var statearr_25414 = state_25409;
(statearr_25414[(8)] = inst_25386);

return statearr_25414;
})();
var statearr_25415_25439 = state_25409__$1;
(statearr_25415_25439[(2)] = null);

(statearr_25415_25439[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25410 === (4))){
var state_25409__$1 = state_25409;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_25409__$1,(7),ch);
} else {
if((state_val_25410 === (6))){
var inst_25404 = (state_25409[(2)]);
var state_25409__$1 = state_25409;
var statearr_25416_25440 = state_25409__$1;
(statearr_25416_25440[(2)] = inst_25404);

(statearr_25416_25440[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25410 === (3))){
var inst_25406 = (state_25409[(2)]);
var inst_25407 = cljs.core.async.close_BANG_.call(null,out);
var state_25409__$1 = (function (){var statearr_25417 = state_25409;
(statearr_25417[(9)] = inst_25406);

return statearr_25417;
})();
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_25409__$1,inst_25407);
} else {
if((state_val_25410 === (2))){
var inst_25386 = (state_25409[(8)]);
var inst_25388 = (inst_25386 < n);
var state_25409__$1 = state_25409;
if(cljs.core.truth_(inst_25388)){
var statearr_25418_25441 = state_25409__$1;
(statearr_25418_25441[(1)] = (4));

} else {
var statearr_25419_25442 = state_25409__$1;
(statearr_25419_25442[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25410 === (11))){
var inst_25386 = (state_25409[(8)]);
var inst_25396 = (state_25409[(2)]);
var inst_25397 = (inst_25386 + (1));
var inst_25386__$1 = inst_25397;
var state_25409__$1 = (function (){var statearr_25420 = state_25409;
(statearr_25420[(10)] = inst_25396);

(statearr_25420[(8)] = inst_25386__$1);

return statearr_25420;
})();
var statearr_25421_25443 = state_25409__$1;
(statearr_25421_25443[(2)] = null);

(statearr_25421_25443[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25410 === (9))){
var state_25409__$1 = state_25409;
var statearr_25422_25444 = state_25409__$1;
(statearr_25422_25444[(2)] = null);

(statearr_25422_25444[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25410 === (5))){
var state_25409__$1 = state_25409;
var statearr_25423_25445 = state_25409__$1;
(statearr_25423_25445[(2)] = null);

(statearr_25423_25445[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25410 === (10))){
var inst_25401 = (state_25409[(2)]);
var state_25409__$1 = state_25409;
var statearr_25424_25446 = state_25409__$1;
(statearr_25424_25446[(2)] = inst_25401);

(statearr_25424_25446[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25410 === (8))){
var inst_25391 = (state_25409[(7)]);
var state_25409__$1 = state_25409;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25409__$1,(11),out,inst_25391);
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
});})(c__23272__auto___25436,out))
;
return ((function (switch__23207__auto__,c__23272__auto___25436,out){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_25428 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_25428[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_25428[(1)] = (1));

return statearr_25428;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_25409){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_25409);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e25429){if((e25429 instanceof Object)){
var ex__23211__auto__ = e25429;
var statearr_25430_25447 = state_25409;
(statearr_25430_25447[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25409);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e25429;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__25448 = state_25409;
state_25409 = G__25448;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_25409){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_25409);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___25436,out))
})();
var state__23274__auto__ = (function (){var statearr_25431 = f__23273__auto__.call(null);
(statearr_25431[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___25436);

return statearr_25431;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___25436,out))
);


return out;
});

cljs.core.async.take.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_LT_ = (function cljs$core$async$map_LT_(f,ch){
if(typeof cljs.core.async.t_cljs$core$async25456 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async25456 = (function (map_LT_,f,ch,meta25457){
this.map_LT_ = map_LT_;
this.f = f;
this.ch = ch;
this.meta25457 = meta25457;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async25456.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_25458,meta25457__$1){
var self__ = this;
var _25458__$1 = this;
return (new cljs.core.async.t_cljs$core$async25456(self__.map_LT_,self__.f,self__.ch,meta25457__$1));
});

cljs.core.async.t_cljs$core$async25456.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_25458){
var self__ = this;
var _25458__$1 = this;
return self__.meta25457;
});

cljs.core.async.t_cljs$core$async25456.prototype.cljs$core$async$impl$protocols$Channel$ = true;

cljs.core.async.t_cljs$core$async25456.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async25456.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async25456.prototype.cljs$core$async$impl$protocols$ReadPort$ = true;

cljs.core.async.t_cljs$core$async25456.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
var ret = cljs.core.async.impl.protocols.take_BANG_.call(null,self__.ch,(function (){
if(typeof cljs.core.async.t_cljs$core$async25459 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async25459 = (function (map_LT_,f,ch,meta25457,_,fn1,meta25460){
this.map_LT_ = map_LT_;
this.f = f;
this.ch = ch;
this.meta25457 = meta25457;
this._ = _;
this.fn1 = fn1;
this.meta25460 = meta25460;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async25459.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (___$1){
return (function (_25461,meta25460__$1){
var self__ = this;
var _25461__$1 = this;
return (new cljs.core.async.t_cljs$core$async25459(self__.map_LT_,self__.f,self__.ch,self__.meta25457,self__._,self__.fn1,meta25460__$1));
});})(___$1))
;

cljs.core.async.t_cljs$core$async25459.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (___$1){
return (function (_25461){
var self__ = this;
var _25461__$1 = this;
return self__.meta25460;
});})(___$1))
;

cljs.core.async.t_cljs$core$async25459.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async25459.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = ((function (___$1){
return (function (___$1){
var self__ = this;
var ___$2 = this;
return cljs.core.async.impl.protocols.active_QMARK_.call(null,self__.fn1);
});})(___$1))
;

cljs.core.async.t_cljs$core$async25459.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = ((function (___$1){
return (function (___$1){
var self__ = this;
var ___$2 = this;
return true;
});})(___$1))
;

cljs.core.async.t_cljs$core$async25459.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = ((function (___$1){
return (function (___$1){
var self__ = this;
var ___$2 = this;
var f1 = cljs.core.async.impl.protocols.commit.call(null,self__.fn1);
return ((function (f1,___$2,___$1){
return (function (p1__25449_SHARP_){
return f1.call(null,(((p1__25449_SHARP_ == null))?null:self__.f.call(null,p1__25449_SHARP_)));
});
;})(f1,___$2,___$1))
});})(___$1))
;

cljs.core.async.t_cljs$core$async25459.getBasis = ((function (___$1){
return (function (){
return new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"map<","map<",-1235808357,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Deprecated - this function will be removed. Use transducer instead"], null)),new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta25457","meta25457",1963403485,null),cljs.core.with_meta(new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol("cljs.core.async","t_cljs$core$async25456","cljs.core.async/t_cljs$core$async25456",-1590125449,null)], null)),new cljs.core.Symbol(null,"fn1","fn1",895834444,null),new cljs.core.Symbol(null,"meta25460","meta25460",-509416277,null)], null);
});})(___$1))
;

cljs.core.async.t_cljs$core$async25459.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async25459.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async25459";

cljs.core.async.t_cljs$core$async25459.cljs$lang$ctorPrWriter = ((function (___$1){
return (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async25459");
});})(___$1))
;

cljs.core.async.__GT_t_cljs$core$async25459 = ((function (___$1){
return (function cljs$core$async$map_LT__$___GT_t_cljs$core$async25459(map_LT___$1,f__$1,ch__$1,meta25457__$1,___$2,fn1__$1,meta25460){
return (new cljs.core.async.t_cljs$core$async25459(map_LT___$1,f__$1,ch__$1,meta25457__$1,___$2,fn1__$1,meta25460));
});})(___$1))
;

}

return (new cljs.core.async.t_cljs$core$async25459(self__.map_LT_,self__.f,self__.ch,self__.meta25457,___$1,fn1,cljs.core.PersistentArrayMap.EMPTY));
})()
);
if(cljs.core.truth_((function (){var and__16720__auto__ = ret;
if(cljs.core.truth_(and__16720__auto__)){
return !((cljs.core.deref.call(null,ret) == null));
} else {
return and__16720__auto__;
}
})())){
return cljs.core.async.impl.channels.box.call(null,self__.f.call(null,cljs.core.deref.call(null,ret)));
} else {
return ret;
}
});

cljs.core.async.t_cljs$core$async25456.prototype.cljs$core$async$impl$protocols$WritePort$ = true;

cljs.core.async.t_cljs$core$async25456.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_.call(null,self__.ch,val,fn1);
});

cljs.core.async.t_cljs$core$async25456.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"map<","map<",-1235808357,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Deprecated - this function will be removed. Use transducer instead"], null)),new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta25457","meta25457",1963403485,null)], null);
});

cljs.core.async.t_cljs$core$async25456.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async25456.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async25456";

cljs.core.async.t_cljs$core$async25456.cljs$lang$ctorPrWriter = (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async25456");
});

cljs.core.async.__GT_t_cljs$core$async25456 = (function cljs$core$async$map_LT__$___GT_t_cljs$core$async25456(map_LT___$1,f__$1,ch__$1,meta25457){
return (new cljs.core.async.t_cljs$core$async25456(map_LT___$1,f__$1,ch__$1,meta25457));
});

}

return (new cljs.core.async.t_cljs$core$async25456(cljs$core$async$map_LT_,f,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_GT_ = (function cljs$core$async$map_GT_(f,ch){
if(typeof cljs.core.async.t_cljs$core$async25465 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async25465 = (function (map_GT_,f,ch,meta25466){
this.map_GT_ = map_GT_;
this.f = f;
this.ch = ch;
this.meta25466 = meta25466;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async25465.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_25467,meta25466__$1){
var self__ = this;
var _25467__$1 = this;
return (new cljs.core.async.t_cljs$core$async25465(self__.map_GT_,self__.f,self__.ch,meta25466__$1));
});

cljs.core.async.t_cljs$core$async25465.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_25467){
var self__ = this;
var _25467__$1 = this;
return self__.meta25466;
});

cljs.core.async.t_cljs$core$async25465.prototype.cljs$core$async$impl$protocols$Channel$ = true;

cljs.core.async.t_cljs$core$async25465.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async25465.prototype.cljs$core$async$impl$protocols$ReadPort$ = true;

cljs.core.async.t_cljs$core$async25465.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_.call(null,self__.ch,fn1);
});

cljs.core.async.t_cljs$core$async25465.prototype.cljs$core$async$impl$protocols$WritePort$ = true;

cljs.core.async.t_cljs$core$async25465.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_.call(null,self__.ch,self__.f.call(null,val),fn1);
});

cljs.core.async.t_cljs$core$async25465.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"map>","map>",1676369295,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Deprecated - this function will be removed. Use transducer instead"], null)),new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta25466","meta25466",1352840627,null)], null);
});

cljs.core.async.t_cljs$core$async25465.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async25465.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async25465";

cljs.core.async.t_cljs$core$async25465.cljs$lang$ctorPrWriter = (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async25465");
});

cljs.core.async.__GT_t_cljs$core$async25465 = (function cljs$core$async$map_GT__$___GT_t_cljs$core$async25465(map_GT___$1,f__$1,ch__$1,meta25466){
return (new cljs.core.async.t_cljs$core$async25465(map_GT___$1,f__$1,ch__$1,meta25466));
});

}

return (new cljs.core.async.t_cljs$core$async25465(cljs$core$async$map_GT_,f,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_GT_ = (function cljs$core$async$filter_GT_(p,ch){
if(typeof cljs.core.async.t_cljs$core$async25471 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async25471 = (function (filter_GT_,p,ch,meta25472){
this.filter_GT_ = filter_GT_;
this.p = p;
this.ch = ch;
this.meta25472 = meta25472;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async25471.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_25473,meta25472__$1){
var self__ = this;
var _25473__$1 = this;
return (new cljs.core.async.t_cljs$core$async25471(self__.filter_GT_,self__.p,self__.ch,meta25472__$1));
});

cljs.core.async.t_cljs$core$async25471.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_25473){
var self__ = this;
var _25473__$1 = this;
return self__.meta25472;
});

cljs.core.async.t_cljs$core$async25471.prototype.cljs$core$async$impl$protocols$Channel$ = true;

cljs.core.async.t_cljs$core$async25471.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async25471.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async25471.prototype.cljs$core$async$impl$protocols$ReadPort$ = true;

cljs.core.async.t_cljs$core$async25471.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_.call(null,self__.ch,fn1);
});

cljs.core.async.t_cljs$core$async25471.prototype.cljs$core$async$impl$protocols$WritePort$ = true;

cljs.core.async.t_cljs$core$async25471.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(self__.p.call(null,val))){
return cljs.core.async.impl.protocols.put_BANG_.call(null,self__.ch,val,fn1);
} else {
return cljs.core.async.impl.channels.box.call(null,cljs.core.not.call(null,cljs.core.async.impl.protocols.closed_QMARK_.call(null,self__.ch)));
}
});

cljs.core.async.t_cljs$core$async25471.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"filter>","filter>",-37644455,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"p","p",1791580836,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Deprecated - this function will be removed. Use transducer instead"], null)),new cljs.core.Symbol(null,"p","p",1791580836,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta25472","meta25472",184458954,null)], null);
});

cljs.core.async.t_cljs$core$async25471.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async25471.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async25471";

cljs.core.async.t_cljs$core$async25471.cljs$lang$ctorPrWriter = (function (this__17330__auto__,writer__17331__auto__,opt__17332__auto__){
return cljs.core._write.call(null,writer__17331__auto__,"cljs.core.async/t_cljs$core$async25471");
});

cljs.core.async.__GT_t_cljs$core$async25471 = (function cljs$core$async$filter_GT__$___GT_t_cljs$core$async25471(filter_GT___$1,p__$1,ch__$1,meta25472){
return (new cljs.core.async.t_cljs$core$async25471(filter_GT___$1,p__$1,ch__$1,meta25472));
});

}

return (new cljs.core.async.t_cljs$core$async25471(cljs$core$async$filter_GT_,p,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.remove_GT_ = (function cljs$core$async$remove_GT_(p,ch){
return cljs.core.async.filter_GT_.call(null,cljs.core.complement.call(null,p),ch);
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_LT_ = (function cljs$core$async$filter_LT_(var_args){
var args25474 = [];
var len__17790__auto___25518 = arguments.length;
var i__17791__auto___25519 = (0);
while(true){
if((i__17791__auto___25519 < len__17790__auto___25518)){
args25474.push((arguments[i__17791__auto___25519]));

var G__25520 = (i__17791__auto___25519 + (1));
i__17791__auto___25519 = G__25520;
continue;
} else {
}
break;
}

var G__25476 = args25474.length;
switch (G__25476) {
case 2:
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25474.length)].join('')));

}
});

cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.filter_LT_.call(null,p,ch,null);
});

cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3 = (function (p,ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__23272__auto___25522 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___25522,out){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___25522,out){
return (function (state_25497){
var state_val_25498 = (state_25497[(1)]);
if((state_val_25498 === (7))){
var inst_25493 = (state_25497[(2)]);
var state_25497__$1 = state_25497;
var statearr_25499_25523 = state_25497__$1;
(statearr_25499_25523[(2)] = inst_25493);

(statearr_25499_25523[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25498 === (1))){
var state_25497__$1 = state_25497;
var statearr_25500_25524 = state_25497__$1;
(statearr_25500_25524[(2)] = null);

(statearr_25500_25524[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25498 === (4))){
var inst_25479 = (state_25497[(7)]);
var inst_25479__$1 = (state_25497[(2)]);
var inst_25480 = (inst_25479__$1 == null);
var state_25497__$1 = (function (){var statearr_25501 = state_25497;
(statearr_25501[(7)] = inst_25479__$1);

return statearr_25501;
})();
if(cljs.core.truth_(inst_25480)){
var statearr_25502_25525 = state_25497__$1;
(statearr_25502_25525[(1)] = (5));

} else {
var statearr_25503_25526 = state_25497__$1;
(statearr_25503_25526[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25498 === (6))){
var inst_25479 = (state_25497[(7)]);
var inst_25484 = p.call(null,inst_25479);
var state_25497__$1 = state_25497;
if(cljs.core.truth_(inst_25484)){
var statearr_25504_25527 = state_25497__$1;
(statearr_25504_25527[(1)] = (8));

} else {
var statearr_25505_25528 = state_25497__$1;
(statearr_25505_25528[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25498 === (3))){
var inst_25495 = (state_25497[(2)]);
var state_25497__$1 = state_25497;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_25497__$1,inst_25495);
} else {
if((state_val_25498 === (2))){
var state_25497__$1 = state_25497;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_25497__$1,(4),ch);
} else {
if((state_val_25498 === (11))){
var inst_25487 = (state_25497[(2)]);
var state_25497__$1 = state_25497;
var statearr_25506_25529 = state_25497__$1;
(statearr_25506_25529[(2)] = inst_25487);

(statearr_25506_25529[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25498 === (9))){
var state_25497__$1 = state_25497;
var statearr_25507_25530 = state_25497__$1;
(statearr_25507_25530[(2)] = null);

(statearr_25507_25530[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25498 === (5))){
var inst_25482 = cljs.core.async.close_BANG_.call(null,out);
var state_25497__$1 = state_25497;
var statearr_25508_25531 = state_25497__$1;
(statearr_25508_25531[(2)] = inst_25482);

(statearr_25508_25531[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25498 === (10))){
var inst_25490 = (state_25497[(2)]);
var state_25497__$1 = (function (){var statearr_25509 = state_25497;
(statearr_25509[(8)] = inst_25490);

return statearr_25509;
})();
var statearr_25510_25532 = state_25497__$1;
(statearr_25510_25532[(2)] = null);

(statearr_25510_25532[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25498 === (8))){
var inst_25479 = (state_25497[(7)]);
var state_25497__$1 = state_25497;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25497__$1,(11),out,inst_25479);
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
});})(c__23272__auto___25522,out))
;
return ((function (switch__23207__auto__,c__23272__auto___25522,out){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_25514 = [null,null,null,null,null,null,null,null,null];
(statearr_25514[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_25514[(1)] = (1));

return statearr_25514;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_25497){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_25497);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e25515){if((e25515 instanceof Object)){
var ex__23211__auto__ = e25515;
var statearr_25516_25533 = state_25497;
(statearr_25516_25533[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25497);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e25515;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__25534 = state_25497;
state_25497 = G__25534;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_25497){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_25497);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___25522,out))
})();
var state__23274__auto__ = (function (){var statearr_25517 = f__23273__auto__.call(null);
(statearr_25517[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___25522);

return statearr_25517;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___25522,out))
);


return out;
});

cljs.core.async.filter_LT_.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.remove_LT_ = (function cljs$core$async$remove_LT_(var_args){
var args25535 = [];
var len__17790__auto___25538 = arguments.length;
var i__17791__auto___25539 = (0);
while(true){
if((i__17791__auto___25539 < len__17790__auto___25538)){
args25535.push((arguments[i__17791__auto___25539]));

var G__25540 = (i__17791__auto___25539 + (1));
i__17791__auto___25539 = G__25540;
continue;
} else {
}
break;
}

var G__25537 = args25535.length;
switch (G__25537) {
case 2:
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25535.length)].join('')));

}
});

cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.remove_LT_.call(null,p,ch,null);
});

cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3 = (function (p,ch,buf_or_n){
return cljs.core.async.filter_LT_.call(null,cljs.core.complement.call(null,p),ch,buf_or_n);
});

cljs.core.async.remove_LT_.cljs$lang$maxFixedArity = 3;
cljs.core.async.mapcat_STAR_ = (function cljs$core$async$mapcat_STAR_(f,in$,out){
var c__23272__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto__){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto__){
return (function (state_25707){
var state_val_25708 = (state_25707[(1)]);
if((state_val_25708 === (7))){
var inst_25703 = (state_25707[(2)]);
var state_25707__$1 = state_25707;
var statearr_25709_25750 = state_25707__$1;
(statearr_25709_25750[(2)] = inst_25703);

(statearr_25709_25750[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (20))){
var inst_25673 = (state_25707[(7)]);
var inst_25684 = (state_25707[(2)]);
var inst_25685 = cljs.core.next.call(null,inst_25673);
var inst_25659 = inst_25685;
var inst_25660 = null;
var inst_25661 = (0);
var inst_25662 = (0);
var state_25707__$1 = (function (){var statearr_25710 = state_25707;
(statearr_25710[(8)] = inst_25662);

(statearr_25710[(9)] = inst_25684);

(statearr_25710[(10)] = inst_25660);

(statearr_25710[(11)] = inst_25661);

(statearr_25710[(12)] = inst_25659);

return statearr_25710;
})();
var statearr_25711_25751 = state_25707__$1;
(statearr_25711_25751[(2)] = null);

(statearr_25711_25751[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (1))){
var state_25707__$1 = state_25707;
var statearr_25712_25752 = state_25707__$1;
(statearr_25712_25752[(2)] = null);

(statearr_25712_25752[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (4))){
var inst_25648 = (state_25707[(13)]);
var inst_25648__$1 = (state_25707[(2)]);
var inst_25649 = (inst_25648__$1 == null);
var state_25707__$1 = (function (){var statearr_25713 = state_25707;
(statearr_25713[(13)] = inst_25648__$1);

return statearr_25713;
})();
if(cljs.core.truth_(inst_25649)){
var statearr_25714_25753 = state_25707__$1;
(statearr_25714_25753[(1)] = (5));

} else {
var statearr_25715_25754 = state_25707__$1;
(statearr_25715_25754[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (15))){
var state_25707__$1 = state_25707;
var statearr_25719_25755 = state_25707__$1;
(statearr_25719_25755[(2)] = null);

(statearr_25719_25755[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (21))){
var state_25707__$1 = state_25707;
var statearr_25720_25756 = state_25707__$1;
(statearr_25720_25756[(2)] = null);

(statearr_25720_25756[(1)] = (23));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (13))){
var inst_25662 = (state_25707[(8)]);
var inst_25660 = (state_25707[(10)]);
var inst_25661 = (state_25707[(11)]);
var inst_25659 = (state_25707[(12)]);
var inst_25669 = (state_25707[(2)]);
var inst_25670 = (inst_25662 + (1));
var tmp25716 = inst_25660;
var tmp25717 = inst_25661;
var tmp25718 = inst_25659;
var inst_25659__$1 = tmp25718;
var inst_25660__$1 = tmp25716;
var inst_25661__$1 = tmp25717;
var inst_25662__$1 = inst_25670;
var state_25707__$1 = (function (){var statearr_25721 = state_25707;
(statearr_25721[(8)] = inst_25662__$1);

(statearr_25721[(10)] = inst_25660__$1);

(statearr_25721[(14)] = inst_25669);

(statearr_25721[(11)] = inst_25661__$1);

(statearr_25721[(12)] = inst_25659__$1);

return statearr_25721;
})();
var statearr_25722_25757 = state_25707__$1;
(statearr_25722_25757[(2)] = null);

(statearr_25722_25757[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (22))){
var state_25707__$1 = state_25707;
var statearr_25723_25758 = state_25707__$1;
(statearr_25723_25758[(2)] = null);

(statearr_25723_25758[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (6))){
var inst_25648 = (state_25707[(13)]);
var inst_25657 = f.call(null,inst_25648);
var inst_25658 = cljs.core.seq.call(null,inst_25657);
var inst_25659 = inst_25658;
var inst_25660 = null;
var inst_25661 = (0);
var inst_25662 = (0);
var state_25707__$1 = (function (){var statearr_25724 = state_25707;
(statearr_25724[(8)] = inst_25662);

(statearr_25724[(10)] = inst_25660);

(statearr_25724[(11)] = inst_25661);

(statearr_25724[(12)] = inst_25659);

return statearr_25724;
})();
var statearr_25725_25759 = state_25707__$1;
(statearr_25725_25759[(2)] = null);

(statearr_25725_25759[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (17))){
var inst_25673 = (state_25707[(7)]);
var inst_25677 = cljs.core.chunk_first.call(null,inst_25673);
var inst_25678 = cljs.core.chunk_rest.call(null,inst_25673);
var inst_25679 = cljs.core.count.call(null,inst_25677);
var inst_25659 = inst_25678;
var inst_25660 = inst_25677;
var inst_25661 = inst_25679;
var inst_25662 = (0);
var state_25707__$1 = (function (){var statearr_25726 = state_25707;
(statearr_25726[(8)] = inst_25662);

(statearr_25726[(10)] = inst_25660);

(statearr_25726[(11)] = inst_25661);

(statearr_25726[(12)] = inst_25659);

return statearr_25726;
})();
var statearr_25727_25760 = state_25707__$1;
(statearr_25727_25760[(2)] = null);

(statearr_25727_25760[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (3))){
var inst_25705 = (state_25707[(2)]);
var state_25707__$1 = state_25707;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_25707__$1,inst_25705);
} else {
if((state_val_25708 === (12))){
var inst_25693 = (state_25707[(2)]);
var state_25707__$1 = state_25707;
var statearr_25728_25761 = state_25707__$1;
(statearr_25728_25761[(2)] = inst_25693);

(statearr_25728_25761[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (2))){
var state_25707__$1 = state_25707;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_25707__$1,(4),in$);
} else {
if((state_val_25708 === (23))){
var inst_25701 = (state_25707[(2)]);
var state_25707__$1 = state_25707;
var statearr_25729_25762 = state_25707__$1;
(statearr_25729_25762[(2)] = inst_25701);

(statearr_25729_25762[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (19))){
var inst_25688 = (state_25707[(2)]);
var state_25707__$1 = state_25707;
var statearr_25730_25763 = state_25707__$1;
(statearr_25730_25763[(2)] = inst_25688);

(statearr_25730_25763[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (11))){
var inst_25673 = (state_25707[(7)]);
var inst_25659 = (state_25707[(12)]);
var inst_25673__$1 = cljs.core.seq.call(null,inst_25659);
var state_25707__$1 = (function (){var statearr_25731 = state_25707;
(statearr_25731[(7)] = inst_25673__$1);

return statearr_25731;
})();
if(inst_25673__$1){
var statearr_25732_25764 = state_25707__$1;
(statearr_25732_25764[(1)] = (14));

} else {
var statearr_25733_25765 = state_25707__$1;
(statearr_25733_25765[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (9))){
var inst_25695 = (state_25707[(2)]);
var inst_25696 = cljs.core.async.impl.protocols.closed_QMARK_.call(null,out);
var state_25707__$1 = (function (){var statearr_25734 = state_25707;
(statearr_25734[(15)] = inst_25695);

return statearr_25734;
})();
if(cljs.core.truth_(inst_25696)){
var statearr_25735_25766 = state_25707__$1;
(statearr_25735_25766[(1)] = (21));

} else {
var statearr_25736_25767 = state_25707__$1;
(statearr_25736_25767[(1)] = (22));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (5))){
var inst_25651 = cljs.core.async.close_BANG_.call(null,out);
var state_25707__$1 = state_25707;
var statearr_25737_25768 = state_25707__$1;
(statearr_25737_25768[(2)] = inst_25651);

(statearr_25737_25768[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (14))){
var inst_25673 = (state_25707[(7)]);
var inst_25675 = cljs.core.chunked_seq_QMARK_.call(null,inst_25673);
var state_25707__$1 = state_25707;
if(inst_25675){
var statearr_25738_25769 = state_25707__$1;
(statearr_25738_25769[(1)] = (17));

} else {
var statearr_25739_25770 = state_25707__$1;
(statearr_25739_25770[(1)] = (18));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (16))){
var inst_25691 = (state_25707[(2)]);
var state_25707__$1 = state_25707;
var statearr_25740_25771 = state_25707__$1;
(statearr_25740_25771[(2)] = inst_25691);

(statearr_25740_25771[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25708 === (10))){
var inst_25662 = (state_25707[(8)]);
var inst_25660 = (state_25707[(10)]);
var inst_25667 = cljs.core._nth.call(null,inst_25660,inst_25662);
var state_25707__$1 = state_25707;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25707__$1,(13),out,inst_25667);
} else {
if((state_val_25708 === (18))){
var inst_25673 = (state_25707[(7)]);
var inst_25682 = cljs.core.first.call(null,inst_25673);
var state_25707__$1 = state_25707;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25707__$1,(20),out,inst_25682);
} else {
if((state_val_25708 === (8))){
var inst_25662 = (state_25707[(8)]);
var inst_25661 = (state_25707[(11)]);
var inst_25664 = (inst_25662 < inst_25661);
var inst_25665 = inst_25664;
var state_25707__$1 = state_25707;
if(cljs.core.truth_(inst_25665)){
var statearr_25741_25772 = state_25707__$1;
(statearr_25741_25772[(1)] = (10));

} else {
var statearr_25742_25773 = state_25707__$1;
(statearr_25742_25773[(1)] = (11));

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
});})(c__23272__auto__))
;
return ((function (switch__23207__auto__,c__23272__auto__){
return (function() {
var cljs$core$async$mapcat_STAR__$_state_machine__23208__auto__ = null;
var cljs$core$async$mapcat_STAR__$_state_machine__23208__auto____0 = (function (){
var statearr_25746 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_25746[(0)] = cljs$core$async$mapcat_STAR__$_state_machine__23208__auto__);

(statearr_25746[(1)] = (1));

return statearr_25746;
});
var cljs$core$async$mapcat_STAR__$_state_machine__23208__auto____1 = (function (state_25707){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_25707);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e25747){if((e25747 instanceof Object)){
var ex__23211__auto__ = e25747;
var statearr_25748_25774 = state_25707;
(statearr_25748_25774[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25707);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e25747;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__25775 = state_25707;
state_25707 = G__25775;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$mapcat_STAR__$_state_machine__23208__auto__ = function(state_25707){
switch(arguments.length){
case 0:
return cljs$core$async$mapcat_STAR__$_state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$mapcat_STAR__$_state_machine__23208__auto____1.call(this,state_25707);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mapcat_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mapcat_STAR__$_state_machine__23208__auto____0;
cljs$core$async$mapcat_STAR__$_state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mapcat_STAR__$_state_machine__23208__auto____1;
return cljs$core$async$mapcat_STAR__$_state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto__))
})();
var state__23274__auto__ = (function (){var statearr_25749 = f__23273__auto__.call(null);
(statearr_25749[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto__);

return statearr_25749;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto__))
);

return c__23272__auto__;
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_LT_ = (function cljs$core$async$mapcat_LT_(var_args){
var args25776 = [];
var len__17790__auto___25779 = arguments.length;
var i__17791__auto___25780 = (0);
while(true){
if((i__17791__auto___25780 < len__17790__auto___25779)){
args25776.push((arguments[i__17791__auto___25780]));

var G__25781 = (i__17791__auto___25780 + (1));
i__17791__auto___25780 = G__25781;
continue;
} else {
}
break;
}

var G__25778 = args25776.length;
switch (G__25778) {
case 2:
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25776.length)].join('')));

}
});

cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$2 = (function (f,in$){
return cljs.core.async.mapcat_LT_.call(null,f,in$,null);
});

cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3 = (function (f,in$,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
cljs.core.async.mapcat_STAR_.call(null,f,in$,out);

return out;
});

cljs.core.async.mapcat_LT_.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_GT_ = (function cljs$core$async$mapcat_GT_(var_args){
var args25783 = [];
var len__17790__auto___25786 = arguments.length;
var i__17791__auto___25787 = (0);
while(true){
if((i__17791__auto___25787 < len__17790__auto___25786)){
args25783.push((arguments[i__17791__auto___25787]));

var G__25788 = (i__17791__auto___25787 + (1));
i__17791__auto___25787 = G__25788;
continue;
} else {
}
break;
}

var G__25785 = args25783.length;
switch (G__25785) {
case 2:
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25783.length)].join('')));

}
});

cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$2 = (function (f,out){
return cljs.core.async.mapcat_GT_.call(null,f,out,null);
});

cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3 = (function (f,out,buf_or_n){
var in$ = cljs.core.async.chan.call(null,buf_or_n);
cljs.core.async.mapcat_STAR_.call(null,f,in$,out);

return in$;
});

cljs.core.async.mapcat_GT_.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.unique = (function cljs$core$async$unique(var_args){
var args25790 = [];
var len__17790__auto___25841 = arguments.length;
var i__17791__auto___25842 = (0);
while(true){
if((i__17791__auto___25842 < len__17790__auto___25841)){
args25790.push((arguments[i__17791__auto___25842]));

var G__25843 = (i__17791__auto___25842 + (1));
i__17791__auto___25842 = G__25843;
continue;
} else {
}
break;
}

var G__25792 = args25790.length;
switch (G__25792) {
case 1:
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25790.length)].join('')));

}
});

cljs.core.async.unique.cljs$core$IFn$_invoke$arity$1 = (function (ch){
return cljs.core.async.unique.call(null,ch,null);
});

cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2 = (function (ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__23272__auto___25845 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___25845,out){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___25845,out){
return (function (state_25816){
var state_val_25817 = (state_25816[(1)]);
if((state_val_25817 === (7))){
var inst_25811 = (state_25816[(2)]);
var state_25816__$1 = state_25816;
var statearr_25818_25846 = state_25816__$1;
(statearr_25818_25846[(2)] = inst_25811);

(statearr_25818_25846[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25817 === (1))){
var inst_25793 = null;
var state_25816__$1 = (function (){var statearr_25819 = state_25816;
(statearr_25819[(7)] = inst_25793);

return statearr_25819;
})();
var statearr_25820_25847 = state_25816__$1;
(statearr_25820_25847[(2)] = null);

(statearr_25820_25847[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25817 === (4))){
var inst_25796 = (state_25816[(8)]);
var inst_25796__$1 = (state_25816[(2)]);
var inst_25797 = (inst_25796__$1 == null);
var inst_25798 = cljs.core.not.call(null,inst_25797);
var state_25816__$1 = (function (){var statearr_25821 = state_25816;
(statearr_25821[(8)] = inst_25796__$1);

return statearr_25821;
})();
if(inst_25798){
var statearr_25822_25848 = state_25816__$1;
(statearr_25822_25848[(1)] = (5));

} else {
var statearr_25823_25849 = state_25816__$1;
(statearr_25823_25849[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25817 === (6))){
var state_25816__$1 = state_25816;
var statearr_25824_25850 = state_25816__$1;
(statearr_25824_25850[(2)] = null);

(statearr_25824_25850[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25817 === (3))){
var inst_25813 = (state_25816[(2)]);
var inst_25814 = cljs.core.async.close_BANG_.call(null,out);
var state_25816__$1 = (function (){var statearr_25825 = state_25816;
(statearr_25825[(9)] = inst_25813);

return statearr_25825;
})();
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_25816__$1,inst_25814);
} else {
if((state_val_25817 === (2))){
var state_25816__$1 = state_25816;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_25816__$1,(4),ch);
} else {
if((state_val_25817 === (11))){
var inst_25796 = (state_25816[(8)]);
var inst_25805 = (state_25816[(2)]);
var inst_25793 = inst_25796;
var state_25816__$1 = (function (){var statearr_25826 = state_25816;
(statearr_25826[(10)] = inst_25805);

(statearr_25826[(7)] = inst_25793);

return statearr_25826;
})();
var statearr_25827_25851 = state_25816__$1;
(statearr_25827_25851[(2)] = null);

(statearr_25827_25851[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25817 === (9))){
var inst_25796 = (state_25816[(8)]);
var state_25816__$1 = state_25816;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25816__$1,(11),out,inst_25796);
} else {
if((state_val_25817 === (5))){
var inst_25796 = (state_25816[(8)]);
var inst_25793 = (state_25816[(7)]);
var inst_25800 = cljs.core._EQ_.call(null,inst_25796,inst_25793);
var state_25816__$1 = state_25816;
if(inst_25800){
var statearr_25829_25852 = state_25816__$1;
(statearr_25829_25852[(1)] = (8));

} else {
var statearr_25830_25853 = state_25816__$1;
(statearr_25830_25853[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25817 === (10))){
var inst_25808 = (state_25816[(2)]);
var state_25816__$1 = state_25816;
var statearr_25831_25854 = state_25816__$1;
(statearr_25831_25854[(2)] = inst_25808);

(statearr_25831_25854[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25817 === (8))){
var inst_25793 = (state_25816[(7)]);
var tmp25828 = inst_25793;
var inst_25793__$1 = tmp25828;
var state_25816__$1 = (function (){var statearr_25832 = state_25816;
(statearr_25832[(7)] = inst_25793__$1);

return statearr_25832;
})();
var statearr_25833_25855 = state_25816__$1;
(statearr_25833_25855[(2)] = null);

(statearr_25833_25855[(1)] = (2));


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
});})(c__23272__auto___25845,out))
;
return ((function (switch__23207__auto__,c__23272__auto___25845,out){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_25837 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_25837[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_25837[(1)] = (1));

return statearr_25837;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_25816){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_25816);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e25838){if((e25838 instanceof Object)){
var ex__23211__auto__ = e25838;
var statearr_25839_25856 = state_25816;
(statearr_25839_25856[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25816);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e25838;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__25857 = state_25816;
state_25816 = G__25857;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_25816){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_25816);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___25845,out))
})();
var state__23274__auto__ = (function (){var statearr_25840 = f__23273__auto__.call(null);
(statearr_25840[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___25845);

return statearr_25840;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___25845,out))
);


return out;
});

cljs.core.async.unique.cljs$lang$maxFixedArity = 2;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition = (function cljs$core$async$partition(var_args){
var args25858 = [];
var len__17790__auto___25928 = arguments.length;
var i__17791__auto___25929 = (0);
while(true){
if((i__17791__auto___25929 < len__17790__auto___25928)){
args25858.push((arguments[i__17791__auto___25929]));

var G__25930 = (i__17791__auto___25929 + (1));
i__17791__auto___25929 = G__25930;
continue;
} else {
}
break;
}

var G__25860 = args25858.length;
switch (G__25860) {
case 2:
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25858.length)].join('')));

}
});

cljs.core.async.partition.cljs$core$IFn$_invoke$arity$2 = (function (n,ch){
return cljs.core.async.partition.call(null,n,ch,null);
});

cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3 = (function (n,ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__23272__auto___25932 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___25932,out){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___25932,out){
return (function (state_25898){
var state_val_25899 = (state_25898[(1)]);
if((state_val_25899 === (7))){
var inst_25894 = (state_25898[(2)]);
var state_25898__$1 = state_25898;
var statearr_25900_25933 = state_25898__$1;
(statearr_25900_25933[(2)] = inst_25894);

(statearr_25900_25933[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (1))){
var inst_25861 = (new Array(n));
var inst_25862 = inst_25861;
var inst_25863 = (0);
var state_25898__$1 = (function (){var statearr_25901 = state_25898;
(statearr_25901[(7)] = inst_25863);

(statearr_25901[(8)] = inst_25862);

return statearr_25901;
})();
var statearr_25902_25934 = state_25898__$1;
(statearr_25902_25934[(2)] = null);

(statearr_25902_25934[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (4))){
var inst_25866 = (state_25898[(9)]);
var inst_25866__$1 = (state_25898[(2)]);
var inst_25867 = (inst_25866__$1 == null);
var inst_25868 = cljs.core.not.call(null,inst_25867);
var state_25898__$1 = (function (){var statearr_25903 = state_25898;
(statearr_25903[(9)] = inst_25866__$1);

return statearr_25903;
})();
if(inst_25868){
var statearr_25904_25935 = state_25898__$1;
(statearr_25904_25935[(1)] = (5));

} else {
var statearr_25905_25936 = state_25898__$1;
(statearr_25905_25936[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (15))){
var inst_25888 = (state_25898[(2)]);
var state_25898__$1 = state_25898;
var statearr_25906_25937 = state_25898__$1;
(statearr_25906_25937[(2)] = inst_25888);

(statearr_25906_25937[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (13))){
var state_25898__$1 = state_25898;
var statearr_25907_25938 = state_25898__$1;
(statearr_25907_25938[(2)] = null);

(statearr_25907_25938[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (6))){
var inst_25863 = (state_25898[(7)]);
var inst_25884 = (inst_25863 > (0));
var state_25898__$1 = state_25898;
if(cljs.core.truth_(inst_25884)){
var statearr_25908_25939 = state_25898__$1;
(statearr_25908_25939[(1)] = (12));

} else {
var statearr_25909_25940 = state_25898__$1;
(statearr_25909_25940[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (3))){
var inst_25896 = (state_25898[(2)]);
var state_25898__$1 = state_25898;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_25898__$1,inst_25896);
} else {
if((state_val_25899 === (12))){
var inst_25862 = (state_25898[(8)]);
var inst_25886 = cljs.core.vec.call(null,inst_25862);
var state_25898__$1 = state_25898;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25898__$1,(15),out,inst_25886);
} else {
if((state_val_25899 === (2))){
var state_25898__$1 = state_25898;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_25898__$1,(4),ch);
} else {
if((state_val_25899 === (11))){
var inst_25878 = (state_25898[(2)]);
var inst_25879 = (new Array(n));
var inst_25862 = inst_25879;
var inst_25863 = (0);
var state_25898__$1 = (function (){var statearr_25910 = state_25898;
(statearr_25910[(7)] = inst_25863);

(statearr_25910[(10)] = inst_25878);

(statearr_25910[(8)] = inst_25862);

return statearr_25910;
})();
var statearr_25911_25941 = state_25898__$1;
(statearr_25911_25941[(2)] = null);

(statearr_25911_25941[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (9))){
var inst_25862 = (state_25898[(8)]);
var inst_25876 = cljs.core.vec.call(null,inst_25862);
var state_25898__$1 = state_25898;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25898__$1,(11),out,inst_25876);
} else {
if((state_val_25899 === (5))){
var inst_25871 = (state_25898[(11)]);
var inst_25866 = (state_25898[(9)]);
var inst_25863 = (state_25898[(7)]);
var inst_25862 = (state_25898[(8)]);
var inst_25870 = (inst_25862[inst_25863] = inst_25866);
var inst_25871__$1 = (inst_25863 + (1));
var inst_25872 = (inst_25871__$1 < n);
var state_25898__$1 = (function (){var statearr_25912 = state_25898;
(statearr_25912[(11)] = inst_25871__$1);

(statearr_25912[(12)] = inst_25870);

return statearr_25912;
})();
if(cljs.core.truth_(inst_25872)){
var statearr_25913_25942 = state_25898__$1;
(statearr_25913_25942[(1)] = (8));

} else {
var statearr_25914_25943 = state_25898__$1;
(statearr_25914_25943[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (14))){
var inst_25891 = (state_25898[(2)]);
var inst_25892 = cljs.core.async.close_BANG_.call(null,out);
var state_25898__$1 = (function (){var statearr_25916 = state_25898;
(statearr_25916[(13)] = inst_25891);

return statearr_25916;
})();
var statearr_25917_25944 = state_25898__$1;
(statearr_25917_25944[(2)] = inst_25892);

(statearr_25917_25944[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (10))){
var inst_25882 = (state_25898[(2)]);
var state_25898__$1 = state_25898;
var statearr_25918_25945 = state_25898__$1;
(statearr_25918_25945[(2)] = inst_25882);

(statearr_25918_25945[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25899 === (8))){
var inst_25871 = (state_25898[(11)]);
var inst_25862 = (state_25898[(8)]);
var tmp25915 = inst_25862;
var inst_25862__$1 = tmp25915;
var inst_25863 = inst_25871;
var state_25898__$1 = (function (){var statearr_25919 = state_25898;
(statearr_25919[(7)] = inst_25863);

(statearr_25919[(8)] = inst_25862__$1);

return statearr_25919;
})();
var statearr_25920_25946 = state_25898__$1;
(statearr_25920_25946[(2)] = null);

(statearr_25920_25946[(1)] = (2));


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
});})(c__23272__auto___25932,out))
;
return ((function (switch__23207__auto__,c__23272__auto___25932,out){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_25924 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_25924[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_25924[(1)] = (1));

return statearr_25924;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_25898){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_25898);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e25925){if((e25925 instanceof Object)){
var ex__23211__auto__ = e25925;
var statearr_25926_25947 = state_25898;
(statearr_25926_25947[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25898);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e25925;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__25948 = state_25898;
state_25898 = G__25948;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_25898){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_25898);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___25932,out))
})();
var state__23274__auto__ = (function (){var statearr_25927 = f__23273__auto__.call(null);
(statearr_25927[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___25932);

return statearr_25927;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___25932,out))
);


return out;
});

cljs.core.async.partition.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition_by = (function cljs$core$async$partition_by(var_args){
var args25949 = [];
var len__17790__auto___26023 = arguments.length;
var i__17791__auto___26024 = (0);
while(true){
if((i__17791__auto___26024 < len__17790__auto___26023)){
args25949.push((arguments[i__17791__auto___26024]));

var G__26025 = (i__17791__auto___26024 + (1));
i__17791__auto___26024 = G__26025;
continue;
} else {
}
break;
}

var G__25951 = args25949.length;
switch (G__25951) {
case 2:
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25949.length)].join('')));

}
});

cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$2 = (function (f,ch){
return cljs.core.async.partition_by.call(null,f,ch,null);
});

cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3 = (function (f,ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__23272__auto___26027 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__23272__auto___26027,out){
return (function (){
var f__23273__auto__ = (function (){var switch__23207__auto__ = ((function (c__23272__auto___26027,out){
return (function (state_25993){
var state_val_25994 = (state_25993[(1)]);
if((state_val_25994 === (7))){
var inst_25989 = (state_25993[(2)]);
var state_25993__$1 = state_25993;
var statearr_25995_26028 = state_25993__$1;
(statearr_25995_26028[(2)] = inst_25989);

(statearr_25995_26028[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (1))){
var inst_25952 = [];
var inst_25953 = inst_25952;
var inst_25954 = new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123);
var state_25993__$1 = (function (){var statearr_25996 = state_25993;
(statearr_25996[(7)] = inst_25954);

(statearr_25996[(8)] = inst_25953);

return statearr_25996;
})();
var statearr_25997_26029 = state_25993__$1;
(statearr_25997_26029[(2)] = null);

(statearr_25997_26029[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (4))){
var inst_25957 = (state_25993[(9)]);
var inst_25957__$1 = (state_25993[(2)]);
var inst_25958 = (inst_25957__$1 == null);
var inst_25959 = cljs.core.not.call(null,inst_25958);
var state_25993__$1 = (function (){var statearr_25998 = state_25993;
(statearr_25998[(9)] = inst_25957__$1);

return statearr_25998;
})();
if(inst_25959){
var statearr_25999_26030 = state_25993__$1;
(statearr_25999_26030[(1)] = (5));

} else {
var statearr_26000_26031 = state_25993__$1;
(statearr_26000_26031[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (15))){
var inst_25983 = (state_25993[(2)]);
var state_25993__$1 = state_25993;
var statearr_26001_26032 = state_25993__$1;
(statearr_26001_26032[(2)] = inst_25983);

(statearr_26001_26032[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (13))){
var state_25993__$1 = state_25993;
var statearr_26002_26033 = state_25993__$1;
(statearr_26002_26033[(2)] = null);

(statearr_26002_26033[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (6))){
var inst_25953 = (state_25993[(8)]);
var inst_25978 = inst_25953.length;
var inst_25979 = (inst_25978 > (0));
var state_25993__$1 = state_25993;
if(cljs.core.truth_(inst_25979)){
var statearr_26003_26034 = state_25993__$1;
(statearr_26003_26034[(1)] = (12));

} else {
var statearr_26004_26035 = state_25993__$1;
(statearr_26004_26035[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (3))){
var inst_25991 = (state_25993[(2)]);
var state_25993__$1 = state_25993;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_25993__$1,inst_25991);
} else {
if((state_val_25994 === (12))){
var inst_25953 = (state_25993[(8)]);
var inst_25981 = cljs.core.vec.call(null,inst_25953);
var state_25993__$1 = state_25993;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25993__$1,(15),out,inst_25981);
} else {
if((state_val_25994 === (2))){
var state_25993__$1 = state_25993;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_25993__$1,(4),ch);
} else {
if((state_val_25994 === (11))){
var inst_25961 = (state_25993[(10)]);
var inst_25957 = (state_25993[(9)]);
var inst_25971 = (state_25993[(2)]);
var inst_25972 = [];
var inst_25973 = inst_25972.push(inst_25957);
var inst_25953 = inst_25972;
var inst_25954 = inst_25961;
var state_25993__$1 = (function (){var statearr_26005 = state_25993;
(statearr_26005[(7)] = inst_25954);

(statearr_26005[(11)] = inst_25973);

(statearr_26005[(12)] = inst_25971);

(statearr_26005[(8)] = inst_25953);

return statearr_26005;
})();
var statearr_26006_26036 = state_25993__$1;
(statearr_26006_26036[(2)] = null);

(statearr_26006_26036[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (9))){
var inst_25953 = (state_25993[(8)]);
var inst_25969 = cljs.core.vec.call(null,inst_25953);
var state_25993__$1 = state_25993;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_25993__$1,(11),out,inst_25969);
} else {
if((state_val_25994 === (5))){
var inst_25961 = (state_25993[(10)]);
var inst_25954 = (state_25993[(7)]);
var inst_25957 = (state_25993[(9)]);
var inst_25961__$1 = f.call(null,inst_25957);
var inst_25962 = cljs.core._EQ_.call(null,inst_25961__$1,inst_25954);
var inst_25963 = cljs.core.keyword_identical_QMARK_.call(null,inst_25954,new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123));
var inst_25964 = (inst_25962) || (inst_25963);
var state_25993__$1 = (function (){var statearr_26007 = state_25993;
(statearr_26007[(10)] = inst_25961__$1);

return statearr_26007;
})();
if(cljs.core.truth_(inst_25964)){
var statearr_26008_26037 = state_25993__$1;
(statearr_26008_26037[(1)] = (8));

} else {
var statearr_26009_26038 = state_25993__$1;
(statearr_26009_26038[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (14))){
var inst_25986 = (state_25993[(2)]);
var inst_25987 = cljs.core.async.close_BANG_.call(null,out);
var state_25993__$1 = (function (){var statearr_26011 = state_25993;
(statearr_26011[(13)] = inst_25986);

return statearr_26011;
})();
var statearr_26012_26039 = state_25993__$1;
(statearr_26012_26039[(2)] = inst_25987);

(statearr_26012_26039[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (10))){
var inst_25976 = (state_25993[(2)]);
var state_25993__$1 = state_25993;
var statearr_26013_26040 = state_25993__$1;
(statearr_26013_26040[(2)] = inst_25976);

(statearr_26013_26040[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_25994 === (8))){
var inst_25961 = (state_25993[(10)]);
var inst_25957 = (state_25993[(9)]);
var inst_25953 = (state_25993[(8)]);
var inst_25966 = inst_25953.push(inst_25957);
var tmp26010 = inst_25953;
var inst_25953__$1 = tmp26010;
var inst_25954 = inst_25961;
var state_25993__$1 = (function (){var statearr_26014 = state_25993;
(statearr_26014[(7)] = inst_25954);

(statearr_26014[(14)] = inst_25966);

(statearr_26014[(8)] = inst_25953__$1);

return statearr_26014;
})();
var statearr_26015_26041 = state_25993__$1;
(statearr_26015_26041[(2)] = null);

(statearr_26015_26041[(1)] = (2));


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
});})(c__23272__auto___26027,out))
;
return ((function (switch__23207__auto__,c__23272__auto___26027,out){
return (function() {
var cljs$core$async$state_machine__23208__auto__ = null;
var cljs$core$async$state_machine__23208__auto____0 = (function (){
var statearr_26019 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_26019[(0)] = cljs$core$async$state_machine__23208__auto__);

(statearr_26019[(1)] = (1));

return statearr_26019;
});
var cljs$core$async$state_machine__23208__auto____1 = (function (state_25993){
while(true){
var ret_value__23209__auto__ = (function (){try{while(true){
var result__23210__auto__ = switch__23207__auto__.call(null,state_25993);
if(cljs.core.keyword_identical_QMARK_.call(null,result__23210__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__23210__auto__;
}
break;
}
}catch (e26020){if((e26020 instanceof Object)){
var ex__23211__auto__ = e26020;
var statearr_26021_26042 = state_25993;
(statearr_26021_26042[(5)] = ex__23211__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_25993);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e26020;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__23209__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__26043 = state_25993;
state_25993 = G__26043;
continue;
} else {
return ret_value__23209__auto__;
}
break;
}
});
cljs$core$async$state_machine__23208__auto__ = function(state_25993){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__23208__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__23208__auto____1.call(this,state_25993);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__23208__auto____0;
cljs$core$async$state_machine__23208__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__23208__auto____1;
return cljs$core$async$state_machine__23208__auto__;
})()
;})(switch__23207__auto__,c__23272__auto___26027,out))
})();
var state__23274__auto__ = (function (){var statearr_26022 = f__23273__auto__.call(null);
(statearr_26022[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__23272__auto___26027);

return statearr_26022;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__23274__auto__);
});})(c__23272__auto___26027,out))
);


return out;
});

cljs.core.async.partition_by.cljs$lang$maxFixedArity = 3;

//# sourceMappingURL=async.js.map