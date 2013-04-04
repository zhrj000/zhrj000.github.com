$(function(){



	var navTree=(function(){

		var funcs=$('#funcs'),
			ulTree=$('#ulTree'),
			ulList=$('#ulList'),
			paraBox=$('#paraBox'),
			canvas=$('#canvas'),
			panel=$('#panel');


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
					ps.zoom(val);
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
					ps.rotate(0-$('#ratote_para').val());
					break;
				case 'rrotate':
					ps.rotate($('#ratote_para').val());
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
				tid=target.attr('id');

			event.preventDefault();

			ulList.find('.active').removeClass('active');
			ulTree.find('.active').removeClass('active');
			$(this).addClass('active');
			ulTree.find('a[href="#'+tid+'"]').addClass('active');

			showPanel(tid);
			if(tid==='recover'){
				
				$('#iZoom').attr('id','').val(1).change().attr('id','iZoom');

			}

			switch(tid){
				case 'recover':
					ps.recover();
					rgbaInit();
					break;
				case 'gray':
					ps.gray();
					
					break;
				case 'antisign':
					ps.antisign();
					break;
				case 'binarization':
					ps.binarization();
					break;
				case 'blur':
					ps.gblur(1,3);
					break;
				case 'sharpen':
					ps.sharpen();
					break;
				case 'mosaics':
					ps.mosaics();
					$('#iZoom').attr('id','').val(1).change().attr('id','iZoom');
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

		
		return{
			init:function(){
				setPheight();
				
				$(window).on('resize',resizePanel);
				drag.init('canvasbox',"image",callback);
				navTree.init();
			}
		}

	}());

	main.init();

});

