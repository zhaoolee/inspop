(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5557:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(507)}])},507:function(e,t,n){"use strict";n.r(t),n.d(t,{__N_SSG:function(){return F},default:function(){return _}});var c=n(5893),o=n(6486),l=n.n(o),r=n(7294),s=n(2887),a=n.n(s),i=n(269),u=n(1057),d=n(8553),x=n(1023),p=n(3619),h=n(5759),f=n(5071),g=n(8271),m=n(1265),v=n(2430),j=n(5819);function b(e,t){const n=(0,r.useRef)();(0,r.useEffect)((()=>{n.current=e}),[e]),(0,r.useEffect)((()=>{if(null!==t){let e=setInterval((function(){n.current()}),t);return()=>clearInterval(e)}}),[t])}const y=e=>{let{imageUrl:t,onColorExtracted:n}=e;const o=(0,r.useRef)(null),l=new i.Z;return(0,r.useEffect)((()=>{function e(){const e=l.getPalette(o.current);n(e)}return o.current.complete?e():o.current.addEventListener("load",e),()=>{o.current.removeEventListener("load",e)}}),[t,n]),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("img",{ref:o,src:t,style:{display:"none"},crossOrigin:"anonymous"}),(0,c.jsx)("div",{className:a().fullScreenImage,style:{backgroundImage:"url('".concat(t,"')")}})]})};var F=!0;function _(e){let{csvData:t,wallpapersInfoJson:n,env:o}=e;const[s,i]=(0,r.useState)(0),[F,_]=(0,r.useState)(1e3*s),[E,S]=(0,r.useState)(null),[w,I]=(0,r.useState)("/images/black.jpg"),[k,Z]=(0,r.useState)("rgba(0, 0, 0, 0.2)"),[C,N]=(0,r.useState)("rgba(255, 255, 255, 0.5)"),O=[0,5,10,20,30,60,300],P=["No Play","Every 5 seconds","Every 10 seconds","Every 20 seconds","Every half minute","Every 1 minute","Every 5 minutes"],T=t.length-1,[L,M]=(0,r.useState)(!1),z=(0,g.ZP)(f.Z)((e=>{let{theme:t}=e;return{color:t.status.main,"&.Mui-checked":{color:t.status.main}}}));(0,r.useEffect)((()=>{{let e=0,t=localStorage.getItem("intervalTime");console.log("==localIntervalTime==",t);let n=l().toNumber(t);e=l().isNumber(n)&&!l().isNaN(n)&&l().includes(O,n)?n:0,localStorage.setItem("intervalTime",e),i(e)}}),[]);const A=(0,m.Z)({status:{main:"".concat(C)}}),[R,D]=(0,r.useState)(null),[U,W]=(0,r.useState)(null),[X,G]=(0,r.useState)(l().random(0,T)),[J,Q]=(0,r.useState)(null);b((()=>{q(),_(1e3*s)}),s>0?1e3*s:null),b((()=>{_((e=>{const t=e-1e3;return t>0?t:0}))}),1e3);(0,r.useEffect)((()=>{_(1e3*s)}),[s]),(0,r.useEffect)((()=>{const e=t[X];W(e);const c=n[e.wallpapers_dir];if(c.length>=1){const e=c.length-1;D(e),Q(l().random(0,e))}}),[X]);(0,r.useEffect)((()=>{if(null!==J){const e=n[U.wallpapers_dir][J];I("".concat("dev"===o?"/wallpapers/":"https://inspop.fangyuanxiaozhan.com/wallpapers/")+U.wallpapers_dir+"/"+e)}}),[U,J]);const q=()=>{G(X+1<=T?X+1:0),_(1e3*s)};return(0,r.useEffect)((()=>{if(E){const e=9,t="rgba(".concat(E[e][0],", ").concat(E[e][1],", ").concat(E[e][2],", 0.5)");Z(t);const n=0,c="rgba(".concat(E[n][0],", ").concat(E[n][1],", ").concat(E[n][2],", 0.8)");N(c)}}),[E]),(0,c.jsxs)("div",{className:a().main,children:[(0,c.jsx)(y,{imageUrl:w,onColorExtracted:S}),(0,c.jsx)("div",{style:{position:"fixed",right:"10px",bottom:"10px",zIndex:50},children:(0,c.jsx)(v.Z,{theme:A,children:(0,c.jsx)(z,{checked:L,onChange:()=>{M(!L)}},C)})}),L&&(0,c.jsxs)("div",{style:{position:"fixed",width:"100vw",bottom:"10px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[(0,c.jsxs)(d.Z,{variant:"outlined",children:[(0,c.jsx)(u.Z,{style:{color:"#FFFFFF",border:"2px solid ".concat(k),backgroundColor:"".concat(k)},startIcon:(0,c.jsx)(x.Z,{}),onClick:()=>{null!==J&&Q(J-1>=0?J-1:R),_(1e3*s)},children:"WallPaper"}),(0,c.jsx)(u.Z,{style:{color:"#FFFFFF",border:"2px solid ".concat(k),backgroundColor:"".concat(k)},endIcon:(0,c.jsx)(p.Z,{}),onClick:()=>{null!==J&&Q(J+1<=R?J+1:0),_(1e3*s)},children:"WallPaper"})]}),(0,c.jsx)("div",{style:{height:"10px"}}),(0,c.jsxs)(d.Z,{variant:"outlined",children:[(0,c.jsx)(u.Z,{style:{color:"#FFFFFF",border:"2px solid ".concat(k),backgroundColor:"".concat(k)},startIcon:(0,c.jsx)(x.Z,{}),onClick:()=>{G(X-1>=0?X-1:T),_(1e3*s)},children:"Line"}),(0,c.jsx)(u.Z,{style:{color:"#FFFFFF",border:"2px solid ".concat(k),backgroundColor:"".concat(k)},endIcon:(0,c.jsx)(p.Z,{}),onClick:q,children:"Line"})]}),(0,c.jsx)("div",{style:{height:"10px"}}),(0,c.jsx)(h.Z,{sx:{boxShadow:"none","&.Mui-focused .MuiOutlinedInput-notchedOutline":{border:0},".MuiOutlinedInput-notchedOutline":{border:0},color:"#FFFFFF",backgroundColor:"".concat(k)},type:"number",value:s,onChange:e=>{const t=parseInt(e.target.value);localStorage.setItem("intervalTime",t),t>=0&&(i(t),_(1e3*t))},label:"Auto Play",children:O.map(((e,t)=>(0,c.jsx)(j.Z,{value:e,children:P[t]},e)))}),(0,c.jsx)("div",{style:{height:"10px"}}),s>0&&(0,c.jsxs)("p",{style:{color:"rgba(255, 255, 255, 0.8)",textShadow:"2px 2px 4px ".concat(C)},children:["Switch after ",F/1e3," ",F>1e3?"seconds":"second"]})]}),U&&(0,c.jsx)("div",{className:a().item,children:(0,c.jsxs)("div",{id:C+k,style:{width:"90%",padding:"10px",backdropFilter:"blur(2px)",borderRadius:"10px",backgroundColor:"rgba(0, 0, 0, 0.5)",color:"rgba(255, 255, 255, 0.8)",border:"2px solid ".concat(k),textShadow:"2px 2px 4px ".concat(C)},children:[(0,c.jsxs)("div",{style:{textAlign:"left"},children:[(0,c.jsx)("p",{children:U.en_content}),(0,c.jsx)("p",{children:U.cn_content})]}),(0,c.jsx)("div",{style:{height:"16px"}}),(0,c.jsxs)("div",{style:{textAlign:"right"},children:[(0,c.jsx)("p",{children:U.en_source}),(0,c.jsx)("p",{children:U.cn_source})]})]})})]})}},2887:function(e){e.exports={fullScreenImage:"styles_fullScreenImage__u4Quw",item:"styles_item__uZrOz"}}},function(e){e.O(0,[662,78,774,888,179],(function(){return t=5557,e(e.s=t);var t}));var t=e.O();_N_E=t}]);