/*\

title: $:/plugins/felixhayashi/tiddlymap/caretaker.js
type: application/javascript
module-type: startup

@preserve

\*/
(function(){"use strict";exports.name="tmap.caretaker";exports.platforms=["browser"];exports.after=["startup"];exports.before=["rootwidget"];exports.synchronous=true;var e=require("$:/plugins/felixhayashi/tiddlymap/utils.js").utils;var t=require("$:/plugins/felixhayashi/tiddlymap/adapter.js").Adapter;var a=require("$:/plugins/felixhayashi/tiddlymap/dialog_manager.js").DialogManager;var i=require("$:/plugins/felixhayashi/tiddlymap/callback_manager.js").CallbackManager;var s=function(t){var a=t;if(!a.path)a.path=e.getDataMap();a.path.pluginRoot="$:/plugins/felixhayashi/tiddlymap";a.path.edgeTypes="$:/plugins/felixhayashi/tiddlymap/graph/edgeTypes";a.path.views="$:/plugins/felixhayashi/tiddlymap/graph/views";a.path.options="$:/plugins/felixhayashi/tiddlymap/config";a.path.tempRoot="$:/temp/felixhayashi/tiddlymap";a.path.localHolders="$:/temp/felixhayashi/tiddlymap/holders";a.path.dialogs="$:/plugins/felixhayashi/tiddlymap/dialog";a.path.footers="$:/plugins/felixhayashi/tiddlymap/dialogFooter";if(!a.ref)a.ref=e.getDataMap();a.ref.defaultGraphViewHolder="$:/plugins/felixhayashi/tiddlymap/misc/defaultViewHolder";a.ref.graphBar="$:/plugins/felixhayashi/tiddlymap/misc/advancedEditorBar";a.ref.sysConf="$:/plugins/felixhayashi/tiddlymap/config/sys";a.ref.sysUserConf="$:/plugins/felixhayashi/tiddlymap/config/sys/user";a.ref.visConf="$:/plugins/felixhayashi/tiddlymap/config/vis";a.ref.visUserConf="$:/plugins/felixhayashi/tiddlymap/config/vis/user";a.ref.welcomeFlag="$:/plugins/felixhayashi/tiddlymap/flag/welcome";a.ref.focusButton="$:/plugins/felixhayashi/tiddlymap/misc/focusButton";a.ref.sysMeta="$:/plugins/felixhayashi/tiddlymap/misc/meta";if(!a.config)a.config=e.getDataMap();a.config.sys=e.merge($tw.wiki.getTiddlerData(a.ref.sysConf,{}),e.unflatten($tw.wiki.getTiddlerData(a.ref.sysUserConf,{})));a.config.vis=e.merge($tw.wiki.getTiddlerData(a.ref.visConf,{}),e.unflatten($tw.wiki.getTiddlerData(a.ref.visUserConf,{})));if(!a.field)a.field=e.getDataMap();$tw.utils.extend(a.field,a.config.sys.field);if(!a.misc)a.misc=e.getDataMap();a.misc.unknownEdgeLabel="tmap:undefined";a.misc.cssPrefix="tmap-";a.misc.sysEdgeTypeNS="tmap";if(!a.filter)a.filter=e.getDataMap();a.filter.edgeTypes="[prefix["+a.path.edgeTypes+"]]";a.filter.views="[has["+a.field.viewMarker+"]]";a.filter.defaultEdgeFilter=a.filter.edgeTypes+"-[suffix[tmap:link]]"+"-[suffix[tmap:tag]]";if(!a.selector)a.selector=e.getDataMap();var i="[all[tiddlers+shadows]!has[draft.of]]";a.selector.allEdgeTypes=i+" +"+a.filter.edgeTypes;a.selector.allEdgeTypesByLabel=a.selector.allEdgeTypes+" +[removeprefix["+a.path.edgeTypes+"/]]";a.selector.allViews=i+" +"+a.filter.views;a.selector.allViewsByLabel=a.selector.allViews+"+[removeprefix["+a.path.views+"/]]";a.selector.allPotentialNodes="[all[tiddlers]!is[system]!has[draft.of]]"};var r=function(t){$tw.tmap.start("Attaching Indeces");if(!t.indeces){t.indeces={tById:e.getDataMap(),idByT:e.getDataMap()}}var a=$tw.wiki.allTitles();for(var i=0;i<a.length;i++){var s=a[i];var r=$tw.wiki.getTiddler(s);if(!e.isSystemOrDraft(r)){var l=r.fields[$tw.tmap.opt.field.nodeId];if(!l){l=e.genUUID();e.setField(r,$tw.tmap.opt.field.nodeId,l)}t.indeces.tById[l]=s;t.indeces.idByT[s]=l}}$tw.tmap.stop("Attaching Indeces")};var l=function(t){var a=t;var i=function(){};if($tw.tmap.opt.config.sys.debug==="true"&&console){a.logger=function(){if(arguments.length<2)return;var e=Array.prototype.slice.call(arguments);var t=e.shift(e);var a=console.hasOwnProperty(t)?t:"debug";console[a].apply(console,e)};a.start=function(e){console.time("timer: "+e)};a.stop=function(e){console.timeEnd("timer: "+e)}}else{a.logger=i;a.start=i;a.stop=i}a.notify=$tw.tmap.opt.config.sys.notifications==="true"?e.notify:i};var p=function(){for(var e=$tw.tmap.registry.length-1;e>=0;e--){var t=$tw.tmap.registry[e];if(!document.body.contains(t.getContainer())){$tw.tmap.logger("warn","A graph has been removed.");t.destruct();$tw.tmap.registry.splice(e,1)}}};var d=function(t,a,i){var s=$tw.tmap.opt;var r=e.getTiddlersWithField(a,i,{limit:2});delete r[t.fields.title];var l=Object.keys(r)[0];if(l){var p={param:{changedTiddler:t.fields.title,existingTiddler:l,idField:a,id:i},dialog:{buttons:"ok_suppress"}};$tw.tmap.dialogManager.open("dublicateIdInfo",p)}return l};var n=function(t){if(!t)t=$tw.tmap;if(!t.opt)t.opt=e.getDataMap();s(t.opt);l(t,t.opt);$tw.tmap.logger("warn","Rebuilt globals")};var o=function(t){var a=$tw.wiki.compileFilter("[prefix["+$tw.tmap.opt.path.options+"]!has[draft.of]]");$tw.wiki.addEventListener("change",function(i){$tw.tmap.start("Caretaker handling changes");t.handleChanges(i);$tw.tmap.logger("warn","These tiddlers changed:",i);var s=e.getMatches(a,Object.keys(i)).length;if(s){n()}for(var r in i){if(e.isSystemOrDraft(r))continue;var l=e.getTiddler(r);if(l){var p=$tw.tmap.opt.field.nodeId;var o=l.fields[p];if(o){var f=d(l,p,o);if(f){e.setField(l,$tw.tmap.opt.field.edges,undefined);$tw.tmap.adapter.assignId(l,true)}}$tw.tmap.adapter.assignId(l)}else{}}$tw.tmap.stop("Caretaker handling changes")})};var f=function(){if(e.tiddlerExists($tw.tmap.opt.ref.sysMeta))return;$tw.tmap.logger("warn","Creating meta file");var t=$tw.wiki.getTiddler($tw.tmap.opt.path.pluginRoot);$tw.wiki.setTiddlerData($tw.tmap.opt.ref.sysMeta,{originalVersion:t.fields.version,dataStructureState:"0.6.9",showWelcomeMessage:true})};exports.startup=function(){$tw.tmap=e.getDataMap();$tw.tmap.utils=e;$tw.tmap.registry=[];window.setInterval(p,1e3);n($tw.tmap);r($tw.tmap);$tw.tmap.adapter=new t;f();$tw.tmap.callbackManager=new i;$tw.tmap.dialogManager=new a($tw.tmap.callbackManager);o($tw.tmap.callbackManager);$tw.tmap.logger("warn","TiddlyMap's caretaker successfully started")}})();