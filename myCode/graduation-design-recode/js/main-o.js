$(function(){


	function testTime(type, callback) {
		var startTime = new Date().getTime();
		callback();
		var endTime = new Date().getTime(),
			timeElapsed = endTime - startTime;
		console.log(type +'用时:' + timeElapsed + 'ms');
	}



	var navTree=(function(){

		var funcs=$('#funcs'),
			ulTree=$('#ulTree'),
			ulList=$('#ulList'),
			paraBox=$('#paraBox'),
			canvas=$('#canvas'),
			panel=$('#panel');

		var rotate=0;


		//对range input变化处理事件
		function inputChange(outp,inp,val){
			switch(inp.attr('id')){	
				case 'iRed':
					outp.text(val+'%');
					ps.mixing('r',val);
					break;
				case 'iGreen':
					outp.text(val+'%');
					ps.mixing('g',val);
					break;
				case 'iBlue':
					outp.text(val+'%');
					ps.mixing('b',val);
					break;
				case 'iApa':
					outp.text(val);
					ps.mixing('a',val);
					break;
				case 'iZoom':
					testTime('缩放' + val +'倍',function(){
						ps.zoom(val);
					});
					//ps.zoom(val);
					// ps.zuijinlin(val);
					break;
				default:
					break;
			}
		}

		//给radio  input添加click事件
		function setRadioInput(){
			$('input[type="radio"]').click(function(){
				var val=$(this).val();
				
				savepic(val);
			});
		}

		//给range input添加changge事件
		function setRangeInput(){
			var el, newPoint, newPlace, offset;
			$("input[type='range']").change(function() {
				el = $(this);
				width = el.width();
				newPoint = (el.val() - el.attr('min')) / (el.attr('max') - el.attr('min'));
				if (newPoint < 0) { 
					newPlace = 0;  
				}else if (newPoint > 1) { 
					newPlace = width; 
				}else { 
					newPlace = (width-10) * newPoint;
				}
				if(el.next('output').hasClass('ui-output')){
					el.next('output')
				  	.css({
						left: newPlace,
						marginLeft: '-15px'
				  	})
				  	.text(el.val());
				}else{
					el.next('output').text(el.val());
				}
		
				inputChange(el.next('output'),el,el.val());				
				
			});

		}

		//rgba zoom 恢复到初始值
		function rgbaInit(){
			$('#iRed').val(0).next('output').text('0%');
			$('#iGreen').val(0).next('output').text('0%');
			$('#iBlue').val(0).next('output').text('0%');
			$('#iApa').val(255).next('output').text('255');
			$('#iZoom').val(1).change();
		}

		//树节点点击后弹出层
		function showPanel(id){
			funcs.find('.parameter').not(function(){return $(this).attr('data-for')===id;}).fadeOut();
			funcs.find('div[data-for="'+id+'"]').fadeToggle();
		}


		function paraBoxClick(event){
			var target=$(event.target),
				tid=target.attr('id');

			event.preventDefault();
			if(tid==='lrotate'||tid==='rrotate'){
				$('#iZoom').attr('id','').val(1).change().attr('id','iZoom');
			}

			switch(tid){
				case 'lrotate':
					testTime(tid,function(){
						ps.rotate(0-$('#ratote_para').val());
					});
					//ps.rotate(0-$('#ratote_para').val());
					break;
				case 'rrotate':
					testTime(tid,function(){
						ps.rotate($('#ratote_para').val());
					});
					//ps.rotate($('#ratote_para').val());
					break;
				case 'lrmirror':
					ps.mirroring(0);
					break;
				case 'udmirror':
					ps.mirroring(1);
					break;
				default:
					break;			}
		}

		//保存图片
		function savepic(val){
			var canvas=document.getElementById('canvas'),
				data =canvas.toDataURL('image/'+val).replace('image/'+val, 'image/octet-stream');
			
    		document.location.href = data;
		}

		function ulListClick(event){
			var target=$(event.target),
				tid=target.attr('id'),
				torotate=360;

			event.preventDefault();

			ulList.find('.active').removeClass('active');
			ulTree.find('.active').removeClass('active');
			$(this).addClass('active');
			ulTree.find('a[href="#'+tid+'"]').addClass('active');

			showPanel(tid);
			if(tid==='recover'){
				
				$('#iZoom').attr('id','').val(1).change().attr('id','iZoom');

			}
			if(rotate===0){
				torotate=360;
				rotate=360;
			}else if(rotate===360){
				torotate=0;
				rotate=0;
			}

			switch(tid){
				case 'recover':
				// $('#canvas').css({
				// 		'-webkit-transform-style': 'preserve-3d',
				// 		'-webkit-transition': '-webkit-transform 1.5s ease-in-out',
				// 		'-webkit-transform': 'rotateY('+torotate+'deg)',
    // 					'-moz-transform': 'rotateY('+torotate+'deg)'
				// 	});
				// 	setTimeout(function(){
						ps.recover();
						rgbaInit();
					// },1000);
					
					break;
				case 'gray':
					// $('#canvas').css({
					// 	'-webkit-transform-style': 'preserve-3d',
					// 	'-webkit-transition': '-webkit-transform 1.5s ease-in-out',
					// 	'-webkit-transform': 'rotateY('+torotate+'deg)',
    	// 				'-moz-transform': 'rotateY('+torotate+'deg)'
					// });
					// setTimeout(function(){
						//ps.gray();
					// },1000);
					
					ps.relief();
					break;
				case 'antisign':
					// $('#canvas').css({
					// 	'-webkit-transform-style': 'preserve-3d',
					// 	'-webkit-transition': '-webkit-transform 1.5s ease-in-out',
					// 	'-webkit-transform': 'rotateY('+torotate+'deg)',
    	// 				'-moz-transform': 'rotateY('+torotate+'deg)'
					// });
					// setTimeout(function(){
						ps.antisign();
					// },1000);
					
					break;
				case 'binarization':
					// $('#canvas').css({
					// 	'-webkit-transform-style': 'preserve-3d',
					// 	'-webkit-transition': '-webkit-transform 1.5s ease-in-out',
					// 	'-webkit-transform': 'rotateY('+torotate+'deg)',
    	// 				'-moz-transform': 'rotateY('+torotate+'deg)'
					// });
					// setTimeout(function(){
						ps.binarization();
					// },1000);
					
					break;
				case 'blur':
					// $('#canvas').css({
					// 	'-webkit-transform-style': 'preserve-3d',
					// 	'-webkit-transition': '-webkit-transform 1.5s ease-in-out',
					// 	'-webkit-transform': 'rotateY('+torotate+'deg)',
    	// 				'-moz-transform': 'rotateY('+torotate+'deg)'
					// });
					// setTimeout(function(){
					// 	testTime(tid,function(){
							ps.gblur(3,3);
						//});
						//ps.gblur(3,3);
				//	},1000);
					
					break;
				case 'smear':
					// $('#canvas').css({
					// 	'-webkit-transform-style': 'preserve-3d',
					// 	'-webkit-transition': '-webkit-transform 1.5s ease-in-out',
					// 	'-webkit-transform': 'rotateY('+torotate+'deg)',
    	// 				'-moz-transform': 'rotateY('+torotate+'deg)'
					// });
					// setTimeout(function(){
						ps.smear(12);
					// },1000);
					
					break;
				case 'sharpen':
					// $('#canvas').css({
					// 	'-webkit-transform-style': 'preserve-3d',
					// 	'-webkit-transition': '-webkit-transform 1.5s ease-in-out',
					// 	'-webkit-transform': 'rotateY('+torotate+'deg)',
    	// 				'-moz-transform': 'rotateY('+torotate+'deg)'
					// });
					// setTimeout(function(){
						ps.sharpen();
					// },1500);
					
					break;
				case 'mosaics':
					// $('#canvas').css({
					// 	'-webkit-transform-style': 'preserve-3d',
					// 	'-webkit-transition': '-webkit-transform 1.5s ease-in-out',
					// 	'-webkit-transform': 'rotateY('+torotate+'deg)',
    	// 				'-moz-transform': 'rotateY('+torotate+'deg)'
					// });
					// setTimeout(function(){
						ps.mosaics();
					// },1000);
					
					break;
				default:
					break;
			}

		}

		function ulTreeClick(event){
			event.preventDefault();

			var target=$(event.target),
				tid=target.attr('href');

			$(tid).click();
		}




		return{
			init:function(){
				ulList.on('click','a',ulListClick);
				ulTree.on('click','a',ulTreeClick);
				paraBox.on('click','span',paraBoxClick);
				setRangeInput();
				setRadioInput();
				//setSpall();
				rgbaInit();

			}
		}

	}());






	var main=(function(){


		// 图片拖入选区之后的回调函数	
		function callback(canvas){
			ps.init(canvas);
			$('#canvas').hide().slideDown(1000);
			setSpall();

			
		}


		function setSpall(){

			$('#canvas').on('click',function(event){
				var rect = $('#canvas').get(0).getBoundingClientRect(),
					clickX=event.pageX,
					start=clickX-rect.left,
					dis=30;
				ps.spall(start,dis);
				$('#iZoom').attr('id','').val(1).change().attr('id','iZoom');

			});

		
		}

		//设置#panel的高
		function setPheight(){	
			var panel=$('#panel'),
				winH=$(window).height();
			panel.css('height',winH-114);
		}


		//窗口resize事件，重置panel的高和canvas的位置
		function resizePanel(){
			var panel=$('#panel'),
				canvas=$('#canvas'),
				winH=$(window).height();
			panel.css('height',winH-114);
			canvas.css({
				'top':(panel.height()-canvas.height())/2,
				'left':(panel.width()-canvas.width())/2
			});
		}

		function openFile(){
			$('#file').change(function(event){
				var file = $('#file').get(0).files[0];
				drag.openfile(file);
			});
		}

		
		return{
			init:function(){
				setPheight();
				
				$(window).on('resize',resizePanel);
				drag.init('canvasbox',"image",callback);
				openFile();
				navTree.init();
				
			}
		}

	}());

	main.init();

});

