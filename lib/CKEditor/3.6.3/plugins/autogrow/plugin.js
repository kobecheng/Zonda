(function(){function e(e){var t=e.getStyle("overflow-y"),n=e.getDocument(),r=CKEDITOR.dom.element.createFromHtml('<span style="margin:0;padding:0;border:0;clear:both;width:1px;height:1px;display:block;">'+(CKEDITOR.env.webkit?"&nbsp;":"")+"</span>",n);n[CKEDITOR.env.ie?"getBody":"getDocumentElement"]().append(r);var i=r.getDocumentPosition(n).y+r.$.offsetHeight;return r.remove(),e.setStyle("overflow-y",t),i}var t=function(t){if(!t.window)return;var n=t.document,r=new CKEDITOR.dom.element(n.getWindow().$.frameElement),i=n.getBody(),s=n.getDocumentElement(),o=t.window.getViewPaneSize().height,u=n.$.compatMode=="BackCompat"?i:s,a=e(u);a+=t.config.autoGrow_bottomSpace||0;var f=t.config.autoGrow_minHeight!=undefined?t.config.autoGrow_minHeight:200,l=t.config.autoGrow_maxHeight||Infinity;a=Math.max(a,f),a=Math.min(a,l),a!=o&&(a=t.fire("autoGrow",{currentHeight:o,newHeight:a}).newHeight,t.resize(t.container.getStyle("width"),a,!0)),u.$.scrollHeight>u.$.clientHeight&&a<l?u.setStyle("overflow-y","hidden"):u.removeStyle("overflow-y")};CKEDITOR.plugins.add("autogrow",{init:function(e){e.addCommand("autogrow",{exec:t,modes:{wysiwyg:1},readOnly:1,canUndo:!1,editorFocus:!1});var n={contentDom:1,key:1,selectionChange:1,insertElement:1,mode:1};e.config.autoGrow_onStartup&&(n.instanceReady=1);for(var r in n)e.on(r,function(n){var r=e.getCommand("maximize");n.editor.mode=="wysiwyg"&&(!r||r.state!=CKEDITOR.TRISTATE_ON)&&setTimeout(function(){t(n.editor),t(n.editor)},100)})}})})();