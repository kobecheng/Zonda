CKEDITOR.dialog.add("scaytcheck",function(e){function t(){return typeof document.forms["optionsbar_"+h]!="undefined"?document.forms["optionsbar_"+h].options:[]}function n(){return typeof document.forms["languagesbar_"+h]!="undefined"?document.forms["languagesbar_"+h].scayt_lang:[]}function r(e,t){if(!e)return;var n=e.length;if(n==undefined){e.checked=e.value==t.toString();return}for(var r=0;r<n;r++)e[r].checked=!1,e[r].value==t.toString()&&(e[r].checked=!0)}function i(e){c.getById("dic_message_"+h).setHtml('<span style="color:red;">'+e+"</span>")}function s(e){c.getById("dic_message_"+h).setHtml('<span style="color:blue;">'+e+"</span>")}function o(e){e=String(e);var t=e.split(",");for(var n=0,r=t.length;n<r;n+=1)c.getById(t[n]).$.style.display="inline"}function u(e){e=String(e);var t=e.split(",");for(var n=0,r=t.length;n<r;n+=1)c.getById(t[n]).$.style.display="none"}function a(e){c.getById("dic_name_"+h).$.value=e}var f=!0,l,c=CKEDITOR.document,h=e.name,p=CKEDITOR.plugins.scayt.getUiTabs(e),d,v=[],m=0,g=["dic_create_"+h+",dic_restore_"+h,"dic_rename_"+h+",dic_delete_"+h],y=["mixedCase","mixedWithDigits","allCaps","ignoreDomainNames"],b=e.lang.scayt,w=[{id:"options",label:b.optionsTab,elements:[{type:"html",id:"options",html:'<form name="optionsbar_'+h+'"><div class="inner_options">'+'	<div class="messagebox"></div>'+'	<div style="display:none;">'+'		<input type="checkbox" name="options"  id="allCaps_'+h+'" />'+'		<label for="allCaps" id="label_allCaps_'+h+'"></label>'+"	</div>"+'	<div style="display:none;">'+'		<input name="options" type="checkbox"  id="ignoreDomainNames_'+h+'" />'+'		<label for="ignoreDomainNames" id="label_ignoreDomainNames_'+h+'"></label>'+"	</div>"+'	<div style="display:none;">'+'	<input name="options" type="checkbox"  id="mixedCase_'+h+'" />'+'		<label for="mixedCase" id="label_mixedCase_'+h+'"></label>'+"	</div>"+'	<div style="display:none;">'+'		<input name="options" type="checkbox"  id="mixedWithDigits_'+h+'" />'+'		<label for="mixedWithDigits" id="label_mixedWithDigits_'+h+'"></label>'+"	</div>"+"</div></form>"}]},{id:"langs",label:b.languagesTab,elements:[{type:"html",id:"langs",html:'<form name="languagesbar_'+h+'"><div class="inner_langs">'+'	<div class="messagebox"></div>	'+'   <div style="float:left;width:45%;margin-left:5px;" id="scayt_lcol_'+h+'" ></div>'+'   <div style="float:left;width:45%;margin-left:15px;" id="scayt_rcol_'+h+'"></div>'+"</div></form>"}]},{id:"dictionaries",label:b.dictionariesTab,elements:[{type:"html",style:"",id:"dictionaries",html:'<form name="dictionarybar_'+h+'"><div class="inner_dictionary" style="text-align:left; white-space:normal; width:320px; overflow: hidden;">'+'	<div style="margin:5px auto; width:80%;white-space:normal; overflow:hidden;" id="dic_message_'+h+'"> </div>'+'	<div style="margin:5px auto; width:80%;white-space:normal;"> '+'       <span class="cke_dialog_ui_labeled_label" >Dictionary name</span><br>'+'		<span class="cke_dialog_ui_labeled_content" >'+'			<div class="cke_dialog_ui_input_text">'+'				<input id="dic_name_'+h+'" type="text" class="cke_dialog_ui_input_text"/>'+"		</div></span></div>"+'		<div style="margin:5px auto; width:80%;white-space:normal;">'+'			<a style="display:none;" class="cke_dialog_ui_button" href="javascript:void(0)" id="dic_create_'+h+'">'+"				</a>"+'			<a  style="display:none;" class="cke_dialog_ui_button" href="javascript:void(0)" id="dic_delete_'+h+'">'+"				</a>"+'			<a  style="display:none;" class="cke_dialog_ui_button" href="javascript:void(0)" id="dic_rename_'+h+'">'+"				</a>"+'			<a  style="display:none;" class="cke_dialog_ui_button" href="javascript:void(0)" id="dic_restore_'+h+'">'+"				</a>"+"		</div>"+'	<div style="margin:5px auto; width:95%;white-space:normal;" id="dic_info_'+h+'"></div>'+"</div></form>"}]},{id:"about",label:b.aboutTab,elements:[{type:"html",id:"about",style:"margin: 5px 5px;",html:'<div id="scayt_about_'+h+'"></div>'}]}],E={title:b.title,minWidth:360,minHeight:220,onShow:function(){var t=this;t.data=e.fire("scaytDialog",{}),t.options=t.data.scayt_control.option(),t.chosed_lang=t.sLang=t.data.scayt_control.sLang;if(!t.data||!t.data.scayt||!t.data.scayt_control){alert("Error loading application service"),t.hide();return}var n=0;f?t.data.scayt.getCaption(e.langCode||"en",function(e){if(n++>0)return;l=e,x.apply(t),T.apply(t),f=!1}):T.apply(t),t.selectPage(t.data.tab)},onOk:function(){var e=this.data.scayt_control;e.option(this.options);var t=this.chosed_lang;e.setLang(t),e.refresh()},onCancel:function(){var e=t();for(var i in e)e[i].checked=!1;r(n(),"")},contents:v},S=CKEDITOR.plugins.scayt.getScayt(e);for(d=0;d<p.length;d++)p[d]==1&&(v[v.length]=w[d]);p[2]==1&&(m=1);var x=function(){function e(e){var t=c.getById("dic_name_"+h).getValue();if(!t)return i(" Dictionary name should not be empty. "),!1;try{var n=e.data.getTarget().getParent(),r=/(dic_\w+)_[\w\d]+/.exec(n.getId())[1];A[r].apply(null,[n,t,g])}catch(s){i(" Dictionary error. ")}return!0}var t=this,n=t.data.scayt.getLangList(),r=["dic_create","dic_delete","dic_rename","dic_restore"],f=[],d=[],v=y,b;if(m){for(b=0;b<r.length;b++)f[b]=r[b]+"_"+h,c.getById(f[b]).setHtml('<span class="cke_dialog_ui_button">'+l["button_"+r[b]]+"</span>");c.getById("dic_info_"+h).setHtml(l.dic_info)}if(p[0]==1)for(b in v){var w="label_"+v[b],E=w+"_"+h,S=c.getById(E);if("undefined"!=typeof S&&"undefined"!=typeof l[w]&&"undefined"!=typeof t.options[v[b]]){S.setHtml(l[w]);var x=S.getParent();x.$.style.display="block"}}var T='<p><img src="'+window.scayt.getAboutInfo().logoURL+'" /></p>'+"<p>"+l.version+window.scayt.getAboutInfo().version.toString()+"</p>"+"<p>"+l.about_throwt_copy+"</p>";c.getById("scayt_about_"+h).setHtml(T);var N=function(e,n){var r=c.createElement("label");r.setAttribute("for","cke_option"+e),r.setHtml(n[e]),t.sLang==e&&(t.chosed_lang=e);var i=c.createElement("div"),s=CKEDITOR.dom.element.createFromHtml('<input id="cke_option'+e+'" type="radio" '+(t.sLang==e?'checked="checked"':"")+' value="'+e+'" name="scayt_lang" />');return s.on("click",function(){this.$.checked=!0,t.chosed_lang=e}),i.append(s),i.append(r),{lang:n[e],code:e,radio:i}};if(p[1]==1){for(b in n.rtl)d[d.length]=N(b,n.ltr);for(b in n.ltr)d[d.length]=N(b,n.ltr);d.sort(function(e,t){return t.lang>e.lang?-1:1});var C=c.getById("scayt_lcol_"+h),k=c.getById("scayt_rcol_"+h);for(b=0;b<d.length;b++){var L=b<d.length/2?C:k;L.append(d[b].radio)}}var A={};A.dic_create=function(e,t,n){var r=n[0]+","+n[1],a=l.err_dic_create,f=l.succ_dic_create;window.scayt.createUserDictionary(t,function(e){u(r),o(n[1]),f=f.replace("%s",e.dname),s(f)},function(e){a=a.replace("%s",e.dname),i(a+"( "+(e.message||"")+")")})},A.dic_rename=function(e,t){var n=l.err_dic_rename||"",r=l.succ_dic_rename||"";window.scayt.renameUserDictionary(t,function(e){r=r.replace("%s",e.dname),a(t),s(r)},function(e){n=n.replace("%s",e.dname),a(t),i(n+"( "+(e.message||"")+" )")})},A.dic_delete=function(e,t,n){var r=n[0]+","+n[1],f=l.err_dic_delete,c=l.succ_dic_delete;window.scayt.deleteUserDictionary(function(e){c=c.replace("%s",e.dname),u(r),o(n[0]),a(""),s(c)},function(e){f=f.replace("%s",e.dname),i(f)})},A.dic_restore=t.dic_restore||function(e,t,n){var r=n[0]+","+n[1],a=l.err_dic_restore,f=l.succ_dic_restore;window.scayt.restoreUserDictionary(t,function(e){f=f.replace("%s",e.dname),u(r),o(n[1]),s(f)},function(e){a=a.replace("%s",e.dname),i(a)})};var O=(g[0]+","+g[1]).split(","),M;for(b=0,M=O.length;b<M;b+=1){var _=c.getById(O[b]);_&&_.on("click",e,this)}},T=function(){var e=this;if(p[0]==1){var n=t();for(var i=0,a=n.length;i<a;i++){var l=n[i].id,d=c.getById(l);d&&(n[i].checked=!1,e.options[l.split("_")[0]]==1&&(n[i].checked=!0),f&&d.on("click",function(){e.options[this.getId().split("_")[0]]=this.$.checked?1:0}))}}if(p[1]==1){var v=c.getById("cke_option"+e.sLang);r(v.$,e.sLang)}m&&(window.scayt.getNameUserDictionary(function(e){var t=e.dname;u(g[0]+","+g[1]),t?(c.getById("dic_name_"+h).setValue(t),o(g[1])):o(g[0])},function(){c.getById("dic_name_"+h).setValue("")}),s(""))};return E});