(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{127:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return C}));var o=n(0),a=n.n(o),i=n(44);let r=[],s=new Map,l=!1,c=0,u=0,d=null,h=null;function g(e,t,n){return Math.min(Math.max(e,t),n)}function m(){let e=c-w.x,t=u-w.y,n=Math.sqrt(e*e+t*t),o=Math.atan2(t,e);return[w.x+Math.cos(o)*g(n,0,200),w.y+Math.sin(o)*g(n,0,200)]}class f{constructor(e,t){this.x=e,this.y=t}draw(e){console.error("draw() called on base Object")}update(e){console.error("update() called on base Object")}}class p extends f{constructor(e,t,n,o){super(e,t),this.size=n,this.color=o,this.x_velocity=0,this.y_velocity=0}draw(e){e.beginPath(),e.arc(this.x,this.y,this.size,0,2*Math.PI),e.fillStyle=this.color,e.fill()}update(e){this.y>=500||(this.x+=this.x_velocity*e,this.y+=this.y_velocity*e,this.y_velocity+=500*e)}}class y extends f{draw(e){e.drawImage(this.image,this.x-11.5,this.y-7,23,14),e.fillStyle="black",e.textAlign="center",e.fillText(this.username,this.x,this.y+20)}fire(e,t){console.log(t);let n=new p(this.x,this.y,3,"#000000");n.x_velocity=Math.cos(e)*t,n.y_velocity=Math.sin(e)*t,console.log(n.x_velocity),console.log(n.y_velocity),r.push(n)}}let w=new y(50,50),x=null,v=0,b=0,k=0,S=0;function M(e){const t=(e-v)/1e3;let n=x.getContext("2d");n.clearRect(0,0,x.width,x.height);for(let e of r)e.update(t),e.draw(n);if(l){k=0,S=0;let[e,t]=m();n.beginPath(),n.moveTo(w.x,w.y),n.lineTo(e,t),n.stroke()}k&&(n.beginPath(),n.setLineDash([5,5]),n.moveTo(w.x,w.y),n.lineTo(k,S),n.stroke(),n.setLineDash([]));for(let e of s.values())e.draw(n);n.fillStyle="black",n.textAlign="center";let o=n.font;n.font="30px Comic Sans MS",n.fillText(b.toString(),250,30),n.font=o,v=e,requestAnimationFrame(M)}function I(e,t){let n=document.createElement("canvas"),o=document.createElement("canvas"),a=n.getContext("2d"),i=o.getContext("2d");n.width=e.width,n.height=e.height,o.width=e.width,o.height=e.height,a.drawImage(h,0,0),a.globalCompositeOperation="source-atop",a.fillStyle=t,a.fillRect(0,0,h.width,h.height),a.globalCompositeOperation="source-over",i.drawImage(h,0,0),i.globalCompositeOperation="color",i.drawImage(n,0,0),i.globalCompositeOperation="source-over";let r=new Image;return r.src=o.toDataURL("image/png"),r}function _(e){d=new WebSocket(e),d.onopen=function(e){console.log(i.b.username),d.send(localStorage.getItem("token"))},d.onmessage=function(e){console.log(e.data);let t=JSON.parse(e.data);if("your tank"==t.type)w=new y(t.x,t.y),w.color="blue",w.username=t.username,w.image=I(h,w.color),s.set(w.username,w),requestAnimationFrame(M);else if("enemy tank"==t.type){let e=new y(t.x,t.y);e.username=t.username,e.color="red",e.image=I(h,e.color),s.set(t.username,e)}else"fire"==t.type?(s.get(t.player).fire(t.angle,t.force),k=0,S=0):"countdown"==t.type&&(b=t.countdown)},d.onclose=function(e){console.log("closing"),console.log(e.code)}}class C extends a.a.Component{componentDidMount(){h=new Image,h.crossOrigin="anonymous",h.src="/src/public/tank.png",h.onload=()=>{h=I(h,"green"),i.c.address?_(i.c.address):Object(i.d)("/game/request/").then(e=>{_(e.data)})},x=this.refs.game,x.addEventListener("mousedown",e=>{console.log("aiming"),l=!0}),x.addEventListener("mouseup",e=>{l=!1;let[t,n]=m();[k,S]=[t,n],t-=w.x,n-=w.y;let o=Math.sqrt(t*t+n*n);console.log(o);let a=Math.atan2(n,t);d.send(JSON.stringify({type:"fire",angle:a,force:3*o}))}),x.addEventListener("mousemove",e=>{[c,u]=function(e,t){let n=e.getBoundingClientRect();return[t.x-n.left,t.y-n.top]}(x,e)})}render(){return a.a.createElement("div",{className:"game_container"},a.a.createElement("canvas",{ref:"game",width:"500px",height:"500px"}))}}},44:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"d",(function(){return l})),n.d(t,"f",(function(){return c})),n.d(t,"e",(function(){return u})),n.d(t,"b",(function(){return d})),n.d(t,"c",(function(){return h}));var o=n(46),a=n.n(o),i=n(48),r=n.n(i);const s="http://25.64.141.174:8000/api/v1";function l(e){return a.a.get(s+e,{headers:{Authorization:"Token "+localStorage.getItem("token")}})}function c(e,t){return localStorage.getItem("token")?a.a.post(s+e,t,{headers:{Authorization:"Token "+localStorage.getItem("token")}}):a.a.post(s+e,t)}function u(e){return r()(s+e,{method:"GET",headers:{Authorization:"Token "+localStorage.getItem("token")}})}const d={username:"",player_id:-1},h={address:""}}}]);