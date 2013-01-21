var Mod=(function(AjaxUtil){

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
	// function dealJsonp(){
	// 	var script=document.createElement("script");
	// 	datas.url+="?callback="+datas.jsonp;
	// 	createUrl();
	// 	script.src=datas.url;


	// //	if (typeof (window.JSON) === 'undefined') { //沒有 JSON 時才讓 browser 下載 json2.js
	// //			alert("no");
 //    //         	var script2=document.createElement("script");
	// 			// script2.src="http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js";
 //    //         	document.body.insertBefore(script2,Mod.$("script")[0]);
 //       // 	}
 //     //  alert("le:"+Mod.$("script")[0].src);
 //    //   alert("type"+typeof (window.JSON));
	// 	document.body.insertBefore(script,document.body.firstChild);

	// 	// 		Mod.$("#test-text").innerHTML+="<br />typeof (window.JSON):"+typeof (window.JSON);
	// 	// Mod.$("#test-text").innerHTML+="<br />script.src:"+script.src;
        	

	// 	//alert(document.body.firstChild.src);
	// }

	AjaxUtil.loadAjax=function(datap){
		initData(datas,datap);
		// if(datas.dataType.toLowerCase()==="jsonp"){
		// 	dealJsonp();
		// 	return;
		// }
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
}(Mod||{}));

