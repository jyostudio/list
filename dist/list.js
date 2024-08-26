var R=new Map([["number","Number"],["string","String"],["boolean","Boolean"],["symbol","Symbol"],["bigint","BigInt"],["undefined","(undefined)"]]),$="##INNER_TYPE##",b="@@INNER_TYPE@@";function v(n,e){if(Array.isArray(e)){for(let t=0;t<e.length;t++)if(v(n,e[t]))return!0;return!1}if(typeof e!="function")return e==="*"&&n!==null||e==="..."||e===null&&n===null||e===typeof n;switch(typeof n){case"function":case"object":break;default:n=Object(n);break}return n?.[b]?n[b]===e?.[$]:n instanceof e||n===e}function E(n){if(n===null)return"null";if(n==="*")return"(any)";let e=typeof n;if(e in R)return R.get(e);let t=(n.name||n.constructor.name||"(unknown)").split(" ").pop();return[$,b].forEach(r=>{n?.[r]&&(t+=`<${E(n?.[r])}>`)}),e==="function"&&t==="anonymous"?"(anonymous)":t}function o(n,e){let t=new Map,r=null;function i(...u){if(r)return r.apply(this,u);h(new Error,u)}function h(u,a){let s=u.stack.split(`
`).splice(3),f="",l=`
`,w="";s.forEach((d,y,m)=>{let g=d.trim().split(" "),I=g.length===3?g[1]:"(anonymous)",A=I.split(".").pop();m[y]={fullMethodName:I,methodName:A,link:g.length===3?g[2]:g[1]},y?l+=`${A}	${m[y].link}
`:w=A});let T=Array.from(t.keys()).find(d=>d.length===a.length);if(!T)throw f+=`The function "${w}" does not have an overload that takes ${a.length} arguments.`,f+=l,new Error(f);let p=!1;if(T.forEach((d,y)=>{if(!v(a[y],d)){let m=Array.isArray(d)?d.map(E).join("\u3001"):E(d);f+=`${p?`
`:""}Argument ${y+1}: Cannot convert from "${E(a[y])}" to "${m}".`,p=!0}}),p)throw f=`Error calling function "${w}"
${f}`,f+=l,new Error(f)}function c(...u){if(!t.size)return i.apply(this,u);let a=Array.from(t.keys()).filter(s=>s.length===u.length||s[s.length-1]==="...");t:for(let s=0;s<a.length;s++){let f=a[s];if(typeof f[0]<"u"&&f[0]!=="..."&&u.length===0)continue t;for(let l=0;l<u.length;l++)if(!v(u[l],f[l]||f[f.length-1]))continue t;return t.get(f).apply(this,u)}return i.apply(this,u)}if(c.add=function(u,a){if(!Array.isArray(u))throw new TypeError('"types" must be an array.');if(typeof a!="function")throw new TypeError('"fn" must be a function.');for(let s=0;s<u.length;s++)if(u[s]==="..."&&s!==u.length-1)throw new Error('A "..." parameter must be the last parameter in a formal parameter list.');return t.size&&Array.from(t.keys()).forEach(s=>{if(s.length===u.length){for(let f=0;f<s.length;f++)if(s[f]!==u[f])return;throw new Error("Function with the same signature already exists.")}}),u.forEach(s=>{let f=Array.isArray(s);if(typeof s!="function"&&!f&&s!=="*"&&s!=="...")throw new Error('The expected type must be Class, Array, "*" or the last parameter type can also be "...".');if(f){for(let l=0;l<s.length;l++)if(typeof s[l]!="function"&&s[l]!==null&&s[l]!=="*")throw new Error('The predetermined type enumeration content must be a Class, null or "*".')}}),t.set(u,a),c},c.any=function(u){if(typeof u!="function")throw new TypeError('"fn" must be a function.');if(r)throw new Error('"any" function is already defined.');return r=u,c},Array.isArray(n)&&typeof e=="function")c.add(n,e);else if(n||e)throw new TypeError('"defaultTypes" must be an array and "defaultFn" must be a function.');return c}var N=class n{#t=[];#e=null;#i=null;get length(){return this.#t.length}get[Symbol.isConcatSpreadable](){return!0}get[Symbol.toStringTag](){return`List<${this.#e.name}>`}static#r=function(...e){return n.#r=o().add([Function],function(t){this.#e=t}).add([Function,[Array,n.T(typeof e?.[0]=="function"?e[0]:class{})]],function(t,r){this.#e=t;for(let i of r)this.add(i)}),n.#r.call(this,...e)};constructor(...e){return n.#r.apply(this,e),this.#o()}static T(...e){let t=new WeakMap;return n.T=o([Function],function(r){let i=t.get(r);return!i&&t.set(r,i=new Proxy(n,{get:(h,c,u)=>c==="##INNER_TYPE##"?r:h[c]})),i}),n.T(...e)}#o(){return this.#i=new Proxy(this,{get:(e,t,r)=>{if(t==="@@INNER_TYPE@@")return this.#e;let i=null;return typeof t=="symbol"?i=this[t]:typeof t=="string"&&(/^\d+$/.test(t)?i=this.#t[t]:i=this[t]),typeof i=="function"?i.bind(this):i},set:(e,t,r,i)=>{if(typeof t=="string"&&/^\d+$/.test(t)){if(t>=this.#t.length)throw new Error(`Index ${t} out of bounds, List length is ${this.#t.length}`);return o([this.#e],h=>{this.#t[t]=h}).call(this,r),!0}throw new Error(`Cannot set property "${t}" on List`)}})}#n(e){if(e<0)throw new Error(`Index ${e} out of bounds, Index must be greater than or equal to 0`);if(e>=this.#t.length)throw new Error(`Index ${e} out of bounds, List length is ${this.#t.length}`)}[Symbol.iterator]=function*(){for(let e=0;e<this.#t.length;e++)yield this.#t[e]};add(...e){return this.add=o([this.#e],function(t){this.#t.push(t)}),this.add(...e)}addRange(...e){return n.prototype.addRange=o([[Array,n]],function(t){for(let r of t)this.add(r)}).add(["..."],function(...t){for(let r of t)this.add(r)}),this.addRange(...e)}asReadOnly(...e){let t=["add","addRange","insert","insertRange","remove","removeAt","removeAll","removeRange","clear","reverse","sort","asReadOnly"];return n.prototype.asReadOnly=o([],function(){return new Proxy(this,{get:(r,i,h)=>{if(t.includes(i))throw new Error(`Cannot access method "${i}" on read-only List`);return this.#i[i]},set:(r,i,h,c)=>{throw new Error(`Cannot set property "${i}" on read-only List`)}})}),this.asReadOnly(...e)}concat(...e){return n.prototype.concat=o([[Array,n]],function(t){let r=new n(this.#e);for(let i of this)r.add(i);for(let i of t)r.add(i);return r}),this.concat(...e)}clear(...e){return n.prototype.clear=o([],function(){this.#t=[]}),this.clear(...e)}clone(...e){return n.prototype.clone=o([],function(){return new n(this.#e,this)}),this.clone(...e)}contains(...e){return this.contains=o([this.#e],function(t){return this.#t.includes(t)}),this.contains(...e)}copyTo(...e){return n.prototype.copyTo=o().add([Array],function(t){this.#t.forEach((r,i)=>{t[i]=r})}).add([Array,Number],function(t,r){this.#t.forEach((i,h)=>{t[r+h]=i})}).add([Array,Number,Number],function(t,r,i){for(let h=0;h<i;h++)t[r+h]=this.#t[h]}),this.copyTo(...e)}exists(...e){return n.prototype.exists=o([Function],function(t){return this.#t.some(t)}),this.exists(...e)}forEach(...e){return n.prototype.forEach=o([Function],function(t){this.#t.forEach(t)}),this.forEach(...e)}find(...e){return n.prototype.find=o([Function],function(t){return this.#t.find(t)}),this.find(...e)}findIndex(...e){return n.prototype.findIndex=o([Function],function(t){return this.#t.findIndex(t)}),this.findIndex(...e)}findLast(...e){return n.prototype.findLast=o([Function],function(t){this.#t.reverse();let r=this.#t.find(t);return this.#t.reverse(),r}),this.findLast(...e)}findLastIndex(...e){return n.prototype.findLastIndex=o([Function],function(t){this.#t.reverse();let r=this.#t.findIndex(t);return this.#t.reverse(),r}),this.findLastIndex(...e)}getInnerType(...e){return n.prototype.getInnerType=o([],function(){return this.#e}),this.getInnerType(...e)}insert(...e){return this.insert=o([Number,this.#e],function(t,r){this.#n(t),this.#t.splice(t,0,r)}),this.insert(...e)}insertRange(...e){return n.prototype.insertRange=o([Number,[Array,n]],function(t,r){this.#n(t);for(let i of r)this.insert(t++,i)}).add([Number,"..."],function(t,...r){this.#n(t);for(let i of r)this.insert(t++,i)}),this.insertRange(...e)}indexOf(...e){return this.indexOf=o([this.#e],function(t){return this.#t.indexOf(t)}),this.indexOf(...e)}lastIndexOf(...e){return this.lastIndexOf=o([this.#e],function(t){return this.#t.lastIndexOf(t)}),this.lastIndexOf(...e)}remove(...e){return this.remove=o([this.#e],function(t){let r=this.#t.indexOf(t);return r!==-1?(this.#t.splice(r,1),!0):!1}),this.remove(...e)}removeAt(...e){return n.prototype.removeAt=o([Number],function(t){this.#n(t),this.#t.splice(t,1)}),this.removeAt(...e)}removeAll(...e){return n.prototype.removeAll=o([Function],function(t){let r=0;for(let i=this.#t.length-1;i>=0;i--)t(this.#t[i])&&(this.#t.splice(i,1),r++);return r}),this.removeAll(...e)}removeRange(...e){return n.prototype.removeRange=o([Number,Number],function(t,r){this.#n(t),this.#n(t+r-1),this.#t.splice(t,r)}),this.removeRange(...e)}reverse(...e){return n.prototype.reverse=o([],function(){this.#t.reverse()}).add([Number,Number],function(t,r){this.#n(t),this.#n(t+r-1);let i=this.#t.splice(t,r);i.reverse(),this.#t.splice(t,0,...i)}),this.reverse(...e)}slice(...e){return n.prototype.slice=o().add([Number,Number],function(t,r){return new n(this.#e,this.#t.slice(t,r))}),this.slice(...e)}sort(...e){return n.prototype.sort=o().add([],function(){this.#t.sort()}).add([Function],function(t){this.#t.sort(t)}),this.sort(...e)}toArray(...e){return n.prototype.toArray=o([],function(){return this.#t.slice()}),this.toArray(...e)}trueForAll(...e){return n.prototype.trueForAll=o([Function],function(t){return this.#t.every(t)}),this.trueForAll(...e)}toString(...e){return n.prototype.toString=o().any(function(...t){return this.#t.toString(...t)}),this.toString(...e)}};export{N as default};
//# sourceMappingURL=list.js.map
