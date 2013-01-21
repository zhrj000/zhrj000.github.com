var page=(function(){

	var nav=$("#nav_f"),
		trigger_active="nav-item-active",   //触发器触发时类名
		trigger_name="nav-item",			//触发器类名
		trigger_cur=null,					//当前触发器
		trigger_board_cur=$("#box_1"),				//当前触发器所触发面板
		scrollTimer,
		boards=[],
		triggers=[];

	function getElementTop(element){
		// var actualTop=element.offset().top,
		// 	current=element.offsetParent();
		// while(!current.is("body")){
		// 	actualTop+=current.offset().top;
		// 	current=current.offsetParent();
		// }
		// return actualTop;

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

	function dealScroll (){
		var elementTop=getElementTop(trigger_board_cur),
			scrollTop=$(document).scrollTop(),
			windowHeight=$(window).height(),
			elementHeight=trigger_board_cur.height();


				
			if(trigger_board_cur.attr("id")==="box_1"){
				$("html,body").animate({scrollTop:0},800,"linear");
				
			}else{
				if(Math.abs((elementTop-scrollTop)/980)>1){
				
					$("html,body").animate({scrollTop:elementTop+(elementHeight-windowHeight)/2-980*Math.abs(elementTop-scrollTop)/(elementTop-scrollTop)},400,"linear");
					$("html,body").animate({scrollTop:elementTop+(elementHeight-windowHeight)/2},800,"linear");
				}else{

					$("html,body").animate({scrollTop:elementTop+(elementHeight-windowHeight)/2},800,"linear");
				}
				
			}
			
		
	}

	function initBoards(){
		$("."+trigger_name).each(function(){
			boards[boards.length]=$($(this).attr("href"));	
			boards[boards.length-1].isanimate=false;
			triggers[triggers.length]=$(this);		
		});
	}
	

	function getMove(element,distance){
		//initMarginTop();
		var elementTop=getElementTop(element),
			scrollTop=$(document).scrollTop(),
			windowHeight=$(window).height();
		return(((windowHeight-(elementTop-scrollTop))/windowHeight)*distance);
	}

	function panelGo(type,father,target,start,end){
		var dis=start+Math.ceil(getMove(father,(end-start)))+((Math.abs(end-start))/(end-start))*100;
		if(type==="top"){
			if(start<end){
				
				if(dis>=end){
					target.css("top",end);
					//target.css("opacity",1);
				}else{
					target.css("top",dis);
					//target.css("opacity",opacity);
				}
				
			}
			if(start>end){
				
				if(dis<=end){
					//console.log("dis:"+dis);
					target.css("top",end);//target.css("opacity",1);
				}else{
					//console.log("disdis:"+dis);
					target.css("top",dis);//target.css("opacity",opacity);
				}
			}
		}
		

	}

	
	function initPanelPosition(){
		$("#p1").css({top:-300});
		$("#p2").css({top:950});
		$("#p3").css({top:-1200});
		$("#p4").css({top:-1200});
		$("#p5").css({top:-1200});
		$("#p6").css({top:950});
		$("#p7").css({top:950});
		$("#p8").css({top:950});
		$("#p9").css({top:-1200});
		$("#p10").css({top:950});
		$("#p11").css({top:-1200});
		$("#p12").css({top:950});
	}
	function initAnimatePath(board){

		switch(board.attr("id")){
			case "box_2":
					
				panelGo("top",$("#box_2"),$("#p1"),-1200,252);
				panelGo("top",$("#box_2"),$("#p2"),1250,550);
			
				break;
			case "box_3":
				// $("#p1").css("top",-200);
				// $("#p1").css("top",1250);
				panelGo("top",$("#box_3"),$("#p3"),-1200,228);
				panelGo("top",$("#box_3"),$("#p4"),-1200,228);
				panelGo("top",$("#box_3"),$("#p5"),-1200,228);
				panelGo("top",$("#box_3"),$("#p6"),1250,502);
				panelGo("top",$("#box_3"),$("#p7"),1250,502);
				panelGo("top",$("#box_3"),$("#p8"),1250,502);
			
				
				break;
			case "box_4":
				panelGo("top",$("#box_4"),$("#p9"),-1200,259);
				panelGo("top",$("#box_4"),$("#p10"),950,259);
			
				break;
			case "box_5":
				panelGo("top",$("#box_5"),$("#p11"),-1200,270);
				panelGo("top",$("#box_5"),$("#p12"),950,506);
				break;
			default:
			
				break;
		}
	}







	function getMove2(element,distance){
		//initMarginTop();
		var elementTop=getElementTop(element),
			scrollTop=$(document).scrollTop(),
			windowHeight=$(window).height(),
			elementHeight=element.height();
	//	console.log((elementTop+elementHeight-scrollTop));

		return(((elementTop+elementHeight-scrollTop)/windowHeight)*distance);
	}

	function panelGo2(type,father,target,start,end){
		var dis=start+Math.ceil(getMove2(father,(end-start)))+((Math.abs(end-start))/(end-start))*100,
			curTop=parseInt(target.css("top").replace("px",""));
		if(type==="top"){
			if(start<end){
				if(dis>=curTop){
					
					if(dis>=end){
						target.css("top",end);
					}else{
					//	console.log("dis<end");
						target.css("top",dis);
					}
				}else{
					//console.log((getElementTop(father)+father.height()-$(document).scrollTop()));
					 if((getElementTop(father)+father.height()-$(document).scrollTop())<100&&(getElementTop(father)+father.height()-$(document).scrollTop())>0){
						
					 	target.css("top",-999);
					 }
				}
				
				
			}
			//&&dis<=curTop
			if(start>end){
				if(dis<=curTop){
					
					if(dis<=end){					
						target.css("top",end);
					}else{
						target.css("top",dis);
					}
				}else{
					if((getElementTop(father)+father.height()-$(document).scrollTop())<100&&(getElementTop(father)+father.height()-$(document).scrollTop())>0){
						
					 	target.css("top",999);
					 }
				
				}
				
			}
		}
		

	}


	function initAnimatePath2(board){

		switch(board.attr("id")){
			case "box_2":
					
				panelGo2("top",$("#box_2"),$("#p1"),-200,252);
				panelGo2("top",$("#box_2"),$("#p2"),1250,550);
			
				break;
			case "box_3":
				panelGo2("top",$("#box_3"),$("#p3"),-300,228);
				panelGo2("top",$("#box_3"),$("#p4"),-300,228);
				panelGo2("top",$("#box_3"),$("#p5"),-300,228);
				panelGo2("top",$("#box_3"),$("#p6"),1250,502);
				panelGo2("top",$("#box_3"),$("#p7"),1250,502);
				panelGo2("top",$("#box_3"),$("#p8"),1250,502);
			
				
				break;
			case "box_4":
				panelGo2("top",$("#box_4"),$("#p9"),-200,259);
				panelGo2("top",$("#box_4"),$("#p10"),950,259);
			
				break;
			case "box_5":
				panelGo2("top",$("#box_5"),$("#p11"),-200,270);
				panelGo2("top",$("#box_5"),$("#p12"),950,506);
				break;
			default:
			
				break;
		}
	}

	
	

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

	function scrollHandler(event){

		

		for(var i=0,max=boards.length;i<max;i+=1){

			var elementTop=getElementTop(boards[i]),
				scrollTop=$(document).scrollTop(),
				windowHeight=$(window).height(),
				elementHeight=boards[i].height();

			if(elementTop-scrollTop<=(windowHeight/2)&&elementTop-scrollTop>=0){								
				initAnimatePath(boards[i]);			
			}


			if((elementTop+elementHeight)-scrollTop<windowHeight&&(elementTop+elementHeight)-scrollTop>=0){
				//console.log(scrollTop);
				
				initAnimatePath2(boards[i]);			
			}

			
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


		if(($(window).height()+$(document).scrollTop())>4900){
			//alert("s");
			$("body").css("overflow","hidden");
		}

	}


	
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

		var top=nav.css("top").replace("px","");
		if(!isNaN(top)){
			//alert("s");
			
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
	//	alert(bottom);

	}
	
	return{
		init:function(){
			
			initBoards();
			initPanelPosition();
			initNavPosition();
			nav.on("click","a",clickHandler);
			$(window).on("scroll",scrollHandler);
			$(window).on("resize",initNavPosition);
			
			 $(".nav-item")[0].click();
		//	 alert($(window).height());

			
		}
	}
}());


window.onload = function() {
  page.init();
}

	
	






