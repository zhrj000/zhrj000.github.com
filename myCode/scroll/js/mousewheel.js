
// enclose(document.getElementById('content'),400,200,-200,-300);

function enclose(frame,content,bar,block,bdistance,cdistance,minutop){

	var isMacWebkit=(navigator.userAgent.indexOf('Macintosh')!==-1&&
					 navigator.userAgent.indexOf('WebKit')!==-1);
	var isFirefox=(navigator.userAgent.indexOf('Gecko')!==-1);

	var contentX=content.offsetLeft,
		contentY=content.offsetTop,
		framewidth=frame.offsetWidth,
		frameheight=frame.offsetHeight;

	frame.onwheel=wheelHandler;   //未来浏览器
	frame.onmousewheel=wheelHandler;	//大多数当前浏览器

	if(isFirefox){   //仅firefox
		frame.addEventListener('DOMMouseScroll',wheelHandler,false);
	}

	function wheelHandler(event){
		var e=event||window.event;

		var deltaX=e.deltaX*-30||
				  e.wheelDeltaX/4||
				  0;
		var deltaY=e.deltaY*-30||
			   e.wheelDeltaY/4||
    (e.wheelDeltaY===undefined&&
			   e.wheelDelta/4)||
		          e.detail*-10||
					          0;

		if(isMacWebkit){
			deltaX/=30;
			deltaY/=30;
		}

		if(isFirefox&&e.type!=='DOMMouseScroll'){
			frame.removeEventListener('DOMMouseScroll',wheelHandler,false);
		}

		var contentbox=content.getBoundingClientRect(),
			contentwidth=contentbox.right-contentbox.left,
			contentheight=contentbox.bottom-contentbox.top;

		if(e.altKey){
			if(deltaX){
				framewidth-=deltaX;
				framewidth=Math.min(framewidth,contentwidth);
				framewidth=Math.max(framewidth,50);
				frame.style.width=framewidth+'px';
			}
			if(deltaY){
				frameheight-=deltaY;
				frameheight=Math.min(frameheight,contentheight);
				frameheight=Math.max(frameheight,50);
				frame.style.height=frameheight+'px';
			}
		}else{
			if(deltaX){
				var minoffset=Math.min(framewidth-contentwidth,0);
				contentX=Math.max(contentX+deltaX,minoffset);
				contentX=Math.min(contentX,0);
				content.style.left=contentX+'px';
			}
			if(deltaY){
				var minoffset=Math.min(frameheight-contentheight,0);
				contentY=Math.max(contentY+deltaY,minoffset);
				contentY=Math.min(contentY,0);
				content.style.top=contentY+'px';
				block.style.top=(-contentY/cdistance*bdistance+minutop)+'px';
			}

		}

		if(e.preventDefault){
			e.preventDefault();
		}
		if(e.stopPropagation){
			e.stopPropagation();
		}
		e.cancelBubble=true;
		e.returnValue=false;
		return false;
	}
}