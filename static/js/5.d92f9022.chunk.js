(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{220:function(e,t,a){"use strict";var n=a(27),o=a(4),r=a(194);function i(){var e=Object(n.a)(["\n                width: 100%;\n                min-height: 100vh;\n            "]);return i=function(){return e},e}var c=function(e){var t=e.children;return Object(o.jsx)(r.a,{container:!0,direction:"column",css:Object(o.css)(i())},t)};a.d(t,"a",function(){return c})},221:function(e,t,a){"use strict";var n=a(27),o=a(4),r=a(194),i=a(107),c=a(203);function l(){var e=Object(n.a)(["\n                    height: 100%;\n                    display: flex;\n                    align-items: center;\n                "]);return l=function(){return e},e}function s(){var e=Object(n.a)(["\n                height: var(--section-title-height);\n            "]);return s=function(){return e},e}var d=function(e){var t=e.title,a=e.children;return Object(o.jsx)(r.a,{item:!0,css:Object(o.css)(s())},Object(o.jsx)(i.a,{square:!0,css:Object(o.css)(l())},Object(o.jsx)(r.a,{container:!0,css:function(e){return{paddingLeft:e.spacing(4),paddingRight:e.spacing(4)}}},Object(o.jsx)(r.a,{item:!0,xs:!0},Object(o.jsx)(c.a,{variant:"h4",component:"div"},Object(o.jsx)("span",null,t))),a)))};a.d(t,"a",function(){return d})},222:function(e,t,a){"use strict";var n=a(3),o=a.n(n),r=a(1),i=a.n(r),c=a(0),l=a.n(c),s=(a(5),a(6)),d=a(7),p=a(31),u=a(114),b=a(15),m=l.a.forwardRef(function(e,t){var a=e.children,n=e.classes,r=e.className,c=e.color,d=void 0===c?"default":c,p=e.component,m=void 0===p?"button":p,h=e.disabled,j=void 0!==h&&h,x=e.disableFocusRipple,g=void 0!==x&&x,v=e.focusVisibleClassName,y=e.fullWidth,f=void 0!==y&&y,O=e.size,C=void 0===O?"medium":O,k=e.type,w=void 0===k?"button":k,S=e.variant,z=void 0===S?"text":S,R=o()(e,["children","classes","className","color","component","disabled","disableFocusRipple","focusVisibleClassName","fullWidth","size","type","variant"]),N="text"===z,V="outlined"===z,$="contained"===z,B="primary"===d,P="secondary"===d,T=Object(s.a)(n.root,r,N&&[n.text,B&&n.textPrimary,P&&n.textSecondary],V&&[n.outlined,B&&n.outlinedPrimary,P&&n.outlinedSecondary],$&&[n.contained,B&&n.containedPrimary,P&&n.containedSecondary],"medium"!==C&&n["size".concat(Object(b.a)(C))],j&&n.disabled,f&&n.fullWidth,"inherit"===d&&n.colorInherit);return l.a.createElement(u.a,i()({className:T,component:m,disabled:j,focusRipple:!g,focusVisibleClassName:Object(s.a)(n.focusVisible,v),ref:t,type:w},R),l.a.createElement("span",{className:n.label},a))});t.a=Object(d.a)(function(e){return{root:i()({lineHeight:1.75},e.typography.button,{boxSizing:"border-box",minWidth:64,padding:"6px 16px",borderRadius:e.shape.borderRadius,color:e.palette.text.primary,transition:e.transitions.create(["background-color","box-shadow","border"],{duration:e.transitions.duration.short}),"&:hover":{textDecoration:"none",backgroundColor:Object(p.c)(e.palette.text.primary,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"},"&$disabled":{backgroundColor:"transparent"}},"&$disabled":{color:e.palette.action.disabled}}),label:{width:"100%",display:"inherit",alignItems:"inherit",justifyContent:"inherit"},text:{padding:"6px 8px"},textPrimary:{color:e.palette.primary.main,"&:hover":{backgroundColor:Object(p.c)(e.palette.primary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},textSecondary:{color:e.palette.secondary.main,"&:hover":{backgroundColor:Object(p.c)(e.palette.secondary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},outlined:{padding:"5px 16px",border:"1px solid ".concat("light"===e.palette.type?"rgba(0, 0, 0, 0.23)":"rgba(255, 255, 255, 0.23)"),"&$disabled":{border:"1px solid ".concat(e.palette.action.disabled)}},outlinedPrimary:{color:e.palette.primary.main,border:"1px solid ".concat(Object(p.c)(e.palette.primary.main,.5)),"&:hover":{border:"1px solid ".concat(e.palette.primary.main),backgroundColor:Object(p.c)(e.palette.primary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},outlinedSecondary:{color:e.palette.secondary.main,border:"1px solid ".concat(Object(p.c)(e.palette.secondary.main,.5)),"&:hover":{border:"1px solid ".concat(e.palette.secondary.main),backgroundColor:Object(p.c)(e.palette.secondary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},"&$disabled":{border:"1px solid ".concat(e.palette.action.disabled)}},contained:{color:e.palette.getContrastText(e.palette.grey[300]),backgroundColor:e.palette.grey[300],boxShadow:e.shadows[2],"&$focusVisible":{boxShadow:e.shadows[6]},"&:active":{boxShadow:e.shadows[8]},"&$disabled":{color:e.palette.action.disabled,boxShadow:e.shadows[0],backgroundColor:e.palette.action.disabledBackground},"&:hover":{backgroundColor:e.palette.grey.A100,"@media (hover: none)":{backgroundColor:e.palette.grey[300]},"&$disabled":{backgroundColor:e.palette.action.disabledBackground}}},containedPrimary:{color:e.palette.primary.contrastText,backgroundColor:e.palette.primary.main,"&:hover":{backgroundColor:e.palette.primary.dark,"@media (hover: none)":{backgroundColor:e.palette.primary.main}}},containedSecondary:{color:e.palette.secondary.contrastText,backgroundColor:e.palette.secondary.main,"&:hover":{backgroundColor:e.palette.secondary.dark,"@media (hover: none)":{backgroundColor:e.palette.secondary.main}}},focusVisible:{},disabled:{},colorInherit:{color:"inherit",borderColor:"currentColor"},sizeSmall:{padding:"4px 8px",fontSize:e.typography.pxToRem(13)},sizeLarge:{padding:"8px 24px",fontSize:e.typography.pxToRem(15)},fullWidth:{width:"100%"}}},{name:"MuiButton"})(m)},223:function(e,t,a){"use strict";var n=a(0),o=a.n(n),r=a(30);t.a=Object(r.a)(o.a.createElement(o.a.Fragment,null,o.a.createElement("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}),o.a.createElement("path",{fill:"none",d:"M0 0h24v24H0z"})),"Add")},245:function(e,t,a){"use strict";a.r(t);var n=a(4),o=a(194),r=a(203),i=a(222),c=a(221),l=a(220),s=a(27);function d(){var e=Object(s.a)(["\n                display: flex;\n                flex-direction: column;\n                justify-content: center;\n                align-items: center;\n            "]);return d=function(){return e},e}var p=function(e){var t=e.children;return Object(n.jsx)(o.a,{item:!0,xs:!0,css:Object(n.css)(d())},t)},u=a(223),b=a(40),m=function(){return Object(n.jsx)(l.a,null,Object(n.jsx)(c.a,{title:"\u0421\u043f\u0438\u0441\u043e\u043a \u0448\u0430\u0431\u043b\u043e\u043d\u043e\u0432"}),Object(n.jsx)(p,null,Object(n.jsx)(o.a,{container:!0,justify:"center",alignContent:"center",direction:"column"},Object(n.jsx)(o.a,{item:!0,css:function(e){return{marginBottom:e.spacing(3)}}},Object(n.jsx)(r.a,{variant:"h4",component:"div",align:"center"},Object(n.jsx)("span",null,"\u0428\u0430\u0431\u043b\u043e\u043d\u043e\u0432 \u043d\u0435\u0442"))),Object(n.jsx)(o.a,{item:!0,css:function(e){return{marginBottom:e.spacing(3)}}},Object(n.jsx)(r.a,{variant:"subtitle1",component:"div",align:"center"},Object(n.jsx)("span",null,"\u0414\u043b\u044f \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f \u0448\u0430\u0431\u043b\u043e\u043d\u0430 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u043a\u043d\u043e\u043f\u043a\u0443")),Object(n.jsx)(r.a,{variant:"subtitle1",component:"div",align:"center"},Object(n.jsx)("span",null,"\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0448\u0430\u0431\u043b\u043e\u043d"))),Object(n.jsx)(o.a,{item:!0},Object(n.jsx)(o.a,{container:!0,justify:"center",alignContent:"center"},Object(n.jsx)(o.a,{item:!0},Object(n.jsx)(i.a,{component:b.a,to:"/templates/create","aria-label":"\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0448\u0430\u0431\u043b\u043e\u043d",variant:"contained",color:"primary"},Object(n.jsx)(u.a,{alignmentBaseline:"middle",css:function(e){return{marginRight:e.spacing()}}}),Object(n.jsx)("span",null,"\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0448\u0430\u0431\u043b\u043e\u043d"))))))))};a.d(t,"Templates",function(){return m})}}]);
//# sourceMappingURL=5.d92f9022.chunk.js.map