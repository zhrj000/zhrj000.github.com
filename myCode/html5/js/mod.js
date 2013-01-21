var Mod=Mod||{};

/*
* ===========class-mod=================
*/

Mod=(function(ClassUtil){

	function hasClass(node,classname){
		if((" "+node.className+" ").replace(/[\n\t\r]/g," ").indexOf(" "+classname+" ")!==-1){
			return true;
		}else{
			return false;
		}
	}

	function getByClass(node,classname){
		if(node.getElementsByClassName){
			return node.getElementsByClassName(classname);
		}else{
			var result=[],
				elements=node.getElementsByTagName("*"),
				classnames=[],
				i,
				j;
			for(i=0;i<elements.length;i+=1){
				if(hasClass(elements[i],classname)){
					result[result.length]=elements[i];
				}
			}
		}
		return result;
	}

	function getNameType(name){
		name=name.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,'');
		//alert(name[0]);   //ie7以下不支持方括号访问字符串里的字符,改用charAt获取
		//alert(name.charAt(0));
		if(name.charAt(0)==="#"){
			return{
				type:0,
				name:name.slice(1)
			}
		}else if(name.charAt(0)==="."){
			return{
				type:1,
				name:name.slice(1)
			}
		}else{
			return{
				type:2,
				name:name
			}
		}
	}

	ClassUtil.$=function(){
		var node=null,
			name='',
			obj='';
		if(arguments.length===1){
			node=document;
			name=arguments[0];
		}else{
			node=arguments[0];
			name=arguments[1];
		}
		obj=getNameType(name);
		switch (obj.type){
			case 0:
				return document.getElementById(obj.name);
				break;
			case 1:
				return getByClass(node,obj.name);
				break;
			case 2:
				return node.getElementsByTagName(obj.name);
				break;
			default:
				return null;
		}
	};

	ClassUtil.hasClass=hasClass;

	ClassUtil.addClass=function(node,classname){
		if(!hasClass(node,classname)){
			node.className=(node.className+(" "+classname)).replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,'');
		}
	};

	ClassUtil.removeClass=function(node,classname){
		if(hasClass(node,classname)){
			node.className=(" "+node.className+" ").replace(/[\n\t\r]/g," ").replace(" "+classname+" "," ").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,'');
		}
	};

	return ClassUtil;
}(Mod));


/*
* ===========event-mod=================
*/

Mod=(function(EventUtil){

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
				if(target.nodeName.toLowerCase()===child||(child.charAt(0)==="."&&(" "+target.className+" ").replace(/[\n\t\r]/g," ").indexOf(" "+child.slice(1)+" ")!==-1)){
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
}(Mod));



/*
* ===========ajax-mod=================
*/


Mod=(function(AjaxUtil){

	var xhr=null,
		datas={
			url:"",
			type:"get",
			async:"true",
			dataType:"",
			data:null,
			jsonp:"",
			success:function(xhr){},
			error:function(xhr){}
		};

	function initData(datas,datap){
		datas.url = datap.url ? datap.url : datas.url;
		datas.type = datap.type ? datap.type : datas.type;
		datas.async = datap.async ? datap.async : datas.async;
		datas.dataType = datap.dataType ? datap.dataType : datas.dataType;
		datas.data = datap.data ? datap.data : datas.data;
		datas.jsonp = datap.jsonp ? datap.jsonp : datas.jsonp;
		datas.success = datap.success ? datap.success : datas.success;
		datas.error = datap.error ? datap.error : datas.error;
	}

	function createXHR(){
		if(window.ActiveXObject){
			return new ActiveXObject("Microsoft.XMLHTTP");
		}else if(window.XMLHttpRequest){
			return new XMLHttpRequest();
		}
	}
	
	function createUrl(){
		for(var key in datas.data){
			datas.url+=(datas.url.indexOf("?")===-1?"?":"&");
			datas.url+=createQueryStirng();
		}
	}

	function createQueryStirng(){
		var str='';
		for(var key in datas.data){
			str+="&"+encodeURIComponent(key)+"="+encodeURIComponent(datas.data[key]);
		}
		return str.slice(1);

	}
	function stagechangeHandler(){
		if(xhr.readyState==4){
			if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
				datas.success(xhr);
			}else{
				datas.error(xhr);
			}
		}
	}

	function dealGet(){
		xhr=createXHR();
		xhr.onreadystatechange=stagechangeHandler;
		createUrl();
		xhr.open(datas.type,datas.url,datas.async);
		xhr.send(null);
	}

	function dealPost(){
		xhr=createXHR();
		xhr.onreadystatechange=stagechangeHandler;
		xhr.open(datas.type,datas.url,datas.async);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(createQueryStirng());
	}

	AjaxUtil.loadAjax=function(datap){
		initData(datas,datap);
		switch (datas.type.toLowerCase()){
			case "get":
				dealGet();
				break;
			case "post":
				dealPost();
				break;
			default:
				return;
		}
	}

	return AjaxUtil;
}(Mod));


/*
* ===========cookie-mod=================
*/


Mod=(function(CookieUtil){

	CookieUtil.getCookie=function(name){
		var cookieName=encodeURIComponent(name)+"=",
			cookieStart=document.cookie.indexOf(cookieName),
			cookieValue=null;
		if(cookieStart>-1){
			var cookieEnd=document.cookie.indexOf(";",cookieStart);
			if(cookieEnd===-1){
				cookieEnd=document.cookie.length;
			}
			cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
		}
		return cookieValue;
	}
	CookieUtil.setCookie=function(name,value,days,path,domain,secure){
		var cookieText=encodeURIComponent(name)+"="+encodeURIComponent(value);
		if(days instanceof Number){
			var	now=new Date(),
				expires=new Date(Date.parse(now)+days*24*3600*1000);
			cookieText+=";expires="+expires.toGMTString();
		}
		if(path){
			cookieText+=";path="+path;
		}
		if(domain){
			cookieText+=";domain="+domain;
		}
		if(secure){
			cookieText+=";secure";
		}
		document.cookie=cookieText;
		//alert(cookieText);
	}
	CookieUtil.unsetCookie=function(name,path,domain,secure){
		this.set(name,"",new Date(0),path,domain,secure);
	}

	return CookieUtil;
}(Mod));