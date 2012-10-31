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
	}
}
Mixiu.getElementsByClassName=function(node,classname){
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
	return result;
	}
}
Mixiu.Demo=(function(){
	var demo=Mixiu.getElementsByClassName(document,"demo")[0],
		close=Mixiu.getElementsByClassName(document,"close")[0],
		demoDiv=Mixiu.getElementsByClassName(document,"demoDiv")[0];
	
	return{
		init:function(){
			Mixiu.EventUtil.addHandler(demo,"click",function(event){
				demoDiv.style.paddingTop=(window.scrollY||document.documentElement.scrollTop)+"px";
				demoDiv.style.width=Mixiu.StyleUtil.getDocsize().docWidth+"px";
				demoDiv.style.height=(Mixiu.StyleUtil.getDocsize().docHeight-(window.scrollY||document.documentElement.scrollTop))+"px";
				demoDiv.style.display="block";
			});
			Mixiu.EventUtil.addHandler(close,"click",function(event){
				demoDiv.style.display="none";
			});
		}
	}
})();
Mixiu.Demo.init();