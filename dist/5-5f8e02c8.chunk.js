(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{77:function(e,a,t){"use strict";t.r(a),t.d(a,"default",(function(){return p}));var n=t(0),s=t.n(n),l=t(41),r=t(40),i=t(79),m=t(72),o=t(75),c=t(13),u=t(44),h=t.n(u);class p extends s.a.Component{constructor(){super(...arguments),this.state={username:"",email:"",password:""},this.onChange=e=>{let a=e.target;this.setState({[a.name]:a.value})},this.createUser=e=>{e.preventDefault(),h.a.post("http://25.64.141.174:8000/api/v1/users/register/",this.state).then(()=>{console.log("Registered"),this.setState({username:"",email:"",password:""})}).catch(e=>{console.log(e.data)})},this.defaultIfEmpty=e=>""===e?"":e}componentDidMount(){if(this.props.user){const{username:e,email:a,password:t}=this.props.user;this.setState({username:e,email:a,password:t})}}render(){return s.a.createElement(s.a.Fragment,null,s.a.createElement(l.a,null,s.a.createElement(r.a,{className:"d-flex justify-content-center"},s.a.createElement(i.a,{onSubmit:this.createUser},s.a.createElement(i.a.Group,null,s.a.createElement(i.a.Label,null,"Username:"),s.a.createElement(m.a,{name:"username",type:"text",onChange:this.onChange.bind(this),value:this.state.username})),s.a.createElement(i.a.Group,null,s.a.createElement(i.a.Label,null,"Password:"),s.a.createElement(m.a,{name:"password",type:"password",onChange:this.onChange.bind(this),value:this.state.password})),s.a.createElement(i.a.Group,null,s.a.createElement(i.a.Label,null,"Email:"),s.a.createElement(m.a,{name:"email",type:"email",onChange:this.onChange.bind(this),value:this.state.email})),s.a.createElement(l.a,null,s.a.createElement(r.a,{className:"d-flex justify-content-center"},s.a.createElement(o.a,{variant:"outline-dark",size:"lg",type:"submit"},"Send")))))),s.a.createElement(l.a,null,s.a.createElement(r.a,{className:"d-flex justify-content-center"},s.a.createElement(c.b,{to:"/"},s.a.createElement(o.a,{variant:"outline-dark",size:"lg"},"Back")))))}}}}]);