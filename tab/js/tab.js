/*
*  ---------without jquery
*/
var tabMod=(function(){
	var tab=null,            //整个tab组件
		trigger_item='ui-tab-trigger-item',         //触发器类名
		trigger_item_current='ui-tab-trigger-item-current',      //当前触发器类名
		cnt_item_current='ui-tab-cnt-item-current';              //当前tab面板

	function addHandler(element,type,handler){
		if(element.addEventListenr){
			element.addEventListenr(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	}

	function getElementsByClassName(node,classname){
		if(node.getElementsByClassName){
			return node.getElementsByClassName(classname);
		}else{
			var result=[],
				elements=node.getElementsByTagName("*"),
				classnames=[],
				i,
				j;
			for(i=0;i<elements.length;i++){
				classnames=elements[i].className.split(' ');
				for(j=0;j<classnames.length;j++){
					if(classname===classnames[j]){
						result[result.length]=elements[i];
					}
				}
			}
		}
		return result;
	}

	function addTabEvent(){
		addHandler(tab,"click",function(event){
			//console.log("click");
			event=event||window.event;
			var target=event.target||event.srcElement;
			if((" "+target.className+" ").replace(" /[\n\t\r]/g"," ").indexOf(" "+trigger_item+" ")!=-1&&target.title){
				event.preventDefault();
				var triCur=getElementsByClassName(tab,trigger_item_current),
					cntCur=getElementsByClassName(tab,cnt_item_current),
					i=0,
					max=0;
				for(i=0,max=triCur.length;i<max;i+=1){
					triCur[i].className=triCur[i].className.replace(trigger_item_current," ");
					
				}
				for(i=0,max=cntCur.length;i<max;i+=1){
					cntCur[i].className=cntCur[i].className.replace(cnt_item_current,"");
				}
				target.className+=(" "+trigger_item_current);
				document.getElementById(target.title.replace("#","")).className+=(" "+cnt_item_current);
			}
		});
	}

	return{
		init:function(id){
			tab=document.getElementById(id);
			addTabEvent();
		}
	}
})();
//tabMod.init("tabs");


/*
* ---------with jquery---------
*/

var tabMod2=(function(){
	var tab=null,            //整个tab组件
		trigger_item='ui-tab-trigger-item',         //触发器类名
		trigger_item_current='ui-tab-trigger-item-current',      //当前触发器类名
		cnt_item_current='ui-tab-cnt-item-current';              //当前tab面板

	function tabEvent(event){
		var curTarget=$(event.target);
		if(curTarget.hasClass(trigger_item)){
			event.preventDefault();
			tab.find('.'+trigger_item_current).removeClass(trigger_item_current);
			tab.find('.'+cnt_item_current).removeClass(cnt_item_current);
			tab.find(curTarget.attr('title')).addClass(cnt_item_current);
			curTarget.addClass(trigger_item_current);
		}
	}

	return{
		init:function(id){
			tab=$('#'+id);
			tab.on("click",tabEvent);
		}
	}
})();

tabMod2.init('tabs');

