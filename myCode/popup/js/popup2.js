$(function(){




	//遮罩层
	function Overlay(id,opacity){

		this.opacity=opacity;	//遮罩层透明度
		this.layer=$('<div id="'+overlay+'"></div>');	//遮罩层

		var that=this;
		//遮罩层节点插入body并初始化样式
		this.layer.appendTo('body').css({			
			'display':'none',
			'position':'absolute',
			'backgroundColor':'#000000',
			'zIndex':'1000',
			'opacity':this.opacity
		});
		//注册点击遮罩层点击隐藏
		this.layer.on('click',function(){		
			that.hide();
		});
		//注册window resize事件遮罩层大小随窗口resize而变化
		$(window).on('resize',function(){		
			that.layer.css({
				'width':$(window).width(),
				'height':$(window).height()
			});
		});
	}
	Overlay.prototype={	
		//遮罩层弹出	
		show:function(){						
			$('body').css('overflow','hidden');
			$('html').css('overflow','visible');
			this.layer.css({
				'top':$(document).scrollTop(),
				'left':$(document).scrollLeft(),
				'width':$(window).width(),
				'height':$(window).height()
			});
			this.layer.fadeIn(500);
		},
		//遮罩层隐藏
		hide:function(){					
			
			this.layer.fadeOut(500,function(){
				$('body').css('overflow','auto');
				$('html').css('overflow','');
			});
			
		}
	}


	//弹出窗
	function Popupwin(win_id,close_id,overlay){
		this.win=$('#'+win_id);
		this.close=$('#'+close_id);
		this.overlay=overlay?overlay:null;
		this.canResize=false;

		var that=this;
		//注册关闭按钮的点击事件
		this.close.on('click',function(){		
			that.closeWin();
		});
		//如果有遮罩层层弹出层追加注册关闭事件点击关闭弹出窗
		this.overlay?this.overlay.layer.on('click',function(){		
			that.closeWin();
		}):null;
		//注册window resize事件弹出窗位置随窗口resize而变化
		$(window).on('resize',function(){	
			if(that.canResize){
				that.win.stop(true,false).animate({
				'top':($(window).height()-that.win.height())/2+$(document).scrollTop(),
				'left':($(window).width()-that.win.width())/2+$(document).scrollLeft()
				},400,'linear');
			}							
		});
	}
	Popupwin.prototype={
		//关闭弹出窗
		closeWin:function(){		
			this.win.slideUp(300);
			this.overlay?this.overlay.hide():null;
			this.canResize=false;
		},
		//弹出弹出窗
		openWin:function(){		
			var that=this;	
			this.win.css({				//初始化位置在中间
				'top':($(window).height()-this.win.height())/2+$(document).scrollTop(),
				'left':($(window).width()-this.win.width())/2+$(document).scrollLeft(),
				'zIndex':'2000'
			});
			//this.win.show();
			this.win.slideDown(300,function(){
				that.canResize=true;
			});
			this.overlay?this.overlay.show():null;
		}
	}


	//滚动条
	function Scroll(panel_id,contents_id,bar_id,moveblock_id,upblock_id,downblock_id){
		this.panel=$('#'+panel_id);
		this.contents=$('#'+contents_id);
		this.bar=$('#'+bar_id);
		this.moveblock=$('#'+moveblock_id);
		this.upblock=upblock_id?$('#'+upblock_id):null;
		this.downblock=downblock_id?$('#'+downblock_id):null;

		var that=this;
		this.moveblock.on('mousedown',function(event){
			that.mouseDown(event);
		});

	}
	Scroll.prototype={
		mouseDown:function(event){
			var that=this,
				panelHeight=this.panel.height(),
				contentsHeight=this.contents.height(),
				barHeight=this.bar.height(),
				moveblockHeight=this.moveblock.height(),
				upblockHeight=this.upblock?this.upblock.height():0,
				downblockHeight=this.downblock?this.downblock.height():0,
				moveblock_startTop=this.moveblock.position().top,
				contents_startTop=this.contents.position().top,
				startY=event.pageY;
		//	alert(this.upblock.height());
			$(document).bind('mousemove',doDrag);
			$(document).bind('mouseup',stopDrag);
			$('body').on('selectstart',function(){return false;});

			//开始拖动滚动块事件
			function doDrag(event){
				var moveblock_newTop=event.pageY-startY+moveblock_startTop,
					contents_newTop=contents_startTop-(event.pageY-startY)/(barHeight-moveblockHeight-downblockHeight)*(contentsHeight-panelHeight);

				if(moveblock_newTop<upblockHeight){
					moveblock_newTop=upblockHeight;
					contents_newTop=0;
				}else if(moveblock_newTop>barHeight-moveblockHeight-downblockHeight){
					moveblock_newTop=barHeight-moveblockHeight-downblockHeight;
					contents_newTop=-(contentsHeight-panelHeight);
				}
				if(contents_newTop>0){
					contents_newTop=0;
				}
				
				that.moveblock.css('top',moveblock_newTop+'px');
				that.contents.css('top',contents_newTop+'px');

			}

			//停止拖动滚动块事件
			function stopDrag(event){
				$(document).unbind('mousemove',doDrag);
				$(document).unbind('mouseup',stopDrag);
				$('body').unbind('selectstart');
			}

		}
	}

	var Tab=(function(){

		
	}());




	var overlay=new Overlay('overlay',0.75),
		popwin=new Popupwin('popupLayerBox','closePopupLayer',overlay),
		scroll=new Scroll('panel','contents','bar','move','up','down');
	
	
$('#btnPopup').on('click',function(){
	popwin.openWin();
});

});