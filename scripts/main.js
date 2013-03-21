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
/*去掉字符串首尾空格*/
function trim(text){
	text=text.replace(/^\s+/,"");
	for(var i=text.length-1;i>=0;i--){
		if(/\S/.test(text.charAt(i))){
			text=text.substring(0,i+1);
			break;
		}
	}
	return text;
}

// Mixiu.Demo=(function(){
// 	var demo=Mixiu.ClassUtil.getElementsByClassName(document,"demo")[0],
// 		close=Mixiu.ClassUtil.getElementsByClassName(document,"close")[0],
// 		demoDiv=Mixiu.ClassUtil.getElementsByClassName(document,"demoDiv")[0],
// 		demoDivInner=Mixiu.ClassUtil.getElementsByClassName(demoDiv,"demoDivInner")[0],
// 		minHeight;
	
// 	return{
// 		init:function(){
// 			Mixiu.EventUtil.addHandler(demo,"click",function(event){
// 				minHeight=(Mixiu.StyleUtil.getDocsize().docHeight-(window.scrollY||document.documentElement.scrollTop))+"px";
// 				demoDiv.style.paddingTop=(window.scrollY||document.documentElement.scrollTop)+"px";
// 				demoDiv.style.width=Mixiu.StyleUtil.getDocsize().docWidth+"px";
// 				demoDivInner.style.minHeight=minHeight;
// 				demoDivInner.style.height=minHeight;
// 				demoDiv.style.minHeight=minHeight;
// 				demoDiv.style.height=minHeight;
// 				demoDiv.style.display="block";
				
// 			});
// 			Mixiu.EventUtil.addHandler(close,"click",function(event){
// 				demoDiv.style.display="none";
// 			});
// 		}
// 	}
// })();
// Mixiu.EventUtil.addHandler(window,"load",function(){
// 	Mixiu.Demo.init();
// });

var Popup=(function(){

	var close_trigger,    //关闭弹出层触发器
		popup_layer,      //弹出层
		popup_layer_box;  //弹出层里的box






	//设置弹出层的高、宽度
	function initLayer(){

		//先初始化先，不然resize有问题
		popup_layer.style.width=0+"px";
		popup_layer.style.height=0+"px";
		var winWidth,
			winHeight;
		if (window.innerWidth){
			winWidth = window.innerWidth;
		}else if ((document.body) && (document.body.clientWidth)){
			winWidth = document.body.clientWidth;
		}
        //获取窗口高度
        if (window.innerHeight){
        	winHeight = window.innerHeight;
        }else if ((document.body) && (document.body.clientHeight)){
        	winHeight = document.body.clientHeight;
        }  
        //通过深入Document内部对body进行检测，获取窗口大小
        if (document.documentElement  && document.documentElement.clientHeight && document.documentElement.clientWidth){
            winHeight = document.documentElement.clientHeight;
            winWidth = document.documentElement.clientWidth;
        }
		popup_layer.style.width=winWidth+"px";
		popup_layer.style.height=winHeight+"px";


		var scrollTop=(document.documentElement.scrollTop>document.body.scrollTop)?document.documentElement.scrollTop:document.body.scrollTop;
		popup_layer.style.top=scrollTop+"px";

	}

 
	//设置弹出层里面box的位置
	function initLayerBox(){

		var layerHeight=parseInt(popup_layer.style.height),
			boxHeight=popup_layer_box.offsetHeight,
			layerWidth=parseInt(popup_layer.style.width),
			boxWidth=popup_layer_box.offsetWidth,

			top=(layerHeight-boxHeight)/2,
			left=(layerWidth-boxWidth)/2;
	
		popup_layer_box.style.height=popup_layer.style.height;
		popup_layer_box.style.top=0+"px";
		popup_layer_box.style.left=left+"px";
	}


	function closeLayerHandler(event){
		var e=event?event:window.event,
			target=e.target||e.srcElement;
		if(target.id===close_trigger.id||target.id===popup_layer.id){
			popup_layer.style.display='none';
			toggleBody('auto','');
		}		
	}

	function popupResizeHandler(){
		initLayer();
		initLayerBox();

	}

	function toggleBody(bo,ho){
		document.body.style.overflow=bo;
		document.getElementsByTagName('html')[0].style.overflow=ho;	//ie6下直接设置body的overflow时有问题,所以加多这一句
	}
	return{

		init:function(close_trigger_id,popup_layer_id,popup_layer_box_id){


			close_trigger=document.getElementById(close_trigger_id);
			popup_layer=document.getElementById(popup_layer_id);
			popup_layer_box=document.getElementById(popup_layer_box_id);

			window.onresize=popupResizeHandler;			
			close_trigger.onclick=closeLayerHandler;
			popup_layer.onclick=closeLayerHandler;
			
		},
		popup:function(){
			toggleBody('hidden','visible');
			popup_layer.style.display="block";
			initLayer();
			initLayerBox();
			
		}

	}


}());

var trigger=document.getElementById('todemo');
Popup.init('democlose','demodiv','demodivinner');
trigger.onclick=Popup.popup;