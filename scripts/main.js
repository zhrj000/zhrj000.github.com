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

Mixiu.Demo=(function(){
	var demo=document.getElementsByClassName("demo")[0],
		close=document.getElementsByClassName("close")[0],
		demoDiv=document.getElementsByClassName("demoDiv")[0];
	
	return{
		init:function(){
			demoDiv.style.width=Mixiu.StyleUtil.getViewport().vpWidth+"px";
			demoDiv.style.height=Mixiu.StyleUtil.getViewport().vpHeight+"px";

			Mixiu.EventUtil.addHandler(demo,"click",function(event){
				demoDiv.style.paddingTop=window.scrollY+"px";
				demoDiv.style.display="block";
			});
			Mixiu.EventUtil.addHandler(close,"click",function(event){
				demoDiv.style.display="none";
			});
		}
	}
})();
Mixiu.Demo.init();