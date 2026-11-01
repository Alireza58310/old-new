import{connect}from"cloudflare:sockets";
import{createHash,generateKeyPairSync}from"node:crypto";

// ══════ کتابخانه JSZip (شخص ثالث، مینیفای‌شده) + هلپرهای باندلر ══════
var objectCreate=Object.create,defineProperty=Object.defineProperty,getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor,getOwnPropertyNames=Object.getOwnPropertyNames,getPrototypeOf=Object.getPrototypeOf,hasOwn=Object.prototype.hasOwnProperty,dynamicRequire=(e=>"undefined"!=typeof require?require:"undefined"!=typeof Proxy?new Proxy(e,{get:(e,t)=>("undefined"!=typeof require?require:e)[t]}):e)(function(e){if("undefined"!=typeof require)return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),copyProperties=(e,a,s,i)=>{if(a&&"object"==typeof a||"function"==typeof a)for(let c of getOwnPropertyNames(a))hasOwn.call(e,c)||c===s||defineProperty(e,c,{get:()=>a[c],enumerable:!(i=getOwnPropertyDescriptor(a,c))||i.enumerable});return e},toEsModule=(r,n,o)=>(o=null!=r?objectCreate(getPrototypeOf(r)):{},copyProperties(!n&&r&&r.__esModule?o:defineProperty(o,"default",{value:r,enumerable:!0}),r)),requireJszip=((e,t)=>function r(){try{return t||(0,e[getOwnPropertyNames(e)[0]])((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}})({"node_modules/jszip/dist/jszip.min.js"(e,t){!function(r){"object"==typeof e&&void 0!==t?t.exports=r():"function"==typeof define&&define.amd?define([],r):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).JSZip=r()}(function(){return function e(t,r,n){function a(i,c){if(!r[i]){if(!t[i]){var l="function"==typeof dynamicRequire&&dynamicRequire;if(!c&&l)return l(i,!0);if(o)return o(i,!0);var u=new Error("Cannot find module '"+i+"'");throw u.code="MODULE_NOT_FOUND",u}var d=r[i]={exports:{}};t[i][0].call(d.exports,function(e){var r;return a(t[i][1][e]||e)},d,d.exports,e,t,r,n)}return r[i].exports}for(var o="function"==typeof dynamicRequire&&dynamicRequire,i=0;i<n.length;i++)a(n[i]);return a}({1:[function(e,t,r){var n=e("./utils"),a=e("./support"),o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,a,s,i,c,l,u=[],d=0,h=e.length,p=h,f="string"!==n.getTypeOf(e);d<e.length;)p=h-d,a=f?(t=e[d++],r=d<h?e[d++]:0,d<h?e[d++]:0):(t=e.charCodeAt(d++),r=d<h?e.charCodeAt(d++):0,d<h?e.charCodeAt(d++):0),s=t>>2,i=(3&t)<<4|r>>4,c=1<p?(15&r)<<2|a>>6:64,l=2<p?63&a:64,u.push(o.charAt(s)+o.charAt(i)+o.charAt(c)+o.charAt(l));return u.join("")},r.decode=function(e){var t,r,n,s,i,c,l=0,u=0,d="data:";if(e.substr(0,5)===d)throw new Error("Invalid base64 input, it looks like a data url.");var h,p=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(e.charAt(e.length-1)===o.charAt(64)&&p--,e.charAt(e.length-2)===o.charAt(64)&&p--,p%1!=0)throw new Error("Invalid base64 input, bad content length.");for(h=a.uint8array?new Uint8Array(0|p):new Array(0|p);l<e.length;)t=o.indexOf(e.charAt(l++))<<2|(s=o.indexOf(e.charAt(l++)))>>4,r=(15&s)<<4|(i=o.indexOf(e.charAt(l++)))>>2,n=(3&i)<<6|(c=o.indexOf(e.charAt(l++))),h[u++]=t,64!==i&&(h[u++]=r),64!==c&&(h[u++]=n);return h}},{"./support":30,"./utils":32}],2:[function(e,t,r){var n=e("./external"),a=e("./stream/DataWorker"),o=e("./stream/Crc32Probe"),s=e("./stream/DataLengthProbe");function i(e,t,r,n,a){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=a}i.prototype={getContentWorker:function(){var e=new a(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new a(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},i.createWorkerFrom=function(e,t,r){return e.pipe(new o).pipe(new s("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new s("compressedSize")).withStreamInfo("compression",t)},t.exports=i},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){var n=e("./utils"),a=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r,n){var o=a,s=0+r;e^=-1;for(var i=0;i<s;i++)e=e>>>8^o[255&(e^t[i])];return-1^e}(0|t,e,e.length,0):function(e,t,r,n){var o=a,s=0+r;e^=-1;for(var i=0;i<s;i++)e=e>>>8^o[255&(e^t.charCodeAt(i))];return-1^e}(0|t,e,e.length,0):0}},{"./utils":32}],5:[function(e,t,r){r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(e,t,r){var n=null;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n}},{lie:37}],7:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,a=e("pako"),o=e("./utils"),s=e("./stream/GenericWorker"),i=n?"uint8array":"array";function c(e,t){s.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}r.magic="\b\0",o.inherits(c,s),c.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(o.transformTo(i,e.data),!1)},c.prototype.flush=function(){s.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},c.prototype.cleanUp=function(){s.prototype.cleanUp.call(this),this._pako=null},c.prototype._createPako=function(){this._pako=new a[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(t){e.push({data:t,meta:e.meta})}},r.compressWorker=function(e){return new c("Deflate",e)},r.uncompressWorker=function(){return new c("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){function n(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function a(e,t,r,a,s,u){var d,h,p=e.file,f=e.compression,m=u!==i.utf8encode,g=o.transformTo("string",u(p.name)),y=o.transformTo("string",i.utf8encode(p.name)),w=p.comment,b=o.transformTo("string",u(w)),v=o.transformTo("string",i.utf8encode(w)),_=y.length!==p.name.length,k=v.length!==w.length,S="",x="",C="",E=p.dir,A=p.date,P={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(P.crc32=e.crc32,P.compressedSize=e.compressedSize,P.uncompressedSize=e.uncompressedSize);var T=0;t&&(T|=8),m||!_&&!k||(T|=2048);var D=0,I=0,R,N,U;E&&(D|=16),"UNIX"===s?(I=798,D|=(R=p.unixPermissions,N=E,U=R,R||(U=N?16893:33204),(65535&U)<<16)):(I=20,D|=function(e){return 63&(e||0)}(p.dosPermissions)),d=A.getUTCHours(),d<<=6,d|=A.getUTCMinutes(),d<<=5,d|=A.getUTCSeconds()/2,h=A.getUTCFullYear()-1980,h<<=4,h|=A.getUTCMonth()+1,h<<=5,h|=A.getUTCDate(),_&&(x=n(1,1)+n(c(g),4)+y,S+="up"+n(x.length,2)+x),k&&(C=n(1,1)+n(c(b),4)+v,S+="uc"+n(C.length,2)+C);var M="";return M+="\n\0",M+=n(T,2),M+=f.magic,M+=n(d,2),M+=n(h,2),M+=n(P.crc32,4),M+=n(P.compressedSize,4),M+=n(P.uncompressedSize,4),M+=n(g.length,2),M+=n(S.length,2),{fileRecord:l.LOCAL_FILE_HEADER+M+g+S,dirRecord:l.CENTRAL_FILE_HEADER+n(I,2)+M+n(b.length,2)+"\0\0\0\0"+n(D,4)+n(a,4)+g+S+b}}var o=e("../utils"),s=e("../stream/GenericWorker"),i=e("../utf8"),c=e("../crc32"),l=e("../signature");function u(e,t,r,n){s.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}o.inherits(u,s),u.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,s.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}))},u.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=a(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},u.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,r=a(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName),o;if(this.dirRecords.push(r.dirRecord),t)this.push({data:(o=e,l.DATA_DESCRIPTOR+n(o.crc32,4)+n(o.compressedSize,4)+n(o.uncompressedSize,4)),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},u.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r=this.bytesWritten-e,a=(s=this.dirRecords.length,i=r,c=e,u=this.zipComment,d=this.encodeFileName,h=o.transformTo("string",d(u)),l.CENTRAL_DIRECTORY_END+"\0\0\0\0"+n(s,2)+n(s,2)+n(i,4)+n(c,4)+n(h.length,2)+h),s,i,c,u,d,h;this.push({data:a,meta:{percent:100}})},u.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},u.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on("error",function(e){t.error(e)}),this},u.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},u.prototype.error=function(e){var t=this._sources;if(!s.prototype.error.call(this,e))return!1;for(var r=0;r<t.length;r++)try{t[r].error(e)}catch(e){}return!0},u.prototype.lock=function(){s.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=u},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){var n=e("../compressions"),a=e("./ZipFileWorker");r.generateWorker=function(e,t,r){var o=new a(t.streamFiles,r,t.platform,t.encodeFileName),s=0;try{e.forEach(function(e,r){s++;var a=function(e,t){var r=e||t,a=n[r];if(!a)throw new Error(r+" is not a valid compression method !");return a}(r.options.compression,t.compression),i=r.options.compressionOptions||t.compressionOptions||{},c=r.dir,l=r.date;r._compressWorker(a,i).withStreamInfo("file",{name:e,dir:c,date:l,comment:r.comment||"",unixPermissions:r.unixPermissions,dosPermissions:r.dosPermissions}).pipe(o)}),o.entriesCount=s}catch(e){o.error(e)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e}}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.10.1",n.loadAsync=function(e,t){return(new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){var n=e("./utils"),a=e("./external"),o=e("./utf8"),s=e("./zipEntries"),i=e("./stream/Crc32Probe"),c=e("./nodejsUtils");function l(e){return new a.Promise(function(t,r){var n=e.decompressed.getContentWorker().pipe(new i);n.on("error",function(e){r(e)}).on("end",function(){n.streamInfo.crc32!==e.decompressed.crc32?r(new Error("Corrupted zip : CRC32 mismatch")):t()}).resume()})}t.exports=function(e,t){var r=this;return t=n.extend(t||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:o.utf8decode}),c.isNode&&c.isStream(e)?a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):n.prepareContent("the loaded zip file",e,!0,t.optimizedBinaryString,t.base64).then(function(e){var r=new s(t);return r.load(e),r}).then(function(e){var r=[a.Promise.resolve(e)],n=e.files;if(t.checkCRC32)for(var o=0;o<n.length;o++)r.push(l(n[o]));return a.Promise.all(r)}).then(function(e){for(var a=e.shift(),o=a.files,s=0;s<o.length;s++){var i=o[s],c=i.fileNameStr,l=n.resolve(i.fileNameStr);r.file(l,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:t.createFolders}),i.dir||(r.file(l).unsafeOriginalName=c)}return a.zipComment.length&&(r.comment=a.zipComment),r})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){var n=e("../utils"),a=e("../stream/GenericWorker");function o(e,t){a.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t)}n.inherits(o,a),o.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}})}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e)}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end()})},o.prototype.pause=function(){return!!a.prototype.pause.call(this)&&(this._stream.pause(),!0)},o.prototype.resume=function(){return!!a.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=o},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){var n=e("readable-stream").Readable;function a(e,t,r){n.call(this,t),this._helper=e;var a=this;e.on("data",function(e,t){a.push(e)||a._helper.pause(),r&&r(t)}).on("error",function(e){a.emit("error",e)}).on("end",function(){a.push(null)})}e("../utils").inherits(a,n),a.prototype._read=function(){this._helper.resume()},t.exports=a},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}}},{}],15:[function(e,t,r){function n(e,t,r){var n,a=o.getTypeOf(t),i=o.extend(r||{},c);i.date=i.date||new Date,null!==i.compression&&(i.compression=i.compression.toUpperCase()),"string"==typeof i.unixPermissions&&(i.unixPermissions=parseInt(i.unixPermissions,8)),i.unixPermissions&&16384&i.unixPermissions&&(i.dir=!0),i.dosPermissions&&16&i.dosPermissions&&(i.dir=!0),i.dir&&(e=m(e)),i.createFolders&&(n=f(e))&&g.call(this,n,!0);var d="string"===a&&!1===i.binary&&!1===i.base64;r&&void 0!==r.binary||(i.binary=!d),(t instanceof l&&0===t.uncompressedSize||i.dir||!t||0===t.length)&&(i.base64=!1,i.binary=!0,t="",i.compression="STORE",a="string");var y=null;y=t instanceof l||t instanceof s?t:h.isNode&&h.isStream(t)?new p(e,t):o.prepareContent(e,t,i.binary,i.optimizedBinaryString,i.base64);var w=new u(e,y,i);this.files[e]=w}var a=e("./utf8"),o=e("./utils"),s=e("./stream/GenericWorker"),i=e("./stream/StreamHelper"),c=e("./defaults"),l=e("./compressedObject"),u=e("./zipObject"),d=e("./generate"),h=e("./nodejsUtils"),p=e("./nodejs/NodejsStreamInputAdapter"),f=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""},m=function(e){return"/"!==e.slice(-1)&&(e+="/"),e},g=function(e,t){return t=void 0!==t?t:c.createFolders,e=m(e),this.files[e]||n.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function y(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var w={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n)},filter:function(e){var t=[];return this.forEach(function(r,n){e(r,n)&&t.push(n)}),t},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,n.call(this,e,t,r),this;if(y(e)){var a=e;return this.filter(function(e,t){return!t.dir&&a.test(e)})}var o=this.files[this.root+e];return o&&!o.dir?o:null},folder:function(e){if(!e)return this;if(y(e))return this.filter(function(t,r){return r.dir&&e.test(t)});var t=this.root+e,r=g.call(this,t),n=this.clone();return n.root=r.name,n},remove:function(e){e=this.root+e;var t=this.files[e];if(t||("/"!==e.slice(-1)&&(e+="/"),t=this.files[e]),t&&!t.dir)delete this.files[e];else for(var r=this.filter(function(t,r){return r.name.slice(0,e.length)===e}),n=0;n<r.length;n++)delete this.files[r[n].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=o.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:a.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");o.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=d.generateWorker(this,r,n)}catch(e){(t=new s("error")).error(e)}return new i(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=w},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){t.exports=e("stream")},{stream:void 0}],17:[function(e,t,r){var n=e("./DataReader");function a(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e("../utils").inherits(a,n),a.prototype.byteAt=function(e){return this.data[this.zero+e]},a.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),a=e.charCodeAt(3),o=this.length-4;0<=o;--o)if(this.data[o]===t&&this.data[o+1]===r&&this.data[o+2]===n&&this.data[o+3]===a)return o-this.zero;return-1},a.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),a=e.charCodeAt(3),o=this.readData(4);return t===o[0]&&r===o[1]&&n===o[2]&&a===o[3]},a.prototype.readData=function(e){if(this.checkOffset(e),0===e)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=a},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){var n=e("../utils");function a(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}a.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=a},{"../utils":32}],19:[function(e,t,r){var n=e("./Uint8ArrayReader");function a(e){n.call(this,e)}e("../utils").inherits(a,n),a.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=a},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){var n=e("./DataReader");function a(e){n.call(this,e)}e("../utils").inherits(a,n),a.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},a.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},a.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},a.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=a},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){var n=e("./ArrayReader");function a(e){n.call(this,e)}e("../utils").inherits(a,n),a.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=a},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){var n=e("../utils"),a=e("../support"),o=e("./ArrayReader"),s=e("./StringReader"),i=e("./NodeBufferReader"),c=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||a.uint8array?"nodebuffer"===t?new i(e):a.uint8array?new c(n.transformTo("uint8array",e)):new o(n.transformTo("array",e)):new s(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(e,t,r){var n=e("./GenericWorker"),a=e("../utils");function o(e){n.call(this,"ConvertWorker to "+e),this.destType=e}a.inherits(o,n),o.prototype.processChunk=function(e){this.push({data:a.transformTo(this.destType,e.data),meta:e.meta})},t.exports=o},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){var n=e("./GenericWorker"),a=e("../crc32");function o(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(o,n),o.prototype.processChunk=function(e){this.streamInfo.crc32=a(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=o},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){var n=e("../utils"),a=e("./GenericWorker");function o(e){a.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0)}n.inherits(o,a),o.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}a.prototype.processChunk.call(this,e)},t.exports=o},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){var n=e("../utils"),a=e("./GenericWorker");function o(e){a.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}n.inherits(o,a),o.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this.data=null},o.prototype.resume=function(){return!!a.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},o.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},o.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=o},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}n.prototype={push:function(e){this.emit("data",e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(e){this.emit("error",e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.end()}),e.on("error",function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n},{}],29:[function(e,t,r){var n=e("../utils"),a=e("./ConvertWorker"),o=e("./GenericWorker"),s=e("../base64"),i=e("../support"),c=e("../external"),l=null;if(i.nodestream)try{l=e("../nodejs/NodejsStreamOutputAdapter")}catch(e){}function u(e,t){return new c.Promise(function(r,a){var o=[],i=e._internalType,c=e._outputType,l=e._mimeType;e.on("data",function(e,r){o.push(e),t&&t(r)}).on("error",function(e){o=[],a(e)}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return n.newBlob(n.transformTo("arraybuffer",t),r);case"base64":return s.encode(t);default:return n.transformTo(e,t)}}(c,function(e,t){var r,n=0,a=null,o=0;for(r=0;r<t.length;r++)o+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(a=new Uint8Array(o),r=0;r<t.length;r++)a.set(t[r],n),n+=t[r].length;return a;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,o),l);r(e)}catch(e){a(e)}o=[]}).resume()})}function d(e,t,r){var s=t;switch(t){case"blob":case"arraybuffer":s="uint8array";break;case"base64":s="string"}try{this._internalType=s,this._outputType=t,this._mimeType=r,n.checkSupport(s),this._worker=e.pipe(new a(s)),e.lock()}catch(e){this._worker=new o("error"),this._worker.error(e)}}d.prototype={accumulate:function(e){return u(this,e)},on:function(e,t){var r=this;return"data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta)}):this._worker.on(e,function(){n.delay(t,arguments,r)}),this},resume:function(){return n.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(n.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new l(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=d},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size}catch(e){try{var a=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);a.append(n),r.blob=0===a.getBlob("application/zip").size}catch(e){r.blob=!1}}}try{r.nodestream=!!e("readable-stream").Readable}catch(e){r.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,r){for(var n=e("./utils"),a=e("./support"),o=e("./nodejsUtils"),s=e("./stream/GenericWorker"),i=new Array(256),c=0;c<256;c++)i[c]=252<=c?6:248<=c?5:240<=c?4:224<=c?3:192<=c?2:1;function l(){s.call(this,"utf-8 decode"),this.leftOver=null}function u(){s.call(this,"utf-8 encode")}i[254]=i[254]=1,r.utf8encode=function(e){return a.nodebuffer?o.newBufferFrom(e,"utf-8"):function(e){var t,r,n,o,s,i=e.length,c=0;for(o=0;o<i;o++)55296==(64512&(r=e.charCodeAt(o)))&&o+1<i&&56320==(64512&(n=e.charCodeAt(o+1)))&&(r=65536+(r-55296<<10)+(n-56320),o++),c+=r<128?1:r<2048?2:r<65536?3:4;for(t=a.uint8array?new Uint8Array(c):new Array(c),o=s=0;s<c;o++)55296==(64512&(r=e.charCodeAt(o)))&&o+1<i&&56320==(64512&(n=e.charCodeAt(o+1)))&&(r=65536+(r-55296<<10)+(n-56320),o++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},r.utf8decode=function(e){return a.nodebuffer?n.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,a,o,s=e.length,c=new Array(2*s);for(t=r=0;t<s;)if((a=e[t++])<128)c[r++]=a;else if(4<(o=i[a]))c[r++]=65533,t+=o-1;else{for(a&=2===o?31:3===o?15:7;1<o&&t<s;)a=a<<6|63&e[t++],o--;1<o?c[r++]=65533:a<65536?c[r++]=a:(a-=65536,c[r++]=55296|a>>10&1023,c[r++]=56320|1023&a)}return c.length!==r&&(c.subarray?c=c.subarray(0,r):c.length=r),n.applyFromCharCode(c)}(e=n.transformTo(a.uint8array?"uint8array":"array",e))},n.inherits(l,s),l.prototype.processChunk=function(e){var t=n.transformTo(a.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(a.uint8array){var o=t;(t=new Uint8Array(o.length+this.leftOver.length)).set(this.leftOver,0),t.set(o,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var s=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0||0===r?t:r+i[e[r]]>t?r:t}(t),c=t;s!==t.length&&(a.uint8array?(c=t.subarray(0,s),this.leftOver=t.subarray(s,t.length)):(c=t.slice(0,s),this.leftOver=t.slice(s,t.length))),this.push({data:r.utf8decode(c),meta:e.meta})},l.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:r.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},r.Utf8DecodeWorker=l,n.inherits(u,s),u.prototype.processChunk=function(e){this.push({data:r.utf8encode(e.data),meta:e.meta})},r.Utf8EncodeWorker=u},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,r){var n=e("./support"),a=e("./base64"),o=e("./nodejsUtils"),s=e("./external");function i(e){return e}function c(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}e("setimmediate"),r.newBlob=function(e,t){r.checkSupport("blob");try{return new Blob([e],{type:t})}catch(r){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(e),n.getBlob(t)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var l={stringifyByChunk:function(e,t,r){var n=[],a=0,o=e.length;if(o<=r)return String.fromCharCode.apply(null,e);for(;a<o;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(a,Math.min(a+r,o)))):n.push(String.fromCharCode.apply(null,e.subarray(a,Math.min(a+r,o)))),a+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return n.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return!1}}(),nodebuffer:function(){try{return n.nodebuffer&&1===String.fromCharCode.apply(null,o.allocBuffer(1)).length}catch(e){return!1}}()}};function u(e){var t=65536,n=r.getTypeOf(e),a=!0;if("uint8array"===n?a=l.applyCanBeUsed.uint8array:"nodebuffer"===n&&(a=l.applyCanBeUsed.nodebuffer),a)for(;1<t;)try{return l.stringifyByChunk(e,n,t)}catch(e){t=Math.floor(t/2)}return l.stringifyByChar(e)}function d(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}r.applyFromCharCode=u;var h={};h.string={string:i,array:function(e){return c(e,new Array(e.length))},arraybuffer:function(e){return h.string.uint8array(e).buffer},uint8array:function(e){return c(e,new Uint8Array(e.length))},nodebuffer:function(e){return c(e,o.allocBuffer(e.length))}},h.array={string:u,array:i,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return o.newBufferFrom(e)}},h.arraybuffer={string:function(e){return u(new Uint8Array(e))},array:function(e){return d(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:i,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return o.newBufferFrom(new Uint8Array(e))}},h.uint8array={string:u,array:function(e){return d(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:i,nodebuffer:function(e){return o.newBufferFrom(e)}},h.nodebuffer={string:u,array:function(e){return d(e,new Array(e.length))},arraybuffer:function(e){return h.nodebuffer.uint8array(e).buffer},uint8array:function(e){return d(e,new Uint8Array(e.length))},nodebuffer:i},r.transformTo=function(e,t){if(t=t||"",!e)return t;r.checkSupport(e);var n=r.getTypeOf(t);return h[n][e](t)},r.resolve=function(e){for(var t=e.split("/"),r=[],n=0;n<t.length;n++){var a=t[n];"."===a||""===a&&0!==n&&n!==t.length-1||(".."===a?r.pop():r.push(a))}return r.join("/")},r.getTypeOf=function(e){return"string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":n.nodebuffer&&o.isBuffer(e)?"nodebuffer":n.uint8array&&e instanceof Uint8Array?"uint8array":n.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},r.checkSupport=function(e){if(!n[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},r.MAX_VALUE_16BITS=65535,r.MAX_VALUE_32BITS=-1,r.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},r.delay=function(e,t,r){setImmediate(function(){e.apply(r||null,t||[])})},r.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r},r.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},r.prepareContent=function(e,t,o,i,l){return s.Promise.resolve(t).then(function(e){return n.blob&&(e instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(e)))&&"undefined"!=typeof FileReader?new s.Promise(function(t,r){var n=new FileReader;n.onload=function(e){t(e.target.result)},n.onerror=function(e){r(e.target.error)},n.readAsArrayBuffer(e)}):e}).then(function(t){var u=r.getTypeOf(t),d;return u?("arraybuffer"===u?t=r.transformTo("uint8array",t):"string"===u&&(l?t=a.decode(t):o&&!0!==i&&(t=c(d=t,n.uint8array?new Uint8Array(d.length):new Array(d.length)))),t):s.Promise.reject(new Error("Can't read the data of '"+e+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,r){var n=e("./reader/readerFor"),a=e("./utils"),o=e("./signature"),s=e("./zipEntry"),i=e("./support");function c(e){this.files=[],this.loadOptions=e}c.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+a.pretty(t)+", expected "+a.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=i.uint8array?"uint8array":"array",r=a.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(o.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER);)(e=new s({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);if(e<0)throw this.isSignature(0,o.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(e);var t=e;if(this.checkSignature(o.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===a.MAX_VALUE_16BITS||this.diskWithCentralDirStart===a.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===a.MAX_VALUE_16BITS||this.centralDirRecords===a.MAX_VALUE_16BITS||this.centralDirSize===a.MAX_VALUE_32BITS||this.centralDirOffset===a.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,o.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,o.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=c},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){var n=e("./reader/readerFor"),a=e("./utils"),o=e("./compressedObject"),s=e("./crc32"),i=e("./utf8"),c=e("./compressions"),l=e("./support");function u(e,t){this.options=e,this.loadOptions=t}u.prototype={isEncrypted:function(){return!(1&~this.bitFlag)},useUTF8:function(){return!(2048&~this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in c)if(Object.prototype.hasOwnProperty.call(c,t)&&c[t].magic===e)return c[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+a.pretty(this.compressionMethod)+" unknown (inner file : "+a.transformTo("string",this.fileName)+")");this.decompressed=new o(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=n(this.extraFields[1].value);this.uncompressedSize===a.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===a.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===a.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===a.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(e){var t,r,n,a=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<a;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(a)},handleUTF8:function(){var e=l.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=i.utf8decode(this.fileName),this.fileCommentStr=i.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else{var r=a.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else{var o=a.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(o)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)||s(this.fileName)!==t.readInt(4)?null:i.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)||s(this.fileComment)!==t.readInt(4)?null:i.utf8decode(t.readData(e.length-5))}return null}},t.exports=u},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var a=e("./stream/StreamHelper"),o=e("./stream/DataWorker"),s=e("./utf8"),i=e("./compressedObject"),c=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var o=!this._dataBinary;o&&!n&&(t=t.pipe(new s.Utf8EncodeWorker)),!o&&n&&(t=t.pipe(new s.Utf8DecodeWorker))}catch(e){(t=new c("error")).error(e)}return new a(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof i&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new s.Utf8EncodeWorker)),i.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof i?this._data.getContentWorker():this._data instanceof c?this._data:new o(this._data)}};for(var l=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],u=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},d=0;d<l.length;d++)n.prototype[l[d]]=u;t.exports=n},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,t,r){(function(e){var r,n,a=e.MutationObserver||e.WebKitMutationObserver;if(a){var o=0,s=new a(u),i=e.document.createTextNode("");s.observe(i,{characterData:!0}),r=function(){i.data=o=++o%2}}else if(e.setImmediate||void 0===e.MessageChannel)r="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){u(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(u,0)};else{var c=new e.MessageChannel;c.port1.onmessage=u,r=function(){c.port2.postMessage(0)}}var l=[];function u(){var e,t;n=!0;for(var r=l.length;r;){for(t=l,l=[],e=-1;++e<r;)t[e]();r=l.length}n=!1}t.exports=function(e){1!==l.push(e)||n||r()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(e,t,r){var n=e("immediate");function a(){}var o={},s=["REJECTED"],i=["FULFILLED"],c=["PENDING"];function l(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=c,this.queue=[],this.outcome=void 0,e!==a&&p(this,e)}function u(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function d(e,t,r){n(function(){var n;try{n=t(r)}catch(t){return o.reject(e,t)}n===e?o.reject(e,new TypeError("Cannot resolve promise with itself")):o.resolve(e,n)})}function h(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function p(e,t){var r=!1;function n(t){r||(r=!0,o.reject(e,t))}function a(t){r||(r=!0,o.resolve(e,t))}var s=f(function(){t(a,n)});"error"===s.status&&n(s.value)}function f(e,t){var r={};try{r.value=e(t),r.status="success"}catch(e){r.status="error",r.value=e}return r}(t.exports=l).prototype.finally=function(e){if("function"!=typeof e)return this;var t=this.constructor;return this.then(function(r){return t.resolve(e()).then(function(){return r})},function(r){return t.resolve(e()).then(function(){throw r})})},l.prototype.catch=function(e){return this.then(null,e)},l.prototype.then=function(e,t){if("function"!=typeof e&&this.state===i||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(a);return this.state!==c?d(r,this.state===i?e:t,this.outcome):this.queue.push(new u(r,e,t)),r},u.prototype.callFulfilled=function(e){o.resolve(this.promise,e)},u.prototype.otherCallFulfilled=function(e){d(this.promise,this.onFulfilled,e)},u.prototype.callRejected=function(e){o.reject(this.promise,e)},u.prototype.otherCallRejected=function(e){d(this.promise,this.onRejected,e)},o.resolve=function(e,t){var r=f(h,t);if("error"===r.status)return o.reject(e,r.value);var n=r.value;if(n)p(e,n);else{e.state=i,e.outcome=t;for(var a=-1,s=e.queue.length;++a<s;)e.queue[a].callFulfilled(t)}return e},o.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},l.resolve=function(e){return e instanceof this?e:o.resolve(new this(a),e)},l.reject=function(e){var t=new this(a);return o.reject(t,e)},l.all=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);for(var s=new Array(r),i=0,c=-1,l=new this(a);++c<r;)u(e[c],c);return l;function u(e,a){t.resolve(e).then(function(e){s[a]=e,++i!==r||n||(n=!0,o.resolve(l,s))},function(e){n||(n=!0,o.reject(l,e))})}},l.race=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);for(var s=-1,i=new this(a),c;++s<r;)c=e[s],t.resolve(c).then(function(e){n||(n=!0,o.resolve(i,e))},function(e){n||(n=!0,o.reject(i,e))});return i}},{immediate:36}],38:[function(e,t,r){var n={};(0,e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){var n=e("./zlib/deflate"),a=e("./utils/common"),o=e("./utils/strings"),s=e("./zlib/messages"),i=e("./zlib/zstream"),c=Object.prototype.toString,l=0,u=-1,d=0,h=8;function p(e){if(!(this instanceof p))return new p(e);this.options=a.assign({level:u,method:8,chunkSize:16384,windowBits:15,memLevel:8,strategy:0,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=n.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(0!==r)throw new Error(s[r]);if(t.header&&n.deflateSetHeader(this.strm,t.header),t.dictionary){var l;if(l="string"==typeof t.dictionary?o.string2buf(t.dictionary):"[object ArrayBuffer]"===c.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,0!==(r=n.deflateSetDictionary(this.strm,l)))throw new Error(s[r]);this._dict_set=!0}}function f(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||s[r.err];return r.result}p.prototype.push=function(e,t){var r,s,i=this.strm,l=this.options.chunkSize;if(this.ended)return!1;s=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=o.string2buf(e):"[object ArrayBuffer]"===c.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new a.Buf8(l),i.next_out=0,i.avail_out=l),1!==(r=n.deflate(i,s))&&0!==r)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==s&&2!==s)||("string"===this.options.to?this.onData(o.buf2binstring(a.shrinkBuf(i.output,i.next_out))):this.onData(a.shrinkBuf(i.output,i.next_out)))}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===s?(r=n.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,0===r):2!==s||(this.onEnd(0),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){0===e&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=a.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Deflate=p,r.deflate=f,r.deflateRaw=function(e,t){return(t=t||{}).raw=!0,f(e,t)},r.gzip=function(e,t){return(t=t||{}).gzip=!0,f(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){var n=e("./zlib/inflate"),a=e("./utils/common"),o=e("./utils/strings"),s=e("./zlib/constants"),i=e("./zlib/messages"),c=e("./zlib/zstream"),l=e("./zlib/gzheader"),u=Object.prototype.toString;function d(e){if(!(this instanceof d))return new d(e);this.options=a.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&!(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var r=n.inflateInit2(this.strm,t.windowBits);if(r!==s.Z_OK)throw new Error(i[r]);this.header=new l,n.inflateGetHeader(this.strm,this.header)}function h(e,t){var r=new d(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}d.prototype.push=function(e,t){var r,i,c,l,d,h,p=this.strm,f=this.options.chunkSize,m=this.options.dictionary,g=!1;if(this.ended)return!1;i=t===~~t?t:!0===t?s.Z_FINISH:s.Z_NO_FLUSH,"string"==typeof e?p.input=o.binstring2buf(e):"[object ArrayBuffer]"===u.call(e)?p.input=new Uint8Array(e):p.input=e,p.next_in=0,p.avail_in=p.input.length;do{if(0===p.avail_out&&(p.output=new a.Buf8(f),p.next_out=0,p.avail_out=f),(r=n.inflate(p,s.Z_NO_FLUSH))===s.Z_NEED_DICT&&m&&(h="string"==typeof m?o.string2buf(m):"[object ArrayBuffer]"===u.call(m)?new Uint8Array(m):m,r=n.inflateSetDictionary(this.strm,h)),r===s.Z_BUF_ERROR&&!0===g&&(r=s.Z_OK,g=!1),r!==s.Z_STREAM_END&&r!==s.Z_OK)return this.onEnd(r),!(this.ended=!0);p.next_out&&(0!==p.avail_out&&r!==s.Z_STREAM_END&&(0!==p.avail_in||i!==s.Z_FINISH&&i!==s.Z_SYNC_FLUSH)||("string"===this.options.to?(c=o.utf8border(p.output,p.next_out),l=p.next_out-c,d=o.buf2string(p.output,c),p.next_out=l,p.avail_out=f-l,l&&a.arraySet(p.output,p.output,c,l,0),this.onData(d)):this.onData(a.shrinkBuf(p.output,p.next_out)))),0===p.avail_in&&0===p.avail_out&&(g=!0)}while((0<p.avail_in||0===p.avail_out)&&r!==s.Z_STREAM_END);return r===s.Z_STREAM_END&&(i=s.Z_FINISH),i===s.Z_FINISH?(r=n.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===s.Z_OK):i!==s.Z_SYNC_FLUSH||(this.onEnd(s.Z_OK),!(p.avail_out=0))},d.prototype.onData=function(e){this.chunks.push(e)},d.prototype.onEnd=function(e){e===s.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=a.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Inflate=d,r.inflate=h,r.inflateRaw=function(e,t){return(t=t||{}).raw=!0,h(e,t)},r.ungzip=h},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var a={arraySet:function(e,t,r,n,a){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),a);else for(var o=0;o<n;o++)e[a+o]=t[r+o]},flattenChunks:function(e){var t,r,n,a,o,s;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(s=new Uint8Array(n),t=a=0,r=e.length;t<r;t++)o=e[t],s.set(o,a),a+=o.length;return s}},o={arraySet:function(e,t,r,n,a){for(var o=0;o<n;o++)e[a+o]=t[r+o]},flattenChunks:function(e){return[].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,a)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,o))},r.setTyped(n)},{}],42:[function(e,t,r){var n=e("./common"),a=!0,o=!0;try{String.fromCharCode.apply(null,[0])}catch(e){a=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){o=!1}for(var s=new n.Buf8(256),i=0;i<256;i++)s[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function c(e,t){if(t<65537&&(e.subarray&&o||!e.subarray&&a))return String.fromCharCode.apply(null,n.shrinkBuf(e,t));for(var r="",s=0;s<t;s++)r+=String.fromCharCode(e[s]);return r}s[254]=s[254]=1,r.string2buf=function(e){var t,r,a,o,s,i=e.length,c=0;for(o=0;o<i;o++)55296==(64512&(r=e.charCodeAt(o)))&&o+1<i&&56320==(64512&(a=e.charCodeAt(o+1)))&&(r=65536+(r-55296<<10)+(a-56320),o++),c+=r<128?1:r<2048?2:r<65536?3:4;for(t=new n.Buf8(c),o=s=0;s<c;o++)55296==(64512&(r=e.charCodeAt(o)))&&o+1<i&&56320==(64512&(a=e.charCodeAt(o+1)))&&(r=65536+(r-55296<<10)+(a-56320),o++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return c(e,e.length)},r.binstring2buf=function(e){for(var t=new n.Buf8(e.length),r=0,a=t.length;r<a;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,a,o,i=t||e.length,l=new Array(2*i);for(r=n=0;r<i;)if((a=e[r++])<128)l[n++]=a;else if(4<(o=s[a]))l[n++]=65533,r+=o-1;else{for(a&=2===o?31:3===o?15:7;1<o&&r<i;)a=a<<6|63&e[r++],o--;1<o?l[n++]=65533:a<65536?l[n++]=a:(a-=65536,l[n++]=55296|a>>10&1023,l[n++]=56320|1023&a)}return c(l,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0||0===r?t:r+s[e[r]]>t?r:t}},{"./common":41}],43:[function(e,t,r){t.exports=function(e,t,r,n){for(var a=65535&e,o=e>>>16&65535,s=0;0!==r;){for(r-=s=2e3<r?2e3:r;o=o+(a=a+t[n++]|0)|0,--s;);a%=65521,o%=65521}return a|o<<16}},{}],44:[function(e,t,r){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,r){var n=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t,r,a){var o=n,s=a+r;e^=-1;for(var i=a;i<s;i++)e=e>>>8^o[255&(e^t[i])];return-1^e}},{}],46:[function(e,t,r){var n,a=e("../utils/common"),o=e("./trees"),s=e("./adler32"),i=e("./crc32"),c=e("./messages"),l=0,u=4,d=0,h=-2,p=-1,f=4,m=2,g=8,y=9,w=286,b=30,v=19,_=573,k=15,S=3,x=258,C=262,E=42,A=113,P=1,T=2,D=3,I=4;function R(e,t){return e.msg=c[t],t}function N(e){return(e<<1)-(4<e?9:0)}function U(e){for(var t=e.length;0<=--t;)e[t]=0}function M(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(a.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0))}function L(e,t){o._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,M(e.strm)}function O(e,t){e.pending_buf[e.pending++]=t}function B(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function $(e,t){var r,n,a=e.max_chain_length,o=e.strstart,s=e.prev_length,i=e.nice_match,c=e.strstart>e.w_size-C?e.strstart-(e.w_size-C):0,l=e.window,u=e.w_mask,d=e.prev,h=e.strstart+x,p=l[o+s-1],f=l[o+s];e.prev_length>=e.good_match&&(a>>=2),i>e.lookahead&&(i=e.lookahead);do{if(l[(r=t)+s]===f&&l[r+s-1]===p&&l[r]===l[o]&&l[++r]===l[o+1]){o+=2,r++;do{}while(l[++o]===l[++r]&&l[++o]===l[++r]&&l[++o]===l[++r]&&l[++o]===l[++r]&&l[++o]===l[++r]&&l[++o]===l[++r]&&l[++o]===l[++r]&&l[++o]===l[++r]&&o<h);if(n=x-(h-o),o=h-x,s<n){if(e.match_start=t,i<=(s=n))break;p=l[o+s-1],f=l[o+s]}}}while((t=d[t&u])>c&&0!=--a);return s<=e.lookahead?s:e.lookahead}function z(e){var t,r,n,o,c,l,u,d,h,p,f=e.w_size;do{if(o=e.window_size-e.lookahead-e.strstart,e.strstart>=f+(f-C)){for(a.arraySet(e.window,e.window,f,f,0),e.match_start-=f,e.strstart-=f,e.block_start-=f,t=r=e.hash_size;n=e.head[--t],e.head[t]=f<=n?n-f:0,--r;);for(t=r=f;n=e.prev[--t],e.prev[t]=f<=n?n-f:0,--r;);o+=f}if(0===e.strm.avail_in)break;if(l=e.strm,u=e.window,d=e.strstart+e.lookahead,p=void 0,(h=o)<(p=l.avail_in)&&(p=h),r=0===p?0:(l.avail_in-=p,a.arraySet(u,l.input,l.next_in,p,d),1===l.state.wrap?l.adler=s(l.adler,u,p,d):2===l.state.wrap&&(l.adler=i(l.adler,u,p,d)),l.next_in+=p,l.total_in+=p,p),e.lookahead+=r,e.lookahead+e.insert>=3)for(c=e.strstart-e.insert,e.ins_h=e.window[c],e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+3-1])&e.hash_mask,e.prev[c&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=c,c++,e.insert--,!(e.lookahead+e.insert<3)););}while(e.lookahead<C&&0!==e.strm.avail_in)}function j(e,t){for(var r,n;;){if(e.lookahead<C){if(z(e),e.lookahead<C&&0===t)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=3&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-C&&(e.match_length=$(e,r)),e.match_length>=3)if(n=o._tr_tally(e,e.strstart-e.match_start,e.match_length-3),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=3){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=o._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(L(e,!1),0===e.strm.avail_out))return 1}return e.insert=e.strstart<2?e.strstart:2,4===t?(L(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(L(e,!1),0===e.strm.avail_out)?1:2}function H(e,t){for(var r,n,a;;){if(e.lookahead<C){if(z(e),e.lookahead<C&&0===t)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=3&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=2,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-C&&(e.match_length=$(e,r),e.match_length<=5&&(1===e.strategy||3===e.match_length&&4096<e.strstart-e.match_start)&&(e.match_length=2)),e.prev_length>=3&&e.match_length<=e.prev_length){for(a=e.strstart+e.lookahead-3,n=o._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-3),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=a&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=2,e.strstart++,n&&(L(e,!1),0===e.strm.avail_out))return 1}else if(e.match_available){if((n=o._tr_tally(e,0,e.window[e.strstart-1]))&&L(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return 1}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(n=o._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<2?e.strstart:2,4===t?(L(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(L(e,!1),0===e.strm.avail_out)?1:2}function W(e,t,r,n,a){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=a}function F(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=8,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new a.Buf16(2*_),this.dyn_dtree=new a.Buf16(122),this.bl_tree=new a.Buf16(78),U(this.dyn_ltree),U(this.dyn_dtree),U(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new a.Buf16(16),this.heap=new a.Buf16(573),U(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new a.Buf16(573),U(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=2,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?E:A,e.adler=2===t.wrap?0:1,t.last_flush=0,o._tr_init(t),0):R(e,h)}function V(e){var t=G(e),r;return 0===t&&((r=e.state).window_size=2*r.w_size,U(r.head),r.max_lazy_match=n[r.level].max_lazy,r.good_match=n[r.level].good_length,r.nice_match=n[r.level].nice_length,r.max_chain_length=n[r.level].max_chain,r.strstart=0,r.block_start=0,r.lookahead=0,r.insert=0,r.match_length=r.prev_length=2,r.match_available=0,r.ins_h=0),t}function K(e,t,r,n,o,s){if(!e)return h;var i=1;if(t===p&&(t=6),n<0?(i=0,n=-n):15<n&&(i=2,n-=16),o<1||9<o||8!==r||n<8||15<n||t<0||9<t||s<0||4<s)return R(e,h);8===n&&(n=9);var c=new F;return(e.state=c).strm=e,c.wrap=i,c.gzhead=null,c.w_bits=n,c.w_size=1<<c.w_bits,c.w_mask=c.w_size-1,c.hash_bits=o+7,c.hash_size=1<<c.hash_bits,c.hash_mask=c.hash_size-1,c.hash_shift=~~((c.hash_bits+3-1)/3),c.window=new a.Buf8(2*c.w_size),c.head=new a.Buf16(c.hash_size),c.prev=new a.Buf16(c.w_size),c.lit_bufsize=1<<o+6,c.pending_buf_size=4*c.lit_bufsize,c.pending_buf=new a.Buf8(c.pending_buf_size),c.d_buf=1*c.lit_bufsize,c.l_buf=3*c.lit_bufsize,c.level=t,c.strategy=s,c.method=r,V(e)}n=[new W(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(z(e),0===e.lookahead&&0===t)return 1;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,L(e,!1),0===e.strm.avail_out))return 1;if(e.strstart-e.block_start>=e.w_size-C&&(L(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(L(e,!0),0===e.strm.avail_out?3:4):(e.strstart>e.block_start&&(L(e,!1),e.strm.avail_out),1)}),new W(4,4,8,4,j),new W(4,5,16,8,j),new W(4,6,32,32,j),new W(4,4,16,16,H),new W(8,16,32,32,H),new W(8,16,128,128,H),new W(8,32,128,256,H),new W(32,128,258,1024,H),new W(32,258,258,4096,H)],r.deflateInit=function(e,t){return K(e,t,8,15,8,0)},r.deflateInit2=K,r.deflateReset=V,r.deflateResetKeep=G,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?h:(e.state.gzhead=t,0):h},r.deflate=function(e,t){var r,a,s,c;if(!e||!e.state||5<t||t<0)return e?R(e,h):h;if(a=e.state,!e.output||!e.input&&0!==e.avail_in||666===a.status&&4!==t)return R(e,0===e.avail_out?-5:h);if(a.strm=e,r=a.last_flush,a.last_flush=t,a.status===E)if(2===a.wrap)e.adler=0,O(a,31),O(a,139),O(a,8),a.gzhead?(O(a,(a.gzhead.text?1:0)+(a.gzhead.hcrc?2:0)+(a.gzhead.extra?4:0)+(a.gzhead.name?8:0)+(a.gzhead.comment?16:0)),O(a,255&a.gzhead.time),O(a,a.gzhead.time>>8&255),O(a,a.gzhead.time>>16&255),O(a,a.gzhead.time>>24&255),O(a,9===a.level?2:2<=a.strategy||a.level<2?4:0),O(a,255&a.gzhead.os),a.gzhead.extra&&a.gzhead.extra.length&&(O(a,255&a.gzhead.extra.length),O(a,a.gzhead.extra.length>>8&255)),a.gzhead.hcrc&&(e.adler=i(e.adler,a.pending_buf,a.pending,0)),a.gzindex=0,a.status=69):(O(a,0),O(a,0),O(a,0),O(a,0),O(a,0),O(a,9===a.level?2:2<=a.strategy||a.level<2?4:0),O(a,3),a.status=A);else{var l=8+(a.w_bits-8<<4)<<8;l|=(2<=a.strategy||a.level<2?0:a.level<6?1:6===a.level?2:3)<<6,0!==a.strstart&&(l|=32),l+=31-l%31,a.status=A,B(a,l),0!==a.strstart&&(B(a,e.adler>>>16),B(a,65535&e.adler)),e.adler=1}if(69===a.status)if(a.gzhead.extra){for(s=a.pending;a.gzindex<(65535&a.gzhead.extra.length)&&(a.pending!==a.pending_buf_size||(a.gzhead.hcrc&&a.pending>s&&(e.adler=i(e.adler,a.pending_buf,a.pending-s,s)),M(e),s=a.pending,a.pending!==a.pending_buf_size));)O(a,255&a.gzhead.extra[a.gzindex]),a.gzindex++;a.gzhead.hcrc&&a.pending>s&&(e.adler=i(e.adler,a.pending_buf,a.pending-s,s)),a.gzindex===a.gzhead.extra.length&&(a.gzindex=0,a.status=73)}else a.status=73;if(73===a.status)if(a.gzhead.name){s=a.pending;do{if(a.pending===a.pending_buf_size&&(a.gzhead.hcrc&&a.pending>s&&(e.adler=i(e.adler,a.pending_buf,a.pending-s,s)),M(e),s=a.pending,a.pending===a.pending_buf_size)){c=1;break}c=a.gzindex<a.gzhead.name.length?255&a.gzhead.name.charCodeAt(a.gzindex++):0,O(a,c)}while(0!==c);a.gzhead.hcrc&&a.pending>s&&(e.adler=i(e.adler,a.pending_buf,a.pending-s,s)),0===c&&(a.gzindex=0,a.status=91)}else a.status=91;if(91===a.status)if(a.gzhead.comment){s=a.pending;do{if(a.pending===a.pending_buf_size&&(a.gzhead.hcrc&&a.pending>s&&(e.adler=i(e.adler,a.pending_buf,a.pending-s,s)),M(e),s=a.pending,a.pending===a.pending_buf_size)){c=1;break}c=a.gzindex<a.gzhead.comment.length?255&a.gzhead.comment.charCodeAt(a.gzindex++):0,O(a,c)}while(0!==c);a.gzhead.hcrc&&a.pending>s&&(e.adler=i(e.adler,a.pending_buf,a.pending-s,s)),0===c&&(a.status=103)}else a.status=103;if(103===a.status&&(a.gzhead.hcrc?(a.pending+2>a.pending_buf_size&&M(e),a.pending+2<=a.pending_buf_size&&(O(a,255&e.adler),O(a,e.adler>>8&255),e.adler=0,a.status=A)):a.status=A),0!==a.pending){if(M(e),0===e.avail_out)return a.last_flush=-1,0}else if(0===e.avail_in&&N(t)<=N(r)&&4!==t)return R(e,-5);if(666===a.status&&0!==e.avail_in)return R(e,-5);if(0!==e.avail_in||0!==a.lookahead||0!==t&&666!==a.status){var u=2===a.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(z(e),0===e.lookahead)){if(0===t)return 1;break}if(e.match_length=0,r=o._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(L(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(L(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(L(e,!1),0===e.strm.avail_out)?1:2}(a,t):3===a.strategy?function(e,t){for(var r,n,a,s,i=e.window;;){if(e.lookahead<=x){if(z(e),e.lookahead<=x&&0===t)return 1;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=3&&0<e.strstart&&(n=i[a=e.strstart-1])===i[++a]&&n===i[++a]&&n===i[++a]){s=e.strstart+x;do{}while(n===i[++a]&&n===i[++a]&&n===i[++a]&&n===i[++a]&&n===i[++a]&&n===i[++a]&&n===i[++a]&&n===i[++a]&&a<s);e.match_length=x-(s-a),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=3?(r=o._tr_tally(e,1,e.match_length-3),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=o._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(L(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(L(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(L(e,!1),0===e.strm.avail_out)?1:2}(a,t):n[a.level].func(a,t);if(3!==u&&4!==u||(a.status=666),1===u||3===u)return 0===e.avail_out&&(a.last_flush=-1),0;if(2===u&&(1===t?o._tr_align(a):5!==t&&(o._tr_stored_block(a,0,0,!1),3===t&&(U(a.head),0===a.lookahead&&(a.strstart=0,a.block_start=0,a.insert=0))),M(e),0===e.avail_out))return a.last_flush=-1,0}return 4!==t?0:a.wrap<=0?1:(2===a.wrap?(O(a,255&e.adler),O(a,e.adler>>8&255),O(a,e.adler>>16&255),O(a,e.adler>>24&255),O(a,255&e.total_in),O(a,e.total_in>>8&255),O(a,e.total_in>>16&255),O(a,e.total_in>>24&255)):(B(a,e.adler>>>16),B(a,65535&e.adler)),M(e),0<a.wrap&&(a.wrap=-a.wrap),0!==a.pending?0:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==E&&69!==t&&73!==t&&91!==t&&103!==t&&t!==A&&666!==t?R(e,h):(e.state=null,t===A?R(e,-3):0):h},r.deflateSetDictionary=function(e,t){var r,n,o,i,c,l,u,d,p=t.length;if(!e||!e.state)return h;if(2===(i=(r=e.state).wrap)||1===i&&r.status!==E||r.lookahead)return h;for(1===i&&(e.adler=s(e.adler,t,p,0)),r.wrap=0,p>=r.w_size&&(0===i&&(U(r.head),r.strstart=0,r.block_start=0,r.insert=0),d=new a.Buf8(r.w_size),a.arraySet(d,t,p-r.w_size,r.w_size,0),t=d,p=r.w_size),c=e.avail_in,l=e.next_in,u=e.input,e.avail_in=p,e.next_in=0,e.input=t,z(r);r.lookahead>=3;){for(n=r.strstart,o=r.lookahead-2;r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+3-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--o;);r.strstart=n,r.lookahead=2,z(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=2,r.match_available=0,e.next_in=l,e.input=u,e.avail_in=c,r.wrap=i,0},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,t,r){t.exports=function(e,t){var r,n,a,o,s,i,c,l,u,d,h,p,f,m,g,y,w,b,v,_,k,S,x,C,E;r=e.state,n=e.next_in,C=e.input,a=n+(e.avail_in-5),o=e.next_out,E=e.output,s=o-(t-e.avail_out),i=o+(e.avail_out-257),c=r.dmax,l=r.wsize,u=r.whave,d=r.wnext,h=r.window,p=r.hold,f=r.bits,m=r.lencode,g=r.distcode,y=(1<<r.lenbits)-1,w=(1<<r.distbits)-1;e:do{f<15&&(p+=C[n++]<<f,f+=8,p+=C[n++]<<f,f+=8),b=m[p&y];t:for(;;){if(p>>>=v=b>>>24,f-=v,0==(v=b>>>16&255))E[o++]=65535&b;else{if(!(16&v)){if(!(64&v)){b=m[(65535&b)+(p&(1<<v)-1)];continue t}if(32&v){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}_=65535&b,(v&=15)&&(f<v&&(p+=C[n++]<<f,f+=8),_+=p&(1<<v)-1,p>>>=v,f-=v),f<15&&(p+=C[n++]<<f,f+=8,p+=C[n++]<<f,f+=8),b=g[p&w];r:for(;;){if(p>>>=v=b>>>24,f-=v,!(16&(v=b>>>16&255))){if(!(64&v)){b=g[(65535&b)+(p&(1<<v)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&b,f<(v&=15)&&(p+=C[n++]<<f,(f+=8)<v&&(p+=C[n++]<<f,f+=8)),c<(k+=p&(1<<v)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(p>>>=v,f-=v,(v=o-s)<k){if(u<(v=k-v)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(x=h,(S=0)===d){if(S+=l-v,v<_){for(_-=v;E[o++]=h[S++],--v;);S=o-k,x=E}}else if(d<v){if(S+=l+d-v,(v-=d)<_){for(_-=v;E[o++]=h[S++],--v;);if(S=0,d<_){for(_-=v=d;E[o++]=h[S++],--v;);S=o-k,x=E}}}else if(S+=d-v,v<_){for(_-=v;E[o++]=h[S++],--v;);S=o-k,x=E}for(;2<_;)E[o++]=x[S++],E[o++]=x[S++],E[o++]=x[S++],_-=3;_&&(E[o++]=x[S++],1<_&&(E[o++]=x[S++]))}else{for(S=o-k;E[o++]=E[S++],E[o++]=E[S++],E[o++]=E[S++],2<(_-=3););_&&(E[o++]=E[S++],1<_&&(E[o++]=E[S++]))}break}}break}}while(n<a&&o<i);n-=_=f>>3,p&=(1<<(f-=_<<3))-1,e.next_in=n,e.next_out=o,e.avail_in=n<a?a-n+5:5-(n-a),e.avail_out=o<i?i-o+257:257-(o-i),r.hold=p,r.bits=f}},{}],49:[function(e,t,r){var n=e("../utils/common"),a=e("./adler32"),o=e("./crc32"),s=e("./inffast"),i=e("./inftrees"),c=1,l=2,u=0,d=-2,h=1,p=852,f=592;function m(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function g(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new n.Buf16(320),this.work=new n.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function y(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=1,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new n.Buf32(p),t.distcode=t.distdyn=new n.Buf32(f),t.sane=1,t.back=-1,0):d}function w(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,y(e)):d}function b(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?d:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,w(e))):d}function v(e,t){var r,n;return e?(n=new g,(e.state=n).window=null,0!==(r=b(e,t))&&(e.state=null),r):d}var _,k,S=!0;function x(e){if(S){var t;for(_=new n.Buf32(512),k=new n.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(i(1,e.lens,0,288,_,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;i(2,e.lens,0,32,k,0,e.work,{bits:5}),S=!1}e.lencode=_,e.lenbits=9,e.distcode=k,e.distbits=5}function C(e,t,r,a){var o,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new n.Buf8(s.wsize)),a>=s.wsize?(n.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(a<(o=s.wsize-s.wnext)&&(o=a),n.arraySet(s.window,t,r-a,o,s.wnext),(a-=o)?(n.arraySet(s.window,t,r-a,a,0),s.wnext=a,s.whave=s.wsize):(s.wnext+=o,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=o))),0}r.inflateReset=w,r.inflateReset2=b,r.inflateResetKeep=y,r.inflateInit=function(e){return v(e,15)},r.inflateInit2=v,r.inflate=function(e,t){var r,c,l,u,h,p,f,g,y,w,b,v,_,k,S,E,A,P,T,D,I,R,N,U,M=0,L=new n.Buf8(4),O=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return d;12===(r=e.state).mode&&(r.mode=13),h=e.next_out,l=e.output,f=e.avail_out,u=e.next_in,c=e.input,p=e.avail_in,g=r.hold,y=r.bits,w=p,b=f,R=0;e:for(;;)switch(r.mode){case 1:if(0===r.wrap){r.mode=13;break}for(;y<16;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if(2&r.wrap&&35615===g){L[r.check=0]=255&g,L[1]=g>>>8&255,r.check=o(r.check,L,2,0),y=g=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&g)<<8)+(g>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&g)){e.msg="unknown compression method",r.mode=30;break}if(y-=4,I=8+(15&(g>>>=4)),0===r.wbits)r.wbits=I;else if(I>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<I,e.adler=r.check=1,r.mode=512&g?10:12,y=g=0;break;case 2:for(;y<16;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if(r.flags=g,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=g>>8&1),512&r.flags&&(L[0]=255&g,L[1]=g>>>8&255,r.check=o(r.check,L,2,0)),y=g=0,r.mode=3;case 3:for(;y<32;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}r.head&&(r.head.time=g),512&r.flags&&(L[0]=255&g,L[1]=g>>>8&255,L[2]=g>>>16&255,L[3]=g>>>24&255,r.check=o(r.check,L,4,0)),y=g=0,r.mode=4;case 4:for(;y<16;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}r.head&&(r.head.xflags=255&g,r.head.os=g>>8),512&r.flags&&(L[0]=255&g,L[1]=g>>>8&255,r.check=o(r.check,L,2,0)),y=g=0,r.mode=5;case 5:if(1024&r.flags){for(;y<16;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}r.length=g,r.head&&(r.head.extra_len=g),512&r.flags&&(L[0]=255&g,L[1]=g>>>8&255,r.check=o(r.check,L,2,0)),y=g=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(p<(v=r.length)&&(v=p),v&&(r.head&&(I=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),n.arraySet(r.head.extra,c,u,v,I)),512&r.flags&&(r.check=o(r.check,c,v,u)),p-=v,u+=v,r.length-=v),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===p)break e;for(v=0;I=c[u+v++],r.head&&I&&r.length<65536&&(r.head.name+=String.fromCharCode(I)),I&&v<p;);if(512&r.flags&&(r.check=o(r.check,c,v,u)),p-=v,u+=v,I)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===p)break e;for(v=0;I=c[u+v++],r.head&&I&&r.length<65536&&(r.head.comment+=String.fromCharCode(I)),I&&v<p;);if(512&r.flags&&(r.check=o(r.check,c,v,u)),p-=v,u+=v,I)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;y<16;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if(g!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}y=g=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;y<32;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}e.adler=r.check=m(g),y=g=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=h,e.avail_out=f,e.next_in=u,e.avail_in=p,r.hold=g,r.bits=y,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){g>>>=7&y,y-=7&y,r.mode=27;break}for(;y<3;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}switch(r.last=1&g,y-=1,3&(g>>>=1)){case 0:r.mode=14;break;case 1:if(x(r),r.mode=20,6!==t)break;g>>>=2,y-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30}g>>>=2,y-=2;break;case 14:for(g>>>=7&y,y-=7&y;y<32;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if((65535&g)!=(g>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&g,y=g=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(v=r.length){if(p<v&&(v=p),f<v&&(v=f),0===v)break e;n.arraySet(l,c,u,v,h),p-=v,u+=v,f-=v,h+=v,r.length-=v;break}r.mode=12;break;case 17:for(;y<14;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if(r.nlen=257+(31&g),g>>>=5,y-=5,r.ndist=1+(31&g),g>>>=5,y-=5,r.ncode=4+(15&g),g>>>=4,y-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;y<3;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}r.lens[O[r.have++]]=7&g,g>>>=3,y-=3}for(;r.have<19;)r.lens[O[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,N={bits:r.lenbits},R=i(0,r.lens,0,19,r.lencode,0,r.work,N),r.lenbits=N.bits,R){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;E=(M=r.lencode[g&(1<<r.lenbits)-1])>>>16&255,A=65535&M,!((S=M>>>24)<=y);){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if(A<16)g>>>=S,y-=S,r.lens[r.have++]=A;else{if(16===A){for(U=S+2;y<U;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if(g>>>=S,y-=S,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}I=r.lens[r.have-1],v=3+(3&g),g>>>=2,y-=2}else if(17===A){for(U=S+3;y<U;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}y-=S,I=0,v=3+(7&(g>>>=S)),g>>>=3,y-=3}else{for(U=S+7;y<U;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}y-=S,I=0,v=11+(127&(g>>>=S)),g>>>=7,y-=7}if(r.have+v>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;v--;)r.lens[r.have++]=I}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,N={bits:r.lenbits},R=i(1,r.lens,0,r.nlen,r.lencode,0,r.work,N),r.lenbits=N.bits,R){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,N={bits:r.distbits},R=i(2,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,N),r.distbits=N.bits,R){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=p&&258<=f){e.next_out=h,e.avail_out=f,e.next_in=u,e.avail_in=p,r.hold=g,r.bits=y,s(e,b),h=e.next_out,l=e.output,f=e.avail_out,u=e.next_in,c=e.input,p=e.avail_in,g=r.hold,y=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;E=(M=r.lencode[g&(1<<r.lenbits)-1])>>>16&255,A=65535&M,!((S=M>>>24)<=y);){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if(E&&!(240&E)){for(P=S,T=E,D=A;E=(M=r.lencode[D+((g&(1<<P+T)-1)>>P)])>>>16&255,A=65535&M,!(P+(S=M>>>24)<=y);){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}g>>>=P,y-=P,r.back+=P}if(g>>>=S,y-=S,r.back+=S,r.length=A,0===E){r.mode=26;break}if(32&E){r.back=-1,r.mode=12;break}if(64&E){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&E,r.mode=22;case 22:if(r.extra){for(U=r.extra;y<U;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}r.length+=g&(1<<r.extra)-1,g>>>=r.extra,y-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;E=(M=r.distcode[g&(1<<r.distbits)-1])>>>16&255,A=65535&M,!((S=M>>>24)<=y);){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if(!(240&E)){for(P=S,T=E,D=A;E=(M=r.distcode[D+((g&(1<<P+T)-1)>>P)])>>>16&255,A=65535&M,!(P+(S=M>>>24)<=y);){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}g>>>=P,y-=P,r.back+=P}if(g>>>=S,y-=S,r.back+=S,64&E){e.msg="invalid distance code",r.mode=30;break}r.offset=A,r.extra=15&E,r.mode=24;case 24:if(r.extra){for(U=r.extra;y<U;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}r.offset+=g&(1<<r.extra)-1,g>>>=r.extra,y-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===f)break e;if(v=b-f,r.offset>v){if((v=r.offset-v)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}_=v>r.wnext?(v-=r.wnext,r.wsize-v):r.wnext-v,v>r.length&&(v=r.length),k=r.window}else k=l,_=h-r.offset,v=r.length;for(f<v&&(v=f),f-=v,r.length-=v;l[h++]=k[_++],--v;);0===r.length&&(r.mode=21);break;case 26:if(0===f)break e;l[h++]=r.length,f--,r.mode=21;break;case 27:if(r.wrap){for(;y<32;){if(0===p)break e;p--,g|=c[u++]<<y,y+=8}if(b-=f,e.total_out+=b,r.total+=b,b&&(e.adler=r.check=r.flags?o(r.check,l,b,h-b):a(r.check,l,b,h-b)),b=f,(r.flags?g:m(g))!==r.check){e.msg="incorrect data check",r.mode=30;break}y=g=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;y<32;){if(0===p)break e;p--,g+=c[u++]<<y,y+=8}if(g!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}y=g=0}r.mode=29;case 29:R=1;break e;case 30:R=-3;break e;case 31:return-4;case 32:default:return d}return e.next_out=h,e.avail_out=f,e.next_in=u,e.avail_in=p,r.hold=g,r.bits=y,(r.wsize||b!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&C(e,e.output,e.next_out,b-e.avail_out)?(r.mode=31,-4):(w-=e.avail_in,b-=e.avail_out,e.total_in+=w,e.total_out+=b,r.total+=b,r.wrap&&b&&(e.adler=r.check=r.flags?o(r.check,l,b,e.next_out-b):a(r.check,l,b,e.next_out-b)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==w&&0===b||4===t)&&0===R&&(R=-5),R)},r.inflateEnd=function(e){if(!e||!e.state)return d;var t=e.state;return t.window&&(t.window=null),e.state=null,0},r.inflateGetHeader=function(e,t){var r;return e&&e.state&&2&(r=e.state).wrap?((r.head=t).done=!1,0):d},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?d:11===r.mode&&a(1,t,n,0)!==r.check?-3:C(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,0):d},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){var n=e("../utils/common"),a=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],o=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],s=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],i=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,c,l,u,d,h){var p,f,m,g,y,w,b,v,_,k=h.bits,S=0,x=0,C=0,E=0,A=0,P=0,T=0,D=0,I=0,R=0,N=null,U=0,M=new n.Buf16(16),L=new n.Buf16(16),O=null,B=0;for(S=0;S<=15;S++)M[S]=0;for(x=0;x<c;x++)M[t[r+x]]++;for(A=k,E=15;1<=E&&0===M[E];E--);if(E<A&&(A=E),0===E)return l[u++]=20971520,l[u++]=20971520,h.bits=1,0;for(C=1;C<E&&0===M[C];C++);for(A<C&&(A=C),S=D=1;S<=15;S++)if(D<<=1,(D-=M[S])<0)return-1;if(0<D&&(0===e||1!==E))return-1;for(L[1]=0,S=1;S<15;S++)L[S+1]=L[S]+M[S];for(x=0;x<c;x++)0!==t[r+x]&&(d[L[t[r+x]]++]=x);if(w=0===e?(N=O=d,19):1===e?(N=a,U-=257,O=o,B-=257,256):(N=s,O=i,-1),S=C,y=u,T=x=R=0,m=-1,g=(I=1<<(P=A))-1,1===e&&852<I||2===e&&592<I)return 1;for(;;){for(b=S-T,_=d[x]<w?(v=0,d[x]):d[x]>w?(v=O[B+d[x]],N[U+d[x]]):(v=96,0),p=1<<S-T,C=f=1<<P;l[y+(R>>T)+(f-=p)]=b<<24|v<<16|_,0!==f;);for(p=1<<S-1;R&p;)p>>=1;if(0!==p?(R&=p-1,R+=p):R=0,x++,0==--M[S]){if(S===E)break;S=t[r+d[x]]}if(A<S&&(R&g)!==m){for(0===T&&(T=A),y+=C,D=1<<(P=S-T);P+T<E&&!((D-=M[P+T])<=0);)P++,D<<=1;if(I+=1<<P,1===e&&852<I||2===e&&592<I)return 1;l[m=R&g]=A<<24|P<<16|y-u}}return 0!==R&&(l[y+R]=S-T<<24|64<<16),h.bits=A,0}},{"../utils/common":41}],51:[function(e,t,r){t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,t,r){var n=e("../utils/common"),a=0,o=1;function s(e){for(var t=e.length;0<=--t;)e[t]=0}var i=0,c=29,l=256,u=286,d=30,h=19,p=573,f=15,m=16,g=7,y=256,w=16,b=17,v=18,_=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],S=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],x=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],C=new Array(576);s(C);var E=new Array(60);s(E);var A=new Array(512);s(A);var P=new Array(256);s(P);var T=new Array(c);s(T);var D,I,R,N=new Array(d);function U(e,t,r,n,a){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=a,this.has_stree=e&&e.length}function M(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function L(e){return e<256?A[e]:A[256+(e>>>7)]}function O(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function B(e,t,r){e.bi_valid>m-r?(e.bi_buf|=t<<e.bi_valid&65535,O(e,e.bi_buf),e.bi_buf=t>>m-e.bi_valid,e.bi_valid+=r-m):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r)}function $(e,t,r){B(e,r[2*t],r[2*t+1])}function z(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function j(e,t,r){var n,a,o=new Array(16),s=0;for(n=1;n<=f;n++)o[n]=s=s+r[n-1]<<1;for(a=0;a<=t;a++){var i=e[2*a+1];0!==i&&(e[2*a]=z(o[i]++,i))}}function H(e){var t;for(t=0;t<u;t++)e.dyn_ltree[2*t]=0;for(t=0;t<d;t++)e.dyn_dtree[2*t]=0;for(t=0;t<h;t++)e.bl_tree[2*t]=0;e.dyn_ltree[512]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function W(e){8<e.bi_valid?O(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function F(e,t,r,n){var a=2*t,o=2*r;return e[a]<e[o]||e[a]===e[o]&&n[t]<=n[r]}function G(e,t,r){for(var n=e.heap[r],a=r<<1;a<=e.heap_len&&(a<e.heap_len&&F(t,e.heap[a+1],e.heap[a],e.depth)&&a++,!F(t,n,e.heap[a],e.depth));)e.heap[r]=e.heap[a],r=a,a<<=1;e.heap[r]=n}function V(e,t,r){var n,a,o,s,i=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*i]<<8|e.pending_buf[e.d_buf+2*i+1],a=e.pending_buf[e.l_buf+i],i++,0===n?$(e,a,t):($(e,(o=P[a])+l+1,t),0!==(s=_[o])&&B(e,a-=T[o],s),$(e,o=L(--n),r),0!==(s=k[o])&&B(e,n-=N[o],s)),i<e.last_lit;);$(e,y,t)}function K(e,t){var r,n,a,o=t.dyn_tree,s=t.stat_desc.static_tree,i=t.stat_desc.has_stree,c=t.stat_desc.elems,l=-1;for(e.heap_len=0,e.heap_max=p,r=0;r<c;r++)0!==o[2*r]?(e.heap[++e.heap_len]=l=r,e.depth[r]=0):o[2*r+1]=0;for(;e.heap_len<2;)o[2*(a=e.heap[++e.heap_len]=l<2?++l:0)]=1,e.depth[a]=0,e.opt_len--,i&&(e.static_len-=s[2*a+1]);for(t.max_code=l,r=e.heap_len>>1;1<=r;r--)G(e,o,r);for(a=c;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,o,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,o[2*a]=o[2*r]+o[2*n],e.depth[a]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,o[2*r+1]=o[2*n+1]=a,e.heap[1]=a++,G(e,o,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,a,o,s,i,c=t.dyn_tree,l=t.max_code,u=t.stat_desc.static_tree,d=t.stat_desc.has_stree,h=t.stat_desc.extra_bits,m=t.stat_desc.extra_base,g=t.stat_desc.max_length,y=0;for(o=0;o<=f;o++)e.bl_count[o]=0;for(c[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<p;r++)g<(o=c[2*c[2*(n=e.heap[r])+1]+1]+1)&&(o=g,y++),c[2*n+1]=o,l<n||(e.bl_count[o]++,s=0,m<=n&&(s=h[n-m]),i=c[2*n],e.opt_len+=i*(o+s),d&&(e.static_len+=i*(u[2*n+1]+s)));if(0!==y){do{for(o=g-1;0===e.bl_count[o];)o--;e.bl_count[o]--,e.bl_count[o+1]+=2,e.bl_count[g]--,y-=2}while(0<y);for(o=g;0!==o;o--)for(n=e.bl_count[o];0!==n;)l<(a=e.heap[--r])||(c[2*a+1]!==o&&(e.opt_len+=(o-c[2*a+1])*c[2*a],c[2*a+1]=o),n--)}}(e,t),j(o,l,e.bl_count)}function J(e,t,r){var n,a,o=-1,s=t[1],i=0,c=7,l=4;for(0===s&&(c=138,l=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)a=s,s=t[2*(n+1)+1],++i<c&&a===s||(i<l?e.bl_tree[2*a]+=i:0!==a?(a!==o&&e.bl_tree[2*a]++,e.bl_tree[32]++):i<=10?e.bl_tree[34]++:e.bl_tree[36]++,o=a,l=(i=0)===s?(c=138,3):a===s?(c=6,3):(c=7,4))}function Z(e,t,r){var n,a,o=-1,s=t[1],i=0,c=7,l=4;for(0===s&&(c=138,l=3),n=0;n<=r;n++)if(a=s,s=t[2*(n+1)+1],!(++i<c&&a===s)){if(i<l)for(;$(e,a,e.bl_tree),0!=--i;);else 0!==a?(a!==o&&($(e,a,e.bl_tree),i--),$(e,w,e.bl_tree),B(e,i-3,2)):i<=10?($(e,b,e.bl_tree),B(e,i-3,3)):($(e,v,e.bl_tree),B(e,i-11,7));o=a,l=(i=0)===s?(c=138,3):a===s?(c=6,3):(c=7,4)}}s(N);var X=!1;function q(e,t,r,a){var o,s,i,c;B(e,0+(a?1:0),3),s=t,i=r,c=!0,W(o=e),O(o,i),O(o,~i),n.arraySet(o.pending_buf,o.window,s,i,o.pending),o.pending+=i}r._tr_init=function(e){X||(function(){var e,t,r,n,a,o=new Array(16);for(n=r=0;n<28;n++)for(T[n]=r,e=0;e<1<<_[n];e++)P[r++]=n;for(P[r-1]=n,n=a=0;n<16;n++)for(N[n]=a,e=0;e<1<<k[n];e++)A[a++]=n;for(a>>=7;n<d;n++)for(N[n]=a<<7,e=0;e<1<<k[n]-7;e++)A[256+a++]=n;for(t=0;t<=f;t++)o[t]=0;for(e=0;e<=143;)C[2*e+1]=8,e++,o[8]++;for(;e<=255;)C[2*e+1]=9,e++,o[9]++;for(;e<=279;)C[2*e+1]=7,e++,o[7]++;for(;e<=287;)C[2*e+1]=8,e++,o[8]++;for(j(C,287,o),e=0;e<d;e++)E[2*e+1]=5,E[2*e]=z(e,5);D=new U(C,_,257,u,f),I=new U(E,k,0,d,f),R=new U(new Array(0),S,0,h,7)}(),X=!0),e.l_desc=new M(e.dyn_ltree,D),e.d_desc=new M(e.dyn_dtree,I),e.bl_desc=new M(e.bl_tree,R),e.bi_buf=0,e.bi_valid=0,H(e)},r._tr_stored_block=q,r._tr_flush_block=function(e,t,r,n){var a,o,s=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return 0;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return 1;for(t=32;t<l;t++)if(0!==e.dyn_ltree[2*t])return 1;return 0}(e)),K(e,e.l_desc),K(e,e.d_desc),s=function(e){var t;for(J(e,e.dyn_ltree,e.l_desc.max_code),J(e,e.dyn_dtree,e.d_desc.max_code),K(e,e.bl_desc),t=18;3<=t&&0===e.bl_tree[2*x[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),a=e.opt_len+3+7>>>3,(o=e.static_len+3+7>>>3)<=a&&(a=o)):a=o=r+5,r+4<=a&&-1!==t?q(e,t,r,n):4===e.strategy||o===a?(B(e,2+(n?1:0),3),V(e,C,E)):(B(e,4+(n?1:0),3),function(e,t,r,n){var a;for(B(e,t-257,5),B(e,r-1,5),B(e,n-4,4),a=0;a<n;a++)B(e,e.bl_tree[2*x[a]+1],3);Z(e,e.dyn_ltree,t-1),Z(e,e.dyn_dtree,r-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,s+1),V(e,e.dyn_ltree,e.dyn_dtree)),H(e),n&&W(e)},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(P[r]+l+1)]++,e.dyn_dtree[2*L(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){var t;B(e,2,3),$(e,y,C),16===(t=e).bi_valid?(O(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):8<=t.bi_valid&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}},{"../utils/common":41}],53:[function(e,t,r){t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,r){(function(e){!function(e,t){if(!e.setImmediate){var r,n,a,o,s=1,i={},c=!1,l=e.document,u=Object.getPrototypeOf&&Object.getPrototypeOf(e);u=u&&u.setTimeout?u:e,r="[object process]"==={}.toString.call(e.process)?function(e){process.nextTick(function(){h(e)})}:function(){if(e.postMessage&&!e.importScripts){var t=!0,r=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=r,t}}()?(o="setImmediate$"+Math.random()+"$",e.addEventListener?e.addEventListener("message",p,!1):e.attachEvent("onmessage",p),function(t){e.postMessage(o+t,"*")}):e.MessageChannel?((a=new MessageChannel).port1.onmessage=function(e){h(e.data)},function(e){a.port2.postMessage(e)}):l&&"onreadystatechange"in l.createElement("script")?(n=l.documentElement,function(e){var t=l.createElement("script");t.onreadystatechange=function(){h(e),t.onreadystatechange=null,n.removeChild(t),t=null},n.appendChild(t)}):function(e){setTimeout(h,0,e)},u.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var a={callback:e,args:t};return i[s]=a,r(s),s++},u.clearImmediate=d}function d(e){delete i[e]}function h(e){if(c)setTimeout(h,0,e);else{var r=i[e];if(r){c=!0;try{!function(e){var r=e.callback,n=e.args;switch(n.length){case 0:r();break;case 1:r(n[0]);break;case 2:r(n[0],n[1]);break;case 3:r(n[0],n[1],n[2]);break;default:r.apply(t,n)}}(r)}finally{d(e),c=!1}}}}function p(t){t.source===e&&"string"==typeof t.data&&0===t.data.indexOf(o)&&h(+t.data.slice(o.length))}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[10])(10)})}});

function encodeBase64Utf8(text) {
	const encoded = (new TextEncoder).encode(text);
	const binaryString = Array.from(encoded, byte => String.fromCharCode(byte)).join("");
	return btoa(binaryString);
}

function decodeBase64Utf8(base64) {
	return (new TextDecoder).decode(Uint8Array.from(atob(base64), char => char.charCodeAt(0)));
}

// ══════ ابزارهای عمومی: base64، DNS، اعتبارسنجی آدرس‌ها ══════
async function decompressGzipBase64(base64) {
	const decoded = atob(base64);
	const bytes = new Uint8Array(decoded.length);
	for (let index = 0; index < decoded.length; index++) {
		bytes[index] = decoded.charCodeAt(index);
	}
	return await new Response(new ReadableStream({ start(controller) {
			controller.enqueue(bytes);
			controller.close();
		} }).pipeThrough(new DecompressionStream("gzip"))).text();
}

function isValidUuid(uuid) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

function jsonResponse(success, status, message, body, extraHeaders) {
	const headers = { "Content-Type": "application/json", ...extraHeaders };
	const payload = {
		success: success, status: status, message: message ?? null, body: body ?? null
	};
	return new Response(JSON.stringify(payload), { status: status, headers: headers });
}

function getErrorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}

async function resolveDomainRecords(domain, ipv4Only = false) {
	const baseUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}`;
	const queryUrls = { ipv4: `${baseUrl}&type=A`, ipv6: `${baseUrl}&type=AAAA` };
	try {
		const ipv4Records = await fetchDnsRecords(queryUrls.ipv4, 1);
		return { ipv4: ipv4Records, ipv6: ipv4Only ? [] : await fetchDnsRecords(queryUrls.ipv6, 28) };
	} catch (error) {
		throw new Error(`Error resolving DNS for ${domain}: ${getErrorMessage(error)}`);
	}
}

async function fetchDnsRecords(url, recordType) {
	try {
		const response = await fetch(url, { headers: { accept: "application/dns-json" } });
		const data = await response.json();
		return data.Answer ? data.Answer.filter(item => item.type === recordType).map(item => item.data) : [];
	} catch (error) {
		throw new Error(`Failed to fetch DNS records from ${url}: ${getErrorMessage(error)}`);
	}
}

function getEnabledProtocols() {
	const { protocols } = getSettings();
	return protocols.split(",");
}

async function getConfigAddresses(domain, skipCustomCdn) {
	const { enableIPv6, customCdnAddrs, cleanIPs } = getSettings();
	const { ipv4, ipv6 } = await resolveDomainRecords(domain, !enableIPv6);
	return [domain, ...ipv4, ...ipv6.map(item => `[${item}]`), ...cleanIPs].concatIf(!skipCustomCdn, customCdnAddrs);
}

function buildConfigRemark(index, port, address, protocol, host, isFragment, isChained) {
	const { cleanIPs, customCdnAddrs, customDomain, upstreamParams: { upstreamServer } } = getSettings();
	const chainPrefix = isChained ? "🔗 " : "";
	const protocolLabel = protocol === VLESS ? VLESS_LABEL : TROJAN_LABEL;
	const flags = `${isFragment ? "F " : ""}${host === customDomain ? "D " : ""}${customCdnAddrs.includes(address) ? "C " : ""}`;
	let addressType;
	addressType = cleanIPs.includes(address) ? "Clean IP" : isDomain(address) ? "Domain" : isIPv4(address) ? "IPv4" : isIPv6(address) ? "IPv6" : "";
	return address === upstreamServer ? `💦 ${index}. ${chainPrefix}${protocolLabel} ${flags}- Upstream Proxy` : `💦 ${index}. ${chainPrefix}${protocolLabel} ${flags}- ${addressType} : ${port}`;
}

function randomizeCase(text) {
	let result = "";
	for (let index = 0; index < text.length; index++) {
		result += Math.random() < .5 ? text[index].toUpperCase() : text[index];
	}
	return result;
}

function randomString(minLength, maxLength) {
	let result = "";
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
	for (let index = 0; index < length; index++) {
		result += charset.charAt(Math.floor(62 * Math.random()));
	}
	return result;
}

function buildWebSocketPath(protocol) {
	return `/${protocol === VLESS ? "vl" : "tr"}/${randomString(16, 32)}`;
}

function base64ToBytes(base64) {
	const binary = atob(base64);
	return Array.from(binary).map(char => char.charCodeAt(0).toString(16).padStart(2, "0")).join("").match(/.{2}/g).map(hex => parseInt(hex, 16));
}

function isDomain(host) {
	if (!host) {
		return false;
	}
	return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(host);
}

function isIPv4(host) {
	return /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(host);
}

function isIPv6(host) {
	return /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|::(?:[a-fA-F0-9]{1,4}:){0,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6})\](?:\/(1[0-1][0-9]|12[0-8]|[0-9]?[0-9]))?$/.test(host);
}

function isIPv4OrCidr(value) {
	return /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/.test(value);
}

function isIPv6OrCidr(value) {
	return /^(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7}|::)(?:\/(?:12[0-8]|1[01]?[0-9]|[0-9]?[0-9]))?$/.test(value);
}

function isHttpUrl(value) {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch (error) {
		return false;
	}
}

function isBase64(value) {
	return !(!value || value.length % 4 != 0) && /^[A-Za-z0-9+/=\r\n]+$/.test(value);
}

function isHex(value) {
	return /^(?=(?:[0-9A-Fa-f]{2})*$)[0-9A-Fa-f]+$/.test(value);
}

function parseUrlHost(url) {
	try {
		const hostname = new URL(url).hostname;
		return { host: hostname, isHostDomain: isDomain(hostname) };
	} catch {
		return { host: "", isHostDomain: false };
	}
}

function getTlsHostAndSni(address, host) {
	const { customCdnAddrs, customCdnHost, customCdnSni } = getSettings();
	const isCustomCdn = customCdnAddrs.includes(address);
	return { host: isCustomCdn ? customCdnHost : host, sni: isCustomCdn ? customCdnSni : randomizeCase(host), allowInsecure: isCustomCdn };
}

function parseHostAndPort(hostPort, keepBrackets) {
	const pattern = /^(?:\[(?<ipv6>.+?)\]|(?<host>[^:]+))(:(?<port>\d+))?$/;
	const match = hostPort.match(pattern);
	if (!match || !match.groups) {
		return { host: "", port: 0 };
	}
	const { ipv6, host, port } = match.groups;
	let resolvedHost = ipv6 ?? host ?? "";
	if (keepBrackets && ipv6) {
		resolvedHost = `[${ipv6}]`;
	}
	return { host: resolvedHost, port: port ? Number(port) : 0 };
}

function isHttpsPort(port) {
	const { httpsPorts } = getSettings();
	return httpsPorts.includes(port);
}

var isDirectRuleType = type => type === "direct";

var isBlockRuleType = type => type === "block";

function buildRoutingRules(ruleSets) {
	const { customBypassRules, customBypassSanctionRules, customBlockRules } = getSettings();
	return {
		bypass: {
			geosites: ruleSets.filter(ruleSet => isDirectRuleType(ruleSet.type)).map(item => item.geosite), geoips: ruleSets.filter(ruleSet => isDirectRuleType(ruleSet.type) && ruleSet.geoip).map(item => item.geoip), domains: [...customBypassRules.filter(isDomain), ...customBypassSanctionRules.filter(isDomain)], ips: customBypassRules.filter(item => !isDomain(item))
		}, block: {
			geosites: ruleSets.filter(ruleSet => isBlockRuleType(ruleSet.type)).map(item => item.geosite), geoips: ruleSets.filter(ruleSet => isBlockRuleType(ruleSet.type) && ruleSet.geoip).map(item => item.geoip), domains: customBlockRules.filter(isDomain), ips: customBlockRules.filter(item => !isDomain(item))
		}
	};
}

function buildDnsRoutingRules(ruleSets) {
	const { localDNS, antiSanctionDNS, customBypassRules, customBypassSanctionRules, customBlockRules } = getSettings();
	return {
		bypass: {
			localDNS: {
				geositeGeoips: ruleSets.filter(({ type, geoip, dns }) => isDirectRuleType(type) && geoip && dns === localDNS).map(({ geosite, geoip }) => ({ geosite: geosite, geoip: geoip })), geosites: ruleSets.filter(({ type, geoip, dns }) => isDirectRuleType(type) && !geoip && dns === localDNS).map(item => item.geosite), domains: customBypassRules.filter(isDomain)
			}, antiSanctionDNS: { geosites: ruleSets.filter(ruleSet => isDirectRuleType(ruleSet.type) && ruleSet.dns === antiSanctionDNS).map(item => item.geosite), domains: customBypassSanctionRules.filter(isDomain) }
		}, block: { geosites: ruleSets.filter(ruleSet => isBlockRuleType(ruleSet.type)).map(item => item.geosite), domains: customBlockRules.filter(isDomain) }
	};
}

function formatRange(min, max) {
	if (min && max) {
		return min === max ? String(min) : `${min}-${max}`;
	}
}

function parseChainProxyUrl(chainUrl) {
	if (!chainUrl) {
		return {};
	}
	let url = new URL(chainUrl);
	const scheme = url.protocol.slice(0, -1);
	const protocol = scheme === "ss" ? SHADOWSOCKS : scheme.replace("socks5", "socks");
	if (protocol === VMESS) {
		const vmess = JSON.parse(decodeBase64Utf8(url.host));
		return {
			protocol: protocol, uuid: vmess.id, server: vmess.add, port: +vmess.port, aid: +vmess.aid, type: vmess.net, headerType: vmess.type, serviceName: vmess.path, authority: vmess.authority, path: vmess.path || undefined, host: vmess.host || undefined, security: vmess.tls, sni: vmess.sni, fp: vmess.fp, alpn: vmess.alpn || undefined
		};
	}
	const params = { protocol: protocol, server: url.hostname, port: +url.port };
	const buildProxy = (includeQuery, extra) => {
		if (includeQuery) {
			for (const [key, value] of url.searchParams) {
				params[key] = value || undefined;
			}
		}
		return { ...params, ...extra };
	};
	switch (protocol) {
		case VLESS: return buildProxy(true, { uuid: url.username });
		case TROJAN: return buildProxy(true, { password: url.username });
		case SHADOWSOCKS:
			const ssUserinfo = decodeBase64Utf8(url.username);
			const [method, ...passwordParts] = ssUserinfo.split(":");
			return buildProxy(true, { method: method, password: passwordParts.join(":") });
		case "socks":
		case "http":
			let user;
			let pass;
			try {
				const socksUserinfo = decodeBase64Utf8(url.username);
				if (socksUserinfo.includes(":")) {
					[user, pass] = socksUserinfo.split(":");
				}
			} catch (error) {
				user = url.username;
				pass = url.password;
			}
			return buildProxy(false, { user: user || undefined, pass: pass || undefined });
		default: return {};
	}
}

function parseUpstreamProxy(upstreamProxy) {
	let upstreamServer;
	let upstreamPort;
	if (upstreamProxy) {
		({ host: upstreamServer, port: upstreamPort } = parseHostAndPort(upstreamProxy, true));
	}
	return { upstreamServer: upstreamServer, upstreamPort: upstreamPort };
}

Array.prototype.concatIf = function (condition, valueOrList) {
	return condition ? Array.isArray(valueOrList) ? [...this, ...valueOrList] : [...this, valueOrList] : this;
};

Object.prototype.omitEmpty = function () {
	if (Object.keys(this).length !== 0) {
		return this;
	}
};

// ══════ وارپ و API کلادفلر (دپلوی، دامنه، دیتابیس) ══════
async function updateWarpAccounts(env) {
	const accounts = [];
	const previousAccounts = getWarpAccounts();
	try {
		const keyPairs = [await generateWarpKeyPair(), await generateWarpKeyPair()];
		for (const [index, keyPair] of keyPairs.entries()) {
			const { config } = await registerWarpDevice(keyPair);
			accounts.push({
				privateKey: keyPair.privateKey, warpIPv6: `${config.interface.addresses.v6}/128`, reserved: config.client_id, publicKey: config.peers[0].public_key
			});
			if (index === 0) {
				await new Promise(resolve => setTimeout(resolve, 2e3));
			}
		}
		await env.kv.put("warpAccounts", JSON.stringify(accounts));
		return accounts;
	} catch (error) {
		console.error("Failed to fetch new WARP accounts:", error instanceof Error ? error.message : String(error));
		return previousAccounts;
	}
}

async function registerWarpDevice(keyPair) {
	const response = await fetch("https://api.cloudflareclient.com/v0a4005/reg", {
		method: "POST", headers: { "User-Agent": "insomnia/13.0.2", "Content-Type": "application/json" }, body: JSON.stringify({
			install_id: "", fcm_token: "", tos: (new Date).toISOString(), type: "Android", model: "PC", locale: "en_US", warp_enabled: true, key: keyPair.publicKey
		})
	});
	if (!response.ok) {
		throw new Error(`API returned status ${response.status}: ${await response.text()}`);
	}
	return response.json();
}

async function generateWarpKeyPair() {
	const { publicKey, privateKey } = generateKeyPairSync("x25519", { publicKeyEncoding: { type: "spki", format: "der" }, privateKeyEncoding: { type: "pkcs8", format: "der" } });
	return { publicKey: publicKey.subarray(-32).toString("base64"), privateKey: privateKey.subarray(-32).toString("base64") };
}

async function createPagesDeployment(workerScript) {
	const { accID, apiToken, mainDomain } = getRuntimeConfig();
	const projectName = mainDomain.split(".")[0];
	const formData = new FormData;
	formData.append("manifest", "{}");
	formData.append("_worker.js", new Blob([workerScript], { type: "application/javascript" }), "_worker.js");
	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/pages/projects/${projectName}/deployments`, { method: "POST", headers: { Authorization: `Bearer ${apiToken}` }, body: formData });
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message || JSON.stringify(data.errors));
		}
	} catch (error) {
		throw new Error(`Failed to create Pages deployment: ${getErrorMessage(error)}`);
	}
}

async function getPagesDomains() {
	const { accID, apiToken, mainDomain } = getRuntimeConfig();
	const projectName = mainDomain.split(".")[0];
	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/pages/projects/${projectName}/domains`, { headers: { Authorization: `Bearer ${apiToken}` } });
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message);
		}
		return data.result.map(domain => domain.hostname);
	} catch (error) {
		throw new Error(`Failed to get Pages project domains: ${getErrorMessage(error)}`);
	}
}

async function addPagesDomain(domain) {
	const { accID, apiToken, mainDomain } = getRuntimeConfig();
	const projectName = mainDomain.split(".")[0];
	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/pages/projects/${projectName}/domains`, {
			method: "POST", headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ name: domain })
		});
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message);
		}
	} catch (error) {
		throw new Error(`Failed to set Pages project domain: ${getErrorMessage(error)}`);
	}
}

async function deletePagesProject() {
	const { accID, apiToken, mainDomain } = getRuntimeConfig();
	const projectName = mainDomain.split(".")[0];
	console.log(mainDomain);
	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/pages/projects/${projectName}`, { method: "DELETE", headers: { Authorization: `Bearer ${apiToken}` } });
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message);
		}
	} catch (error) {
		throw new Error(`Failed to delete pages project: ${getErrorMessage(error)}`);
	}
}

async function deployWorkerScript(workerScript) {
	const { accID, apiToken, mainDomain } = getRuntimeConfig();
	const metadata = {
		main_module: "worker.js", keep_bindings: ["kv_namespace"], compatibility_date: (new Date).toISOString().split("T")[0], compatibility_flags: ["nodejs_compat"]
	};
	const formData = new FormData;
	formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
	formData.append("worker.js", new Blob([workerScript], { type: "application/javascript+module" }), "worker.js");
	const workerName = mainDomain.split(".")[0];
	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/workers/scripts/${workerName}`, { method: "PUT", headers: { Authorization: `Bearer ${apiToken}` }, body: formData });
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message);
		}
	} catch (error) {
		throw new Error(`Failed to deploy worker: ${getErrorMessage(error)}`);
	}
}

async function getWorkerDomains() {
	const { accID, apiToken, mainDomain } = getRuntimeConfig();
	const workerName = mainDomain.split(".")[0];
	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/workers/domains?service=${workerName}`, { headers: { Authorization: `Bearer ${apiToken}` } });
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message);
		}
		return data.result.map(domain => domain.hostname);
	} catch (error) {
		throw new Error(`Failed to get worker domains: ${getErrorMessage(error)}`);
	}
}

async function addWorkerDomain(domain) {
	const { accID, apiToken, mainDomain } = getRuntimeConfig();
	const workerName = mainDomain.split(".")[0];
	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/workers/domains`, {
			method: "PUT", headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ hostname: domain, service: workerName })
		});
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message);
		}
	} catch (error) {
		throw new Error(`Failed to set worker domain: ${getErrorMessage(error)}`);
	}
}

async function deleteWorkerScript() {
	const { accID, apiToken, mainDomain } = getRuntimeConfig();
	const workerName = mainDomain.split(".")[0];
	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/workers/scripts/${workerName}`, { method: "DELETE", headers: { Authorization: `Bearer ${apiToken}` } });
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message);
		}
	} catch (error) {
		throw new Error(`Failed to delete worker: ${getErrorMessage(error)}`);
	}
}

async function getAccountZones() {
	const { apiToken } = getRuntimeConfig();
	try {
		const response = await fetch("https://api.cloudflare.com/client/v4/zones", { headers: { Authorization: `Bearer ${apiToken}` } });
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message);
		}
		return data.result;
	} catch (error) {
		throw new Error(`Failed to list account DNS zones: ${getErrorMessage(error)}`);
	}
}

async function createCnameRecord(zoneId, hostname) {
	const { apiToken, mainDomain } = getRuntimeConfig();
	const projectName = mainDomain.split(".")[0];
	try {
		const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
			method: "POST", headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({
				name: hostname, ttl: 1, type: "CNAME", comment: `${PROJECT_NAME} Panel`, content: projectName, proxied: true
			})
		});
		const data = await response.json();
		if (!data.success) {
			throw new Error(data?.errors?.[0]?.message);
		}
	} catch (error) {
		throw new Error(`Failed to create DNS record: ${getErrorMessage(error)}`);
	}
}

async function updateEnvVars(newSettings) {
	const { accID, accEmail, apiToken, mainDomain, vlUUID, trPass, securePath } = getRuntimeConfig();
	const envVars = {
		accID: accID, accEmail: accEmail, apiToken: apiToken, vlUUID: newSettings ? newSettings.vlUUID : vlUUID, trPass: newSettings ? newSettings.trPass : trPass, securePath: newSettings ? newSettings.securePath : securePath, proxyIpMode: newSettings ? newSettings.proxyIpMode : "proxyip", proxyIPs: newSettings ? newSettings.proxyIPs : [], prefixes: newSettings ? newSettings.prefixes : [], mainDomain: mainDomain, fallback: newSettings ? newSettings.fallback : "", dohUrl: newSettings ? newSettings.dohUrl : ""
	};
	if (newSettings) {
		if (isEnvUnchanged(envVars)) {
			return {};
		}
	}
	try {
		throw new Error("Deploy-time settings (UUID, password, secure path, Proxy IPs, NAT64 prefixes, fallback, DoH) are fixed in this build. Change them in your deployer / environment variables and redeploy manually.");
	} catch (error) {
		throw new Error(`An error occurred while updating Env vars: ${getErrorMessage(error)}`);
	}
}

function isEnvUnchanged(candidate) {
	const embeddedSettings = getEmbeddedSettings();
	return Object.keys(embeddedSettings).every(key => {
		const expected = embeddedSettings[key];
		const actual = candidate[key];
		return Array.isArray(expected) && Array.isArray(actual) ? expected.join(",") === actual.join(",") : expected === actual;
	});
}

async function addCustomDomain(customDomain) {
	if (!customDomain) {
		return;
	}
	const { deployType } = getRuntimeConfig();
	try {
		const rootDomain = customDomain.split(".").slice(-2).join(".");
		const accountZones = await getAccountZones();
		const zone = accountZones?.find(item => item.name === rootDomain);
		if (!zone) {
			throw new Error(`Specified domain ${rootDomain} is not registered on your Cloudflare account.`);
		}
		const zoneId = zone.id;
		if ((deployType === "workers" ? await getWorkerDomains() : await getPagesDomains()).includes(customDomain)) {
			throw new Error(`Custom domain '${customDomain}' is already added to ${deployType}.`);
		}
		if (deployType === "pages") {
			await addPagesDomain(customDomain);
			await createCnameRecord(zoneId, customDomain);
		} else {
			await addWorkerDomain(customDomain);
		}
		return customDomain;
	} catch (error) {
		throw new Error(`Failed to set Custom Domain: ${getErrorMessage(error)}`);
	}
}

async function buildWorkerScript(isManualBuild, settings) {
	let workerCode = "";
	if (settings) {
		workerCode = await decompressGzipBase64(SOURCE_CONTENT);
	} else {
		throw new Error("Auto-update is disabled in this build.");
		const releaseUrl = `${REPO_URL}/releases/latest/download/worker.js`;
		const response = await fetch(releaseUrl);
		workerCode = await response.text();
		settings = getSettings();
	}
	const { accID, accEmail, apiToken, mainDomain } = getRuntimeConfig();
	const embeddedSettings = {
		accID: accID, accEmail: accEmail, apiToken: apiToken, vlUUID: settings.vlUUID, trPass: settings.trPass, securePath: settings.securePath, proxyIpMode: settings.proxyIpMode, proxyIPs: settings.proxyIPs, prefixes: settings.prefixes, fallback: settings.fallback, dohUrl: settings.dohUrl, mainDomain: mainDomain
	};
	const embeddedAssets = {
		SOURCE_CONTENT: SOURCE_CONTENT, PANEL_HTML_CONTENT: PANEL_HTML_CONTENT, LOGIN_HTML_CONTENT: LOGIN_HTML_CONTENT, ERROR_HTML_CONTENT: ERROR_HTML_CONTENT, PROXY_IP_HTML_CONTENT: PROXY_IP_HTML_CONTENT, ICON_CONTENT: ICON_CONTENT
	};
	const globals = isManualBuild ? { EMBEDED_SETTINGS: embeddedSettings } : { ...embeddedAssets, EMBEDED_SETTINGS: embeddedSettings };
	return [`// ${accEmail}`, `// Build: ${(new Date).toISOString()}`, "// @ts-nocheck", `${generateJunkCode()}Object.assign(globalThis, ${JSON.stringify(globals)});${workerCode}`].join("\n");
}

function generateJunkCode() {
	const minVars = 50;
	const maxVars = 500;
	const minFuncs = 50;
	const maxFuncs = 500;
	const varCount = Math.floor(451 * Math.random()) + minVars;
	const funcCount = Math.floor(451 * Math.random()) + minFuncs;
	return `${Array.from({ length: varCount }, (_item, index) => {
		return `let ${`__padd_${Math.random().toString(36).substring(2, 10)}_${index}`} = ${Math.floor(1e5 * Math.random())};`;
	}).join("\n")}\n${Array.from({ length: funcCount }, (_item, index) => {
		return `function ${`__paddFunc_${Math.random().toString(36).substring(2, 10)}_${index}`}() { return ${Math.floor(1e3 * Math.random())}; }`;
	}).join("\n")}\n`;
}

// ══════ تنظیمات پنل و حالت سراسری ══════
async function loadPanelStorage(env) {
	let settings;
	let warpAccounts2;
	const defaultSettings = getActiveSettings();
	try {
		settings = await env.kv.get("proxySettings", { type: "json" });
		warpAccounts2 = await env.kv.get("warpAccounts", { type: "json" });
		if (!(settings)) {
			await env.kv.put("proxySettings", JSON.stringify(defaultSettings));
			settings = defaultSettings;
		}
		if (!(warpAccounts2)) {
			warpAccounts2 = await updateWarpAccounts(env);
		}
		if (settings.panelVersion !== "5.1.1") {
			settings = await updateProxySettings(env);
		}
		let telegramBot = await env.kv.get("telegramBot", { type: "json" });
		if (!(telegramBot)) {
			telegramBot = { telegramBotToken: "", telegramUserId: "" };
			await env.kv.put("telegramBot", JSON.stringify(telegramBot));
		}
		return { settings: settings, telegramBot: telegramBot, warpAccounts: warpAccounts2 };
	} catch (error) {
		console.log(error);
		throw new Error(`An error occurred while getting KV: ${getErrorMessage(error)}`);
	}
}

async function updateProxySettings(env, overrides) {
	if (!overrides) {
		const defaultSettings = getActiveSettings();
		await env.kv.put("proxySettings", JSON.stringify(defaultSettings));
		return defaultSettings;
	}
	let storedSettings;
	const currentDefaults = getActiveSettings();
	try {
		storedSettings = await env.kv.get("proxySettings", { type: "json" });
	} catch (error) {
		console.log(error);
		throw new Error(`An error occurred while getting current KV settings: ${getErrorMessage(error)}`);
	}
	const resolveSetting = async (settingName, sourceSetting, resolver) => {
		if (resolver && sourceSetting) {
			const sourceValue = (name => overrides?.[name] ?? storedSettings?.[name] ?? currentDefaults[name])(sourceSetting);
			if (sourceValue !== storedSettings?.[sourceSetting]) {
				return resolver(sourceValue);
			}
		}
		return overrides?.[settingName] ?? storedSettings?.[settingName] ?? currentDefaults[settingName];
	};
	const settingKeys = [
		["remoteDNS"], ["remoteDnsHost", "remoteDNS", resolveHostRecords], ["localDNS"], ["antiSanctionDNS"], ["enableIPv6"], ["fakeDNS"], ["logLevel"], ["allowLANConnection"], ["customDomain", "customDomain", addCustomDomain], ["upstreamProxy"], ["upstreamParams", "upstreamProxy", parseUpstreamProxy], ["chainProxy"], ["chainProxyParams", "chainProxy", parseChainProxyUrl], ["cleanIPs"], ["customCdnAddrs"], ["customCdnHost"], ["customCdnSni"], ["bestPingInterval"], ["protocols"], ["ports"], ["fingerprint"], ["enableTFO"], ["fragmentMode"], ["fragmentLengthMin"], ["fragmentLengthMax"], ["fragmentDelayMin"], ["fragmentDelayMax"], ["fragmentMaxSplitMin"], ["fragmentMaxSplitMax"], ["fragmentPackets"], ["enableECH"], ["echServerName"], ["bypassIran"], ["bypassChina"], ["bypassRussia"], ["bypassOpenAi"], ["bypassGoogleAi"], ["bypassMicrosoft"], ["bypassOracle"], ["bypassDocker"], ["bypassAdobe"], ["bypassEpicGames"], ["bypassIntel"], ["bypassAmd"], ["bypassNvidia"], ["bypassAsus"], ["bypassHp"], ["bypassLenovo"], ["blockAds"], ["blockPorn"], ["blockUDP443"], ["blockMalware"], ["blockPhishing"], ["blockCryptominers"], ["customBypassRules"], ["customBlockRules"], ["customBypassSanctionRules"], ["warpRemoteDNS"], ["warpEndpoints"], ["warpBestPingInterval"], ["warpReservedBytes"], ["xrayUdpNoises"], ["knockerNoiseMode"], ["knockerNoiseCountMin"], ["knockerNoiseCountMax"], ["knockerNoiseSizeMin"], ["knockerNoiseSizeMax"], ["knockerNoiseDelayMin"], ["knockerNoiseDelayMax"], ["amneziaNoiseCount"], ["amneziaNoiseSizeMin"], ["amneziaNoiseSizeMax"], ["customSubs"], ["remoteSettings"], ["customConfigs"]
	];
	try {
		const results = await Promise.all(settingKeys.map(async ([key, dependsOn, resolverFn]) => [key, await resolveSetting(key, dependsOn, resolverFn)]));
		const mergedSettings = { ...Object.fromEntries(results), panelVersion: "5.1.1" };
		await env.kv.put("proxySettings", JSON.stringify(mergedSettings));
		return mergedSettings;
	} catch (error) {
		console.log(error);
		throw new Error(`An error occurred while updating KV: ${getErrorMessage(error)}`);
	}
}

async function resolveHostRecords(url) {
	const { host, isHostDomain } = parseUrlHost(url);
	const hostInfo = {
		host: host, isDomain: isHostDomain, ipv4: [], ipv6: []
	};
	if (isHostDomain) {
		const { ipv4, ipv6 } = await resolveDomainRecords(host);
		hostInfo.ipv4 = ipv4;
		hostInfo.ipv6 = ipv6;
	}
	return hostInfo;
}

function initRuntimeConfig(request2, request) {
	if (typeof EMBEDED_SETTINGS == "undefined") {
		throw new Error(`BPB Panel v5 can only be installed using <a href="${WIZARD_REPO_URL}/secrets" target="_blank">BPB Wizard v3</a> or later.`);
	}
	const { pathname, origin, searchParams, hostname } = new URL(request2.url);
	runtimeConfig = {
		accID: EMBEDED_SETTINGS.accID, accEmail: EMBEDED_SETTINGS.accEmail.toLowerCase(), apiToken: EMBEDED_SETTINGS.apiToken, vlUUID: EMBEDED_SETTINGS.vlUUID, trPass: EMBEDED_SETTINGS.trPass, securePath: EMBEDED_SETTINGS.securePath, proxyIpMode: EMBEDED_SETTINGS.proxyIpMode, proxyIPs: EMBEDED_SETTINGS.proxyIPs.length ? EMBEDED_SETTINGS.proxyIPs : [PUBLIC_PROXY_IP], prefixes: EMBEDED_SETTINGS.prefixes.length ? EMBEDED_SETTINGS.prefixes : ["[2a02:898:146:64::]", "[2602:fc59:b0:64::]", "[2602:fc59:11:64::]"], mainDomain: EMBEDED_SETTINGS.mainDomain, fallback: EMBEDED_SETTINGS.fallback, dohUrl: EMBEDED_SETTINGS.dohUrl || "https://cloudflare-dns.com/dns-query", deployType: request.CF_PAGES === "1" ? "pages" : "workers", httpPorts: [80, 8080, 2052, 2082, 2086, 2095, 8880], httpsPorts: [443, 8443, 2053, 2083, 2087, 2096], client: decodeURIComponent(searchParams.get("app") ?? ""), origin: origin, searchParams: searchParams, pathname: decodeURIComponent(pathname), hostname: hostname
	};
}

async function loadSettingsAndWarp(env) {
	const panelStorage = await loadPanelStorage(env);
	activeSettings = panelStorage.settings;
	warpAccounts = panelStorage.warpAccounts;
	await applyCleanIpsToSettings(env);
}

// ثابت‌های پروژه (قبلاً با atob مخفی شده بودن)
const VLESS = "vless";
const VLESS_LABEL = "VLESS";
const VMESS = "vmess";
const VMESS_LABEL = "VMess";
const TROJAN = "trojan";
const TROJAN_LABEL = "Trojan";
const SHADOWSOCKS = "shadowsocks";
const V2RAY = "v2ray";
const PROJECT_NAME = "BPB";
const PROJECT_NAME_LOWER = "bpb";
const REPO_URL = "https://github.com/bia-pain-bache/BPB-Worker-Panel";
const WIZARD_REPO_URL = "https://github.com/bia-pain-bache/BPB-Wizard";
const WEBSITE_URL = "https://bia-pain-bache.github.io/BPB-Worker-Panel/";
const PUBLIC_PROXY_IP = "bpb.yousef.isegaro.com";

var getRuntimeConfig = () => runtimeConfig;

var getWarpAccounts = () => warpAccounts;

var getActiveSettings = () => activeSettings;

function getEmbeddedSettings() {
	const { accID, accEmail, apiToken, mainDomain, ...rest } = EMBEDED_SETTINGS;
	return rest;
}

function getExportableSettings() {
	const { remoteSettings, customDomain, panelVersion, ...rest } = activeSettings;
	const { proxyIpMode, proxyIPs, prefixes, fallback, dohUrl } = EMBEDED_SETTINGS;
	return {
		...rest, proxyIpMode: proxyIpMode, proxyIPs: proxyIPs, prefixes: prefixes, fallback: fallback, dohUrl: dohUrl
	};
}

var getSettings = () => ({ ...activeSettings, ...runtimeConfig });

var runtimeConfig;

var warpAccounts = [
	{
		privateKey: "4NyxMUme2zGv5r3QWI0hJBlNglm1J/thoCE55PK29G8=", publicKey: "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=", warpIPv6: "2606:4700:110:8fd2:11f3:8e67:11d4:3704/128", reserved: "N16D"
	},
	{
		privateKey: "aPQwXZBOndL0km0Swo0ArDOoy3bjeZzTu+/d4YHxW04=", publicKey: "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=", warpIPv6: "2606:4700:110:859d:1029:4dfa:bf63:ff08/128", reserved: "SmWi"
	}
];

var CONFIG_CLIENTS = {
	normal: {
		label: "Normal", categories: [
			{ core: "xray", clients: [`${V2RAY}N(G)`, "MahsaNG", "Streisand"] }, { core: "sing-box", clients: ["sing-box", "husi"] }, { core: "clash", clients: ["Clash Meta", "Clash Verge", "FlClash", "Stash"] }
		]
	}, fragment: {
		label: "Fragment", categories: [{ core: "xray", clients: [`${V2RAY}N(G)`, "MahsaNG", "Streisand"] }, { core: "sing-box", clients: ["sing-box", "husi"] }]
	}, raw: {
		label: "Raw", categories: [
			{ core: "xray", clients: [`${V2RAY}N(G)`, "MahsaNG", "Shadowrocket", "Streisand", "PassWall"] }, { core: "sing-box", clients: ["husi", "NekoBox", "Hiddify", "Karing"] }
		]
	}, warp: {
		label: "Warp", categories: [
			{ core: "xray", clients: [`${V2RAY}N(G)`, "Streisand"] }, { core: "sing-box", clients: ["sing-box", "husi"] }, { core: "clash", clients: ["Clash Meta", "Clash Verge", "FlClash", "Stash"] }, { core: "wireguard", clients: ["Wireguard"] }
		]
	}, "warp-pro": {
		label: "Warp Pro", categories: [
			{ core: "xray", clients: [`${V2RAY}N(G)`, "Streisand"] }, { core: "xray-knocker", clients: ["MahsaNG", "v2rayN-PRO"] }, { core: "clash", clients: ["Clash Meta", "Clash Verge", "FlClash", "Stash"] }, { core: "amnezia", clients: ["Amnezia", "WG Tunnel"] }
		]
	}
};

var CLIENT_APPS = [
	{
		name: `${V2RAY}NG`, minVer: "2.2.3", source: "Github", url: "https://github.com/2dust/v2rayNG/releases/latest"
	},
	{
		name: `${V2RAY}N`, minVer: "7.22.5", source: "Github", url: "https://github.com/2dust/v2rayN/releases/latest"
	},
	{
		name: "MahsaNG", minVer: "17", source: "Google Play", url: "https://play.google.com/store/apps/details?id=com.MahsaNet.MahsaNG&hl=en"
	},
	{
		name: "Streisand", minVer: "1.6.71", source: "App Store", url: "https://apps.apple.com/us/app/streisand/id6450534064"
	},
	{
		name: "sing-box", minVer: "1.12.0", source: "Github", url: "https://github.com/SagerNet/sing-box/releases/latest"
	},
	{
		name: "husi", minVer: "1.3.2", source: "Codeberg", url: "https://codeberg.org/xchacha20-poly1305/husi/releases/latest"
	},
	{
		name: "NekoBox", minVer: "1.3.2", source: "Github", url: "https://github.com/Matsuridayo/NekoBoxForAndroid/releases/latest"
	},
	{
		name: "Clash Meta", minVer: "2.11.31", source: "Github", url: "https://github.com/MetaCubeX/ClashMetaForAndroid/releases/latest"
	},
	{
		name: "Clash verge rev", minVer: "2.5.1", source: "Github", url: "https://github.com/clash-verge-rev/clash-verge-rev/releases/latest"
	},
	{
		name: "FlClash", minVer: "0.8.94", source: "Github", url: "https://github.com/chen08209/FlClash/releases/latest"
	},
	{
		name: "Stash", minVer: "3.4.1", source: "App Store", url: "https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349"
	},
	{
		name: "Amnezia", minVer: "4.8.21.0", source: "Github", url: "https://github.com/amnezia-vpn/amnezia-client/releases/latest"
	},
	{
		name: "Wireguard", minVer: "Stable", source: "Official Website", url: "https://www.wireguard.com/install/"
	},
	{
		name: "WG Tunnel", minVer: "5.1.0", source: "Github", url: "https://github.com/wgtunnel/android/releases/latest"
	}
];

var activeSettings = {
	localDNS: "8.8.8.8", antiSanctionDNS: "178.22.122.100", fakeDNS: false, enableIPv6: false, allowLANConnection: false, logLevel: "warning", customDomain: "", protocols: `${VLESS},${TROJAN}`, remoteDNS: "https://8.8.8.8/dns-query", remoteDnsHost: {
		isDomain: false, host: "8.8.8.8", ipv4: [], ipv6: []
	}, upstreamProxy: "", upstreamParams: { upstreamServer: "", upstreamPort: 0 }, chainProxy: "", chainProxyParams: {}, cleanIPs: ["www.speedtest.net"], ports: [443], fingerprint: "chrome", bestPingInterval: 30, enableTFO: false, enableECH: false, echServerName: "", customCdnAddrs: [], customCdnHost: "", customCdnSni: "", fragmentMode: "custom", fragmentPackets: "tlshello", fragmentLengthMin: 100, fragmentLengthMax: 200, fragmentDelayMin: 1, fragmentDelayMax: 1, fragmentMaxSplitMin: 0, fragmentMaxSplitMax: 0, customSubs: [], customConfigs: [], warpRemoteDNS: "1.1.1.1", warpEndpoints: ["engage.cloudflareclient.com:2408"], warpBestPingInterval: 30, warpReservedBytes: true, xrayUdpNoises: [{
			type: "rand", packet: "50-100", delay: "1-5", count: 5
		}], knockerNoiseMode: "quic", knockerNoiseCountMin: 10, knockerNoiseCountMax: 15, knockerNoiseSizeMin: 5, knockerNoiseSizeMax: 10, knockerNoiseDelayMin: 1, knockerNoiseDelayMax: 1, amneziaNoiseCount: 5, amneziaNoiseSizeMin: 50, amneziaNoiseSizeMax: 100, bypassIran: false, bypassChina: false, bypassRussia: false, bypassOpenAi: false, bypassGoogleAi: false, bypassMicrosoft: false, bypassOracle: false, bypassDocker: false, bypassAdobe: false, bypassEpicGames: false, bypassIntel: false, bypassAmd: false, bypassNvidia: false, bypassAsus: false, bypassHp: false, bypassLenovo: false, blockAds: false, blockPorn: false, blockUDP443: false, blockMalware: false, blockPhishing: false, blockCryptominers: false, customBypassRules: [], customBlockRules: [], customBypassSanctionRules: [], remoteSettings: "", panelVersion: "5.1.1"
};

async function proxyDnsQuery(request) {
	const { dohUrl, searchParams } = getRuntimeConfig();
	const url = new URL(dohUrl);
	searchParams.forEach((item, key) => {
		url.searchParams.set(key, item);
	});
	const request2 = new Request(url.toString(), request);
	return fetch(request2);
}

async function renderErrorPage(request) {
	const replaced = ERROR_HTML_CONTENT.replace("__ERROR_MESSAGE__", getErrorMessage(request)).replaceAll("__ICON__", ICON_CONTENT);
	return new Response(replaced, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

// ══════ کتابخانه jose (JWT) — کد شخص ثالث، دست‌نخورده ══════
var Pe = new TextEncoder;

var Te = new TextDecoder;

var De = 2 ** 32;

function Ie(...e) {
	const t = e.reduce((e, { length: t }) => e + t, 0);
	const r = new Uint8Array(t);
	let n = 0;
	for (const t of e) {
		r.set(t, n);
		n += t.length;
	}
	return r;
}

function Re(e) {
	const t = new Uint8Array(e.length);
	for (let r = 0; r < e.length; r++) {
		const n = e.charCodeAt(r);
		if (n > 127) {
			throw new TypeError("non-ASCII string encountered in encode()");
		}
		t[r] = n;
	}
	return t;
}

function Ne(e) {
	if (Uint8Array.prototype.toBase64) {
		return e.toBase64();
	}
	const t = 32768;
	const r = [];
	for (let n = 0; n < e.length; n += t) {
		r.push(String.fromCharCode.apply(null, e.subarray(n, n + t)));
	}
	return btoa(r.join(""));
}

function Ue(e) {
	if (Uint8Array.fromBase64) {
		return Uint8Array.fromBase64(e);
	}
	const t = atob(e);
	const r = new Uint8Array(t.length);
	for (let e = 0; e < t.length; e++) {
		r[e] = t.charCodeAt(e);
	}
	return r;
}

function Me(e) {
	if (Uint8Array.fromBase64) {
		return Uint8Array.fromBase64(typeof e == "string" ? e : Te.decode(e), { alphabet: "base64url" });
	}
	let t = e;
	if (t instanceof Uint8Array) {
		t = Te.decode(t);
	}
	t = t.replace(/-/g, "+").replace(/_/g, "/");
	try {
		return Ue(t);
	} catch {
		throw new TypeError("The input to be decoded is not correctly encoded.");
	}
}

function Le(e) {
	let t = e;
	if (typeof t == "string") {
		t = Pe.encode(t);
	}
	return Uint8Array.prototype.toBase64 ? t.toBase64({ alphabet: "base64url", omitPadding: true }) : Ne(t).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

var Oe = (e, t = "algorithm.name") => new TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);

var Be = (e, t) => e.name === t;

function $e(e) {
	return parseInt(e.name.slice(4), 10);
}

function ze(e, t) {
	if ($e(e.hash) !== t) {
		throw Oe(`SHA-${t}`, "algorithm.hash");
	}
}

function je(e) {
	switch (e) {
		case "ES256": return "P-256";
		case "ES384": return "P-384";
		case "ES512": return "P-521";
		default: throw new Error("unreachable");
	}
}

function He(e, t) {
	if (t && !e.usages.includes(t)) {
		throw new TypeError(`CryptoKey does not support this operation, its usages must include ${t}.`);
	}
}

function We(e, t, r) {
	switch (t) {
		case "HS256":
		case "HS384":
		case "HS512":
			if (!Be(e.algorithm, "HMAC")) {
				throw Oe("HMAC");
			}
			ze(e.algorithm, parseInt(t.slice(2), 10));
			break;
		case "RS256":
		case "RS384":
		case "RS512":
			if (!Be(e.algorithm, "RSASSA-PKCS1-v1_5")) {
				throw Oe("RSASSA-PKCS1-v1_5");
			}
			ze(e.algorithm, parseInt(t.slice(2), 10));
			break;
		case "PS256":
		case "PS384":
		case "PS512":
			if (!Be(e.algorithm, "RSA-PSS")) {
				throw Oe("RSA-PSS");
			}
			ze(e.algorithm, parseInt(t.slice(2), 10));
			break;
		case "Ed25519":
		case "EdDSA":
			if (!Be(e.algorithm, "Ed25519")) {
				throw Oe("Ed25519");
			}
			break;
		case "ML-DSA-44":
		case "ML-DSA-65":
		case "ML-DSA-87":
			if (!Be(e.algorithm, t)) {
				throw Oe(t);
			}
			break;
		case "ES256":
		case "ES384":
		case "ES512": {
			if (!Be(e.algorithm, "ECDSA")) {
				throw Oe("ECDSA");
			}
			const r = je(t);
			if (e.algorithm.namedCurve !== r) {
				throw Oe(r, "algorithm.namedCurve");
			}
			break;
		}
		default: throw new TypeError("CryptoKey does not support this operation");
	}
	He(e, r);
}

function Fe(e, t, ...r) {
	if ((r = r.filter(Boolean)).length > 2) {
		const t = r.pop();
		e += `one of type ${r.join(", ")}, or ${t}.`;
	} else {
		if (r.length === 2) {
			e += `one of type ${r[0]} or ${r[1]}.`;
		} else {
			e += `of type ${r[0]}.`;
		}
	}
	if (t == null) {
		e += ` Received ${t}`;
	} else {
		if (typeof t == "function" && t.name) {
			e += ` Received function ${t.name}`;
		} else {
			if (typeof t == "object" && t != null && t.constructor?.name) {
				e += ` Received an instance of ${t.constructor.name}`;
			}
		}
	}
	return e;
}

var Ge = (e, ...t) => Fe("Key must be ", e, ...t);

var Ve = (e, t, ...r) => Fe(`Key for the ${e} algorithm must be `, t, ...r);

var Ke = class extends Error {
	static code = "ERR_JOSE_GENERIC";
	code = "ERR_JOSE_GENERIC";
	constructor(e, t) {
		super(e, t);
		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);
	}
};

var Je = class extends Ke {
	static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
	code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
	claim;
	reason;
	payload;
	constructor(e, t, r = "unspecified", n = "unspecified") {
		super(e, { cause: { claim: r, reason: n, payload: t } });
		this.claim = r;
		this.reason = n;
		this.payload = t;
	}
};

var Ze = class extends Ke {
	static code = "ERR_JWT_EXPIRED";
	code = "ERR_JWT_EXPIRED";
	claim;
	reason;
	payload;
	constructor(e, t, r = "unspecified", n = "unspecified") {
		super(e, { cause: { claim: r, reason: n, payload: t } });
		this.claim = r;
		this.reason = n;
		this.payload = t;
	}
};

var Xe = class extends Ke {
	static code = "ERR_JOSE_ALG_NOT_ALLOWED";
	code = "ERR_JOSE_ALG_NOT_ALLOWED";
};

var qe = class extends Ke {
	static code = "ERR_JOSE_NOT_SUPPORTED";
	code = "ERR_JOSE_NOT_SUPPORTED";
};

var Ye = class extends Ke {
	static code = "ERR_JWS_INVALID";
	code = "ERR_JWS_INVALID";
};

var Qe = class extends Ke {
	static code = "ERR_JWT_INVALID";
	code = "ERR_JWT_INVALID";
};

var et = class extends Ke {
	static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
	code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
	constructor(e = "signature verification failed", t) {
		super(e, t);
	}
};

var tt = e => {
	if (e?.[Symbol.toStringTag] === "CryptoKey") {
		return true;
	}
	try {
		return e instanceof CryptoKey;
	} catch {
		return false;
	}
};

var rt = e => e?.[Symbol.toStringTag] === "KeyObject";

var nt = e => tt(e) || rt(e);

function at(e, t) {
	if (e) {
		throw new TypeError(`${t} can only be called once`);
	}
}

function ot(e, t, r) {
	try {
		return Me(e);
	} catch {
		throw new r(`Failed to base64url decode the ${t}`);
	}
}

var st = e => typeof e == "object" && e !== null;

function it(e) {
	if (!st(e) || Object.prototype.toString.call(e) !== "[object Object]") {
		return false;
	}
	if (Object.getPrototypeOf(e) === null) {
		return true;
	}
	let t = e;
	for (; Object.getPrototypeOf(t) !== null;) {
		t = Object.getPrototypeOf(t);
	}
	return Object.getPrototypeOf(e) === t;
}

function ct(...e) {
	const t = e.filter(Boolean);
	if (t.length === 0 || t.length === 1) {
		return true;
	}
	let r;
	for (const e of t) {
		const t = Object.keys(e);
		if (r && r.size !== 0) {
			for (const e of t) {
				if (r.has(e)) {
					return false;
				}
				r.add(e);
			}
		} else {
			r = new Set(t);
		}
	}
	return true;
}

var lt = e => it(e) && typeof e.kty == "string";

var ut = e => e.kty !== "oct" && (e.kty === "AKP" && typeof e.priv == "string" || typeof e.d == "string");

var dt = e => e.kty !== "oct" && e.d === undefined && e.priv === undefined;

var ht = e => e.kty === "oct" && typeof e.k == "string";

function pt(e, t) {
	if (e.startsWith("RS") || e.startsWith("PS")) {
		const { modulusLength: r } = t.algorithm;
		if (typeof r != "number" || r < 2048) {
			throw new TypeError(`${e} requires key modulusLength to be 2048 bits or larger`);
		}
	}
}

function ft(e, t) {
	const r = `SHA-${e.slice(-3)}`;
	switch (e) {
		case "HS256":
		case "HS384":
		case "HS512": return { hash: r, name: "HMAC" };
		case "PS256":
		case "PS384":
		case "PS512": return { hash: r, name: "RSA-PSS", saltLength: parseInt(e.slice(-3), 10) >> 3 };
		case "RS256":
		case "RS384":
		case "RS512": return { hash: r, name: "RSASSA-PKCS1-v1_5" };
		case "ES256":
		case "ES384":
		case "ES512": return { hash: r, name: "ECDSA", namedCurve: t.namedCurve };
		case "Ed25519":
		case "EdDSA": return { name: "Ed25519" };
		case "ML-DSA-44":
		case "ML-DSA-65":
		case "ML-DSA-87": return { name: e };
		default: throw new qe(`alg ${e} is not supported either by JOSE or your javascript runtime`);
	}
}

async function mt(e, t, r) {
	if (t instanceof Uint8Array) {
		if (!e.startsWith("HS")) {
			throw new TypeError(Ge(t, "CryptoKey", "KeyObject", "JSON Web Key"));
		}
		return crypto.subtle.importKey("raw", t, { hash: `SHA-${e.slice(-3)}`, name: "HMAC" }, false, [r]);
	}
	We(t, e, r);
	return t;
}

async function gt(e, t, r) {
	const n = await mt(e, t, "sign");
	pt(e, n);
	const a = await crypto.subtle.sign(ft(e, n.algorithm), n, r);
	return new Uint8Array(a);
}

async function yt(e, t, r, n) {
	const a = await mt(e, t, "verify");
	pt(e, a);
	const o = ft(e, a.algorithm);
	try {
		return await crypto.subtle.verify(o, a, r, n);
	} catch {
		return false;
	}
}

var wt = 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value';

function bt(e) {
	let t;
	let r;
	switch (e.kty) {
		case "AKP":
			switch (e.alg) {
				case "ML-DSA-44":
				case "ML-DSA-65":
				case "ML-DSA-87":
					t = { name: e.alg };
					r = e.priv ? ["sign"] : ["verify"];
					break;
				default: throw new qe(wt);
			}
			break;
		case "RSA":
			switch (e.alg) {
				case "PS256":
				case "PS384":
				case "PS512":
					t = { name: "RSA-PSS", hash: `SHA-${e.alg.slice(-3)}` };
					r = e.d ? ["sign"] : ["verify"];
					break;
				case "RS256":
				case "RS384":
				case "RS512":
					t = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e.alg.slice(-3)}` };
					r = e.d ? ["sign"] : ["verify"];
					break;
				case "RSA-OAEP":
				case "RSA-OAEP-256":
				case "RSA-OAEP-384":
				case "RSA-OAEP-512":
					t = { name: "RSA-OAEP", hash: `SHA-${parseInt(e.alg.slice(-3), 10) || 1}` };
					r = e.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
					break;
				default: throw new qe(wt);
			}
			break;
		case "EC":
			switch (e.alg) {
				case "ES256":
				case "ES384":
				case "ES512":
					t = { name: "ECDSA", namedCurve: { ES256: "P-256", ES384: "P-384", ES512: "P-521" }[e.alg] };
					r = e.d ? ["sign"] : ["verify"];
					break;
				case "ECDH-ES":
				case "ECDH-ES+A128KW":
				case "ECDH-ES+A192KW":
				case "ECDH-ES+A256KW":
					t = { name: "ECDH", namedCurve: e.crv };
					r = e.d ? ["deriveBits"] : [];
					break;
				default: throw new qe(wt);
			}
			break;
		case "OKP":
			switch (e.alg) {
				case "Ed25519":
				case "EdDSA":
					t = { name: "Ed25519" };
					r = e.d ? ["sign"] : ["verify"];
					break;
				case "ECDH-ES":
				case "ECDH-ES+A128KW":
				case "ECDH-ES+A192KW":
				case "ECDH-ES+A256KW":
					t = { name: e.crv };
					r = e.d ? ["deriveBits"] : [];
					break;
				default: throw new qe(wt);
			}
			break;
		default: throw new qe('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
	}
	return { algorithm: t, keyUsages: r };
}

async function vt(e) {
	if (!e.alg) {
		throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
	}
	const { algorithm: t, keyUsages: r } = bt(e);
	const n = { ...e };
	if (n.kty !== "AKP") {
		delete n.alg;
	}
	delete n.use;
	return crypto.subtle.importKey("jwk", n, t, e.ext ?? (!e.d && !e.priv), e.key_ops ?? r);
}

var _t = "given KeyObject instance cannot be used for this algorithm";

var kt;

var St = async (e, t, r, n = false) => {
	kt ||= new WeakMap;
	let a = kt.get(e);
	if (a?.[r]) {
		return a[r];
	}
	const o = await vt({ ...t, alg: r });
	if (n) {
		Object.freeze(e);
	}
	if (a) {
		a[r] = o;
	} else {
		kt.set(e, { [r]: o });
	}
	return o;
};

var xt = (e, t) => {
	kt ||= new WeakMap;
	let r = kt.get(e);
	if (r?.[t]) {
		return r[t];
	}
	const n = e.type === "public";
	const a = !!n;
	let o;
	if (e.asymmetricKeyType === "x25519") {
		switch (t) {
			case "ECDH-ES":
			case "ECDH-ES+A128KW":
			case "ECDH-ES+A192KW":
			case "ECDH-ES+A256KW": break;
			default: throw new TypeError(_t);
		}
		o = e.toCryptoKey(e.asymmetricKeyType, a, n ? [] : ["deriveBits"]);
	}
	if (e.asymmetricKeyType === "ed25519") {
		if (t !== "EdDSA" && t !== "Ed25519") {
			throw new TypeError(_t);
		}
		o = e.toCryptoKey(e.asymmetricKeyType, a, [n ? "verify" : "sign"]);
	}
	switch (e.asymmetricKeyType) {
		case "ml-dsa-44":
		case "ml-dsa-65":
		case "ml-dsa-87":
			if (t !== e.asymmetricKeyType.toUpperCase()) {
				throw new TypeError(_t);
			}
			o = e.toCryptoKey(e.asymmetricKeyType, a, [n ? "verify" : "sign"]);
	}
	if (e.asymmetricKeyType === "rsa") {
		let r;
		switch (t) {
			case "RSA-OAEP":
				r = "SHA-1";
				break;
			case "RS256":
			case "PS256":
			case "RSA-OAEP-256":
				r = "SHA-256";
				break;
			case "RS384":
			case "PS384":
			case "RSA-OAEP-384":
				r = "SHA-384";
				break;
			case "RS512":
			case "PS512":
			case "RSA-OAEP-512":
				r = "SHA-512";
				break;
			default: throw new TypeError(_t);
		}
		if (t.startsWith("RSA-OAEP")) {
			return e.toCryptoKey({ name: "RSA-OAEP", hash: r }, a, n ? ["encrypt"] : ["decrypt"]);
		}
		o = e.toCryptoKey({ name: t.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5", hash: r }, a, [n ? "verify" : "sign"]);
	}
	if (e.asymmetricKeyType === "ec") {
		const s = new Map([["prime256v1", "P-256"], ["secp384r1", "P-384"], ["secp521r1", "P-521"]]).get(e.asymmetricKeyDetails?.namedCurve);
		if (!s) {
			throw new TypeError(_t);
		}
		const i = { ES256: "P-256", ES384: "P-384", ES512: "P-521" };
		if (i[t] && s === i[t]) {
			o = e.toCryptoKey({ name: "ECDSA", namedCurve: s }, a, [n ? "verify" : "sign"]);
		}
		if (t.startsWith("ECDH-ES")) {
			o = e.toCryptoKey({ name: "ECDH", namedCurve: s }, a, n ? [] : ["deriveBits"]);
		}
	}
	if (!o) {
		throw new TypeError(_t);
	}
	if (r) {
		r[t] = o;
	} else {
		kt.set(e, { [t]: o });
	}
	return o;
};

async function Ct(e, t) {
	if (e instanceof Uint8Array) {
		return e;
	}
	if (tt(e)) {
		return e;
	}
	if (rt(e)) {
		if (e.type === "secret") {
			return e.export();
		}
		if ("toCryptoKey" in e && typeof e.toCryptoKey == "function") {
			try {
				return xt(e, t);
			} catch (e) {
				if (e instanceof TypeError) {
					throw e;
				}
			}
		}
		let r = e.export({ format: "jwk" });
		return St(e, r, t);
	}
	if (lt(e)) {
		return e.k ? Me(e.k) : St(e, e, t, true);
	}
	throw new Error("unreachable");
}

function Et(e, t, r, n, a) {
	if (a.crit !== undefined && n?.crit === undefined) {
		throw new e('"crit" (Critical) Header Parameter MUST be integrity protected');
	}
	if (!n || n.crit === undefined) {
		return new Set;
	}
	if (!Array.isArray(n.crit) || n.crit.length === 0 || n.crit.some(e => typeof e != "string" || e.length === 0)) {
		throw new e('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
	}
	let o;
	o = r !== undefined ? new Map([...Object.entries(r), ...t.entries()]) : t;
	for (const t of n.crit) {
		if (!o.has(t)) {
			throw new qe(`Extension Header Parameter "${t}" is not recognized`);
		}
		if (a[t] === undefined) {
			throw new e(`Extension Header Parameter "${t}" is missing`);
		}
		if (o.get(t) && n[t] === undefined) {
			throw new e(`Extension Header Parameter "${t}" MUST be integrity protected`);
		}
	}
	return new Set(n.crit);
}

function At(e, t) {
	if (t !== undefined && (!Array.isArray(t) || t.some(e => typeof e != "string"))) {
		throw new TypeError(`"${e}" option must be an array of strings`);
	}
	if (t) {
		return new Set(t);
	}
}

var Pt = e => e?.[Symbol.toStringTag];

var Tt = (e, t, r) => {
	if (t.use !== undefined) {
		let e;
		switch (r) {
			case "sign":
			case "verify":
				e = "sig";
				break;
			case "encrypt":
			case "decrypt":
				e = "enc";
				break;
		}
		if (t.use !== e) {
			throw new TypeError(`Invalid key for this operation, its "use" must be "${e}" when present`);
		}
	}
	if (t.alg !== undefined && t.alg !== e) {
		throw new TypeError(`Invalid key for this operation, its "alg" must be "${e}" when present`);
	}
	if (Array.isArray(t.key_ops)) {
		let n;
		switch (true) {
			case r === "sign" || r === "verify":
			case e === "dir":
			case e.includes("CBC-HS"):
				n = r;
				break;
			case e.startsWith("PBES2"):
				n = "deriveBits";
				break;
			case /^A\d{3}(?:GCM)?(?:KW)?$/.test(e):
				n = !e.includes("GCM") && e.endsWith("KW") ? r === "encrypt" ? "wrapKey" : "unwrapKey" : r;
				break;
			case r === "encrypt" && e.startsWith("RSA"):
				n = "wrapKey";
				break;
			case r === "decrypt":
				n = e.startsWith("RSA") ? "unwrapKey" : "deriveBits";
				break;
		}
		if (n && t.key_ops?.includes?.(n) === false) {
			throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${n}" when present`);
		}
	}
	return true;
};

var Dt = (e, t, r) => {
	if (!(t instanceof Uint8Array)) {
		if (lt(t)) {
			if (ht(t) && Tt(e, t, r)) {
				return;
			}
			throw new TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
		}
		if (!nt(t)) {
			throw new TypeError(Ve(e, t, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
		}
		if (t.type !== "secret") {
			throw new TypeError(`${Pt(t)} instances for symmetric algorithms must be of type "secret"`);
		}
	}
};

var It = (e, t, r) => {
	if (lt(t)) {
		switch (r) {
			case "decrypt":
			case "sign":
				if (ut(t) && Tt(e, t, r)) {
					return;
				}
				throw new TypeError("JSON Web Key for this operation must be a private JWK");
			case "encrypt":
			case "verify":
				if (dt(t) && Tt(e, t, r)) {
					return;
				}
				throw new TypeError("JSON Web Key for this operation must be a public JWK");
		}
	}
	if (!nt(t)) {
		throw new TypeError(Ve(e, t, "CryptoKey", "KeyObject", "JSON Web Key"));
	}
	if (t.type === "secret") {
		throw new TypeError(`${Pt(t)} instances for asymmetric algorithms must not be of type "secret"`);
	}
	if (t.type === "public") {
		switch (r) {
			case "sign": throw new TypeError(`${Pt(t)} instances for asymmetric algorithm signing must be of type "private"`);
			case "decrypt": throw new TypeError(`${Pt(t)} instances for asymmetric algorithm decryption must be of type "private"`);
		}
	}
	if (t.type === "private") {
		switch (r) {
			case "verify": throw new TypeError(`${Pt(t)} instances for asymmetric algorithm verifying must be of type "public"`);
			case "encrypt": throw new TypeError(`${Pt(t)} instances for asymmetric algorithm encryption must be of type "public"`);
		}
	}
};

function Rt(e, t, r) {
	switch (e.substring(0, 2)) {
		case "A1":
		case "A2":
		case "di":
		case "HS":
		case "PB":
			Dt(e, t, r);
			break;
		default: It(e, t, r);
	}
}

async function Nt(e, t, r) {
	if (!it(e)) {
		throw new Ye("Flattened JWS must be an object");
	}
	if (e.protected === undefined && e.header === undefined) {
		throw new Ye('Flattened JWS must have either of the "protected" or "header" members');
	}
	if (e.protected !== undefined && typeof e.protected != "string") {
		throw new Ye("JWS Protected Header incorrect type");
	}
	if (e.payload === undefined) {
		throw new Ye("JWS Payload missing");
	}
	if (typeof e.signature != "string") {
		throw new Ye("JWS Signature missing or incorrect type");
	}
	if (e.header !== undefined && !it(e.header)) {
		throw new Ye("JWS Unprotected Header incorrect type");
	}
	let n = {};
	if (e.protected) {
		try {
			const t = Me(e.protected);
			n = JSON.parse(Te.decode(t));
		} catch {
			throw new Ye("JWS Protected Header is invalid");
		}
	}
	if (!ct(n, e.header)) {
		throw new Ye("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
	}
	const a = { ...n, ...e.header };
	let s = true;
	if (Et(Ye, new Map([["b64", true]]), r?.crit, n, a).has("b64") && (s = n.b64, typeof s != "boolean")) {
		throw new Ye('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
	}
	const { alg: i } = a;
	if (typeof i != "string" || !i) {
		throw new Ye('JWS "alg" (Algorithm) Header Parameter missing or invalid');
	}
	const c = r && At("algorithms", r.algorithms);
	if (c && !c.has(i)) {
		throw new Xe('"alg" (Algorithm) Header Parameter value not allowed');
	}
	if (s) {
		if (typeof e.payload != "string") {
			throw new Ye("JWS Payload must be a string");
		}
	} else if (typeof e.payload != "string" && !(e.payload instanceof Uint8Array)) {
		throw new Ye("JWS Payload must be a string or an Uint8Array instance");
	}
	let l = false;
	if (typeof t == "function") {
		t = await t(n, e);
		l = true;
	}
	Rt(i, t, "verify");
	const u = Ie(e.protected !== undefined ? Re(e.protected) : new Uint8Array, Re("."), typeof e.payload == "string" ? s ? Re(e.payload) : Pe.encode(e.payload) : e.payload);
	const d = ot(e.signature, "signature", Ye);
	const h = await Ct(t, i);
	if (!await yt(i, h, d, u)) {
		throw new et;
	}
	let f;
	f = s ? ot(e.payload, "payload", Ye) : typeof e.payload == "string" ? Pe.encode(e.payload) : e.payload;
	const m = { payload: f };
	if (e.protected !== undefined) {
		m.protectedHeader = n;
	}
	if (e.header !== undefined) {
		m.unprotectedHeader = e.header;
	}
	return l ? { ...m, key: h } : m;
}

async function Ut(e, t, r) {
	if (e instanceof Uint8Array && (e = Te.decode(e)), typeof e != "string") {
		throw new Ye("Compact JWS must be a string or Uint8Array");
	}
	const { 0: n, 1: a, 2: o, length: s } = e.split(".");
	if (s !== 3) {
		throw new Ye("Invalid Compact JWS");
	}
	const i = await Nt({ payload: a, protected: n, signature: o }, t, r);
	const c = { payload: i.payload, protectedHeader: i.protectedHeader };
	return typeof t == "function" ? { ...c, key: i.key } : c;
}

var Mt = e => Math.floor(e.getTime() / 1e3);

var Lt = 60;

var Ot = 3600;

var Bt = 86400;

var $t = 7 * Bt;

var zt = 31557600;

var jt = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;

function Ht(e) {
	const t = jt.exec(e);
	if (!t || t[4] && t[1]) {
		throw new TypeError("Invalid time period format");
	}
	const r = parseFloat(t[2]);
	let a;
	switch (t[3].toLowerCase()) {
		case "sec":
		case "secs":
		case "second":
		case "seconds":
		case "s":
			a = Math.round(r);
			break;
		case "minute":
		case "minutes":
		case "min":
		case "mins":
		case "m":
			a = Math.round(r * Lt);
			break;
		case "hour":
		case "hours":
		case "hr":
		case "hrs":
		case "h":
			a = Math.round(r * Ot);
			break;
		case "day":
		case "days":
		case "d":
			a = Math.round(r * Bt);
			break;
		case "week":
		case "weeks":
		case "w":
			a = Math.round(r * $t);
			break;
		default:
			a = Math.round(r * zt);
			break;
	}
	return t[1] === "-" || t[4] === "ago" ? -a : a;
}

function Wt(e, t) {
	if (!Number.isFinite(t)) {
		throw new TypeError(`Invalid ${e} input`);
	}
	return t;
}

var Ft = e => e.includes("/") ? e.toLowerCase() : `application/${e.toLowerCase()}`;

var Gt = (e, t) => typeof e == "string" ? t.includes(e) : !!Array.isArray(e) && t.some(Set.prototype.has.bind(new Set(e)));

function Vt(e, t, r = {}) {
	let n;
	try {
		n = JSON.parse(Te.decode(t));
	} catch {
	}
	if (!it(n)) {
		throw new Qe("JWT Claims Set must be a top-level JSON object");
	}
	const { typ: a } = r;
	if (a && (typeof e.typ != "string" || Ft(e.typ) !== Ft(a))) {
		throw new Je('unexpected "typ" JWT header value', n, "typ", "check_failed");
	}
	const { requiredClaims: o = [], issuer: s, subject: i, audience: c, maxTokenAge: l } = r;
	const u = [...o];
	if (l !== undefined) {
		u.push("iat");
	}
	if (c !== undefined) {
		u.push("aud");
	}
	if (i !== undefined) {
		u.push("sub");
	}
	if (s !== undefined) {
		u.push("iss");
	}
	for (const e of new Set(u.reverse())) {
		if (!(e in n)) {
			throw new Je(`missing required "${e}" claim`, n, e, "missing");
		}
	}
	if (s && !(Array.isArray(s) ? s : [s]).includes(n.iss)) {
		throw new Je('unexpected "iss" claim value', n, "iss", "check_failed");
	}
	if (i && n.sub !== i) {
		throw new Je('unexpected "sub" claim value', n, "sub", "check_failed");
	}
	if (c && !Gt(n.aud, typeof c == "string" ? [c] : c)) {
		throw new Je('unexpected "aud" claim value', n, "aud", "check_failed");
	}
	let d;
	switch (typeof r.clockTolerance) {
		case "string":
			d = Ht(r.clockTolerance);
			break;
		case "number":
			d = r.clockTolerance;
			break;
		case "undefined":
			d = 0;
			break;
		default: throw new TypeError("Invalid clockTolerance option type");
	}
	const { currentDate: h } = r;
	const p = Mt(h || new Date);
	if ((n.iat !== undefined || l) && typeof n.iat != "number") {
		throw new Je('"iat" claim must be a number', n, "iat", "invalid");
	}
	if (n.nbf !== undefined) {
		if (typeof n.nbf != "number") {
			throw new Je('"nbf" claim must be a number', n, "nbf", "invalid");
		}
		if (n.nbf > p + d) {
			throw new Je('"nbf" claim timestamp check failed', n, "nbf", "check_failed");
		}
	}
	if (n.exp !== undefined) {
		if (typeof n.exp != "number") {
			throw new Je('"exp" claim must be a number', n, "exp", "invalid");
		}
		if (n.exp <= p - d) {
			throw new Ze('"exp" claim timestamp check failed', n, "exp", "check_failed");
		}
	}
	if (l) {
		const e = p - n.iat;
		if (e - d > (typeof l == "number" ? l : Ht(l))) {
			throw new Ze('"iat" claim timestamp check failed (too far in the past)', n, "iat", "check_failed");
		}
		if (e < 0 - d) {
			throw new Je('"iat" claim timestamp check failed (it should be in the past)', n, "iat", "check_failed");
		}
	}
	return n;
}

var Kt = class {
	#e;
	constructor(e) {
		if (!it(e)) {
			throw new TypeError("JWT Claims Set MUST be an object");
		}
		this.#e = structuredClone(e);
	}
	data() {
		return Pe.encode(JSON.stringify(this.#e));
	}
	get iss() {
		return this.#e.iss;
	}
	set iss(e) {
		this.#e.iss = e;
	}
	get sub() {
		return this.#e.sub;
	}
	set sub(e) {
		this.#e.sub = e;
	}
	get aud() {
		return this.#e.aud;
	}
	set aud(e) {
		this.#e.aud = e;
	}
	set jti(e) {
		this.#e.jti = e;
	}
	set nbf(e) {
		if (typeof e == "number") {
			this.#e.nbf = Wt("setNotBefore", e);
		} else {
			if (e instanceof Date) {
				this.#e.nbf = Wt("setNotBefore", Mt(e));
			} else {
				this.#e.nbf = Mt(new Date) + Ht(e);
			}
		}
	}
	set exp(e) {
		if (typeof e == "number") {
			this.#e.exp = Wt("setExpirationTime", e);
		} else {
			if (e instanceof Date) {
				this.#e.exp = Wt("setExpirationTime", Mt(e));
			} else {
				this.#e.exp = Mt(new Date) + Ht(e);
			}
		}
	}
	set iat(e) {
		if (e === undefined) {
			this.#e.iat = Mt(new Date);
		} else {
			if (e instanceof Date) {
				this.#e.iat = Wt("setIssuedAt", Mt(e));
			} else {
				this.#e.iat = Wt("setIssuedAt", typeof e == "string" ? Mt(new Date) + Ht(e) : e);
			}
		}
	}
};

async function jwtVerify(e, t, r) {
	const n = await Ut(e, t, r);
	if (n.protectedHeader.crit?.includes("b64") && n.protectedHeader.b64 === false) {
		throw new Qe("JWTs MUST NOT use unencoded payload");
	}
	const o = { payload: Vt(n.protectedHeader, n.payload, r), protectedHeader: n.protectedHeader };
	return typeof t == "function" ? { ...o, key: n.key } : o;
}

var Zt = class {
	#e;
	#t;
	#r;
	constructor(e) {
		if (!(e instanceof Uint8Array)) {
			throw new TypeError("payload must be an instance of Uint8Array");
		}
		this.#e = e;
	}
	setProtectedHeader(e) {
		at(this.#t, "setProtectedHeader");
		this.#t = e;
		return this;
	}
	setUnprotectedHeader(e) {
		at(this.#r, "setUnprotectedHeader");
		this.#r = e;
		return this;
	}
	async sign(e, t) {
		if (!this.#t && !this.#r) {
			throw new Ye("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
		}
		if (!ct(this.#t, this.#r)) {
			throw new Ye("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
		}
		const r = { ...this.#t, ...this.#r };
		let a = true;
		if (Et(Ye, new Map([["b64", true]]), t?.crit, this.#t, r).has("b64") && (a = this.#t.b64, typeof a != "boolean")) {
			throw new Ye('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
		}
		const { alg: o } = r;
		if (typeof o != "string" || !o) {
			throw new Ye('JWS "alg" (Algorithm) Header Parameter missing or invalid');
		}
		let s;
		let i;
		let c;
		let l;
		Rt(o, e, "sign");
		if (a) {
			s = Le(this.#e);
			i = Re(s);
		} else {
			i = this.#e;
			s = "";
		}
		if (this.#t) {
			c = Le(JSON.stringify(this.#t));
			l = Re(c);
		} else {
			c = "";
			l = new Uint8Array;
		}
		const u = Ie(l, Re("."), i);
		const d = await Ct(e, o);
		const p = { signature: Le(await gt(o, d, u)), payload: s };
		if (this.#r) {
			p.header = this.#r;
		}
		if (this.#t) {
			p.protected = c;
		}
		return p;
	}
};

var Xt = class {
	#n;
	constructor(e) {
		this.#n = new Zt(e);
	}
	setProtectedHeader(e) {
		this.#n.setProtectedHeader(e);
		return this;
	}
	async sign(e, t) {
		const r = await this.#n.sign(e, t);
		if (r.payload === undefined) {
			throw new TypeError("use the flattened module for creating JWS with b64: false");
		}
		return `${r.protected}.${r.payload}.${r.signature}`;
	}
};

var SignJWT = class {
	#t;
	#a;
	constructor(e = {}) {
		this.#a = new Kt(e);
	}
	setIssuer(e) {
		this.#a.iss = e;
		return this;
	}
	setSubject(e) {
		this.#a.sub = e;
		return this;
	}
	setAudience(e) {
		this.#a.aud = e;
		return this;
	}
	setJti(e) {
		this.#a.jti = e;
		return this;
	}
	setNotBefore(e) {
		this.#a.nbf = e;
		return this;
	}
	setExpirationTime(e) {
		this.#a.exp = e;
		return this;
	}
	setIssuedAt(e) {
		this.#a.iat = e;
		return this;
	}
	setProtectedHeader(e) {
		this.#t = e;
		return this;
	}
	async sign(e, t) {
		const r = new Xt(this.#a.data());
		if (r.setProtectedHeader(this.#t), Array.isArray(this.#t?.crit) && this.#t.crit.includes("b64") && this.#t.b64 === false) {
			throw new Qe("JWTs MUST NOT use unencoded payload");
		}
		return r.sign(e, t);
	}
};

// ══════ ورود، خروج و احراز هویت ══════
function buildLogoutResponse() {
	return jsonResponse(true, 200, "Successfully logged out!", null, {
		"Set-Cookie": "jwtToken=; Path=/; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT", "Content-Type": "text/plain"
	});
}

async function authenticateUser(request, env) {
	if (request.method !== "POST") {
		return jsonResponse(false, 405, "Method not allowed.");
	}
	const data = await request.json();
	const pwd = await env.kv.get("pwd");
	const { accEmail } = getRuntimeConfig();
	const lower = data.username?.toLowerCase();
	if (lower !== accEmail || data.password !== pwd) {
		return jsonResponse(false, 401, "Wrong Credentials.");
	}
	let secretKey = await env.kv.get("secretKey");
	if (!(secretKey)) {
		secretKey = generateSecretKey();
		await env.kv.put("secretKey", secretKey);
	}
	const encoded = (new TextEncoder).encode(secretKey);
	const { accID } = getRuntimeConfig();
	return jsonResponse(true, 200, "Successfully generated Auth token", null, {
		"Set-Cookie": `jwtToken=${await new SignJWT({ id: accID }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("24h").sign(encoded)}; Path=/; HttpOnly; Secure; Max-Age=86400; SameSite=Strict`, "Content-Type": "text/plain"
	});
}

function generateSecretKey() {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, _item => _item.toString(16).padStart(2, "0")).join("");
}

async function isAuthenticated(request, env) {
	try {
		const secretKey = await env.kv.get("secretKey");
		if (secretKey === null) {
			console.log("Secret key not found in KV.");
			return false;
		}
		const encoded = (new TextEncoder).encode(secretKey);
		const match = request.headers.get("Cookie")?.match(/(^|;\s*)jwtToken=([^;]*)/);
		const item = match ? match[2] : null;
		if (!item) {
			console.log("Unauthorized: Token not available!");
			return false;
		}
		const { payload } = await jwtVerify(item, encoded);
		console.log(`Successfully authenticated, User ID: ${payload.id}`);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function handleResetPassword(request, env) {
	const authenticated = await isAuthenticated(request, env);
	const pwd = await env.kv.get("pwd");
	if (pwd && !authenticated) {
		return jsonResponse(false, 401, "Unauthorized.");
	}
	const data = await request.json();
	const { accEmail } = getRuntimeConfig();
	return authenticated || data.username ? data.username && data.username !== accEmail ? jsonResponse(false, 400, "Wrong username.") : data.password === pwd ? jsonResponse(false, 400, "Please enter a new Password.") : (await env.kv.put("pwd", data.password), jsonResponse(true, 200, "Successfully logged in!", null, {
		"Set-Cookie": "jwtToken=; Path=/; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT", "Content-Type": "text/plain"
	})) : jsonResponse(false, 400, "Missing username.");
}

async function proxyToFallback(request) {
	const { url, method, headers, body } = request;
	const { fallback } = getRuntimeConfig();
	if (!fallback) {
		return new Response("Not Found", { status: 404 });
	}
	const url2 = new URL(url);
	url2.hostname = fallback;
	url2.protocol = "https:";
	const request2 = new Request(url2.toString(), {
		method: method, headers: headers, body: body, redirect: "manual"
	});
	return fetch(request2);
}

async function handleLoginRoutes(request, env) {
	const { pathname } = getRuntimeConfig();
	switch (pathname.split("/").slice(2).join("/")) {
		case "login": return renderLoginPage(request, env);
		case "login/authenticate": return authenticateUser(request, env);
		default: return proxyToFallback(request);
	}
}

async function renderLoginPage(request, env) {
	if (await isAuthenticated(request, env)) {
		const url = new URL("./panel", request.url);
		return Response.redirect(url, 302);
	}
	const replaced = LOGIN_HTML_CONTENT.replaceAll("__ICON__", ICON_CONTENT);
	return new Response(replaced, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

async function getCfUsage() {
	const { accID, apiToken, mainDomain } = getRuntimeConfig();
	const workerName = mainDomain.split(".")[0];
	try {
		const now = new Date;
		const endTime = now.toISOString();
		const graphqlRequest = {
			query: "\n                query GetUsage($accountTag: String!, $scriptName: String!, $start: String!, $end: String!) {\n                    viewer {\n                        accounts(filter: { accountTag: $accountTag }) {\n                            total: workersInvocationsAdaptive(\n                                limit: 100\n                                filter: { datetime_geq: $start, datetime_leq: $end }\n                            ) {\n                                sum { requests }\n                            }\n                            worker: workersInvocationsAdaptive(\n                                limit: 100\n                                filter: { scriptName: $scriptName, datetime_geq: $start, datetime_leq: $end }\n                            ) {\n                                sum { requests }\n                            }\n                        }\n                    }\n                }\n            ", variables: {
				accountTag: accID, scriptName: workerName, start: new Date(now.getTime() - 864e5).toISOString(), end: endTime
			}
		};
		const response = await fetch(`https://api.cloudflare.com/client/v4/graphql?nocache=${Date.now()}`, { method: "POST", headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify(graphqlRequest) });
		const data = await response.json();
		const account = data?.data?.viewer?.accounts?.[0];
		const totalRequests = (account?.total ?? []).reduce((sum, entry) => sum + (entry?.sum?.requests || 0), 0);
		return { success: true, total: totalRequests, worker: (account?.worker ?? []).reduce((sum, entry) => sum + (entry?.sum?.requests || 0), 0) };
	} catch (error) {
		return { success: false, error: "Error fetching usage data. Check your credentials." };
	}
}

async function handleUsageRequest(request, env) {
	try {
		if (!await isAuthenticated(request, env)) {
			throw new Error("Unauthorized or expired session.");
		}
		const cfUsage = await getCfUsage();
		return cfUsage.success ? jsonResponse(true, 200, "", { total: cfUsage.total, worker: cfUsage.worker }) : jsonResponse(false, 500, "Failed to fetch account usage.");
	} catch (error) {
		return jsonResponse(false, 500, `Error occurred while fetching usage: ${getErrorMessage(error)}`);
	}
}

// ══════ اعتبارسنجی تنظیمات پنل ══════
var SETTINGS_VALIDATORS = [validatePorts, validateRemoteDns, validateAntiSanctionDns, validateLocalDns, validateWarpRemoteDns, validateCleanIps, validateProxyIps, validateNat64Prefixes, validateWarpEndpoints, validateRangeSettings, validateUpstreamProxy, validateChainProxy, validateCustomCdn, validateMahsaNoise, validateXrayNoise, validateRoutingRules, validateEchServerName, validateVlessUuid, validateTrojanPassword, validateFallbackDomain, validateDohUrl, validateSubscriptionPath, validateCustomDomain, validateRawSubscriptions, validateRemoteSettingsUrl];

function validateSettings(settings) {
	if (!settings) {
		return null;
	}
	const list = [];
	SETTINGS_VALIDATORS.forEach(item => item(settings, list));
	return list.length ? list : null;
}

function isValidHostPort(hostPort, requirePort = false) {
	const match = hostPort.match(/^(?<host>\[.*?\]|[^:]+)(?::(?<port>\d+))?$/);
	if (!match?.groups?.host) {
		return false;
	}
	const { host, port } = match.groups;
	if (!!port != !!requirePort) {
		return false;
	}
	if (port) {
		const number = Number(port);
		if (number < 1 || number > 65535) {
			return false;
		}
	}
	return isIPv6(host) || isIPv4(host) || isDomain(host);
}

function validateRemoteDns(settings, errors) {
	let dohUrl;
	try {
		dohUrl = new URL(settings.remoteDNS);
	} catch {
		return void errors.push({ field: "Remote DNS", message: ["Invalid DoH, Please enter a valid URL."] });
	}
	const cloudflareHosts = ["1.1.1.1", "1.0.0.1", "1.1.1.2", "1.0.0.2", "1.1.1.3", "1.0.0.3", "2606:4700:4700::1111", "2606:4700:4700::1001", "2606:4700:4700::1112", "2606:4700:4700::1002", "2606:4700:4700::1113", "2606:4700:4700::1003", "one.one.one.one", "1dot1dot1dot1", "cloudflare-dns.com", "family.cloudflare-dns.com", "security.cloudflare-dns.com"];
	if (!(["tcp:", "https:", "tls:"].includes(dohUrl.protocol))) {
		errors.push({ field: "Remote DNS", message: ["It can be only TCP, DoH or DoT servers."] });
	}
	if (cloudflareHosts.includes(dohUrl.hostname)) {
		errors.push({
			field: "Remote DNS", message: ["Cloudflare DNS is not allowed for workers.", "Please use other public DNS servers like Google, Adguard..."]
		});
	}
}

function validateAntiSanctionDns(settings, errors) {
	const antiSanctionDNS = settings.antiSanctionDNS;
	let host;
	try {
		host = new URL(antiSanctionDNS).hostname;
	} catch {
		host = antiSanctionDNS;
	}
	if (!(isValidHostPort(host, false))) {
		errors.push({ field: "Anti Sanction DNS", message: ["Invalid IPs or Domains."] });
	}
}

function validateWarpRemoteDns(settings, errors) {
	if (!(isIPv4(settings.warpRemoteDNS))) {
		errors.push({ field: "Warp Remote DNS", message: ["Only IPv4 address (UDP DNS) is valid for this field."] });
	}
}

function validateLocalDns(settings, errors) {
	const localDNS = settings.localDNS;
	if (!(isIPv4(localDNS) || localDNS === "localhost")) {
		errors.push({ field: "Local DNS", message: ['Only IPv4 addresses or "localhost" are valid.'] });
	}
}

function validateRoutingRules(settings, errors) {
	["customBypassRules", "customBlockRules"].forEach(ruleKey => {
		const invalidRules = settings[ruleKey].filter(rule => !isIPv4OrCidr(rule) && !isIPv6OrCidr(rule) && !isDomain(rule));
		if (invalidRules.length) {
			errors.push({
				field: "Routing Custom Rules", message: ["Invalid IPs, Domains or IP CIDR.", "Please enter each value in a new line.", "Invalid values are:\n", ...invalidRules.map(rule => `+ ${rule}`)]
			});
		}
	});
	const invalidSanctionRules = settings.customBypassSanctionRules.filter(customBypassSanctionRule => !isDomain(customBypassSanctionRule));
	if (invalidSanctionRules.length) {
		errors.push({
			field: "Routing Sanction Rules", message: ["Invalid Domains.", "Please enter each value in a new line.", "Invalid values are:\n", ...invalidSanctionRules.map(invalidSanctionRule => `+ ${invalidSanctionRule}`)]
		});
	}
}

function validateCleanIps(settings, errors) {
	const filtered = settings.cleanIPs.filter(cleanIP => !isValidHostPort(cleanIP));
	if (filtered.length) {
		errors.push({
			field: "Clean IPs - Domains", message: ["Invalid IPs or Domains.", "Please enter each value in a new line.", "Invalid values are:\n", ...filtered.map(item => `+ ${item}`)]
		});
	}
}

function validateProxyIps(settings, errors) {
	const filtered = settings.proxyIPs.filter(proxyIP => !isValidHostPort(proxyIP, false) && !isValidHostPort(proxyIP, true));
	if (filtered.length) {
		errors.push({
			field: "Proxy IPs - Domains", message: ["Invalid IPs or Domains.", "Please enter each value in a new line.", "Invalid values are:\n", ...filtered.map(item => `+ ${item}`)]
		});
	}
}

function validateNat64Prefixes(settings, errors) {
	const filtered = settings.prefixes.filter(prefix => !isIPv6(prefix));
	if (filtered.length) {
		errors.push({
			field: "NAT64 Prefixes", message: ["Invalid NAT64 prefix.", "Please enter each prefix in a new line like [IPv6].", "Invalid values are:\n", ...filtered.map(item => `+ ${item}`)]
		});
	}
}

function validateWarpEndpoints(settings, errors) {
	const filtered = settings.warpEndpoints.filter(warpEndpoint => !isValidHostPort(warpEndpoint, true));
	if (filtered.length) {
		errors.push({
			field: "Warp Endpoints", message: ["Endpoints should be like IPv4:Port, Domain:Port or [IPv6]:Port.", "Invalid values are:\n", ...filtered.map(item => `+ ${item}`)]
		});
	}
}

function validateRangeSettings(settings, errors) {
	const rangeKeys = [
		["fragmentLengthMin", "fragmentLengthMax", "Fragment Length"], ["fragmentDelayMin", "fragmentDelayMax", "Fragment Delay"], ["fragmentMaxSplitMin", "fragmentMaxSplitMax", "Fragment Max Split"], ["knockerNoiseCountMin", "knockerNoiseCountMax", "MahsaNG Noise Count"], ["knockerNoiseSizeMin", "knockerNoiseSizeMax", "MahsaNG Noise Size"], ["knockerNoiseDelayMin", "knockerNoiseDelayMax", "MahsaNGNoise Delay"], ["amneziaNoiseSizeMin", "amneziaNoiseSizeMax", "Amnezia Noise Size"]
	];
	for (const [minKey, maxKey, label] of rangeKeys) {
		if (Number(settings[minKey]) > Number(settings[maxKey])) {
			errors.push({ field: label, message: ["Minimum cannot be bigger than Maximum!"] });
		}
	}
}

function validateChainProxy(settings, errors) {
	let chainProxy = settings.chainProxy;
	if (!chainProxy) {
		return true;
	}
	const regExp = new RegExp(`${VMESS}:\\/\\/.+$`);
	const regExp2 = new RegExp(`(http|socks|socks5|${VLESS}|${TROJAN}|ss):\\/\\/[^\\s@]+@[^\\s:]+:[^\\s]+`);
	const matches = regExp.test(chainProxy);
	const matches2 = regExp2.test(chainProxy);
	if (!(matches || matches2)) {
		errors.push({
			field: "Chain Proxy", message: ["Invalid Config!", "Standard formats are:", " + (socks or socks5 or http)://user:pass@server:port", " + (socks or socks5 or http)://base64@server:port", ` + ${VLESS}://uuid@server:port...`, ` + ${VMESS}://base64`, ` + ${TROJAN}://password@server:port...`, " + ss://base64@server:port..."]
		});
	}
	const url = new URL(chainProxy);
	let { protocol, username } = url;
	let security = url.searchParams.get("security");
	let type = url.searchParams.get("type");
	if (matches) {
		const parsed = JSON.parse(atob(url.host));
		username = parsed.id;
		security = parsed.tls;
		type = parsed.net;
	}
	if ([`${VLESS}:`, `${TROJAN}:`, `${VMESS}:`].includes(protocol)) {
		if (!(username)) {
			errors.push({ field: "Chain Proxy", message: ["Invalid Config!", "Config URL should contain UUID or Password."] });
		}
		if (security && !["tls", "none", "reality"].includes(security)) {
			errors.push({
				field: "Chain Proxy", message: ["Invalid Config!", `${VLESS_LABEL}, ${VMESS_LABEL} or ${TROJAN_LABEL} security can be TLS, Reality or None.`]
			});
		}
		if (!(type && ["tcp", "raw", "ws", "grpc", "httpupgrade", "xhttp"].includes(type))) {
			errors.push({
				field: "Chain Proxy", message: ["Invalid Config!", `${VLESS_LABEL}, ${VMESS_LABEL} or ${TROJAN_LABEL} transmission can be tcp, ws, grpc or httpupgrade.`]
			});
		}
	}
}

function validateCustomCdn(settings, errors) {
	const { customCdnAddrs, customCdnHost, customCdnSni } = settings;
	const hasCustomCdn = !!customCdnAddrs.length || !!customCdnHost || !!customCdnSni;
	let isComplete = !hasCustomCdn || !!customCdnAddrs.length && !!customCdnHost && !!customCdnSni;
	if (isComplete || errors.push({ field: "Custom CDN", message: ["All fields should be filled or empty together!"] }), hasCustomCdn && isComplete) {
		[["customCdnSni", "Custom CDN SNI"], ["customCdnHost", "Custom CDN Host"]].forEach(([key, label]) => {
			if (!(isDomain(settings[key]))) {
				errors.push({ field: label, message: [`Invalid Domain: ${settings[key]}`] });
			}
		});
		const filtered = settings.customCdnAddrs.filter(customCdnAddr => !isValidHostPort(customCdnAddr));
		if (filtered.length) {
			errors.push({
				field: "Custom CDN Addresses", message: ["Invalid IPs or Domains.", "Please enter each value in a new line.", "Invalid values are:\n", ...filtered.map(item => `+ ${item}`)]
			});
		}
	}
}

function validateMahsaNoise(settings, errors) {
	if (!(/^(none|quic|random|[0-9A-Fa-f]+)$/.test(settings.knockerNoiseMode))) {
		errors.push({
			field: "MahsaNG Noise", message: ["Invalid noise mode.", 'Please use "none", "quic", "random" or a valid hex value.']
		});
	}
}

function validateXrayNoise(settings, errors) {
	settings.xrayUdpNoises.forEach(({ type, packet, delay }) => {
		const [minDelay, maxDelay] = delay.split("-").map(Number);
		switch ((minDelay > maxDelay && errors.push({ field: "Xray Noise Delay", message: ["Minimum cannot be bigger than Maximum!"] }), type)) {
			case "base64":
				if (!(isBase64(packet))) {
					errors.push({ field: "Xray Noise Packet", message: ["The packet is not a valid base64 value!"] });
				}
				break;
			case "rand": {
				if (!(/^\d+-\d+$/.test(packet))) {
					errors.push({ field: "Xray Noise Packet", message: ["The packet should be a range like 0-10 or 10-30!"] });
				}
				const [minPacket, maxPacket] = packet.split("-").map(Number);
				if (minPacket > maxPacket) {
					errors.push({ field: "Xray Noise Packet", message: ["Minimum cannot be bigger than Maximum!"] });
				}
				break;
			}
			case "hex":
				if (!(isHex(packet))) {
					errors.push({
						field: "Xray Noise Packet", message: ["The packet is not a valid hex value!", "It should have even length and consisted of 0-9, a-f and A-F."]
					});
				}
				break;
			case "array": {
				if (!(packet.split(",").every(item => /^\d+$/.test(item) && Number(item) >= 0 && Number(item) <= 255))) {
					errors.push({ field: "Xray Noise Packet", message: ["It should be comma separated numbers between 0-255 like 1,10,128..."] });
				}
				break;
			}
		}
	});
}

function validateEchServerName(settings, errors) {
	const echServerName = settings.echServerName;
	if (echServerName && !isDomain(echServerName)) {
		errors.push({ field: "ECH Server Name", message: ["The ECH Server Name should be a domain!"] });
	}
}

function validateUpstreamProxy(settings, errors) {
	const upstreamProxy = settings.upstreamProxy;
	if (upstreamProxy && !isValidHostPort(upstreamProxy, true)) {
		errors.push({ field: "Upstream Proxy", message: ["It can be either IP:Port or Domain:Port"] });
	}
}

function validateVlessUuid(settings, errors) {
	if (!(isValidUuid(settings.vlUUID))) {
		errors.push({ field: `${VLESS_LABEL} UUID`, message: ["Invalid UUID!"] });
	}
}

function validateTrojanPassword(settings, errors) {
	const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&*_-+;:,.";
	if (!([...settings.trPass].every(item => text.includes(item)))) {
		errors.push({ field: `${TROJAN_LABEL} Password`, message: ["Invalid characters!"] });
	}
}

function validateFallbackDomain(settings, errors) {
	const fallback = settings.fallback;
	if (fallback && !isDomain(fallback)) {
		errors.push({ field: "Fallback Domain", message: ["It should be a domain!"] });
	}
}

function validateDohUrl(settings, errors) {
	const dohUrl = settings.dohUrl;
	let flag = true;
	try {
		const { protocol, pathname } = new URL(dohUrl);
		flag = protocol === "https:" && pathname.endsWith("/dns-query");
	} catch {
		flag = false;
	}
	if (dohUrl && !flag) {
		errors.push({ field: "Underlying DoH URL", message: ["It should be like https://Domain-or-IP/dns-query"] });
	}
}

function validateSubscriptionPath(settings, errors) {
	const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&*_-+;:,.";
	if (!([...settings.securePath].every(item => text.includes(item)))) {
		errors.push({ field: "Panel - Subscriptions Path", message: ["Invalid characters!"] });
	}
}

function validateCustomDomain(settings, errors) {
	const customDomain = settings.customDomain;
	if (customDomain && !isDomain(customDomain)) {
		errors.push({ field: "Custom Domain", message: ["It should be a domain!"] });
	}
}

function validateRawSubscriptions(settings, errors) {
	const filtered = settings.customSubs.filter(customSub => !isHttpUrl(customSub));
	if (filtered.length) {
		errors.push({
			field: "External Raw subscriptions", message: ["Invalid URLs.", "Please enter each value in a new line.", "Invalid values are:\n", ...filtered.map(item => `+ ${item}`)]
		});
	}
}

function validateRemoteSettingsUrl(settings, errors) {
	if (!settings.remoteSettings) {
		return;
	}
	let url;
	try {
		url = new URL(settings.remoteSettings);
	} catch {
		return void errors.push({ field: "Remote Settings URL", message: ["Please enter a valid URL."] });
	}
	if (url.pathname.split("/").slice(2).join("/") !== "sub/share-settings") {
		errors.push({ field: "Remote Settings URL", message: ["This is not a valid BPB remote settings URL"] });
	}
}

function validatePorts(settings, errors) {
	const { httpsPorts } = getRuntimeConfig();
	if (!(settings.ports.filter(port => httpsPorts.includes(port)).length)) {
		errors.push({ field: "Ports", message: ["At least one TLS port should be selected."] });
	}
}

// ══════ ربات تلگرام ══════
async function setupTelegramBot(request, env) {
	if (request.method !== "PUT") {
		return jsonResponse(false, 405, "Method not allowed.");
	}
	try {
		if (!await isAuthenticated(request, env)) {
			return jsonResponse(false, 401, "Unauthorized or expired session.");
		}
		const { telegramBotToken, telegramUserId } = await request.json();
		const trimmed = telegramBotToken.trim();
		const trimmed2 = telegramUserId.trim();
		if (!trimmed || !trimmed2) {
			return jsonResponse(false, 400, "Missing but info.");
		}
		const { securePath } = getRuntimeConfig();
		await registerTelegramWebhook(securePath, trimmed);
		const result = { telegramBotToken: trimmed, telegramUserId: trimmed2 };
		await env.kv.put("telegramBot", JSON.stringify(result));
		return jsonResponse(true, 200, "Telegram bot setup completed successfully!", result);
	} catch (error) {
		return jsonResponse(false, 500, `Error occurred while setting Telegram Bot: ${getErrorMessage(error)}`);
	}
}

async function registerTelegramWebhook(securePath, botToken) {
	const { origin } = getRuntimeConfig();
	const webhookUrl = new URL(`/${securePath}/telegram/webhook`, origin);
	const setWebhookUrl = new URL(`https://api.telegram.org/bot${botToken}/setWebhook`);
	setWebhookUrl.searchParams.set("url", webhookUrl.href);
	try {
		const response = await fetch(setWebhookUrl);
		const data = await response.json();
		if (!data.ok) {
			throw new Error(data.description || "Failed to set webhook.");
		}
		const commandsResponse = await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
			method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
				commands: [
					{ command: "start", description: "🤖 Show welcome menu" }, { command: "config", description: "🔗 Get configs" }, { command: "clients", description: "📱 Get supported clients" }, { command: "usage", description: "📊 Monitor usage" }
				]
			})
		});
		const commandsData = await commandsResponse.json();
		if (!commandsData.ok) {
			throw new Error(commandsData.description || "Failed to set bot commands.");
		}
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}

async function removeTelegramWebhook(request, env) {
	if (request.method !== "POST") {
		return jsonResponse(false, 405, "Method not allowed.");
	}
	try {
		if (!await isAuthenticated(request, env)) {
			return jsonResponse(false, 401, "Unauthorized or expired session.");
		}
		const { telegramBotToken } = await env.kv.get("telegramBot", { type: "json" });
		const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/deleteWebhook`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ drop_pending_updates: true }) });
		const data = await response.json();
		if (!response.ok || !data.ok) {
			throw new Error(data.description || `Failed with status ${response.status}`);
		}
		const result = { telegramBotToken: "", telegramUserId: "" };
		await env.kv.put("telegramBot", JSON.stringify(result));
		return jsonResponse(true, 200, "Telegram bot webhook deleted successfully!", result);
	} catch (error) {
		return jsonResponse(false, 500, `Error occurred while removing Telegram bot: ${getErrorMessage(error)}`);
	}
}

function mainMenuKeyboard() {
	return {
		inline_keyboard: [
			[{ text: "🔗 Get Config", callback_data: "sub" }], [{ text: "📱 Supported Clients", callback_data: "clients" }], [{ text: "📊 Usage", callback_data: "usage" }]
		]
	};
}

function configTypeKeyboard() {
	return {
		inline_keyboard: [
			...Object.entries(CONFIG_CLIENTS).map(([key, value]) => [{ text: `🔗 ${value.label}`, callback_data: `sub_${key}` }]), [{ text: "◀️ Back", callback_data: "main" }]
		]
	};
}

function usageKeyboard() {
	return {
		inline_keyboard: [[{ text: "🔄 Refresh", callback_data: "usage_refresh" }], [{ text: "◀️ Back", callback_data: "main" }]]
	};
}

function clientsKeyboard() {
	return {
		inline_keyboard: [
			...CLIENT_APPS.map(item => [{ text: `🟢 ${item.name}`, callback_data: `client_${item.name}` }]), [{ text: "◀️ Back", callback_data: "main" }]
		]
	};
}

async function callTelegramApi(botToken, method, payload) {
	return (await fetch(`https://api.telegram.org/bot${botToken}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })).json();
}

function formatUsageMessage(totalRequests, workerRequests) {
	const workerPercent = Math.ceil(Number(workerRequests) / 1e5 * 100);
	const totalPercent = Math.ceil(Number(totalRequests) / 1e5 * 100);
	let message = ["📊 <b>Cloudflare Workers Usage</b>", "━━━━━━━━━━━━━━━━", `📅 Today: ${(new Date).toLocaleDateString("en-US", {
			weekday: "long", year: "numeric", month: "long", day: "numeric"
		})}`, "", `🔵 <b>${PROJECT_NAME} requests</b>`, `${workerRequests} / 100,000 (${workerPercent}%)`, "", "🔵 <b>Total requests</b>", `${totalRequests} / 100,000 (${totalPercent}%)`, "", ""].join("\n");
	message += totalPercent > 80 ? "🔴 <b>WARNING:</b> Approaching limit!\n" : "✅ All within limits";
	return message;
}

function buildSubscriptionUrl(configType, clientApp) {
	const { securePath, origin } = getRuntimeConfig();
	const url = new URL(`/${securePath}/sub/${configType}`, origin);
	url.searchParams.set("app", clientApp);
	return url;
}

function buildSubscriptionImportLink(configType, clientApp, label) {
	const subscriptionUrl = buildSubscriptionUrl(configType, clientApp);
	if (clientApp === "sing-box" && configType !== "raw") {
		const url = new URL("sing-box://import-remote-profile");
		url.searchParams.set("url", subscriptionUrl.href);
		url.hash = `💦 ${PROJECT_NAME} ${label}`;
		return url.href;
	}
	subscriptionUrl.hash = `💦 ${PROJECT_NAME} ${label}`;
	return subscriptionUrl.href;
}

function buildQrCodeUrl(configType, clientApp, label) {
	const { securePath, origin } = getRuntimeConfig();
	const subscriptionImportLink = buildSubscriptionImportLink(configType, clientApp, label);
	const url = new URL(`/${securePath}/qrcode`, origin);
	url.searchParams.set("data", subscriptionImportLink);
	url.searchParams.set("nocache", Date.now().toString());
	return url.href;
}

function buildConfigDownloadUrl(configType, clientApp) {
	if (configType === "raw") {
		return null;
	}
	const subscriptionUrl = buildSubscriptionUrl(configType, clientApp);
	const url = new URL(subscriptionUrl);
	const fileName = `${configType}-${clientApp.replace("xray-knocker", "mahsang")}`;
	const isArchive = ["wireguard", "amnezia"].includes(clientApp);
	const fullName = isArchive ? `${fileName}-conf` : fileName;
	const extension = isArchive ? "zip" : "json";
	url.pathname = `${subscriptionUrl.pathname}/${PROJECT_NAME_LOWER}-${fullName}.${extension}`;
	url.searchParams.set("nocache", Date.now().toString());
	return url.href;
}

async function handleCallbackQuery(callbackQuery, botToken, chatId) {
	const data = callbackQuery.data || "";
	switch (data) {
		case "sub":
			await callTelegramApi(botToken, "sendMessage", {
				chat_id: chatId, text: "🔗 <b>Get Config</b>\n\nChoose a config type:", parse_mode: "HTML", reply_markup: configTypeKeyboard()
			});
			break;
		case "clients":
			await callTelegramApi(botToken, "sendMessage", {
				chat_id: chatId, text: "📱 <b>Supported clients</b>\n\nChoose a client:", parse_mode: "HTML", reply_markup: clientsKeyboard()
			});
			break;
		case "usage":
		case "usage_refresh":
			const cfUsage = await getCfUsage();
			if (!cfUsage) {
				await callTelegramApi(botToken, "sendMessage", {
					chat_id: chatId, text: "⚠️ Could not fetch usage data.", parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "◀️ Back", callback_data: "main" }]] }
				});
				break;
			}
			if (!cfUsage.success) {
				await callTelegramApi(botToken, "sendMessage", {
					chat_id: chatId, text: cfUsage.error, parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "◀️ Back", callback_data: "main" }]] }
				});
				break;
			}
			if (!cfUsage.total || !cfUsage.worker) {
				break;
			}
			const usageMessage = formatUsageMessage(cfUsage.total, cfUsage.worker);
			if (data === "usage_refresh" && callbackQuery.message?.message_id) {
				await callTelegramApi(botToken, "editMessageText", {
					chat_id: chatId, message_id: callbackQuery.message.message_id, text: usageMessage, parse_mode: "HTML", reply_markup: {
						inline_keyboard: [[{ text: "🔄 Refresh", callback_data: "usage_refresh" }], [{ text: "◀️ Back", callback_data: "main" }]]
					}
				});
			} else {
				await callTelegramApi(botToken, "sendMessage", {
					chat_id: chatId, text: usageMessage, parse_mode: "HTML", reply_markup: {
						inline_keyboard: [[{ text: "🔄 Refresh", callback_data: "usage_refresh" }], [{ text: "◀️ Back", callback_data: "main" }]]
					}
				});
			}
			break;
		default:
			const selection = data.split("_")[1];
			if (data.startsWith("sub_")) {
				const configGroup = CONFIG_CLIENTS[selection];
				if (!configGroup) {
					break;
				}
				for (const [index, category] of configGroup.categories.entries()) {
					const subscriptionImportLink = buildSubscriptionImportLink(selection, category.core, configGroup.label);
					const qrCodeUrl = buildQrCodeUrl(selection, category.core, configGroup.label);
					const configDownloadUrl = buildConfigDownloadUrl(selection, category.core);
					const isArchive = ["wireguard", "amnezia"].includes(category.core);
					const clientList = category.clients.map(client => `✅ ${client}`).join("\n");
					const linkBlock = isArchive ? "" : `<code>${subscriptionImportLink}</code>\n\n`;
					const caption = `💦 <b>${PROJECT_NAME} ${configGroup.label}</b>\n\n${linkBlock}<b>Supported apps:</b>\n\n${clientList}`;
					const isLast = index === configGroup.categories.length - 1;
					const backMarkup = { reply_markup: { inline_keyboard: [[{ text: "◀️ Back", callback_data: "sub" }]] } };
					if (isArchive) {
						await callTelegramApi(botToken, "sendDocument", {
							chat_id: chatId, document: configDownloadUrl, caption: caption, parse_mode: "HTML", ...isLast && backMarkup
						});
					} else {
						const hasDownload = selection !== "raw";
						await callTelegramApi(botToken, "sendPhoto", {
							chat_id: chatId, photo: qrCodeUrl, caption: caption, parse_mode: "HTML", ...isLast && !hasDownload && backMarkup
						});
						if (hasDownload) {
							await callTelegramApi(botToken, "sendDocument", { chat_id: chatId, document: configDownloadUrl, ...isLast && backMarkup });
						}
					}
				}
			}
			if (data.startsWith("client_")) {
				const found = CLIENT_APPS.find(app => app.name === selection);
				if (!found) {
					break;
				}
				let message = [`✅ <b>${found.name}</b>`, "━━━━━━━━━━━━━━━━", `📍 <b>Minimum requirement:</b> ${found.minVer}`, `🏚️ <b>Download source:</b> ${found.source}`, "", `📥 <a href="${found.url}"><b>Get latest version</b></a>`, ""].join("\n");
				await callTelegramApi(botToken, "sendMessage", {
					chat_id: chatId, text: message, parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "◀️ Back", callback_data: "clients" }]] }
				});
			}
	}
}

async function handleTelegramWebhook(request, env) {
	const telegramBot = await env.kv.get("telegramBot", { type: "json" });
	if (!telegramBot) {
		return new Response(null, { status: 200 });
	}
	const { telegramBotToken, telegramUserId } = telegramBot;
	if (!telegramBotToken || !telegramUserId) {
		return new Response(null, { status: 200 });
	}
	const data = await request.json();
	if (data.callback_query) {
		const callback_query = data.callback_query;
		if (callback_query.from.id.toString() !== telegramUserId) {
			return new Response(null, { status: 200 });
		}
		await callTelegramApi(telegramBotToken, "answerCallbackQuery", { callback_query_id: callback_query.id });
		const id = callback_query.message?.chat.id;
		if (!id) {
			return new Response(null, { status: 200 });
		}
		if ((callback_query.data || "") === "main") {
			await callTelegramApi(telegramBotToken, "sendMessage", {
				chat_id: id, text: `🤖 <b>${PROJECT_NAME} Panel Bot</b>\n\nChoose an option:`, parse_mode: "HTML", reply_markup: {
					inline_keyboard: [
						[{ text: "🔗 Get Config", callback_data: "sub" }], [{ text: "📱 Supported Clients", callback_data: "clients" }], [{ text: "📊 Usage", callback_data: "usage" }]
					]
				}
			});
		} else {
			await handleCallbackQuery(callback_query, telegramBotToken, id);
		}
		sendUsageAlert(telegramBotToken, id);
		return new Response(null, { status: 200 });
	}
	if (data.message) {
		if (data.message.from.id.toString() !== telegramUserId) {
			return new Response(null, { status: 200 });
		}
		const id = data.message.chat.id;
		switch (data.message.text || "") {
			case "/usage":
				const cfUsage = await getCfUsage();
				if (!cfUsage.success || !cfUsage.worker || !cfUsage.total) {
					break;
				}
				await callTelegramApi(telegramBotToken, "sendMessage", {
					chat_id: id, text: formatUsageMessage(cfUsage.total, cfUsage.worker), parse_mode: "HTML", reply_markup: {
						inline_keyboard: [[{ text: "🔄 Refresh", callback_data: "usage_refresh" }], [{ text: "◀️ Back", callback_data: "main" }]]
					}
				});
				break;
			case "/clients":
				await callTelegramApi(telegramBotToken, "sendMessage", {
					chat_id: id, text: "📱 <b>Supported clients</b>\n\nChoose a client:", parse_mode: "HTML", reply_markup: clientsKeyboard()
				});
				break;
			case "/config":
				await callTelegramApi(telegramBotToken, "sendMessage", {
					chat_id: id, text: "🔗 <b>Get Config</b>\n\nChoose a configuration type:", parse_mode: "HTML", reply_markup: configTypeKeyboard()
				});
				break;
			default:
				await callTelegramApi(telegramBotToken, "sendMessage", {
					chat_id: id, text: `🤖 <b>${PROJECT_NAME} Panel Bot</b>\n\nChoose an option:`, parse_mode: "HTML", reply_markup: {
						inline_keyboard: [
							[{ text: "🔗 Get Config", callback_data: "sub" }], [{ text: "📱 Supported Clients", callback_data: "clients" }], [{ text: "📊 Usage", callback_data: "usage" }]
						]
					}
				});
				break;
		}
		sendUsageAlert(telegramBotToken, id);
		return new Response(null, { status: 200 });
	}
	return new Response(null, { status: 200 });
}

async function sendUsageAlert(botToken, chatId) {
	const cfUsage = await getCfUsage();
	if (!cfUsage.success || !cfUsage.worker || !cfUsage.total) {
		return;
	}
	if (cfUsage.total / 1e5 * 100 > 80) {
		await callTelegramApi(botToken, "sendMessage", {
			chat_id: chatId, text: formatUsageMessage(cfUsage.total, cfUsage.worker), parse_mode: "HTML", reply_markup: {
				inline_keyboard: [[{ text: "🔄 Refresh", callback_data: "usage_refresh" }], [{ text: "◀️ Back", callback_data: "main" }]]
			}
		});
	}
}

// ══════ مسیرهای پنل (API) ══════
async function handlePanelRoutes(request, env) {
	const { pathname } = getRuntimeConfig();
	switch (pathname.split("/").slice(2).join("/")) {
		case "panel": return renderPanelPage(request, env);
		case "panel/settings": return handleGetSettings(request, env);
		case "panel/update-settings": return handleUpdateSettings(request, env);
		case "panel/reset-settings": return handleResetSettings(request, env);
		case "panel/reset-password": return handleResetPassword(request, env);
		case "panel/my-ip": return handleMyIp(request);
		case "panel/update-warp": return handleUpdateWarp(request, env);
		case "panel/update-panel": return handleUpdatePanel(request, env);
		case "panel/delete-panel": return handleDeletePanel(request, env);
		case "panel/usage": return handleUsageRequest(request, env);
		case "panel/logout": return buildLogoutResponse();
		default: return proxyToFallback(request);
	}
}

async function renderPanelPage(request, env) {
	if (await env.kv.get("pwd")) {
		if (!await isAuthenticated(request, env)) {
			const url = new URL("./login", request.url);
			return Response.redirect(url, 302);
		}
	}
	const replaced = PANEL_HTML_CONTENT.replaceAll("__ICON__", ICON_CONTENT);
	return new Response(replaced, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

async function handleUpdatePanel(request, env) {
	return jsonResponse(false, 403, "Updates are disabled in this build (manual updates only).");
	if (request.method !== "POST") {
		return jsonResponse(false, 405, "Method not allowed.");
	}
	try {
		if (!await isAuthenticated(request, env)) {
			return jsonResponse(false, 401, "Unauthorized or expired session.");
		}
		const { deployType } = getRuntimeConfig();
		const workerScript = await buildWorkerScript(true);
		if (deployType === "pages") {
			await createPagesDeployment(workerScript);
		} else {
			await deployWorkerScript(workerScript);
		}
		return jsonResponse(true, 200);
	} catch (error) {
		return jsonResponse(false, 500, `Error occurred while upgrading panel: ${getErrorMessage(error)}`);
	}
}

async function handleDeletePanel(request, env) {
	if (request.method !== "POST") {
		return jsonResponse(false, 405, "Method not allowed.");
	}
	try {
		if (!await isAuthenticated(request, env)) {
			return jsonResponse(false, 401, "Unauthorized or expired session.");
		}
		const { deployType } = getRuntimeConfig();
		if (deployType === "pages") {
			await deletePagesProject();
		} else {
			await deleteWorkerScript();
		}
		return jsonResponse(true, 200);
	} catch (error) {
		return jsonResponse(false, 500, `Error occurred while deleting panel: ${getErrorMessage(error)}`);
	}
}

async function handleGetSettings(request, env) {
	const flag = Boolean(await env.kv.get("pwd"));
	try {
		if (!await isAuthenticated(request, env)) {
			return jsonResponse(false, 401, "Unauthorized or expired session.", { isPassSet: flag });
		}
		const { settings, telegramBot } = await loadPanelStorage(env);
		const embeddedSettings = getEmbeddedSettings();
		return jsonResponse(true, 200, undefined, {
			proxySettings: { ...settings, ...embeddedSettings }, telegramSettings: telegramBot, subscriptions: CONFIG_CLIENTS, clients: CLIENT_APPS, isPassSet: flag
		}, {
			"Content-Type": "application/json", "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache", Expires: "0"
		});
	} catch (error) {
		console.log(error);
		return jsonResponse(false, 500, `Error occurred while fetching settings: ${getErrorMessage(error)}`);
	}
}

async function handleUpdateSettings(request, env) {
	if (request.method !== "PUT") {
		return jsonResponse(false, 405, "Method not allowed.");
	}
	try {
		if (!await isAuthenticated(request, env)) {
			return jsonResponse(false, 401, "Unauthorized or expired session.");
		}
		const data = await request.json();
		const validateSettingsResult = validateSettings(data);
		if (validateSettingsResult) {
			return jsonResponse(false, 400, "Validation Error", validateSettingsResult);
		}
		await Promise.all([updateProxySettings(env, data), updateEnvVars(data)]);
		const { securePath } = getRuntimeConfig();
		if (data.securePath !== securePath) {
			const telegramBot = await env.kv.get("telegramBot", { type: "json" });
			if (telegramBot) {
				await registerTelegramWebhook(data.securePath, telegramBot.telegramBotToken);
			}
		}
		return jsonResponse(true, 200, "");
	} catch (error) {
		console.log(error);
		return jsonResponse(false, 500, getErrorMessage(error));
	}
}

async function handleResetSettings(request, env) {
	if (request.method !== "POST") {
		return jsonResponse(false, 405, "Method not allowed!");
	}
	try {
		if (!await isAuthenticated(request, env)) {
			return jsonResponse(false, 401, "Unauthorized or expired session.");
		}
		const [key, value] = await Promise.all([updateProxySettings(env), updateEnvVars(null)]);
		return jsonResponse(true, 200, "", { ...key, ...value });
	} catch (error) {
		console.log(error);
		return jsonResponse(false, 500, `Error occurred while resetting settings: ${getErrorMessage(error)}`);
	}
}

async function handleMyIp(request) {
	const text = await request.text();
	try {
		const response = await fetch(`http://ip-api.com/json/${text}?nocache=${Date.now()}`);
		return jsonResponse(true, 200, "", await response.json());
	} catch (error) {
		console.error("Error fetching IP address:", error);
		return jsonResponse(false, 500, `Error fetching IP address: ${getErrorMessage(error)}`);
	}
}

async function handleUpdateWarp(request, env) {
	if (request.method !== "POST") {
		return jsonResponse(false, 405, "Method not allowed.");
	}
	try {
		if (await isAuthenticated(request, env)) {
			await updateWarpAccounts(env);
			return jsonResponse(true, 200, "Warp configs updated successfully!");
		}
		return jsonResponse(false, 401, "Unauthorized or expired session.");
	} catch (error) {
		console.log(error);
		return jsonResponse(false, 500, `An error occurred while updating Warp configs: ${getErrorMessage(error)}`);
	}
}

// ══════ تست و لیست پروکسی‌آی‌پی ══════
async function handleProxyIpRoutes(request, env) {
	const { pathname } = getRuntimeConfig();
	if (!await isAuthenticated(request, env)) {
		const url = new URL("./login", request.url);
		return Response.redirect(url, 302);
	}
	switch (pathname.split("/").slice(2).join("/")) {
		case "proxy-ip": return renderProxyIpPage();
		case "proxy-ip/get": return handleGetProxyIps();
		case "proxy-ip/test": return handleProxyIpTest();
		default: return proxyToFallback(request);
	}
}

async function renderProxyIpPage() {
	const replaced = PROXY_IP_HTML_CONTENT.replaceAll("__ICON__", ICON_CONTENT);
	return new Response(replaced, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

async function handleGetProxyIps() {
	const domainRecords = await resolveDomainRecords(PUBLIC_PROXY_IP, true);
	return jsonResponse(true, 200, undefined, await lookupIpsInBatches(domainRecords.ipv4));
}

function chunkArray(array, size) {
	const chunks = [];
	for (let start = 0; start < array.length; start += size) {
		chunks.push(array.slice(start, start + size));
	}
	return chunks;
}

async function lookupIpsInBatches(ips) {
	const batches = chunkArray(ips, 100);
	const results = [];
	for (const batch of batches) {
		const response = await fetch("http://ip-api.com/batch?fields=query,city,country,countryCode,isp,status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(batch) });
		if (!response.ok) {
			throw new Error(`ip-api request failed: ${response.status}`);
		}
		const data = await response.json();
		for (const entry of data) {
			if (entry.status === "success") {
				results.push({
					ip: entry.query, city: entry.city, country: entry.country, countryCode: entry.countryCode, isp: entry.isp
				});
			}
		}
	}
	return results;
}

var SPEED_TEST_HOST = "speed.cloudflare.com";

var PROXY_TEST_TIMEOUT_MS = 5e3;

var PROXY_TEST_ATTEMPTS = 5;

async function testProxyConnection(host) {
	const startTime = Date.now();
	const path = "/__down?bytes=5000";
	const timeout = new Promise((resolve, reject) => setTimeout(() => reject(new Error("timeout")), PROXY_TEST_TIMEOUT_MS));
	try {
		const socket = connect({ hostname: host, port: 443 });
		const writer = socket.writable.getWriter();
		const request = `GET ${path} HTTP/1.1\r\nHost: ${SPEED_TEST_HOST}\r\nConnection: close\r\n\r\n`;
		await writer.write((new TextEncoder).encode(request));
		writer.releaseLock();
		const reader = socket.readable.getReader();
		const { value: chunk, done: isDone } = await Promise.race([reader.read(), timeout]);
		if (reader.releaseLock(), await socket.close().catch(() => {
		}), isDone || !chunk) {
			return { ok: false, elapsedMs: Date.now() - startTime };
		}
		const decoded = (new TextDecoder).decode(chunk);
		const isBadRequest = /^HTTP\/1\.[01] 400/.test(decoded);
		const hasCfRay = /cf-ray:/i.test(decoded);
		return { ok: isBadRequest && hasCfRay, elapsedMs: Date.now() - startTime };
	} catch (error) {
		return { ok: false, elapsedMs: Date.now() - startTime };
	}
}

async function handleProxyIpTest() {
	const { searchParams } = getRuntimeConfig();
	const target = searchParams.get("target");
	const attemptPromises = Array.from({ length: PROXY_TEST_ATTEMPTS }, (_item, index) => testProxyConnection(target).then(result => ({ attempt: index + 1, ...result })));
	const results = await Promise.all(attemptPromises);
	const filtered = results.filter(item => item.ok);
	const averageLatency = filtered.length ? Math.round(filtered.reduce((accumulator, item) => accumulator + item.elapsedMs, 0) / filtered.length) : null;
	return jsonResponse(true, 200, "", { successRate: `${filtered.length}/${PROXY_TEST_ATTEMPTS}`, avgLatencyMs: averageLatency, attempts: results });
}

// ══════ کتابخانه QR — کد شخص ثالث ══════
var qrcode = function (e, t) {
	const r = 236;
	const n = 17;
	let a = e;
	const o = xn[t];
	let s = null;
	let i = 0;
	let c = null;
	const l = [];
	const u = {};
	const d = function (e, t) {
		i = 4 * a + 17;
		s = function (e) {
			const t = new Array(e);
			for (let r = 0; r < e; r += 1) {
				t[r] = new Array(e);
				for (let n = 0; n < e; n += 1) {
					t[r][n] = null;
				}
			}
			return t;
		}(i);
		h(0, 0);
		h(i - 7, 0);
		h(0, i - 7);
		m();
		f();
		y(e, t);
		if (a >= 7) {
			g(e);
		}
		if (c == null) {
			c = v(a, o, l);
		}
		w(c, t);
	};
	const h = function (e, t) {
		for (let r = -1; r <= 7; r += 1) {
			if (!(e + r <= -1 || i <= e + r)) {
				for (let n = -1; n <= 7; n += 1) {
					if (!(t + n <= -1 || i <= t + n)) {
						s[e + r][t + n] = r >= 0 && r <= 6 && (n == 0 || n == 6) || n >= 0 && n <= 6 && (r == 0 || r == 6) || r >= 2 && r <= 4 && n >= 2 && n <= 4;
					}
				}
			}
		}
	};
	const p = function () {
		let e = 0;
		let t = 0;
		for (let r = 0; r < 8; r += 1) {
			d(true, r);
			const n = Nn.getLostPoint(u);
			if ((r == 0 || e > n)) {
				e = n;
				t = r;
			}
		}
		return t;
	};
	const f = function () {
		for (let e = 8; e < i - 8; e += 1) {
			if (s[e][6] == null) {
				s[e][6] = e % 2 == 0;
			}
		}
		for (let e = 8; e < i - 8; e += 1) {
			if (s[6][e] == null) {
				s[6][e] = e % 2 == 0;
			}
		}
	};
	const m = function () {
		const e = Nn.getPatternPosition(a);
		for (let t = 0; t < e.length; t += 1) {
			for (let r = 0; r < e.length; r += 1) {
				const n = e[t];
				const a = e[r];
				if (s[n][a] == null) {
					for (let e = -2; e <= 2; e += 1) {
						for (let t = -2; t <= 2; t += 1) {
							s[n + e][a + t] = e == -2 || e == 2 || t == -2 || t == 2 || e == 0 && t == 0;
						}
					}
				}
			}
		}
	};
	const g = function (e) {
		const t = Nn.getBCHTypeNumber(a);
		for (let r = 0; r < 18; r += 1) {
			const n = !e && (t >> r & 1) == 1;
			s[Math.floor(r / 3)][r % 3 + i - 8 - 3] = n;
		}
		for (let r = 0; r < 18; r += 1) {
			const n = !e && (t >> r & 1) == 1;
			s[r % 3 + i - 8 - 3][Math.floor(r / 3)] = n;
		}
	};
	const y = function (e, t) {
		const r = o << 3 | t;
		const n = Nn.getBCHTypeInfo(r);
		for (let t = 0; t < 15; t += 1) {
			const r = !e && (n >> t & 1) == 1;
			if (t < 6) {
				s[t][8] = r;
			} else {
				if (t < 8) {
					s[t + 1][8] = r;
				} else {
					s[i - 15 + t][8] = r;
				}
			}
		}
		for (let t = 0; t < 15; t += 1) {
			const r = !e && (n >> t & 1) == 1;
			if (t < 8) {
				s[8][i - t - 1] = r;
			} else {
				if (t < 9) {
					s[8][15 - t - 1 + 1] = r;
				} else {
					s[8][15 - t - 1] = r;
				}
			}
		}
		s[i - 8][8] = !e;
	};
	const w = function (e, t) {
		let r = -1;
		let n = i - 1;
		let a = 7;
		let o = 0;
		const c = Nn.getMaskFunction(t);
		for (let t = i - 1; t > 0; t -= 2) {
			for (t == 6 && (t -= 1);;) {
				for (let r = 0; r < 2; r += 1) {
					if (s[n][t - r] == null) {
						let i = false;
						if (o < e.length) {
							i = (e[o] >>> a & 1) == 1;
						}
						if (c(n, t - r)) {
							i = !i;
						}
						s[n][t - r] = i;
						a -= 1;
						if (a == -1) {
							o += 1;
							a = 7;
						}
					}
				}
				if (n += r, n < 0 || i <= n) {
					n -= r;
					r = -r;
					break;
				}
			}
		}
	};
	const b = function (e, t) {
		let r = 0;
		let n = 0;
		let a = 0;
		const o = new Array(t.length);
		const s = new Array(t.length);
		for (let i = 0; i < t.length; i += 1) {
			const c = t[i].dataCount;
			const l = t[i].totalCount - c;
			n = Math.max(n, c);
			a = Math.max(a, l);
			o[i] = new Array(c);
			for (let t = 0; t < o[i].length; t += 1) {
				o[i][t] = 255 & e.getBuffer()[t + r];
			}
			r += c;
			const u = Nn.getErrorCorrectPolynomial(l);
			const h = Mn(o[i], u.getLength() - 1).mod(u);
			s[i] = new Array(u.getLength() - 1);
			for (let e = 0; e < s[i].length; e += 1) {
				const t = e + h.getLength() - s[i].length;
				s[i][e] = t >= 0 ? h.getAt(t) : 0;
			}
		}
		let i = 0;
		for (let e = 0; e < t.length; e += 1) {
			i += t[e].totalCount;
		}
		const c = new Array(i);
		let l = 0;
		for (let e = 0; e < n; e += 1) {
			for (let r = 0; r < t.length; r += 1) {
				if (e < o[r].length) {
					c[l] = o[r][e];
					l += 1;
				}
			}
		}
		for (let e = 0; e < a; e += 1) {
			for (let r = 0; r < t.length; r += 1) {
				if (e < s[r].length) {
					c[l] = s[r][e];
					l += 1;
				}
			}
		}
		return c;
	};
	const v = function (e, t, a) {
		const o = Ln.getRSBlocks(e, t);
		const s = On();
		for (let t = 0; t < a.length; t += 1) {
			const r = a[t];
			s.put(r.getMode(), 4);
			s.put(r.getLength(), Nn.getLengthInBits(r.getMode(), e));
			r.write(s);
		}
		let i = 0;
		for (let e = 0; e < o.length; e += 1) {
			i += o[e].dataCount;
		}
		if (s.getLengthInBits() > 8 * i) {
			throw "code length overflow. (" + s.getLengthInBits() + ">" + 8 * i + ")";
		}
		for (s.getLengthInBits() + 4 <= 8 * i && s.put(0, 4); s.getLengthInBits() % 8 != 0;) {
			s.putBit(false);
		}
		for (; !(s.getLengthInBits() >= 8 * i || (s.put(r, 8), s.getLengthInBits() >= 8 * i));) {
			s.put(n, 8);
		}
		return b(s, o);
	};
	u.addData = function (e, t) {
		let r = null;
		switch (t = t || "Byte") {
			case "Numeric":
				r = Bn(e);
				break;
			case "Alphanumeric":
				r = $n(e);
				break;
			case "Byte":
				r = zn(e);
				break;
			case "Kanji":
				r = jn(e);
				break;
			default: throw "mode:" + t;
		}
		l.push(r);
		c = null;
	};
	u.isDark = function (e, t) {
		if (e < 0 || i <= e || t < 0 || i <= t) {
			throw e + "," + t;
		}
		return s[e][t];
	};
	u.getModuleCount = function () {
		return i;
	};
	u.make = function () {
		if (a < 1) {
			let e = 1;
			for (; e < 40; e++) {
				const t = Ln.getRSBlocks(e, o);
				const r = On();
				for (let t = 0; t < l.length; t++) {
					const n = l[t];
					r.put(n.getMode(), 4);
					r.put(n.getLength(), Nn.getLengthInBits(n.getMode(), e));
					n.write(r);
				}
				let n = 0;
				for (let e = 0; e < t.length; e++) {
					n += t[e].dataCount;
				}
				if (r.getLengthInBits() <= 8 * n) {
					break;
				}
			}
			a = e;
		}
		d(false, p());
	};
	u.createTableTag = function (e, t) {
		e = e || 2;
		let r = "";
		r += '<table style="';
		r += " border-width: 0px; border-style: none;";
		r += " border-collapse: collapse;";
		r += " padding: 0px; margin: " + (t = t === undefined ? 4 * e : t) + "px;";
		r += '">';
		r += "<tbody>";
		for (let t = 0; t < u.getModuleCount(); t += 1) {
			r += "<tr>";
			for (let n = 0; n < u.getModuleCount(); n += 1) {
				r += '<td style="';
				r += " border-width: 0px; border-style: none;";
				r += " border-collapse: collapse;";
				r += " padding: 0px; margin: 0px;";
				r += " width: " + e + "px;";
				r += " height: " + e + "px;";
				r += " background-color: ";
				r += u.isDark(t, n) ? "#000000" : "#ffffff";
				r += ";";
				r += '"/>';
			}
			r += "</tr>";
		}
		r += "</tbody>";
		r += "</table>";
		return r;
	};
	u.createSvgTag = function (e, t, r, n) {
		let a = {};
		if (typeof arguments[0] == "object") {
			a = arguments[0];
			e = a.cellSize;
			t = a.margin;
			r = a.alt;
			n = a.title;
		}
		e = e || 2;
		t = t === undefined ? 4 * e : t;
		(r = typeof r == "string" ? { text: r } : r || {}).text = r.text || null;
		r.id = r.text ? r.id || "qrcode-description" : null;
		(n = typeof n == "string" ? { text: n } : n || {}).text = n.text || null;
		n.id = n.text ? n.id || "qrcode-title" : null;
		const o = u.getModuleCount() * e + 2 * t;
		let s;
		let i;
		let c;
		let l;
		let d = "";
		let h;
		for (h = "l" + e + ",0 0," + e + " -" + e + ",0 0,-" + e + "z ", d += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', d += a.scalable ? "" : ' width="' + o + 'px" height="' + o + 'px"', d += ' viewBox="0 0 ' + o + " " + o + '" ', d += ' preserveAspectRatio="xMinYMin meet"', d += n.text || r.text ? ' role="img" aria-labelledby="' + _([n.id, r.id].join(" ").trim()) + '"' : "", d += ">", d += n.text ? '<title id="' + _(n.id) + '">' + _(n.text) + "</title>" : "", d += r.text ? '<description id="' + _(r.id) + '">' + _(r.text) + "</description>" : "", d += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', d += '<path d="', c = 0; c < u.getModuleCount(); c += 1) {
			for (l = c * e + t, s = 0; s < u.getModuleCount(); s += 1) {
				if (u.isDark(c, s)) {
					i = s * e + t;
					d += "M" + i + "," + l + h;
				}
			}
		}
		d += '" stroke="transparent" fill="black"/>';
		d += "</svg>";
		return d;
	};
	u.createDataURL = function (e, t) {
		e = e || 2;
		t = t === undefined ? 4 * e : t;
		const r = u.getModuleCount() * e + 2 * t;
		const n = t;
		const a = r - t;
		return Vn(r, r, function (t, r) {
			if (n <= t && t < a && n <= r && r < a) {
				const a = Math.floor((t - n) / e);
				const o = Math.floor((r - n) / e);
				return u.isDark(o, a) ? 0 : 1;
			}
			return 1;
		});
	};
	u.createImgTag = function (e, t, r) {
		e = e || 2;
		t = t === undefined ? 4 * e : t;
		const n = u.getModuleCount() * e + 2 * t;
		let a = "";
		a += "<img";
		a += ' src="';
		a += u.createDataURL(e, t);
		a += '"';
		a += ' width="';
		a += n;
		a += '"';
		a += ' height="';
		a += n;
		a += '"';
		if (r) {
			a += ' alt="';
			a += _(r);
			a += '"';
		}
		a += "/>";
		return a;
	};
	const _ = function (e) {
		let t = "";
		for (let r = 0; r < e.length; r += 1) {
			const n = e.charAt(r);
			switch (n) {
				case "<":
					t += "&lt;";
					break;
				case ">":
					t += "&gt;";
					break;
				case "&":
					t += "&amp;";
					break;
				case '"':
					t += "&quot;";
					break;
				default:
					t += n;
					break;
			}
		}
		return t;
	};
	const k = function (e) {
		const t = 1;
		e = e === undefined ? 2 : e;
		const r = 1 * u.getModuleCount() + 2 * e;
		const n = e;
		const a = r - e;
		let o;
		let s;
		let i;
		let c;
		let l;
		const d = {
			"██": "█", "█ ": "▀", " █": "▄", "  ": " "
		};
		const h = {
			"██": "▀", "█ ": "▀", " █": " ", "  ": " "
		};
		let p = "";
		for (o = 0; o < r; o += 2) {
			for (i = Math.floor((o - n) / 1), c = Math.floor((o + 1 - n) / 1), s = 0; s < r; s += 1) {
				l = "█";
				if (n <= s && s < a && n <= o && o < a && u.isDark(i, Math.floor((s - n) / 1))) {
					l = " ";
				}
				if (n <= s && s < a && n <= o + 1 && o + 1 < a && u.isDark(c, Math.floor((s - n) / 1))) {
					l += " ";
				} else {
					l += "█";
				}
				p += e < 1 && o + 1 >= a ? h[l] : d[l];
			}
			p += "\n";
		}
		return r % 2 && e > 0 ? p.substring(0, p.length - r - 1) + Array(r + 1).join("▀") : p.substring(0, p.length - 1);
	};
	u.createASCII = function (e, t) {
		if ((e = e || 1) < 2) {
			return k(t);
		}
		e -= 1;
		t = t === undefined ? 2 * e : t;
		const r = u.getModuleCount() * e + 2 * t;
		const n = t;
		const a = r - t;
		let o;
		let s;
		let i;
		let c;
		const l = Array(e + 1).join("██");
		const d = Array(e + 1).join("  ");
		let h = "";
		let p = "";
		for (o = 0; o < r; o += 1) {
			for (i = Math.floor((o - n) / e), p = "", s = 0; s < r; s += 1) {
				c = 1;
				if (n <= s && s < a && n <= o && o < a && u.isDark(i, Math.floor((s - n) / e))) {
					c = 0;
				}
				p += c ? l : d;
			}
			for (i = 0; i < e; i += 1) {
				h += p + "\n";
			}
		}
		return h.substring(0, h.length - 1);
	};
	u.renderTo2dContext = function (e, t) {
		t = t || 2;
		const r = u.getModuleCount();
		for (let n = 0; n < r; n++) {
			for (let a = 0; a < r; a++) {
				e.fillStyle = u.isDark(n, a) ? "black" : "white";
				e.fillRect(a * t, n * t, t, t);
			}
		}
	};
	return u;
};

qrcode.stringToBytes = function (e) {
	const t = [];
	for (let r = 0; r < e.length; r += 1) {
		const n = e.charCodeAt(r);
		t.push(255 & n);
	}
	return t;
};

qrcode.createStringToBytes = function (e, t) {
	const r = function () {
		const r = Fn(e);
		const n = function () {
			const e = r.read();
			if (e == -1) {
				throw "eof";
			}
			return e;
		};
		let a = 0;
		const o = {};
		for (;;) {
			const e = r.read();
			if (e == -1) {
				break;
			}
			const t = n();
			const l = n() << 8 | n();
			o[String.fromCharCode(e << 8 | t)] = l;
			a += 1;
		}
		if (a != t) {
			throw a + " != " + t;
		}
		return o;
	}();
	const n = "?".charCodeAt(0);
	return function (e) {
		const t = [];
		for (let a = 0; a < e.length; a += 1) {
			const o = e.charCodeAt(a);
			if (o < 128) {
				t.push(o);
			} else {
				const o = r[e.charAt(a)];
				if (typeof o == "number") {
					if ((255 & o) == o) {
						t.push(o);
					} else {
						t.push(o >>> 8);
						t.push(255 & o);
					}
				} else {
					t.push(n);
				}
			}
		}
		return t;
	};
};

var vn = 1;

var _n = 2;

var kn = 4;

var Sn = 8;

var xn = {
	L: 1, M: 0, Q: 3, H: 2
};

var Cn = 0;

var En = 1;

var An = 2;

var Pn = 3;

var Tn = 4;

var Dn = 5;

var In = 6;

var Rn = 7;

var Nn = function () {
	const e = [
		[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]
	];
	const t = 1335;
	const r = 7973;
	const n = 21522;
	const a = {};
	const o = function (e) {
		let t = 0;
		for (; e != 0;) {
			t += 1;
			e >>>= 1;
		}
		return t;
	};
	a.getBCHTypeInfo = function (e) {
		let r = e << 10;
		for (; o(r) - o(t) >= 0;) {
			r ^= t << o(r) - o(t);
		}
		return (e << 10 | r) ^ n;
	};
	a.getBCHTypeNumber = function (e) {
		let t = e << 12;
		for (; o(t) - o(r) >= 0;) {
			t ^= r << o(t) - o(r);
		}
		return e << 12 | t;
	};
	a.getPatternPosition = function (t) {
		return e[t - 1];
	};
	a.getMaskFunction = function (e) {
		switch (e) {
			case Cn: return function (e, t) {
				return (e + t) % 2 == 0;
			};
			case En: return function (e, t) {
				return e % 2 == 0;
			};
			case An: return function (e, t) {
				return t % 3 == 0;
			};
			case Pn: return function (e, t) {
				return (e + t) % 3 == 0;
			};
			case Tn: return function (e, t) {
				return (Math.floor(e / 2) + Math.floor(t / 3)) % 2 == 0;
			};
			case Dn: return function (e, t) {
				return e * t % 2 + e * t % 3 == 0;
			};
			case In: return function (e, t) {
				return (e * t % 2 + e * t % 3) % 2 == 0;
			};
			case Rn: return function (e, t) {
				return (e * t % 3 + (e + t) % 2) % 2 == 0;
			};
			default: throw "bad maskPattern:" + e;
		}
	};
	a.getErrorCorrectPolynomial = function (e) {
		let t = Mn([1], 0);
		for (let r = 0; r < e; r += 1) {
			t = t.multiply(Mn([1, Un.gexp(r)], 0));
		}
		return t;
	};
	a.getLengthInBits = function (e, t) {
		if (t >= 1 && t < 10) {
			switch (e) {
				case vn: return 10;
				case _n: return 9;
				case kn: return 8;
				case Sn: return 8;
				default: throw "mode:" + e;
			}
		} else if (t < 27) {
			switch (e) {
				case vn: return 12;
				case _n: return 11;
				case kn: return 16;
				case Sn: return 10;
				default: throw "mode:" + e;
			}
		} else {
			if (!(t < 41)) {
				throw "type:" + t;
			}
			switch (e) {
				case vn: return 14;
				case _n: return 13;
				case kn: return 16;
				case Sn: return 12;
				default: throw "mode:" + e;
			}
		}
	};
	a.getLostPoint = function (e) {
		const t = e.getModuleCount();
		let r = 0;
		for (let n = 0; n < t; n += 1) {
			for (let a = 0; a < t; a += 1) {
				let o = 0;
				const s = e.isDark(n, a);
				for (let r = -1; r <= 1; r += 1) {
					if (!(n + r < 0 || t <= n + r)) {
						for (let i = -1; i <= 1; i += 1) {
							if (!(a + i < 0 || t <= a + i || r == 0 && i == 0)) {
								if (s == e.isDark(n + r, a + i)) {
									o += 1;
								}
							}
						}
					}
				}
				if (o > 5) {
					r += 3 + o - 5;
				}
			}
		}
		for (let n = 0; n < t - 1; n += 1) {
			for (let a = 0; a < t - 1; a += 1) {
				let t = 0;
				if (e.isDark(n, a)) {
					t += 1;
				}
				if (e.isDark(n + 1, a)) {
					t += 1;
				}
				if (e.isDark(n, a + 1)) {
					t += 1;
				}
				if (e.isDark(n + 1, a + 1)) {
					t += 1;
				}
				if (!(t != 0 && t != 4)) {
					r += 3;
				}
			}
		}
		for (let n = 0; n < t; n += 1) {
			for (let a = 0; a < t - 6; a += 1) {
				if (e.isDark(n, a) && !e.isDark(n, a + 1) && e.isDark(n, a + 2) && e.isDark(n, a + 3) && e.isDark(n, a + 4) && !e.isDark(n, a + 5) && e.isDark(n, a + 6)) {
					r += 40;
				}
			}
		}
		for (let n = 0; n < t; n += 1) {
			for (let a = 0; a < t - 6; a += 1) {
				if (e.isDark(a, n) && !e.isDark(a + 1, n) && e.isDark(a + 2, n) && e.isDark(a + 3, n) && e.isDark(a + 4, n) && !e.isDark(a + 5, n) && e.isDark(a + 6, n)) {
					r += 40;
				}
			}
		}
		let n = 0;
		for (let r = 0; r < t; r += 1) {
			for (let a = 0; a < t; a += 1) {
				if (e.isDark(a, r)) {
					n += 1;
				}
			}
		}
		r += 10 * (Math.abs(100 * n / t / t - 50) / 5);
		return r;
	};
	return a;
}();

var Un = function () {
	const e = new Array(256);
	const t = new Array(256);
	for (let t = 0; t < 8; t += 1) {
		e[t] = 1 << t;
	}
	for (let t = 8; t < 256; t += 1) {
		e[t] = e[t - 4] ^ e[t - 5] ^ e[t - 6] ^ e[t - 8];
	}
	for (let r = 0; r < 255; r += 1) {
		t[e[r]] = r;
	}
	const r = {
		glog: function (e) {
			if (e < 1) {
				throw "glog(" + e + ")";
			}
			return t[e];
		}, gexp: function (t) {
			for (; t < 0;) {
				t += 255;
			}
			for (; t >= 256;) {
				t -= 255;
			}
			return e[t];
		}
	};
	return r;
}();

var Mn = function (e, t) {
	if (e.length === undefined) {
		throw e.length + "/" + t;
	}
	const r = function () {
		let r = 0;
		for (; r < e.length && e[r] == 0;) {
			r += 1;
		}
		const n = new Array(e.length - r + t);
		for (let t = 0; t < e.length - r; t += 1) {
			n[t] = e[t + r];
		}
		return n;
	}();
	const n = {
		getAt: function (e) {
			return r[e];
		}, getLength: function () {
			return r.length;
		}, multiply: function (e) {
			const t = new Array(n.getLength() + e.getLength() - 1);
			for (let r = 0; r < n.getLength(); r += 1) {
				for (let a = 0; a < e.getLength(); a += 1) {
					t[r + a] ^= Un.gexp(Un.glog(n.getAt(r)) + Un.glog(e.getAt(a)));
				}
			}
			return Mn(t, 0);
		}, mod: function (e) {
			if (n.getLength() - e.getLength() < 0) {
				return n;
			}
			const t = Un.glog(n.getAt(0)) - Un.glog(e.getAt(0));
			const r = new Array(n.getLength());
			for (let e = 0; e < n.getLength(); e += 1) {
				r[e] = n.getAt(e);
			}
			for (let n = 0; n < e.getLength(); n += 1) {
				r[n] ^= Un.gexp(Un.glog(e.getAt(n)) + t);
			}
			return Mn(r, 0).mod(e);
		}
	};
	return n;
};

var Ln = function () {
	const e = [
		[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]
	];
	const t = function (e, t) {
		const r = {};
		r.totalCount = e;
		r.dataCount = t;
		return r;
	};
	const r = {};
	const n = function (t, r) {
		switch (r) {
			case xn.L: return e[4 * (t - 1) + 0];
			case xn.M: return e[4 * (t - 1) + 1];
			case xn.Q: return e[4 * (t - 1) + 2];
			case xn.H: return e[4 * (t - 1) + 3];
			default: return;
		}
	};
	r.getRSBlocks = function (e, r) {
		const a = n(e, r);
		if (a === undefined) {
			throw "bad rs block @ typeNumber:" + e + "/errorCorrectionLevel:" + r;
		}
		const o = a.length / 3;
		const s = [];
		for (let e = 0; e < o; e += 1) {
			const r = a[3 * e + 0];
			const n = a[3 * e + 1];
			const o = a[3 * e + 2];
			for (let e = 0; e < r; e += 1) {
				s.push(t(n, o));
			}
		}
		return s;
	};
	return r;
}();

var On = function () {
	const e = [];
	let t = 0;
	const r = {
		getBuffer: function () {
			return e;
		}, getAt: function (t) {
			const r = Math.floor(t / 8);
			return (e[r] >>> 7 - t % 8 & 1) == 1;
		}, put: function (e, t) {
			for (let n = 0; n < t; n += 1) {
				r.putBit((e >>> t - n - 1 & 1) == 1);
			}
		}, getLengthInBits: function () {
			return t;
		}, putBit: function (r) {
			const n = Math.floor(t / 8);
			if (e.length <= n) {
				e.push(0);
			}
			if (r) {
				e[n] |= 128 >>> t % 8;
			}
			t += 1;
		}
	};
	return r;
};

var Bn = function (e) {
	const t = vn;
	const r = e;
	const n = {
		getMode: function () {
			return t;
		}, getLength: function (e) {
			return r.length;
		}, write: function (e) {
			const t = r;
			let n = 0;
			for (; n + 2 < t.length;) {
				e.put(a(t.substring(n, n + 3)), 10);
				n += 3;
			}
			if (n < t.length) {
				if (t.length - n == 1) {
					e.put(a(t.substring(n, n + 1)), 4);
				} else {
					if (t.length - n == 2) {
						e.put(a(t.substring(n, n + 2)), 7);
					}
				}
			}
		}
	};
	const a = function (e) {
		let t = 0;
		for (let r = 0; r < e.length; r += 1) {
			t = 10 * t + o(e.charAt(r));
		}
		return t;
	};
	const o = function (e) {
		if ("0" <= e && e <= "9") {
			return e.charCodeAt(0) - "0".charCodeAt(0);
		}
		throw "illegal char :" + e;
	};
	return n;
};

var $n = function (e) {
	const t = _n;
	const r = e;
	const n = {
		getMode: function () {
			return t;
		}, getLength: function (e) {
			return r.length;
		}, write: function (e) {
			const t = r;
			let n = 0;
			for (; n + 1 < t.length;) {
				e.put(45 * a(t.charAt(n)) + a(t.charAt(n + 1)), 11);
				n += 2;
			}
			if (n < t.length) {
				e.put(a(t.charAt(n)), 6);
			}
		}
	};
	const a = function (e) {
		if ("0" <= e && e <= "9") {
			return e.charCodeAt(0) - "0".charCodeAt(0);
		}
		if ("A" <= e && e <= "Z") {
			return e.charCodeAt(0) - "A".charCodeAt(0) + 10;
		}
		switch (e) {
			case " ": return 36;
			case "$": return 37;
			case "%": return 38;
			case "*": return 39;
			case "+": return 40;
			case "-": return 41;
			case ".": return 42;
			case "/": return 43;
			case ":": return 44;
			default: throw "illegal char :" + e;
		}
	};
	return n;
};

var zn = function (e) {
	const t = kn;
	const r = e;
	const n = qrcode.stringToBytes(e);
	const a = {
		getMode: function () {
			return t;
		}, getLength: function (e) {
			return n.length;
		}, write: function (e) {
			for (let t = 0; t < n.length; t += 1) {
				e.put(n[t], 8);
			}
		}
	};
	return a;
};

var jn = function (e) {
	const t = Sn;
	const r = e;
	const n = qrcode.stringToBytes;
	!function (e, t) {
		const r = n(e);
		if (r.length != 2 || (r[0] << 8 | r[1]) != t) {
			throw "sjis not supported.";
		}
	}("友", 38726);
	const a = n(e);
	const o = {
		getMode: function () {
			return t;
		}, getLength: function (e) {
			return ~~(a.length / 2);
		}, write: function (e) {
			const t = a;
			let r = 0;
			for (; r + 1 < t.length;) {
				let n = (255 & t[r]) << 8 | 255 & t[r + 1];
				if (n >= 33088 && n <= 40956) {
					n -= 33088;
				} else {
					if (!(n >= 57408 && n <= 60351)) {
						throw "illegal char at " + (r + 1) + "/" + n;
					}
					n -= 49472;
				}
				n = 192 * (n >>> 8 & 255) + (255 & n);
				e.put(n, 13);
				r += 2;
			}
			if (r < t.length) {
				throw "illegal char at " + (r + 1);
			}
		}
	};
	return o;
};

var Hn = function () {
	const e = [];
	const t = {
		writeByte: function (t) {
			e.push(255 & t);
		}, writeShort: function (e) {
			t.writeByte(e);
			t.writeByte(e >>> 8);
		}, writeBytes: function (e, r, n) {
			r = r || 0;
			n = n || e.length;
			for (let a = 0; a < n; a += 1) {
				t.writeByte(e[a + r]);
			}
		}, writeString: function (e) {
			for (let r = 0; r < e.length; r += 1) {
				t.writeByte(e.charCodeAt(r));
			}
		}, toByteArray: function () {
			return e;
		}, toString: function () {
			let t = "";
			t += "[";
			for (let r = 0; r < e.length; r += 1) {
				if (r > 0) {
					t += ",";
				}
				t += e[r];
			}
			t += "]";
			return t;
		}
	};
	return t;
};

var Wn = function () {
	let e = 0;
	let t = 0;
	let r = 0;
	let n = "";
	const a = {};
	const o = function (e) {
		n += String.fromCharCode(s(63 & e));
	};
	const s = function (e) {
		if (e < 0) {
			throw "n:" + e;
		}
		if (e < 26) {
			return 65 + e;
		}
		if (e < 52) {
			return e - 26 + 97;
		}
		if (e < 62) {
			return e - 52 + 48;
		}
		if (e == 62) {
			return 43;
		}
		if (e == 63) {
			return 47;
		}
		throw "n:" + e;
	};
	a.writeByte = function (n) {
		for (e = e << 8 | 255 & n, t += 8, r += 1; t >= 6;) {
			o(e >>> t - 6);
			t -= 6;
		}
	};
	a.flush = function () {
		if (t > 0 && (o(e << 6 - t), e = 0, t = 0), r % 3 != 0) {
			const e = 3 - r % 3;
			for (let t = 0; t < e; t += 1) {
				n += "=";
			}
		}
	};
	a.toString = function () {
		return n;
	};
	return a;
};

var Fn = function (e) {
	const t = e;
	let r = 0;
	let n = 0;
	let a = 0;
	const o = {
		read: function () {
			for (; a < 8;) {
				if (r >= t.length) {
					if (a == 0) {
						return -1;
					}
					throw "unexpected end of file./" + a;
				}
				const e = t.charAt(r);
				if (r += 1, e == "=") {
					a = 0;
					return -1;
				}
				if (!(e.match(/^\s$/))) {
					n = n << 6 | s(e.charCodeAt(0));
					a += 6;
				}
			}
			const e = n >>> a - 8 & 255;
			a -= 8;
			return e;
		}
	};
	const s = function (e) {
		if (e >= 65 && e <= 90) {
			return e - 65;
		}
		if (e >= 97 && e <= 122) {
			return e - 97 + 26;
		}
		if (e >= 48 && e <= 57) {
			return e - 48 + 52;
		}
		if (e == 43) {
			return 62;
		}
		if (e == 47) {
			return 63;
		}
		throw "c:" + e;
	};
	return o;
};

var Gn = function (e, t) {
	const r = e;
	const n = t;
	const a = new Array(e * t);
	const o = {
		setPixel: function (e, t, n) {
			a[t * r + e] = n;
		}, write: function (e) {
			e.writeString("GIF87a");
			e.writeShort(r);
			e.writeShort(n);
			e.writeByte(128);
			e.writeByte(0);
			e.writeByte(0);
			e.writeByte(0);
			e.writeByte(0);
			e.writeByte(0);
			e.writeByte(255);
			e.writeByte(255);
			e.writeByte(255);
			e.writeString(",");
			e.writeShort(0);
			e.writeShort(0);
			e.writeShort(r);
			e.writeShort(n);
			e.writeByte(0);
			const t = 2;
			const a = i(2);
			e.writeByte(2);
			let o = 0;
			for (; a.length - o > 255;) {
				e.writeByte(255);
				e.writeBytes(a, o, 255);
				o += 255;
			}
			e.writeByte(a.length - o);
			e.writeBytes(a, o, a.length - o);
			e.writeByte(0);
			e.writeString(";");
		}
	};
	const s = function (e) {
		const t = e;
		let r = 0;
		let n = 0;
		const a = {
			write: function (e, a) {
				if (e >>> a != 0) {
					throw "length over";
				}
				for (; r + a >= 8;) {
					t.writeByte(255 & (e << r | n));
					a -= 8 - r;
					e >>>= 8 - r;
					n = 0;
					r = 0;
				}
				n |= e << r;
				r += a;
			}, flush: function () {
				if (r > 0) {
					t.writeByte(n);
				}
			}
		};
		return a;
	};
	const i = function (e) {
		const t = 1 << e;
		const r = 1 + (1 << e);
		let n = e + 1;
		const o = c();
		for (let e = 0; e < t; e += 1) {
			o.add(String.fromCharCode(e));
		}
		o.add(String.fromCharCode(t));
		o.add(String.fromCharCode(r));
		const i = Hn();
		const l = s(i);
		l.write(t, n);
		let u = 0;
		let d = String.fromCharCode(a[u]);
		for (u += 1; u < a.length;) {
			const e = String.fromCharCode(a[u]);
			u += 1;
			if (o.contains(d + e)) {
				d += e;
			} else {
				l.write(o.indexOf(d), n);
				if (o.size() < 4095) {
					if (o.size() == 1 << n) {
						n += 1;
					}
					o.add(d + e);
				}
				d = e;
			}
		}
		l.write(o.indexOf(d), n);
		l.write(r, n);
		l.flush();
		return i.toByteArray();
	};
	const c = function () {
		const e = {};
		let t = 0;
		const r = {
			add: function (n) {
				if (r.contains(n)) {
					throw "dup key:" + n;
				}
				e[n] = t;
				t += 1;
			}, size: function () {
				return t;
			}, indexOf: function (t) {
				return e[t];
			}, contains: function (t) {
				return e[t] !== undefined;
			}
		};
		return r;
	};
	return o;
};

var Vn = function (e, t, r) {
	const n = Gn(e, t);
	for (let a = 0; a < t; a += 1) {
		for (let t = 0; t < e; t += 1) {
			n.setPixel(t, a, r(t, a));
		}
	}
	const a = Hn();
	n.write(a);
	const o = Wn();
	const s = a.toByteArray();
	for (let e = 0; e < s.length; e += 1) {
		o.writeByte(s[e]);
	}
	o.flush();
	return "data:image/gif;base64," + o;
};

// ══════ ساخت PNG و QR کد ══════
var QRCode = qrcode;

var qrStringToBytes = qrcode.stringToBytes;

function crc32(bytes) {
	let crc = 4294967295;
	for (const byte of bytes) {
		crc ^= byte;
		for (let bit = 0; bit < 8; bit++) {
			crc = crc >>> 1 ^ (1 & crc ? 3988292384 : 0);
		}
	}
	return (4294967295 ^ crc) >>> 0;
}

function uint32ToBytes(number) {
	return new Uint8Array([number >>> 24, number >>> 16, number >>> 8, number]);
}

function buildPngChunk(type, data) {
	const typeBytes = (new TextEncoder).encode(type);
	const crcInput = new Uint8Array(typeBytes.length + data.length);
	crcInput.set(typeBytes);
	crcInput.set(data, typeBytes.length);
	const chunk = new Uint8Array(12 + data.length);
	chunk.set(uint32ToBytes(data.length), 0);
	chunk.set(typeBytes, 4);
	chunk.set(data, 8);
	chunk.set(uint32ToBytes(crc32(crcInput)), 8 + data.length);
	return chunk;
}

async function deflateBytes(data) {
	const input = new Uint8Array(data);
	const compressed = new Blob([input.buffer]).stream().pipeThrough(new CompressionStream("deflate"));
	return new Uint8Array(await new Response(compressed).arrayBuffer());
}

async function encodePng(width, height, pixels) {
	const raw = new Uint8Array(height * (4 * width + 1));
	for (let row = 0; row < height; row++) {
		const srcOffset = row * width * 4;
		const dstOffset = row * (4 * width + 1);
		raw[dstOffset] = 0;
		raw.set(pixels.subarray(srcOffset, srcOffset + 4 * width), dstOffset + 1);
	}
	const header = new Uint8Array(13);
	header.set(uint32ToBytes(width), 0);
	header.set(uint32ToBytes(height), 4);
	header[8] = 8;
	header[9] = 6;
	const compressed = await deflateBytes(raw);
	const chunks = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), buildPngChunk("IHDR", header), buildPngChunk("IDAT", compressed), buildPngChunk("IEND", new Uint8Array)];
	const totalLength = chunks.reduce((accumulator, chunk) => accumulator + chunk.length, 0);
	const png = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		png.set(chunk, offset);
		offset += chunk.length;
	}
	return png.buffer;
}

async function handleQrCodeRequest(request) {
	const { searchParams, origin } = getRuntimeConfig();
	const data = searchParams.get("data") ?? "";
	const qrUrl = new URL(data);
	let targetUrl = qrUrl;
	if (qrUrl.protocol === "sing-box:") {
		const innerUrl = qrUrl.searchParams.get("url") ?? "";
		targetUrl = new URL(innerUrl);
	}
	if (targetUrl.origin !== origin) {
		return proxyToFallback(request);
	}
	const qr = QRCode(0, "M");
	qr.addData(data);
	qr.make();
	const moduleCount = qr.getModuleCount();
	const cellSize = 8;
	const quietZone = 4;
	const imageSize = 8 * (moduleCount + 8);
	const pixels = new Uint8Array(imageSize * imageSize * 4);
	for (let offset = 0; offset < pixels.length; offset += 4) {
		pixels[offset] = 255;
		pixels[offset + 1] = 255;
		pixels[offset + 2] = 255;
		pixels[offset + 3] = 255;
	}
	for (let row = 0; row < moduleCount; row++) {
		for (let col = 0; col < moduleCount; col++) {
			if (qr.isDark(row, col)) {
				for (let dy = 0; dy < 8; dy++) {
					for (let dx = 0; dx < 8; dx++) {
						const pixelOffset = 4 * ((8 * (row + 4) + dy) * imageSize + (8 * (col + 4) + dx));
						pixels[pixelOffset] = 15;
						pixels[pixelOffset + 1] = 23;
						pixels[pixelOffset + 2] = 42;
						pixels[pixelOffset + 3] = 255;
					}
				}
			}
		}
	}
	const png = await encodePng(imageSize, imageSize, pixels);
	return new Response(png, { headers: { "Content-Type": "image/png", "Cache-Control": "no-store" } });
}

// ══════ ساخت کانفیگ Clash ══════
function getClashRuleSets() {
	const { localDNS, antiSanctionDNS, blockMalware, blockPhishing, blockCryptominers, blockAds, blockPorn, bypassIran, bypassChina, bypassRussia, bypassOpenAi, bypassGoogleAi, bypassMicrosoft, bypassOracle, bypassDocker, bypassAdobe, bypassEpicGames, bypassIntel, bypassAmd, bypassNvidia, bypassAsus, bypassHp, bypassLenovo } = getSettings();
	return [
		{
			rule: blockMalware, type: "block", format: "text", geosite: "malware", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.txt", geoip: "malware-cidr", geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware-ip.txt"
		},
		{
			rule: blockPhishing, type: "block", format: "text", geosite: "phishing", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.txt", geoip: "phishing-cidr", geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing-ip.txt"
		},
		{
			rule: blockCryptominers, type: "block", format: "text", geosite: "cryptominers", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.txt"
		},
		{
			rule: blockAds, type: "block", format: "text", geosite: "category-ads-all", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/category-ads-all.txt"
		},
		{
			rule: blockPorn, type: "block", format: "text", geosite: "nsfw", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/nsfw.txt"
		},
		{
			rule: bypassIran, type: "direct", dns: localDNS, format: "text", geosite: "ir", geoip: "ir-cidr", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ir.txt", geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ircidr.txt"
		},
		{
			rule: bypassChina, type: "direct", dns: localDNS, format: "yaml", geosite: "cn", geoip: "cn-cidr", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml", geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.yaml"
		},
		{
			rule: bypassRussia, type: "direct", dns: localDNS, format: "yaml", geosite: "ru", geoip: "ru-cidr", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ru.yaml", geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/ru.yaml"
		},
		{
			rule: bypassOpenAi, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "openai", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/openai.yaml"
		},
		{
			rule: bypassGoogleAi, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "googleai", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google-deepmind.yaml"
		},
		{
			rule: bypassMicrosoft, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "microsoft", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.yaml"
		},
		{
			rule: bypassOracle, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "oracle", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/oracle.yaml"
		},
		{
			rule: bypassDocker, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "docker", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/docker.yaml"
		},
		{
			rule: bypassAdobe, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "adobe", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/adobe.yaml"
		},
		{
			rule: bypassEpicGames, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "epicgames", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/epicgames.yaml"
		},
		{
			rule: bypassIntel, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "intel", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/intel.yaml"
		},
		{
			rule: bypassAmd, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "amd", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/amd.yaml"
		},
		{
			rule: bypassNvidia, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "nvidia", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/nvidia.yaml"
		},
		{
			rule: bypassAsus, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "asus", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/asus.yaml"
		},
		{
			rule: bypassHp, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "hp", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/hp.yaml"
		},
		{
			rule: bypassLenovo, type: "direct", dns: antiSanctionDNS, format: "yaml", geosite: "lenovo", geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/lenovo.yaml"
		}
	].filter(({ rule }) => rule);
}

async function buildClashDns(useBestPing, isWarp, isWarpPro) {
	const { localDNS, remoteDNS, warpRemoteDNS, antiSanctionDNS, chainProxyParams, remoteDnsHost, enableIPv6, fakeDNS, allowLANConnection } = getSettings();
	const localDnsServer = localDNS === "localhost" ? "system" : `${localDNS}#DIRECT`;
	const remoteDnsServer = `${isWarp ? warpRemoteDNS : remoteDNS}#${isWarp ? `💦 Warp ${isWarpPro ? "Pro " : ""}- Best Ping 🚀` : useBestPing ? "💦 Best Ping 🚀" : "✅ Selector"}`;
	const hosts = {};
	const nameserverPolicy = {};
	if (useBestPing && !isWarp) {
		const { server } = chainProxyParams;
		if (isDomain(server)) {
			nameserverPolicy[server] = remoteDnsServer;
		}
	}
	if (remoteDnsHost.isDomain && !isWarp) {
		const { ipv4, ipv6, host } = remoteDnsHost;
		hosts[host] = ipv4.concatIf(enableIPv6, ipv6);
	}
	const dnsRoutingRules = buildDnsRoutingRules(getClashRuleSets());
	[...dnsRoutingRules.block.geosites.map(geosite => `rule-set:${geosite}`), ...dnsRoutingRules.block.domains.map(domain => `+.${domain}`)].forEach(item => hosts[item] = "rcode://refused");
	const antiSanctionRules = [...dnsRoutingRules.bypass.antiSanctionDNS.geosites.map(geosite => `rule-set:${geosite}`), ...dnsRoutingRules.bypass.antiSanctionDNS.domains.map(domain => `+.${domain}`)];
	const localRules = [...dnsRoutingRules.bypass.localDNS.geositeGeoips.map(({ geosite }) => `rule-set:${geosite}`), ...dnsRoutingRules.bypass.localDNS.geosites.map(geosite => `rule-set:${geosite}`), ...dnsRoutingRules.bypass.localDNS.domains.map(domain => `+.${domain}`)];
	if (antiSanctionRules.length) {
		antiSanctionRules.forEach(antiSanctionRule => nameserverPolicy[antiSanctionRule] = `${antiSanctionDNS}#DIRECT`);
		const { host, isHostDomain } = parseUrlHost(antiSanctionDNS);
		if (isHostDomain) {
			localRules.push(host);
		}
	}
	localRules.forEach(localRule => nameserverPolicy[localRule] = localDnsServer);
	let enhancedMode = "redir-host";
	let fakeIpOptions = {};
	if (fakeDNS) {
		enhancedMode = "fake-ip";
		fakeIpOptions = { "fake-ip-range": "198.18.0.1/16", "fake-ip-filter-mode": "blacklist", "fake-ip-filter": ["+.lan", "+.local"] };
	}
	return {
		enable: true, "respect-rules": true, "use-system-hosts": false, listen: (allowLANConnection ? "0.0.0.0" : "127.0.0.1") + ":1053", ipv6: enableIPv6, hosts: hosts.omitEmpty(), nameserver: [remoteDnsServer], "proxy-server-nameserver": [localDnsServer], "direct-nameserver": [localDnsServer], "direct-nameserver-follow-policy": true, "nameserver-policy": nameserverPolicy.omitEmpty(), "enhanced-mode": enhancedMode, ...fakeIpOptions
	};
}

function buildClashRules(allowUdp) {
	const { blockUDP443 } = getSettings();
	const routingRules = buildRoutingRules(getClashRuleSets());
	const rules = ["GEOIP,lan,DIRECT,no-resolve"];
	if (allowUdp) {
		if (blockUDP443) {
			rules.push("AND,((NETWORK,udp),(DST-PORT,443)),REJECT");
		}
	} else {
		rules.push("NETWORK,udp,REJECT");
	}
	return [...rules, ...routingRules.block.geosites.map(geosite => `RULE-SET,${geosite},REJECT`), ...routingRules.block.domains.map(domain => `DOMAIN-SUFFIX,${domain},REJECT`), ...routingRules.block.geoips.map(geoip => `RULE-SET,${geoip},REJECT`), ...routingRules.block.ips.map(item => buildIpCidrRule(item, "REJECT")), ...routingRules.bypass.geosites.map(geosite => `RULE-SET,${geosite},DIRECT`), ...routingRules.bypass.domains.map(domain => `DOMAIN-SUFFIX,${domain},DIRECT`), ...routingRules.bypass.geoips.map(geoip => `RULE-SET,${geoip},DIRECT`), ...routingRules.bypass.ips.map(item => buildIpCidrRule(item, "DIRECT")), "MATCH,✅ Selector"];
}

function buildClashRuleProviders() {
	return getClashRuleSets().reduce((accumulator, item) => (addClashRuleProvider(accumulator, item), accumulator), {}).omitEmpty();
}

function addClashRuleProvider(providers, ruleSet) {
	const { geosite, geoip, geositeURL, geoipURL, format } = ruleSet;
	const extension = format === "text" ? "txt" : format;
	const addProvider = (name, behavior, url) => {
		providers[name] = {
			type: "http", format: format, behavior: behavior, path: `./ruleset/${name}.${extension}`, interval: 86400, url: url
		};
	};
	if (geosite && geositeURL) {
		addProvider(geosite, "domain", geositeURL);
	}
	if (geoip && geoipURL) {
		addProvider(geoip, "ipcidr", geoipURL);
	}
}

function buildIpCidrRule(ip, policy) {
	const suffix = (ip = isIPv6(ip) ? ip.replace(/\[|\]/g, "") : ip).includes("/") ? "" : isIPv4(ip) ? "/32" : "/128";
	return `IP-CIDR,${ip}${suffix},${policy}`;
}

function buildClashProxyBase(name, type, server, port, enableIPv6, enableTFO, tlsOptions, transportOptions, extra) {
	return {
		name: name, type: type, server: server.replace(/\[|\]/g, ""), port: port, "ip-version": enableIPv6 ? "ipv4-prefer" : "ipv4", tfo: enableTFO, udp: false, ...extra, ...tlsOptions, ...transportOptions
	};
}

function buildClashProxy(protocol, remark, address, port, domain) {
	const { vlUUID, trPass, fingerprint, enableTFO, enableIPv6, enableECH, echServerName, upstreamParams: { upstreamServer } } = getSettings();
	const isTls = isHttpsPort(port) || address === upstreamServer;
	if (protocol === TROJAN && !isTls) {
		return null;
	}
	const { host, sni, allowInsecure } = getTlsHostAndSni(address, domain);
	const clashTlsOptions = isTls ? buildClashTlsOptions(protocol, "tls", allowInsecure, sni, enableECH, echServerName || undefined, "http/1.1", fingerprint) : {};
	const clashTransportOptions = buildClashTransportOptions("ws", undefined, buildWebSocketPath(protocol), host, undefined, 2560);
	return protocol === VLESS ? buildClashProxyBase(remark, protocol, address, port, enableIPv6, enableTFO, clashTlsOptions, clashTransportOptions, { uuid: vlUUID, "packet-encoding": "", encryption: "" }) : buildClashProxyBase(remark, protocol, address, port, enableIPv6, enableTFO, clashTlsOptions, clashTransportOptions, { password: trPass });
}

function buildClashWarpProxy(account, name, endpoint, dialerProxy, isPro) {
	const { amneziaNoiseCount, amneziaNoiseSizeMin, amneziaNoiseSizeMax, enableIPv6, warpReservedBytes } = getSettings();
	const { warpIPv6, reserved, publicKey, privateKey } = account;
	const { host, port } = parseHostAndPort(endpoint, false);
	return {
		name: name, type: "wireguard", ip: "172.16.0.2/32", ipv6: warpIPv6, "ip-version": enableIPv6 ? "ipv4-prefer" : "ipv4", "private-key": privateKey, server: dialerProxy ? "162.159.192.1" : host, port: dialerProxy ? 2408 : port, "public-key": publicKey, "allowed-ips": ["0.0.0.0/0", "::/0"], reserved: warpReservedBytes ? base64ToBytes(reserved) : [0, 0, 0], udp: true, mtu: 1280, "dialer-proxy": dialerProxy || undefined, "amnezia-wg-option": isPro ? {
			jc: amneziaNoiseCount, jmin: amneziaNoiseSizeMin, jmax: amneziaNoiseSizeMax, H1: 1, H2: 2, H3: 3, H4: 4
		} : undefined
	};
}

function buildClashChainProxy() {
	const { chainProxy, chainProxyParams: { protocol, server, port, user, pass, password, method, uuid, flow, security, type, sni, fp, host, path, alpn, pbk, sid, headerType, serviceName, aid, encryption } } = getSettings();
	const { searchParams } = new URL(chainProxy);
	const ed = searchParams.get("ed");
	const flag = ed ? +ed : undefined;
	const clashTlsOptions = buildClashTlsOptions(protocol, security, false, sni || server, false, undefined, alpn, fp, pbk, sid);
	const clashTransportOptions = buildClashTransportOptions(type, headerType, path, host, serviceName, flag);
	switch (protocol) {
		case "http": return buildClashProxyBase("", "http", server, port, false, false, {}, {}, { username: user, password: pass });
		case "socks": return buildClashProxyBase("", "socks5", server, port, false, false, {}, {}, { username: user, password: pass });
		case SHADOWSOCKS: return buildClashProxyBase("", "ss", server, port, false, false, {}, {}, { cipher: method, password: password });
		case VLESS: return buildClashProxyBase("", VLESS, server, port, false, false, clashTlsOptions, clashTransportOptions, { uuid: uuid, flow: flow, encryption: encryption?.replace("none", "") ?? "" });
		case VMESS: return buildClashProxyBase("", VMESS, server, port, false, false, clashTlsOptions, clashTransportOptions, { uuid: uuid, cipher: "auto", alterId: aid });
		case TROJAN:
			if (security === "none") {
				return;
			}
			return buildClashProxyBase("", TROJAN, server, port, false, false, clashTlsOptions, clashTransportOptions, { password: password });
		default: return;
	}
}

function buildClashUrlTestGroup(name, proxies, isWarp) {
	const { warpBestPingInterval, bestPingInterval } = getSettings();
	return {
		name: name, type: "url-test", proxies: proxies, url: "https://www.gstatic.com/generate_204", interval: isWarp ? warpBestPingInterval : bestPingInterval, tolerance: 50
	};
}

function buildClashTlsOptions(protocol, security, allowInsecure, sni, enableECH, echServerName, alpn, fingerprint, publicKey, shortId) {
	if (!["tls", "reality"].includes(security)) {
		return {};
	}
	const baseOptions = {
		tls: true, [protocol === TROJAN ? "sni" : "servername"]: sni, "client-fingerprint": fingerprint === "randomized" ? "random" : fingerprint, "skip-cert-verify": allowInsecure
	};
	return security === "tls" ? { ...baseOptions, alpn: alpn?.split(","), "ech-opts": enableECH ? { enable: true, "query-server-name": echServerName } : undefined } : security === "reality" && publicKey && shortId ? { ...baseOptions, "reality-opts": { "public-key": publicKey, "short-id": shortId } } : {};
}

function buildClashTransportOptions(network, headerType, path = "/", host, serviceName, maxEarlyData, mode, extra) {
	switch ((path = path?.split("?")[0], network)) {
		case "tcp": return headerType === "http" ? {
			network: "http", "http-opts": {
				method: "GET", path: path.split(","), headers: { Host: host?.split(","), Connection: ["keep-alive"], "Content-Type": ["application/octet-stream"] }
			}
		} : { network: "tcp" };
		case "ws": return {
			network: "ws", "ws-opts": {
				path: path, "max-early-data": maxEarlyData, "early-data-header-name": maxEarlyData ? "Sec-WebSocket-Protocol" : undefined, headers: { Host: host }
			}
		};
		case "httpupgrade": return {
			network: "ws", "ws-opts": {
				[`${V2RAY}-http-upgrade`]: true, [`${V2RAY}-http-upgrade-fast-open`]: true, path: path, headers: { Host: host }
			}
		};
		case "grpc": return { network: "grpc", "grpc-opts": { "grpc-service-name": serviceName } };
		case "xhttp":
			const extraParams = JSON.parse(decodeURIComponent(extra ?? "{}"));
			const { xPaddingBytes, xmux } = extraParams;
			return {
				network: "xhttp", "xhttp-opts": {
					host: host ?? "", path: path, mode: mode || "auto", "x-padding-bytes": xPaddingBytes ?? "100-1000", "reuse-settings": {
						"max-concurrency": xmux?.maxConcurrency ?? "16-32", "max-connections": xmux?.maxConnections ?? 0, "c-max-reuse-times": xmux?.cMaxReuseTimes ?? 0, "h-max-request-times": xmux?.hMaxRequestTimes ?? "600-900", "h-max-reusable-secs": xmux?.hMaxReusableSecs ?? "1800-3000", "h-keep-alive-period": xmux?.hKeepAlivePeriod ?? 0
					}
				}
			};
		default: return {};
	}
}

var CLASH_TUN = {
	enable: true, stack: "mixed", "auto-route": true, "strict-route": true, "auto-detect-interface": true, "dns-hijack": ["any:53", "tcp://any:53"], mtu: 9e3
};

var CLASH_SNIFFER = {
	enable: true, "force-dns-mapping": true, "parse-pure-ip": true, "override-destination": true, sniff: { HTTP: { ports: [80, 8080, 8880, 2052, 2082, 2086, 2095] }, TLS: { ports: [443, 8443, 2053, 2083, 2087, 2096] } }
};

async function buildClashConfig(proxies, proxyGroups, hasChain, isWarp, isWarpPro) {
	const { logLevel, allowLANConnection } = getSettings();
	const groupNames = Object.keys(proxyGroups).filter(item => !!proxyGroups[item].length);
	const selectorProxies = [...groupNames, ...groupNames.flatMap(groupName => proxyGroups[groupName])];
	const keepAliveOptions = isWarp ? {} : {
		"disable-keep-alive": false, "keep-alive-idle": 10, "keep-alive-interval": 15, "tcp-concurrent": true
	};
	const config = {
		"mixed-port": 7890, ipv6: true, "allow-lan": allowLANConnection, "unified-delay": false, "log-level": logLevel.replace("none", "silent"), mode: "rule", ...keepAliveOptions, "geo-auto-update": true, "geo-update-interval": 168, "external-controller": "127.0.0.1:9090", "external-controller-cors": { "allow-origins": ["*"], "allow-private-network": true }, "external-ui": "ui", "external-ui-url": "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip", profile: { "store-selected": true, "store-fake-ip": true }, dns: await buildClashDns(hasChain, isWarp, isWarpPro), tun: CLASH_TUN, sniffer: CLASH_SNIFFER, proxies: proxies, "proxy-groups": [{ name: "✅ Selector", type: "select", proxies: selectorProxies }], "rule-providers": buildClashRuleProviders(), rules: buildClashRules(isWarp), ntp: {
			enable: true, server: "time.cloudflare.com", port: 123, interval: 30
		}
	};
	for (const groupName of groupNames) {
		if (proxyGroups[groupName].length) {
			const clashUrlTestGroup = buildClashUrlTestGroup(groupName, proxyGroups[groupName], isWarp);
			config["proxy-groups"].push(clashUrlTestGroup);
		}
	}
	return config;
}

async function getClashNormalConfig() {
	const { chainProxy: chainProxy2, ports, mainDomain, customDomain, upstreamParams: { upstreamServer, upstreamPort } } = getSettings();
	const clashChainProxy = chainProxy2 ? buildClashChainProxy() : undefined;
	const hasChain = !!clashChainProxy;
	const domains = [mainDomain].concatIf(!!customDomain, customDomain);
	const enabledProtocols = getEnabledProtocols();
	const proxies = [];
	const bestPingGroups = {
		"💦 Best Ping 🚀": [], "💦 🔗 Best Ping 🚀": [], "💦 Best Ping D 🚀": [], "💦 🔗 Best Ping D 🚀": []
	};
	for (const domain of domains) {
		const validPorts = ports.filter(item => domain.endsWith("workers.dev") || isHttpsPort(item));
		const configAddresses = await getConfigAddresses(domain, false);
		if (upstreamServer && upstreamPort) {
			validPorts.unshift(upstreamPort);
			configAddresses.unshift(upstreamServer);
		}
		for (const protocol of enabledProtocols) {
			let index = 1;
			for (const port of validPorts) {
				for (const address of configAddresses) {
					if (port === upstreamPort != (address === upstreamServer)) {
						continue;
					}
					const configRemark = buildConfigRemark(index, port, address, protocol, domain, false, false);
					const clashProxy = buildClashProxy(protocol, configRemark, address, port, domain);
					if (clashProxy) {
						if (proxies.push(clashProxy), domain === customDomain ? bestPingGroups["💦 Best Ping D 🚀"].push(configRemark) : bestPingGroups["💦 Best Ping 🚀"].push(configRemark), hasChain) {
							const chainRemark = buildConfigRemark(index, port, address, protocol, domain, false, true);
							const chainProxy = structuredClone(clashChainProxy);
							chainProxy.name = chainRemark;
							chainProxy["dialer-proxy"] = configRemark;
							proxies.push(chainProxy);
							if (domain === customDomain) {
								bestPingGroups["💦 🔗 Best Ping D 🚀"].push(chainRemark);
							} else {
								bestPingGroups["💦 🔗 Best Ping 🚀"].push(chainRemark);
							}
						}
						index++;
					}
				}
			}
		}
	}
	const clashConfig = await buildClashConfig(proxies, bestPingGroups, hasChain, false, false);
	return new Response(JSON.stringify(clashConfig, null, 4), {
		status: 200, headers: {
			"Content-Type": "application/json", "Content-Disposition": `attachment; filename=${PROJECT_NAME_LOWER}-normal-clash.json`, "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache", Expires: "0"
		}
	});
}

async function getClashWarpConfig(isPro) {
	const { warpEndpoints } = getSettings();
	const accounts = getWarpAccounts();
	const proxies = [];
	const proLabel = isPro ? "Pro " : "";
	const bestPingGroups = { [`💦 Warp ${proLabel}- Best Ping 🚀`]: [], [`💦 WoW ${proLabel}- Best Ping 🚀`]: [] };
	warpEndpoints.forEach((item, index) => {
		const warpRemark = `💦 ${index + 1}. Warp ${proLabel}🇮🇷`;
		bestPingGroups[`💦 Warp ${proLabel}- Best Ping 🚀`].push(warpRemark);
		const wowRemark = `💦 ${index + 1}. WoW ${proLabel}🌍`;
		bestPingGroups[`💦 WoW ${proLabel}- Best Ping 🚀`].push(wowRemark);
		const clashWarpProxy = buildClashWarpProxy(accounts[0], warpRemark, item, "", isPro);
		const wowProxy = buildClashWarpProxy(accounts[1], wowRemark, item, warpRemark, false);
		proxies.push(clashWarpProxy, wowProxy);
	});
	const clashConfig = await buildClashConfig(proxies, bestPingGroups, false, true, isPro);
	const fileKey = isPro ? "warp-Pro" : "warp";
	return new Response(JSON.stringify(clashConfig, null, 4), {
		status: 200, headers: {
			"Content-Type": "application/json", "Content-Disposition": `attachment; filename=${PROJECT_NAME_LOWER}-${fileKey}-clash.json`, "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache", Expires: "0"
		}
	});
}

// ══════ ساب خام و ساب‌های خارجی ══════
async function getRawSubscription() {
	const { fingerprint, ports, chainProxy, remoteDNS, customConfigs, customSubs, customDomain, vlUUID, trPass, httpsPorts, client, mainDomain, upstreamParams: { upstreamServer, upstreamPort } } = getSettings();
	const buildLink = (protocol, address, port, host, sni, remark) => {
		const isTls = httpsPorts.includes(port) || address === upstreamServer;
		const security = isTls ? "tls" : "none";
		const url = new URL(`${protocol}://config`);
		if (protocol === VLESS) {
			url.username = vlUUID;
			url.searchParams.append("encryption", "none");
		} else {
			url.username = trPass;
		}
		const webSocketPath = buildWebSocketPath(protocol);
		url.hostname = address;
		url.port = port.toString();
		url.searchParams.append("host", host);
		url.searchParams.append("type", "ws");
		url.searchParams.append("security", security);
		url.hash = remark;
		if (client === "sing-box") {
			url.searchParams.append("eh", "Sec-WebSocket-Protocol");
			url.searchParams.append("ed", "2560");
			url.searchParams.append("path", webSocketPath);
		} else {
			url.searchParams.append("path", `${webSocketPath}?ed=2560`);
		}
		if (isTls) {
			url.searchParams.append("sni", sni);
			url.searchParams.append("fp", fingerprint);
			url.searchParams.append("alpn", "http/1.1");
		}
		return url.href;
	};
	let vlessLinks = "";
	let trojanLinks = "";
	let chainLink = "";
	let index = 1;
	const domains = [mainDomain].concatIf(!!customDomain, customDomain);
	const enabledProtocols = getEnabledProtocols();
	for (const domain of domains) {
		const validPorts = ports.filter(item => domain.endsWith("workers.dev") || isHttpsPort(item));
		const configAddresses = await getConfigAddresses(domain, false);
		if (upstreamServer && upstreamPort) {
			validPorts.unshift(upstreamPort);
			configAddresses.unshift(upstreamServer);
		}
		for (const port of validPorts) {
			for (const address of configAddresses) {
				const { sni, host } = getTlsHostAndSni(address, domain);
				if (port === upstreamPort == (address === upstreamServer)) {
					if (enabledProtocols.includes(VLESS)) {
						const configRemark = buildConfigRemark(index, port, address, VLESS, domain, false, false);
						vlessLinks += `${buildLink(VLESS, address, port, host, sni, configRemark)}\n`;
					}
					if (enabledProtocols.includes(TROJAN)) {
						const configRemark = buildConfigRemark(index, port, address, TROJAN, domain, false, false);
						trojanLinks += `${buildLink(TROJAN, address, port, host, sni, configRemark)}\n`;
					}
					index++;
				}
			}
		}
	}
	if (chainProxy) {
		let chainLabel = `#${encodeURIComponent("💦 Chain proxy 🔗")}`;
		if (chainProxy.startsWith("socks") || chainProxy.startsWith("http")) {
			const credentialsPattern = /^(?:socks|http):\/\/([^@]+)@/;
			const match = chainProxy.match(credentialsPattern);
			const item = !!match && match[1];
			chainLink = item ? chainProxy.replace(item, btoa(item)) + chainLabel : chainProxy + chainLabel;
		} else {
			chainLink = chainProxy.split("#")[0] + chainLabel;
		}
	}
	const body = encodeBase64Utf8(await decorateSubscription(vlessLinks + trojanLinks + chainLink + (customConfigs.join("\n") + await fetchExternalSubscriptions(customSubs))));
	return new Response(body, {
		status: 200, headers: {
			"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache", Expires: "0", "Profile-Title": `base64:${encodeBase64Utf8(`💦 ${PROJECT_NAME} Raw`)}`, DNS: remoteDNS
		}
	});
}

async function fetchExternalSubscriptions(urls) {
	return (await Promise.all(urls.map(async (url) => {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				return "";
			}
			const trimmed = (await response.text()).trim();
			if (!trimmed) {
				return "";
			}
			if (isBase64(trimmed)) {
				try {
					return decodeBase64Utf8(trimmed);
				} catch {
					return trimmed;
				}
			}
			return trimmed;
		} catch {
			return "";
		}
	}))).filter(Boolean).join("\n");
}

// ══════ ساخت کانفیگ sing-box ══════
function buildSingBoxOutboundBase(tag, type, server, port, enableTFO, extra, tls, transport, useRemoteDns) {
	return {
		tag: tag, type: type, server: server, server_port: port, tcp_fast_open: enableTFO, ...extra, tls: tls, transport: transport, domain_resolver: isDomain(server) ? useRemoteDns ? "dns-remote" : "dns-direct" : undefined
	};
}

function buildSingBoxProxyOutbound(protocol, tag, address, port, domain, recordFragment) {
	const { vlUUID, trPass, fingerprint, enableTFO, enableECH, echServerName, upstreamParams: { upstreamServer } } = getSettings();
	const { host, sni, allowInsecure } = getTlsHostAndSni(address, domain);
	const singBoxTransport = buildSingBoxTransport("ws", "none", buildWebSocketPath(protocol), host, undefined, 2560);
	const singBoxTls = isHttpsPort(port) || address === upstreamServer ? buildSingBoxTls("tls", recordFragment, allowInsecure, sni, enableECH && !recordFragment, echServerName || undefined, "http/1.1", fingerprint) : undefined;
	return protocol === VLESS ? buildSingBoxOutboundBase(tag, protocol, address, port, enableTFO, { uuid: vlUUID, packet_encoding: "", network: "tcp" }, singBoxTls, singBoxTransport) : buildSingBoxOutboundBase(tag, protocol, address, port, enableTFO, { password: trPass, network: "tcp" }, singBoxTls, singBoxTransport);
}

function buildSingBoxWarpEndpoint(account, tag, endpoint, detour) {
	const { host, port } = parseHostAndPort(endpoint, false);
	const { warpReservedBytes } = getSettings();
	const { warpIPv6, reserved, publicKey, privateKey } = account;
	const address = detour ? "162.159.192.1" : host;
	return {
		tag: tag, detour: detour || undefined, type: "wireguard", address: ["172.16.0.2/32", warpIPv6], mtu: 1280, peers: [{
				address: address, port: detour ? 2408 : port, public_key: publicKey, reserved: warpReservedBytes ? base64ToBytes(reserved) : [0, 0, 0], allowed_ips: ["0.0.0.0/0", "::/0"], persistent_keepalive_interval: 5
			}], private_key: privateKey, domain_resolver: isDomain(address) ? "dns-direct" : undefined
	};
}

function buildSingBoxChainOutbound() {
	const { chainProxy, chainProxyParams: { protocol, server, port, user, pass, password, method, uuid, flow, security, type, sni, fp, host, path, alpn, pbk, sid, headerType, serviceName, aid } } = getSettings();
	const { searchParams } = new URL(chainProxy);
	const ed = searchParams.get("ed");
	const flag = ed ? +ed : undefined;
	const singBoxTls = buildSingBoxTls(security, false, false, sni || server, false, undefined, alpn, fp, pbk, sid);
	const singBoxTransport = buildSingBoxTransport(type, headerType, path, host, serviceName, flag);
	switch (protocol) {
		case "http": return buildSingBoxOutboundBase("", protocol, server, port, false, { username: user, password: pass }, undefined, undefined, true);
		case "socks": return buildSingBoxOutboundBase("", protocol, server, port, false, {
			username: user, password: pass, version: "5", network: "tcp"
		}, undefined, undefined, true);
		case SHADOWSOCKS: return buildSingBoxOutboundBase("", protocol, server, port, false, { method: method, password: password, network: "tcp" }, undefined, undefined, true);
		case VLESS: return buildSingBoxOutboundBase("", protocol, server, port, false, { uuid: uuid, flow: flow, network: "tcp" }, singBoxTls, singBoxTransport, true);
		case VMESS: return buildSingBoxOutboundBase("", protocol, server, port, false, {
			uuid: uuid, security: "auto", alter_id: aid, network: "tcp"
		}, singBoxTls, singBoxTransport, true);
		case TROJAN: return buildSingBoxOutboundBase("", protocol, server, port, false, { password: password, network: "tcp" }, singBoxTls, singBoxTransport, true);
		default: return;
	}
}

function buildSingBoxUrlTest(tag, outbounds, isWarp) {
	const { warpBestPingInterval, bestPingInterval } = getSettings();
	return {
		type: "urltest", tag: tag, outbounds: outbounds, url: "https://www.gstatic.com/generate_204", interrupt_exist_connections: false, interval: isWarp ? `${warpBestPingInterval}s` : `${bestPingInterval}s`
	};
}

function buildSingBoxTls(security, recordFragment, allowInsecure, sni, enableECH, echServerName, alpn, fingerprint, publicKey, shortId) {
	if (!["tls", "reality"].includes(security)) {
		return;
	}
	const alpnList = alpn?.split(",").filter(item => item !== "h2");
	const tlsOptions = {
		enabled: true, server_name: sni, record_fragment: recordFragment, insecure: allowInsecure, alpn: alpnList, utls: { enabled: !!fingerprint, fingerprint: fingerprint }, ech: enableECH ? { enabled: true, query_server_name: echServerName } : undefined
	};
	return security === "tls" ? tlsOptions : security === "reality" && publicKey && shortId ? { ...tlsOptions, reality: { enabled: true, public_key: publicKey, short_id: shortId } } : undefined;
}

function buildSingBoxTransport(network, headerType, path = "/", host, serviceName, maxEarlyData) {
	switch ((path = path?.split("?")[0], network)) {
		case "tcp": return headerType === "http" ? {
			type: "http", host: host?.split(","), path: path, method: "GET", headers: { Connection: ["keep-alive"], "Content-Type": ["application/octet-stream"] }
		} : undefined;
		case "ws": return {
			type: "ws", path: path?.split("?ed=")[0], max_early_data: maxEarlyData, early_data_header_name: maxEarlyData ? "Sec-WebSocket-Protocol" : undefined, headers: { Host: host }
		};
		case "httpupgrade": return { type: "httpupgrade", host: host, path: path?.split("?ed=")[0] };
		case "grpc": return { type: "grpc", service_name: serviceName };
		default: return;
	}
}

function getSingBoxRuleSets() {
	const { localDNS, antiSanctionDNS, blockMalware, blockPhishing, blockCryptominers, blockAds, blockPorn, bypassIran, bypassChina, bypassRussia, bypassOpenAi, bypassGoogleAi, bypassMicrosoft, bypassOracle, bypassDocker, bypassAdobe, bypassEpicGames, bypassIntel, bypassAmd, bypassNvidia, bypassAsus, bypassHp, bypassLenovo } = getSettings();
	return [
		{
			rule: blockMalware, type: "block", geosite: "geosite-malware", geoip: "geoip-malware", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-malware.srs", geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-malware.srs"
		},
		{
			rule: blockPhishing, type: "block", geosite: "geosite-phishing", geoip: "geoip-phishing", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-phishing.srs", geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-phishing.srs"
		},
		{
			rule: blockCryptominers, type: "block", geosite: "geosite-cryptominers", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cryptominers.srs"
		},
		{
			rule: blockAds, type: "block", geosite: "geosite-category-ads-all", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ads-all.srs"
		},
		{
			rule: blockPorn, type: "block", geosite: "geosite-nsfw", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-nsfw.srs"
		},
		{
			rule: bypassIran, type: "direct", dns: localDNS, geosite: "geosite-ir", geoip: "geoip-ir", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-ir.srs", geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ir.srs"
		},
		{
			rule: bypassChina, type: "direct", dns: localDNS, geosite: "geosite-cn", geoip: "geoip-cn", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cn.srs", geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-cn.srs"
		},
		{
			rule: bypassRussia, type: "direct", dns: localDNS, geosite: "geosite-category-ru", geoip: "geoip-ru", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ru.srs", geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ru.srs"
		},
		{
			rule: bypassOpenAi, type: "direct", dns: antiSanctionDNS, geosite: "geosite-openai", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-openai.srs"
		},
		{
			rule: bypassGoogleAi, type: "direct", dns: antiSanctionDNS, geosite: "geosite-google-deepmind", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-google-deepmind.srs"
		},
		{
			rule: bypassMicrosoft, type: "direct", dns: antiSanctionDNS, geosite: "geosite-microsoft", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-microsoft.srs"
		},
		{
			rule: bypassOracle, type: "direct", dns: antiSanctionDNS, geosite: "geosite-oracle", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-oracle.srs"
		},
		{
			rule: bypassDocker, type: "direct", dns: antiSanctionDNS, geosite: "geosite-docker", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-docker.srs"
		},
		{
			rule: bypassAdobe, type: "direct", dns: antiSanctionDNS, geosite: "geosite-adobe", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-adobe.srs"
		},
		{
			rule: bypassEpicGames, type: "direct", dns: antiSanctionDNS, geosite: "geosite-epicgames", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-epicgames.srs"
		},
		{
			rule: bypassIntel, type: "direct", dns: antiSanctionDNS, geosite: "geosite-intel", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-intel.srs"
		},
		{
			rule: bypassAmd, type: "direct", dns: antiSanctionDNS, geosite: "geosite-amd", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-amd.srs"
		},
		{
			rule: bypassNvidia, type: "direct", dns: antiSanctionDNS, geosite: "geosite-nvidia", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-nvidia.srs"
		},
		{
			rule: bypassAsus, type: "direct", dns: antiSanctionDNS, geosite: "geosite-asus", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-asus.srs"
		},
		{
			rule: bypassHp, type: "direct", dns: antiSanctionDNS, geosite: "geosite-hp", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-hp.srs"
		},
		{
			rule: bypassLenovo, type: "direct", dns: antiSanctionDNS, geosite: "geosite-lenovo", geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-lenovo.srs"
		}
	].filter(({ rule }) => rule);
}

function buildSingBoxRoute(allowUdp) {
	const { blockUDP443 } = getSettings();
	const rules = [
		{ ip_cidr: "172.19.0.2", action: "hijack-dns" }, { clash_mode: "Direct", outbound: "direct" }, { clash_mode: "Global", outbound: "✅ Selector" }, { action: "sniff" }, { protocol: "dns", action: "hijack-dns" }, { ip_is_private: true, outbound: "direct" }
	];
	if (allowUdp) {
		if (blockUDP443) {
			addSingBoxRule(rules, "reject", undefined, undefined, undefined, undefined, "udp", "quic", 443);
		}
	} else {
		addSingBoxRule(rules, "reject", undefined, undefined, undefined, undefined, "udp");
	}
	const singBoxRuleSets = getSingBoxRuleSets();
	const routingRules = buildRoutingRules(singBoxRuleSets);
	if ([...routingRules.block.geosites, ...routingRules.block.domains].length) {
		addSingBoxRule(rules, "reject", routingRules.block.domains, undefined, routingRules.block.geosites);
	}
	if ([...routingRules.block.geoips, ...routingRules.block.ips].length) {
		addSingBoxRule(rules, "reject", undefined, routingRules.block.ips, undefined, routingRules.block.geoips);
	}
	if ([...routingRules.bypass.geosites, ...routingRules.bypass.domains].length) {
		addSingBoxRule(rules, "direct", routingRules.bypass.domains, undefined, routingRules.bypass.geosites);
	}
	if ([...routingRules.bypass.geoips, ...routingRules.bypass.ips].length) {
		addSingBoxRule(rules, "direct", undefined, routingRules.bypass.ips, undefined, routingRules.bypass.geoips);
	}
	return {
		rules: rules, rule_set: singBoxRuleSets.reduce((accumulator, item) => (addSingBoxRuleSets(accumulator, item), accumulator), []).omitEmpty(), auto_detect_interface: true, final: "✅ Selector"
	};
}

function addSingBoxRule(rules, outbound, domains, ips, geosites, geoips, network, protocol, port) {
	rules.push({
		rule_set: geosites || geoips, domain_suffix: domains?.length ? domains : undefined, ip_cidr: ips?.length ? ips : undefined, network: network, protocol: protocol, port: port, action: outbound === "reject" ? "reject" : "route", outbound: outbound === "direct" ? "direct" : undefined
	});
}

function addSingBoxRuleSets(ruleSets, ruleSet) {
	const { geosite, geositeURL, geoip, geoipURL } = ruleSet;
	const addRuleSet = (tag, url) => ruleSets.push({
		type: "remote", tag: tag, format: "binary", url: url, download_detour: "direct"
	});
	if (geosite && geositeURL) {
		addRuleSet(geosite, geositeURL);
	}
	if (geoip && geoipURL) {
		addRuleSet(geoip, geoipURL);
	}
}

var SINGBOX_TUN_INBOUND = {
	type: "tun", tag: "tun-in", address: ["172.19.0.1/28"], mtu: 9e3, auto_route: true, strict_route: true, stack: "mixed"
};

function buildSingBoxMixedInbound() {
	const { allowLANConnection } = getSettings();
	return {
		type: "mixed", tag: "mixed-in", listen: allowLANConnection ? "0.0.0.0" : "127.0.0.1", listen_port: 2080
	};
}

async function buildSingBoxDns(isWarp, useBestPing) {
	const { localDNS, remoteDNS, warpRemoteDNS, antiSanctionDNS, remoteDnsHost, enableIPv6, fakeDNS, enableECH, echServerName } = getSettings();
	const remoteProtocol = new URL(remoteDNS).protocol.replace(":", "");
	const servers = [{
			type: isWarp ? "udp" : remoteProtocol, server: isWarp ? warpRemoteDNS : remoteDnsHost.host, detour: isWarp ? "💦 Warp - Best Ping 🚀" : useBestPing ? "💦 Best Ping 🚀" : "✅ Selector", tag: "dns-remote"
		}];
	if (localDNS === "localhost") {
		addSingBoxDnsServer(servers, "local", "dns-direct", undefined, undefined, undefined);
	} else {
		addSingBoxDnsServer(servers, "udp", "dns-direct", localDNS, undefined, undefined);
	}
	const rules = [{ clash_mode: "Direct", server: "dns-direct" }, { clash_mode: "Global", server: "dns-remote" }];
	if (enableECH) {
		const { mainDomain, customDomain } = getSettings();
		const echDomains = echServerName ? [echServerName] : [mainDomain].concatIf(!!customDomain, customDomain);
		addSingBoxDnsRule(rules, "dns-direct", undefined, undefined, undefined, echDomains, ["HTTPS"]);
	}
	if (remoteDnsHost.isDomain && !isWarp) {
		const { ipv4, ipv6, host } = remoteDnsHost;
		addSingBoxDnsServer(servers, "hosts", "hosts", undefined, undefined, undefined, host, ipv4.concatIf(enableIPv6, ipv6));
		rules.unshift({ ip_accept_any: true, server: "hosts" });
	}
	const dnsRoutingRules = buildDnsRoutingRules(getSingBoxRuleSets());
	if ([...dnsRoutingRules.block.geosites, ...dnsRoutingRules.block.domains].length) {
		addSingBoxDnsRule(rules, "reject", undefined, dnsRoutingRules.block.geosites, undefined, dnsRoutingRules.block.domains);
	}
	dnsRoutingRules.bypass.localDNS.geositeGeoips.forEach(({ geosite, geoip }) => {
		addSingBoxDnsRule(rules, "dns-direct", undefined, [geosite], geoip, undefined);
	});
	if ([...dnsRoutingRules.bypass.localDNS.geosites, ...dnsRoutingRules.bypass.localDNS.domains].length) {
		addSingBoxDnsRule(rules, "dns-direct", undefined, dnsRoutingRules.bypass.localDNS.geosites, undefined, dnsRoutingRules.bypass.localDNS.domains);
	}
	if ([...dnsRoutingRules.bypass.antiSanctionDNS.geosites, ...dnsRoutingRules.bypass.antiSanctionDNS.domains].length) {
		const urlHost = parseUrlHost(antiSanctionDNS);
		addSingBoxDnsRule(rules, "dns-anti-sanction", undefined, dnsRoutingRules.bypass.antiSanctionDNS.geosites, undefined, dnsRoutingRules.bypass.antiSanctionDNS.domains);
		if (urlHost.isHostDomain) {
			addSingBoxDnsServer(servers, "https", "dns-anti-sanction", urlHost.host, undefined, "dns-direct");
		} else {
			addSingBoxDnsServer(servers, "udp", "dns-anti-sanction", antiSanctionDNS, undefined, undefined);
		}
	}
	if (fakeDNS) {
		addSingBoxDnsServer(servers, "fakeip", "dns-fake", undefined, undefined, undefined, undefined, undefined, "198.18.0.0/15", enableIPv6 ? "fc00::/18" : undefined);
		addSingBoxDnsRule(rules, "dns-fake", "tun-in", undefined, undefined, undefined, ["A", "AAAA"]);
	}
	return {
		servers: servers, rules: rules, strategy: enableIPv6 ? "prefer_ipv4" : "ipv4_only", independent_cache: true
	};
}

function addSingBoxDnsServer(servers, type, tag, server, detour, domainResolver, predefinedHost, predefinedIps, inet4Range, inet6Range) {
	servers.push({
		type: type, server: server, detour: detour, domain_resolver: domainResolver ? { server: domainResolver, strategy: "ipv4_only" } : undefined, predefined: predefinedHost ? { [predefinedHost]: predefinedIps } : undefined, inet4_range: inet4Range, inet6_range: inet6Range, tag: tag
	});
}

function addSingBoxDnsRule(rules, server, inbound, geosites, geoip, domains, queryTypes) {
	const isLogical = geosites && geoip;
	rules.push({
		inbound: inbound, type: isLogical ? "logical" : undefined, mode: isLogical ? "and" : undefined, rules: isLogical ? [{ rule_set: geosites }, { rule_set: geoip }] : undefined, rule_set: geosites?.length && !geoip ? geosites : undefined, domain_suffix: domains?.omitEmpty(), query_type: queryTypes, action: server === "reject" ? "reject" : "route", server: server === "reject" ? undefined : server
	});
}

async function buildSingBoxConfig(proxies, endpoints, proxyGroups, isWarp, useBestPing) {
	const { logLevel } = getSettings();
	const groupNames = Object.keys(proxyGroups).filter(item => !!proxyGroups[item].length);
	const selectorOutbounds = [...groupNames, ...groupNames.flatMap(groupName => proxyGroups[groupName])];
	const config = {
		log: { disabled: logLevel === "none", level: logLevel === "none" ? undefined : logLevel === "warning" ? "warn" : logLevel, timestamp: true }, dns: await buildSingBoxDns(isWarp, useBestPing), inbounds: [SINGBOX_TUN_INBOUND, buildSingBoxMixedInbound()], outbounds: [
			...proxies,
			{
				type: "selector", tag: "✅ Selector", outbounds: selectorOutbounds, interrupt_exist_connections: false
			},
			{ type: "direct", tag: "direct", domain_resolver: "dns-direct" }
		], endpoints: endpoints.omitEmpty(), route: buildSingBoxRoute(isWarp), ntp: {
			enabled: true, server: "time.cloudflare.com", server_port: 123, domain_resolver: "dns-direct", interval: "30m", write_to_system: false
		}, experimental: {
			cache_file: { enabled: true, store_fakeip: true }, clash_api: {
				external_controller: "127.0.0.1:9090", external_ui: "ui", default_mode: "Rule", external_ui_download_url: "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip", external_ui_download_detour: "direct"
			}
		}
	};
	for (const groupName of groupNames) {
		if (proxyGroups[groupName].length) {
			const singBoxUrlTest = buildSingBoxUrlTest(groupName, proxyGroups[groupName], isWarp);
			config.outbounds.push(singBoxUrlTest);
		}
	}
	return config;
}

async function getSingBoxNormalConfig(isFragment) {
	const { chainProxy, ports, mainDomain, customDomain, upstreamParams: { upstreamServer, upstreamPort } } = getSettings();
	const singBoxChainOutbound = chainProxy ? buildSingBoxChainOutbound() : undefined;
	const hasChain = !!singBoxChainOutbound;
	const domains = [mainDomain].concatIf(!!customDomain, customDomain);
	const enabledProtocols = getEnabledProtocols();
	const outbounds = [];
	const bestPingGroups = {
		"💦 Best Ping 🚀": [], "💦 🔗 Best Ping 🚀": [], "💦 Best Ping D 🚀": [], "💦 🔗 Best Ping D 🚀": []
	};
	for (const domain of domains) {
		const validPorts = ports.filter(item => !isFragment && domain.endsWith("workers.dev") || isHttpsPort(item));
		const configAddresses = await getConfigAddresses(domain, isFragment);
		if (upstreamServer && upstreamPort) {
			validPorts.unshift(upstreamPort);
			configAddresses.unshift(upstreamServer);
		}
		for (const protocol of enabledProtocols) {
			let index = 1;
			for (const port of validPorts) {
				for (const address of configAddresses) {
					if (port === upstreamPort != (address === upstreamServer)) {
						continue;
					}
					const configRemark = buildConfigRemark(index, port, address, protocol, domain, isFragment, false);
					const singBoxProxyOutbound = buildSingBoxProxyOutbound(protocol, configRemark, address, port, domain, isFragment);
					if (outbounds.push(singBoxProxyOutbound), domain === customDomain ? bestPingGroups["💦 Best Ping D 🚀"].push(configRemark) : bestPingGroups["💦 Best Ping 🚀"].push(configRemark), hasChain) {
						const chainRemark = buildConfigRemark(index, port, address, protocol, domain, isFragment, true);
						const chainOutbound = structuredClone(singBoxChainOutbound);
						chainOutbound.tag = chainRemark;
						chainOutbound.detour = configRemark;
						outbounds.push(chainOutbound);
						if (domain === customDomain) {
							bestPingGroups["💦 🔗 Best Ping D 🚀"].push(chainRemark);
						} else {
							bestPingGroups["💦 🔗 Best Ping 🚀"].push(chainRemark);
						}
					}
					index++;
				}
			}
		}
	}
	const singBoxConfig = await buildSingBoxConfig(outbounds, [], bestPingGroups, false, hasChain);
	const mode = isFragment ? "fragment" : "normal";
	return new Response(JSON.stringify(singBoxConfig, null, 4), {
		status: 200, headers: {
			"Content-Type": "application/json", "Content-Disposition": `attachment; filename=${PROJECT_NAME_LOWER}-${mode}-sing-box.json`, "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache", Expires: "0"
		}
	});
}

async function getSingBoxWarpConfig() {
	const { warpEndpoints } = getSettings();
	const accounts = getWarpAccounts();
	const endpoints = [];
	const bestPingGroups = { "💦 Warp - Best Ping 🚀": [], "💦 WoW - Best Ping 🚀": [] };
	warpEndpoints.forEach((item, index) => {
		const warpRemark = `💦 ${index + 1}. Warp 🇮🇷`;
		bestPingGroups["💦 Warp - Best Ping 🚀"].push(warpRemark);
		const wowRemark = `💦 ${index + 1}. WoW 🌍`;
		bestPingGroups["💦 WoW - Best Ping 🚀"].push(wowRemark);
		const singBoxWarpEndpoint = buildSingBoxWarpEndpoint(accounts[0], warpRemark, item);
		const singBoxWarpEndpoint2 = buildSingBoxWarpEndpoint(accounts[1], wowRemark, item, warpRemark);
		endpoints.push(singBoxWarpEndpoint, singBoxWarpEndpoint2);
	});
	const singBoxConfig = await buildSingBoxConfig([], endpoints, bestPingGroups, true, false);
	return new Response(JSON.stringify(singBoxConfig, null, 4), {
		status: 200, headers: {
			"Content-Type": "application/json", "Content-Disposition": `attachment; filename=${PROJECT_NAME_LOWER}-warp-sing-box.json`, "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache", Expires: "0"
		}
	});
}

// ══════ ساخت کانفیگ Xray ══════
function buildXrayMixedInbound(allowLAN, sniffQuic, sniffFakeDns) {
	return {
		listen: allowLAN ? "0.0.0.0" : "127.0.0.1", port: 10808, protocol: "mixed", settings: { auth: "noauth", udp: true }, sniffing: { destOverride: ["http", "tls"].concatIf(sniffQuic, "quic").concatIf(sniffFakeDns, "fakedns"), enabled: true, routeOnly: true }, tag: "mixed-in"
	};
}

function buildXrayDnsInbound(allowLAN) {
	return {
		listen: allowLAN ? "0.0.0.0" : "127.0.0.1", port: 10853, protocol: "dokodemo-door", settings: { address: "1.1.1.1", network: "tcp,udp", port: 53 }, tag: "dns-in"
	};
}

function getXrayRuleSets() {
	const { localDNS, antiSanctionDNS, blockMalware, blockPhishing, blockCryptominers, blockAds, blockPorn, bypassIran, bypassChina, bypassRussia, bypassOpenAi, bypassGoogleAi, bypassMicrosoft, bypassOracle, bypassDocker, bypassAdobe, bypassEpicGames, bypassIntel, bypassAmd, bypassNvidia, bypassAsus, bypassHp, bypassLenovo } = getSettings();
	return [
		{ rule: blockAds, type: "block", geosite: "geosite:category-ads-all" }, { rule: blockAds, type: "block", geosite: "geosite:category-ads-ir" }, { rule: blockPorn, type: "block", geosite: "geosite:category-porn" },
		{
			rule: blockMalware, type: "block", geosite: "geosite:malware", geoip: "geoip:malware"
		},
		{
			rule: blockPhishing, type: "block", geosite: "geosite:phishing", geoip: "geoip:phishing"
		},
		{ rule: blockCryptominers, type: "block", geosite: "geosite:cryptominers" },
		{
			rule: bypassIran, type: "direct", geosite: "geosite:category-ir", geoip: "geoip:ir", dns: localDNS
		},
		{
			rule: bypassChina, type: "direct", geosite: "geosite:cn", geoip: "geoip:cn", dns: localDNS
		},
		{
			rule: bypassRussia, type: "direct", geosite: "geosite:category-ru", geoip: "geoip:ru", dns: localDNS
		},
		{
			rule: bypassOpenAi, type: "direct", geosite: "geosite:openai", dns: antiSanctionDNS
		},
		{
			rule: bypassGoogleAi, type: "direct", geosite: "geosite:google-deepmind", dns: antiSanctionDNS
		},
		{
			rule: bypassMicrosoft, type: "direct", geosite: "geosite:microsoft", dns: antiSanctionDNS
		},
		{
			rule: bypassOracle, type: "direct", geosite: "geosite:oracle", dns: antiSanctionDNS
		},
		{
			rule: bypassDocker, type: "direct", geosite: "geosite:docker", dns: antiSanctionDNS
		},
		{
			rule: bypassAdobe, type: "direct", geosite: "geosite:adobe", dns: antiSanctionDNS
		},
		{
			rule: bypassEpicGames, type: "direct", geosite: "geosite:epicgames", dns: antiSanctionDNS
		},
		{
			rule: bypassIntel, type: "direct", geosite: "geosite:intel", dns: antiSanctionDNS
		},
		{
			rule: bypassAmd, type: "direct", geosite: "geosite:amd", dns: antiSanctionDNS
		},
		{
			rule: bypassNvidia, type: "direct", geosite: "geosite:nvidia", dns: antiSanctionDNS
		},
		{
			rule: bypassAsus, type: "direct", geosite: "geosite:asus", dns: antiSanctionDNS
		},
		{
			rule: bypassHp, type: "direct", geosite: "geosite:hp", dns: antiSanctionDNS
		},
		{
			rule: bypassLenovo, type: "direct", geosite: "geosite:lenovo", dns: antiSanctionDNS
		}
	].filter(({ rule }) => rule);
}

function buildXrayRouting(hasChain, useBalancer, isFragment, isWarp) {
	const { blockUDP443 } = getSettings();
	const rules = [
		{
			inboundTag: ["mixed-in"], port: 53, outboundTag: "dns-out", type: "field"
		},
		{ inboundTag: ["dns-in"], outboundTag: "dns-out", type: "field" }
	];
	const finalOutbound = useBalancer ? hasChain ? "all-chains" : "all-proxies" : hasChain ? "chain" : isFragment ? "direct" : "proxy";
	addXrayRoutingRule(rules, ["remote-dns"], undefined, undefined, undefined, undefined, undefined, useBalancer ? "all-proxies" : "proxy", useBalancer);
	addXrayRoutingRule(rules, ["dns"], undefined, undefined, undefined, undefined, undefined, "direct", false);
	addXrayRoutingRule(rules, undefined, ["geosite:private"], undefined, undefined, undefined, undefined, "direct", false);
	addXrayRoutingRule(rules, undefined, undefined, ["geoip:private"], undefined, undefined, undefined, "direct", false);
	if (isWarp || isFragment) {
		if (blockUDP443) {
			addXrayRoutingRule(rules, undefined, undefined, undefined, 443, "udp", undefined, "block", false);
		}
	} else {
		addXrayRoutingRule(rules, undefined, undefined, undefined, undefined, "udp", undefined, "block", false);
	}
	const routingRules = buildRoutingRules(getXrayRuleSets());
	const blockDomains = [...routingRules.block.geosites, ...routingRules.block.domains.map(domain => `domain:${domain}`)];
	if (blockDomains.length) {
		addXrayRoutingRule(rules, undefined, blockDomains, undefined, undefined, undefined, undefined, "block");
	}
	const blockIps = [...routingRules.block.geoips, ...routingRules.block.ips];
	if (blockIps.length) {
		addXrayRoutingRule(rules, undefined, undefined, blockIps, undefined, undefined, undefined, "block");
	}
	const bypassDomains = [...routingRules.bypass.geosites, ...routingRules.bypass.domains.map(domain => `domain:${domain}`)];
	if (bypassDomains.length) {
		addXrayRoutingRule(rules, undefined, bypassDomains, undefined, undefined, undefined, undefined, "direct");
	}
	const bypassIps = [...routingRules.bypass.geoips, ...routingRules.bypass.ips];
	if (bypassIps.length) {
		addXrayRoutingRule(rules, undefined, undefined, bypassIps, undefined, undefined, undefined, "direct");
	}
	if (isFragment) {
		addXrayRoutingRule(rules, undefined, undefined, undefined, undefined, "tcp", ["tls"], "proxy", false);
		addXrayRoutingRule(rules, undefined, undefined, undefined, undefined, "tcp", ["http"], "http-fragment", false);
		addXrayRoutingRule(rules, undefined, undefined, undefined, undefined, "udp", ["quic"], "udp-noise", false);
		addXrayRoutingRule(rules, undefined, undefined, undefined, "443,2053,2083,2087,2096,8443", "udp", undefined, "udp-noise", false);
	}
	addXrayRoutingRule(rules, undefined, undefined, undefined, undefined, isWarp || isFragment ? "tcp,udp" : "tcp", undefined, finalOutbound, useBalancer);
	return rules;
}

var addXrayRoutingRule = (rules, inboundTag, domains, ips, port, network, protocols, target, isBalancer) => rules.push({
	inboundTag: inboundTag, domain: domains, ip: ips, port: port, network: network, protocol: protocols, balancerTag: isBalancer ? target : undefined, outboundTag: isBalancer ? undefined : target, type: "field"
});

async function buildXrayDns(addresses, isFragment, isWarp, domain, dohHost, dohAddresses) {
	const { localDNS, remoteDNS, warpRemoteDNS, antiSanctionDNS, remoteDnsHost, enableIPv6, fakeDNS } = getSettings();
	const hosts = {};
	const servers = [];
	const fakeDnsDomains = [];
	if (remoteDnsHost.isDomain && !isFragment && !isWarp) {
		const { ipv4, ipv6, host } = remoteDnsHost;
		hosts[host] = ipv4.concatIf(enableIPv6, ipv6);
	}
	if (domain) {
		const { ipv4, ipv6 } = await resolveDomainRecords(domain, enableIPv6);
		hosts[domain] = [...ipv4, ...ipv6];
	}
	let skipFallback = true;
	let remoteServer = isWarp ? warpRemoteDNS : remoteDNS;
	if (isFragment) {
		remoteServer = `https://${dohHost}/dns-query`;
		if (dohHost && dohAddresses) {
			hosts[dohHost] = dohAddresses;
		}
		skipFallback = false;
	}
	const remoteServerConfig = buildXrayDnsServer(remoteServer, undefined, undefined, undefined, undefined, "remote-dns");
	servers.push(remoteServerConfig);
	const dnsRoutingRules = buildDnsRoutingRules(getXrayRuleSets());
	[...dnsRoutingRules.block.geosites, ...dnsRoutingRules.block.domains.map(domain2 => `domain:${domain2}`)].forEach(item => hosts[item] = "#3");
	dnsRoutingRules.bypass.localDNS.geositeGeoips.forEach(({ geosite, geoip }) => {
		const xrayDnsServer = buildXrayDnsServer(localDNS, [geosite], [geoip], skipFallback);
		servers.push(xrayDnsServer);
		fakeDnsDomains.push(geosite);
	});
	const antiSanctionDomains = [...dnsRoutingRules.bypass.antiSanctionDNS.geosites, ...dnsRoutingRules.bypass.antiSanctionDNS.domains.map(domain2 => `domain:${domain2}`)];
	const localDomains = [...dnsRoutingRules.bypass.localDNS.geosites, ...dnsRoutingRules.bypass.localDNS.domains.map(domain2 => `domain:${domain2}`), ...addresses.filter(isDomain).map(item => `full:${item}`)];
	if (antiSanctionDomains.length) {
		const xrayDnsServer = buildXrayDnsServer(antiSanctionDNS, antiSanctionDomains, undefined, skipFallback, true);
		servers.push(xrayDnsServer);
		const { host, isHostDomain } = parseUrlHost(antiSanctionDNS);
		if (isHostDomain) {
			localDomains.push(`full:${host}`);
		}
	}
	if (dohAddresses?.filter(isDomain).forEach(item => localDomains.push(`full:${item}`)), localDomains.length) {
		const xrayDnsServer = buildXrayDnsServer(localDNS, localDomains, undefined, skipFallback);
		servers.push(xrayDnsServer);
		fakeDnsDomains.push(...localDomains);
	}
	if (fakeDNS || isFragment) {
		const xrayDnsServer = fakeDnsDomains.length ? buildXrayDnsServer("fakedns", fakeDnsDomains, undefined, false, undefined) : "fakedns";
		servers.unshift(xrayDnsServer);
	}
	return {
		hosts: hosts.omitEmpty(), servers: servers, queryStrategy: isWarp && !enableIPv6 ? "UseIPv4" : "UseIP", tag: "dns"
	};
}

function buildXrayDnsServer(address, domains, expectIPs, skipFallback, finalQuery, tag) {
	return {
		address: address, domains: domains, expectIPs: expectIPs, skipFallback: skipFallback, finalQuery: finalQuery, tag: tag
	};
}

function buildXrayOutbound(protocol, tag, enableMux, settings, streamSettings) {
	return {
		protocol: protocol, mux: enableMux ? {
			enabled: true, concurrency: 8, xudpConcurrency: 16, xudpProxyUDP443: "reject"
		} : undefined, settings: settings, streamSettings: streamSettings, tag: tag
	};
}

function buildXrayFreedomOutbound(useFragment, useNoise, tag, fragmentLength, fragmentDelay, fragmentPackets) {
	const { enableTFO, enableIPv6 } = getSettings();
	return {
		protocol: "freedom", settings: { domainStrategy: useFragment ? undefined : enableIPv6 ? "UseIPv4v6" : "UseIPv4" }, streamSettings: { sockopt: useFragment ? buildXraySockopt(true, enableTFO, "UseIP") : undefined, finalmask: buildXrayFinalMask(useFragment, useNoise, fragmentLength, fragmentDelay, fragmentPackets) }, tag: tag
	};
}

function buildXrayProxyOutbound(tag, protocol, address, port, domain, isFragment, fragmentLength, fragmentDelay) {
	const { vlUUID, trPass, fingerprint, enableTFO, enableECH, echServerName, upstreamParams: { upstreamServer } } = getSettings();
	const isTls = isHttpsPort(port) || address === upstreamServer;
	const { host, sni } = getTlsHostAndSni(address, domain);
	const xrayTlsSettings = isTls ? buildXrayTlsSettings(sni, fingerprint, "http/1.1", enableECH && !isFragment, echServerName || undefined) : undefined;
	const streamSettings = {
		network: "ws", ...buildXrayTransportSettings("ws", "none", `${buildWebSocketPath(protocol)}?ed=2560`, host), security: isTls ? "tls" : "none", tlsSettings: xrayTlsSettings, sockopt: buildXraySockopt(true, enableTFO, "UseIP"), finalmask: buildXrayFinalMask(isFragment, false, fragmentLength, fragmentDelay)
	};
	return protocol === VLESS ? buildXrayOutbound(protocol, tag, false, { vnext: [{ address: address, port: port, users: [{ id: vlUUID, encryption: "none" }] }] }, streamSettings) : buildXrayOutbound(protocol, tag, false, { servers: [{ address: address, port: port, password: trPass }] }, streamSettings);
}

function buildXrayWarpOutbound(account, endpoint, isChain, isPro, isKnocker) {
	const { warpIPv6, reserved, publicKey, privateKey } = account;
	const { warpReservedBytes } = getSettings();
	let wireguardSettings = {
		address: ["172.16.0.2/32", warpIPv6], mtu: 1280, peers: [{ endpoint: isChain ? "162.159.192.1:2408" : endpoint, publicKey: publicKey, keepAlive: 5 }], reserved: warpReservedBytes ? base64ToBytes(reserved) : [0, 0, 0], secretKey: privateKey
	};
	const streamSettings = {};
	if (isChain) {
		streamSettings.sockopt = buildXraySockopt(false, false, undefined, "proxy");
	} else if (isPro) {
		if (isKnocker) {
			const { knockerNoiseMode, knockerNoiseCountMin, knockerNoiseCountMax, knockerNoiseSizeMin, knockerNoiseSizeMax, knockerNoiseDelayMin, knockerNoiseDelayMax } = getSettings();
			wireguardSettings = {
				...wireguardSettings, wnoise: knockerNoiseMode, wnoisecount: formatRange(knockerNoiseCountMin, knockerNoiseCountMax), wpayloadsize: formatRange(knockerNoiseSizeMin, knockerNoiseSizeMax), wnoisedelay: formatRange(knockerNoiseDelayMin, knockerNoiseDelayMax)
			};
		} else {
			streamSettings.finalmask = buildXrayFinalMask(false, isPro);
		}
	}
	return {
		protocol: "wireguard", settings: wireguardSettings, streamSettings: streamSettings.omitEmpty(), tag: isChain ? "chain" : "proxy"
	};
}

function buildXrayChainOutbound() {
	const { chainProxyParams: { protocol, server, port, user, pass, password, method, uuid, flow, security, type, sni, fp, host, path, alpn, pbk, sid, spx, headerType, serviceName, mode, authority, encryption } } = getSettings();
	const streamSettings = {
		network: type || "raw", ...buildXrayTransportSettings(type, headerType, path, host, serviceName, mode, authority), security: security, tlsSettings: security === "tls" ? buildXrayTlsSettings(sni || server, fp, alpn, false, undefined) : undefined, realitySettings: security === "reality" ? buildXrayRealitySettings(sni, fp, pbk, sid, spx) : undefined, sockopt: buildXraySockopt(false, false, "UseIPv4", "proxy")
	};
	const enableMux = !(security === "reality" || type === "grpc" || type === "xhttp");
	switch (protocol) {
		case "http":
		case "socks": return buildXrayOutbound(protocol, "chain", enableMux, { servers: [{ address: server, port: port, users: [{ user: user, pass: pass }] }] }, streamSettings);
		case SHADOWSOCKS: return buildXrayOutbound(protocol, "chain", enableMux, { servers: [{
					address: server, port: port, method: method, password: password
				}] }, streamSettings);
		case VLESS: return buildXrayOutbound(protocol, "chain", enableMux, { vnext: [{ address: server, port: port, users: [{ id: uuid, flow: flow, encryption: encryption ?? "none" }] }] }, streamSettings);
		case VMESS: return buildXrayOutbound(protocol, "chain", enableMux, { vnext: [{ address: server, port: port, users: [{ id: uuid, security: "auto" }] }] }, streamSettings);
		case TROJAN: return buildXrayOutbound(protocol, "chain", enableMux, { servers: [{ address: server, port: port, password: password }] }, streamSettings);
		default: return;
	}
}

function buildXrayTransportSettings(network, headerType, path = "/", host, serviceName, mode, authority, extra) {
	switch (network) {
		case "tcp":
		case "raw": return {
			rawSettings: {
				header: headerType === "http" ? {
					type: "http", request: {
						headers: {
							Host: host?.split(","), "Accept-Encoding": ["gzip, deflate"], Connection: ["keep-alive"], Pragma: "no-cache"
						}, path: path.split(","), method: "GET", version: "1.1"
					}
				} : { type: "none" }
			}
		};
		case "ws": return { wsSettings: { host: host, path: path } };
		case "httpupgrade": return { httpupgradeSettings: { host: host, path: path } };
		case "grpc": return { grpcSettings: { authority: authority, multiMode: mode === "multi", serviceName: serviceName } };
		case "xhttp": return { xhttpSettings: {
				host: host, path: path, mode: mode || "auto", extra: JSON.parse(decodeURIComponent(extra ?? "{}"))
			} };
		default: return {};
	}
}

function buildXraySockopt(happyEyeballs, enableTFO, domainStrategy, dialerProxy) {
	return {
		domainStrategy: domainStrategy, dialerProxy: dialerProxy, tcpFastOpen: enableTFO || undefined, happyEyeballs: happyEyeballs ? {
			tryDelayMs: 250, prioritizeIPv6: false, interleave: 2, maxConcurrentTry: 4
		} : undefined
	};
}

function buildXrayTlsSettings(sni, fingerprint, alpn, enableECH, echServerName) {
	const { localDNS } = getSettings();
	const dnsServer = localDNS === "localhost" ? "8.8.8.8" : localDNS;
	return {
		serverName: sni, fingerprint: fingerprint, alpn: alpn?.split(","), echConfigList: enableECH ? echServerName ? `${echServerName}+udp://${dnsServer}` : `udp://${dnsServer}` : undefined
	};
}

function buildXrayRealitySettings(sni, fingerprint, publicKey, shortId, spiderX) {
	return {
		serverName: sni, fingerprint: fingerprint, publicKey: publicKey, shortId: shortId, spiderX: spiderX, show: false, allowInsecure: false
	};
}

function buildXrayUdpNoises(noises) {
	return noises.flatMap(({ type, packet, delay, count }) => {
		const noise = type === "rand" ? { rand: packet, randRange: "0-255", delay: delay } : { type: type, packet: type === "array" ? packet.split(",").map(Number) : packet, delay: delay };
		return Array.from({ length: count }, () => noise);
	});
}

function buildXrayFinalMask(useFragment, useNoise, length, delay, packets) {
	if (!useFragment && !useNoise) {
		return;
	}
	const { fragmentPackets, fragmentLengthMin, fragmentLengthMax, fragmentDelayMin, fragmentDelayMax, fragmentMaxSplitMin, fragmentMaxSplitMax, xrayUdpNoises } = getSettings();
	return {
		tcp: useFragment ? [{ type: "fragment", settings: {
					packets: packets || fragmentPackets, length: length || formatRange(fragmentLengthMin, fragmentLengthMax), delay: delay || formatRange(fragmentDelayMin, fragmentDelayMax), maxSplit: formatRange(fragmentMaxSplitMin, fragmentMaxSplitMax)
				} }] : undefined, udp: useNoise ? [{ type: "noise", settings: { reset: "30-60", noise: buildXrayUdpNoises(xrayUdpNoises) } }] : undefined
	};
}

function buildXrayBalancer(tag, selector, hasFallback) {
	return {
		tag: tag, selector: [selector], strategy: { type: "leastPing" }, fallbackTag: hasFallback ? "proxy-2" : undefined
	};
}

async function buildXrayConfig(remarks, outbounds, useBalancer, hasChain, hasFallback, isWarp, isFragment, addresses, domain, dohHost, dohAddresses) {
	const { fakeDNS, warpBestPingInterval, bestPingInterval, logLevel, allowLANConnection } = getSettings();
	let balancers;
	let observatory;
	if (useBalancer) {
		balancers = [buildXrayBalancer("all-proxies", "proxy", hasFallback)].concatIf(hasChain, buildXrayBalancer("all-chains", "chain", false));
		observatory = {
			subjectSelector: hasChain ? ["chain", "proxy"] : ["proxy"], probeUrl: "https://www.gstatic.com/generate_204", probeInterval: `${isWarp ? warpBestPingInterval : bestPingInterval}s`, enableConcurrency: true
		};
	}
	return {
		remarks: remarks, version: { min: "26.2.6" }, log: { loglevel: logLevel }, dns: await buildXrayDns(addresses, isFragment, isWarp, domain, dohHost, dohAddresses), inbounds: [buildXrayMixedInbound(allowLANConnection, isFragment, isFragment || fakeDNS), buildXrayDnsInbound(allowLANConnection)], outbounds: [
			...outbounds, { protocol: "dns", settings: { rules: [{ action: "hijack" }] }, tag: "dns-out" }, { protocol: "freedom", settings: { domainStrategy: "UseIP" }, tag: "direct" }, { protocol: "blackhole", settings: { response: { type: "http" } }, tag: "block" }
		], routing: { domainStrategy: "IPIfNonMatch", rules: buildXrayRouting(hasChain, useBalancer, isFragment, isWarp), balancers: balancers }, observatory: observatory, policy: {
			levels: { 0: {
					connIdle: 300, handshake: 4, uplinkOnly: 1, downlinkOnly: 1
				} }, system: { statsOutboundUplink: true, statsOutboundDownlink: true }
		}, stats: {}
	};
}

async function buildXrayBestPingConfig(configs, addresses, outbounds, chainOutbounds, isFragment, isCustomDomain) {
	addresses = [...new Set(addresses)];
	const hasChain = !!chainOutbounds.length;
	const remark = `💦 ${hasChain ? "🔗 " : ""}Best Ping ${`${isFragment ? "F " : ""}${isCustomDomain ? "D " : ""}`}🚀`;
	const allOutbounds = [...chainOutbounds, ...outbounds];
	const xrayConfig = await buildXrayConfig(remark, allOutbounds, true, hasChain, true, false, false, addresses);
	if (hasChain) {
		await buildXrayBestPingConfig(configs, addresses, outbounds, [], isFragment, isCustomDomain);
	}
	configs.push(xrayConfig);
}

async function buildXrayFragmentConfigs(configs, chainOutbound) {
	const { mainDomain, fragmentDelayMin, fragmentDelayMax } = getSettings();
	const hasChain = !!chainOutbound;
	const outbounds = [];
	["1-5", "1-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100", "10-30", "20-40", "30-50", "40-60", "50-70", "60-80", "70-90", "80-100", "100-200"].forEach((fragmentLength, index) => {
		if (hasChain) {
			const cloneOutboundResult = cloneOutbound(chainOutbound, `chain-${index + 1}`, `proxy-${index + 1}`);
			outbounds.push(cloneOutboundResult);
		}
		const xrayProxyOutbound = buildXrayProxyOutbound(`proxy-${index + 1}`, VLESS, mainDomain, 443, mainDomain, true, fragmentLength, `${fragmentDelayMin}-${fragmentDelayMax}`);
		outbounds.push(xrayProxyOutbound);
	});
	const chainPrefix = hasChain ? "🔗 " : "";
	const xrayConfig = await buildXrayConfig(`💦 ${chainPrefix}Smart Fragment 🧠`, outbounds, true, hasChain, false, false, false, [], mainDomain);
	if (chainOutbound) {
		await buildXrayFragmentConfigs(configs);
	}
	configs.push(xrayConfig);
}

async function buildXrayServerlessConfig(configs) {
	const proxyOutbound = buildXrayFreedomOutbound(true, false, "proxy");
	const noiseOutbound = buildXrayFreedomOutbound(false, true, "udp-noise");
	const outbounds = [proxyOutbound, buildXrayFreedomOutbound(true, false, "http-fragment", undefined, undefined, "1-1"), noiseOutbound];
	const xrayConfig = await buildXrayConfig("💦 1 - Serverless 🌟", outbounds, false, false, false, false, true, [], undefined, "cloudflare-dns.com", ["cloudflare.com"]);
	const xrayConfig2 = await buildXrayConfig("💦 2 - Serverless 🌟", outbounds, false, false, false, false, true, [], undefined, "dns.google", ["8.8.8.8", "8.8.4.4"]);
	configs.push(xrayConfig, xrayConfig2);
}

async function getXrayNormalConfig(isFragment) {
	const { chainProxy, ports, mainDomain, customDomain, upstreamParams: { upstreamServer, upstreamPort } } = getSettings();
	const xrayChainOutbound = chainProxy ? buildXrayChainOutbound() : undefined;
	const domains = [mainDomain].concatIf(!!customDomain, customDomain);
	const enabledProtocols = getEnabledProtocols();
	const configs = [];
	let globalIndex = 1;
	for (const domain of domains) {
		let addresses = [];
		const outbounds = [];
		const chainOutbounds = [];
		const validPorts = ports.filter(item => !isFragment && domain.endsWith("workers.dev") || isHttpsPort(item));
		const configAddresses = await getConfigAddresses(domain, isFragment);
		if (upstreamServer && upstreamPort && !isFragment) {
			validPorts.unshift(upstreamPort);
			configAddresses.unshift(upstreamServer);
		}
		addresses.push(...configAddresses);
		for (const protocol of enabledProtocols) {
			let index = 1;
			for (const port of validPorts) {
				for (const address of configAddresses) {
					if (port === upstreamPort != (address === upstreamServer)) {
						continue;
					}
					const xrayProxyOutbound = buildXrayProxyOutbound("proxy", protocol, address, port, domain, isFragment);
					const outboundClone = cloneOutbound(xrayProxyOutbound, `proxy-${globalIndex}`);
					outbounds.push(outboundClone);
					const configRemark = buildConfigRemark(index, port, address, protocol, domain, isFragment, false);
					const xrayConfig = await buildXrayConfig(configRemark, [xrayProxyOutbound], false, false, false, false, false, [address]);
					if (configs.push(xrayConfig), xrayChainOutbound) {
						const chainRemark = buildConfigRemark(index, port, address, protocol, domain, isFragment, true);
						const chainConfig = await buildXrayConfig(chainRemark, [xrayChainOutbound, xrayProxyOutbound], false, true, false, false, false, [address]);
						configs.push(chainConfig);
						const chainClone = cloneOutbound(xrayChainOutbound, `chain-${globalIndex}`, `proxy-${globalIndex}`);
						chainOutbounds.push(chainClone);
					}
					index++;
					globalIndex++;
				}
			}
		}
		const isCustomDomain = domain === customDomain;
		await buildXrayBestPingConfig(configs, addresses, outbounds, chainOutbounds, isFragment, isCustomDomain);
	}
	if (isFragment) {
		await buildXrayFragmentConfigs(configs, xrayChainOutbound);
		await buildXrayServerlessConfig(configs);
	}
	const mode = isFragment ? "fragment" : "normal";
	return new Response(JSON.stringify(configs, null, 4), {
		status: 200, headers: {
			"Content-Type": "application/json", "Content-Disposition": `attachment; filename=${PROJECT_NAME_LOWER}-${mode}-xray.json`, "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache", Expires: "0"
		}
	});
}

async function getXrayWarpConfig(isPro, isKnocker) {
	const { warpEndpoints } = getSettings();
	const accounts = getWarpAccounts();
	const proLabel = isPro ? " Pro " : " ";
	const configs = [];
	const proxyOutbounds = [];
	const chainOutbounds = [];
	const endpointDomains = [];
	for (const [index, endpoint] of warpEndpoints.entries()) {
		const { host } = parseHostAndPort(endpoint);
		if (isDomain(host)) {
			endpointDomains.push(host);
		}
		const xrayWarpOutbound = buildXrayWarpOutbound(accounts[0], endpoint, false, isPro, isKnocker);
		const chainWarpOutbound = buildXrayWarpOutbound(accounts[1], endpoint, true, isPro, isKnocker);
		const xrayConfig = await buildXrayConfig(`💦 ${index + 1} - Warp${proLabel}🇮🇷`, [xrayWarpOutbound], false, false, false, true, false, [host]);
		const xrayConfig2 = await buildXrayConfig(`💦 ${index + 1} - WoW${proLabel}🌍`, [chainWarpOutbound, xrayWarpOutbound], false, true, false, true, false, [host]);
		configs.push(xrayConfig, xrayConfig2);
		const proxyClone = cloneOutbound(xrayWarpOutbound, `proxy-${index + 1}`);
		proxyOutbounds.push(proxyClone);
		const chainClone = cloneOutbound(chainWarpOutbound, `chain-${index + 1}`, `proxy-${index + 1}`);
		chainOutbounds.push(chainClone);
	}
	const xrayConfig3 = await buildXrayConfig(`💦 Warp${proLabel}- Best Ping 🚀`, [...proxyOutbounds], true, false, false, true, false, endpointDomains);
	const xrayConfig4 = await buildXrayConfig(`💦 WoW${proLabel}- Best Ping 🚀`, [...chainOutbounds, ...proxyOutbounds], true, true, false, true, false, endpointDomains);
	configs.push(xrayConfig3, xrayConfig4);
	const fileKey = isPro ? "warp-Pro" : "warp";
	return new Response(JSON.stringify(configs, null, 4), {
		status: 200, headers: {
			"Content-Type": "application/json", "Content-Disposition": `attachment; filename=${PROJECT_NAME_LOWER}-${fileKey}-xray.json`, "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache", Expires: "0"
		}
	});
}

function cloneOutbound(outbound, tag, dialerProxy) {
	const clone = structuredClone(outbound);
	clone.tag = tag;
	if (dialerProxy && clone.streamSettings?.sockopt) {
		clone.streamSettings.sockopt.dialerProxy = dialerProxy;
	}
	return clone;
}

var JSZip = toEsModule(requireJszip(), 1);

// ══════ وایرگارد، مسیریابی ساب و تلگرام ══════
async function buildWireguardConfig(isAmnezia) {
	try {
		const { warpIPv6, publicKey, privateKey } = getWarpAccounts()[0];
		const { warpEndpoints, warpRemoteDNS, amneziaNoiseCount, amneziaNoiseSizeMin, amneziaNoiseSizeMax } = getSettings();
		const zip = new JSZip.default;
		warpEndpoints?.forEach((item, index) => {
			const config = ["[Interface]", `PrivateKey = ${privateKey}`, `Address = 172.16.0.2/32, ${warpIPv6}`, `DNS = ${warpRemoteDNS}`, "MTU = 1280", ...isAmnezia ? [`Jc = ${amneziaNoiseCount}`, `Jmin = ${amneziaNoiseSizeMin}`, `Jmax = ${amneziaNoiseSizeMax}`, "S1 = 0", "S2 = 0", "H1 = 1", "H2 = 2", "H3 = 3", "H4 = 4"] : [], "", "[Peer]", `PublicKey = ${publicKey}`, "AllowedIPs = 0.0.0.0/0, ::/0", `Endpoint = ${item}`, "PersistentKeepalive = 25"].join("\n");
			zip.file(`${PROJECT_NAME}-Warp-${index + 1}.conf`, config);
		});
		const blob = await zip.generateAsync({ type: "blob" });
		const buffer = await blob.arrayBuffer();
		return new Response(buffer, {
			headers: {
				"Content-Type": "application/zip", "Content-Disposition": `attachment; filename=${PROJECT_NAME_LOWER}-warp-${isAmnezia ? "pro-amnezia" : "wireguard"}-conf.zip`, "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache"
			}
		});
	} catch (error) {
		return jsonResponse(false, 500, `Error generating ZIP file: ${getErrorMessage(error)}`);
	}
}

async function handleSubscriptionRoutes(request, env) {
	await loadSettingsAndWarp(env);
	const { pathname, client } = getRuntimeConfig();
	switch (pathname.split("/")[3]) {
		case "normal": switch (client) {
			case "xray": return getXrayNormalConfig(false);
			case "sing-box": return getSingBoxNormalConfig(false);
			case "clash": return getClashNormalConfig();
			default: break;
		}
		case "raw": switch (client) {
			case "xray":
			case "sing-box": return getRawSubscription();
			default: break;
		}
		case "fragment": switch (client) {
			case "xray": return getXrayNormalConfig(true);
			case "sing-box": return getSingBoxNormalConfig(true);
			default: break;
		}
		case "warp": switch (client) {
			case "xray": return getXrayWarpConfig(false, false);
			case "sing-box": return getSingBoxWarpConfig();
			case "clash": return getClashWarpConfig(false);
			case "wireguard": return buildWireguardConfig(false);
			default: break;
		}
		case "warp-pro": switch (client) {
			case "xray": return getXrayWarpConfig(true, false);
			case "xray-knocker": return getXrayWarpConfig(true, true);
			case "clash": return getClashWarpConfig(true);
			case "amnezia": return buildWireguardConfig(true);
			default: break;
		}
		case "share-settings": return handleSharedSettings();
		default: return proxyToFallback(request);
	}
}

async function handleSharedSettings() {
	const exportableSettings = getExportableSettings();
	const encoded = btoa(JSON.stringify(exportableSettings));
	return new Response(encoded, {
		status: 200, headers: {
			"Content-Type": "text/plain; charset=utf-8", "Content-Disposition": `attachment; filename=${PROJECT_NAME_LOWER}-settings.dat`, "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET", "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache", Expires: "0"
		}
	});
}

async function handleTelegramRoutes(request, env) {
	await loadSettingsAndWarp(env);
	const { pathname } = getRuntimeConfig();
	switch (pathname.split("/")[3]) {
		case "setup": return setupTelegramBot(request, env);
		case "remove": return removeTelegramWebhook(request, env);
		case "webhook": return handleTelegramWebhook(request, env);
		default: return proxyToFallback(request);
	}
}

var COMMAND_TCP = 1;

var COMMAND_UDP = 2;

// ══════ هسته‌ی پروکسی: VLESS / Trojan روی WebSocket ══════
async function connectToRemote(remoteSocket, address, port, initialData, webSocket, responseHeader, log) {
	async function connectAndWrite(targetHost, targetPort) {
		const socket = connect({ hostname: targetHost, port: targetPort });
		remoteSocket.value = socket;
		log(`connected to ${targetHost}:${targetPort}`);
		const writer = socket.writable.getWriter();
		await writer.write(initialData);
		writer.releaseLock();
		return socket;
	}
	async function retryConnection() {
		const { proxyIpMode, proxyIPs, prefixes } = getRuntimeConfig();
		const pickRandom = list => list[Math.floor(Math.random() * list.length)];
		if (proxyIpMode === "proxyip") {
			log(`direct connection failed, trying to use Proxy IP for ${address}`);
			const selectedProxy = await pickProxyIP(proxyIPs);
			const { host, port: port2 } = typeof selectedProxy == "object" ? selectedProxy : parseHostAndPort(selectedProxy, true);
			address = host || address;
			port = port2 || port;
		} else if (proxyIpMode === "prefix") {
			log(`direct connection failed, trying to generate dynamic prefix for ${address}`);
			const prefix = pickRandom(prefixes);
			const nat64Address = await getNat64Address(address, prefix);
			if (nat64Address) {
				address = nat64Address;
			} else {
				webSocket.close(1011, "Retry connection failed: Invalid Prefix");
			}
		}
		try {
			const retrySocket = await connectAndWrite(address, port);
			retrySocket.closed.catch(error => console.log("retry TCP socket closed error", error)).finally(() => closeWebSocketQuietly(webSocket));
			pipeRemoteToWebSocket(retrySocket, webSocket, responseHeader, null, log);
		} catch (error) {
			console.error("Retry connection failed:", error);
			webSocket.close(1011, `Retry connection failed: ${getErrorMessage(error)}`);
		}
	}
	try {
		pipeRemoteToWebSocket(await connectAndWrite(address, port), webSocket, responseHeader, retryConnection, log);
	} catch (error) {
		console.error(`Connection failed: ${error}`);
		webSocket.close(1011, `Connection failed: ${getErrorMessage(error)}`);
	}
}

async function pipeRemoteToWebSocket(remoteSocket, webSocket, responseHeader, retry, log) {
	let header = responseHeader;
	let hasIncomingData = false;
	const writable = new WritableStream({
		start() {
		}, async write(chunk, controller) {
			hasIncomingData = true;
			if (webSocket.readyState !== 1) {
				controller.error("webSocket.readyState is not open, maybe close");
			}
			if (header) {
				webSocket.send(await new Blob([header, chunk]).arrayBuffer());
				header = null;
			} else {
				webSocket.send(chunk);
			}
		}, close() {
			log(`remoteConnection.readable is close with hasIncomingData is ${hasIncomingData}`);
		}, abort(reason) {
			console.error("remoteConnection.readable abort", reason);
			closeSocketQuietly(remoteSocket);
		}
	});
	try {
		await remoteSocket.readable.pipeTo(writable);
	} catch (error) {
		console.error("VLRemoteSocketToWS has exception.", error);
		closeSocketQuietly(remoteSocket);
		closeWebSocketQuietly(webSocket);
	}
	if (hasIncomingData === false && retry) {
		log("retry");
		retry();
	}
}

function createWebSocketReadableStream(webSocket, earlyDataHeader, log) {
	let isCancelled = false;
	return new ReadableStream({
		start(controller) {
			webSocket.addEventListener("message", event => {
				if (!(isCancelled)) {
					controller.enqueue(event.data);
				}
			});
			webSocket.addEventListener("close", () => {
				closeWebSocketQuietly(webSocket);
				if (!(isCancelled)) {
					controller.close();
				}
			});
			webSocket.addEventListener("error", event => {
				log("webSocketServer has error");
				controller.error(event);
			});
			const { earlyData, error } = decodeEarlyData(earlyDataHeader);
			if (error) {
				controller.error(error);
			} else {
				if (earlyData) {
					controller.enqueue(earlyData);
				}
			}
		}, pull(controller) {
		}, cancel(reason) {
			if (!(isCancelled)) {
				log(`ReadableStream was canceled, due to ${reason}`);
				isCancelled = true;
				closeWebSocketQuietly(webSocket);
			}
		}
	});
}

function decodeEarlyData(base64Data) {
	if (!base64Data) {
		return { earlyData: null, error: null };
	}
	try {
		base64Data = base64Data.replace(/-/g, "+").replace(/_/g, "/");
		const decoded = atob(base64Data);
		return { earlyData: Uint8Array.from(decoded, char => char.charCodeAt(0)).buffer, error: null };
	} catch (error) {
		return { earlyData: null, error: error };
	}
}

function closeSocketQuietly(socket) {
	if (socket) {
		try {
			socket.close();
		} catch (error) {
			console.error("Failed to close TCP socket:", error);
		}
	}
}

function closeWebSocketQuietly(webSocket) {
	try {
		if (!(webSocket.readyState !== 1 && webSocket.readyState !== 2)) {
			webSocket.close();
		}
	} catch (error) {
		console.error("safeCloseWebSocket error", error);
	}
}

async function getNat64Address(host, prefix) {
	let ipv4Address = host;
	if (!isIPv4(host)) {
		const { ipv4 } = await resolveDomainRecords(host, true);
		if (!ipv4.length) {
			throw new Error("Unable to find IPv4 in DNS records");
		}
		ipv4Address = ipv4[0];
	}
	return convertIPv4ToNat64(ipv4Address, prefix);
}

function convertIPv4ToNat64(ipv4, prefix) {
	const parts = ipv4.split(".");
	if (parts.length !== 4) {
		throw new Error("Invalid IPv4 address");
	}
	const mapped = parts.map(item => {
		const number = parseInt(item, 10);
		if (number < 0 || number > 255) {
			throw new Error("Invalid IPv4 address");
		}
		return number.toString(16).padStart(2, "0");
	});
	const match = prefix.match(/^\[([0-9A-Fa-f:]+)\]$/);
	if (match) {
		return `[${match[1]}${mapped[0]}${mapped[1]}:${mapped[2]}${mapped[3]}]`;
	}
}

async function handleTrojanWebSocket(request) {
	const webSocketPair = new WebSocketPair;
	const [client, server] = Object.values(webSocketPair);
	server.accept();
	server.binaryType = "arraybuffer";
	let remoteAddress = "";
	let connectionInfo = "";
	const log = (message, detail) => {
		console.log(`[${remoteAddress}:${connectionInfo}] ${message}`, detail || "");
	};
	const secWebsocketProtocol = request.headers.get("sec-websocket-protocol") || "";
	const webSocketReadableStream = createWebSocketReadableStream(server, secWebsocketProtocol, log);
	let remoteSocketWrapper = { value: null };
	let udpWrite = null;
	const writableStream = new WritableStream({
		async write(chunk, controller) {
			if (null) {
				return udpWrite(chunk);
			}
			if (remoteSocketWrapper.value) {
				const writer = remoteSocketWrapper.value.writable.getWriter();
				await writer.write(chunk);
				return void writer.releaseLock();
			}
			const { hasError, message, portRemote: portRemote = 443, addressRemote: addressRemote = "", rawClientData } = parseTrojanHeader(chunk);
			if (remoteAddress = addressRemote, connectionInfo = `${portRemote}--${Math.random()} tcp`, hasError) {
				throw new Error(message);
			}
			connectToRemote(remoteSocketWrapper, addressRemote, portRemote, rawClientData, server, null, log);
		}, close() {
			closeSocketQuietly(remoteSocketWrapper.value);
		}, abort(reason) {
			log("readableWebSocketStream is aborted", JSON.stringify(reason));
		}
	});
	webSocketReadableStream.pipeTo(writableStream).catch(error => {
		log("readableWebSocketStream pipeTo error", error);
		closeSocketQuietly(remoteSocketWrapper.value);
	});
	return new Response(null, { status: 101, webSocket: client });
}

function parseTrojanHeader(buffer) {
	if (buffer.byteLength < 56) {
		return { hasError: true, message: "invalid data" };
	}
	let passwordEnd = 56;
	const cr = new Uint8Array(buffer.slice(passwordEnd, 57))[0];
	const lf = new Uint8Array(buffer.slice(57, 58))[0];
	if (cr !== 13 || lf !== 10) {
		return { hasError: true, message: "invalid header format (missing CR LF)" };
	}
	const { trPass } = getRuntimeConfig();
	if ((new TextDecoder).decode(buffer.slice(0, passwordEnd)) !== createHash("sha224").update(trPass).digest("hex")) {
		return { hasError: true, message: "invalid password" };
	}
	const socksData = buffer.slice(58);
	if (socksData.byteLength < 6) {
		return { hasError: true, message: "invalid SOCKS5 request data" };
	}
	const view = new DataView(socksData);
	if (view.getUint8(0) !== 1) {
		return { hasError: true, message: "unsupported command, only TCP (CONNECT) is allowed" };
	}
	const addressType = view.getUint8(1);
	let addressLength = 0;
	let addressIndex = 2;
	let address = "";
	switch (addressType) {
		case 1:
			addressLength = 4;
			address = new Uint8Array(socksData.slice(addressIndex, addressIndex + addressLength)).join(".");
			break;
		case 3:
			addressLength = new Uint8Array(socksData.slice(addressIndex, addressIndex + 1))[0];
			addressIndex += 1;
			address = (new TextDecoder).decode(socksData.slice(addressIndex, addressIndex + addressLength));
			break;
		case 4: {
			addressLength = 16;
			const ipv6View = new DataView(socksData.slice(addressIndex, addressIndex + addressLength));
			const groups = [];
			for (let index = 0; index < 8; index++) {
				groups.push(ipv6View.getUint16(2 * index).toString(16));
			}
			address = groups.join(":");
			break;
		}
		default: return { hasError: true, message: `invalid addressType is ${addressType}` };
	}
	if (!address) {
		return { hasError: true, message: `address is empty, addressType is ${addressType}` };
	}
	const portIndex = addressIndex + addressLength;
	const portBytes = socksData.slice(portIndex, portIndex + 2);
	return {
		hasError: false, addressRemote: address, portRemote: new DataView(portBytes).getUint16(0), rawClientData: socksData.slice(portIndex + 4)
	};
}

async function handleVlessWebSocket(request) {
	const { vlUUID } = getRuntimeConfig();
	const webSocketPair = new WebSocketPair;
	const [client, server] = Object.values(webSocketPair);
	server.accept();
	server.binaryType = "arraybuffer";
	let remoteAddress = "";
	let connectionInfo = "";
	const log = (message, detail) => {
		console.log(`[${remoteAddress}:${connectionInfo}] ${message}`, detail || "");
	};
	const secWebsocketProtocol = request.headers.get("sec-websocket-protocol") || "";
	const webSocketReadableStream = createWebSocketReadableStream(server, secWebsocketProtocol, log);
	let remoteSocketWrapper = { value: null };
	let udpWrite = null;
	let isDnsStream = false;
	const writableStream = new WritableStream({
		async write(chunk) {
			if (isDnsStream && udpWrite) {
				return udpWrite(chunk);
			}
			if (remoteSocketWrapper.value) {
				const writer = remoteSocketWrapper.value.writable.getWriter();
				await writer.write(chunk);
				return void writer.releaseLock();
			}
			const { hasError, message, portRemote: portRemote = 443, addressRemote: addressRemote = "", rawDataIndex, VLVersion: VLVersion = new Uint8Array([0, 0]), isUDP } = parseVlessHeader(chunk, vlUUID);
			if (remoteAddress = addressRemote, connectionInfo = `${portRemote}--${Math.random()} ${isUDP ? "udp " : "tcp "} `, hasError) {
				throw new Error(message);
			}
			const responseHeader = new Uint8Array([VLVersion[0], 0]);
			const payload = chunk.slice(rawDataIndex);
			if (isUDP) {
				if (portRemote === 53) {
					isDnsStream = true;
					const { write } = await handleUdpDnsOverWebSocket(server, responseHeader, log);
					udpWrite = write;
					return void await udpWrite(payload);
				}
				throw new Error("UDP proxy only enable for DNS which is port 53");
			}
			connectToRemote(remoteSocketWrapper, addressRemote, portRemote, payload, server, responseHeader, log);
		}, close() {
			closeSocketQuietly(remoteSocketWrapper.value);
		}, abort(reason) {
			log("readableWebSocketStream is abort", JSON.stringify(reason));
		}
	});
	webSocketReadableStream.pipeTo(writableStream).catch(error => {
		log("readableWebSocketStream pipeTo error", error);
		closeSocketQuietly(remoteSocketWrapper.value);
	});
	return new Response(null, { status: 101, webSocket: client });
}

function parseVlessHeader(buffer, uuid) {
	if (buffer.byteLength < 24) {
		return { hasError: true, message: "invalid data" };
	}
	const version = new Uint8Array(buffer.slice(0, 1));
	if (!(stringifyUuid(new Uint8Array(buffer.slice(1, 17))) === uuid)) {
		return { hasError: true, message: "invalid user" };
	}
	const optionsLength = new Uint8Array(buffer.slice(17, 18))[0];
	const command = new Uint8Array(buffer.slice(18 + optionsLength, 18 + optionsLength + 1))[0];
	let isUDP = false;
	if (command === 1) {
		;
	} else {
		if (command !== 2) {
			return { hasError: true, message: `command ${command} is not supported, command 01-tcp,02-udp,03-mux` };
		}
		isUDP = true;
	}
	const portIndex = 18 + optionsLength + 1;
	const portBytes = buffer.slice(portIndex, portIndex + 2);
	const port = new DataView(portBytes).getUint16(0);
	let addressTypeIndex = portIndex + 2;
	const addressType = new Uint8Array(buffer.slice(addressTypeIndex, addressTypeIndex + 1))[0];
	let addressLength = 0;
	let addressIndex = addressTypeIndex + 1;
	let address = "";
	switch (addressType) {
		case 1:
			addressLength = 4;
			address = new Uint8Array(buffer.slice(addressIndex, addressIndex + addressLength)).join(".");
			break;
		case 2:
			addressLength = new Uint8Array(buffer.slice(addressIndex, addressIndex + 1))[0];
			addressIndex += 1;
			address = (new TextDecoder).decode(buffer.slice(addressIndex, addressIndex + addressLength));
			break;
		case 3: {
			addressLength = 16;
			const view = new DataView(buffer.slice(addressIndex, addressIndex + addressLength));
			const groups = [];
			for (let index = 0; index < 8; index++) {
				groups.push(view.getUint16(2 * index).toString(16));
			}
			address = groups.join(":");
			break;
		}
		default: return { hasError: true, message: `invalid addressType is ${addressType}` };
	}
	return address ? {
		hasError: false, addressRemote: address, addressType: addressType, portRemote: port, rawDataIndex: addressIndex + addressLength, VLVersion: version, isUDP: isUDP
	} : { hasError: true, message: `addressValue is empty, addressType is ${addressType}` };
}

function unsafeStringifyUuid(bytes, offset = 0) {
	const hexTable = [];
	for (let index = 0; index < 256; ++index) {
		hexTable.push((index + 256).toString(16).slice(1));
	}
	return (hexTable[bytes[offset + 0]] + hexTable[bytes[offset + 1]] + hexTable[bytes[offset + 2]] + hexTable[bytes[offset + 3]] + "-" + hexTable[bytes[offset + 4]] + hexTable[bytes[offset + 5]] + "-" + hexTable[bytes[offset + 6]] + hexTable[bytes[offset + 7]] + "-" + hexTable[bytes[offset + 8]] + hexTable[bytes[offset + 9]] + "-" + hexTable[bytes[offset + 10]] + hexTable[bytes[offset + 11]] + hexTable[bytes[offset + 12]] + hexTable[bytes[offset + 13]] + hexTable[bytes[offset + 14]] + hexTable[bytes[offset + 15]]).toLowerCase();
}

function stringifyUuid(bytes, offset = 0) {
	const unsafeStringifyUuidResult = unsafeStringifyUuid(bytes, offset);
	if (!isValidUuid(unsafeStringifyUuidResult)) {
		throw TypeError("Stringified UUID is invalid");
	}
	return unsafeStringifyUuidResult;
}

async function handleUdpDnsOverWebSocket(webSocket, responseHeader, log) {
	let headerSent = false;
	const transformStream = new TransformStream({
		start(controller) {
		}, transform(chunk, controller) {
			for (let offset = 0; offset < chunk.byteLength;) {
				const lengthBytes = chunk.slice(offset, offset + 2);
				const length = new DataView(lengthBytes).getUint16(0);
				const packet = new Uint8Array(chunk.slice(offset + 2, offset + 2 + length));
				offset = offset + 2 + length;
				controller.enqueue(packet);
			}
		}, flush(controller) {
		}
	});
	transformStream.readable.pipeTo(new WritableStream({
		async write(chunk) {
			const response = await fetch("https://cloudflare-dns.com/dns-query", { method: "POST", headers: { "content-type": "application/dns-message" }, body: chunk });
			const buffer = await response.arrayBuffer();
			const byteLength = buffer.byteLength;
			const lengthPrefix = new Uint8Array([byteLength >> 8 & 255, 255 & byteLength]);
			if (webSocket.readyState === 1) {
				log(`doh success and dns message length is ${byteLength}`);
				if (headerSent) {
					webSocket.send(await new Blob([lengthPrefix, buffer]).arrayBuffer());
				} else {
					webSocket.send(await new Blob([responseHeader, lengthPrefix, buffer]).arrayBuffer());
					headerSent = true;
				}
			}
		}
	})).catch(error => {
		log("dns udp has error" + error);
	});
	const writer = transformStream.writable.getWriter();
	return { async write(chunk) {
			await writer.write(chunk);
		} };
}

async function handleWebSocketRoutes(request) {
	const { pathname } = getRuntimeConfig();
	const item = pathname.split("/")[1];
	try {
		switch (item) {
			case "vl": return handleVlessWebSocket(request);
			case "tr": return handleTrojanWebSocket(request);
			default: return proxyToFallback(request);
		}
	} catch (error) {
		return new Response("Bad Request", { status: 400 });
	}
}

// ══════ ورودی اصلی ورکر ══════
var worker = {
	async fetch(request, env) {
		try {
			if (env = await initD1Environment(env, request), initRuntimeConfig(request, env), request.headers.get("Upgrade") === "websocket") {
				return handleWebSocketRoutes(request);
			}
			const { securePath, pathname } = getRuntimeConfig();
			switch (pathname.split("/").splice(0, 3).join("/")) {
				case `/${securePath}/panel`: return handlePanelRoutes(request, env);
				case `/${securePath}/login`: return handleLoginRoutes(request, env);
				case `/${securePath}/sub`: return handleSubscriptionRoutes(request, env);
				case `/${securePath}/telegram`: return handleTelegramRoutes(request, env);
				case `/${securePath}/dns-query`: return proxyDnsQuery(request);
				case `/${securePath}/proxy-ip`: return handleProxyIpRoutes(request, env);
				case `/${securePath}/zeus`: return handleZeusRoutes(request, env);
				case `/${securePath}/alireza`: return handleAlirezaRoutes(request, env);
				case `/${securePath}/qrcode`: return handleQrCodeRequest(request);
				default: return proxyToFallback(request);
			}
		} catch (error) {
			return renderErrorPage(error);
		}
	}
};

export{worker as default};

// ══════ افزونه‌ی Zeus / Alireza (D1، آی‌پی تمیز، لوکیشن) ══════
const ZEUS_KEYS = { settings: "zeus:settings", clean: "zeus:clean", geo: "zeus:geo" };

const ZEUS_DEFAULT_SETTINGS = {
	pinCountry: "", cleanEnabled: true, cleanSource: "https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/zeus-now/zeus/ips.txt", cleanOperator: "all", cleanCount: 20, cleanTtlMin: 360, infoConfigs: false, zeusNames: true, optimizer: false, ech: false, echSni: "cloudflare-ech.com", echDoh: "udp://1.1.1.1", infoTexts: ["⚠️پنل رایگانه+نفروش ک.صصص.کششش⚠️", "🚀پنل توسط Alireza Tune توسعه یافته است🚀"],
};

const ZEUS_FINAL_MASK_JSON = '{"tcp": [{"type": "fragment", "settings": {"packets": "tlshello", "lengths": ["0", "104", "1"], "delays": ["0"], "maxSplit": "0"}},{"type": "fragment", "settings": {"packets": "1-1", "lengths": ["114", "1"], "delays": ["1"], "maxSplit": "11"}}]}';

const ZEUS_CIPHER_SUITES = "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256";

const KV_CACHE = new Map();

function createD1KvStore(db) {
	let ready = null;
	const init = () => ready || (ready = db.prepare("CREATE TABLE IF NOT EXISTS kv_store (k TEXT PRIMARY KEY, v TEXT NOT NULL, updated_at INTEGER)").run().catch((error) => {
		ready = null;
		throw error;
	}));
	return {
		async get(key, opts) {
			let storedValue;
			const cached = KV_CACHE.get(key);
			if (cached && Date.now() - cached.t < 10000) {
				storedValue = cached.v;
			} else {
				await init();
				const row = await db.prepare("SELECT v FROM kv_store WHERE k = ?1").bind(key).first();
				storedValue = row ? row.v : null;
				if (storedValue !== null) {
					KV_CACHE.set(key, { t: Date.now(), v: storedValue });
				}
			}
			if (storedValue === null) {
				return null;
			}
			const type = typeof opts === "string" ? opts : opts && opts.type;
			if (type === "json") {
				try {
					return JSON.parse(storedValue);
				} catch {
					return null;
				}
			}
			return storedValue;
		}, async put(key, text) {
			await init();
			text = String(text);
			await db.prepare("INSERT INTO kv_store (k, v, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(k) DO UPDATE SET v = ?2, updated_at = ?3").bind(key, text, Date.now()).run();
			KV_CACHE.set(key, { t: Date.now(), v: text });
		}, async delete(key) {
			await init();
			await db.prepare("DELETE FROM kv_store WHERE k = ?1").bind(key).run();
			KV_CACHE.set(key, { t: Date.now(), v: null });
		},
	};
}

async function initD1Environment(env, request) {
	const db = env.DB || env.D1 || env.zeus_db;
	const envWithKv = Object.assign({}, env);
	if (db) {
		envWithKv.kv = createD1KvStore(db);
		envWithKv.DB = db;
	} else if (!env.kv) {
		throw new Error("No D1 database is bound. Add a D1 binding named DB.");
	}
	globalThis.__zenv = envWithKv;
	if (typeof EMBEDED_SETTINGS === "undefined") {
		globalThis.EMBEDED_SETTINGS = await bootstrapEmbeddedSettings(envWithKv, request.url);
	}
	return envWithKv;
}

async function bootstrapEmbeddedSettings(env, url) {
	let zeusBoot = await env.kv.get("zeus:boot", { type: "json" });
	if (!zeusBoot) {
		const rnd = (length) => Array.from(crypto.getRandomValues(new Uint8Array(length)), (byte) => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[byte % 62]).join("");
		zeusBoot = { vlUUID: crypto.randomUUID(), trPass: rnd(18) };
		await env.kv.put("zeus:boot", JSON.stringify(zeusBoot));
	}
	const list = (name) => String(env[name] || "").split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
	return {
		accID: env.ACC_ID || "", accEmail: env.ACC_EMAIL || "admin", apiToken: env.API_TOKEN || "", vlUUID: env.VL_UUID || env.UUID || zeusBoot.vlUUID, trPass: env.TR_PASS || zeusBoot.trPass, securePath: env.SECURE_PATH || "admin", proxyIpMode: env.PROXY_IP_MODE || "proxyip", proxyIPs: list("PROXY_IPS"), prefixes: list("PREFIXES"), mainDomain: new URL(url).hostname, fallback: env.FALLBACK || "", dohUrl: env.DOH_URL || "",
	};
}

function parsePinnedCountries(settings) {
	return [...new Set(String(settings.pinCountry || "").toUpperCase().split(/[\s,;]+/).filter((item) => /^[A-Z]{2}$/.test(item)))].slice(0, 8);
}

function getFlagEmoji(countryCode) {
	return /^[A-Z]{2}$/.test(countryCode) ? String.fromCodePoint(...[...countryCode].map((item) => 127397 + item.charCodeAt(0))) : "";
}

async function zeusKvGet(key) {
	const kv = globalThis.__zenv && globalThis.__zenv.kv;
	return kv ? kv.get(key, { type: "json" }) : null;
}

async function zeusKvPut(key, val) {
	await globalThis.__zenv.kv.put(key, JSON.stringify(val));
}

async function getZeusSettings() {
	return { ...ZEUS_DEFAULT_SETTINGS, ...((await zeusKvGet(ZEUS_KEYS.settings)) || {}) };
}

async function buildProxyGeoMap(proxyList, forceRefresh) {
	const key = proxyList.join("|");
	let cached = await zeusKvGet(ZEUS_KEYS.geo);
	if (!forceRefresh && cached && cached.key === key && cached.map && Date.now() - cached.ts < 216e5) {
		return cached;
	}
	const entries = [];
	for (const raw of proxyList) {
		const match = String(raw).trim().match(/^([^:\[\]\s]+)(?::(\d+))?$/);
		if (!match) {
			continue;
		}
		const host = match[1];
		const port = match[2];
		if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)) {
			entries.push({ ip: host, out: port ? `${host}:${port}` : host });
		} else {
			try {
				const domainRecords = await resolveDomainRecords(host, true);
				for (const ip of domainRecords.ipv4.slice(0, 300)) {
					entries.push({ ip, out: port ? `${ip}:${port}` : ip });
				}
			} catch (error) {
				console.log("zeus geo dns", getErrorMessage(error));
			}
		}
	}
	const uniqueEntries = [...new Map(entries.map((entry) => [entry.out, entry])).values()].slice(0, 400);
	let geo = [];
	try {
		geo = await lookupIpsInBatches(uniqueEntries.map((uniqueEntry) => uniqueEntry.ip));
	} catch (error) {
		console.log("zeus geo lookup", getErrorMessage(error));
	}
	const countryByIp = new Map(geo.map((item) => [item.ip, String(item.countryCode || "").toUpperCase()]));
	const geoMap = {};
	for (const entry of uniqueEntries) {
		const countryCode = countryByIp.get(entry.ip);
		if (countryCode) {
			(geoMap[countryCode] || (geoMap[countryCode] = [])).push(entry.out);
		}
	}
	cached = {
		key, ts: Date.now() - (geo.length ? 0 : 21e6), map: geoMap, total: uniqueEntries.length
	};
	await zeusKvPut(ZEUS_KEYS.geo, cached);
	return cached;
}


async function pickProxyIP(proxyList) {
	const rnd = (array) => array[Math.floor(Math.random() * array.length)];
	try {
		const countrySegment = (getRuntimeConfig().pathname || "").split("/")[3] || "";
		const locationProxy = await pickLocationProxy(countrySegment);
		if (locationProxy) {
			return locationProxy;
		}
		const zeusSettings = await getZeusSettings();
		const pins = /^[A-Za-z]{2}$/.test(countrySegment) ? [countrySegment.toUpperCase()] : parsePinnedCountries(zeusSettings);
		if (!pins.length) {
			return rnd(proxyList);
		}
		const proxyGeoMap = await buildProxyGeoMap(proxyList, false);
		const pool = pins.flatMap((pin) => proxyGeoMap.map[pin] || []);
		if (pool.length) {
			return rnd(pool);
		}
		console.log(`zeus: no Proxy IP found for ${pins.join(",")}, using a random one`);
	} catch (error) {
		console.log("zeus pick error", getErrorMessage(error));
	}
	return rnd(proxyList);
}

function parseCleanIpList(text) {
	const valid = (source) => /^(?:\d{1,3}\.){3}\d{1,3}$/.test(source) || /^\[[0-9a-fA-F:]+\]$/.test(source) || /^(?=.{1,253}$)([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(source);
	const ops = {};
	let total = 0;
	for (const block of text.split(/-{5,}/)) {
		let op = "Unknown";
		const ips = [];
		for (let line of block.split("\n")) {
			line = line.trim();
			if (!line || line.startsWith("[source")) {
				continue;
			}
			if (line.includes("#")) {
				const [left, right] = [line.slice(0, line.indexOf("#")).trim(), line.slice(line.indexOf("#") + 1).trim()];
				if (!left) {
					if (right) {
						op = right;
					}
					continue;
				}
				if (valid(left)) {
					ips.push(left);
				}
				continue;
			}
			if (valid(line)) {
				ips.push(line);
			}
		}
		if (ips.length && total < 20000) {
			ops[op] = [...new Set([...(ops[op] || []), ...ips])].slice(0, 5000);
			total += ips.length;
		}
	}
	return ops;
}

async function syncCleanIps(settings) {
	const response = await fetch(settings.cleanSource, { headers: { "cache-control": "no-cache" }, signal: AbortSignal.timeout(6000) });
	if (!response.ok) {
		throw new Error(`Clean IP source answered ${response.status}`);
	}
	const ops = parseCleanIpList(await response.text());
	if (!Object.keys(ops).length) {
		throw new Error("No valid IPs found in the source file");
	}
	const result = { ts: Date.now(), source: settings.cleanSource, ops };
	await zeusKvPut(ZEUS_KEYS.clean, result);
	return result;
}

function selectCleanIps(cleanData, settings) {
	let pool = settings.cleanOperator && settings.cleanOperator !== "all" ? cleanData.ops[settings.cleanOperator] || [] : Object.values(cleanData.ops).flat();
	pool = [...new Set(pool)];
	for (let index = pool.length - 1; index > 0; index--) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
	}
	return pool.slice(0, settings.cleanCount);
}

async function applyCleanIpsToSettings(env) {
	try {
		const zeusSettings = await getZeusSettings();
		if (!zeusSettings.cleanEnabled) {
			return;
		}
		let zeusKvGetResult = await zeusKvGet(ZEUS_KEYS.clean);
		if (!zeusKvGetResult || zeusKvGetResult.source !== zeusSettings.cleanSource || Date.now() - zeusKvGetResult.ts > zeusSettings.cleanTtlMin * 6e4) {
			try {
				zeusKvGetResult = await syncCleanIps(zeusSettings);
			} catch (error) {
				console.log("zeus clean sync", getErrorMessage(error));
			}
		}
		if (!zeusKvGetResult || !zeusKvGetResult.ops) {
			return;
		}
		const ips = selectCleanIps(zeusKvGetResult, zeusSettings);
		if (ips.length) {
			activeSettings.cleanIPs = [...new Set([...ips, ...(activeSettings.cleanIPs || [])])];
		}
	} catch (error) {
		console.log("zeus apply clean", getErrorMessage(error));
	}
}

let CF_USAGE_CACHE = { t: 0, v: null };

async function buildInfoLinks(settings) {
	const host = getRuntimeConfig().hostname;
	const id = getSettings().vlUUID;
	const mk = (remark) => `${VLESS}://${id}@0.0.0.0:1?encryption=none&security=none&type=ws&host=${host}&path=%2F#${encodeURIComponent(remark)}`;
	const out = (settings.infoTexts || []).filter(Boolean).slice(0, 2).map(mk);
	try {
		if (Date.now() - CF_USAGE_CACHE.t > 6e4) {
			const cfUsage = await getCfUsage();
			CF_USAGE_CACHE = { t: Date.now(), v: cfUsage && cfUsage.success ? cfUsage : null };
		}
		const usage = CF_USAGE_CACHE.v;
		if (usage) {
			out.push(mk(`📊 today | ${Number(usage.worker).toLocaleString("en-US")} / 100,000 req`));
		}
	} catch {
	}
	return out;
}

function tuneConfigLink(line, settings) {
	try {
		const url = new URL(line);
		if (url.searchParams.get("security") !== "tls") {
			return line;
		}
		if (settings.optimizer) {
			url.searchParams.set("fragment", "200-3000,1-2");
			url.searchParams.set("fm", ZEUS_FINAL_MASK_JSON);
			url.searchParams.set("cs", ZEUS_CIPHER_SUITES);
		}
		if (settings.ech) {
			url.searchParams.set("ech", `${settings.echSni}+${settings.echDoh}`);
			url.searchParams.set("fp", "chrome");
		}
		return url.href;
	} catch {
		return line;
	}
}

function withCountryPath(link, countryCode) {
	try {
		const url = new URL(link);
		const path = url.searchParams.get("path");
		if (path) {
			const queryIndex = path.indexOf("?");
			const replaced = (queryIndex < 0 ? path : path.slice(0, queryIndex)).replace(/\/[A-Za-z]{2,3}$/, "");
			url.searchParams.set("path", `${replaced}/${countryCode}${queryIndex < 0 ? "" : path.slice(queryIndex)}`);
		}
		return url.href;
	} catch {
		return link;
	}
}

async function resolveLocationTargets(settings) {
	const out = [];
	try {
		const ia = await getLocationSettings();
		for (const iata of ia.locations || []) {
			let countryCode = ((ia.loc_ips || {})[iata] || {}).cc || "";
			if (!countryCode) {
				try {
					countryCode = (await resolveLocationIp(iata, false)).cc || "";
				} catch {
				}
			}
			out.push({ seg: iata, cc: countryCode || "NONE", tag: iata.toLowerCase() });
		}
	} catch (error) {
		console.log("zeus targets", getErrorMessage(error));
	}
	for (const countryCode of parsePinnedCountries(settings)) {
		out.push({ seg: countryCode, cc: countryCode, tag: countryCode.toLowerCase() });
	}
	return out;
}

function expandLinksPerTarget(lines, settings, targets) {
	const pins = targets || [];
	if (!pins.length && !settings.zeusNames) {
		return lines;
	}
	const isLink = (candidate) => /^(vless|trojan):\/\//.test(candidate) && candidate.includes("#");
	const links = lines.filter(isLink);
	const others = lines.filter((line) => !isLink(line));
	const out = [];
	for (const target of pins.length ? pins : [{ seg: "", cc: "NONE", tag: "any" }]) {
		let count = 0;
		const countryCode = target.cc;
		for (const item of links) {
			count++;
			const name = `${countryCode} | ${getFlagEmoji(countryCode)} | zeus-${target.tag}-${count}${item.startsWith("trojan") ? " (Trojan)" : ""}`;
			const base = target.seg ? withCountryPath(item, target.seg) : item;
			out.push(base.slice(0, base.indexOf("#")) + "#" + encodeURIComponent(name));
		}
	}
	return [...out, ...others];
}

async function decorateSubscription(text) {
	try {
		if (/\/alireza\/api\//.test(getRuntimeConfig().pathname || "")) {
			return text;
		}
		const zeusSettings = await getZeusSettings();
		const locationTargets = await resolveLocationTargets(zeusSettings);
		if (!zeusSettings.optimizer && !zeusSettings.ech && !zeusSettings.infoConfigs && !zeusSettings.zeusNames && !locationTargets.length) {
			return text;
		}
		let lines = text.split("\n");
		if (zeusSettings.optimizer || zeusSettings.ech) {
			lines = lines.map((line) => (/^(vless|trojan):\/\//.test(line) ? tuneConfigLink(line, zeusSettings) : line));
		}
		lines = expandLinksPerTarget(lines, zeusSettings, locationTargets);
		if (zeusSettings.infoConfigs) {
			lines = [...(await buildInfoLinks(zeusSettings)), ...lines];
		}
		return lines.join("\n");
	} catch (error) {
		console.log("zeus decorate", getErrorMessage(error));
		return text;
	}
}

async function buildNoFilterLinks(settings) {
	const settings2 = getSettings();
	const host = getRuntimeConfig().hostname;
	const id = settings2.vlUUID;
	const pins = await resolveLocationTargets(settings);
	const pool = activeSettings.cleanIPs && activeSettings.cleanIPs.length ? activeSettings.cleanIPs : [host];
	const port = (settings2.ports || []).find((item) => settings2.httpsPorts.includes(item)) || 443;
	const defs = [{ n: 1, hard: false, ech: true }, { n: 2, hard: true, ech: true }, { n: 3, hard: false, ech: false }, { n: 4, hard: true, ech: false },];
	const links = [];
	for (const target of pins.length ? pins : [{ seg: "", cc: "", tag: "any" }]) {
		const countryCode = target.cc === "NONE" ? "" : target.cc;
		const seg = target.seg;
		for (const domain of defs) {
			const url = new URL(`${VLESS}://config`);
			url.username = id;
			url.hostname = pool[links.length % pool.length];
			url.port = String(port);
			const sp = url.searchParams;
			sp.append("encryption", "none");
			sp.append("host", host);
			sp.append("type", "ws");
			sp.append("security", "tls");
			sp.append("path", `${buildWebSocketPath(VLESS)}${seg ? "/" + seg : ""}?ed=2560`);
			sp.append("sni", host);
			sp.append("fp", domain.ech ? "chrome" : settings2.fingerprint);
			sp.append("alpn", "http/1.1");
			sp.append("fragment", domain.hard ? "50-200,1-3" : "200-3000,1-2");
			if (domain.ech) {
				sp.append("ech", `${settings.echSni}+${settings.echDoh}`);
			} else {
				sp.append("fm", ZEUS_FINAL_MASK_JSON);
				sp.append("cs", ZEUS_CIPHER_SUITES);
			}
			url.hash = `${countryCode || "NONE"} | ${getFlagEmoji(countryCode)} | ${domain.hard ? "Hard-" : ""}zeus-${target.tag}-${domain.n}`;
			links.push(url.href);
		}
	}
	return links;
}

async function requireAuth(request, env, isPage) {
	const { securePath } = getRuntimeConfig();
	const pwd = await env.kv.get("pwd");
	if (!pwd) {
		if (isPage) {
			return Response.redirect(new URL(`/${securePath}/panel`, request.url), 302);
		}
		return jsonResponse(false, 401, "Set the panel password first (BPB panel).");
	}
	if (await isAuthenticated(request, env)) {
		return null;
	}
	if (isPage) {
		return Response.redirect(new URL(`/${securePath}/login`, request.url), 302);
	}
	return jsonResponse(false, 401, "Unauthorized or expired session.");
}

async function handleZeusRoutes(request, env) {
	const { pathname, securePath } = getRuntimeConfig();
	const sub = pathname.split("/").slice(3).join("/").replace(/\/+$/, "");
	const gate = await requireAuth(request, env, !sub && request.method === "GET");
	if (gate) {
		return gate;
	}
	try {
		if (!sub && request.method === "GET") {
			const html = ZEUS_HTML_CONTENT.replaceAll("__ICON__", ICON_CONTENT);
			return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
		}
		await loadSettingsAndWarp(env);
		switch (sub) {
			case "api/state": {
				const zeusSettings = await getZeusSettings();
				const clean = await zeusKvGet(ZEUS_KEYS.clean);
				const geo = await zeusKvGet(ZEUS_KEYS.geo);
				const cnt = (input) => Object.fromEntries(Object.entries(input).map(([key, value]) => [key, value.length]));
				return jsonResponse(true, 200, "", {
					settings: zeusSettings, host: getRuntimeConfig().hostname, clean: clean ? { ts: clean.ts, source: clean.source, ops: cnt(clean.ops) } : null, geo: geo ? { ts: geo.ts, total: geo.total, countries: cnt(geo.map) } : null,
				});
			}
			case "api/save": {
				if (request.method !== "POST") {
					return jsonResponse(false, 405, "Method not allowed.");
				}
				const data = await request.json();
				const cur = await getZeusSettings();
				const result = { ...cur };
				if (data.pinCountry !== undefined) {
					const parts = String(data.pinCountry).toUpperCase().split(/[\s,;]+/).filter(Boolean);
					if (parts.some((part) => !/^[A-Z]{2}$/.test(part))) {
						return jsonResponse(false, 400, "Countries must be 2-letter codes separated by comma (e.g. FR,NL) or empty.");
					}
					result.pinCountry = [...new Set(parts)].slice(0, 8).join(",");
				}
				if (data.cleanSource !== undefined) {
					if (!/^https?:\/\/[^\s"'<>\\]{4,300}$/i.test(String(data.cleanSource))) {
						return jsonResponse(false, 400, "Invalid clean IP source URL.");
					}
					result.cleanSource = String(data.cleanSource);
				}
				if (data.cleanOperator !== undefined) {
					result.cleanOperator = String(data.cleanOperator).slice(0, 64) || "all";
				}
				if (data.cleanCount !== undefined) {
					result.cleanCount = Math.min(200, Math.max(1, parseInt(data.cleanCount) || 20));
				}
				if (data.cleanTtlMin !== undefined) {
					result.cleanTtlMin = Math.min(10080, Math.max(5, parseInt(data.cleanTtlMin) || 360));
				}
				for (const value of ["cleanEnabled", "infoConfigs", "optimizer", "ech", "zeusNames"]) {
					if (data[value] !== undefined) {
						result[value] = !!data[value];
					}
				}
				if (data.echSni !== undefined) {
					if (!/^[A-Za-z0-9]([A-Za-z0-9.-]{0,251}[A-Za-z0-9])?$/.test(String(data.echSni))) {
						return jsonResponse(false, 400, "Invalid ECH SNI.");
					}
					result.echSni = String(data.echSni);
				}
				if (data.echDoh !== undefined) {
					if (!/^(udp|tcp|https|tls):\/\/[^\s"'<>\\+]{1,200}$/i.test(String(data.echDoh))) {
						return jsonResponse(false, 400, "Invalid ECH DoH (e.g. udp://1.1.1.1).");
					}
					result.echDoh = String(data.echDoh);
				}
				if (Array.isArray(data.infoTexts)) {
					result.infoTexts = data.infoTexts.map((infoText) => String(infoText).slice(0, 120)).slice(0, 2);
				}
				await zeusKvPut(ZEUS_KEYS.settings, result);
				return jsonResponse(true, 200, "Saved.", result);
			}
			case "api/sync-clean": {
				if (request.method !== "POST") {
					return jsonResponse(false, 405, "Method not allowed.");
				}
				const syncCleanIpsResult = await syncCleanIps(await getZeusSettings());
				return jsonResponse(true, 200, "Synced.", { ts: syncCleanIpsResult.ts, source: syncCleanIpsResult.source, ops: Object.fromEntries(Object.entries(syncCleanIpsResult.ops).map(([key, value]) => [key, value.length])) });
			}
			case "api/refresh-geo": {
				if (request.method !== "POST") {
					return jsonResponse(false, 405, "Method not allowed.");
				}
				const proxyGeoMap = await buildProxyGeoMap(getRuntimeConfig().proxyIPs, true);
				return jsonResponse(true, 200, "Refreshed.", { ts: proxyGeoMap.ts, total: proxyGeoMap.total, countries: Object.fromEntries(Object.entries(proxyGeoMap.map).map(([key, value]) => [key, value.length])) });
			}
			case "api/nofilter": {
				const links = await buildNoFilterLinks(await getZeusSettings());
				return jsonResponse(true, 200, "", { links, text: links.join("\n") });
			}
			case "api/all": {
				const raw = decodeBase64Utf8(await (await getRawSubscription()).text());
				const links = await buildNoFilterLinks(await getZeusSettings());
				return jsonResponse(true, 200, "", { text: `${raw.trim()}\n${links.join("\n")}`.trim() });
			}
			default: return proxyToFallback(request);
		}
	} catch (err) {
		return jsonResponse(false, 500, getErrorMessage(err));
	}
}

const LOCATION_DEFAULT_SETTINGS = {
	locations: [], loc_family: "auto", loc_source: "{iata}.proxyip.cmliussss.net", loc_ips: {}
};

const LOCATION_SETTINGS_KEY = "zeus:iata";

let LOCATIONS_CACHE = { t: 0, v: null };

const hashString = (text) => {
	let hash = 2166136261;
	for (let index = 0; index < text.length; index++) {
		hash ^= text.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
};

async function getLocationSettings() {
	return { ...LOCATION_DEFAULT_SETTINGS, ...((await zeusKvGet(LOCATION_SETTINGS_KEY)) || {}) };
}

async function fetchLocations() {
	if (LOCATIONS_CACHE.v && Date.now() - LOCATIONS_CACHE.t < 432e5) {
		return LOCATIONS_CACHE.v;
	}
	try {
		const response = await fetch("https://speed.cloudflare.com/locations", { headers: { Referer: "https://speed.cloudflare.com/" }, signal: AbortSignal.timeout(8000) });
		if (!response.ok) {
			throw new Error("status " + response.status);
		}
		const list = (await response.json()).filter((item) => item && item.iata && item.city).map((item) => ({
			iata: String(item.iata).toUpperCase(), city: item.city || "", cca2: String(item.cca2 || "").toUpperCase(), region: item.region || ""
		}));
		if (list.length) {
			LOCATIONS_CACHE = { t: Date.now(), v: list };
		}
	} catch (error) {
		console.log("zeus colos", getErrorMessage(error));
	}
	return LOCATIONS_CACHE.v || [];
}

async function dohQuery(name, type) {
	try {
		const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(5000) });
		if (!response.ok) {
			return [];
		}
		const data = await response.json();
		return (data.Answer || []).filter((item) => item.type === (type === "AAAA" ? 28 : 1)).map((item) => item.data);
	} catch {
		return [];
	}
}

async function resolveLocationIp(iata, force) {
	iata = String(iata).toUpperCase();
	const locationSettings = await getLocationSettings();
	const cur = (locationSettings.loc_ips || {})[iata];
	if (!force && cur && (cur.v4.length || cur.v6.length) && Date.now() - cur.ts < 7 * 864e5) {
		return cur;
	}
	const host = String(locationSettings.loc_source || LOCATION_DEFAULT_SETTINGS.loc_source).replace("{iata}", iata.toLowerCase());
	const [v4, v6] = await Promise.all([dohQuery(host, "A"), dohQuery(host, "AAAA")]);
	const colo = (await fetchLocations()).find((item) => item.iata === iata);
	const rec = {
		ts: Date.now(), cc: (colo && colo.cca2) || (cur && cur.cc) || "", city: (colo && colo.city) || (cur && cur.city) || "", v4: [...new Set(v4)], v6: [...new Set(v6)]
	};
	if (!rec.v4.length && !rec.v6.length && cur) {
		return cur;
	}
	await zeusKvPut(LOCATION_SETTINGS_KEY, { ...locationSettings, loc_ips: { ...(locationSettings.loc_ips || {}), [iata]: rec } });
	return rec;
}

function orderLocationRecords(rec, seed, family) {
	const v4 = rec.v4 || [];
	const v6 = rec.v6 || [];
	let list;
	if (family === "v4") {
		list = v4.length ? v4 : v6;
	} else if (family === "v6") {
		list = v6.length ? v6 : v4;
	} else if (family === "both") {
		list = [...v4, ...v6];
	} else {
		list = v4.length ? [...v4, ...v6] : v6;
	}
	if (!list.length) {
		return [];
	}
	return list.map((ip) => (ip.includes(":") ? `[${ip}]` : ip));
}

async function pickLocationProxy(seg) {
	try {
		const locationSettings = await getLocationSettings();
		const iata = /^[A-Za-z]{3}$/.test(seg) ? seg.toUpperCase() : seg ? "" : (locationSettings.locations || [])[0];
		if (!iata) {
			return null;
		}
		const order = orderLocationRecords(await resolveLocationIp(iata, false), "main" + iata, locationSettings.loc_family);
		return order.length ? { host: order[0], port: undefined } : null;
	} catch (error) {
		console.log("zeus iata pick", getErrorMessage(error));
		return null;
	}
}

const SAVED_CONFIGS_KEY = "alireza:configs";

const SAVED_CONFIGS_META_KEY = "alireza:configs:meta";

async function getSavedConfigs() {
	const kv = globalThis.__zenv.kv;
	const text = (await kv.get(SAVED_CONFIGS_KEY)) || "";
	const meta = (await kv.get(SAVED_CONFIGS_META_KEY, { type: "json" })) || {};
	return {
		text, count: text ? text.split("\n").filter(Boolean).length : 0, ts: meta.ts || 0, locations: meta.locations || [], optimizer: !!meta.optimizer, ech: !!meta.ech
	};
}

async function generateLocationConfigs(options, body) {
	const locationSettings = await getLocationSettings();
	const zs = await getZeusSettings();
	const locs = [...new Set((Array.isArray(body.locations) ? body.locations : locationSettings.locations || []).map((item) => String(item).trim().toUpperCase()).filter(Boolean))];
	if (locs.length > 8 || locs.some((loc) => !/^[A-Z]{3}$/.test(loc))) {
		throw new Error("Locations must be 3-letter IATA codes (max 8).");
	}
	const optimizer = body.optimizer !== undefined ? !!body.optimizer : !!zs.optimizer;
	const ech = body.ech !== undefined ? !!body.ech : !!zs.ech;
	await loadSettingsAndWarp(options);
	const raw = decodeBase64Utf8(await (await getRawSubscription()).text());
	const base = raw.split("\n").map((item) => item.trim()).filter((item) => /^(vless|trojan):\/\//.test(item) && item.includes("#"));
	if (!base.length) {
		throw new Error("BPB did not return any config.");
	}
	const tune = (entry) => (optimizer || ech ? tuneConfigLink(entry, { ...zs, optimizer, ech }) : entry);
	const out = [];
	if (!locs.length) {
		for (const configLine of base) {
			out.push(tune(configLine));
		}
	}
	for (const iata of locs) {
		const rec = await resolveLocationIp(iata, false);
		if (!(rec.v4 || []).length && !(rec.v6 || []).length) {
			throw new Error(`${iata}: no active IP for this location, pick another one.`);
		}
		const countryCode = rec.cc || "NONE";
		let count = 0;
		for (const value of base) {
			count++;
			const link = tune(withCountryPath(value, iata));
			out.push(link.slice(0, link.indexOf("#")) + "#" + encodeURIComponent(`${countryCode} | ${countryCode === "NONE" ? "" : getFlagEmoji(countryCode)} | alireza-${iata.toLowerCase()}-${count}${value.startsWith("trojan") ? " (Trojan)" : ""}`));
		}
	}
	const text = out.join("\n");
	const kv = globalThis.__zenv.kv;
	await kv.put(SAVED_CONFIGS_KEY, text);
	await kv.put(SAVED_CONFIGS_META_KEY, JSON.stringify({
		ts: Date.now(), locations: locs, optimizer, ech
	}));
	return getSavedConfigs();
}

async function handleAlirezaRoutes(request, env) {
	const { pathname, securePath } = getRuntimeConfig();
	const parts = pathname.split("/").slice(3).filter(Boolean);
	const gate = await requireAuth(request, env, !parts.length && request.method === "GET");
	if (gate) {
		return gate;
	}
	try {
		if (!parts.length && request.method === "GET") {
			const html = ALIREZA_HTML_CONTENT.replaceAll("__ICON__", ICON_CONTENT);
			return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
		}
		if (parts[0] !== "api") {
			return proxyToFallback(request);
		}
		const res = parts[1];
		const id = parts[2];
		const body = request.method === "POST" || request.method === "PUT" ? await request.json().catch(() => ({})) : {};
		const locationSettings = await getLocationSettings();
		const zs = await getZeusSettings();
		const sum = (item) => (item ? { ts: item.ts, source: item.source, ops: Object.fromEntries(Object.entries(item.ops).map(([key, value]) => [key, value.length])) } : null);
		if (res === "state") {
			const loc = {};
			for (const [key, value] of Object.entries(locationSettings.loc_ips || {})) {
				loc[key] = {
					cc: value.cc, city: value.city, v4: value.v4.length, v6: value.v6.length, ts: value.ts, first: value.v4[0] || value.v6[0] || ""
				};
			}
			return jsonResponse(true, 200, "", {
				host: getRuntimeConfig().hostname, securePath, settings: {
					...locationSettings, loc_ips: undefined, clean_enabled: zs.cleanEnabled, clean_source: zs.cleanSource, clean_ttl_min: zs.cleanTtlMin, info_configs: zs.infoConfigs, patterniha_all: zs.optimizer, patterniha_ech_all: zs.ech, ech_sni: zs.echSni, ech_doh: zs.echDoh, info_texts: zs.infoTexts, cache_min: 5
				}, stats: {
					users: 0, active: 0, online: 0, used_gb: 0
				}, usage: null, clean: sum(await zeusKvGet(ZEUS_KEYS.clean)), loc_ips: loc,
			});
		}
		if (res === "users") {
			return jsonResponse(true, 200, "", []);
		}
		if (res === "settings" && request.method === "POST") {
			const result = { ...locationSettings };
			if (body.locations !== undefined) {
				const list = [...new Set((Array.isArray(body.locations) ? body.locations : []).map((item) => String(item).trim().toUpperCase()).filter(Boolean))];
				if (list.length > 8 || list.some((item) => !/^[A-Z]{3}$/.test(item))) {
					return jsonResponse(false, 400, "Locations must be 3-letter IATA codes (max 8).");
				}
				result.locations = list;
			}
			if (body.loc_family !== undefined) {
				if (!["auto", "v4", "v6", "both"].includes(body.loc_family)) {
					return jsonResponse(false, 400, "Invalid IP family.");
				}
				result.loc_family = body.loc_family;
			}
			if (body.loc_source !== undefined) {
				const trimmed = String(body.loc_source).trim();
				if (!trimmed.includes("{iata}") || !/^[A-Za-z0-9.{}-]{4,200}$/.test(trimmed)) {
					return jsonResponse(false, 400, "Location source must contain {iata}.");
				}
				result.loc_source = trimmed;
			}
			const zn2 = { ...zs };
			if (body.clean_enabled !== undefined) {
				zn2.cleanEnabled = !!body.clean_enabled;
			}
			if (body.clean_source !== undefined) {
				if (!/^https?:\/\/[^\s"'<>\\]{4,300}$/i.test(String(body.clean_source))) {
					return jsonResponse(false, 400, "Invalid clean IP source URL.");
				}
				zn2.cleanSource = String(body.clean_source);
			}
			if (body.clean_ttl_min !== undefined) {
				zn2.cleanTtlMin = Math.min(10080, Math.max(5, parseInt(body.clean_ttl_min) || 360));
			}
			for (const [key, value] of [["info_configs", "infoConfigs"], ["patterniha_all", "optimizer"], ["patterniha_ech_all", "ech"]]) {
				if (body[key] !== undefined) {
					zn2[value] = !!body[key];
				}
			}
			if (body.ech_sni !== undefined && /^[A-Za-z0-9]([A-Za-z0-9.-]{0,251}[A-Za-z0-9])?$/.test(String(body.ech_sni))) {
				zn2.echSni = String(body.ech_sni);
			}
			if (body.ech_doh !== undefined && /^(udp|tcp|https|tls):\/\/[^\s"'<>\\+]{1,200}$/i.test(String(body.ech_doh))) {
				zn2.echDoh = String(body.ech_doh);
			}
			if (Array.isArray(body.info_texts)) {
				zn2.infoTexts = body.info_texts.map((info_text) => String(info_text).slice(0, 120)).slice(0, 2);
			}
			await zeusKvPut(ZEUS_KEYS.settings, zn2);
			await zeusKvPut(LOCATION_SETTINGS_KEY, result);
			for (const value of result.locations) {
				try {
					await resolveLocationIp(value, false);
				} catch {
				}
			}
			return jsonResponse(true, 200, "Saved.");
		}
		if (res === "locations") {
			if (id === "resolve") {
				const iata = String(body.iata || "").toUpperCase();
				if (!/^[A-Z]{3}$/.test(iata)) {
					return jsonResponse(false, 400, "Invalid IATA code.");
				}
				return jsonResponse(true, 200, "", { iata, ...(await resolveLocationIp(iata, !!body.force)) });
			}
			const colos = await fetchLocations();
			if (!colos.length) {
				return jsonResponse(false, 502, "Could not load the Cloudflare location list (speed.cloudflare.com/locations).");
			}
			return jsonResponse(true, 200, "", { colos });
		}
		if (res === "configs") {
			if (id === "generate" && request.method === "POST") {
				return jsonResponse(true, 200, "Saved.", await generateLocationConfigs(env, body));
			}
			if (id === "clear" && request.method === "POST") {
				await env.kv.delete(SAVED_CONFIGS_KEY);
				await env.kv.delete(SAVED_CONFIGS_META_KEY);
				return jsonResponse(true, 200, "Deleted.", await getSavedConfigs());
			}
			return jsonResponse(true, 200, "", await getSavedConfigs());
		}
		if (res === "clean") {
			if (id === "sync" && request.method === "POST") {
				return jsonResponse(true, 200, "", sum(await syncCleanIps(await getZeusSettings())));
			}
			let zeusKvGetResult = await zeusKvGet(ZEUS_KEYS.clean);
			if (id === "ips") {
				if (!zeusKvGetResult || zeusKvGetResult.source !== zs.cleanSource) {
					zeusKvGetResult = await syncCleanIps(zs);
				}
				const url = new URL(request.url);
				const op = url.searchParams.get("operator") || "all";
				const value = Math.min(200, Math.max(1, parseInt(url.searchParams.get("count")) || 15));
				return jsonResponse(true, 200, "", { ips: selectCleanIps(zeusKvGetResult, { cleanOperator: op, cleanCount: value }), ...sum(zeusKvGetResult) });
			}
			return jsonResponse(true, 200, "", sum(zeusKvGetResult));
		}
		return jsonResponse(false, 404, "Not available yet.");
	} catch (err) {
		return jsonResponse(false, 500, getErrorMessage(err));
	}
}

// ══════ صفحه‌های HTML (قبلاً gzip+base64 بودن) ══════

// ── پنل اصلی ──
const PANEL_HTML_CONTENT = `<!DOCTYPE html>
<html lang=en>
	<head>
		<meta charset=UTF-8>
		<meta name=viewport content="width=device-width,initial-scale=1"><title>BPB Panel v5.1.1</title>
		<link id=favicon rel=icon type=image/x-icon href=data:image/x-icon;base64,__ICON__>
		<link rel=preconnect href=https://fonts.googleapis.com>
		<link rel=preconnect href=https://fonts.gstatic.com crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel=stylesheet>
		<link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=add_circle,autorenew,cancel,check_circle,clock_loader_40,close,cloud_download,cloud_upload,code_xml,content_copy,dashboard,data_usage,delete,dns,download,draft,error,fingerprint,help,info,key_vertical,keyboard_arrow_down,link,logout,open_in_new,qr_code,refresh,save,settings,settings_backup_restore,share,smart_toy,terminal,tune,upgrade,upload,verified,visibility,visibility_off&display=block">
		<link id=favicon rel=icon type=image/x-icon href=data:image/x-icon;base64,__ICON__>
<style>
	:root {
		--color-bg-main: linear-gradient(90deg, #000328, #00458E);
		--color-bg-card: rgba(15, 23, 42, 0.5);
		--color-bg-input: #02061780;
		--color-bg-modal: #08244b;
		--color-bg-btn: #3b82f629;
		--color-border-ui: #334155;
		--color-border-accent: color-mix(in srgb, var(--color-brand-hover), transparent 79%);
		--color-icon-green: #3fb950;
		--color-icon-red: rgb(232, 20, 3);
		--color-text-primary: #f1f5f9;
		--color-text-secondary: #aec4e2;
		--color-text-muted: #64748b;
		--color-text-btn: #a5ccfc;
		--color-brand-primary: #3b82f6;
		--color-brand-hover: #60a5fa;
		--color-brand-light-focus: rgba(147, 197, 253, 0.5);
		--radius-card: 1.5rem;
		--radius-ui: 0.75rem;
		--radius-btn: 1rem;
		--space-xs: 0.25rem;
		--space-sm: 0.5rem;
		--space-md: 0.85rem;
		--space-lg: 1rem;
		--space-xl: 1.5rem;
		--font-size-xs: 0.75rem;
		--font-size-sm: 0.875rem;
		--font-size-base: 1rem;
		--font-size-lg: 1.7rem;
		--font-size-xlg: 2rem;
		--line-height-xs: 1rem;
		--line-height-sm: 1.25rem;
		--line-height-lg: 2rem;
		--shadow-header: 0.125rem 0.125rem 0.25rem #000328;
		--shadow-icon: 0.125rem 0.125rem 0.2rem #000328;
		--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.2),0 20px 40px -15px rgba(0, 3, 40, 0.5),0 35px 60px -15px rgba(0, 69, 142, 0.3);
		--shadow-input: inset 0 2px 4px rgba(0, 0, 0, 0.3),0 1px 2px rgba(255, 255, 255, 0.05);
		--shadow-input-focus: 0 0 0 3px rgba(59, 130, 246, 0.4),0 8px 20px -4px rgba(59, 130, 246, 0.3);
		--transition-standard:all 0.25s cubic-bezier(0.4, 0, 0.2, 1)
	}
	body {
		font-family: "Twemoji Country Flags",Ubuntu,system-ui;
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background:var(--color-bg-main)
	}
	body.is-loading {
		cursor:wait
	}
	body.is-loading * {
		cursor: wait!important;
		pointer-events:none
	}
	*, ::after, ::before {
		box-sizing:border-box
	}
	h1 {
		color: var(--color-text-primary);
		text-shadow: var(--shadow-header);
		display: flex;
		justify-content: center;
		gap: var(--space-sm);
		font-size: var(--font-size-lg);
		margin:0
	}
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-xl) 0;
		gap:var(--space-xl)
	}
	.header-title {
		display: flex;
		align-items: center;
		justify-content:center
	}
	.panel-version {
		align-self: flex-start;
		font-size:large
	}
	h2, h3 {
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		gap: 6px;
		color: var(--color-text-primary);
		text-shadow:var(--shadow-header)
	}
	h2 {
		margin-top:0
	}
	h4 {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-sm);
		color: var(--color-text-primary);
		margin: 0;
		text-shadow:var(--shadow-header)
	}
	.dashboard-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height:var(--line-height-lg)
	}
	.dashboard-action {
		display: flex;
		justify-content: space-between;
		align-items:center
	}
	.dashboard-action span {
		color: var(--color-text-secondary);
		gap:var(--space-sm)
	}
	.dashboard-action .button {
		width:7rem
	}
	.dashboard-info .material-symbols-rounded {
		color: var(--color-brand-primary);
		padding-right:var(--space-sm)
	}
	.dashboard-info span {
		text-align:left
	}
	.separator {
		color:var(--color-brand-hover)
	}
	#panel-usage, #total-usage {
		width: fit-content;
		white-space:nowrap
	}
	.header-container {
		gap: 6px;
		display: flex;
		justify-content:center
	}
	.header-container h3 {
		display: flex;
		justify-content:center
	}
	.container {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-card);
		padding: var(--space-xl);
		color: var(--color-text-primary);
		background: color-mix(in srgb,var(--color-bg-card),#000328 8%);
		box-shadow:0 0 0 1px rgba(255,255,255,.04),0 2px 6px rgba(0,0,0,.06),0 12px 30px rgba(0,0,0,.08)
	}
	.section .container {
		gap:var(--space-md)
	}
	.section.container h3 {
		color: var(--color-text-secondary);
		margin:0
	}
	.container>.section {
		margin:0
	}
	.inner-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		border-radius: var(--radius-ui);
		padding: var(--space-xl);
		background: color-mix(in srgb,var(--color-bg-card),#000328 15%);
		box-shadow:0 0 0 1px rgba(255,255,255,.04),0 2px 6px rgba(0,0,0,.06),0 12px 30px rgba(0,0,0,.08)
	}
	.form-container {
		max-width: 95%;
		margin: 0 auto var(--space-xl) auto;
		background-color: var(--color-bg-card);
		border: 1px solid var(--color-border-accent);
		border-radius: var(--radius-card);
		padding: var(--space-xl);
		box-shadow:var(--shadow-card)
	}
	.configForm {
		display: flex;
		flex-direction:column
	}
	.section {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin:var(--space-md) 0
	}
	.section.dashboard {
		padding-bottom: var(--space-md);
		border-bottom:1px solid var(--color-border-accent)
	}
	.form-control {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap:10px
	}
	.modal-form-control {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		gap:10px
	}
	.form-control div {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		width:100%
	}
	label {
		display:block
	}
	.form-control label, .form-control>span, .modal-form-control label {
		color: var(--color-text-secondary);
		align-items: center;
		flex: 1;
		text-align: left;
		width:100%
	}
	div.checkbox-wrapper label {
		color: var(--color-text-primary);
		display: inline-block;
		text-align: left;
		font-weight: 400;
		font-size: 100%;
		white-space:nowrap
	}
	.proto label {
		width: unset;
		flex:unset
	}
	.material-symbols-rounded {
		vertical-align: middle;
		display: inline-block;
		text-shadow: var(--shadow-icon);
		transition: scale .2s ease;
		font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24
	}
	.value-container .material-symbols-rounded {
		color: var(--color-brand-primary);
		font-size: var(--font-size-lg);
		cursor:pointer
	}
	.material-symbols-rounded.cw-spinning {
		animation:spin-cw 1s linear infinite
	}
	.material-symbols-rounded.ccw-spinning {
		animation:spin-ccw 1s linear infinite
	}
	@keyframes spin-cw {
		from {
			transform:rotate(0)
		}
		to {
			transform:rotate(360deg)
		}
	}
	@keyframes spin-ccw {
		from {
			transform:rotate(0)
		}
		to {
			transform:rotate(-360deg)
		}
	}
	table button span.material-symbols-rounded {
		font-size: var(--font-size-lg);
		margin: 0;
		color:var(--color-brand-primary)
	}
	table td div span.material-symbols-rounded {
		color:var(--color-brand-primary)
	}
	a {
		color:var(--color-brand-primary)
	}
	a:hover {
		color:var(--color-brand-hover)
	}
	a .material-symbols-rounded {
		color:var(--color-brand-primary)
	}
	label>.material-symbols-rounded, span>.material-symbols-rounded {
		color: var(--color-brand-primary);
		cursor: pointer;
		padding-left:var(--space-xs)
	}
	.refresh-geo-location .material-symbols-rounded:hover, .svg-btn .material-symbols-rounded:hover, a .material-symbols-rounded:hover, label>.material-symbols-rounded:hover, span>.material-symbols-rounded:hover, table button .material-symbols-rounded:hover {
		scale: 1.2;
		color:var(--color-brand-hover)
	}
	a.url {
		width: unset;
		color: var(--color-brand-primary);
		text-decoration:none
	}
	.form-control.apply {
		flex-wrap: wrap;
		flex-direction: row;
		padding: var(--space-xl) 0 0;
		gap: var(--space-md);
		justify-content: center;
		flex:unset
	}
	.select-wrapper {
		display: flex;
		position: relative;
		flex: 1;
		align-items: center;
		width:100%
	}
	.select-wrapper span:last-child {
		position: absolute;
		right: 6px;
		pointer-events:none
	}
	.min-max span {
		text-align: center;
		white-space:pre
	}
	.panel-settings span {
		font-size:var(--font-size-xlg)
	}
	.github-container span {
		font-size: var(--font-size-xlg);
		color:#fff
	}
	.refresh-geo-location {
		background: 0 0;
		margin-bottom: 20px;
		border: none;
		cursor: pointer;
		color:var(--color-brand-primary)
	}
	.show-hide {
		position: absolute;
		top: 50%;
		right: 10px;
		transform: translateY(-50%);
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		color: var(--color-text-muted);
		padding-left: 5px;
		text-shadow:none
	}
	div.checkbox-wrapper {
		display: flex;
		flex: 0 0 calc(50% - 8px);
		gap: 8px;
		align-items: center;
		justify-content:flex-start
	}
	div.checkbox-container {
		display: flex;
		justify-content: flex-start;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 16px;
		width:100%
	}
	input[type=number], input[type=password], input[type=text], input[type=url], select, textarea {
		width: 100%;
		text-align: center;
		padding: 10px;
		line-height: 1.5;
		background-color: var(--color-bg-input);
		border: none;
		border-radius: var(--radius-ui);
		outline: 0;
		color: var(--color-text-primary);
		font-size: var(--font-size-base);
		font-family: inherit;
		box-shadow: var(--shadow-input);
		transition:var(--transition-standard)
	}
	input[type=number]:focus, input[type=password]:focus, input[type=text]:focus, input[type=url]:focus, select:focus, textarea:focus {
		outline: 0;
		box-shadow:var(--shadow-input-focus)
	}
	input[type=number]:read-only, input[type=text]:read-only, input[type=url]:read-only, textarea:read-only {
		color: gray;
		background-color:var(--color-bg-card)
	}
	textarea {
		font-family: inherit;
		scrollbar-color: #ccc transparent;
		scrollbar-width: thin;
		resize: none;
		max-height:calc(5lh + 10px)
	}
	select {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance:none
	}
	.protocols {
		flex-direction: row;
		flex-wrap:wrap
	}
	.proto {
		gap: 8px;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content:center
	}
	.min-max {
		flex: 1;
		width: 100%;
		display: flex;
		align-items: center;
		gap:var(--space-sm)
	}
	.min-max input {
		width:100%
	}
	.ports-block th {
		white-space: nowrap;
		background-color:gray
	}
	.ports-block td:first-child {
		text-align: center;
		font-size:larger
	}
	.ports-block td:last-child {
		display: grid;
		grid-template-columns:1fr 1fr 1fr 1fr
	}
	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		justify-self: center;
		gap: 4px;
		width: max-content;
		white-space: nowrap;
		padding: var(--space-md);
		font-family: inherit;
		font-size: var(--font-size-base);
		font-weight: 500;
		border: 1px solid var(--color-border-accent);
		border-radius: var(--radius-btn);
		color: var(--color-text-btn);
		background: var(--color-bg-btn);
		cursor: pointer;
		outline: 0;
		box-shadow: 0 5px 10px rgba(0,0,0,.2);
		transition:all .3s ease
	}
	.button.delete {
		color: rgb(246 104 92);
		background: rgb(232 20 3 / 21%);
		border:1px solid rgb(232 20 3 / 26%)
	}
	.button .material-symbols-rounded {
		text-shadow: none;
		color:var(--color-brand-primary)
	}
	.button.delete .material-symbols-rounded {
		text-shadow: none;
		color:var(--color-icon-red)
	}
	.button:disabled {
		background: 0 0;
		color: var(--color-text-muted);
		border: 1px solid var(--color-text-muted);
		cursor: not-allowed;
		box-shadow: none;
		pointer-events:none
	}
	.button.delete:disabled span, .button:disabled span {
		color:var(--color-text-muted)
	}
	.button:hover {
		background-color: var(--color-brand-primary);
		box-shadow: 0 8px 15px rgba(0,0,0,.3);
		transform: translateY(-2px);
		color:var(--color-text-primary)
	}
	.button.delete:hover {
		background-color: var(--color-icon-red);
		color:var(--color-text-primary)
	}
	.button.delete:hover span, .button:hover span {
		color:var(--color-text-primary)
	}
	.button:active {
		transform: translateY(1px);
		box-shadow:0 3px 7px rgba(0,0,0,.3)
	}
	.svg-btn, table button {
		margin-top: auto;
		margin-bottom: auto;
		max-height: fit-content;
		font-size: 16px;
		font-weight: 600;
		border: none;
		background-color: unset;
		cursor: pointer;
		padding: 0;
		transition:scale .2s ease
	}
	table button:active {
		transform:translateY(1px)
	}
	.apply .button {
		padding:var(--space-lg)
	}
	.panel-settings {
		flex: unset;
		border: none;
		cursor: pointer;
		width: fit-content;
		margin: 0;
		background: 0 0;
		color: var(--color-brand-primary);
		transition:scale .2s ease
	}
	.panel-settings:hover {
		scale: 1.2;
		color:var(--color-brand-hover)
	}
	.panel-settings:disabled {
		color: var(--color-text-muted);
		cursor:default
	}
	.accordion-item {
		position: relative;
		border-bottom:1px solid var(--color-border-accent)
	}
	#subscriptions .accordion-item:last-child, #telegramForm .accordion-item:last-child {
		border:none
	}
	.help-icon {
		position: absolute;
		top: 1em;
		right: 0;
		display: inline-flex;
		align-items: center;
		z-index: 1;
		text-decoration:none
	}
	.help-icon span, .refresh-geo-location span {
		font-size:var(--font-size-lg)
	}
	summary {
		position: relative;
		font-weight: 700;
		cursor: pointer;
		text-align: left;
		white-space:nowrap
	}
	summary::-webkit-details-marker, summary::marker {
		font-size: 1.3rem;
		color:var(--color-brand-primary)
	}
	summary:focus-visible {
		outline:0
	}
	summary h3 {
		display: inline-flex;
		align-items: center;
		padding-left: var(--space-xs);
		margin:1em 0
	}
	.footer-container {
		overflow: visible;
		display: flex;
		justify-content: center;
		gap: var(--space-xl);
		margin-bottom:var(--space-xl)
	}
	.github-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		flex-wrap:wrap
	}
	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		overflow:hidden
	}
	.table-container {
		margin-bottom: 20px;
		border-radius: var(--radius-ui);
		border: 1px solid var(--color-border-accent);
		background: color-mix(in srgb,var(--color-bg-card),#000328 8%);
		overflow-x:auto
	}
	.add-noise, .delete-noise {
		background: 0 0;
		margin: 0;
		border: none;
		cursor: pointer;
		color: var(--color-brand-primary);
		transition:scale .2s ease
	}
	.add-noise:hover, .delete-noise:hover {
		scale: 1.2;
		color:var(--color-brand-hover)
	}
	.table-container tbody {
		display: flex;
		flex-direction:column
	}
	.table-container tr {
		display: flex;
		flex-direction: row;
		padding: var(--space-lg);
		gap:var(--space-sm)
	}
	table tr:not(:last-child) {
		border-bottom:1px solid var(--color-border-accent)
	}
	.table-container tr td:first-child {
		white-space:nowrap
	}
	.table-container tr td:nth-child(2) {
		flex-direction: row;
		gap: 8px;
		width:fit-content
	}
	.info-table {
		border-radius: var(--radius-ui);
		border: 1px solid var(--color-border-accent);
		background: color-mix(in srgb,var(--color-bg-card),#000328 8%);
		overflow-x: auto;
		text-align:left
	}
	.info-table td, .info-table th {
		white-space: nowrap;
		padding: 10px;
		border-bottom:inherit
	}
	.info-table th {
		background-color: var(--color-bg-input);
		color: var(--color-text-primary);
		font-weight:500
	}
	.info-table td:first-child {
		background-color: var(--color-bg-input);
		color: var(--color-text-secondary);
		font-weight:400
	}
	.info-table td:last-child {
		display: flex;
		justify-content:space-between
	}
	.table-container td, .table-container th {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		gap:10px
	}
	.table-container td div {
		display: flex;
		align-items: center;
		gap:4px
	}
	.table-container tr:hover {
		background-color:var(--color-bg-input)
	}
	.modal {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color:rgba(0,0,0,.7)
	}
	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		width: 90%;
		text-align: center;
		background-color: var(--color-bg-modal);
		color: var(--color-text-primary);
		margin: auto;
		padding: 1.2rem;
		border: 1px solid var(--color-border-accent);
		border-radius: 1.2rem;
		box-shadow: 0 2px 4px rgba(0,0,0,.1);
		position: absolute;
		top: 50%;
		left: 50%;
		transform:translate(-50%,-50%)
	}
	.qrcode {
		width: 256px;
		height: 256px;
		border-radius:var(--radius-ui)
	}
	#qrModal>.modal-content {
		width:fit-content
	}
	.modal-header {
		display: flex;
		flex-direction: row;
		position: relative;
		align-items: center;
		justify-content:flex-end
	}
	.modal-title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-weight: 700;
		white-space: nowrap;
		font-size:large
	}
	.modal-close {
		align-self: flex-end;
		color: var(--color-text-primary);
		float:right
	}
	.modal-close:focus, .modal-close:hover {
		color: var(--color-brand-primary);
		text-decoration: none;
		cursor:pointer
	}
	#passwordError {
		color: var(--color-icon-red);
		margin-bottom:10px
	}
	.refresh-my-ip {
		color:var(--color-brand-primary)
	}
	.udp-noise {
		margin-bottom:10px
	}
	.password-wrapper {
		position: relative;
		width:100%
	}
	.password-error {
		color: red;
		margin-bottom:10px
	}
	.value-container {
		color: var(--color-text-primary);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap:8px
	}
	.output {
		white-space:nowrap
	}
	.output-container {
		width: 100%;
		padding: 12px;
		text-align: center;
		background-color: var(--color-bg-input);
		border: 1px solid var(--color-border-accent);
		border-radius: 10px;
		overflow: hidden;
		box-shadow:var(--shadow-input)
	}
	.message-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: var(--color-text-primary);
		border-bottom: 1px solid var(--color-border-accent);
		padding-bottom:var(--space-md)
	}
	.message-heading {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap:6px
	}
	.message-title {
		font-size: large;
		font-weight:500
	}
	.message-icon {
		color:#ff4500
	}
	.message-close {
		background: 0 0;
		border: none;
		color: var(--color-text-primary);
		cursor:pointer
	}
	.message-body {
		display: flex;
		flex-direction: column;
		gap:1.5rem
	}
	.message-text {
		text-align: left;
		line-height: 1.4rem;
		margin: 0;
		font-family: inherit;
		font-size: var(--font-size-sm);
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		overflow-x:hidden
	}
	.message-buttons {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		gap:1rem
	}
	@media only screen and (min-width:600px) {
		.form-control {
			flex-direction:row
		}
		.message-card, .modal-content {
			width:70%
		}
	}
	@media only screen and (min-width:768px) {
		.form-container {
			max-width:calc(768px * .9)
		}
		.message-card, .modal-content {
			width:50%
		}
	}
	@media only screen and (min-width:1024px) {
		.form-container {
			max-width:768px
		}
		.message-card, .modal-content {
			width:30%
		}
	}
</style>
</head>
<body>
	<div class=header>
		<div class=header-title><img id=header-logo src=data:image/x-icon;base64,__ICON__ alt="BPB Logo" width=48 height=48><h1>BPB Panel <span class=panel-version>v5.1.1</span></h1>
		</div><a class=link id=zeus-link href=./zeus style="font-weight:800">⚡ Zeus</a><a class=link id=github-link href=https://github.com/bia-pain-bache/BPB-Worker-Panel target=_blank><span><svg xmlns=http://www.w3.org/2000/svg width=2rem height=2rem viewBox="0 0 24 24" fill=white><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> </span></a><button type=button id=logout class=panel-settings title="Log out" onclick=logout(event)><span class=material-symbols-rounded>logout</span></button>
	</div>
	<div class="container form-container"><h2><span class=material-symbols-rounded>dashboard</span>Admin</h2>
		<div class="container section"><h3><span class=material-symbols-rounded>clock_loader_40</span> Last 24h Requests</h3>
			<div class=dashboard-info><span><span class=material-symbols-rounded>data_usage</span>BPB</span> <span><b id=panel-usage></b><span class=separator> | </span><span id=panel-pct></span>%</span>
			</div>
			<div class=dashboard-info><span><span class=material-symbols-rounded>data_usage</span>Total</span> <span><b id=total-usage></b><span class=separator> | </span><span id=total-pct></span>%</span>
			</div>
		</div>
		<div class=accordion-item><details><summary><h3>Settings</h3></summary>
			<div class=section>
				<div class=dashboard-action><span>Reset Password</span> <button id=openResetPass class=button onclick=openResetPass(event)><span class=material-symbols-rounded>key_vertical</span> Reset</button>
				</div>
				<div class=dashboard-action><span>Delete Panel</span> <button id=deletePanel class="button delete" onclick=deletePanel(this)><span class=material-symbols-rounded>delete</span> Delete</button>
				</div>
			</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/admin-settings/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
		</div>
		<form id=telegramForm class=configForm onsubmit=setupTelegramBot(event)>
			<div class=accordion-item><details><summary><h3>Telegram Bot</h3></summary>
				<div class=section>
					<div class=form-control><label for=telegramBotToken>Telegram Bot Token</label>
						<div><input type=text id=telegramBotToken name=telegramBotToken>
						</div>
					</div>
					<div class=form-control><label for=telegramUserId>Telegram User ID</label>
						<div><input type=text id=telegramUserId name=telegramUserId>
						</div>
					</div>
					<div id=apply class="form-control apply"><button type=submit id=setup-telegram class=button form=telegramForm disabled=disabled><span class=material-symbols-rounded>smart_toy</span> Setup</button> <button type=button id=remove-telegram class="button delete" onclick=removeTelegramBot(this) disabled=disabled><span class=material-symbols-rounded>delete</span> Remove</button>
					</div>
				</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/telegram-bot/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
			</div>
		</form>
	</div>
	<div class="form-container container"><h2><span class=material-symbols-rounded>settings</span>Proxy Settings</h2>
		<form id=configForm class=configForm onsubmit=updateSettings(event)>
			<div class=accordion-item><details><summary><h3>Common</h3></summary>
				<div class=section>
					<div class=form-control><label for=localDNS>Local DNS</label>
						<div><input type=text id=localDNS name=localDNS required>
						</div>
					</div>
					<div class=form-control><label for=antiSanctionDNS>Anti Sanction DNS</label>
						<div><input type=text id=antiSanctionDNS name=antiSanctionDNS required>
						</div>
					</div>
					<div class=form-control><label for=fakeDNS>Fake DNS</label>
						<div class=select-wrapper><select id=fakeDNS name=fakeDNS><option value=true>Enabled</option><option value=false>Disabled</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=form-control><label for=enableIPv6>IPv6</label>
						<div class=select-wrapper><select id=enableIPv6 name=enableIPv6><option value=true>Enabled</option><option value=false>Disabled</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=form-control><label for=allowLANConnection>Allow connections from LAN</label>
						<div class=select-wrapper><select id=allowLANConnection name=allowLANConnection><option value=true>Enabled</option><option value=false>Disabled</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=form-control><label for=logLevel>Log Level</label>
						<div class=select-wrapper><select id=logLevel name=logLevel><option value=none>Disabled</option><option value=warning>Warning</option><option value=error>Error</option><option value=info>Info</option><option value=debug>Debug</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=form-control><label for=customDomain>Custom Domain</label>
						<div><input type=text id=customDomain name=customDomain>
						</div>
					</div>
					<div class=form-control><label for=dohUrl>Underlying DoH</label>
						<div><input type=text id=dohUrl name=dohUrl>
						</div>
					</div>
					<div class=form-control><label for=securePath>Panel - Subscriptions Path<span class=material-symbols-rounded onclick=randPath()>refresh</span></label>
						<div><input type=text id=securePath name=securePath required>
						</div>
					</div>
					<div class=form-control><label for=fallback>Fallback Domain</label>
						<div><input type=text id=fallback name=fallback>
						</div>
					</div>
				</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/common/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
			</div>
			<div class=accordion-item><details><summary><h3>VLESS - Trojan</h3></summary>
				<div class=section>
					<div class=form-control><label for=protocols>Protocols</label>
						<div class=select-wrapper><select id=protocols name=protocols><option value=vless,trojan>VLESS & Trojan</option><option value=vless>VLESS</option><option value=trojan>Trojan</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=form-control><label for=vlUUID>VLESS UUID<span class=material-symbols-rounded onclick=randUUID()>refresh</span></label>
						<div><input type=text id=vlUUID name=vlUUID required>
						</div>
					</div>
					<div class=form-control><label for=trPass>Trojan Password<span class=material-symbols-rounded onclick=randPassword()>refresh</span></label>
						<div><input type=text id=trPass name=trPass required>
						</div>
					</div>
					<div class=form-control><label for=remoteDNS>Remote DNS</label>
						<div><input type=text id=remoteDNS name=remoteDNS required>
						</div>
					</div>
					<div class=form-control><label for=upstreamProxy>Upstream TCP Proxy</label>
						<div><input type=text id=upstreamProxy name=upstreamProxy>
						</div>
					</div>
					<div class=form-control><label for=chainProxy>Chain Proxy</label>
						<div><input type=text id=chainProxy name=chainProxy>
						</div>
					</div>
					<div class=form-control><label for=cleanIPs>Clean IPs - Domains<a class=url href=https://github.com/bia-pain-bache/Cloudflare-Clean-IP-Scanner title=Scanner target=_blank rel="noopener noreferrer"> <span class=material-symbols-rounded>open_in_new</span></a></label>
						<div><textarea id=cleanIPs name=cleanIPs rows=1></textarea>
						</div>
					</div>
					<div class=form-control><span>TLS Ports</span>
						<div>
							<div id=tls-ports class="checkbox-container inner-container">
							</div>
						</div>
					</div>
					<div id=none-tls class=form-control style=display:none><span>non-TLS Ports</span>
						<div>
							<div id=non-tls-ports class="checkbox-container inner-container">
							</div>
						</div>
					</div>
					<div class=form-control><label for=fingerprint>Fingerprint</label>
						<div class=select-wrapper><select id=fingerprint name=fingerprint><option value=chrome>chrome</option><option value=firefox>firefox</option><option value=safari>safari</option><option value=ios>ios</option><option value=android>android</option><option value=edge>edge</option><option value=360>360</option><option value=qq>qq</option><option value=random>random</option><option value=randomized>randomized</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=form-control><label for=bestPingInterval>Best Ping Interval</label>
						<div><input type=number id=bestPingInterval name=bestPingInterval min=10 max=90>
						</div>
					</div>
					<div class=form-control><label for=enableTFO>TCP Fast Open</label>
						<div class=select-wrapper><select id=enableTFO name=enableTFO><option value=true>Enabled</option><option value=false>Disabled</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=container>
						<div class=section><h4><span class=material-symbols-rounded>tune</span> Proxy IP</h4>
							<div class=form-control><label for=proxyIpMode>Mode</label>
								<div class=select-wrapper><select id=proxyIpMode name=proxyIpMode><option value=proxyip>Proxy IP</option><option value=prefix>NAT64</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
								</div>
							</div>
							<div class=form-control><label for=proxyIPs>Proxy IPs - Domains<a class=url href=./proxy-ip title="Proxy IPs" target=_blank rel="noopener noreferrer"> <span class=material-symbols-rounded>open_in_new</span></a></label>
								<div><textarea id=proxyIPs name=proxyIPs rows=1></textarea>
								</div>
							</div>
							<div class=form-control><label for=prefixes>NAT64 Prefixes<a class=url href=https://github.com/bia-pain-bache/BPB-Worker-Panel/blob/main/docs/NAT64Prefixes.md title="NAT64 prefixes" target=_blank rel="noopener noreferrer"> <span class=material-symbols-rounded>open_in_new</span></a></label>
								<div><textarea id=prefixes name=prefixes rows=1></textarea>
								</div>
							</div>
						</div>
					</div>
					<div class=container>
						<div class=section><h4><span class=material-symbols-rounded>tune</span> ECH</h4>
							<div class=form-control><label for=enableECH>ECH</label>
								<div class=select-wrapper><select id=enableECH name=enableECH><option value=true>Enabled</option><option value=false>Disabled</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
								</div>
							</div>
							<div class=form-control><label for=echServerName>ECH Server Name</label>
								<div><input type=text id=echServerName name=echServerName>
								</div>
							</div>
						</div>
					</div>
					<div class=container>
						<div class=section><h4><span class=material-symbols-rounded>tune</span> Custom CDN</h4>
							<div class=form-control><label for=customCdnAddrs>Addresses</label>
								<div><textarea id=customCdnAddrs name=customCdnAddrs rows=1></textarea>
								</div>
							</div>
							<div class=form-control><label for=customCdnHost>Host</label>
								<div><input type=text id=customCdnHost name=customCdnHost>
								</div>
							</div>
							<div class=form-control><label for=customCdnSni>SNI</label>
								<div><input type=text id=customCdnSni name=customCdnSni>
								</div>
							</div>
						</div>
					</div>
				</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/vless-trojan/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
			</div>
			<div class=accordion-item><details><summary><h3>Xray Fragment</h3></summary>
				<div class=section>
					<div class=form-control><label for=fragmentMode>Mode</label>
						<div class=select-wrapper><select id=fragmentMode name=fragmentMode onchange=handleFragmentMode()><option value=custom>Custom</option><option value=low>Low</option><option value=medium>Medium</option><option value=high>High</option><option value=severe>Severe</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=form-control><label for=fragmentPackets>Packets</label>
						<div class=select-wrapper><select id=fragmentPackets name=fragmentPackets><option value=tlshello>tlshello</option><option value=1-1>1-1</option><option value=1-2>1-2</option><option value=1-3>1-3</option><option value=1-5>1-5</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=form-control><label for=fragmentLengthMin>Length</label>
						<div class=min-max><input type=number id=fragmentLengthMin name=fragmentLengthMin min=1 required> <span>-</span> <input type=number id=fragmentLengthMax name=fragmentLengthMax max=500 required>
						</div>
					</div>
					<div class=form-control><label for=fragmentDelayMin>Delay</label>
						<div class=min-max><input type=number id=fragmentDelayMin name=fragmentDelayMin min=1 max=30 required> <span>-</span> <input type=number id=fragmentDelayMax name=fragmentDelayMax min=1 max=30 required>
						</div>
					</div>
					<div class=form-control><label for=fragmentMaxSplitMin>Max Split</label>
						<div class=min-max><input type=number id=fragmentMaxSplitMin name=fragmentMaxSplitMin min=2> <span>-</span> <input type=number id=fragmentMaxSplitMax name=fragmentMaxSplitMax min=2>
						</div>
					</div>
				</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/fragment/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
			</div>
			<div class=accordion-item><details><summary><h3>External Raw Configs</h3></summary>
				<div class=section>
					<div class=form-control><label for=customSubs>Subscriptions</label>
						<div><textarea id=customSubs name=customSubs rows=1 wrap=off></textarea>
						</div>
					</div>
					<div class=form-control><label for=customConfigs>Single Configs</label>
						<div><textarea id=customConfigs name=customConfigs rows=1 wrap=off></textarea>
						</div>
					</div>
				</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/external-configs/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
			</div>
			<div class=accordion-item><details><summary><h3>Warp General</h3></summary>
				<div class=section>
					<div class=form-control><label for=warpRemoteDNS>Remote DNS</label>
						<div><input type=text id=warpRemoteDNS name=warpRemoteDNS required>
						</div>
					</div>
					<div class=form-control><label for=warpEndpoints>Endpoints<a class=url href=https://github.com/bia-pain-bache/BPB-Warp-Scanner title=Scanner target=_blank rel="noopener noreferrer"> <span class=material-symbols-rounded>open_in_new</span></a></label>
						<div><textarea id=warpEndpoints name=warpEndpoints rows=1 required></textarea>
						</div>
					</div>
					<div class=form-control><label for=warpBestPingInterval>Best Ping Interval</label>
						<div><input type=number id=warpBestPingInterval name=warpBestPingInterval min=10 max=90>
						</div>
					</div>
					<div class=form-control><label for=warpReservedBytes>Reserved Bytes</label>
						<div class=select-wrapper><select id=warpReservedBytes name=warpReservedBytes><option value=true>Enabled</option><option value=false>Disabled</option></select> <span class=material-symbols-rounded>keyboard_arrow_down</span>
						</div>
					</div>
					<div class=dashboard-action><span>Renew Warp Accounts</span> <button type=button class=button onclick=renewWarpAccounts(this)><span id=warp-update class=material-symbols-rounded>autorenew</span> Renew</button>
					</div>
				</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/warp/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
			</div>
			<div class=accordion-item><details><summary><h3>Warp PRO</h3></summary>
				<div class=section>
					<div class=container>
						<div class=section><h4><span class=material-symbols-rounded>tune</span> MahsaNG Noise</h4>
							<div class=form-control><label for=knockerNoiseMode>Mode</label>
								<div><input type=text id=knockerNoiseMode name=knockerNoiseMode title="Fill in 'none', 'quic', 'random', or any HEX string like 'ee0000000108aaaa'" required>
								</div>
							</div>
							<div class=form-control><label for=knockerNoiseCountMin>Count</label>
								<div class=min-max><input type=number id=knockerNoiseCountMin name=knockerNoiseCountMin min=1 required> <span>-</span> <input type=number id=knockerNoiseCountMax name=knockerNoiseCountMax min=1 required>
								</div>
							</div>
							<div class=form-control><label for=knockerNoiseSizeMin>Size</label>
								<div class=min-max><input type=number id=knockerNoiseSizeMin name=knockerNoiseSizeMin min=1 required> <span>-</span> <input type=number id=knockerNoiseSizeMax name=knockerNoiseSizeMax min=1 required>
								</div>
							</div>
							<div class=form-control><label for=knockerNoiseDelayMin>Delay</label>
								<div class=min-max><input type=number id=knockerNoiseDelayMin name=knockerNoiseDelayMin min=1 required> <span>-</span> <input type=number id=knockerNoiseDelayMax name=knockerNoiseDelayMax min=1 required>
								</div>
							</div>
						</div>
					</div>
					<div class=container>
						<div class=section><h4><span class=material-symbols-rounded>tune</span> Clash - Amnezia Noise</h4>
							<div class=form-control><label for=amneziaNoiseCount>Count</label>
								<div><input type=number id=amneziaNoiseCount name=amneziaNoiseCount min=1 required>
								</div>
							</div>
							<div class=form-control><label for=amneziaNoiseSizeMin>Size</label>
								<div class=min-max><input type=number id=amneziaNoiseSizeMin name=amneziaNoiseSizeMin min=1 required> <span>-</span> <input type=number id=amneziaNoiseSizeMax name=amneziaNoiseSizeMax min=1 required>
								</div>
							</div>
						</div>
					</div>
					<div id=udp-noise-container class=container>
						<div class=header-container><h4><span class=material-symbols-rounded>tune</span> v2ray Noise</h4><button type=button class=add-noise onclick=addNoise(true)><span class=material-symbols-rounded>add_circle</span></button>
						</div>
						<div id=noises class=section>
						</div>
					</div>
				</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/warp-pro/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
			</div>
			<div class=accordion-item><details><summary><h3>Routing Rules</h3></summary>
				<div class=section>
					<div class=container><h4><span class=material-symbols-rounded>tune</span> Preset Rules</h4>
						<div class=form-control><span>Bypass rules</span>
							<div>
								<div id=bypass-rules class="checkbox-container inner-container">
									<div class=checkbox-wrapper><input type=checkbox id=bypassIran name=bypassIran value=true> <label for=bypassIran>Iran</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassChina name=bypassChina value=true> <label for=bypassChina>China</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassRussia name=bypassRussia value=true> <label for=bypassRussia>Russia</label>
									</div>
								</div>
							</div>
						</div>
						<div class=form-control><span>Block rules</span>
							<div>
								<div id=block-rules class="checkbox-container inner-container">
									<div class=checkbox-wrapper><input type=checkbox id=blockAds name=blockAds value=true> <label for=blockAds>Ads.</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=blockPorn name=blockPorn value=true> <label for=blockPorn>Porn</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=blockUDP443 name=blockUDP443 value=true> <label for=blockUDP443>QUIC</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=blockMalware name=blockMalware value=true onchange=handleRiskyRules(event)> <label for=blockMalware>Malware</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=blockPhishing name=blockPhishing value=true onchange=handleRiskyRules(event)> <label for=blockPhishing>Phishing</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=blockCryptominers name=blockCryptominers value=true onchange=handleRiskyRules(event)> <label for=blockCryptominers>Cryptominers</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class=container><h4><span class=material-symbols-rounded>tune</span> Custom Rules</h4>
						<div class=form-control><label for=customBypassRules>Bypass IPs - Domains</label>
							<div><textarea id=customBypassRules name=customBypassRules rows=1></textarea>
							</div>
						</div>
						<div class=form-control><label for=customBlockRules>Block IPs - Domains</label>
							<div><textarea id=customBlockRules name=customBlockRules rows=1></textarea>
							</div>
						</div>
					</div>
					<div class=container><h4><span class=material-symbols-rounded>tune</span> Sanction Rules</h4>
						<div class=form-control><span>Bypass rules</span>
							<div>
								<div id=bypass-sanction-rules class="checkbox-container inner-container">
									<div class=checkbox-wrapper><input type=checkbox id=bypassOpenAi name=bypassOpenAi value=true> <label for=bypassOpenAi>ChatGPT</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassGoogleAi name=bypassGoogleAi value=true> <label for=bypassGoogleAi>Google AIs</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassMicrosoft name=bypassMicrosoft value=true> <label for=bypassMicrosoft>Microsoft</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassOracle name=bypassOracle value=true> <label for=bypassOracle>Oracle</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassDocker name=bypassDocker value=true> <label for=bypassDocker>Docker</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassAdobe name=bypassAdobe value=true> <label for=bypassAdobe>Adobe</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassEpicGames name=bypassEpicGames value=true> <label for=bypassEpicGames>Epic Games</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassIntel name=bypassIntel value=true> <label for=bypassIntel>Intel</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassAmd name=bypassAmd value=true> <label for=bypassAmd>AMD</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassNvidia name=bypassNvidia value=true> <label for=bypassNvidia>Nvidia</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassAsus name=bypassAsus value=true> <label for=bypassAsus>Asus</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassHp name=bypassHp value=true> <label for=bypassHp>HP</label>
									</div>
									<div class=checkbox-wrapper><input type=checkbox id=bypassLenovo name=bypassLenovo value=true> <label for=bypassLenovo>Lenovo</label>
									</div>
								</div>
							</div>
						</div>
						<div class=form-control><label for=customBypassSanctionRules>Bypass Domains</label>
							<div><textarea id=customBypassSanctionRules name=customBypassSanctionRules rows=1></textarea>
							</div>
						</div>
					</div>
				</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/routing-rules/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
			</div>
			<div class=accordion-item><details><summary><h3>Import - Export</h3></summary>
				<div class=section>
					<div class=container><h4><span class=material-symbols-rounded>link</span>Remote Settings</h4>
						<div class=form-control><label for=remoteSettings>Remote URL</label>
							<div><input type=text id=remoteSettings name=remoteSettings>
							</div>
						</div>
						<div class=dashboard-action><span>Import Remote</span> <button type=button id=fetchSettingsBtn class=button onclick=importRemoteSettings(event)><span class=material-symbols-rounded>cloud_download</span> Import</button>
						</div>
						<div class=dashboard-action><span>Share Yours</span> <button type=button class=button onclick=shareSettings()><span class=material-symbols-rounded>share</span> Share</button>
						</div>
					</div>
					<div class=container><h4><span class=material-symbols-rounded>draft</span>File Settings</h4>
						<div class=dashboard-action><span>Import File</span> <button type=button class=button onclick=importFile()><span class=material-symbols-rounded>upload</span> <input type=file id=fileInput accept=.dat style=display:none onchange=importFileSettings(event)> Import</button>
						</div>
						<div class=dashboard-action><span>Export File</span> <button type=button class=button onclick=exportFileSettings(event)><span class=material-symbols-rounded>download</span> Export</button>
						</div>
					</div>
				</div></details><a class=help-icon href=https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/import-export/ target=_blank title=Help><span class=material-symbols-rounded>info</span></a>
			</div>
			<div id=apply class="form-control apply"><button type=submit id=applyButton class="button disabled" form=configForm><span class=material-symbols-rounded>check_circle </span>Apply</button> <button type=button class=panel-settings title="Reset panel settings to default" onclick=resetSettings(this)><span class=material-symbols-rounded>settings_backup_restore</span></button>
			</div>
		</form>
	</div>
	<div id=subscriptions class="form-container container"><h2><span class=material-symbols-rounded>link</span> Subscriptions</h2>
	</div>
	<div class="form-container container"><h2><span class=material-symbols-rounded>dns</span> DNS over HTTPS</h2>
		<div class=value-container>
			<div class=output-container><span id=doh class=output></span>
			</div><button class=svg-btn onclick=copyDoh()><span class=material-symbols-rounded>content_copy</span></button>
		</div>
	</div><template id=message-template>
	<div class=modal hidden>
		<div class=modal-content>
			<div class=message-header>
				<div class=message-heading><span class="material-symbols-rounded message-icon"></span> <span class=message-title></span>
				</div><span class="material-symbols-rounded modal-close">close</span>
			</div>
			<div class=message-body><pre class=message-text></pre>
				<div class=message-buttons><button class="button message-ok-btn"><span class=material-symbols-rounded>check_circle </span>Ok</button> <button class="button message-cancel-btn"><span class=material-symbols-rounded>cancel </span>Cancel</button>
				</div>
			</div>
		</div>
	</div></template>
	<div class="form-container container">
		<div id=resetPassModal class=modal hidden>
			<div class=modal-content>
				<div class=modal-header><span class=modal-title>Reset Password</span> <span id=closeResetPass class="material-symbols-rounded modal-close">close</span>
				</div>
				<form class=config-form>
					<div class=section>
						<div id=usernameContainer class=modal-form-control style=display:none><label for=username>Cloudflare Email</label> <input type=text id=username name=username autocomplete=on>
						</div>
						<div class=modal-form-control><label for=newPassword>New Password</label>
							<div class=password-wrapper><input type=password id=newPassword name=newPassword required> <span class="material-symbols-rounded show-hide">visibility_off</span>
							</div>
						</div>
						<div class=modal-form-control><label for=confirmPassword>Confirm Password</label>
							<div class=password-wrapper><input type=password id=confirmPassword name=confirmPassword required> <span class="material-symbols-rounded show-hide">visibility_off</span>
							</div>
						</div>
					</div>
					<div id=passwordError class=password-error>
					</div><button id=changePasswordBtn type=submit class=button><span class=material-symbols-rounded>save </span>Save</button>
				</form>
			</div>
		</div>
		<div id=qrModal class=modal hidden>
			<div class=modal-content>
				<div class=modal-header><span id=qrcodeTitle class=modal-title></span> <span class="material-symbols-rounded modal-close">close</span>
				</div>
				<div id=qrcode-container>
				</div>
			</div>
		</div>
		<div>
			<div class=header-container><h2><span class=material-symbols-rounded>fingerprint</span> My IP</h2><button type=button id=refresh-geo-location class=refresh-geo-location onclick=fetchIPInfo()><span class=material-symbols-rounded>refresh</span></button>
			</div>
			<div class=info-table>
				<table id=ips>
					<thead>
						<tr><th scope=col>Information</th><th scope=col>Cloudflare targets</th><th scope=col>Other targets</th>
						</tr>
					</thead>
					<tbody>
						<tr><td>IP</td><td id=cf-ip></td><td id=ip></td>
						</tr>
						<tr><td>Country</td><td id=cf-country></td><td id=country></td>
						</tr>
						<tr><td>City</td><td id=cf-city></td><td id=city></td>
						</tr>
						<tr><td>ISP</td><td id=cf-isp></td><td id=isp></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div class="form-container container">
		<div class=header-container><h2><span class=material-symbols-rounded>verified</span> Supported Clients</h2>
		</div>
		<div class=info-table>
			<table>
				<thead>
					<tr><th scope=col>Client</th><th scope=col>Minimum Requirement</th><th scope=col>Get Latest</th>
					</tr>
				</thead>
				<tbody id=supported-clients>
				</tbody>
			</table>
		</div>
	</div>
<script type=module>
	import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";
	polyfillCountryFlagEmojis();
</script>
<script>
	const defaultHttpsPorts = [443, 8443, 2053, 2083, 2087, 2096];
	const defaultHttpPorts = [80, 8080, 8880, 2052, 2082, 2086, 2095];
	const proxyForm = document.getElementById("configForm");
	const [selectElements, numInputElements, inputElements, textareaElements, checkboxElements] = ["select", "input[type=number]", "input:not([type=file])", "textarea", "input[type=checkbox]"].map(item => proxyForm.querySelectorAll(item));
	async function initPanel(proxySettings, telegramSettings, subscriptions, clients) {
		try {
			if (!proxySettings) {
				const now = Date.now();
				const response = await fetch(\`./panel/settings?nocache=\${now}\`, { cache: "no-store" });
				const { success, status, message, body } = await response.json();
				if (status === 401 && !body.isPassSet) {
					const closeButton = document.querySelector(".modal-close");
					openResetPass();
					closeButton.style.visibility = "hidden";
				}
				if (!success) {
					throw new Error(\`status \${status} - \${message}\`);
				}
				proxySettings = body.proxySettings;
				telegramSettings = body.telegramSettings;
				subscriptions = body.subscriptions;
				clients = body.clients;
			}
			renderPanel(proxySettings, telegramSettings, subscriptions, clients);
		}
		catch (error) {
			console.error("Panel initiation error:", error);
		}
	}
	async function getUsage() {
		try {
			const now = Date.now();
			const response = await fetch(\`./panel/usage?nocache=\${now}\`, { cache: "no-store" });
			const { success, status, message, body } = await response.json();
			if (!success) {
				throw new Error(\`status \${status} - \${message}\`);
			}
			const { total, worker } = body;
			const totalUsageElement = document.getElementById("total-usage");
			totalUsageElement.textContent = total.toLocaleString("en-US");
			totalUsageElement.style.fontSize = "larger";
			const totalPctElement = document.getElementById("total-pct");
			const totalPercent = Math.ceil(Number(total) / 1e5 * 100);
			totalPctElement.textContent = totalPercent;
			if (totalPercent > 80) {
				totalPctElement.style.color = "var(--color-icon-red)";
			}
			const panelUsageElement = document.getElementById("panel-usage");
			panelUsageElement.textContent = worker.toLocaleString("en-US");
			panelUsageElement.style.fontSize = "larger";
			const panelPctElement = document.getElementById("panel-pct");
			const panelPercent = Math.ceil(Number(worker) / 1e5 * 100);
			panelPctElement.textContent = panelPercent;
			if (panelPercent > 80) {
				panelPctElement.style.color = "var(--color-icon-red)";
			}
		}
		catch (error) {
			console.error("Failed to get usage from API:", error);
		}
	}
	async function checkVersion(currentVersion) {
		return;
		try {
			const response = await fetch("https://raw.githubusercontent.com/bia-pain-bache/BPB-Worker-Panel/refs/heads/main/package.json", { cache: "no-store" });
			if (!response.ok) {
				throw new Error(\`status \${response.status}\`);
			}
			const version = (await response.json()).version;
			if (isNewerVersion(version, currentVersion)) {
				globalThis.latestVersion = version;
				document.getElementById("updatePanel").disabled = false;
			}
		}
		catch (error) {
			console.error("Get latest version error:", error);
		}
	}
	function isNewerVersion(latestVersion, currentVersion) {
		const latestParts = latestVersion.split(".").map(Number);
		const currentParts = currentVersion.split(".").map(Number);
		for (let index = 0; index < Math.max(latestParts.length, currentParts.length); index++) {
			const latestPart = latestParts[index] ?? 0;
			const currentPart = currentParts[index] ?? 0;
			if (latestPart > currentPart) {
				return true;
			}
			if (latestPart < currentPart) {
				return false;
			}
		}
		return false;
	}
	function renderPanel(proxySettings, telegramSettings, subscriptions, clients) {
		const { securePath, ports, xrayUdpNoises, remoteSettings } = proxySettings;
		const encoded = encodeURIComponent(securePath);
		if (encoded !== window.location.pathname.split("/")[1]) {
			setTimeout(() => {
				window.location.href = \`../\${encoded}/panel\`;
			}, 1e3);
		}
		const url = new URL("./dns-query", window.location.href);
		if (document.getElementById("doh").textContent = url.href, document.getElementById("fetchSettingsBtn").disabled = !remoteSettings, selectElements.forEach(selectElement => selectElement.value = proxySettings[selectElement.id]), checkboxElements.forEach(checkboxElement => checkboxElement.checked = proxySettings[checkboxElement.id]), inputElements.forEach(inputElement => inputElement.value = proxySettings[inputElement.id] || ""), textareaElements.forEach(textareaElement => {
			const id = textareaElement.id;
			const value = document.getElementById(id);
			const joined = proxySettings[id]?.join("\\r\\n");
			const length = proxySettings[id].length;
			value.style.height = "auto";
			if (length) {
				value.rows = length;
			}
			value.value = joined;
			textareaElement.addEventListener("input", () => {
				textareaElement.style.height = "auto";
				textareaElement.style.height = \`\${textareaElement.scrollHeight}px\`;
			});
		}), renderPorts(ports.map(Number)), renderNoises(xrayUdpNoises), renderSubscriptions(subscriptions), renderClients(clients), globalThis.initialFormData = new FormData(proxyForm), handleProxyFormChanges(), proxyForm.addEventListener("input", handleProxyFormChanges), proxyForm.addEventListener("change", handleProxyFormChanges), handleFragmentMode(), telegramSettings) {
			const value = document.getElementById("telegramForm");
			handleTgFormChanges(telegramSettings);
			value.addEventListener("input", () => handleTgFormChanges());
			for (const value2 in telegramSettings) {
				value.elements[value2].value = telegramSettings[value2];
			}
		}
	}
	function hasFormDataChanged() {
		const toObject = formData => Object.fromEntries(formData.entries());
		const form = document.getElementById("configForm");
		const currentFormData = new FormData(form);
		const initialValues = toObject(globalThis.initialFormData);
		const currentValues = toObject(currentFormData);
		return JSON.stringify(initialValues) !== JSON.stringify(currentValues);
	}
	function handleProxyFormChanges(forceEnable = false) {
		const applyButton = document.getElementById("applyButton");
		const formDataChanged = hasFormDataChanged();
		applyButton.disabled = !forceEnable && !formDataChanged;
	}
	function handleTgFormChanges(telegramSettings) {
		const userIdInput = document.getElementById("telegramUserId");
		const botTokenInput = document.getElementById("telegramBotToken");
		const setupButton = document.getElementById("setup-telegram");
		const removeButton = document.getElementById("remove-telegram");
		if (telegramSettings) {
			const { telegramUserId, telegramBotToken } = telegramSettings;
			removeButton.disabled = !telegramUserId && !telegramBotToken;
			setupButton.disabled = true;
			userIdInput.value = telegramUserId;
			return void (botTokenInput.value = telegramBotToken);
		}
		setupButton.disabled = !userIdInput.value.trim() || !botTokenInput.value.trim();
	}
	async function getIpDetails(ip) {
		try {
			const response = await fetch("./panel/my-ip", { method: "POST", body: ip });
			const { success, status, message, body } = await response.json();
			if (!success) {
				throw new Error(\`status \${status} - \${message}\`);
			}
			return body;
		}
		catch (error) {
			console.error("Fetching IP error:", error);
		}
	}
	async function fetchIPInfo() {
		const startWaitingResult = startWaiting(null, "refresh-geo-location", "");
		const renderIpInfo = (ip = "-", country = "-", countryCode = "-", city = "-", isp = "-", isCloudflare) => {
			const text2 = countryCode !== "-" ? String.fromCodePoint(...[...countryCode].map(item => 127462 + item.charCodeAt(0) - 65)) : "";
			const setText = (elementId, text) => document.getElementById(elementId).textContent = text;
			setText(isCloudflare ? "cf-ip" : "ip", ip);
			setText(isCloudflare ? "cf-country" : "country", \`\${text2} \${country}\`);
			setText(isCloudflare ? "cf-city" : "city", city);
			setText(isCloudflare ? "cf-isp" : "isp", isp);
		};
		const now = Date.now();
		const otherTargetsRequest = fetch(\`https://ipv4.geojs.io/v1/ip.json?nocache=\${now}\`, { cache: "no-store" }).then(async (result) => {
			if (!result.ok) {
				throw new Error("Fetch Other targets IP failed.");
			}
			const { ip } = await result.json();
			const { country, countryCode, city, isp } = await getIpDetails(ip);
			renderIpInfo(ip, country, countryCode, city, isp);
		});
		const cloudflareRequest = fetch(\`https://ipv4.icanhazip.com/?nocache=\${now}\`, { cache: "no-store" }).then(async (result) => {
			if (!result.ok) {
				throw new Error("Fetch Cloudflare targets IP failed.");
			}
			const text = await result.text();
			const { country, countryCode, city, isp } = await getIpDetails(text.trim());
			renderIpInfo(text, country, countryCode, city, isp, true);
		});
		(await Promise.allSettled([otherTargetsRequest, cloudflareRequest])).forEach(item => {
			if (item.status === "rejected") {
				console.error(item.reason);
			}
		});
		stopWaiting(startWaitingResult);
	}
	function generateSubUrl(configType, clientApp, label) {
		const url = new URL(\`./sub/\${configType}\`, window.location.href);
		url.searchParams.append("app", clientApp);
		url.hash = \`💦 BPB \${label}\`;
		return clientApp === "sing-box" && configType !== "raw" ? \`sing-box://import-remote-profile?url=\${url.href}\` : url.href;
	}
	async function generateQRCode(data) {
		const url = new URL("./qrcode", window.location.href);
		url.searchParams.set("data", data);
		url.searchParams.set("nocache", Date.now().toString());
		const response = await fetch(url, { method: "POST" });
		if (!response.ok) {
			throw new Error(\`status \${response.status}\`);
		}
		const blob = await response.blob();
		return elm("img", { id: "qr", className: "qrcode", src: URL.createObjectURL(blob) });
	}
	function showQRCode(subscriptionUrl) {
		const url = new URL(subscriptionUrl);
		const modal = document.getElementById("qrModal");
		const closeButton = modal.querySelector(".modal-close");
		const qrContainer = document.getElementById("qrcode-container");
		document.getElementById("qrcodeTitle").textContent = decodeURIComponent(url.hash).replace("#", "");
		closeButton.onclick = () => {
			modal.hidden = true;
			qrContainer.lastElementChild.remove();
			window.onclick = null;
		};
		window.onclick = event => {
			if (event.target == modal) {
				modal.hidden = true;
				qrContainer.lastElementChild.remove();
			}
		};
		generateQRCode(subscriptionUrl).then(result => {
			qrContainer.appendChild(result);
			modal.hidden = false;
		});
	}
	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).then(() => notify("info", "Copied to clipboard", [text])).catch(error => console.error("Failed to copy:", error));
	}
	function copyDoh() {
		copyToClipboard(document.getElementById("doh").textContent);
	}
	async function dlUrl(link) {
		const url = new URL(link);
		window.location.href = url.protocol === "sing-box:" ? url.searchParams.get("url") : link;
	}
	async function exportFileSettings(event) {
		if (hasFormDataChanged()) {
			return void notify("error", "Export settings", ["Please apply unsaved changes first."]);
		}
		const startWaitingResult = startWaiting(event.target, "", "refresh");
		const url = new URL("./sub/share-settings", window.location.href);
		window.location.href = url.href;
		stopWaiting(startWaitingResult);
	}
	function importFile() {
		const fileInput = document.getElementById("fileInput");
		fileInput.value = "";
		fileInput.click();
	}
	async function importFileSettings(event) {
		const file = event.target.files[0];
		if (file) {
			try {
				const text = await file.text();
				const decoded = atob(text);
				const parsed = JSON.parse(decoded);
				const validateSettingsResult = validateSettings();
				renderPanel({ ...validateSettingsResult, ...parsed });
				handleProxyFormChanges(true);
				notify("success", "Import settings", ["Settings imported successfully!", "Please first REVIEW new settings and then apply, specially ROUTING settings."]);
			}
			catch (error) {
				console.error("Import settings error:", error);
				notify("error", "Import settings", ["Failed to get settings from file."]);
			}
		}
	}
	async function importRemoteSettings(event) {
		if (hasFormDataChanged()) {
			return void notify("error", "Import settings", ["Please apply unsaved changes first."]);
		}
		const startWaitingResult = startWaiting(event.target, "", "refresh");
		const trimmed = document.getElementById("remoteSettings").value.trim();
		const validateSettingsResult = validateSettings();
		try {
			const settings = await fetchSettings(trimmed);
			renderPanel({ ...validateSettingsResult, ...settings });
			handleProxyFormChanges(true);
			notify("success", "Import settings", ["Settings imported successfully!", "Please first REVIEW new settings and then apply, specially ROUTING settings."]);
		}
		catch (error) {
			console.error("Import settings error:", error);
			notify("error", "Import settings", ["Failed to get settings from remote."]);
		}
		finally {
			stopWaiting(startWaitingResult);
		}
	}
	function shareSettings() {
		copyToClipboard(new URL("./sub/share-settings", window.location.href));
	}
	async function fetchSettings(remoteUrl) {
		const url = new URL(remoteUrl);
		const fetchUrl = \`\${url.origin + url.pathname}?nocache=\${Date.now()}\`;
		const response = await fetch(fetchUrl, { cache: "no-store" });
		if (!response.ok) {
			throw new Error(\`status \${response.status}\`);
		}
		const encoded = await response.text();
		return JSON.parse(atob(encoded));
	}
	async function renewWarpAccounts(button) {
		if (!await notify("confirm", "Renew Warp Accounts", ["Are you sure?"])) {
			return;
		}
		const startWaitingResult = startWaiting(button, "", "");
		try {
			const response = await fetch("./panel/update-warp", { method: "POST", credentials: "include" });
			const { success, status, message } = await response.json();
			if (!success) {
				notify("error", "Renew Warp Accounts", ["An error occured, Please try again later."]);
				throw new Error(\`status \${status} - \${message}\`);
			}
			notify("success", "Renew Warp Accounts", ["Warp accounts updated successfully!"]);
		}
		catch (error) {
			console.error("Updating Warp configs error:", error);
			notify("error", "Renew Warp Accounts", ["Failed to renew Warp accounts."]);
		}
		finally {
			stopWaiting(startWaitingResult);
		}
	}
	async function handleRiskyRules(event) {
		if (event.target.checked) {
			if (!await notify("confirm", "Geo asset files", ["v2ray users should set Geo Assets to Chocolate4U and download assets, otherwise configs won't connect.", "Proceed anyway?"])) {
				return void (event.target.checked = false);
			}
		}
	}
	function handleFragmentMode() {
		const mode = document.getElementById("fragmentMode").value;
		const initialValues = Object.fromEntries(globalThis.initialFormData.entries());
		const fieldIds = ["fragmentLengthMin", "fragmentLengthMax", "fragmentDelayMin", "fragmentDelayMax"];
		const presets = {
			low: [100, 200, 1, 1], medium: [50, 100, 1, 5], high: [10, 20, 10, 20], severe: [1, 5, 1, 5], custom: fieldIds.map(fieldId => initialValues[fieldId])
		};
		fieldIds.forEach((fieldId, index) => {
			const field = document.getElementById(fieldId);
			field.value = presets[mode][index];
			if (mode !== "custom") {
				field.setAttribute("readonly", "true");
			}
			else {
				field.removeAttribute("readonly");
			}
		});
	}
	async function resetSettings(button) {
		if (!await notify("confirm", "Reset panel settings", ["This will reset all settings except:", "+ VLESS UUID", "+ Trojan password", "+ Panel - Subscriptions path\\n", "Are you sure?"])) {
			return;
		}
		const startWaitingResult = startWaiting(button, "", "", false);
		try {
			const response = await fetch("./panel/reset-settings", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } });
			const { success, status, message, body } = await response.json();
			if (!success) {
				throw new Error(\`status \${status} - \${message}\`);
			}
			notify("success", "Reset panel settings", ["Please update your subscriptions."]);
			renderPanel(body);
		}
		catch (error) {
			console.error("Reseting settings error:", error);
		}
		finally {
			stopWaiting(startWaitingResult);
		}
	}
	function updateSettings(event, settingsOverride) {
		event.preventDefault();
		event.stopPropagation();
		const validateSettingsResult = validateSettings();
		if (!validateSettingsResult) {
			return false;
		}
		const settingsToSend = settingsOverride ?? validateSettingsResult;
		const startWaitingResult = startWaiting(null, "applyButton", "refresh");
		fetch("./panel/update-settings", {
			method: "PUT", body: JSON.stringify(settingsToSend), credentials: "include", headers: { "Content-Type": "application/json" }
		}).then(result => result.json()).then(({ success, status, message, body }) => {
			if (status === 401 && (notify("error", "Apply settings", ["Session expired! Please login and try again."]), window.location.href = "./login"), !success) {
				body.forEach(item => {
					notify("error", item.field, item.message);
				});
				throw new Error(\`status \${status} - \${message}\`);
			}
			notify("success", "Apply settings", ["Please update your subscriptions."]);
			renderPanel(settingsToSend);
		}).catch(error => console.error("Update settings error:", error)).finally(() => stopWaiting(startWaitingResult));
	}
	function setupTelegramBot() {
		event.preventDefault();
		event.stopPropagation();
		const formData = new FormData(event.target);
		const formValues = Object.fromEntries(formData.entries());
		const setupButton = document.getElementById("setup-telegram");
		const startWaitingResult = startWaiting(setupButton, "", "refresh");
		fetch("./telegram/setup", {
			method: "PUT", body: JSON.stringify(formValues), credentials: "include", headers: { "Content-Type": "application/json" }
		}).then(result => result.json()).then(({ success, status, message, body }) => {
			if (status === 401 && (notify("error", "Setup Telegram bot", ["Session expired! Please login and try again."]), window.location.href = "./login"), !success) {
				throw new Error(\`status \${status} - \${message}\`);
			}
			handleTgFormChanges(body);
			notify("success", "Setup Telegram bot", ["Telegram bot is ready to use."]);
		}).catch(error => console.error("Setup Telegram bot error:", error)).finally(() => {
			stopWaiting(startWaitingResult);
			setupButton.disabled = true;
		});
	}
	function removeTelegramBot(button) {
		const startWaitingResult = startWaiting(button, "", "refresh");
		fetch("./telegram/remove", { method: "POST", credentials: "include" }).then(result => result.json()).then(({ success, status, message, body }) => {
			if (status === 401 && (notify("error", "Remove Telegram bot", ["Session expired! Please login and try again."]), window.location.href = "./login"), !success) {
				throw new Error(\`status \${status} - \${message}\`);
			}
			handleTgFormChanges(body);
			notify("success", "Remove Telegram bot", ["Telegram bot removed successfully!"]);
		}).catch(error => console.error("Remove Telegram bot error:", error)).finally(() => stopWaiting(startWaitingResult));
	}
	function validateSettings() {
		const form = document.getElementById("configForm");
		const formData = new FormData(form);
		const noiseFields = ["udpXrayNoiseMode", "udpXrayNoisePacket", "udpXrayNoiseDelayMin", "udpXrayNoiseDelayMax", "udpXrayNoiseCount"].map(item => formData.getAll(item));
		const settings = Object.fromEntries(formData.entries());
		const [noiseModes, noisePackets, noiseDelayMins, noiseDelayMaxs, noiseCounts] = noiseFields;
		settings.xrayUdpNoises = noiseModes.map((noiseMode, index) => ({
			type: noiseMode, packet: noisePackets[index], delay: \`\${noiseDelayMins[index]}-\${noiseDelayMaxs[index]}\`, count: noiseCounts[index]
		}));
		settings.ports = [...defaultHttpPorts, ...defaultHttpsPorts].filter(item => formData.has(item.toString()));
		checkboxElements.forEach(checkboxElement => {
			settings[checkboxElement.id] = formData.has(checkboxElement.id);
		});
		selectElements.forEach(selectElement => {
			let item = settings[selectElement.id];
			if (item === "true") {
				item = true;
			}
			if (item === "false") {
				item = false;
			}
			settings[selectElement.id] = item;
		});
		inputElements.forEach(inputElement => {
			if (typeof settings[inputElement.id] == "string") {
				settings[inputElement.id] = settings[inputElement.id].trim();
			}
		});
		numInputElements.forEach(numInputElement => {
			settings[numInputElement.id] = Number(settings[numInputElement.id].trim());
		});
		textareaElements.forEach(textareaElement => {
			const id = textareaElement.id;
			const item = settings[id];
			settings[id] = item?.split("\\n").map(item2 => item2.trim()).filter(Boolean) || [];
		});
		return settings;
	}
	function logout(event) {
		event.preventDefault();
		fetch("./panel/logout", { method: "GET", credentials: "same-origin" }).then(result => result.json()).then(({ success, status, message }) => {
			if (!success) {
				throw new Error(\`status \${status} - \${message}\`);
			}
			window.location.href = "./login";
		}).catch(error => console.error("Logout error:", error));
	}
	function openResetPass(isReset) {
		const modal = document.getElementById("resetPassModal");
		const closeButton = modal.querySelector(".modal-close");
		const toggleButtons = modal.querySelectorAll(".show-hide");
		const title = modal.querySelector(".modal-title");
		const form = modal.querySelector(".config-form");
		const usernameContainer = document.getElementById("usernameContainer");
		if (!(isReset)) {
			title.textContent = "Set Password";
			usernameContainer.style.display = "flex";
			usernameContainer.setAttribute("required", "true");
		}
		closeButton.onclick = () => modal.hidden = true;
		form.onsubmit = resetPassword;
		toggleButtons.forEach(toggleButton => {
			toggleButton.onclick = () => {
				const previousElementSibling = toggleButton.previousElementSibling;
				const isHidden = previousElementSibling.type === "password";
				previousElementSibling.type = isHidden ? "text" : "password";
				toggleButton.textContent = isHidden ? "visibility" : "visibility_off";
			};
		});
		modal.hidden = false;
	}
	function resetPassword(event) {
		event.preventDefault();
		const username = document.getElementById("username").value.trim().toLowerCase();
		const errorElement = document.getElementById("passwordError");
		const newPassword = document.getElementById("newPassword").value.trim();
		if (newPassword !== document.getElementById("confirmPassword").value.trim()) {
			errorElement.textContent = "Passwords do not match";
			return false;
		}
		if (!/^(?=.*[A-Z])(?=.*\\d).{8,}$/.test(newPassword)) {
			errorElement.textContent = "Must contain at least one capital letter, one number, and be at least 8 characters long.";
			return false;
		}
		fetch("./panel/reset-password", {
			method: "POST", headers: { "Content-Type": "text/plain" }, credentials: "same-origin", body: JSON.stringify({ username: username, password: newPassword })
		}).then(result => result.json()).then(({ success, status, message }) => {
			if (!success) {
				errorElement.textContent = message;
				throw new Error(\`status \${status} - \${message}\`);
			}
			notify("success", "Reset password", ["Password changed successfully!"]);
			window.location.href = "./login";
		}).catch(error => console.error("Reset password error:", error));
	}
	function genNoisePacket(typeSelect, packetInput) {
		switch (typeSelect.value) {
			case "base64":
				packetInput.value = randBase64(32, 64);
				break;
			case "rand":
				packetInput.value = "50-100";
				break;
			case "hex":
				packetInput.value = randHex(32, 64);
				break;
			case "array":
				packetInput.value = randArray(32, 64);
				break;
			case "str": {
				const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				packetInput.value = randString(charset, 32, 64);
			}
		}
		handleProxyFormChanges();
	}
	function randUUID() {
		document.getElementById("vlUUID").value = crypto.randomUUID();
		handleProxyFormChanges();
	}
	function randString(charset, minLength, maxLength) {
		return [...randBytes(minLength, maxLength)].map(byte => charset[byte % charset.length]).join("");
	}
	function randArray(min, max) {
		const length = Math.floor(Math.random() * (max - min + 1)) + min;
		return Array.from({ length: length }, () => Math.floor(256 * Math.random())).map(String).join(",");
	}
	function randBytes(min, max) {
		const length = Math.floor(Math.random() * (max - min + 1)) + min;
		const bytes = new Uint8Array(length);
		crypto.getRandomValues(bytes);
		return bytes;
	}
	function randHex(min, max) {
		return [...randBytes(min, max)].map(byte => byte.toString(16).padStart(2, "0")).join("");
	}
	function randBase64(min, max) {
		return btoa(String.fromCharCode(...randBytes(min, max)));
	}
	function randPassword() {
		document.getElementById("trPass").value = randString("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@/* JS_PLACEHOLDER */*_-+;:,.", 16, 32);
		handleProxyFormChanges();
	}
	function randPath() {
		document.getElementById("securePath").value = randString("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", 16, 32);
		handleProxyFormChanges();
	}
	async function updatePanel(button) {
		if (!await notify("confirm", "Update BPB Panel", [\`BPB Panel verseion \${globalThis.latestVersion} is now available!\`, "Please read <a href='https://github.com/bia-pain-bache/BPB-Worker-Panel/releases/latest' target='_blank' rel='noopener noreferrer'>Release notes</a> carefully before updating.", "Are you sure?"])) {
			return;
		}
		const startWaitingResult = startWaiting(button, "", "refresh");
		fetch("./panel/update-panel", { method: "POST" }).then(result => result.json()).then(({ success, status, message }) => {
			if (!success) {
				throw new Error(\`status \${status} - \${message}\`);
			}
			notify("success", "Update panel", ["Your panel upgraded successfully!"]);
			setTimeout(() => {
				location.reload();
			}, 3e3);
		}).catch(error => {
			notify("error", "Update panel", ["Failed to update your BPB Panel, please try again."]);
			console.error("Update panel error:", error);
		}).finally(() => stopWaiting(startWaitingResult));
	}
	async function deletePanel(button) {
		if (!await notify("confirm", "Delete BPB Panel", ["This will permanently delete your panel from your Cloudflare account", "Are you sure?"])) {
			return;
		}
		const startWaitingResult = startWaiting(button, "", "refresh");
		fetch("./panel/delete-panel", { method: "POST" }).then(result => result.json()).then(({ success, status, message }) => {
			if (!success) {
				throw new Error(\`status \${status} - \${message}\`);
			}
			notify("success", "Delete panel", ["Your panel deleted successfully!"]);
		}).catch(error => {
			notify("error", "Delete panel", ["Failed to delete your BPB Panel, please try again."]);
			console.error("Delete panel error:", error);
		}).finally(() => stopWaiting(startWaitingResult));
	}
	function notify(type, title, lines) {
		return new Promise(resolve => {
			const template = document.getElementById("message-template").content.cloneNode(true);
			const modal = template.querySelector(".modal");
			modal.hidden = false;
			modal.querySelector(".message-title").textContent = title;
			modal.querySelector(".message-text").innerHTML = lines.join("\\n");
			const icon = modal.querySelector(".message-icon");
			const isPositive = type === "success" || type === "info";
			const isConfirm = type === "confirm";
			icon.textContent = isPositive ? "check_circle" : isConfirm ? "help" : "error";
			icon.style.color = isPositive ? "var(--color-icon-green)" : "var(--color-icon-red)";
			const okButton = modal.querySelector(".message-ok-btn");
			const cancelButton = modal.querySelector(".message-cancel-btn");
			const closeButton = modal.querySelector(".modal-close");
			const close = result => {
				modal.remove();
				resolve(result);
			};
			if (type === "confirm") {
				cancelButton.onclick = () => close(false);
			}
			else {
				cancelButton.style.display = "none";
			}
			if (type === "info") {
				okButton.style.display = "none";
			}
			else {
				okButton.onclick = () => close(true);
			}
			closeButton.onclick = () => close(false);
			document.body.appendChild(template);
			if (type === "info") {
				setTimeout(() => {
					modal.remove();
					resolve(null);
				}, 1e3);
			}
		});
	}
	function startWaiting(button, buttonId, iconText, clockwise = true) {
		document.body.classList.add("is-loading");
		const icon = (button ?? document.getElementById(buttonId)).querySelector("span");
		const textContent = icon.textContent;
		if (iconText) {
			icon.textContent = iconText;
		}
		icon.classList.add((clockwise ? "cw" : "ccw") + "-spinning");
		return { icon: icon, initIcon: textContent };
	}
	function stopWaiting(waiting) {
		document.body.classList.remove("is-loading");
		const { icon, initIcon } = waiting;
		icon.classList.remove("cw-spinning");
		icon.classList.remove("ccw-spinning");
		if (initIcon !== icon.textContent) {
			icon.textContent = initIcon;
		}
	}
	function elm(tag, props = {}, children = []) {
		const element = document.createElement(tag);
		Object.assign(element, props);
		element.append(...[].concat(children));
		return element;
	}
	getUsage();
	initPanel();
	fetchIPInfo();
	const createIcon = name => elm("span", { className: "material-symbols-rounded", textContent: name });
	function createFormControl(label, withIcon) {
		const labelElement = elm("span", { textContent: label }, withIcon ? createIcon("refresh") : []);
		return elm("div", { className: "form-control" }, [labelElement, elm("div")]);
	}
	async function deleteNoise(event) {
		if (await notify("confirm", "Delete UDP noise", ["Are you sure?"])) {
			event.target.closest(".inner-container").remove();
			handleProxyFormChanges();
		}
	}
	function addNoise(markChanged, noiseIndex, noise) {
		const noiseIndex2 = noiseIndex || document.getElementById("noises").childElementCount;
		const noise2 = noise || {
			type: "rand", packet: "50-100", delay: "1-5", count: 5
		};
		const elmResult = elm("h4", { textContent: \`Noise \${noiseIndex2 + 1}\` });
		const elmResult2 = elm("div", { className: "header-container" }, elmResult);
		if (noiseIndex2 !== 0) {
			const elmResult3 = elm("button", { type: "button", className: "delete-noise", onclick: deleteNoise }, createIcon("delete"));
			elmResult2.appendChild(elmResult3);
		}
		const mapped = [["base64", "Base64"], ["rand", "Random"], ["str", "String"], ["hex", "Hex"], ["array", "Array"]].map(([key, value]) => elm("option", { value: key, textContent: value, selected: noise2.type === key }));
		const elmResult4 = elm("select", { name: "udpXrayNoiseMode" }, mapped);
		const formControl = createFormControl("Mode");
		const value2 = formControl.querySelector("div");
		value2.className = "select-wrapper";
		value2.append(elmResult4, createIcon("keyboard_arrow_down"));
		const elmResult5 = elm("input", { type: "text", name: "udpXrayNoisePacket", value: noise2.packet });
		const formControl2 = createFormControl("Packet", true);
		formControl2.querySelector("div").appendChild(elmResult5);
		const value3 = formControl2.querySelector(".material-symbols-rounded");
		elmResult4.onchange = value3.onclick = () => genNoisePacket(elmResult4, elmResult5);
		const elmResult6 = elm("input", {
			type: "number", name: "udpXrayNoiseCount", value: String(noise2.count), min: "1", required: true
		});
		const formControl3 = createFormControl("Count");
		formControl3.querySelector("div").appendChild(elmResult6);
		const [key2, value4] = noise2.delay.split("-");
		const elmResult7 = elm("input", {
			type: "number", name: "udpXrayNoiseDelayMin", value: key2, min: "1", required: true
		});
		const elmResult8 = elm("input", {
			type: "number", name: "udpXrayNoiseDelayMax", value: value4, min: "1", required: true
		});
		const elmResult9 = elm("div", { className: "min-max" }, [elmResult7, elm("span", { textContent: " - " }), elmResult8]);
		const formControl4 = createFormControl("Delay");
		formControl4.querySelector("div").appendChild(elmResult9);
		const elmResult10 = elm("div", { className: "section" }, [formControl, formControl2, formControl3, formControl4]);
		const elmResult11 = elm("div", { className: "inner-container" }, [elmResult2, elmResult10]);
		document.getElementById("noises").append(elmResult11);
		if (markChanged) {
			handleProxyFormChanges(true);
		}
	}
	function renderPorts(selectedPorts) {
		let nonTlsFragment = document.createDocumentFragment();
		let tlsFragment = document.createDocumentFragment();
		[...window.origin.includes("workers.dev") ? defaultHttpPorts : [], ...defaultHttpsPorts].forEach(item => {
			const isSelected = selectedPorts.includes(item);
			const isTls = defaultHttpsPorts.includes(item);
			const elmResult = elm("input", {
				type: "checkbox", name: String(item), value: "true", checked: isSelected
			});
			const elmResult2 = elm("span", { textContent: String(item) });
			const elmResult3 = elm("div", { className: "checkbox-wrapper" }, [elmResult, elmResult2]);
			if (isTls) {
				tlsFragment.appendChild(elmResult3);
			}
			else {
				nonTlsFragment.appendChild(elmResult3);
			}
		});
		const tlsContainer = document.getElementById("tls-ports");
		tlsContainer.innerHTML = "";
		tlsContainer.appendChild(tlsFragment);
		const nonTlsContainer = document.getElementById("non-tls-ports");
		if (nonTlsFragment.childElementCount > 0) {
			nonTlsContainer.innerHTML = "";
			nonTlsContainer.appendChild(nonTlsFragment);
			document.getElementById("none-tls").style.display = "flex";
		}
	}
	function renderNoises(noises) {
		document.getElementById("noises").innerHTML = "";
		noises.forEach((noise, index) => {
			addNoise(false, index, noise);
		});
	}
	function renderSubscriptions(subscriptions) {
		if (subscriptions) {
			for (const [key, { label, categories }] of Object.entries(subscriptions)) {
				const elmResult = elm("a", {
					className: "help-icon", href: \`https://bia-pain-bache.github.io/BPB-Worker-Panel/usage/\${key}/\`, target: "_blank", title: "Help"
				}, createIcon("info"));
				const elmResult2 = elm("h3", { textContent: label });
				const elmResult3 = elm("summary", {}, elmResult2);
				const elmResult4 = elm("details", {}, elmResult3);
				const elmResult5 = elm("table", {}, categories.map(({ core, clients }) => {
					const elmResult6 = elm("td", {}, clients.map(item => {
						const icon = createIcon("verified");
						const elmResult7 = elm("span", { textContent: item });
						return elm("div", {}, [icon, elmResult7]);
					}));
					const subUrl = generateSubUrl(key, core, label);
					const elmResult8 = elm("td");
					if (!["wireguard", "amnezia"].includes(core)) {
						const elmResult7 = elm("button", { title: "Display QR code", onclick: () => showQRCode(subUrl) }, createIcon("qr_code"));
						const elmResult9 = elm("button", { title: "Copy subscription URL", onclick: () => copyToClipboard(subUrl) }, createIcon("content_copy"));
						elmResult8.append(elmResult7, elmResult9);
					}
					if (key !== "raw") {
						const elmResult7 = elm("button", { title: "Download config", onclick: () => dlUrl(subUrl) }, createIcon("download"));
						elmResult8.appendChild(elmResult7);
					}
					return elm("tr", {}, [elmResult6, elmResult8]);
				}));
				const elmResult10 = elm("div", { className: "table-container" }, elmResult5);
				elmResult4.appendChild(elmResult10);
				const elmResult11 = elm("div", { className: "accordion-item" }, [elmResult4, elmResult]);
				document.getElementById("subscriptions").appendChild(elmResult11);
			}
		}
	}
	function renderClients(clients) {
		if (clients) {
			clients.forEach(client => {
				const elmResult = elm("td", { scope: "col", textContent: client.name });
				const elmResult2 = elm("td", { scope: "col", textContent: client.minVer });
				const elmResult3 = elm("span", { textContent: client.source });
				const elmResult4 = elm("a", { href: client.url, target: "_blank", rel: "noopener noreferrer" }, createIcon("download"));
				const elmResult5 = elm("td", {}, [elmResult3, elmResult4]);
				const elmResult6 = elm("tr", {}, [elmResult, elmResult2, elmResult5]);
				document.getElementById("supported-clients").appendChild(elmResult6);
			});
		}
	}
</script>
</body>
</html>`;

// ── صفحه‌ی ورود ──
const LOGIN_HTML_CONTENT = `<!DOCTYPE html>
<html lang=en>
	<head>
		<meta charset=UTF-8>
		<meta name=viewport content="width=device-width,initial-scale=1"><title>BPB Panel v5.1.1</title>
		<link id=favicon rel=icon type=image/x-icon href=data:image/x-icon;base64,__ICON__>
		<link rel=preconnect href=https://fonts.googleapis.com>
		<link rel=preconnect href=https://fonts.gstatic.com crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel=stylesheet>
		<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=login,visibility,visibility_off&display=block" rel=stylesheet>
<style>
	:root {
		--color-bg-main: linear-gradient(90deg, #000328, #00458E);
		--color-bg-card: rgba(15, 23, 42, 0.5);
		--color-bg-input: rgba(2, 6, 23, 0.5);
		--color-bg-btn: #3b82f629;
		--color-text-primary: #f1f5f9;
		--color-text-secondary: #aec4e2;
		--color-text-btn: #a5ccfc;
		--color-brand-primary: #3b82f6;
		--color-brand-hover: #60a5fa;
		--color-border-accent: color-mix(in srgb, var(--color-brand-hover), transparent 79%);
		--radius-card: 1.5rem;
		--radius-ui: 0.75rem;
		--radius-btn: 1rem;
		--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.2),0 20px 40px -15px rgba(0, 3, 40, 0.5),0 35px 60px -15px rgba(0, 69, 142, 0.3);
		--shadow-input: inset 0 2px 4px rgba(0, 0, 0, 0.3),0 1px 2px rgba(255, 255, 255, 0.05);
		--shadow-input-focus: 0 0 0 3px rgba(59, 130, 246, 0.4),0 8px 20px -4px rgba(59, 130, 246, 0.3);
		--shadow-header: 0.125rem 0.125rem 0.25rem #000328;
		--shadow-icon: 0.125rem 0.125rem 0.2rem #000328;
		--space-xl: 1.5rem;
		--space-sm: 0.5rem;
		--space-md: 0.85rem;
		--font-size-base: 1rem;
		--transition-standard: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		--element-border-radius:10px
	}
	body, html {
		height: 100%;
		margin:0
	}
	body {
		font-family: Ubuntu,system-ui;
		position: relative;
		overflow: hidden;
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background:var(--color-bg-main)
	}
	.container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		width:90%
	}
	h1 {
		color: var(--color-text-primary);
		text-shadow: var(--shadow-header);
		display: flex;
		justify-content: center;
		align-items: stretch;
		gap:var(--space-sm)
	}
	.header {
		display: flex;
		align-items: center;
		justify-content:center
	}
	.icon {
		height:2.5rem
	}
	.panel-version {
		align-self: flex-start;
		font-size:large
	}
	h2 {
		color: var(--color-text-secondary);
		margin-top:0
	}
	.form-container {
		max-width: 95%;
		margin: 0 auto;
		margin-bottom: 30px;
		background-color: var(--color-bg-card);
		border: 1px solid var(--color-border-accent);
		border-radius: var(--radius-card);
		padding: var(--space-xl);
		box-shadow:var(--shadow-card)
	}
	.login-form {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: center;
		width:100%
	}
	.form-control {
		display: flex;
		gap: 12px;
		flex-direction: column;
		align-items: flex-start;
		width:100%
	}
	label {
		font-weight: 500;
		color:var(--color-text-secondary)
	}
	.input-wrapper {
		display: flex;
		width: 100%;
		position:relative
	}
	.toggle-password {
		position: absolute;
		top: 50%;
		right: 10px;
		transform: translateY(-50%);
		cursor: pointer;
		user-select: none;
		color:#a9a9a9
	}
	input[type=password], input[type=text] {
		box-sizing: border-box;
		width: 100%;
		text-align: center;
		margin: 0;
		padding: 10px;
		border: none;
		border-radius: var(--radius-ui);
		color: var(--color-text-primary);
		background-color: var(--color-bg-input);
		line-height: 1.5;
		outline: 0;
		font-size: var(--font-size-base);
		font-family: inherit;
		box-shadow: var(--shadow-input);
		transition:var(--transition-standard)
	}
	input[type=password]:focus, input[type=text]:focus {
		border-color: var(--color-brand-primary);
		box-shadow: var(--shadow-input-focus);
		outline:0
	}
	.hint {
		color: red;
		margin-bottom:10px
	}
	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		justify-self: center;
		gap: 4px;
		width: max-content;
		white-space: nowrap;
		padding: var(--space-md);
		font-size: var(--font-size-base);
		font-weight: 600;
		border: 1px solid var(--color-border-accent);
		border-radius: var(--radius-btn);
		color: var(--color-text-btn);
		background: var(--color-bg-btn);
		cursor: pointer;
		outline: 0;
		box-shadow: 0 5px 10px rgba(0,0,0,.2);
		transition:all .3s ease
	}
	button:hover {
		background-color: var(--color-brand-primary);
		box-shadow: 0 8px 15px rgba(0,0,0,.3);
		transform: translateY(-2px);
		color:var(--color-text-primary)
	}
	button:active {
		transform: translateY(1px);
		box-shadow:0 3px 7px rgba(0,0,0,.3)
	}
	.material-symbols-rounded {
		font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24
	}
	@media only screen and (min-width:576px) {
		.container {
			width:70%
		}
	}
	@media only screen and (min-width:768px) {
		.container {
			width:50%
		}
	}
	@media only screen and (min-width:992px) {
		.container {
			width:30%
		}
	}
</style>
</head>
<body>
	<div class=container>
		<div class=header><img id=header-logo src=data:image/x-icon;base64,__ICON__ alt="BPB Logo" width=48 height=48><h1>BPB Panel <span class=panel-version>v5.1.1</span></h1>
		</div>
		<div class=form-container><h2>User Login</h2>
			<form id=loginForm class=login-form>
				<div class=form-control><label for=username>Cloudflare Email</label> <input type=text id=username class=input-wrapper name=username required>
				</div>
				<div class=form-control><label for=password>Password</label>
					<div class=input-wrapper><input type=password id=password name=password required> <span id=togglePassword class="material-symbols-rounded toggle-password">visibility_off</span>
					</div>
				</div>
				<div id=passwordError class=hint>
				</div><button type=submit class=button><span class=material-symbols-rounded>login </span>Login</button>
			</form>
		</div>
	</div>
<script>
	document.getElementById("loginForm").addEventListener("submit", async (event) => {
		event.preventDefault();
		const lower = document.getElementById("username").value.trim().toLowerCase();
		const trimmed = document.getElementById("password").value.trim();
		try {
			const response = await fetch("./login/authenticate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: lower, password: trimmed }) });
			const { success, status, message } = await response.json();
			if (!success) {
				document.getElementById("passwordError").textContent = "⚠️ Wrong Credentials.";
				throw new Error(\`Login failed with status \${status}: \${message}\`);
			}
			window.location.href = "./panel";
		}
		catch (error) {
			console.error("Login error:", error.message || error);
		}
	});
	document.getElementById("togglePassword").addEventListener("click", function () {
		const value = document.getElementById("password");
		const value2 = value.type === "password";
		value.type = value2 ? "text" : "password";
		this.textContent = value2 ? "visibility_off" : "visibility";
	});
</script>
</body>
</html>`;

// ── صفحه‌ی خطا ──
const ERROR_HTML_CONTENT = `<!DOCTYPE html>
<html lang=en>
	<head>
		<meta charset=UTF-8>
		<meta name=viewport content="width=device-width,initial-scale=1"><title>BPB Panel v5.1.1</title>
		<link id=favicon rel=icon type=image/x-icon href=data:image/x-icon;base64,__ICON__>
		<link rel=preconnect href=https://fonts.googleapis.com>
		<link rel=preconnect href=https://fonts.gstatic.com crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel=stylesheet>
<style>
	:root {
		--color-bg-main: linear-gradient(90deg, #000328, #00458E);
		--color-text-primary: #f1f5f9;
		--color-text-secondary: #aec4e2;
		--shadow-header: 0.125rem 0.125rem 0.25rem #000328;
		--space-sm:0.5rem
	}
	body, html {
		height: 100%;
		width: 100%;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: Ubuntu,system-ui;
		color: var(--color-text-secondary);
		background: var(--color-bg-main);
		text-align: center;
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing:grayscale
	}
	h1 {
		color: var(--color-text-primary);
		text-shadow: var(--shadow-header);
		display: flex;
		justify-content: center;
		align-items: stretch;
		gap:var(--space-sm)
	}
	.header {
		display: flex;
		align-items: center;
		justify-content:center
	}
	.icon {
		height:2.5rem
	}
	.panel-version {
		align-self: flex-start;
		font-size:large
	}
</style>
</head>
<body>
	<div id=error-container>
		<div class=header><img id=header-logo src=data:image/x-icon;base64,__ICON__ alt="BPB Logo" width=48 height=48><h1>BPB Panel <span class=panel-version>v5.1.1</span></h1>
		</div>
		<div><h2>❌ Something went wrong!</h2><p><b>__ERROR_MESSAGE__</b></p>
		</div>
	</div>
</body>
</html>`;

// ── تست پروکسی‌آی‌پی ──
const PROXY_IP_HTML_CONTENT = `<!DOCTYPE html>
<html lang=en>
	<head>
		<meta charset=UTF-8>
		<meta name=viewport content="width=device-width,initial-scale=1"><title>BPB Panel v5.1.1</title>
		<link id=favicon rel=icon type=image/x-icon href=data:image/x-icon;base64,__ICON__>
		<link rel=preconnect href=https://fonts.googleapis.com>
		<link rel=preconnect href=https://fonts.gstatic.com crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel=stylesheet>
		<link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=content_copy,flash_on&display=block">
<style>
	:root {
		--color-brand-primary: #3b82f6;
		--color-bg-main: linear-gradient(90deg, #000328, #00458E);
		--color-bg-card: rgba(15, 23, 42, 0.5);
		--color-text-primary: #f1f5f9;
		--color-text-secondary: #aec4e2;
		--color-border: #60a5fa36;
		--color-table-active: rgba(2, 6, 23, 0.5);
		--shadow-header: 0.125rem 0.125rem 0.25rem #000328;
		--shadow-table: 0 0 0 1px rgba(255, 255, 255, 0.04),0 2px 6px rgba(0, 0, 0, 0.06),0 12px 30px rgba(0, 0, 0, 0.08);
		--space-sm: 0.5rem;
		--space-md: 0.85rem;
		--radius-ui:0.75rem
	}
	body {
		font-family: "Twemoji Country Flags",Ubuntu,system-ui;
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background:var(--color-bg-main)
	}
	body.is-loading {
		cursor:wait
	}
	body.is-loading * {
		cursor: wait!important;
		pointer-events:none
	}
	*, ::after, ::before {
		box-sizing:border-box
	}
	h1 {
		color: var(--color-text-primary);
		text-shadow: var(--shadow-header);
		display: flex;
		justify-content: center;
		align-items: stretch;
		gap:var(--space-sm)
	}
	.header {
		display: flex;
		align-items: center;
		justify-content:center
	}
	.icon {
		height:2.5rem
	}
	.panel-version {
		align-self: flex-start;
		font-size:large
	}
	.table-wrapper {
		overflow-x: auto;
		width: 100%;
		text-align: center;
		padding:var(--space-md)
	}
	table {
		display: inline-table;
		border: 1px solid var(--color-border);
		border-collapse: separate;
		border-spacing: 0;
		border-radius: var(--radius-ui);
		overflow: hidden;
		background: color-mix(in srgb,var(--color-bg-card),#000328 8%);
		box-shadow:var(--shadow-table)
	}
	tbody {
		color:var(--color-bg-card)
	}
	td, th {
		text-align: center;
		white-space: nowrap;
		padding: 10px;
		border-bottom: 1px solid var(--color-border);
		color:var(--color-text-secondary)
	}
	td:first-child, th {
		background-color: var(--color-table-active);
		font-weight: 700;
		color:var(--color-text-primary)
	}
	td:first-child {
		color:var(--color-text-secondary)
	}
	td:nth-child(2) {
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--color-text-primary);
		justify-content:space-between
	}
	td:nth-child(3), td:nth-child(4) {
		color: var(--color-text-primary);
		font-weight: 700;
		color:var(--color-text-primary)
	}
	.material-symbols-rounded {
		color: var(--color-brand-primary);
		cursor: pointer;
		font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24
	}
	.material-symbols-rounded:hover {
		scale:calc(1.2)
	}
</style>
</head>
<body>
	<div class=header><img id=header-logo src=data:image/x-icon;base64,__ICON__ alt="BPB Logo" width=48 height=48><h1>BPB Panel <span class=panel-version>v5.1.1</span></h1>
	</div>
	<div class=table-wrapper>
		<table id=geo-table>
			<thead>
				<tr><th>#</th><th>Proxy IP</th><th>Health rate</th><th>TCP Latency (ms)</th><th>Country</th><th>City</th><th>ISP</th>
				</tr>
			</thead>
			<tbody>
				<tr><td colspan=5>Loading...</td>
				</tr>
			</tbody>
		</table>
	</div>
<script type=module>
	import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";
	polyfillCountryFlagEmojis();
</script>
<script>
	async function loadGeoData() {
		const value = document.querySelector("#geo-table tbody");
		try {
			const response = await fetch("./proxy-ip/get");
			const { success, body, message } = await response.json();
			if (!success) {
				throw new Error(\`Fetching Proxy IPs failed at \${response.url} - \${message}\`);
			}
			if (!body.length) {
				const elmResult = elm("td", { textContent: "Failed to get Proxy IPs", colSpan: "5" });
				const elmResult2 = elm("tr", {}, [elmResult]);
				value.innerHTML = "";
				return void value.appendChild(elmResult2);
			}
			value.innerHTML = "";
			body.forEach((item, index) => {
				const elmResult = elm("td", { textContent: String(index + 1) });
				const icon = createIcon("content_copy", "Copy to clipboard");
				const value2 = document.createTextNode(\` \${item.ip || "-"}\`);
				const icon2 = createIcon("flash_on", "Test IP");
				const elmResult2 = elm("td", {}, [icon, value2, icon2]);
				const elmResult3 = elm("td", { textContent: "-" });
				const elmResult4 = elm("td", { textContent: "-" });
				const elmResult5 = elm("td", {
					textContent: \`\${item.countryCode ? String.fromCodePoint(...[...item.countryCode].map(item2 => 127462 + item2.charCodeAt(0) - 65)) : ""} \${item.country || "-"}\`
				});
				const elmResult6 = elm("td", { textContent: item.city || "-" });
				const elmResult7 = elm("td", { textContent: item.isp || "-" });
				icon.addEventListener("click", () => copyToClipboard(item.ip));
				icon2.addEventListener("click", () => testIp(item.ip, elmResult3, elmResult4));
				const elmResult8 = elm("tr", {}, [elmResult, elmResult2, elmResult3, elmResult4, elmResult5, elmResult6, elmResult7]);
				value.appendChild(elmResult8);
			});
		}
		catch (error) {
			const elmResult = elm("td", { colSpan: "5", textContent: \`Error: \${error.message}\` });
			const elmResult2 = elm("tr", {}, [elmResult]);
			value.innerHTML = "";
			value.appendChild(elmResult2);
			console.error(error);
		}
	}
	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).then(() => alert("✅ Copied to clipboard:\\n\\n" + text)).catch(error => console.error("Failed to copy:", error));
	}
	function testIp(ip, successRateElement, latencyElement) {
		document.body.classList.add("is-loading");
		fetch(\`./proxy-ip/test?target=\${ip}\`).then(result => result.json()).then(({ success, status, message, body }) => {
			if (!success) {
				throw new Error(\`Failed with status \${status} - \${message}\`);
			}
			const { successRate, avgLatencyMs } = body;
			successRateElement.textContent = successRate;
			latencyElement.textContent = avgLatencyMs;
			document.body.classList.remove("is-loading");
		}).catch(error => console.error(\`Failed to test IP: \${error}\`));
	}
	function elm(tag, props = {}, children = []) {
		const element = document.createElement(tag);
		Object.assign(element, props);
		element.append(...[].concat(children));
		return element;
	}
	loadGeoData();
	const createIcon = (name, title) => elm("span", { className: "material-symbols-rounded", textContent: name, title: title });
</script>
</body>
</html>`;

// ── پنل زئوس ──
const ZEUS_HTML_CONTENT = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>⚡ Zeus | تنظیمات</title>
<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,__ICON__">
<style>
:root{--bg:#0a0d1c;--bg2:#10163a;--card:#141b38cc;--line:#2a3560;--fg:#eceffa;--mute:#98a1c2;--acc:#6366f1;--acc2:#06b6d4;--hot:#d946ef;--ok:#10b981;--warn:#f59e0b;--bad:#ef4444;--glow:0 0 0 1px #6366f155,0 8px 40px #6366f122}
@media(prefers-color-scheme:light){:root{--bg:#f3f4fb;--bg2:#e6e9fb;--card:#ffffffdd;--line:#d6dbf1;--fg:#161a2d;--mute:#5a6180;--glow:0 0 0 1px #6366f133,0 8px 30px #6366f114}}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{min-height:100vh;color:var(--fg);font:15px/1.8 'Segoe UI',Tahoma,system-ui,sans-serif;background:radial-gradient(900px 500px at 85% -10%,#6366f133,transparent 60%),radial-gradient(700px 420px at 0% 10%,#06b6d426,transparent 60%),radial-gradient(600px 400px at 50% 110%,#d946ef1f,transparent 60%),var(--bg);padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}
.wrap{max-width:860px;margin:0 auto;padding:0 16px 60px}
header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:20px 0}
.brand{display:flex;align-items:center;gap:10px;font-weight:900;font-size:22px;letter-spacing:.3px}
.bolt{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:22px;background:linear-gradient(135deg,var(--acc),var(--hot));box-shadow:0 0 24px #d946ef66}
.brand small{display:block;font-size:11px;font-weight:600;color:var(--mute);letter-spacing:0}
.back{padding:8px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--fg);text-decoration:none;font-size:13px;font-weight:700;backdrop-filter:blur(8px)}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:18px;margin-bottom:16px;box-shadow:var(--glow);backdrop-filter:blur(10px)}
.card h2{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:800;margin-bottom:4px}
.card h2 i{font-style:normal;display:grid;place-items:center;width:30px;height:30px;border-radius:10px;background:linear-gradient(135deg,var(--acc),var(--acc2));font-size:15px}
.hint{color:var(--mute);font-size:12.5px;margin-bottom:12px}
label.f{display:block;font-size:12.5px;font-weight:700;color:var(--mute);margin:10px 0 4px}
input[type=text],input[type=number],select,textarea{width:100%;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:#0000002e;color:var(--fg);font:inherit;outline:none;direction:ltr;text-align:left}
@media(prefers-color-scheme:light){input[type=text],input[type=number],select,textarea{background:#fff}}
input:focus,select:focus,textarea:focus{border-color:var(--acc);box-shadow:0 0 0 3px #6366f133}
textarea{min-height:120px;font:12px/1.6 ui-monospace,Menlo,Consolas,monospace;resize:vertical}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end}
.row>*{flex:1 1 150px}
.btn{cursor:pointer;border:0;border-radius:12px;padding:10px 16px;font:inherit;font-weight:800;color:#fff;background:linear-gradient(135deg,var(--acc),var(--acc2));box-shadow:0 6px 18px #6366f144;transition:transform .15s,filter .15s}
.btn:hover{filter:brightness(1.1);transform:translateY(-1px)}.btn:active{transform:none}
.btn:disabled{opacity:.5;cursor:wait}
.btn.hot{background:linear-gradient(135deg,var(--hot),var(--acc));box-shadow:0 6px 18px #d946ef44}
.btn.ok{background:linear-gradient(135deg,var(--ok),var(--acc2));box-shadow:0 6px 18px #10b98144}
.btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line);box-shadow:none}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.chip{cursor:pointer;padding:4px 10px;border-radius:99px;border:1px solid var(--line);font-size:12.5px;font-weight:700;background:#ffffff0a;color:var(--fg)}
.chip b{color:var(--acc2);margin-inline-start:4px}
.chip.on{background:linear-gradient(135deg,var(--acc),var(--hot));border-color:transparent;color:#fff}.chip.on b{color:#fff}
.sw{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-top:1px dashed var(--line)}
.sw:first-of-type{border-top:0}
.sw .t{font-weight:800}.sw .d{font-size:12px;color:var(--mute)}
.tg{position:relative;flex:none;width:52px;height:30px}
.tg input{position:absolute;opacity:0;inset:0;cursor:pointer;z-index:2}
.tg span{position:absolute;inset:0;border-radius:99px;background:#64748b66;transition:.2s}
.tg span:after{content:"";position:absolute;top:3px;inset-inline-start:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 2px 6px #0006}
.tg input:checked+span{background:linear-gradient(135deg,var(--ok),var(--acc2));box-shadow:0 0 16px #10b98166}
.tg input:checked+span:after{transform:translateX(-22px)}
.stat{font-size:12px;color:var(--mute);margin-top:8px}.stat b{color:var(--fg)}
.actions{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
#toast{position:fixed;inset-inline:0;bottom:calc(20px + env(safe-area-inset-bottom));display:flex;justify-content:center;pointer-events:none;z-index:9}
#toast div{padding:10px 18px;border-radius:14px;color:#fff;font-weight:800;font-size:13.5px;box-shadow:0 10px 30px #0008;opacity:0;transform:translateY(10px);transition:.25s}
#toast div.show{opacity:1;transform:none}
.dd{position:relative;margin-top:10px}
.dd-b{width:100%;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;border-radius:12px;border:1px solid var(--line);background:#0000002e;color:var(--fg);font:inherit;font-weight:800}
@media(prefers-color-scheme:light){.dd-b{background:#fff}}
.dd-b:hover,.dd.open .dd-b{border-color:var(--acc)}.dd-b i{font-style:normal;transition:.2s}.dd.open .dd-b i{transform:rotate(180deg)}
.dd-p{display:none;margin-top:6px;padding:8px;border-radius:14px;border:1px solid var(--line);background:var(--bg2);box-shadow:0 18px 50px #0008}.dd.open .dd-p{display:block}
.dd-l{max-height:300px;overflow:auto;margin-top:8px;display:flex;flex-direction:column;gap:3px}
.di{cursor:pointer;display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:11px;direction:ltr;border:1px solid transparent}
.di:hover{background:#ffffff10}.di.on{background:linear-gradient(135deg,#6366f155,#06b6d433)}
.di .fl{font-size:22px;line-height:1;flex:none}.di .en{font-weight:800;font-size:13.5px}.di .fa{direction:rtl;color:var(--mute);font-size:13px}
.di .sub{margin-inline-start:auto;font-size:11.5px;color:var(--mute);white-space:nowrap}
.dd-e{padding:10px;color:var(--mute);font-size:13px}
details{margin-top:8px}summary{cursor:pointer;font-weight:700;color:var(--acc2);font-size:13px}
.out{margin-top:12px;display:none}.out.show{display:block}
</style>
</head>
<body>
<div class="wrap">
<header>
  <div class="brand"><div class="bolt">⚡</div><div>Zeus<small id="host">…</small></div></div>
  <a class="back" id="back" href="#">← پنل BPB</a>
</header>

<section class="card">
  <h2><i>🌍</i> ثابت کردن کشور (IATA)</h2>
  <p class="hint">یک یا چند کد ۲ حرفی با کاما (مثل FR,NL). برای هر کشور یک ست کانفیگ ساخته می‌شه که اسم، کشور و پرچمش مال همون کشوره و پروکسی‌آی‌پی‌اش هم از همون کشور انتخاب می‌شه.</p>
  <div class="row">
    <div><label class="f">کد کشورها</label><input type="text" id="pin" maxlength="40" placeholder="FR,NL" oninput="this.value=this.value.toUpperCase()"></div>
    <button class="btn" onclick="savePin()">ذخیره</button>
    <button class="btn ghost" id="bGeo" onclick="refreshGeo()">↻ بروزرسانی کشورها</button>
  </div>
  <div class="chips" id="chips"></div>
  <div class="dd" id="dd"><button type="button" class="dd-b" id="ddB" onclick="toggleDd()"><span id="ddT">🌍 انتخاب کشور</span><i>▾</i></button>
    <div class="dd-p"><input type="text" id="ddQ" placeholder="🔎 Search / جستجو: France، فرانسه، FR" oninput="paintDd()"><div class="dd-l" id="ddL"></div></div></div>
  <div class="stat" id="geoStat"></div>
</section>

<section class="card">
  <h2><i>🧼</i> آی‌پی تمیز (Ip.txt)</h2>
  <p class="hint">لیست از ریپوی زیر خونده و توی دیتابیس D1 ذخیره می‌شه و خودکار وارد ساب می‌شه.</p>
  <div class="sw" style="border:0;padding-top:0"><div><div class="t">استفاده از آی‌پی تمیز</div></div><label class="tg"><input type="checkbox" id="cEn" onchange="saveClean()"><span></span></label></div>
  <label class="f">آدرس منبع</label><input type="text" id="cSrc">
  <div class="row">
    <div><label class="f">اپراتور</label><select id="cOp"><option value="all">all (همه)</option></select></div>
    <div><label class="f">تعداد آی‌پی</label><input type="number" id="cCnt" min="1" max="200"></div>
    <div><label class="f">بروزرسانی خودکار (دقیقه)</label><input type="number" id="cTtl" min="5" max="10080"></div>
  </div>
  <div class="row" style="margin-top:12px">
    <button class="btn" onclick="saveClean()">ذخیره</button>
    <button class="btn ok" id="bSync" onclick="syncClean()">⟳ همگام‌سازی همین الان</button>
  </div>
  <div class="stat" id="cStat"></div>
</section>

<section class="card">
  <h2><i>🎛</i> کلیدها</h2>
  <p class="hint">روی خروجی ساب Raw اعمال می‌شن.</p>
  <div class="sw"><div><div class="t">📢 کانفیگ‌های اطلاع‌رسانی</div><div class="d">۲ کانفیگ پیام + یک کانفیگ مصرف امروز (نیازمند توکن کلادفلر)</div></div><label class="tg"><input type="checkbox" id="tInfo" onchange="saveToggles()"><span></span></label></div>
  <div class="sw"><div><div class="t">🚀 بهینه‌ساز (Patterniha)</div><div class="d">فرگمنت پیشرفته + سایفرسوییت روی همه لینک‌های TLS</div></div><label class="tg"><input type="checkbox" id="tOpt" onchange="saveToggles()"><span></span></label></div>
  <div class="sw"><div><div class="t">🏷 نام‌گذاری Zeus</div><div class="d">ریمارک کانفیگ‌ها به شکل کشور | پرچم | نام</div></div><label class="tg"><input type="checkbox" id="tNames" onchange="saveToggles()"><span></span></label></div>
  <div class="sw"><div><div class="t">🔐 ECH</div><div class="d">Chrome fingerprint + پارامتر ech روی همه لینک‌های TLS</div></div><label class="tg"><input type="checkbox" id="tEch" onchange="saveToggles()"><span></span></label></div>
  <details><summary>تنظیمات ECH و متن‌های اطلاع‌رسانی</summary>
    <div class="row"><div><label class="f">ECH SNI</label><input type="text" id="eSni"></div><div><label class="f">ECH DoH</label><input type="text" id="eDoh"></div></div>
    <label class="f">متن کانفیگ اطلاع‌رسانی ۱</label><input type="text" id="i1" style="direction:rtl;text-align:right">
    <label class="f">متن کانفیگ اطلاع‌رسانی ۲</label><input type="text" id="i2" style="direction:rtl;text-align:right">
    <div style="margin-top:10px"><button class="btn" onclick="saveToggles(true)">ذخیره</button></div>
  </details>
</section>

<section class="card">
  <h2><i>🧪</i> ابزارها</h2>
  <div class="actions">
    <button class="btn hot" onclick="noFilter(this)">no filtering — ساخت ۴ کانفیگ برای هر کشور</button>
    <button class="btn" onclick="copyAll(this)">📋 کپی همه کانفیگ‌ها</button>
  </div>
  <div class="out" id="out"><label class="f" id="outT"></label><textarea id="outA" readonly dir="ltr"></textarea><div style="margin-top:8px"><button class="btn ghost" onclick="copyOut()">کپی</button></div></div>
</section>
</div>
<div id="toast"><div id="toastI"></div></div>

<script>
const BASE=location.pathname.replace(/\\/+$/,''),ROOT=BASE.replace(/\\/zeus$/,'');
document.getElementById('back').href=ROOT+'/panel';
const $=id=>document.getElementById(id);let S=null,tt;
function toast(msg,ok=true){const e=$('toastI');e.textContent=msg;e.style.background=ok?'linear-gradient(135deg,#10b981,#06b6d4)':'linear-gradient(135deg,#ef4444,#d946ef)';e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),2600)}
async function api(p,body){const r=await fetch(BASE+'/api/'+p,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(r.status===401){location.href=ROOT+'/login';throw new Error('401')}const j=await r.json();if(!j.success)throw new Error(j.message||('status '+j.status));return j.body}
const ago=ts=>{if(!ts)return '—';const m=Math.round((Date.now()-ts)/6e4);return m<1?'همین الان':m<90?m+' دقیقه پیش':Math.round(m/60)+' ساعت پیش'};
const flag=c=>/^[A-Z]{2}$/.test(c)?String.fromCodePoint(...[...c].map(x=>127397+x.charCodeAt(0))):'🌐';
function render(){
  const s=S.settings;$('host').textContent=S.host;$('pin').value=s.pinCountry;
  $('cEn').checked=s.cleanEnabled;$('cSrc').value=s.cleanSource;$('cCnt').value=s.cleanCount;$('cTtl').value=s.cleanTtlMin;
  $('tInfo').checked=s.infoConfigs;$('tOpt').checked=s.optimizer;$('tEch').checked=s.ech;$('tNames').checked=s.zeusNames;
  $('eSni').value=s.echSni;$('eDoh').value=s.echDoh;$('i1').value=(s.infoTexts||[])[0]||'';$('i2').value=(s.infoTexts||[])[1]||'';
  const c=S.geo?S.geo.countries:{};
  paintChips();
  $('geoStat').innerHTML=S.geo?('آخرین بروزرسانی: <b>'+ago(S.geo.ts)+'</b> — '+S.geo.total+' آی‌پی بررسی شد'+(Object.keys(c).length?'':' (کشوری پیدا نشد؛ دوباره بروزرسانی کن)')):'هنوز لیست کشورها ساخته نشده — «بروزرسانی کشورها» رو بزن.';
  const op=$('cOp');op.innerHTML='<option value="all">all (همه)</option>';
  if(S.clean)Object.entries(S.clean.ops).forEach(([k,n])=>{const o=document.createElement('option');o.value=k;o.textContent=k+' ('+n+')';op.appendChild(o)});
  op.value=[...op.options].some(o=>o.value===s.cleanOperator)?s.cleanOperator:'all';
  $('cStat').innerHTML=S.clean?('آخرین همگام‌سازی: <b>'+ago(S.clean.ts)+'</b> — '+Object.values(S.clean.ops).reduce((a,b)=>a+b,0)+' آی‌پی در '+Object.keys(S.clean.ops).length+' اپراتور'):'هنوز همگام‌سازی نشده.';
}
const dnFa=(()=>{try{return new Intl.DisplayNames(['fa'],{type:'region'})}catch{return null}})(),dnEn=(()=>{try{return new Intl.DisplayNames(['en'],{type:'region'})}catch{return null}})();
const nameFa=c=>{try{return dnFa&&dnFa.of(c)||c}catch{return c}},nameEn=c=>{try{return dnEn&&dnEn.of(c)||c}catch{return c}};
const pinsNow=()=>($('pin').value||'').split(',').filter(Boolean);
function togglePin(k){const p=pinsNow();$('pin').value=(p.includes(k)?p.filter(x=>x!==k):[...p,k]).join(',');savePin()}
function paintChips(){const ch=$('chips');ch.innerHTML='';const pins=pinsNow();
  const none=document.createElement('span');none.className='chip'+(pins.length?'':' on');none.textContent='🌐 بدون قفل';none.onclick=()=>{$('pin').value='';savePin()};ch.appendChild(none);
  pins.forEach(k=>{const e=document.createElement('span');e.className='chip on';e.textContent=flag(k)+' '+nameEn(k)+' · '+nameFa(k)+' ✕';e.onclick=()=>togglePin(k);ch.appendChild(e)});
  $('ddT').textContent='🌍 انتخاب کشور'+(pins.length?' ('+pins.length+' انتخاب‌شده)':'');paintDd()}
function paintDd(){const L=$('ddL'),t=$('ddQ').value.trim().toLowerCase(),pins=pinsNow(),c=S&&S.geo?S.geo.countries:{};L.innerHTML='';
  const list=Object.keys(c).sort((a,b)=>nameEn(a).localeCompare(nameEn(b),'en')).filter(k=>!t||(k+' '+nameEn(k)+' '+nameFa(k)).toLowerCase().includes(t));
  list.forEach(k=>{const d=document.createElement('div');d.className='di'+(pins.includes(k)?' on':'');d.innerHTML='<span class="fl">'+flag(k)+'</span><span class="en">'+nameEn(k)+'</span><span class="fa">'+nameFa(k)+'</span><span class="sub">'+k+' · '+c[k]+' IP</span>';d.onclick=()=>togglePin(k);L.appendChild(d)});
  if(!list.length)L.innerHTML='<div class="dd-e">'+(Object.keys(c).length?'چیزی پیدا نشد':'هنوز لیست کشورها ساخته نشده — «بروزرسانی کشورها» رو بزن.')+'</div>'}
function toggleDd(){const d=$('dd');d.classList.toggle('open');if(d.classList.contains('open'))$('ddQ').focus()}
document.addEventListener('click',e=>{const d=$('dd');if(!e.composedPath().includes(d))d.classList.remove('open')});
async function load(){try{S=await api('state');render()}catch(e){toast(e.message,false)}}
async function save(p,msg){try{await api('save',p);await load();toast(msg||'ذخیره شد ✓')}catch(e){toast(e.message,false)}}
const savePin=()=>save({pinCountry:$('pin').value.replace(/\\s+/g,'')});
const saveClean=()=>save({cleanEnabled:$('cEn').checked,cleanSource:$('cSrc').value.trim(),cleanOperator:$('cOp').value,cleanCount:$('cCnt').value,cleanTtlMin:$('cTtl').value});
const saveToggles=(full)=>save({infoConfigs:$('tInfo').checked,optimizer:$('tOpt').checked,ech:$('tEch').checked,zeusNames:$('tNames').checked,echSni:$('eSni').value.trim(),echDoh:$('eDoh').value.trim(),infoTexts:[$('i1').value,$('i2').value]});
async function busy(b,fn){const t=b.textContent;b.disabled=true;try{await fn()}catch(e){toast(e.message,false)}finally{b.disabled=false;b.textContent=t}}
const syncClean=()=>busy($('bSync'),async()=>{await saveClean();await api('sync-clean',{});await load();toast('آی‌پی‌های تمیز همگام شد ✓')});
const refreshGeo=()=>busy($('bGeo'),async()=>{await api('refresh-geo',{});await load();toast('لیست کشورها بروز شد ✓')});
function show(t,text){$('outT').textContent=t;$('outA').value=text;$('out').classList.add('show');$('out').scrollIntoView({behavior:'smooth',block:'center'})}
async function copy(text){try{await navigator.clipboard.writeText(text)}catch{const a=$('outA');a.select();document.execCommand('copy')}}
const noFilter=b=>busy(b,async()=>{const r=await api('nofilter');show(r.links.length+' کانفیگ no filtering ('+(S.settings.pinCountry||'بدون قفل کشور')+')',r.text);await copy(r.text);toast(r.links.length+' کانفیگ ساخته و کپی شد ✓')});
const copyAll=b=>busy(b,async()=>{const r=await api('all');show('همه کانفیگ‌ها ('+r.text.split('\\n').filter(Boolean).length+' خط)',r.text);await copy(r.text);toast('همه کانفیگ‌ها کپی شد ✓')});
const copyOut=async()=>{await copy($('outA').value);toast('کپی شد ✓')};
load();
</script>
</body>
</html>`;

// ── پنل علیرضا ──
const ALIREZA_HTML_CONTENT = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>⚡ Alireza</title>
<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,__ICON__">
<style>
:root{--bg:#080a18;--bg2:#0e1230;--card:#12173acc;--card2:#1a2050;--line:#29316b;--fg:#eef0fb;--mute:#98a1c7;--p:#7c5cff;--c:#00d1c4;--hot:#ff4fd8;--ok:#22c55e;--warn:#f59e0b;--bad:#ef4444;--r:20px}
@media(prefers-color-scheme:light){:root{--bg:#f2f3fb;--bg2:#e4e7fb;--card:#ffffffdd;--card2:#eef0ff;--line:#d3d8f0;--fg:#161a33;--mute:#5a6184}}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{min-height:100vh;color:var(--fg);font:14.5px/1.8 'Segoe UI',Tahoma,system-ui,sans-serif;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
background:radial-gradient(900px 520px at 90% -12%,#7c5cff38,transparent 60%),radial-gradient(760px 480px at -5% 8%,#00d1c426,transparent 60%),radial-gradient(700px 460px at 50% 112%,#ff4fd81f,transparent 60%),var(--bg)}
.wrap{max-width:1180px;margin:0 auto;padding:0 14px 90px}
header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 0;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px;font-weight:900;font-size:22px}
.logo{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:24px;background:linear-gradient(135deg,var(--p),var(--c));box-shadow:0 0 30px #7c5cff66}
.brand small{display:block;font-size:11.5px;font-weight:600;color:var(--mute);direction:ltr;text-align:right}
.top{display:flex;gap:8px;flex-wrap:wrap}
.btn{cursor:pointer;border:0;border-radius:13px;padding:9px 15px;font:inherit;font-weight:800;color:#fff;background:linear-gradient(135deg,var(--p),var(--c));box-shadow:0 6px 20px #7c5cff40;transition:.15s;display:inline-flex;align-items:center;gap:6px;text-decoration:none;white-space:nowrap}
.btn:hover{filter:brightness(1.1);transform:translateY(-1px)}.btn:active{transform:none}.btn:disabled{opacity:.5;cursor:wait}
.btn.g{background:var(--card);color:var(--fg);border:1px solid var(--line);box-shadow:none}
.btn.hot{background:linear-gradient(135deg,var(--hot),var(--p));box-shadow:0 6px 20px #ff4fd840}
.btn.ok{background:linear-gradient(135deg,var(--ok),var(--c))}.btn.bad{background:linear-gradient(135deg,var(--bad),var(--hot))}
.btn.s{padding:6px 11px;font-size:12.5px;border-radius:10px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}
.st{padding:14px 16px;border-radius:var(--r);background:var(--card);border:1px solid var(--line);backdrop-filter:blur(10px);position:relative;overflow:hidden}
.st:before{content:"";position:absolute;inset-inline-end:-18px;top:-18px;width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,var(--p),var(--c));opacity:.18}
.st b{display:block;font-size:24px;line-height:1.3}.st span{color:var(--mute);font-size:12.5px}
.bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
.bar input,.bar select,.f input,.f select,.f textarea,.f2 input,.f2 select{padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:#0000002e;color:var(--fg);font:inherit;outline:none;min-width:0}
@media(prefers-color-scheme:light){.bar input,.bar select,.f input,.f select,.f textarea,.f2 input,.f2 select{background:#fff}}
.bar input:focus,.f input:focus,.f select:focus,.f textarea:focus{border-color:var(--p);box-shadow:0 0 0 3px #7c5cff33}
.bar .grow{flex:1 1 200px}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{cursor:pointer;padding:5px 12px;border-radius:99px;border:1px solid var(--line);background:var(--card);font-size:12.5px;font-weight:700;color:var(--fg);user-select:none}
.chip.on{background:linear-gradient(135deg,var(--p),var(--c));border-color:transparent;color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:12px}
.u{padding:15px;border-radius:var(--r);background:var(--card);border:1px solid var(--line);backdrop-filter:blur(10px);display:flex;flex-direction:column;gap:9px;transition:.15s}
.u:hover{border-color:#7c5cff88;box-shadow:0 10px 36px #7c5cff22}
.u.off{opacity:.72}
.uh{display:flex;align-items:center;gap:9px}
.uh .n{font-weight:800;font-size:15.5px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:ltr;text-align:right}
.pill{padding:1px 10px;border-radius:99px;font-size:11.5px;font-weight:800;white-space:nowrap}
.pill.ok{background:#22c55e26;color:#4ade80}.pill.no{background:#ef444426;color:#f87171}.pill.w{background:#f59e0b26;color:#fbbf24}.pill.p{background:#7c5cff26;color:#a78bfa}
.dot{width:9px;height:9px;border-radius:50%;background:#64748b;flex:none}.dot.on{background:var(--ok);box-shadow:0 0 10px var(--ok)}
.pb{height:8px;border-radius:9px;background:#7c5cff26;overflow:hidden}.pb i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,var(--p),var(--c))}.pb i.w{background:linear-gradient(90deg,var(--warn),var(--bad))}
.ur{display:flex;justify-content:space-between;color:var(--mute);font-size:12.5px;gap:8px}.ur b{color:var(--fg)}
.tags{display:flex;gap:5px;flex-wrap:wrap}
.acts{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:2px}.acts .btn{justify-content:center;padding:7px 6px}
.empty{text-align:center;color:var(--mute);padding:60px 10px}
.sel{position:fixed;inset-inline:0;bottom:calc(14px + env(safe-area-inset-bottom));display:none;justify-content:center;z-index:30}
.sel.on{display:flex}.sel div{display:flex;gap:7px;flex-wrap:wrap;padding:10px 14px;border-radius:18px;background:var(--card2);border:1px solid var(--line);box-shadow:0 14px 50px #000a;align-items:center;max-width:96vw}
/* modals */
.m{position:fixed;inset:0;background:#000b;backdrop-filter:blur(5px);display:none;align-items:flex-start;justify-content:center;padding:14px;overflow:auto;z-index:50}
.m.on{display:flex}
.mc{width:min(720px,100%);margin:auto;background:var(--bg2);border:1px solid var(--line);border-radius:24px;box-shadow:0 30px 90px #000a;overflow:hidden}
.mh{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;border-bottom:1px solid var(--line);background:linear-gradient(135deg,#7c5cff22,#00d1c411)}
.mh h3{font-size:16.5px}.x{cursor:pointer;width:32px;height:32px;display:grid;place-items:center;border-radius:10px;background:#ffffff12;font-size:16px}
.mb{padding:16px 18px;max-height:72vh;overflow:auto}.mf{padding:12px 18px;border-top:1px solid var(--line);display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
.tabs{display:flex;gap:6px;padding:10px 18px 0;overflow:auto}.tab{cursor:pointer;padding:7px 14px;border-radius:12px 12px 0 0;font-weight:800;color:var(--mute);white-space:nowrap}.tab.on{color:#fff;background:linear-gradient(135deg,var(--p),var(--c))}
.pane{display:none}.pane.on{display:block}
.f{display:grid;grid-template-columns:1fr 1fr;gap:10px}.f>div{display:flex;flex-direction:column;gap:3px;min-width:0}.f .w2{grid-column:1/-1}
@media(max-width:560px){.f{grid-template-columns:1fr}}
label.l{font-size:12.5px;font-weight:700;color:var(--mute)}
.f input,.f select,.f textarea{width:100%;direction:ltr;text-align:left}.f textarea{min-height:90px;font:12px/1.6 ui-monospace,Menlo,Consolas,monospace;resize:vertical}
.sw,.f>.sw{display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:10px;padding:9px 12px;border-radius:14px;background:#ffffff0a;border:1px solid var(--line)}
.sw .t{font-weight:700}.sw .d{font-size:11.5px;color:var(--mute)}
.tg{position:relative;flex:none;width:46px;height:27px}.tg input{position:absolute;opacity:0;inset:0;z-index:2;cursor:pointer;width:100%;height:100%}
.tg span{position:absolute;inset:0;border-radius:99px;background:#64748b66;transition:.2s}.tg span:after{content:"";position:absolute;top:3px;inset-inline-start:3px;width:21px;height:21px;border-radius:50%;background:#fff;transition:.2s}
.tg input:checked+span{background:linear-gradient(135deg,var(--ok),var(--c))}.tg input:checked+span:after{transform:translateX(-19px)}
.hint{color:var(--mute);font-size:12px}
.loc{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:7px;max-height:320px;overflow:auto;margin-top:8px}
.lc{cursor:pointer;padding:8px 11px;border-radius:13px;border:1px solid var(--line);background:#ffffff08;display:flex;gap:9px;align-items:center}
.lc:hover{border-color:var(--p)}.lc.on{border-color:transparent;background:linear-gradient(135deg,#7c5cff55,#00d1c433)}
.lc .fl{font-size:22px}.lc b{display:block;font-size:13px;line-height:1.35}.lc span{font-size:11.5px;color:var(--mute);direction:ltr;display:block;text-align:right}
.dd{position:relative;margin-top:8px}
.dd-b{width:100%;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;border-radius:13px;border:1px solid var(--line);background:#0000002e;color:var(--fg);font:inherit;font-weight:800}
@media(prefers-color-scheme:light){.dd-b{background:#fff}}
.dd-b:hover,.dd.open .dd-b{border-color:var(--p)}.dd-b i{font-style:normal;transition:.2s}.dd.open .dd-b i{transform:rotate(180deg)}
.dd-p{display:none;margin-top:6px;padding:8px;border-radius:14px;border:1px solid var(--line);background:var(--bg2);box-shadow:0 18px 50px #0008}.dd.open .dd-p{display:block}
.dd-p .lq{width:100%;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:#0000002e;color:var(--fg);font:inherit;outline:none}
@media(prefers-color-scheme:light){.dd-p .lq{background:#fff}}
.dd-l{max-height:300px;overflow:auto;margin-top:8px;display:flex;flex-direction:column;gap:3px}
.di{cursor:pointer;display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:11px;direction:ltr;border:1px solid transparent}
.di:hover{background:#ffffff10}.di.on{border-color:transparent;background:linear-gradient(135deg,#7c5cff55,#00d1c433)}
.di .fl{font-size:22px;line-height:1;flex:none}.di .en{font-weight:800;font-size:13.5px}.di .fa{direction:rtl;color:var(--mute);font-size:13px}
.di .sub{margin-inline-start:auto;font-size:11.5px;color:var(--mute);white-space:nowrap}
.cbox{padding:16px;border-radius:var(--r);background:var(--card);border:1px solid var(--line);backdrop-filter:blur(10px);margin-bottom:14px}
.cbox h3{font-size:16px;margin-bottom:2px}
.cbox .sws{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px;margin:12px 0}
.cbox .acts2{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.lks{display:flex;flex-direction:column;gap:7px}.lk{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:12px;background:#ffffff0a;border:1px solid var(--line)}
.lk code{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:ltr;text-align:left;font-size:11.5px;color:var(--mute)}
.lk b{font-size:12.5px;max-width:42%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.qr{display:block;margin:10px auto;border-radius:14px;background:#fff;padding:8px;width:210px;height:210px}
textarea.big{width:100%;min-height:200px;direction:ltr;text-align:left;padding:10px;border-radius:12px;border:1px solid var(--line);background:#0003;color:var(--fg);font:11.5px/1.6 ui-monospace,Menlo,monospace}
#toast{position:fixed;inset-inline:0;bottom:calc(76px + env(safe-area-inset-bottom));display:flex;justify-content:center;pointer-events:none;z-index:99}
#toast div{padding:10px 18px;border-radius:14px;color:#fff;font-weight:800;box-shadow:0 10px 30px #0009;opacity:0;transform:translateY(10px);transition:.25s;max-width:92vw}#toast div.show{opacity:1;transform:none}
</style>
</head>
<body>
<div class="wrap">
<header>
  <div class="brand"><div class="logo">⚡</div><div>Alireza<small id="host">…</small></div></div>
  <div class="top">
    <button class="btn" onclick="openUser()">＋ کاربر جدید</button>
    <button class="btn hot" id="bNF" onclick="noFilter(this)">no filtering</button>
    <button class="btn g" id="bAll" onclick="copyAll(this)">📋 کپی همه</button>
    <button class="btn g" onclick="openSettings()">⚙ تنظیمات</button>
    <a class="btn g" id="bpb" href="#">BPB</a>
    <button class="btn g" onclick="logout()">خروج</button>
  </div>
</header>

<div class="stats">
  <div class="st"><b id="sU">0</b><span>کاربران</span></div>
  <div class="st"><b id="sA">0</b><span>فعال</span></div>
  <div class="st"><b id="sO">0</b><span>آنلاین</span></div>
  <div class="st"><b id="sT">0</b><span>ترافیک کل (GB)</span></div>
  <div class="st"><b id="sR">—</b><span>ریکوئست امروز ورکر</span></div>
</div>

 <section class="cbox" id="cfgBox">
  <h3>🧬 ساخت کانفیگ</h3>
  <p class="hint">یک کانفیگ معمولی از پنل BPB گرفته می‌شه و کار روی خود همون کانفیگ انجام می‌شه: لوکیشن (IATA) تو مسیرش می‌شینه، اسم و پرچم کشور می‌گیره. خروجی فقط به‌صورت متن ذخیره می‌شه.</p>
  <div id="cfgLoc"></div>
  <div class="sws">
   <div class="sw"><div><div class="t">🚀 بهینه‌ساز (Patterniha)</div><div class="d">فرگمنت + سایفر روی لینک‌های TLS</div></div><label class="tg"><input type="checkbox" id="cfgOpt"><span></span></label></div>
   <div class="sw"><div><div class="t">🔐 Chrome + ECH</div><div class="d">fingerprint کروم + پارامتر ech</div></div><label class="tg"><input type="checkbox" id="cfgEch"><span></span></label></div>
  </div>
  <div class="acts2"><button class="btn ok" id="cfgGo" onclick="cfgGenerate(this)">⚙ ساخت و ذخیره</button><button class="btn g" onclick="cfgCopy()">📋 کپی</button><button class="btn g bad" onclick="cfgClear()">🗑 پاک کردن</button></div>
  <div class="hint" id="cfgInfo"></div>
  <textarea class="big" id="cfgText" readonly placeholder="هنوز کانفیگی ذخیره نشده"></textarea>
 </section>

<div class="bar">
  <input class="grow" id="q" placeholder="🔎 جستجوی کاربر…" oninput="render()">
  <div class="chips" id="flt"></div>
  <select id="sort" onchange="render()"><option value="new">جدیدترین</option><option value="name">نام</option><option value="used">مصرف</option><option value="exp">انقضا</option></select>
</div>
<div class="grid" id="grid"></div>
</div>

<div class="sel" id="sel"><div><b id="selN"></b>
  <button class="btn s ok" onclick="bulk('enable')">فعال</button><button class="btn s g" onclick="bulk('disable')">غیرفعال</button>
  <button class="btn s g" onclick="bulk('reset')">ریست مصرف</button><button class="btn s g" onclick="openBulk()">اعمال تنظیمات</button>
  <button class="btn s bad" onclick="bulk('delete')">حذف</button><button class="btn s g" onclick="selAll(false)">✕</button></div></div>

<!-- user editor -->
<div class="m" id="mU"><div class="mc">
  <div class="mh"><h3 id="uT">کاربر جدید</h3><div class="x" onclick="closeM('mU')">✕</div></div>
  <div class="tabs"><div class="tab on" data-t="t1">مشخصات</div><div class="tab" data-t="t2">شبکه و آی‌پی</div><div class="tab" data-t="t3">لوکیشن و پروکسی</div><div class="tab" data-t="t4">پیشرفته</div></div>
  <div class="mb">
   <div class="pane on" id="t1"><div class="f">
    <div class="w2"><label class="l">نام کاربری</label><input id="fName" placeholder="ali"></div>
    <div class="w2"><label class="l">پروتکل‌ها</label><div class="chips"><span class="chip on" id="pV" onclick="this.classList.toggle('on')">VLESS</span><span class="chip on" id="pT" onclick="this.classList.toggle('on')">Trojan</span></div></div>
    <div><label class="l">حجم (GB) — خالی = نامحدود</label><input id="fLim" type="number" step="any" min="0"></div>
    <div><label class="l">اعتبار (روز) — خالی = نامحدود</label><input id="fExp" type="number" min="0"></div>
    <div><label class="l">تعداد ریکوئست</label><input id="fReq" type="number" min="0"></div>
    <div><label class="l">محدودیت آی‌پی همزمان</label><input id="fIpl" type="number" min="0"></div>
    <div class="w2 sw"><div><div class="t">شروع اعتبار از اولین اتصال</div><div class="d">زمان از اولین اتصال کاربر حساب می‌شه</div></div><label class="tg"><input type="checkbox" id="fFirst"><span></span></label></div>
    <div><label class="l">تمدید خودکار حجم (روز)</label><input id="fArV" type="number" min="0"></div>
    <div><label class="l">تمدید خودکار ریکوئست (روز)</label><input id="fArR" type="number" min="0"></div>
    <div class="w2"><label class="l">یادداشت</label><input id="fNote"></div>
   </div></div>
   <div class="pane" id="t2"><div class="f">
    <div class="w2"><label class="l">آی‌پی‌ها / دامنه‌ها (هر خط یکی)</label><textarea id="fIps" placeholder="104.16.1.1&#10;2606:4700::1"></textarea></div>
    <div><label class="l">اپراتور</label><select id="fOp"><option value="all">all</option></select></div>
    <div><label class="l">تعداد آی‌پی</label><input id="fCnt" type="number" min="1" max="200" value="15"></div>
    <div class="w2" style="flex-direction:row;gap:8px"><button class="btn s ok" type="button" onclick="fillIps()">⬇ گرفتن از Ip.txt</button><button class="btn s g" type="button" onclick="document.getElementById('fIps').value=''">پاک کردن</button></div>
    <div class="sw"><div><div class="t">چرخش خودکار آی‌پی</div><div class="d">هر چند دقیقه آی‌پی‌ها عوض بشه</div></div><label class="tg"><input type="checkbox" id="fRot"><span></span></label></div>
    <div><label class="l">هر … دقیقه</label><input id="fRotT" type="number" min="1" value="60"></div>
    <div><label class="l">پورت‌ها (با کاما)</label><input id="fPort" value="443"></div>
    <div><label class="l">فینگرپرینت TLS</label><select id="fFp"></select></div>
    <div><label class="l">Fragment طول</label><input id="fFl" placeholder="200-3000"></div>
    <div><label class="l">Fragment فاصله</label><input id="fFi" placeholder="1-2"></div>
   </div></div>
   <div class="pane" id="t3">
    <p class="hint">لوکیشن (IATA): ورکر برای این کاربر فقط از آی‌پی‌های همون لوکیشن (IPv4 و IPv6) استفاده می‌کنه و آی‌پی ثابت می‌مونه. برای هر لوکیشن یک ست کانفیگ با اسم و پرچم همون کشور ساخته می‌شه. اگه خالی بمونه، لوکیشن‌های کلی (تنظیمات) اعمال می‌شن.</p>
    <div id="uLocBox"></div>
    <div class="f" style="margin-top:12px">
     <div class="w2"><label class="l">پروکسی SOCKS5 / HTTP (هر خط یکی؛ اختیاری: <code>پروکسی | کشور</code>)</label><textarea id="fSocks" placeholder="socks5://user:pass@1.2.3.4:1080 | DE"></textarea></div>
     <div class="w2" style="flex-direction:row;gap:8px"><input id="tpIn" style="flex:1" placeholder="تست یک پروکسی…"><button class="btn s g" type="button" onclick="testProxy()">تست</button></div><div class="w2 hint" id="tpOut"></div>
     <div class="sw"><div><div class="t">کانفیگ مستقیم هم باشه</div><div class="d">کنار پروکسی‌ها</div></div><label class="tg"><input type="checkbox" id="fDir" checked><span></span></label></div>
     <div class="sw"><div><div class="t">IPv6</div><div class="d">آی‌پی‌های IPv6 لوکیشن هم استفاده بشن</div></div><label class="tg"><input type="checkbox" id="fV6" checked><span></span></label></div>
    </div></div>
   <div class="pane" id="t4"><div class="f">
    <div class="sw"><div><div class="t">مسدودسازی محتوای غیراخلاقی</div></div><label class="tg"><input type="checkbox" id="fPorn"><span></span></label></div>
    <div class="sw"><div><div class="t">مسدودسازی تبلیغات</div></div><label class="tg"><input type="checkbox" id="fAds"><span></span></label></div>
    <div class="w2"><label class="l">Advanced fragment (JSON)</label><textarea id="fFm"></textarea></div>
    <div class="w2"><label class="l">Cipher suites</label><input id="fCs"></div>
    <div><label class="l">TLS mask (SNI)</label><input id="fMask"></div>
    <div><label class="l">ECH</label><input id="fEch" placeholder="cloudflare-ech.com+udp://1.1.1.1"></div>
   </div></div>
  </div>
  <div class="mf"><button class="btn g" onclick="closeM('mU')">انصراف</button><button class="btn" id="uSave" onclick="saveUser()">ذخیره</button></div>
</div></div>

<!-- info -->
<div class="m" id="mI"><div class="mc"><div class="mh"><h3 id="iT">اطلاعات</h3><div class="x" onclick="closeM('mI')">✕</div></div>
 <div class="mb" id="iB"></div></div></div>

<!-- text -->
<div class="m" id="mX"><div class="mc"><div class="mh"><h3 id="xT"></h3><div class="x" onclick="closeM('mX')">✕</div></div>
 <div class="mb"><textarea class="big" id="xA" readonly></textarea></div><div class="mf"><button class="btn" onclick="copyText(el('xA').value)">کپی</button></div></div></div>

<!-- bulk -->
<div class="m" id="mB"><div class="mc"><div class="mh"><h3>اعمال تنظیمات روی کاربران انتخاب‌شده</h3><div class="x" onclick="closeM('mB')">✕</div></div>
 <div class="mb"><div class="f">
  <div><label class="l">فینگرپرینت</label><select id="bFp"><option value="">— بدون تغییر —</option></select></div>
  <div><label class="l">پورت‌ها</label><input id="bPort" placeholder="بدون تغییر"></div>
  <div><label class="l">Fragment طول</label><input id="bFl" placeholder="بدون تغییر"></div><div><label class="l">Fragment فاصله</label><input id="bFi" placeholder="بدون تغییر"></div>
  <div class="w2"><label class="l">پروتکل‌ها</label><select id="bPr"><option value="">— بدون تغییر —</option><option value="vless">فقط VLESS</option><option value="trojan">فقط Trojan</option><option value="vless,trojan">هر دو</option></select></div>
 </div></div><div class="mf"><button class="btn" onclick="applyBulk()">اعمال</button></div></div></div>

<!-- settings -->
<div class="m" id="mS"><div class="mc">
 <div class="mh"><h3>⚙ تنظیمات علیرضا</h3><div class="x" onclick="closeM('mS')">✕</div></div>
 <div class="tabs"><div class="tab on" data-t="s1">🌍 لوکیشن (IATA)</div><div class="tab" data-t="s2">🧼 آی‌پی تمیز</div><div class="tab" data-t="s3">🎛 کلیدها</div><div class="tab" data-t="s4">🛠 سیستم</div></div>
 <div class="mb">
  <div class="pane on" id="s1">
   <p class="hint">لوکیشن‌هایی که اینجا انتخاب می‌کنی برای همه‌ی کاربرها (و خود BPB) اعمال می‌شه. برای هر لوکیشن آی‌پی ثابت (IPv4 و IPv6) ذخیره می‌شه و تا وقتی «به‌روزرسانی» نزنی عوض نمی‌شه. اسم، کشور و پرچم هر کانفیگ مال همون کشوره.</p>
   <div id="gLocBox"></div>
   <div class="f" style="margin-top:12px"><div><label class="l">نوع آی‌پی</label><select id="gFam"><option value="auto">خودکار (اول IPv4)</option><option value="v4">فقط IPv4</option><option value="v6">فقط IPv6</option><option value="both">هر دو</option></select></div>
   <div><label class="l">منبع آی‌پی لوکیشن</label><input id="gSrc"></div></div>
  </div>
  <div class="pane" id="s2"><div class="f">
   <div class="w2 sw"><div><div class="t">استفاده از آی‌پی تمیز</div><div class="d">کاربر جدید خودکار آی‌پی تمیز می‌گیره</div></div><label class="tg"><input type="checkbox" id="cEn"><span></span></label></div>
   <div class="w2"><label class="l">آدرس منبع (Ip.txt)</label><input id="cSrc"></div>
   <div><label class="l">به‌روزرسانی خودکار (دقیقه)</label><input id="cTtl" type="number" min="5"></div>
   <div style="justify-content:flex-end"><button class="btn ok" id="bSync" onclick="syncClean()">⟳ همگام‌سازی الان</button></div>
   <div class="w2 hint" id="cInfo"></div>
  </div></div>
  <div class="pane" id="s3"><div class="f">
   <div class="w2 sw"><div><div class="t">📢 کانفیگ‌های اطلاع‌رسانی</div><div class="d">پیام‌ها + حجم/زمان/ریکوئست باقی‌مانده</div></div><label class="tg"><input type="checkbox" id="kInfo"><span></span></label></div>
   <div class="w2 sw"><div><div class="t">🚀 بهینه‌ساز (Patterniha) — همه کاربران</div><div class="d">فرگمنت پیشرفته + سایفر روی همه لینک‌های TLS</div></div><label class="tg"><input type="checkbox" id="kPat"><span></span></label></div>
   <div class="w2 sw"><div><div class="t">🔐 Chrome + ECH — همه کاربران</div><div class="d">fingerprint کروم + پارامتر ech</div></div><label class="tg"><input type="checkbox" id="kEch"><span></span></label></div>
   <div><label class="l">ECH SNI</label><input id="kSni"></div><div><label class="l">ECH DoH</label><input id="kDoh"></div>
   <div class="w2"><label class="l">متن کانفیگ اطلاع‌رسانی ۱</label><input id="kT1" style="direction:rtl;text-align:right"></div>
   <div class="w2"><label class="l">متن کانفیگ اطلاع‌رسانی ۲</label><input id="kT2" style="direction:rtl;text-align:right"></div>
  </div></div>
  <div class="pane" id="s4"><div class="f">
   <div class="w2"><label class="l">هر چند دقیقه دیتابیس (D1) خونده بشه: <b id="cmV">5</b> دقیقه</label><input type="range" id="gCache" min="1" max="30" oninput="el('cmV').textContent=this.value" style="padding:0"></div>
   <div class="w2 hint">کاربران، تنظیمات و ورود به‌صورت حافظه‌ی موقت نگه داشته می‌شن؛ تغییراتی که از پنل می‌زنی همین‌جا فوراً اعمال می‌شه ولی روی بقیه‌ی سرورها تا این مدت طول می‌کشه. حجم مصرفی هم به همین فاصله روی D1 نوشته می‌شه.</div>
   <div class="w2"><label class="l">تغییر رمز عبور (یک رمز برای BPB، Zeus و Alireza)</label><input id="gPw" type="password" placeholder="رمز جدید (حداقل ۴ حرف)"></div>
   <div class="w2" style="flex-direction:row"><button class="btn g" onclick="changePw()">تغییر رمز</button></div>
  </div></div>
 </div>
 <div class="mf"><button class="btn g" onclick="closeM('mS')">بستن</button><button class="btn" onclick="saveSettings()">ذخیره</button></div>
</div></div>

<div id="toast"><div id="tI"></div></div>

<script>
const el=id=>document.getElementById(id),ROOT=location.pathname.replace(/\\/alireza\\/?$/,''),API=ROOT+'/alireza/api/';
const dnFa=(()=>{try{return new Intl.DisplayNames(['fa'],{type:'region'})}catch{return null}})(),dnEn=(()=>{try{return new Intl.DisplayNames(['en'],{type:'region'})}catch{return null}})();
const nameFa=c=>{try{return dnFa&&dnFa.of(c)||c}catch{return c}},nameEn=c=>{try{return dnEn&&dnEn.of(c)||c}catch{return c}};
const flag=c=>/^[A-Za-z]{2}$/.test(c||'')?String.fromCodePoint(...[...c.toUpperCase()].map(x=>127397+x.charCodeAt(0))):'🌐';
let S={},U=[],COLOS=[],CLEAN=null,LOCIPS={},editing=null,flt='all',picked=new Set(),tt;
const FPS=['chrome','firefox','safari','ios','android','edge','360','qq','random','randomized','unsafe'];
function toast(m,ok=true){const e=el('tI');e.textContent=m;e.style.background=ok?'linear-gradient(135deg,#22c55e,#00d1c4)':'linear-gradient(135deg,#ef4444,#ff4fd8)';e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),2800)}
async function api(p,method='GET',body){const r=await fetch(API+p,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});if(r.status===401){location.href=ROOT+'/login';throw new Error('401')}const j=await r.json();if(!j.success)throw new Error(j.message||'خطا');return j.body}
async function copyText(t){try{await navigator.clipboard.writeText(t)}catch{const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove()}toast('کپی شد ✓')}
const openM=id=>el(id).classList.add('on'),closeM=id=>el(id).classList.remove('on');
document.querySelectorAll('.tabs').forEach(tb=>tb.addEventListener('click',e=>{const t=e.target.dataset.t;if(!t)return;tb.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===e.target));const mc=tb.closest('.mc');mc.querySelectorAll('.pane').forEach(p=>p.classList.toggle('on',p.id===t))}));
el('bpb').href=ROOT+'/panel';
const fmtGb=n=>n>=100?n.toFixed(0):n>=10?n.toFixed(1):n.toFixed(2);
async function logout(){try{await fetch(ROOT+'/panel/logout')}catch{}location.href=ROOT+'/login'}

/* ---------- load / render ---------- */
async function load(){try{const [s,u]=await Promise.all([api('state'),api('users')]);S=s.settings;LOCIPS=s.loc_ips||{};CLEAN=s.clean;U=u;
 el('host').textContent=s.host;el('sU').textContent=s.stats.users;el('sA').textContent=s.stats.active;el('sO').textContent=s.stats.online;el('sT').textContent=s.stats.used_gb;el('sR').textContent=s.usage?Number(s.usage.worker).toLocaleString():'—';render()}catch(e){toast(e.message,false)}}
function fltBar(){const l=[['all','همه'],['active','فعال'],['off','غیرفعال'],['exp','منقضی/تموم']];el('flt').innerHTML='';l.forEach(([k,t])=>{const c=document.createElement('span');c.className='chip'+(flt===k?' on':'');c.textContent=t;c.onclick=()=>{flt=k;render()};el('flt').appendChild(c)})}
const stateTxt={disabled:['غیرفعال','no'],expired:['منقضی','no'],volume:['حجم تموم','w'],requests:['ریکوئست تموم','w']};
function render(){fltBar();const q=el('q').value.trim().toLowerCase();let l=U.filter(u=>(!q||u.username.toLowerCase().includes(q)||(u.note||'').toLowerCase().includes(q))&&(flt==='all'||(flt==='active'&&!u.state)||(flt==='off'&&u.state==='disabled')||(flt==='exp'&&u.state&&u.state!=='disabled')));
 const so=el('sort').value;l.sort((a,b)=>so==='name'?a.username.localeCompare(b.username):so==='used'?b.used_gb-a.used_gb:so==='exp'?(a.expiry_at||9e15)-(b.expiry_at||9e15):b.id-a.id);
 const g=el('grid');g.innerHTML='';if(!l.length){g.innerHTML='<div class="empty" style="grid-column:1/-1">کاربری پیدا نشد.<br>با «＋ کاربر جدید» شروع کن.</div>';return}
 l.forEach(u=>{const pct=u.limit_gb?Math.min(100,u.used_gb/u.limit_gb*100):0,[st,cl]=u.state?(stateTxt[u.state]||['غیرفعال','no']):['فعال','ok'];
  const d=document.createElement('div');d.className='u'+(u.state?' off':'');
  const exp=u.expiry_at?Math.max(0,Math.ceil((u.expiry_at-Date.now())/864e5))+' روز':(u.expiry_days&&u.start_on_first_connect?'از اولین اتصال':'نامحدود');
  const locs=(u.locations&&u.locations.length?u.locations:(S.locations||[])).map(i=>{const r=LOCIPS[i];return \`<span class="pill p">\${flag(r&&r.cc)} \${i}</span>\`}).join('');
  d.innerHTML=\`<div class="uh"><input type="checkbox" \${picked.has(u.id)?'checked':''} onchange="pick(\${u.id},this.checked)"><span class="dot \${u.online||u.recent?'on':''}"></span><div class="n">\${esc(u.username)}</div><span class="pill \${cl}">\${st}</span></div>
  <div><div class="ur"><span>حجم</span><b>\${fmtGb(u.used_gb)} / \${u.limit_gb?u.limit_gb+' GB':'∞'}</b></div><div class="pb"><i class="\${pct>85?'w':''}" style="width:\${u.limit_gb?Math.max(pct,2):100}%;\${u.limit_gb?'':'opacity:.3'}"></i></div></div>
  <div class="ur"><span>اعتبار: <b>\${exp}</b></span><span>ریکوئست: <b>\${u.used_req.toLocaleString()}\${u.limit_req?'/'+u.limit_req.toLocaleString():''}</b></span></div>
  <div class="tags">\${u.protocols_list.map(p=>\`<span class="pill \${p==='vless'?'ok':'w'}">\${p==='vless'?'VLESS':'Trojan'}</span>\`).join('')}\${locs}\${u.socks.length?\`<span class="pill p">SOCKS×\${u.socks.length}</span>\`:''}\${u.ip_limit?\`<span class="pill p">\${u.online}/\${u.ip_limit} IP</span>\`:''}</div>
  <div class="acts"><button class="btn s" onclick="copyText('\${u.sub}')">اشتراک</button><button class="btn s g" onclick="info(\${u.id})">ℹ لینک‌ها</button><button class="btn s g" onclick="openUser(\${u.id})">ویرایش</button>
  <button class="btn s g" onclick="act(\${u.id},'toggle')">\${u.is_active?'خاموش':'روشن'}</button><button class="btn s g" title="ریست مصرف" onclick="act(\${u.id},'reset')">ریست</button><button class="btn s bad" onclick="del(\${u.id})">حذف</button></div>\`;
  g.appendChild(d)});sel()}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function pick(id,on){on?picked.add(id):picked.delete(id);sel()}function selAll(on){picked.clear();render()}
function sel(){el('sel').classList.toggle('on',picked.size>0);el('selN').textContent=picked.size+' انتخاب'}
async function act(id,a){try{await api('users/'+id+'/'+a,'POST',{});toast('انجام شد ✓');load()}catch(e){toast(e.message,false)}}
function del(id){if(confirm('این کاربر حذف بشه؟')){api('users/'+id,'DELETE').then(()=>{toast('حذف شد');load()}).catch(e=>toast(e.message,false))}}
async function bulk(a){if(a==='delete'&&!confirm(picked.size+' کاربر حذف بشن؟'))return;try{await api('users/bulk','POST',{action:a,ids:[...picked]});picked.clear();toast('انجام شد ✓');load()}catch(e){toast(e.message,false)}}
function openBulk(){const s=el('bFp');if(s.options.length<2)FPS.forEach(f=>s.add(new Option(f,f)));openM('mB')}
async function applyBulk(){const f={};if(el('bFp').value)f.fingerprint=el('bFp').value;if(el('bPort').value.trim())f.port=el('bPort').value.trim();if(el('bFl').value.trim())f.frag_len=el('bFl').value.trim();if(el('bFi').value.trim())f.frag_int=el('bFi').value.trim();if(el('bPr').value)f.protocols=el('bPr').value;
 if(!Object.keys(f).length)return toast('چیزی انتخاب نشده',false);try{await api('users/bulk','POST',{action:'apply',ids:[...picked],fields:f});closeM('mB');toast('اعمال شد ✓');load()}catch(e){toast(e.message,false)}}

/* ---------- location picker (shared) ---------- */
let COLOERR='';async function colos(){if(!COLOS.length){try{COLOS=((await api('locations')).colos||[]).filter(c=>c.iata&&c.city).sort((a,b)=>nameEn(a.cca2).localeCompare(nameEn(b.cca2),'en')||a.city.localeCompare(b.city,'en'));COLOERR=COLOS.length?'':'لیست لوکیشن‌ها خالی برگشت'}catch(e){COLOERR=e.message}}return COLOS}
function locPicker(box,get,set){
 const b=el(box);
 b.innerHTML=\`<div class="chips" id="\${box}_sel"></div><div class="dd" id="\${box}_dd"><button type="button" class="dd-b" id="\${box}_b"><span></span><i>▾</i></button><div class="dd-p"><input class="lq" placeholder="🔎 Search / جستجو: France، فرانسه، Paris، CDG"><div class="dd-l" id="\${box}_l"></div></div></div>\`;
 const q=b.querySelector('.lq'),L=el(box+'_l'),SEL=el(box+'_sel'),DD=el(box+'_dd'),BT=b.querySelector('.dd-b span');
 el(box+'_b').onclick=()=>{DD.classList.toggle('open');if(DD.classList.contains('open'))q.focus()};
 const paint=()=>{const cur=get(),t=q.value.trim().toLowerCase();
  BT.textContent='🌍 انتخاب کشور / لوکیشن'+(cur.length?' ('+cur.length+' انتخاب‌شده)':'');
  SEL.innerHTML='';cur.forEach(i=>{const r=LOCIPS[i]||{},c=document.createElement('span');c.className='chip on';c.innerHTML=\`\${flag(r.cc)} \${i}\${r.cc?' · '+nameFa(r.cc):''} <small>\${r.v4!==undefined?'v4:'+r.v4+' v6:'+r.v6:''}</small> ✕\`;c.onclick=()=>{set(cur.filter(x=>x!==i));paint()};SEL.appendChild(c)});
  const res=COLOS.filter(c=>!t||(c.iata+' '+c.city+' '+c.cca2+' '+nameEn(c.cca2)+' '+nameFa(c.cca2)).toLowerCase().includes(t));
  L.innerHTML='';res.forEach(c=>{const d=document.createElement('div');d.className='di'+(cur.includes(c.iata)?' on':'');d.innerHTML=\`<span class="fl">\${flag(c.cca2)}</span><span class="en">\${esc(nameEn(c.cca2))}</span><span class="fa">\${esc(nameFa(c.cca2))}</span><span class="sub">\${esc(c.city)} · \${c.iata}</span>\`;
   d.onclick=async()=>{const now=get(),had=now.includes(c.iata),n=had?now.filter(x=>x!==c.iata):[...now,c.iata].slice(0,8);set(n);paint();if(!had){try{const r=await api('locations/resolve','POST',{iata:c.iata});if(!r.v4.length&&!r.v6.length){set(get().filter(x=>x!==c.iata));toast('⚠️ این کشور در حال حاضر IP فعالی نداره؛ یه کشور دیگه امتحان کن',false);paint();return}LOCIPS[c.iata]={cc:r.cc,city:r.city,v4:r.v4.length,v6:r.v6.length,ts:r.ts};toast(c.iata+': '+r.v4.length+' آی‌پی IPv4 و '+r.v6.length+' آی‌پی IPv6')}catch(e){toast('آی‌پی این لوکیشن پیدا نشد: '+e.message,false)}paint()}};L.appendChild(d)});
  if(!res.length)L.innerHTML='<div class="hint" style="padding:10px">'+(COLOERR?'⚠️ خطا در دریافت لوکیشن‌ها: '+esc(COLOERR):'چیزی پیدا نشد')+'</div>'};
 q.oninput=paint;colos().then(paint);paint()}
document.addEventListener('click',e=>document.querySelectorAll('.dd.open').forEach(d=>{if(!e.composedPath().includes(d))d.classList.remove('open')}));

/* ---------- user editor ---------- */
let uLoc=[],sLoc=[];
async function cleanOps(){if(!CLEAN){try{CLEAN=await api('clean')}catch{}}const s=el('fOp');s.innerHTML='<option value="all">all (همه)</option>';if(CLEAN)Object.entries(CLEAN.ops).forEach(([k,n])=>s.add(new Option(k+' ('+n+')',k)))}
async function openUser(id){editing=id||null;const u=id?U.find(x=>x.id===id):null;el('uT').textContent=u?'ویرایش '+u.username:'کاربر جدید';
 if(el('fFp').options.length<1)FPS.forEach(f=>el('fFp').add(new Option(f,f)));await cleanOps();
 const v=(i,x)=>el(i).value=x??'',c=(i,x)=>el(i).checked=!!x;
 v('fName',u?.username);const pr=u?u.protocols_list:['vless','trojan'];el('pV').classList.toggle('on',pr.includes('vless'));el('pT').classList.toggle('on',pr.includes('trojan'));
 v('fLim',u?.limit_gb);v('fExp',u?.expiry_days);v('fReq',u?.limit_req);v('fIpl',u?.ip_limit);c('fFirst',u?.start_on_first_connect);v('fArV',u?.auto_reset_vol_days||'');v('fArR',u?.auto_reset_req_days||'');v('fNote',u?.note);
 v('fIps',u?.ips);v('fOp',u?.ip_operator||'all');v('fCnt',u?.ip_count||15);c('fRot',u?.auto_rotate_ip);v('fRotT',u?.rotate_time||60);v('fPort',u?.port||'443');v('fFp',u?.fingerprint||'chrome');v('fFl',u?.frag_len);v('fFi',u?.frag_int);
 uLoc=u?[...u.locations]:[];v('fSocks',(u?.socks||[]).map(s=>s.proxy+(s.country?' | '+s.country:'')).join('\\n'));c('fDir',u?u.enable_direct!==0:true);c('fV6',u?u.user_ipv6!==0:true);
 c('fPorn',u?.block_porn);c('fAds',u?.block_ads);v('fFm',u?.advanced_frag);v('fCs',u?.cipher_suites);v('fMask',u?.tls_mask);v('fEch',u?.ech_config);
 locPicker('uLocBox',()=>uLoc,x=>uLoc=x);openM('mU')}
async function fillIps(){try{const r=await api('clean/ips?operator='+encodeURIComponent(el('fOp').value)+'&count='+(el('fCnt').value||15));el('fIps').value=r.ips.join('\\n');toast(r.ips.length+' آی‌پی تمیز گرفته شد')}catch(e){toast(e.message,false)}}
async function testProxy(){const p=el('tpIn').value.trim()||el('fSocks').value.split('\\n')[0].split('|')[0].trim();if(!p)return;el('tpOut').textContent='در حال تست…';try{const r=await api('test-proxy','POST',{proxy:p});el('tpOut').textContent='✅ '+(r.query||'')+' — '+flag(r.countryCode)+' '+(r.country||r.countryCode)}catch(e){el('tpOut').textContent='❌ '+e.message}}
async function saveUser(){const num=i=>el(i).value===''?null:Number(el(i).value);
 const pr=[el('pV').classList.contains('on')&&'vless',el('pT').classList.contains('on')&&'trojan'].filter(Boolean);
 const socks=el('fSocks').value.split('\\n').map(l=>l.trim()).filter(Boolean).map(l=>{const [p,c]=l.split('|').map(x=>x.trim());return {proxy:p,country:(c||'').toUpperCase()}});
 const b={username:el('fName').value.trim(),protocols:pr,limit_gb:num('fLim'),expiry_days:num('fExp')||null,limit_req:num('fReq')||null,ip_limit:num('fIpl')||null,start_on_first_connect:el('fFirst').checked,auto_reset_vol_days:num('fArV')||0,auto_reset_req_days:num('fArR')||0,note:el('fNote').value,
  ips:el('fIps').value,ip_operator:el('fOp').value,ip_count:num('fCnt')||15,auto_rotate_ip:el('fRot').checked,rotate_time:el('fRot').checked?(num('fRotT')||60):0,port:el('fPort').value,fingerprint:el('fFp').value,frag_len:el('fFl').value,frag_int:el('fFi').value,
  user_locations:uLoc,user_socks5:socks,enable_direct:el('fDir').checked,user_ipv6:el('fV6').checked,block_porn:el('fPorn').checked,block_ads:el('fAds').checked,advanced_frag:el('fFm').value,cipher_suites:el('fCs').value,tls_mask:el('fMask').value,ech_config:el('fEch').value};
 const btn=el('uSave');btn.disabled=true;try{editing?await api('users/'+editing,'PUT',b):await api('users','POST',b);closeM('mU');toast(editing?'ذخیره شد ✓':'کاربر ساخته شد ✓');load()}catch(e){toast(e.message,false)}finally{btn.disabled=false}}

/* ---------- info / links ---------- */
async function info(id){try{const r=await api('users/'+id+'/links');el('iT').textContent=r.username;
 const q=ROOT+'/qrcode?data='+encodeURIComponent(r.sub);
 el('iB').innerHTML=\`<img class="qr" src="\${q}" alt="QR" onerror="this.style.display='none'">
 <div class="lks" style="margin-bottom:12px"><div class="lk"><b>اشتراک</b><code>\${esc(r.sub)}</code><button class="btn s" onclick="copyText('\${r.sub}')">کپی</button></div>
 <div class="lk"><b>sing-box</b><code>\${esc(r.singbox)}</code><button class="btn s" onclick="copyText('\${r.singbox}')">کپی</button></div>
 <div class="lk"><b>صفحه‌ی وضعیت</b><code>\${esc(r.status)}</code><button class="btn s" onclick="copyText('\${r.status}')">کپی</button></div></div>
 <div class="ur" style="margin-bottom:8px"><b>\${r.links.length} کانفیگ</b><button class="btn s ok" onclick='copyText(\${JSON.stringify(r.text).replace(/'/g,"&#39;")})'>کپی همه</button></div>
 <div class="lks">\${r.links.map(l=>{let n='';try{n=decodeURIComponent(l.split('#')[1]||'')}catch{n=l.split('#')[1]||''}return \`<div class="lk"><b>\${esc(n)}</b><code>\${esc(l)}</code><button class="btn s g" onclick='copyText(\${JSON.stringify(l).replace(/'/g,"&#39;")})'>کپی</button></div>\`}).join('')}</div>\`;openM('mI')}catch(e){toast(e.message,false)}}

/* ---------- top buttons ---------- */
async function noFilter(b){if(!(S.locations||[]).length){toast('اول از تنظیمات یه لوکیشن (IATA) انتخاب کن',false);openSettings();return}
 if(!confirm('۴ کاربر no filtering (۲ ECH + ۲ Patterniha) برای '+S.locations[0]+' ساخته بشه؟ بعداً هر کدوم رو می‌تونی ویرایش و ذخیره کنی.'))return;
 b.disabled=true;try{const r=await api('nofilter','POST',{iata:S.locations[0]});toast('✅ '+r.created.length+' کانفیگ ساخته شد');load()}catch(e){toast(e.message,false)}finally{b.disabled=false}}
async function copyAll(b){b.disabled=true;try{const r=await api('export');el('xT').textContent='همه کانفیگ‌ها ('+r.count+')';el('xA').value=r.text;openM('mX');await copyText(r.text)}catch(e){toast(e.message,false)}finally{b.disabled=false}}

/* ---------- config box (saved as plain text) ---------- */
let cfgLoc=[];
function cfgShow(r){el('cfgText').value=r.text||'';el('cfgInfo').textContent=r.count?\`\${r.count} کانفیگ ذخیره شده — \${new Date(r.ts).toLocaleString('fa-IR')}\`:'هنوز کانفیگی ذخیره نشده.'}
async function cfgInit(){try{const r=await api('configs');cfgShow(r);cfgLoc=r.ts?[...r.locations]:[...(S.locations||[])];el('cfgOpt').checked=r.ts?r.optimizer:!!S.patterniha_all;el('cfgEch').checked=r.ts?r.ech:!!S.patterniha_ech_all;locPicker('cfgLoc',()=>cfgLoc,x=>cfgLoc=x)}catch(e){toast(e.message,false)}}
async function cfgGenerate(b){b.disabled=true;try{const r=await api('configs/generate','POST',{locations:cfgLoc,optimizer:el('cfgOpt').checked,ech:el('cfgEch').checked});cfgShow(r);toast('✅ '+r.count+' کانفیگ ساخته و ذخیره شد')}catch(e){toast(e.message,false)}finally{b.disabled=false}}
function cfgCopy(){const t=el('cfgText').value;if(!t)return toast('کانفیگی برای کپی نیست',false);copyText(t)}
async function cfgClear(){if(!el('cfgText').value||!confirm('کانفیگ‌های ذخیره‌شده پاک بشن؟'))return;try{cfgShow(await api('configs/clear','POST',{}));toast('پاک شد')}catch(e){toast(e.message,false)}}

/* ---------- settings ---------- */
function openSettings(){const v=(i,x)=>el(i).value=x??'',c=(i,x)=>el(i).checked=!!x;
 sLoc=[...(S.locations||[])];locPicker('gLocBox',()=>sLoc,x=>sLoc=x);v('gFam',S.loc_family);v('gSrc',S.loc_source);
 c('cEn',S.clean_enabled);v('cSrc',S.clean_source);v('cTtl',S.clean_ttl_min);el('cInfo').textContent=CLEAN?\`آخرین همگام‌سازی: \${new Date(CLEAN.ts).toLocaleString('fa-IR')} — \${Object.values(CLEAN.ops).reduce((a,b)=>a+b,0)} آی‌پی در \${Object.keys(CLEAN.ops).length} اپراتور\`:'هنوز همگام‌سازی نشده';
 c('kInfo',S.info_configs);c('kPat',S.patterniha_all);c('kEch',S.patterniha_ech_all);v('kSni',S.ech_sni);v('kDoh',S.ech_doh);v('kT1',(S.info_texts||[])[0]);v('kT2',(S.info_texts||[])[1]);
 v('gCache',S.cache_min);el('cmV').textContent=S.cache_min;openM('mS')}
async function saveSettings(){const b={locations:sLoc,loc_family:el('gFam').value,loc_source:el('gSrc').value.trim(),clean_enabled:el('cEn').checked,clean_source:el('cSrc').value.trim(),clean_ttl_min:Number(el('cTtl').value)||360,
 info_configs:el('kInfo').checked,patterniha_all:el('kPat').checked,patterniha_ech_all:el('kEch').checked,ech_sni:el('kSni').value.trim(),ech_doh:el('kDoh').value.trim(),info_texts:[el('kT1').value,el('kT2').value],cache_min:Number(el('gCache').value)};
 try{await api('settings','POST',b);closeM('mS');toast('ذخیره شد ✓');load()}catch(e){toast(e.message,false)}}
async function syncClean(){const b=el('bSync');b.disabled=true;try{CLEAN=await api('clean/sync','POST',{});el('cInfo').textContent=Object.values(CLEAN.ops).reduce((a,b)=>a+b,0)+' آی‌پی در '+Object.keys(CLEAN.ops).length+' اپراتور';toast('همگام شد ✓')}catch(e){toast(e.message,false)}finally{b.disabled=false}}
async function changePw(){const p=el('gPw').value;if(p.length<4)return toast('حداقل ۴ حرف',false);try{const r=await fetch(ROOT+'/panel/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:p})});const j=await r.json().catch(()=>({}));if(!r.ok||j.success===false)throw new Error(j.message||'خطا');toast('رمز عوض شد (همان رمز BPB و Zeus)، دوباره وارد شو');setTimeout(()=>location.href=ROOT+'/login',900)}catch(e){toast(e.message,false)}}
load().then(cfgInit);setInterval(()=>{if(!document.querySelector('.m.on'))load()},60000);
</script>
</body>
</html>`;

// ── آیکون سایت (فایل ico باینری، base64) ──
const ICON_CONTENT = "AAABAAEAQEAAAAEAIAAoQgAAFgAAACgAAABAAAAAgAAAAAEAIAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcASGtEBSs/KFsRGRCyAwQC5wAAAPoBAgHtDxYOvyU2InFEZD8QTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAOVQ1LgcLB9UAAAD/AQEA/ykjGP9ANyb/MCod/wUEA/8AAAD/AgQC6yo/J1dMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAOVU2KwIDAu4AAAD/Wk01/9W3f//105L/9dOS//XTkv/jxIf/emlI/wYFA/8AAAD/JjgjZkxwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAEptRQE2UDM3IjMgehQdEqsNFAzHBwsHzw4VDcUWIRWmJTcjcTpVNilMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcASGpDBgcKBtcAAAD/lYBY//XTkv/105L/9dOS//XTkv/105L/9dOS//TSkf+xjE7/DQoF/wABAPg6VTYsTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAS25GAC1DKlQHCwfXAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/DBILwzVPMjhMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHACo/J1sAAAD/VUkz//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/xzIj/5LJh/5t5Qv8AAAD/EhoRrUxwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAPls5IA4VDbwAAAD/BAMC/0k+K/+VgFn/y695/+rKi//00pH/6MiK/8aqdv+JdlH/Ny8h/wAAAP8AAAD9FyIVmkVlQA1McEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwARGRC0AAAA/8Gmc//105L/9dOS//XTkv/105L/9dOS//XTkv/105L/6r90/+SyYf/jsWD/MiYV/wAAAPlCYj4STHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcANlAyNQIEAuoAAAD/S0As/9O2fv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv+/pHH/Lykc/wAAAP8JDQjSQF88GUxwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBIakMFAAEA9R4aEv/00pH/9dOS//XTkv/105L/9dOS//XTkv/105L/8s2K/+SyYf/ksmH/5LJh/3pfM/8AAAD/LkQrUExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAO1g3JQIDAu0CAQH/iXZR//TSkf/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS/+7Njv9bTjb/AAAA/wkNCM9GZ0EKTHBHAExwRwBMcEcATHBHAExwRwBMcEcAOFQ0LwAAAP9bTjb/9dOS//XTkv/105L/9dOS//XTkv/105L/9NKR/+i6bv/ksmH/5LJh/+SyYf+XdkD/AAAA/yo+J21McEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcARWZBDAcLBtgAAAD/lH9Y//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9NKR/15PM/8AAAD/ExwRp0tuRgBMcEcATHBHAExwRwBMcEcATHBHAC1EKlYAAAD/iXZR//XTkv/105L/9dOS//XTkv/105L/9dOS/+3Ffv/ksmH/5LJh/+SyYf/ksmH/kXE9/wAAAP8qPidmTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHABspGYwAAAD/ZVc8//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/lunH/MSYU/wAAAP8sQSlUTHBHAExwRwBMcEcATHBHAExwRwAjNCB3AAAA/66WZ//105L/9dOS//XTkv/105L/9dOS//DKhf/ksmL/5LJh/+SyYf/ksmH/5LJh/2ROKv8AAAD/NE4xPExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAEJhPRMAAQD2ExAL/+fHiv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/6bxw/7WNTP8AAAD/CAwH0ktuRgBMcEcATHBHAExwRwBMcEcAHSobjwAAAP/JrXf/9dOS//XTkv/105L/9dOS//HMiP/ks2P/5LJh/+SyYf/ksmH/5LJh/92tXv8WEQn/AgMC60lrRARMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwAlNyNuAAAA/4RyTv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS/+e4av/ksmH/QzQc/wAAAP82UDI2THBHAExwRwBMcEcATHBHABYhFaEAAAD/3b6D//XTkv/105L/9dOS//LNif/ltWX/5LJh/+SyYf/ksmH/5LJh/+OxYP9iTCn/AAAA/x4tHIRMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcADhYOuwQDAv/kxIf/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//TRkP/ksmL/5LJh/6J+RP8AAAD/HiwchkxwRwBMcEcATHBHAExwRwASGxGxAAAA/+7Njv/105L/9dOS//DLhv/ltGX/5LJh/+SyYf/ksmH/5LJh/9WmWv9bRyb/AAAA/wgMB9dFZkELTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAAIDAucqJBn/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/wyoX/5LJh/+SyYf/drF3/BQMC/w4WDr5McEcATHBHAExwRwBMcEcADxYOvgYGA//105L/9dOS/+/Igv/ksmL/5LJh/+SyYf/gr1//rohK/19KKP8LCQT/AAAA/wUIBd88WTgkTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAEptRQAAAAD8QTgm//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/6r91/+SyYf/ksmH/5LJh/yMcD/8EBgTiTHBHAExwRwBMcEcATHBHAAsQCsoPDQn/zK95/7CUYf+Pbz3/dFsx/1ZDJP8xJhT/CAcD/wAAAP8AAAD/AgMC7B4sHIRFZUANTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBJbEQAAAAA/EM5J//105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9NKQ/+W0ZP/ksmH/5LJh/+SyYf81KRb/AAAA8kxwRwBMcEcATHBHAExwRwAHCwfYAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAEA8wsRC8ccKhqQMUguSUdpQwZMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAAABAO0yKx7/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS/+/Igv/ksmH/5LJh/+SyYf/ksmH/MicV/wAAAO9McEcATHBHAExwRwBMcEcAHiwcghAXDroZJReeIDAegik8JmQzTDBEPlw6IElsRAFMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwAJDgnRFRIM//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/ou27/5LJh/+SyYf/ksmH/5LJh/xoUCv8HCwfYTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAFB4TpwAAAP/cvYL/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/yzYr/5LJh/+SyYf/ksmH/5LJh/8yfVv8AAAD/FB0Sq0xwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHACQ1IXUAAAD/o4xh//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/6r50/+SyYf/ksmH/5LJh/+SyYf+AZDb/AAAA/yY5I2tMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwA0TjE7AAAA/2FUOv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/8s6L/+SyYv/ksmH/5LJh/+SyYf/ZqVz/GRMK/wABAPhBXzwYTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcASGpDBQECAfAXEw3/8tGQ//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS/+m8cP/ksmH/5LJh/+SyYf/ksmH/XEcn/wAAAP8aJxmOTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHADhTNC4fLh2FDhUNwAUIBeAAAADpBwsH2RIbEbMlNiJ0P147G0xwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwASHBGuAAAA/8Clcv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//DLhv/ksmH/5LJh/+SyYf/ksmH/kXE9/wAAAP8FCAXeRWVADUxwRwBMcEcATHBHAExwRwBMcEcARWVADhQdEqUAAAD/AAAA/wAAAP8PDQn/GhYP/wgHBf8AAAD/AAAA/wAAAPkaJhiQRWVADExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAKT0mYAAAAP9yYkT/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//TSkf/nuWz/5LJh/+SyYf/ksmH/mXhB/wYEAv8CAwLtOVU2LExwRwBMcEcATHBHAExwRwBMcEcAO1g3JggMB9cAAAD/KCIX/5aBWf/dvoT/9dOS//XTkv/z0ZD/zbF6/4NxTv8bFxD/AAAA/wcLB9k6VTYsTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAEJiPRAAAQD3HhoR//PRkf/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/ux4D/5LJh/+SyYf/jsWD/el8z/wEBAP8CAwLwNlAyOExwRwBMcEcATHBHAExwRwBMcEcANlAyNQIDAu4BAAD/eWhI//HQkP/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/68qM/3JiQ/8CAQH/AgMC8TdRMzZMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAExwRqQAAAP+7oW//9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/00Y//5bVm/+SyYf/gr1//XUgn/wAAAP8CBALuNE4xOExwRwBMcEcATHBHAExwRwBMcEcAP106HQMEA+kAAAD/i3dS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/k35X/wAAAP8EBwThRWVADExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHADFJLkQAAAD/Y1U6//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/6r91/+SyYf/AllH/MCUU/wAAAP8JDQjRPFk4JUxwRwBMcEcATHBHAExwRwBMcEcARmhCCQsQCsoAAAD/gnBN//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv9tXkH/AAAA/x4sHIhMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBKbUUABwsH2Q0LB//oyIr/9dOS//XTkv/105L/9dOS//XTkv/105L/8MmE/+KxYP+DZjf/CQcD/wAAAP8VHxOgRmhBCkxwRwBMcEcATHBHAExwRwBMcEcAS25GABMdEqgAAAD/aFk+//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/786O/yIeFP8BAgH0QmI+EUxwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHACIyH3kAAAD/jnpU//XTkv/105L/9dOS//XTkv/105L/9NGQ/8adWv82Khb/AAAA/wIDAvApPSdZTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHACg7JWIAAAD/Licb/+/Ojv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv+GdFD/AAAA/yc6JWZMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwA/XTsbAAAA+iYgFv/z0ZH/9dOS//XTkv/105L/8M6O/4JtSP8JBwT/AAAA/w8WDrs9WjkgTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAD9dOxoCAwLuCAcE/8queP/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/zrF6/wAAAP8THRKqTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHABMcEqwAAAD/sJhp//XTkv/105L/qpJl/yMeFf8AAAD/BQcE4yo/KFhLbkYATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAEtuRgARGRCyAAAA/5R/WP/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//PRkf8HBgT/CAwH1UxwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwAwRy1JAAAA/1JHMf/WuH//SD0q/wAAAP8AAAD/FiEVnUVlQA5McEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwArQChXAAAA/0I4J//00pH/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/FBEM/wECAeJMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcASGtDAwQHBOAGBQP/CgkG/wAAAP8LEArJNU4xOkxwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBCYj4UAwQC6QcGBP/Psnv/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9NKR/wgHBf8IDAfWTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwAiMyBzAAAA/wUHBOMqPidcSm1FAkxwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAFiEVngAAAP97akn/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS/9K0fP8AAAD/EhwRrkxwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAR2lCBitAKV9FZUAOTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcANU8xOAAAAP4hHBP/7cyN//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv+MeVP/AAAA/yY4I2tMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcASWxEAgoPCc0AAAD/qJBj//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/y0JD/KSMY/wABAPdAXzwVTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAEZnQQ0AAQD0AAAA/wgHBP9lVjz/1bd+//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9dOS//XTkv/105L/9NKR//HMiP/tw3v/f2c+/wAAAP8YIxaZTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcAPls6HR8tHIUDBAPoAAAA/wMDAv9IPiv/p49h/+zGgf/wyYT/8MqE//DJhP/wyYP/78iC/+7HgP/txX3/7MN6/+vAdf/pvHD/57hq/+SzYv/ksmH/on5E/wQDAf8CBALrQWA8GExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcASGpDBSxBKVUNFAzCAAAA/wAAAP8VEQn/ZE4q/7KLS//jsWD/5LJh/+SyYf/ksmH/5LJh/+SyYf/ksmH/5LJh/+SyYf/hsF//gGQ2/wYEAv8AAQD4MUkuQ0xwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHADlUNSwZJReXAAEA9AAAAP8AAAD/HBYM/2NNKv+hfkT/1qdb/+SyYf/ksmH/5LJh/+GvX/+jf0X/LyQT/wAAAP8CAwLwMUguQ0xwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAERkPw8qPyheEhsRsAABAPUAAAD/AAAA/wAAAP8WEQn/KB8R/yYeEP8KCAT/AAAA/wAAAP8PFw61PFk4JUxwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBFZkEKMkovRCExH38THBGwCQ0I0gMFA+QFBwTiCxELyB0rG484UjQwTHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcATHBHAExwRwBMcEcA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////gD////////8AH////////gAP///+AH/8AAf///wAH/wAB///8AAH/AAD///gAAP4AAP//8AAAfgAA///gAAB+AAD//+AAAD4AAP//wAAAPgAA///AAAAeAAH//8AAAB4AAf//wAAAHgAD///AAAAeAAf//8AAAB4AH///wAAAHgH////AAAAf/////8AAAB//////wAAAH//////AAAAf/////8AAAD+AP///4AAAPgAP///gAAB8AAf//+AAAPgAA///8AAB8AAB///wAAPgAAH///gAB+AAAP//+AAfwAAA///4AD+AAAD///wA/4AAAP///AH/AAAA///8B/4AAAD///4P/gAAAP///j/8AAAA//////gAAAD/////+AAAAf/////8AAAB//////8AAAP//////+AAB///////+AAP////////AD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=";
