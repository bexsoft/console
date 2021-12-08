(this["webpackJsonpportal-ui"]=this["webpackJsonpportal-ui"]||[]).push([[55,135],{336:function(e,t,a){"use strict";var n=a(0),o=Object(n.createContext)({});t.a=o},343:function(e,t,a){"use strict";a.d(t,"b",(function(){return r}));var n=a(68),o=a(90);function r(e){return Object(n.a)("MuiDialog",e)}var i=Object(o.a)("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]);t.a=i},347:function(e,t,a){"use strict";var n,o=a(15),r=a(3),i=a(0),c=a(38),l=a(328),s=a(322),d=a(417),u=a(418),b=a(419),p=a(250),j=a(260),m=a(116),f=a(30),O=a(45),h=a.n(O),x=a(125),g=a.n(x),v=a(124),C=a.n(v),S=a(122),k=a.n(S),y=a(2),w=function(){clearInterval(n)},M={displayErrorMessage:f.h},N=Object(c.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),M)(Object(j.a)((function(e){return Object(p.a)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},simpleError:{marginTop:5,padding:"2px 5px",fontSize:16,color:"#000"},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,a=e.modalSnackMessage,r=e.displayErrorMessage,c=e.customStyle,l=Object(i.useState)(!1),s=Object(o.a)(l,2),d=s[0],u=s[1],b=Object(i.useState)(!1),p=Object(o.a)(b,2),j=p[0],m=p[1],f=Object(i.useCallback)((function(){m(!1)}),[]);Object(i.useEffect)((function(){j||(r({detailedError:"",errorMessage:""}),u(!1))}),[r,j]),Object(i.useEffect)((function(){""!==a.message&&"error"===a.type&&m(!0)}),[f,a.message,a.type]);var O=h()(a,"message",""),x=h()(a,"detailedErrorMsg","");return"error"!==a.type||""===O?null:Object(y.jsx)(i.Fragment,{children:Object(y.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(j?t.modalErrorShow:""),style:c,onMouseOver:w,onMouseLeave:function(){n=setInterval(f,1e4)},children:[Object(y.jsx)("button",{className:t.closeButton,onClick:f,children:Object(y.jsx)(k.a,{})}),Object(y.jsxs)("div",{className:t.errorTitle,children:[Object(y.jsx)("span",{className:t.messageIcon,children:Object(y.jsx)(C.a,{})}),Object(y.jsx)("span",{className:t.errorLabel,children:O})]}),""!==x&&Object(y.jsxs)(i.Fragment,{children:[Object(y.jsx)("div",{className:t.detailsContainerLink,children:Object(y.jsxs)("button",{className:t.detailsButton,onClick:function(){u(!d)},children:["Details",Object(y.jsx)(g.a,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),Object(y.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:x})]})]})})}))),W={content:'" "',borderLeft:"2px solid #9C9C9C",height:33,width:1,position:"absolute"},D=Object(c.b)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:f.i});t.a=Object(j.a)((function(e){return Object(p.a)(Object(r.a)({dialogContainer:{padding:"8px 15px 22px"},closeContainer:{textAlign:"right"},closeButton:{height:16,width:16,padding:0,backgroundColor:"initial","&:hover":{backgroundColor:"initial"},"&:active":{backgroundColor:"initial"}},modalCloseIcon:{fontSize:35,color:"#9C9C9C",fontWeight:300,"&:hover":{color:"#9C9C9C"}},closeIcon:{"&::before":Object(r.a)(Object(r.a)({},W),{},{transform:"rotate(45deg)",height:12}),"&::after":Object(r.a)(Object(r.a)({},W),{},{transform:"rotate(-45deg)",height:12}),"&:hover::before, &:hover::after":{borderColor:"#9C9C9C"},display:"block",position:"relative",height:12,width:12},titleClass:{padding:"0px 50px 12px",fontSize:"1.2rem",fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},modalContent:{padding:"0 50px"},customDialogSize:{width:"100%",maxWidth:765}},m.y))}))(D((function(e){var t=e.onClose,a=e.modalOpen,n=e.title,c=e.children,p=e.classes,j=e.wideLimit,m=void 0===j||j,f=e.modalSnackMessage,O=e.noContentPadding,h=e.setModalSnackMessage,x=Object(i.useState)(!1),g=Object(o.a)(x,2),v=g[0],C=g[1];Object(i.useEffect)((function(){h("")}),[h]),Object(i.useEffect)((function(){if(f){if(""===f.message)return void C(!1);"error"!==f.type&&C(!0)}}),[f]);var S=m?{classes:{paper:p.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},k="";return f&&(k=f.detailedErrorMsg,(""===f.detailedErrorMsg||f.detailedErrorMsg.length<5)&&(k=f.message)),Object(y.jsx)(d.a,Object(r.a)(Object(r.a)({open:a,onClose:t,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description"},S),{},{children:Object(y.jsxs)("div",{className:p.dialogContainer,children:[Object(y.jsx)(N,{}),Object(y.jsx)(s.a,{open:v,className:p.snackBarModal,onClose:function(){C(!1),h("")},message:k,ContentProps:{className:"".concat(p.snackBar," ").concat(f&&"error"===f.type?p.errorSnackBar:"")},autoHideDuration:f&&"error"===f.type?1e4:5e3}),Object(y.jsx)("div",{className:p.closeContainer,children:Object(y.jsx)(l.a,{"aria-label":"close",className:p.closeButton,onClick:t,disableRipple:!0,size:"large",children:Object(y.jsx)("span",{className:p.closeIcon})})}),Object(y.jsx)(u.a,{id:"alert-dialog-title",className:p.titleClass,children:n}),Object(y.jsx)(b.a,{className:O?"":p.modalContent,children:c})]})}))})))},417:function(e,t,a){"use strict";var n=a(5),o=a(4),r=a(1),i=a(0),c=(a(11),a(7)),l=a(89),s=a(255),d=a(9),u=a(323),b=a(305),p=a(26),j=a(327),m=a(12),f=a(8),O=a(343),h=a(336),x=a(325),g=a(2),v=["aria-describedby","aria-labelledby","BackdropComponent","BackdropProps","children","className","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps"],C=Object(f.a)(x.a,{name:"MuiDialog",slot:"Backdrop",overrides:function(e,t){return t.backdrop}})({zIndex:-1}),S=Object(f.a)(u.a,{name:"MuiDialog",slot:"Root",overridesResolver:function(e,t){return t.root}})({"@media print":{position:"absolute !important"}}),k=Object(f.a)("div",{name:"MuiDialog",slot:"Container",overridesResolver:function(e,t){var a=e.ownerState;return[t.container,t["scroll".concat(Object(d.a)(a.scroll))]]}})((function(e){var t=e.ownerState;return Object(r.a)({height:"100%","@media print":{height:"auto"},outline:0},"paper"===t.scroll&&{display:"flex",justifyContent:"center",alignItems:"center"},"body"===t.scroll&&{overflowY:"auto",overflowX:"hidden",textAlign:"center","&:after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}})})),y=Object(f.a)(j.a,{name:"MuiDialog",slot:"Paper",overridesResolver:function(e,t){var a=e.ownerState;return[t.paper,t["scrollPaper".concat(Object(d.a)(a.scroll))],t["paperWidth".concat(Object(d.a)(String(a.maxWidth)))],a.fullWidth&&t.paperFullWidth,a.fullScreen&&t.paperFullScreen]}})((function(e){var t=e.theme,a=e.ownerState;return Object(r.a)({margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"}},"paper"===a.scroll&&{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},"body"===a.scroll&&{display:"inline-block",verticalAlign:"middle",textAlign:"left"},!a.maxWidth&&{maxWidth:"calc(100% - 64px)"},"xs"===a.maxWidth&&Object(n.a)({maxWidth:"px"===t.breakpoints.unit?Math.max(t.breakpoints.values.xs,444):"".concat(t.breakpoints.values.xs).concat(t.breakpoints.unit)},"&.".concat(O.a.paperScrollBody),Object(n.a)({},t.breakpoints.down(Math.max(t.breakpoints.values.xs,444)+64),{maxWidth:"calc(100% - 64px)"})),"xs"!==a.maxWidth&&Object(n.a)({maxWidth:"".concat(t.breakpoints.values[a.maxWidth]).concat(t.breakpoints.unit)},"&.".concat(O.a.paperScrollBody),Object(n.a)({},t.breakpoints.down(t.breakpoints.values[a.maxWidth]+64),{maxWidth:"calc(100% - 64px)"})),a.fullWidth&&{width:"calc(100% - 64px)"},a.fullScreen&&Object(n.a)({margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0},"&.".concat(O.a.paperScrollBody),{margin:0,maxWidth:"100%"}))})),w={enter:p.b.enteringScreen,exit:p.b.leavingScreen},M=i.forwardRef((function(e,t){var a=Object(m.a)({props:e,name:"MuiDialog"}),n=a["aria-describedby"],u=a["aria-labelledby"],p=a.BackdropComponent,f=a.BackdropProps,x=a.children,M=a.className,N=a.disableEscapeKeyDown,W=void 0!==N&&N,D=a.fullScreen,B=void 0!==D&&D,E=a.fullWidth,P=void 0!==E&&E,T=a.maxWidth,R=void 0===T?"sm":T,F=a.onBackdropClick,I=a.onClose,L=a.open,A=a.PaperComponent,z=void 0===A?j.a:A,K=a.PaperProps,H=void 0===K?{}:K,G=a.scroll,U=void 0===G?"paper":G,X=a.TransitionComponent,Y=void 0===X?b.a:X,J=a.transitionDuration,Z=void 0===J?w:J,q=a.TransitionProps,Q=Object(o.a)(a,v),V=Object(r.a)({},a,{disableEscapeKeyDown:W,fullScreen:B,fullWidth:P,maxWidth:R,scroll:U}),$=function(e){var t=e.classes,a=e.scroll,n=e.maxWidth,o=e.fullWidth,r=e.fullScreen,i={root:["root"],container:["container","scroll".concat(Object(d.a)(a))],paper:["paper","paperScroll".concat(Object(d.a)(a)),"paperWidth".concat(Object(d.a)(String(n))),o&&"paperFullWidth",r&&"paperFullScreen"]};return Object(l.a)(i,O.b,t)}(V),_=i.useRef(),ee=Object(s.a)(u),te=i.useMemo((function(){return{titleId:ee}}),[ee]);return Object(g.jsx)(S,Object(r.a)({className:Object(c.a)($.root,M),BackdropProps:Object(r.a)({transitionDuration:Z,as:p},f),closeAfterTransition:!0,BackdropComponent:C,disableEscapeKeyDown:W,onClose:I,open:L,ref:t,onClick:function(e){_.current&&(_.current=null,F&&F(e),I&&I(e,"backdropClick"))},ownerState:V},Q,{children:Object(g.jsx)(Y,Object(r.a)({appear:!0,in:L,timeout:Z,role:"presentation"},q,{children:Object(g.jsx)(k,{className:Object(c.a)($.container),onMouseDown:function(e){_.current=e.target===e.currentTarget},ownerState:V,children:Object(g.jsx)(y,Object(r.a)({as:z,elevation:24,role:"dialog","aria-describedby":n,"aria-labelledby":ee},H,{className:Object(c.a)($.paper,H.className),ownerState:V,children:Object(g.jsx)(h.a.Provider,{value:te,children:x})}))})}))}))}));t.a=M},418:function(e,t,a){"use strict";var n=a(1),o=a(4),r=a(0),i=(a(11),a(7)),c=a(89),l=a(91),s=a(8),d=a(12),u=a(68),b=a(90);function p(e){return Object(u.a)("MuiDialogTitle",e)}Object(b.a)("MuiDialogTitle",["root"]);var j=a(336),m=a(2),f=["className","id"],O=Object(s.a)(l.a,{name:"MuiDialogTitle",slot:"Root",overridesResolver:function(e,t){return t.root}})({padding:"16px 24px",flex:"0 0 auto"}),h=r.forwardRef((function(e,t){var a=Object(d.a)({props:e,name:"MuiDialogTitle"}),l=a.className,s=a.id,u=Object(o.a)(a,f),b=a,h=function(e){var t=e.classes;return Object(c.a)({root:["root"]},p,t)}(b),x=r.useContext(j.a).titleId,g=void 0===x?s:x;return Object(m.jsx)(O,Object(n.a)({component:"h2",className:Object(i.a)(h.root,l),ownerState:b,ref:t,variant:"h6",id:g},u))}));t.a=h},419:function(e,t,a){"use strict";var n=a(4),o=a(1),r=a(0),i=(a(11),a(7)),c=a(89),l=a(8),s=a(12),d=a(68),u=a(90);function b(e){return Object(d.a)("MuiDialogContent",e)}Object(u.a)("MuiDialogContent",["root","dividers"]);var p=a(2),j=["className","dividers"],m=Object(l.a)("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,a.dividers&&t.dividers]}})((function(e){var t=e.theme,a=e.ownerState;return Object(o.a)({flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px"},a.dividers?{padding:"16px 24px",borderTop:"1px solid ".concat(t.palette.divider),borderBottom:"1px solid ".concat(t.palette.divider)}:{".MuiDialogTitle-root + &":{paddingTop:0}})})),f=r.forwardRef((function(e,t){var a=Object(s.a)({props:e,name:"MuiDialogContent"}),r=a.className,l=a.dividers,d=void 0!==l&&l,u=Object(n.a)(a,j),f=Object(o.a)({},a,{dividers:d}),O=function(e){var t=e.classes,a={root:["root",e.dividers&&"dividers"]};return Object(c.a)(a,b,t)}(f);return Object(p.jsx)(m,Object(o.a)({className:Object(i.a)(O.root,r),ownerState:f,ref:t},u))}));t.a=f},456:function(e,t,a){"use strict";var n=a(3),o=a(0),r=a(444),i=a(250),c=a(260),l=a(116),s=a(2);t.a=Object(c.a)((function(e){return Object(i.a)(Object(n.a)({},l.s))}))((function(e){var t=e.classes,a=e.label,n=void 0===a?"":a,i=e.content,c=e.multiLine,l=void 0!==c&&c;return Object(s.jsx)(o.Fragment,{children:Object(s.jsxs)(r.a,{className:t.prefinedContainer,children:[""!==n&&Object(s.jsx)(r.a,{item:!0,xs:12,className:t.predefinedTitle,children:n}),Object(s.jsx)(r.a,{item:!0,xs:12,className:t.predefinedList,children:Object(s.jsx)(r.a,{item:!0,xs:12,className:l?t.innerContentMultiline:t.innerContent,children:i})})]})})}))},651:function(e,t,a){"use strict";var n=a(14),o=a(15),r=a(3),i=a(0),c=a.n(i),l=a(38),s=a(250),d=a(260),u=a(316),b=a(444),p=a(504),j=a(116),m=a(30),f=a(50),O=a(408),h=a(446),x=a(2),g=Object(l.b)(null,{setModalErrorSnackMessage:m.h});t.a=Object(d.a)((function(e){return Object(s.a)(Object(r.a)(Object(r.a)({noFound:{textAlign:"center",padding:"10px 0"},filterBox:{flex:1},searchField:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".9rem"},fieldLabel:{fontWeight:600,width:160,marginRight:10},tableBlock:Object(r.a)({},j.A.tableBlock)},j.a),j.v))}))(g((function(e){var t=e.classes,a=e.selectedPolicy,r=void 0===a?[]:a,l=e.setSelectedPolicy,s=e.setModalErrorSnackMessage,d=Object(i.useState)([]),j=Object(o.a)(d,2),m=j[0],g=j[1],v=Object(i.useState)(!1),C=Object(o.a)(v,2),S=C[0],k=C[1],y=Object(i.useState)(""),w=Object(o.a)(y,2),M=w[0],N=w[1],W=Object(i.useCallback)((function(){k(!0),f.a.invoke("GET","/api/v1/policies?limit=1000").then((function(e){var t=null===e.policies?[]:e.policies;k(!1),g(t.sort(p.a))})).catch((function(e){k(!1),s(e)}))}),[s]);Object(i.useEffect)((function(){k(!0)}),[]),Object(i.useEffect)((function(){S&&W()}),[S,W]);var D=m.filter((function(e){return e.name.includes(M)}));return Object(x.jsx)(c.a.Fragment,{children:Object(x.jsxs)(b.a,{item:!0,xs:12,children:[S&&Object(x.jsx)(u.a,{}),m.length>0?Object(x.jsxs)(c.a.Fragment,{children:[Object(x.jsxs)(b.a,{item:!0,xs:12,className:t.searchField,children:[Object(x.jsx)("span",{className:t.fieldLabel,children:"Assign Policies"}),Object(x.jsx)("div",{className:t.filterBox,children:Object(x.jsx)(h.a,{placeholder:"Filter by Policy",onChange:function(e){N(e)}})})]}),Object(x.jsx)(b.a,{item:!0,xs:12,className:t.tableBlock,children:Object(x.jsx)(O.a,{columns:[{label:"Policy",elementKey:"name"}],onSelect:function(e){var t=e.target,a=t.value,o=t.checked,i=Object(n.a)(r);o?i.push(a):i=i.filter((function(e){return e!==a})),i=i.filter((function(e){return""!==e})),l(i)},selectedItems:r,isLoading:S,records:D,entityName:"Policies",idField:"name",customPaperHeight:t.multiSelectTable})})]}):Object(x.jsx)("div",{className:t.noFound,children:"No Policies Available"})]})})})))},748:function(e,t,a){"use strict";a.r(t);var n=a(15),o=a(3),r=a(0),i=a(38),c=a(45),l=a.n(c),s=a(250),d=a(260),u=a(330),b=a(316),p=a(444),j=a(116),m=a(30),f=a(347),O=a(50),h=a(651),x=a(456),g=a(2),v={setModalErrorSnackMessage:m.h},C=Object(i.b)(null,v);t.default=Object(d.a)((function(e){return Object(s.a)(Object(o.a)(Object(o.a)(Object(o.a)({},j.p),j.z),{},{tableBlock:Object(o.a)(Object(o.a)({},j.A.tableBlock),{},{marginTop:15}),buttonContainer:{textAlign:"right",marginTop:".9rem"},predefinedTitle:{fontWeight:"normal"}}))}))(C((function(e){var t=e.classes,a=e.closeModalAndRefresh,o=e.selectedUser,i=e.selectedGroup,c=e.setModalErrorSnackMessage,s=e.open,d=Object(r.useState)(!1),j=Object(n.a)(d,2),m=j[0],v=j[1],C=Object(r.useState)([]),S=Object(n.a)(C,2),k=S[0],y=S[1],w=Object(r.useState)([]),M=Object(n.a)(w,2),N=M[0],W=M[1];Object(r.useEffect)((function(){if(s){if(null!==i)return void(i&&O.a.invoke("GET","/api/v1/group?name=".concat(encodeURI(i))).then((function(e){var t=l()(e,"policy","");y(t.split(",")),W(t.split(","))})).catch((function(e){c(e),v(!1)})));var e=l()(o,"policy",[]);y(e),W(e)}}),[s,i,o]);var D=l()(o,"accessKey","");return Object(g.jsxs)(f.a,{onClose:function(){a()},modalOpen:s,title:"Set Policies",children:[Object(g.jsx)(p.a,{item:!0,xs:12,children:Object(g.jsx)(x.a,{classes:t,label:"Selected ".concat(null!==i?"Group":"User"),content:null!==i?i:D})}),Object(g.jsx)(p.a,{item:!0,xs:12,children:Object(g.jsx)(x.a,{classes:t,label:"Current Policy",content:k.join(", ")})}),Object(g.jsx)("div",{className:t.tableBlock,children:Object(g.jsx)(h.a,{selectedPolicy:N,setSelectedPolicy:W})}),Object(g.jsxs)(p.a,{item:!0,xs:12,className:t.buttonContainer,children:[Object(g.jsx)(u.a,{type:"button",variant:"outlined",color:"primary",className:t.spacerRight,onClick:function(){W(k)},children:"Reset"}),Object(g.jsx)(u.a,{type:"button",variant:"contained",color:"primary",disabled:m,onClick:function(){var e="user",t=null;null!==i?(e="group",t=i):null!==o&&(t=o.accessKey),v(!0),O.a.invoke("PUT","/api/v1/set-policy",{name:N,entityName:t,entityType:e}).then((function(){v(!1),a()})).catch((function(e){v(!1),c(e)}))},children:"Save"})]}),m&&Object(g.jsx)(p.a,{item:!0,xs:12,children:Object(g.jsx)(b.a,{})})]})})))}}]);
//# sourceMappingURL=55.6e76a15b.chunk.js.map