var Mixiu=window.Mixiu||{};
Mixiu.EventUtil={
	addHandler:function(element,type,handdler){
		if(element.addEventListener){
			element.addEventListener(type,handdler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handdler);
		}else{
			element["on"+type]=handdler;
		}
	},
	removeHandler:function(element,type,handdler){
		if(element.removeEventListener){
			element.removeEventListener(type,handdler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handdler);
		}else{
			element["on"+type]=null;
		}
	},
	getEvent:function(event){
		return event?event:window.event;
	},
	getTarget:function(event){
		return event.target||event.srcElement;
	},
	preventDefault:function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	}
}
Mixiu.StyleUtil={
	//获取浏览器视口大小
	getViewport:function(){
		if(document.compatMode=="BackCompat"){
			return{
				vpWidth:document.body.clientWidth,
				vpHeight:document.body.clientHeight
			};
		}else{
			return{
				vpWidth:document.documentElement.clientWidth,
				vpHeight:document.documentElement.clientHeight
			};
		}
	},
	//获取文档大小
	getDocsize:function(){
		return{
			docWidth:Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth),
			docHeight:Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight)
		};
	},
	getCssValue:function(node,key){
		if(node.currentStyle){
			return node.currentStyle[key];/*for ie*/
		}else{
			return document.defaultView.getComputedStyle(node,null)[key]; /*others except ie*/
		}
	}
}
Mixiu.ClassUtil={
	getElementsByClassName:function(node,classname){
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
	},
	hasClass:function(node,classname){
		var classnames=node.className.split(' '),
			j;
		for(j=0;j<classnames.length;j++){
			if(classname===classnames[j]){
				return true;
			}
		}
		return false;
	},
	addClass:function(node,classname){
		var classnames=node.className.split(' '),
			j;
		for(j=0;j<classnames.length;j++){
			if(classname===classnames[j]){
				break;
			}
		}
		if(j===classnames.length){
			node.className+=(" "+classname);
		}
	},
	removeClass:function(node,classname){
		var classnames=node.className.split(' '),
			j;
		for(j=0;j<classnames.length;j++){
			if(classname===classnames[j]){
				if(0===j){
					node.className=node.className.toString().replace(classname,'');
				}else{
					node.className=node.className.toString().replace(' '+classname,'');
				}
				
			}
		}
	}
}

Mixiu.Demo=(function(){
	var demo=Mixiu.ClassUtil.getElementsByClassName(document,"demo")[0],
		close=Mixiu.ClassUtil.getElementsByClassName(document,"close")[0],
		demoDiv=Mixiu.ClassUtil.getElementsByClassName(document,"demoDiv")[0],
		demoDivInner=Mixiu.ClassUtil.getElementsByClassName(demoDiv,"demoDivInner")[0],
		minHeight;
	
	return{
		init:function(){
			Mixiu.EventUtil.addHandler(demo,"click",function(event){
				minHeight=(Mixiu.StyleUtil.getDocsize().docHeight-(window.scrollY||document.documentElement.scrollTop))+"px";
				demoDiv.style.paddingTop=(window.scrollY||document.documentElement.scrollTop)+"px";
				demoDiv.style.width=Mixiu.StyleUtil.getDocsize().docWidth+"px";
				demoDivInner.style.minHeight=minHeight;
				demoDivInner.style.height=minHeight;
				demoDiv.style.minHeight=minHeight;
				demoDiv.style.height=minHeight;
				demoDiv.style.display="block";
				
			});
			Mixiu.EventUtil.addHandler(close,"click",function(event){
				demoDiv.style.display="none";
			});
		}
	}
})();
Mixiu.Demo.init();