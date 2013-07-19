var Waterfall = (function() {

	var colNum = 3,		//列数
		imgRoot = 'http://cued.xunlei.com/demos/publ/img/',	 //图片路径

		imgIndex = 0,	//当前图片索引
		perNum = 9,		//每次请求图片数
		totalImg = 160;		//图片总数


	function $(id) {
		return document.getElementById(id);
	}

	//获取最短列
	function colShortest() {
		var shortest = 0;
	//	console.log(shortest + ':  ' + $('col' + shortest).offsetHeight);
		for(var i = 1; i < colNum; i += 1) {
	//		console.log(i + ':  ' + $('col' + i).offsetHeight);
			if($('col' + i).offsetHeight < $('col' + shortest).offsetHeight) {
				shortest = i;
			}
		}
	//	console.log('shortest: ' + shortest + '\n');
		return shortest;
	}

	//获取当前需要图片url
	function getImgUrl() {
		var index = imgIndex;
		if(imgIndex < 10) {	
			index = '00' + imgIndex;
		}else if(imgIndex < 100) {
			index = '0' + imgIndex;
		}
		return imgRoot + 'P_' + index + '.jpg';
 	}

 	//每滚动到页面底部就更新一下页面
 	function render() {
 		if(isToBottom()) {
			$('loading').style.display = 'block';
			appendItem(perNum);	
		}
	}
		

 	//创建一个项
 	function createItem() {
 		var frag = document.createDocumentFragment(),
 			div = document.createElement('div'),
			imgUrl = getImgUrl(),
			img = '<img src="' + imgUrl + '" />';
		div.className = 'item';
		div.innerHTML = img;
		frag.appendChild(div);
		return frag;
 	}

 	//append num个图片
 	function appendItem(num) {
 		var newItem = [];
 		for(var i = 0; i < num; i += 1) {
 			if(totalImg >= 0) {
 				newItem.push(createItem());
 				imgIndex += 1;
				totalImg -= 1;
 			}
 		}
 		// var curCol = colShortest();
 		var curCol = 0;
 		for(var i = 0, len = newItem.length; i < len; i += 1) {
 			if(curCol >= colNum) {
 				curCol = 0;
 			}
 			$('col' + curCol).appendChild(newItem[i]);
 		// 	$('col' + colShortest()).appendChild(newItem[i]);
 			curCol += 1;
 		}
 		$('loading').style.display = 'none';
 	}
 	//增加一个图片项
	// function appendItem() {
	// 	var frag = document.createDocumentFragment(),
	// 		div = document.createElement('div'),
	// 		imgUrl = getImgUrl(),
	// 		image = new Image(),
	// 		img = '<img src="' + imgUrl + '" />';
	// 	div.className = 'item';
	// 	div.innerHTML = img;
	// 	frag.appendChild(div);
	// 	colShortest().appendChild(frag);		
	// }

	//判断是否滚动到底部
	function isToBottom() {
		var scrollT = document.body.scrollTop || document.documentElement.scrollTop,	//滚动高度
			winH =document.documentElement.clientHeight,		//窗口可视高度
			bodyH = document.body.offsetHeight;	//正文高度

		if((bodyH - scrollT) <= (winH + 10)) {
			return true;
		}
		return false;

	}
	//初始化
	function init() {
		appendItem(15);	//先加载15张图片
		window.onscroll = function() {		//滚动事件
			render();
		}
	}

	return {
		init:init
	} 

})();

Waterfall.init();