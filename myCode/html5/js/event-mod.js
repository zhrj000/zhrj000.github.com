var Mod=(function(EventUtil){

	/*
	*  ===============
	*  _fixBlurOrFocus:修补事件委托时，blur or focus不冒泡
	*  ===============
	*/
	function fixBlurOrFocus(element,type,handler){
		type=type.toLowerCase();
		if(type==="blur"||type==="focus"){
			if(element.addEventListener){
				element.addEventListener(type,handler,true);
			}else if(element.attachEvent){
				if(type==="blur"){
					element.attachEvent("onfocusout",handler);
				}else{
					element.attachEvent("onfocusin",handler);
				}
			}else{
				element["on"+type]=handler;
			}
			return true;
		}
	}


	

	function addEventHandler(element,type,handler){
		if(fixBlurOrFocus(element,type,handler))return;
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	}

	/*
	*   事件绑定，3个参数普通绑定，4个参数委托
	*/
	EventUtil.addHandler=function(){
		if(arguments.length===3){
			addEventHandler(arguments[0],arguments[1],arguments[2]);
		}else if(arguments.length===4){
			var parent=arguments[0],
				child=arguments[1].replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,''),
				type=arguments[2],
				handler=arguments[3];
			addEventHandler(parent,type,function(event){
				var target=EventUtil.getTarget(event);
				if(target.nodeName.toLowerCase()===child||(child[0]==="."&&(" "+target.className+" ").replace(/[\n\t\r]/g," ").indexOf(" "+child.slice(1)+" ")!==-1)){
					handler(event);
				}
			});

		}
	}

	EventUtil.removeHandler=function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type]=null;
		}
	};
	EventUtil.getEvent=function(event){
		return event?event:window.event;
	};
	EventUtil.getTarget=function(event){
		event=EventUtil.getEvent(event);
		return event.target||event.srcElement;
	};
	EventUtil.preventDefault=function(event){
		event=EventUtil.getEvent(event);
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	};


	return EventUtil;
}(Mod||{}));




// //测试
// test('Mod.addHandler()', function() {
//   //列举各种可能的情况，注意使用 ! 保证表达式符合应该的逻辑
//   ok(Mod.addHandler(document.getElementById("qunit-tests"),"click",function(){}), 'click success');
//   //ok(!Mod.addHandler(), '"2"不是一个数字');
// })







	// //返回值布尔值，判断childNode是否是parentNode的子节点
	// function _contains(parentNode,childNode){
	// 	if(typeof parentNode.contains==="function"){
	// 		return parentNode.contains(childNode);
	// 	}else if(typeof parentNode.compareDocumentPosition==="function"){
	// 		return !!(parentNode.compareDocumentPosition(childNode)&16);
	// 	}else{
	// 		var node=childNode.parentNode;
	// 		do{
	// 			if(node===parentNode){
	// 				return true;
	// 			}else{
	// 				node=node.parentNode;
	// 			}
	// 		}while(node!==null);
	// 		return false;
	// 	}
	// }
	// /*
	// *  ===============
	// *  _fixedMouse:修补父容器有子容器时，那么鼠标在子容器间切换移动的时候都会触发原本是添加在父容器上的mouseout/mouseover事件
	// *  ===============
	// */
	// function _fixedMouse(element,type,handler){
	// 	event=EventUtil.getEvent(event);
	// 	var related,
	// 		type=event.type.toLowerCase();
	// 	if(type==="mouseover"||type==="mouseout"){
	// 		related=EventUtil.getRelatedTarget(event);
	// 	}else{
	// 		return true;
	// 	}
	// 	return related && related.prefix!='xul' && !contains(element,related) && related!==element;
	// }



