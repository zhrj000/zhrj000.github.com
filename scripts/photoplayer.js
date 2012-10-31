Mixiu.PhotoPlayer=(function(){
	var items=[],    //底下缩略图集合
		focus,       //当前在播放的img
		frame,       //移动框框
		max,         //总共多少张图片
		speed,       //切换速度
		timer,       //整个播放定时器
		curIndex,    //当前播放图片是第几张
		frameleft,   //移动框框frame的left值
		fade=null,   //图片淡入淡出定时器
		moveFrame;      //框框frame移动定时器

	/*设置当前图片的src*/
	function setFocusSrc(src){
		focus.src=src.replace("small","big");
	}

	/*切换到下一张图片*/
	function doMove(){
		// console.log("uuuu");
		var toIndex=curIndex+1;
		if(toIndex>=max){
			toIndex=0;
		}
		// console.log("toIndex:  "+toIndex);
		showMoving(toIndex);
	}

	/*播放当前图片*/
	function showMoving(index){
		//console.log("showMoving");
		var image=new Image();         /*先将即将播放的图片预加载*/
		image.onload=function(){
			//console.log("image.onload");
			if(timer!==null){
				clearTimeout(timer);     /*去掉播放定时器*/
			}
			if(moveFrame!==null){
				clearTimeout(moveFrame);     /*去掉框框移动定时器*/
			}
			var toleft=index*120;        /*当前要设置的frame的left*/
			//console.log("frameleft:"+frameleft+",toleft:"+toleft);
			if(frameleft<toleft){        /*如果当前比要移动的小*/
				moveFrame=setTimeout(function(){
					frameleft=parseInt(frame.style.left.replace("px","")||0);
					if(frameleft>=toleft){
						clearTimeout(moveFrame);
						fadeOut(items[index].src);
						timer=setTimeout(function(){
							doMove();
						},speed);
						curIndex=index;
					}else{
						var to=frameleft+4;
						if(to>toleft){
							to=toleft;
						}
						// console.log("frameleft:"+frameleft+",to:"+to);
						frame.style.left=to+"px";
						moveFrame=setTimeout(arguments.callee,10);
					}
				},10);
			}else{
				moveFrame=setTimeout(function(){
					frameleft=parseInt(frame.style.left.replace("px",""));
					if(frameleft<=toleft){
						clearTimeout(moveFrame);
						fadeOut(items[index].src);
						timer=setTimeout(function(){
							doMove();
						},speed);
						curIndex=index;
					}else{
						var to=frameleft-4;
						if(to<toleft){
							to=toleft;
						}
						frame.style.left=to+"px";
						moveFrame=setTimeout(arguments.callee,10);
					}
				},10);
			}
		}
		image.src=items[index].src.replace("small","big");
		// timer=setTimeout(arguments.callee,speed);
	}

	/*当前图片淡出*/
	function fadeOut(src){
		var opa=1;
		if(fade!==null){
			clearTimeout(fade);
		}
		focus.style.cssText="opacity:1;filter:alpha(opacity=100);";
		fade=setTimeout(function(){
			if(opa>0){
				focus.style.cssText="opacity:"+opa+";filter:alpha(opacity="+(opa*100)+");";
				opa-=0.4;
				fade=setTimeout(arguments.callee,40);
			}else{
				clearTimeout(fade);
				setFocusSrc(src);     /*图片淡出后，下一张图片淡入*/
				fadeIn();
			}
		},40);
	}
	/*图片淡入*/
	function fadeIn(){
		var opa=0;
		if(fade!==null){
			clearTimeout(fade);
		}
		focus.style.cssText="opacity:0;filter:alpha(opacity=0);";
		fade=setTimeout(function(){
			if(opa<=1){
				focus.style.cssText="opacity:"+opa+";filter:alpha(opacity="+(opa*100)+");";
				opa+=0.4;
				fade=setTimeout(arguments.callee,40);
			}else{
				clearTimeout(fade);
			}
		},40);
	}
	return{
		play:function(id,max_,speed_){
			var player=document.getElementById(id),
				images=player.getElementsByTagName("img");
			max=max_;
			speed=speed_*1000;
			curIndex=0;
			frameleft=0;
			frame=Mixiu.getElementsByClassName(player,"frame")[0];
			for(var i=0;i<images.length;i++){
				if(images[i].className.indexOf("focus")!==-1){
					focus=images[i];
				}else if(images[i].className.indexOf("item")!==-1){
					items[items.length]=images[i];
				}
			}
			setFocusSrc(items[0].src);

			/*给底下缩略图添加点击事件，利用事件委托*/
			Mixiu.EventUtil.addHandler(player,"click",function(event){
				event=Mixiu.EventUtil.getEvent(event);
				var target=Mixiu.EventUtil.getTarget(event);
				if(target.className==="item"){
					for(var i=0;i<items.length;i++){
						if(target===items[i]){
							showMoving(i);
						}
					}
				}
			});

			timer=setTimeout(function(){
				doMove();
			},speed);
		}		
	}
})();
Mixiu.PhotoPlayer.play("photoPlayer",4,4);