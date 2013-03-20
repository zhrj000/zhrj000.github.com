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
	

		popup_layer_box.style.top=top+"px";
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

var trigger=document.getElementById('btnPopup');
Popup.init('closePopupLayer','popupLayer','popupLayerBox');
trigger.onclick=Popup.popup;
