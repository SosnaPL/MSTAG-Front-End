(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{75:function(e,a,t){"use strict";var n=t(1),r=t(2),l=t(7),c=t.n(l),i=t(0),o=t.n(i),s=t(8);var u=function(){for(var e=arguments.length,a=new Array(e),t=0;t<e;t++)a[t]=arguments[t];return a.filter((function(e){return null!=e})).reduce((function(e,a){if("function"!=typeof a)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===e?a:function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];e.apply(this,n),a.apply(this,n)}}),null)};function f(e){return!e||"#"===e.trim()}var d=o.a.forwardRef((function(e,a){var t=e.as,l=void 0===t?"a":t,c=e.disabled,i=e.onKeyDown,s=Object(r.a)(e,["as","disabled","onKeyDown"]),d=function(e){var a=s.href,t=s.onClick;(c||f(a))&&e.preventDefault(),c?e.stopPropagation():t&&t(e)};return f(s.href)&&(s.role=s.role||"button",s.href=s.href||"#"),c&&(s.tabIndex=-1,s["aria-disabled"]=!0),o.a.createElement(l,Object(n.a)({ref:a},s,{onClick:d,onKeyDown:u((function(e){" "===e.key&&(e.preventDefault(),d(e))}),i)}))}));d.displayName="SafeAnchor";var m=d,b=o.a.forwardRef((function(e,a){var t=e.bsPrefix,l=e.variant,i=e.size,u=e.active,f=e.className,d=e.block,b=e.type,p=e.as,v=Object(r.a)(e,["bsPrefix","variant","size","active","className","block","type","as"]),y=Object(s.a)(t,"btn"),E=c()(f,y,u&&"active",y+"-"+l,d&&y+"-block",i&&y+"-"+i);if(v.href)return o.a.createElement(m,Object(n.a)({},v,{as:p,ref:a,className:c()(E,v.disabled&&"disabled")}));a&&(v.ref=a),p||(v.type=b);var g=p||"button";return o.a.createElement(g,Object(n.a)({},v,{className:E}))}));b.displayName="Button",b.defaultProps={variant:"primary",active:!1,disabled:!1,type:"button"};a.a=b},76:function(e,a,t){"use strict";t.r(a),t.d(a,"default",(function(){return s}));var n=t(0),r=t.n(n),l=t(41),c=t(40),i=t(75),o=t(13);class s extends r.a.Component{render(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(l.a,null,r.a.createElement(c.a,{className:"d-flex justify-content-center"},r.a.createElement("h2",null,"Welcome to Definitely not umag2"))),r.a.createElement(l.a,null,r.a.createElement(c.a,{className:"d-flex justify-content-center"},r.a.createElement(o.b,{to:"/login"},r.a.createElement(i.a,{variant:"outline-dark",size:"lg"},"Log in!")))),r.a.createElement(l.a,null,r.a.createElement(c.a,{className:"d-flex justify-content-center"},r.a.createElement(o.b,{to:"/register"},r.a.createElement(i.a,{variant:"outline-dark",size:"lg"},"Sign up!")))),r.a.createElement(l.a,null,r.a.createElement(c.a,{className:"d-flex justify-content-center guest"},r.a.createElement(i.a,{variant:"outline-dark",size:"lg"},"Play as guest!"))))}}}}]);