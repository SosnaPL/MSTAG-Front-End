(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{292:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return s}));var a=n(0),r=n.n(a),i=n(47),o=n(94);class s extends r.a.Component{constructor(e){super(e),this.typingTimeout=500,this.sendInvite=()=>{this.state.username&&(console.log("send invite"),Object(i.e)("/users/set_username/",{username:this.state.username}).then(()=>{window.location.href=location.protocol+"//"+location.hostname+(location.port?":"+location.port:"")+"/"}).catch(e=>{console.log(e)}))},this.onChange=e=>{let t=e.target.value.toString();this.setState({username:t},()=>{clearTimeout(this.typingTimer),this.typingTimer=setTimeout(()=>{this.checkUserExists(t)},this.typingTimeout)})},this.handleKeyDown=e=>{"Enter"===e.key&&this.sendInvite()},this.checkUserExists=e=>{Object(i.c)("/users/check_exists/"+e).then(e=>{this.setState({username_available:!e.data.exists})}).catch(e=>{console.log(e)})},window.history.replaceState({},"MSTAG","/"),this.state={username_available:!1,username:null}}render(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,"Username: ",r.a.createElement("input",{type:"text",spellCheck:"false",onChange:this.onChange.bind(this),onKeyDown:this.handleKeyDown.bind(this)}),this.state.username_available?"✔️":"❌"),r.a.createElement(o.a,{variant:"outline-dark",disabled:!this.state.username_available,onClick:this.sendInvite},"Send"))}}},47:function(e,t,n){"use strict";n.d(t,"c",(function(){return c})),n.d(t,"e",(function(){return u})),n.d(t,"d",(function(){return l})),n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return h}));var a=n(56),r=n.n(a),i=n(57),o=n.n(i);const s="https://micromstag.westeurope.cloudapp.azure.com:443/api/v1";function c(e){return d.token?r.a.get(s+e,{headers:{Authorization:"Token "+d.token}}):r.a.get(s+e)}function u(e,t){return d.token?r.a.post(s+e,t,{headers:{Authorization:"Token "+d.token}}):r.a.post(s+e,t)}function l(e){return o()(s+e,{method:"GET",headers:{Authorization:"Token "+d.token}},{metadata:!0})}const d={username:"",player_id:-1,token:""},h={address:""}},94:function(e,t,n){"use strict";var a=n(1),r=n(5),i=n(9),o=n.n(i),s=n(0),c=n.n(s),u=n(10);var l=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter((function(e){return null!=e})).reduce((function(e,t){if("function"!=typeof t)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===e?t:function(){for(var n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];e.apply(this,a),t.apply(this,a)}}),null)};function d(e){return!e||"#"===e.trim()}var h=c.a.forwardRef((function(e,t){var n=e.as,i=void 0===n?"a":n,o=e.disabled,s=e.onKeyDown,u=Object(r.a)(e,["as","disabled","onKeyDown"]),h=function(e){var t=u.href,n=u.onClick;(o||d(t))&&e.preventDefault(),o?e.stopPropagation():n&&n(e)};return d(u.href)&&(u.role=u.role||"button",u.href=u.href||"#"),o&&(u.tabIndex=-1,u["aria-disabled"]=!0),c.a.createElement(i,Object(a.a)({ref:t},u,{onClick:h,onKeyDown:l((function(e){" "===e.key&&(e.preventDefault(),h(e))}),s)}))}));h.displayName="SafeAnchor";var f=h,p=c.a.forwardRef((function(e,t){var n=e.bsPrefix,i=e.variant,s=e.size,l=e.active,d=e.className,h=e.block,p=e.type,m=e.as,v=Object(r.a)(e,["bsPrefix","variant","size","active","className","block","type","as"]),b=Object(u.a)(n,"btn"),y=o()(d,b,l&&"active",b+"-"+i,h&&b+"-block",s&&b+"-"+s);if(v.href)return c.a.createElement(f,Object(a.a)({},v,{as:m,ref:t,className:o()(y,v.disabled&&"disabled")}));t&&(v.ref=t),m||(v.type=p);var k=m||"button";return c.a.createElement(k,Object(a.a)({},v,{className:y}))}));p.displayName="Button",p.defaultProps={variant:"primary",active:!1,disabled:!1,type:"button"};t.a=p}}]);