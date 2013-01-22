var page=(function(){

	var nav=$("#nav_f"),
		trigger_active="nav-item-active",   //触发器触发时类名
		trigger_name="nav-item",			//触发器类名
		trigger_cur=null,					//当前触发器
		trigger_board_cur=$("#box_1"),				//当前触发器所触发面板
		scrollTimer,
		boards=[],
		triggers=[],
		lastScrollTop=0;


	function dealScroll (){
		var elementTop=getElementTop(trigger_board_cur),
			scrollTop=$(document).scrollTop(),
			windowHeight=$(window).height(),
			elementHeight=trigger_board_cur.height();				
			if(trigger_board_cur.attr("id")==="box_1"){
				$("html,body").animate({scrollTop:0},800,"swing");
				
			}else{
				if(Math.abs((elementTop-scrollTop)/980)>1){
				
					$("html,body").animate({scrollTop:elementTop+(elementHeight-windowHeight)/2-980*Math.abs(elementTop-scrollTop)/(elementTop-scrollTop)},400,"linear");
					$("html,body").animate({scrollTop:elementTop+(elementHeight-windowHeight)/2},800,"linear");
				}else{

					$("html,body").animate({scrollTop:elementTop+(elementHeight-windowHeight)/2},800,"swing");
				}
				
			}					
	}

	function initBoards(){
		$("."+trigger_name).each(function(){
			boards[boards.length]=$($(this).attr("href"));	
			triggers[triggers.length]=$(this);		
		});
	}
	function getElementTop(element){
		switch(element.attr("id")){
			case "box_1":
				return 0;
				break;
			case "box_2":
				return 980;
				break;
			case "box_3":
				return 1960;
				break;
			case "box_4":
				return 2940;
				break;
			case "box_5":
				return 3920;
				break;
		}
	}
	function initPanelPosition(){
		$("#p1").css({top:-220});
		$("#p2").css({top:950});
		$("#p3").css({top:-220});
		$("#p4").css({top:-220});
		$("#p5").css({top:-220});
		$("#p6").css({top:950});
		$("#p7").css({top:950});
		$("#p8").css({top:950});
		$("#p9").css({top:-470});
		$("#p10").css({top:950});
		$("#p11").css({top:-300});
		$("#p12").css({top:950});
	}
	




	function windowScale(element,num1,num2){
		var elementTop=getElementTop(element),
			scrollTop=$(document).scrollTop(),
			windowHeight=$(window).height(),
			elementHeight=element.height();
		if((((scrollTop+windowHeight)-elementTop)>(windowHeight*num1))&&elementTop>scrollTop&&(((scrollTop+windowHeight)-elementTop)<=(windowHeight*num2))){
			//console.log("1111");
			return true;
		}	
	}


	function getMove (father,ele_start,ele_end,win_start,win_end) {
		
		// var scrollTop=$(document).scrollTop();
		
		// return ele_distance/(win_distance*0.8)*(scrollTop-lastScrollTop);


		var scrollTop=$(document).scrollTop(),
			windowHeight=$(window).height(),
			elementTop=getElementTop(father),
			move=(scrollTop+(1-win_start)*windowHeight-elementTop)/((win_end-win_start)*windowHeight*0.8)*(ele_end-ele_start);
		//console.log(move);
		return move;
	}
	function moveToo(eventType,father,element,ele_start,ele_end,win_start,win_end){
		
		if(!!windowScale(father,win_start,win_end)){			
			var top_cur=parseInt(element.css("top").replace("px","")),
				move=getMove(father,ele_start,ele_end,win_start,win_end),
				top_new=ele_start+move;
			if(Math.abs(move)>1){
			if(ele_start<ele_end){
				if(top_new>ele_end){
					top_new=ele_end;
					element.css("top",top_new);
				}else if(top_new<ele_start){
					top_new=ele_start;
					element.css("top",top_new);
				}else{
					element.css("top",top_new);
				}
			}else{
				if(top_new<ele_end){
					top_new=ele_end;
					element.css("top",top_new);
				}else if(top_new>ele_start){
					top_new=ele_start;
					element.css("top",top_new);
				}else{
					element.css("top",top_new);
				}
			}


			// if(top_new<ele_end&&top_new>ele_start){
			// 	element.css("top",top_new);
			// }
			
		}

}

		//fix 误差
		if(!!windowScale(father,0,0.1)){
			switch(father.attr("id")){
				case "box_2":
				$("#p1").css({top:-220});
				$("#p2").css({top:750});
				break;
			case "box_3":
				$("#p3").css({top:-220});
				$("#p4").css({top:-220});
				$("#p5").css({top:-220});
				$("#p6").css({top:850});
				$("#p7").css({top:850});
				$("#p8").css({top:850});
				break;
			case "box_4":
				$("#p9").css({top:-200});
				$("#p10").css({top:750});
				break;
			case "box_5":
				$("#p11").css({top:-380});
				$("#p12").css({top:850});
				break;
			default:
			
				break;
			}
		}


		//fix 误差
		if(!!windowScale(father,0.9,1)){
			switch(father.attr("id")){
				case "box_2":
				$("#p1").css({top:252});
				$("#p2").css({top:550});
				$("#p11").css({top:270});
				$("#p12").css({top:506});
				break;
			case "box_3":
				$("#p1").css({top:252});
				$("#p2").css({top:550});
				$("#p3").css({top:228});
				$("#p4").css({top:228});
				$("#p5").css({top:228});
				$("#p6").css({top:501});
				$("#p7").css({top:501});
				$("#p8").css({top:501});
				break;
			case "box_4":
				$("#p3").css({top:228});
				$("#p4").css({top:228});
				$("#p5").css({top:228});
				$("#p6").css({top:501});
				$("#p7").css({top:501});
				$("#p8").css({top:501});
				$("#p9").css({top:259});
				$("#p10").css({top:259});
				
				break;
			case "box_5":
				$("#p9").css({top:259});
				$("#p10").css({top:259});
				$("#p11").css({top:270});
				$("#p12").css({top:506});
				
				break;
			default:
			
				break;
			}
		}
	}
	function initAnimatePath(board,eventType){

		switch(board.attr("id")){
			case "box_2":
				moveToo(eventType,$("#box_2"),$("#p1"),-220,252,0.2,0.8);
				moveToo(eventType,$("#box_2"),$("#p2"),750,550,0.7,1);
				break;
			case "box_3":
				moveToo(eventType,$("#box_3"),$("#p3"),-220,228,0.2,0.8);
				moveToo(eventType,$("#box_3"),$("#p4"),-220,228,0.2,0.8);
				moveToo(eventType,$("#box_3"),$("#p5"),-220,228,0.2,0.8);
				moveToo(eventType,$("#box_3"),$("#p6"),650,501,0.7,1);
				moveToo(eventType,$("#box_3"),$("#p7"),650,501,0.7,1);
				moveToo(eventType,$("#box_3"),$("#p8"),650,501,0.7,1);
				break;
			case "box_4":
				moveToo(eventType,$("#box_4"),$("#p9"),-200,259,0.2,0.8);
				moveToo(eventType,$("#box_4"),$("#p10"),750,259,0.6,1);
				break;
			case "box_5":
				moveToo(eventType,$("#box_5"),$("#p11"),-380,270,0.2,0.8);
				moveToo(eventType,$("#box_5"),$("#p12"),750,506,0.6,1);
				break;
			default:
			
				break;
		}
	}
	function scrollHanlder(event){

		for(var i=0,max=boards.length;i<max;i+=1){


			var elementTop=getElementTop(boards[i]),
			scrollTop=$(document).scrollTop(),
			windowHeight=$(window).height(),
			elementHeight=boards[i].height();

			initAnimatePath(boards[i],event.type);








			//element的可视高度超过窗口可视高度的一半是，为当前
			if((((elementTop+elementHeight)-scrollTop)>(windowHeight/2)&&((elementTop+elementHeight)-scrollTop)<elementHeight)||(((scrollTop+windowHeight)-elementTop)>(windowHeight/2))&&elementTop>scrollTop){
				trigger_cur=triggers[i];
				trigger_board_cur=boards[i];
				$("."+trigger_name).each(function(){
					$(this).removeClass(trigger_active);
				});
				trigger_cur.addClass(trigger_active);	
				
					
			}
		}	

		//修补ie6下的一个bug
		if(($(window).height()+$(document).scrollTop())>4900){
			$("body").css("overflow","hidden");
		}


		lastScrollTop=$(document).scrollTop();

	}









	
	
	

	






	//click事件handler
	function clickHandler(event){

		event.preventDefault();
		trigger_cur=$(this);
		trigger_board_cur=$(trigger_cur.attr("href"));
		$("."+trigger_name).each(function(){
			$(this).removeClass(trigger_active);
		});
		trigger_cur.addClass(trigger_active);
		dealScroll ();
		
	}



   //resize	事件handler
	function initNavPosition(){

		var windowHeight=$(window).height(),
			windowWidth=$(window).width(),
			scrollTop=$(document).scrollTop(),
			navHeight=parseInt(nav.css("height").replace("px","")),
			right,
			bottom;
		if(windowWidth>1400){
			right=210;
		}else{
			right=10;
		}

		
		if(windowWidth<1100){
			
			$("#box_1").css("overflow","hidden");
		}else{
			
			$("#box_1").css("overflow","visible");
		}
		if(windowWidth<1320){
			$("#tag_1").hide();
		}else{
			$("#tag_1").show();
		}
		bottom=(windowHeight-navHeight)/2;
		nav.css({right:right,bottom:bottom});


	}
	
	return{
		init:function(){
			
			initBoards();
			initPanelPosition();
			initNavPosition();
			nav.on("click","a",clickHandler);
			$(window).on("scroll",scrollHanlder);
			$(window).on("resize",initNavPosition);


			$(window).on("mousewheel",scrollHanlder);
			
			$(".nav-item")[0].click();
			
		}
	}
}());


window.onload = function() {
  page.init();
}

	
	






