$(function(){

	function testTime(type, callback) {
		var startTime = new Date().getTime();
		callback();
		var endTime = new Date().getTime(),
			timeElapsed = endTime - startTime;
		console.log(type +'用时:' + timeElapsed + 'ms');
	}


	/**
	 * 显示参数面板
	 * @param  {Object} target 触发器 
     * @param  {Object} parent 父节点 
     * @param  {Object} next 下一个兄弟节点
	 */
	function showPara(target,parent,next){
		if(next.hasClass('parameter')) {
			if(parent.hasClass('li-active')) {
				parent.removeClass('li-active');
				next.fadeOut('swing');
			} else {
				var last = $('#nav').find('.li-active');
				last.removeClass('li-active');			
				last.find('.parameter').fadeOut('swing');
				parent.addClass('li-active');
				next.fadeToggle('swing');
			}			
		} else {
			var last = $('#nav').find('.li-active');
			last.removeClass('li-active');			
			last.find('.parameter').fadeOut('swing');
			parent.addClass('li-active');
		}
	}

	//rgba zoom 恢复到初始值
	function rgbaInit(){
		$('#iRed').val(0).next('output').text('0%');
		$('#iGreen').val(0).next('output').text('0%');
		$('#iBlue').val(0).next('output').text('0%');
		$('#iApa').val(255).next('output').text('255');
		$('#iZoom').val(1).change();
	}

	/**
	 * 处理图像
	 * @param  {id} 触发器id
	 */
	function dealPic(id) {
		switch(id) {
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
				testTime(id, function(){
					ps.gblur(3,3);
				});
				
				break;
			case 'smear':
				ps.smear(12);
				break;
			case 'sharpen':
				ps.sharpen();
				break;
			case 'mosaics':
				ps.mosaics();
				break;
			case 'relief':
				ps.relief();
				break;
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
				break;
		}
	}


	//保存图片
	function savepic(val){
		var canvas=document.getElementById('canvas'),
			data =canvas.toDataURL('image/'+val).replace('image/'+val, 'image/octet-stream');
			
    	document.location.href = data;
	}
	//给radio  input添加click事件
	function setRadioInput(){
		$('input[type="radio"]').click(function(){
			var val=$(this).val();
				
			savepic(val);
		});
	}

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

	//给range input添加change事件
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

	var cboxInner = $('#canvasbox').html();

	$('#nav').on('click', 'li>a,span', function(event) {

		event.preventDefault();

		var target = $(event.target),	
			id = target.attr('id'),
			parent = target.parent(),	//父节点
			next = target.next();	    //下一个兄弟节点

		if(target.get(0).tagName.toLowerCase() === 'a'){
			showPara(target,parent,next);
		}
		
		dealPic(id);

	});

	$('#navTrigger').on('click', function(event){

		event.preventDefault();

		var nav = $('#nav');
		if(nav.hasClass('nav-active')) {
			nav.removeClass('nav-active');


		} else {
			nav.addClass('nav-active');
			var last = nav.find('.li-active');
			last.removeClass('li-active');			
			last.find('.parameter').fadeOut('swing');
			$('#canvasbox').empty().append(cboxInner);
			rgbaInit();
			$('#file').change(function(event){
				var file = $('#file').get(0).files[0],
					box = $('#canvasbox').get(0);

				drag.dealFile(box,file);
			});

		}
		//nav.hasClass('nav-active') ? nav.removeClass('nav-active') : nav.addClass('nav-active');

		
	});

	$('#file').change(function(event){
		var file = $('#file').get(0).files[0],
			box = $('#canvasbox').get(0);

		drag.dealFile(box, file);
	});

	 drag.init('canvasbox');
	 setRangeInput();
	 setRadioInput();

});