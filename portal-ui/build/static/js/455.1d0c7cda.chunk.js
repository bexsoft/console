"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[455],{80455:(e,t,n)=>{n.r(t),n.d(t,{default:()=>d});var s=n(72791),l=n(26181),r=n.n(l),i=n(9505),o=n(23508),u=n(29945),c=n(87995),a=n(44690),f=n(80184);const d=e=>{let{closeDeleteModalAndRefresh:t,deleteOpen:n,selectedBucket:l,bucketEvent:d}=e;const p=(0,a.TL)(),[v,x]=(0,i.Z)((()=>t(!0)),(e=>p((0,c.Ih)(e))));if(!l)return null;return(0,f.jsx)(o.Z,{title:"Delete Event",confirmText:"Delete",isOpen:n,titleIcon:(0,f.jsx)(u.NvT,{}),isLoading:v,onConfirm:()=>{if(null===d)return;const e=r()(d,"events",[]),t=r()(d,"prefix",""),n=r()(d,"suffix",""),s=e.reduce(((e,t)=>e.includes(t)?e:[...e,t]),[]);x("DELETE","/api/v1/buckets/".concat(l,"/events/").concat(d.arn),{events:s,prefix:t,suffix:n})},onClose:()=>t(!1),confirmationContent:(0,f.jsx)(s.Fragment,{children:"Are you sure you want to delete this event?"})})}}}]);
//# sourceMappingURL=455.1d0c7cda.chunk.js.map