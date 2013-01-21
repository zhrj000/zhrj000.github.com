
// function createCORSRequest(method,url){
// 	var xhr=new XMLHttpRequest();
// 	if("withCredentials" in xhr){
// 		xhr.open(method,url,true);
// 	}else if(typeof XDomainRequest != "undefined"){
// 		xhr=new XDomainRequest();
// 		xhr.open(method,url);
// 	}else{
// 		xhr=null;
// 	}
// 	return xhr;
// }

// var request=createCORSRequest("get","https://api.weibo.com/2/friendships/friends.json");
// 	var appkey='2934159616';
// if(request){
// 	request.onload=function(){
// 		alert(request.responseText);
// 	}
// 	request.send("source="+appkey+"&uid=1750070171&screen_name='36氪'");
// }

// var weibo=(function(){
// 	var XHR=null,
// 		appkey='2934159616',
// 		url='https://api.weibo.com/2/friendships/friends.json';

// 	function createXHR(){
// 		if(window.ActiveXObject){
// 			// code for IE6, IE5
// 			return new ActiveXObject("Microsoft.XMLHTTP");
// 		}else if(window.XMLHttpRequest){
// 			// code for IE7+, Firefox, Chrome, Opera, Safari
// 			return new XMLHttpRequest();
// 		}
// 	}

// 	function startRequest(){
	
// 		XHR=createXHR();
// 		/*
// 		*  readyState属性的值由一个值变成另外一个值的时候都会触发一次readyStatechange事件
// 		*  readyState属性表示请求/响应过程的当前活动阶段；
// 		*  0：未初始化。尚未调用open()方法。
// 		*  1：启动。已经调用open()方法，但尚未调用send()方法。
// 		*  2：发送。已经调用send()方法，但尚未接收到响应。
// 		*  3：接收。已经接收部分响应数据。
// 		*  4：完成。已经接收全部响应数据，而且已经可以在客户端使用了。
// 		*/
// 		XHR.onreadystatechange=function(){
// 			if(XHR.readyState==4){
// 				if((XHR.status>=200&&XHR.status<300)||XHR.status==304){
// 					console.log("XHR.status="+XHR.status+";XHR.responseText="+XHR.responseText);
					
// 				}else{
// 					alert("XHR.status="+XHR.status+";request was unsuccessful:"+XHR.status);
// 				}
// 			}
// 		};

// 		/*
// 		* 调用open()方法并不会真正发送请求，而是启动一个请求以备发送
// 		* 3个参数：要发送的请求的类型，请求的URL，是否异步发送请求
// 		*/
// 		//可能得到的是缓存的结果。为了避免这种情况，请向 URL 添加一个唯一的 ID
// 		XHR.open("GET",url,true);

// 		/*
// 		*  send()方法发送特定的请求，参数作为请求主体发送的数据，如不需要设为null，请求被分配到服务器
// 		*/
// 		XHR.send("source="+appkey+"&uid=1750070171&screen_name='36氪'");
// 	}

// 	return{
// 		init:function(){
// 			startRequest();
// 		}
// 	}

// })();

/*
*    jsonp只能get不能post,所以type方法写定为get，不传参
*    jsonp不支持async:false(同步操作)
*/
var weibo=(function(){

	var _appkey='2934159616',
		_url='',
		_data='',
		_successHandler;

	function loadWeibo(){
		$.ajax({
			type: 'get',
			url:_url,
			dataType:'jsonp',
			data:_data,
			//jsonp:'fn-callback',
			//async:false,
			success:function(datas,status,xhr){
				//console.log(datas.data);
				_successHandler(datas,status,xhr);
			},
			error:function(){
				console.log('error');
			}

		});
	}



	return{		
		init:function(url,data,successHandler){
			_url=url;
			_data=data;
			_data.source=_appkey;
			_successHandler=successHandler;
			loadWeibo();
		}
	}
})();

weibo.init('https://api.weibo.com/2/friendships/friends/bilateral/ids.json', //第一个参数url
		   {uid:1841934207,count:2000},				   //第二个参数data
		   function(datas,status,xhr){                         //第三个参数successHandler
			    for(var i=0;i<datas.data.ids.length;i+=1){
			    	//console.log(datas.data.ids[i]);
			    	var data_n={},
			    		url='https://api.weibo.com/2/friendships/friends/bilateral/ids.json';
			    	data_n.uid=datas.data.ids[i];
			    	data_n.count=2000;
			    	weibo.init(url,data_n,ca)
			    }
			  //  console.log(datas.data.ids.length);
		   }
);





var app=(function(){
	var id_s=1943746003,
		fl=0,
		url='https://api.weibo.com/2/friendships/friends/bilateral/ids.json',
		data={count:2000};


	function successHandler(datas,status,xhr) {
		var id_all=datas.data.ids;
		for(var i=0,max=id_all.length;i<max;i+=1){
			if(id_all[i]===id_s){
				console.log("true");
			}else if(fl<2){
				fl+=1;
				loadId(id_all[i]);
			}
		}
	}
	function loadId(id){
		data.uid=id;
		weibo.init(url,data,successHandler);
	};

	return{
		init:function(){
			loadId(1841934207);
		}
	}
})();

app.init();



//1841934207
// var weibo=(function(){
// 	var appkey='2934159616';

// 	function loadWeibo(){
// 		$.ajax({
// 			url:'https://api.weibo.com/2/friendships/friends.json',
// 			type:'get',
// 			dataType:'jsonp',
// 			data:{
// 				source:appkey,
// 				//access_token:'2.00POZeACUZu4REc14dc25027TE9XkB',
// 				uid:1750070171,
// 				screen_name:'36氪'
// 			},

// 			success:function(datas,status,xhr){
// 				console.log(datas.data);
// 			}

// 		});
// 	}



// 	return{
		
// 		init:function(){
// 			loadWeibo();
// 		}
// 	}
// })();

//weibo.init();


