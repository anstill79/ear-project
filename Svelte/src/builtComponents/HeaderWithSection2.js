var W=Object.defineProperty;var X=(e,t,n)=>t in e?W(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var x=(e,t,n)=>(X(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function d(){}function D(e){return e()}function F(){return Object.create(null)}function w(e){e.forEach(D)}function G(e){return typeof e=="function"}function P(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function Y(e){return Object.keys(e).length===0}function p(e,t){e.appendChild(t)}function y(e,t,n){e.insertBefore(t,n||null)}function g(e){e.parentNode&&e.parentNode.removeChild(e)}function m(e){return document.createElement(e)}function C(e){return document.createTextNode(e)}function O(){return C(" ")}function l(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function Z(e){return Array.from(e.childNodes)}function J(e,t){t=""+t,e.data!==t&&(e.data=t)}let j;function b(e){j=e}const _=[],K=[];let $=[];const U=[],k=Promise.resolve();let E=!1;function ee(){E||(E=!0,k.then(Q))}function A(e){$.push(e)}const N=new Set;let h=0;function Q(){if(h!==0)return;const e=j;do{try{for(;h<_.length;){const t=_[h];h++,b(t),te(t.$$)}}catch(t){throw _.length=0,h=0,t}for(b(null),_.length=0,h=0;K.length;)K.pop()();for(let t=0;t<$.length;t+=1){const n=$[t];N.has(n)||(N.add(n),n())}$.length=0}while(_.length);for(;U.length;)U.pop()();E=!1,N.clear(),b(e)}function te(e){if(e.fragment!==null){e.update(),w(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(A)}}function ne(e){const t=[],n=[];$.forEach(i=>e.indexOf(i)===-1?t.push(i):n.push(i)),n.forEach(i=>i()),$=t}const v=new Set;let re;function S(e,t){e&&e.i&&(v.delete(e),e.i(t))}function V(e,t,n,i){if(e&&e.o){if(v.has(e))return;v.add(e),re.c.push(()=>{v.delete(e),i&&(n&&e.d(1),i())}),e.o(t)}else i&&i()}function z(e){e&&e.c()}function q(e,t,n){const{fragment:i,after_update:r}=e.$$;i&&i.m(t,n),A(()=>{const s=e.$$.on_mount.map(D).filter(G);e.$$.on_destroy?e.$$.on_destroy.push(...s):w(s),e.$$.on_mount=[]}),r.forEach(A)}function L(e,t){const n=e.$$;n.fragment!==null&&(ne(n.after_update),w(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ie(e,t){e.$$.dirty[0]===-1&&(_.push(e),ee(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function I(e,t,n,i,r,s,u=null,f=[-1]){const c=j;b(e);const o=e.$$={fragment:null,ctx:[],props:s,update:d,not_equal:r,bound:F(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(c?c.$$.context:[])),callbacks:F(),dirty:f,skip_bound:!1,root:t.target||c.$$.root};u&&u(o.root);let B=!1;if(o.ctx=n?n(e,t.props||{},(a,H,...R)=>{const T=R.length?R[0]:H;return o.ctx&&r(o.ctx[a],o.ctx[a]=T)&&(!o.skip_bound&&o.bound[a]&&o.bound[a](T),B&&ie(e,a)),H}):[],o.update(),B=!0,w(o.before_update),o.fragment=i?i(o.ctx):!1,t.target){if(t.hydrate){const a=Z(t.target);o.fragment&&o.fragment.l(a),a.forEach(g)}else o.fragment&&o.fragment.c();t.intro&&S(e.$$.fragment),q(e,t.target,t.anchor),Q()}b(c)}class M{constructor(){x(this,"$$");x(this,"$$set")}$destroy(){L(this,1),this.$destroy=d}$on(t,n){if(!G(n))return d;const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(t){this.$$set&&!Y(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const se="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(se);function oe(e){let t,n,i,r,s,u,f;return{c(){t=m("header"),n=m("a"),i=C(e[0]),r=O(),s=m("button"),s.textContent="Menu",u=O(),f=m("div"),f.innerHTML='<div id="menu-btn-wrapper" class="svelte-udbqn9"><button class="svelte-udbqn9">SAL</button> <button class="svelte-udbqn9">Audiogram</button> <button class="svelte-udbqn9">CROS Helper</button></div>',l(n,"href","/"),l(n,"class","svelte-udbqn9"),l(s,"popovertarget","menu-popover"),l(s,"class","svelte-udbqn9"),l(t,"class","svelte-udbqn9"),l(f,"id","menu-popover"),l(f,"popover",""),l(f,"class","svelte-udbqn9")},m(c,o){y(c,t,o),p(t,n),p(n,i),p(t,r),p(t,s),y(c,u,o),y(c,f,o)},p(c,[o]){o&1&&J(i,c[0])},i:d,o:d,d(c){c&&(g(t),g(u),g(f))}}}function ue(e,t,n){let{title:i}=t;return e.$$set=r=>{"title"in r&&n(0,i=r.title)},[i]}class ce extends M{constructor(t){super(),I(this,t,ue,oe,P,{title:0})}}function fe(e){let t,n,i;return{c(){t=m("div"),n=m("span"),i=C(e[0]),l(n,"class","svelte-149fml5"),l(t,"id","sub_section"),l(t,"class","svelte-149fml5")},m(r,s){y(r,t,s),p(t,n),p(n,i)},p(r,[s]){s&1&&J(i,r[0])},i:d,o:d,d(r){r&&g(t)}}}function le(e,t,n){let{sectionName:i="Audiogram"}=t;return e.$$set=r=>{"sectionName"in r&&n(0,i=r.sectionName)},[i]}class ae extends M{constructor(t){super(),I(this,t,le,fe,P,{sectionName:0})}}function de(e){let t,n,i,r,s;return n=new ce({props:{title:pe}}),r=new ae({props:{sectionName:me}}),{c(){t=m("main"),z(n.$$.fragment),i=O(),z(r.$$.fragment)},m(u,f){y(u,t,f),q(n,t,null),p(t,i),q(r,t,null),s=!0},p:d,i(u){s||(S(n.$$.fragment,u),S(r.$$.fragment,u),s=!0)},o(u){V(n.$$.fragment,u),V(r.$$.fragment,u),s=!1},d(u){u&&g(t),L(n),L(r)}}}let pe="Ear Project",me="Sensorineural Acuity Level";class he extends M{constructor(t){super(),I(this,t,null,de,P,{})}}new he({target:document.getElementById("section")});
