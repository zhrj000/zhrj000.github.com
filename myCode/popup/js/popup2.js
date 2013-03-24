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
			$('body').css('overflow','auto');
			$('html').css('overflow','');
			this.layer.fadeOut(500);
		}
	}


	//弹出窗
	function Popupwin(win_id,close_id,overlay){
		this.win=$('#'+win_id);
		this.close=$('#'+close_id);
		this.overlay=overlay?overlay:null;

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
			that.win.stop(true, false).animate({
				'top':($(window).height()-that.win.height())/2+$(document).scrollTop(),
				'left':($(window).width()-that.win.width())/2+$(document).scrollLeft()
			},400,'linear');
		});
	}
	Popupwin.prototype={
		//关闭弹出窗
		closeWin:function(){		
			this.win.slideUp(300);
			this.overlay?this.overlay.hide():null;
		},
		//弹出弹出窗
		openWin:function(){			
			this.win.css({				//初始化位置在中间
				'top':($(window).height()-this.win.height())/2+$(document).scrollTop(),
				'left':($(window).width()-this.win.width())/2+$(document).scrollLeft(),
				'zIndex':'2000'
			});
			this.win.slideDown(300);
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
			console.log('down');
			var that=this,
				panelHeight=this.panel.height(),
				contentsHeight=this.contents.height(),
				barHeight=this.bar.height(),
				moveblockHeight=this.moveblock.height(),
				upblockHeight=this.upblock?this.upblock.height():0,
				downblockHeight=this.downblock?this.downblock.height():0,
				moveblock_startTop=parseInt(this.moveblock.css('top')),
				contents_startTop=parseInt(this.contents.css('top')),
				startY=event.pageY;
			console.log('moveblock_startTop='+moveblock_startTop);

			console.log(this.moveblock.get(0).setCapture);
			if(this.moveblock.get(0).setCapture){
				this.moveblock.on('mousemove',function(event){
					doDrag(event);
				});
				this.moveblock.on('museup',function(event){
					stopDrag(event);
				});
				this.moveblock.get(0).setCapture();
			}else{
				this.moveblock.on('mousemove',function(event){
					doDrag(event);
				});
				this.moveblock.on('museup',function(event){
					stopDrag(event);
				});
			}
			function doDrag(event){
				console.log('doDrag');


				var moveblock_newTop=event.pageY-startY+moveblock_startTop,
					contents_newTop=contents_startTop-(event.pageY-startY)/(contentsHeight-panelHeight)*(barHeight-moveblockHeight-upblockHeight-downblockHeight);

				if(moveblock_newTop<upblockHeight){
					console.log('1、moveblock_newTop='+moveblock_newTop+',upblockHeight='+upblockHeight);
					moveblock_newTop=upblockHeight;
					contents_newTop=0;
				}else if(moveblock_newTop>barHeight-moveblockHeight-downblockHeight){
					console.log('2、moveblock_newTop='+moveblock_newTop+',barHeight-moveblockHeight-downblockHeight='+(barHeight-moveblockHeight-downblockHeight));
					moveblock_newTop=barHeight-moveblockHeight-downblockHeight;
					contents_newTop=-(contentsHeight-panelHeight);
				}
				//console.log(startY);
				that.moveblock.css('top',moveblock_newTop+'px');
				that.contents.css('top',contents_newTop+'px');

			}
			function stopDrag(){
				console.log(that.moveblock.get(0));

				if(that.moveblock.get(0).releaseCapture){
					that.moveblock.on('mousemove',function(event){
						doDrag(event);
					});
					that.moveblock.on('museup',function(event){
						stopDrag(event);
					});
					that.moveblock.get(0).setCapture();
				}
				that.moveblock.unbind('mousemove',function(event){
					doDrag(event);
				});
				that.moveblock.unbind('museup',function(event){
					stopDrag(event);
				});
			}

		}
	}


	var overlay=new Overlay('overlay',0.75),
		popwin=new Popupwin('popupLayerBox','closePopupLayer',overlay),
		scroll=new Scroll('panel','contents','bar','move','up','down');
	
	
$('#btnPopup').on('click',function(){
	popwin.openWin();
});

});