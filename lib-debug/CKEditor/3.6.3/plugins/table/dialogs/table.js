(function(){function e(e){var t=0,n=0;for(var r=0,i,s=e.$.rows.length;r<s;r++){i=e.$.rows[r],t=0;for(var o=0,u,a=i.cells.length;o<a;o++)u=i.cells[o],t+=u.colSpan;t>n&&(n=t)}return n}function t(e){return function(){var t=this.getValue(),n=!!(CKEDITOR.dialog.validate.integer()(t)&&t>0);return n||(alert(e),this.select()),n}}function n(n,s){var o=function(e){return new CKEDITOR.dom.element(e,n.document)},u=n.plugins.dialogadvtab;return{title:n.lang.table.title,minWidth:310,minHeight:CKEDITOR.env.ie?310:280,onLoad:function(){var e=this,t=e.getContentElement("advanced","advStyles");t&&t.on("change",function(t){var n=this.getStyle("width",""),r=e.getContentElement("info","txtWidth");r&&r.setValue(n,!0);var i=this.getStyle("height",""),s=e.getContentElement("info","txtHeight");s&&s.setValue(i,!0)})},onShow:function(){var e=this,t=n.getSelection(),r=t.getRanges(),i=null,o=e.getContentElement("info","txtRows"),u=e.getContentElement("info","txtCols"),a=e.getContentElement("info","txtWidth"),f=e.getContentElement("info","txtHeight");if(s=="tableProperties"){if(i=t.getSelectedElement())i=i.getAscendant("table",!0);else if(r.length>0){CKEDITOR.env.webkit&&r[0].shrink(CKEDITOR.NODE_ELEMENT);var l=r[0].getCommonAncestor(!0);i=l.getAscendant("table",!0)}e._.selectedElement=i}i?(e.setupContent(i),o&&o.disable(),u&&u.disable()):(o&&o.enable(),u&&u.enable()),a&&a.onChange(),f&&f.onChange()},onOk:function(){var e=n.getSelection(),t=this._.selectedElement&&e.createBookmarks(),r=this._.selectedElement||o("table"),i=this,s={};this.commitContent(s,r);if(s.info){var u=s.info;if(!this._.selectedElement){var a=r.append(o("tbody")),f=parseInt(u.txtRows,10)||0,l=parseInt(u.txtCols,10)||0;for(var c=0;c<f;c++){var h=a.append(o("tr"));for(var p=0;p<l;p++){var d=h.append(o("td"));CKEDITOR.env.ie||d.append(o("br"))}}}var v=u.selHeaders;if(!r.$.tHead&&(v=="row"||v=="both")){var m=new CKEDITOR.dom.element(r.$.createTHead());a=r.getElementsByTag("tbody").getItem(0);var g=a.getElementsByTag("tr").getItem(0);for(c=0;c<g.getChildCount();c++){var y=g.getChild(c);y.type==CKEDITOR.NODE_ELEMENT&&!y.data("cke-bookmark")&&(y.renameNode("th"),y.setAttribute("scope","col"))}m.append(g.remove())}if(r.$.tHead!==null&&v!="row"&&v!="both"){m=new CKEDITOR.dom.element(r.$.tHead),a=r.getElementsByTag("tbody").getItem(0);var b=a.getFirst();while(m.getChildCount()>0){g=m.getFirst();for(c=0;c<g.getChildCount();c++){var w=g.getChild(c);w.type==CKEDITOR.NODE_ELEMENT&&(w.renameNode("td"),w.removeAttribute("scope"))}g.insertBefore(b)}m.remove()}if(!this.hasColumnHeaders&&(v=="col"||v=="both"))for(h=0;h<r.$.rows.length;h++)w=new CKEDITOR.dom.element(r.$.rows[h].cells[0]),w.renameNode("th"),w.setAttribute("scope","row");if(this.hasColumnHeaders&&v!="col"&&v!="both")for(c=0;c<r.$.rows.length;c++)h=new CKEDITOR.dom.element(r.$.rows[c]),h.getParent().getName()=="tbody"&&(w=new CKEDITOR.dom.element(h.$.cells[0]),w.renameNode("td"),w.removeAttribute("scope"));u.txtHeight?r.setStyle("height",u.txtHeight):r.removeStyle("height"),u.txtWidth?r.setStyle("width",u.txtWidth):r.removeStyle("width"),r.getAttribute("style")||r.removeAttribute("style")}if(!this._.selectedElement)n.insertElement(r),setTimeout(function(){var e=new CKEDITOR.dom.element(r.$.rows[0].cells[0]),t=new CKEDITOR.dom.range(n.document);t.moveToPosition(e,CKEDITOR.POSITION_AFTER_START),t.select(1)},0);else try{e.selectBookmarks(t)}catch(E){}},contents:[{id:"info",label:n.lang.table.title,elements:[{type:"hbox",widths:[null,null],styles:["vertical-align:top"],children:[{type:"vbox",padding:0,children:[{type:"text",id:"txtRows","default":3,label:n.lang.table.rows,required:!0,controlStyle:"width:5em",validate:t(n.lang.table.invalidRows),setup:function(e){this.setValue(e.$.rows.length)},commit:i},{type:"text",id:"txtCols","default":2,label:n.lang.table.columns,required:!0,controlStyle:"width:5em",validate:t(n.lang.table.invalidCols),setup:function(t){this.setValue(e(t))},commit:i},{type:"html",html:"&nbsp;"},{type:"select",id:"selHeaders","default":"",label:n.lang.table.headers,items:[[n.lang.table.headersNone,""],[n.lang.table.headersRow,"row"],[n.lang.table.headersColumn,"col"],[n.lang.table.headersBoth,"both"]],setup:function(e){var t=this.getDialog();t.hasColumnHeaders=!0;for(var n=0;n<e.$.rows.length;n++){var r=e.$.rows[n].cells[0];if(r&&r.nodeName.toLowerCase()!="th"){t.hasColumnHeaders=!1;break}}e.$.tHead!==null?this.setValue(t.hasColumnHeaders?"both":"row"):this.setValue(t.hasColumnHeaders?"col":"")},commit:i},{type:"text",id:"txtBorder","default":1,label:n.lang.table.border,controlStyle:"width:3em",validate:CKEDITOR.dialog.validate.number(n.lang.table.invalidBorder),setup:function(e){this.setValue(e.getAttribute("border")||"")},commit:function(e,t){this.getValue()?t.setAttribute("border",this.getValue()):t.removeAttribute("border")}},{id:"cmbAlign",type:"select","default":"",label:n.lang.common.align,items:[[n.lang.common.notSet,""],[n.lang.common.alignLeft,"left"],[n.lang.common.alignCenter,"center"],[n.lang.common.alignRight,"right"]],setup:function(e){this.setValue(e.getAttribute("align")||"")},commit:function(e,t){this.getValue()?t.setAttribute("align",this.getValue()):t.removeAttribute("align")}}]},{type:"vbox",padding:0,children:[{type:"hbox",widths:["5em"],children:[{type:"text",id:"txtWidth",controlStyle:"width:5em",label:n.lang.common.width,title:n.lang.common.cssLengthTooltip,"default":500,getValue:r,validate:CKEDITOR.dialog.validate.cssLength(n.lang.common.invalidCssLength.replace("%1",n.lang.common.width)),onChange:function(){var e=this.getDialog().getContentElement("advanced","advStyles");e&&e.updateStyle("width",this.getValue())},setup:function(e){var t=e.getStyle("width");t&&this.setValue(t)},commit:i}]},{type:"hbox",widths:["5em"],children:[{type:"text",id:"txtHeight",controlStyle:"width:5em",label:n.lang.common.height,title:n.lang.common.cssLengthTooltip,"default":"",getValue:r,validate:CKEDITOR.dialog.validate.cssLength(n.lang.common.invalidCssLength.replace("%1",n.lang.common.height)),onChange:function(){var e=this.getDialog().getContentElement("advanced","advStyles");e&&e.updateStyle("height",this.getValue())},setup:function(e){var t=e.getStyle("height");t&&this.setValue(t)},commit:i}]},{type:"html",html:"&nbsp;"},{type:"text",id:"txtCellSpace",controlStyle:"width:3em",label:n.lang.table.cellSpace,"default":1,validate:CKEDITOR.dialog.validate.number(n.lang.table.invalidCellSpacing),setup:function(e){this.setValue(e.getAttribute("cellSpacing")||"")},commit:function(e,t){this.getValue()?t.setAttribute("cellSpacing",this.getValue()):t.removeAttribute("cellSpacing")}},{type:"text",id:"txtCellPad",controlStyle:"width:3em",label:n.lang.table.cellPad,"default":1,validate:CKEDITOR.dialog.validate.number(n.lang.table.invalidCellPadding),setup:function(e){this.setValue(e.getAttribute("cellPadding")||"")},commit:function(e,t){this.getValue()?t.setAttribute("cellPadding",this.getValue()):t.removeAttribute("cellPadding")}}]}]},{type:"html",align:"right",html:""},{type:"vbox",padding:0,children:[{type:"text",id:"txtCaption",label:n.lang.table.caption,setup:function(e){var t=this;t.enable();var n=e.getElementsByTag("caption");if(n.count()>0){var r=n.getItem(0),i=r.getFirst(CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT));if(i&&!i.equals(r.getBogus())){t.disable(),t.setValue(r.getText());return}r=CKEDITOR.tools.trim(r.getText()),t.setValue(r)}},commit:function(e,t){if(!this.isEnabled())return;var r=this.getValue(),i=t.getElementsByTag("caption");if(r)i.count()>0?(i=i.getItem(0),i.setHtml("")):(i=new CKEDITOR.dom.element("caption",n.document),t.getChildCount()?i.insertBefore(t.getFirst()):i.appendTo(t)),i.append(new CKEDITOR.dom.text(r,n.document));else if(i.count()>0)for(var s=i.count()-1;s>=0;s--)i.getItem(s).remove()}},{type:"text",id:"txtSummary",label:n.lang.table.summary,setup:function(e){this.setValue(e.getAttribute("summary")||"")},commit:function(e,t){this.getValue()?t.setAttribute("summary",this.getValue()):t.removeAttribute("summary")}}]}]},u&&u.createAdvancedTab(n)]}}var r=CKEDITOR.tools.cssLength,i=function(e){var t=this.id;e.info||(e.info={}),e.info[t]=this.getValue()};CKEDITOR.dialog.add("table",function(e){return n(e,"table")}),CKEDITOR.dialog.add("tableProperties",function(e){return n(e,"tableProperties")})})();