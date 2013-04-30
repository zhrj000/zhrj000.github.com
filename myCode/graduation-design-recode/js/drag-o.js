//拖拽
	var drag = (function() {

		var canvasbox,	//拖拽之后放置的地方
			filetype,	//拖拽的文件类型
			callback;




		//初始化canvasbox
		function initCanvasbox() {

			var docHeight = document.body.scrollHeight,
				winHeight = window.screen.height;

			// console.log(winHeight+","+docHeight);
			if (docHeight < winHeight) {
				canvasbox.style.height = winHeight + "px";
			}

			
		}
		//根据image参数构造canvas 
		function createCanvas(image) {

			var height = image.height,
				width = image.width,
				canvas = document.createElement("canvas");
			canvas.id = "canvas";
			canvas.height = height;
			canvas.width = width;
			canvas.style.position = "absolute";
			canvas.style.top = (canvasbox.offsetHeight - image.height)/2 + "px";
			canvas.style.left = (canvasbox.offsetWidth - image.width)/2 + "px";


			return canvas;
		}


		//将图片绘制到画布上
		function drawImage(src) {
			var image = new Image(),
				ctx;	
			
			image.onload = function() {
			
				canvas = createCanvas(image);
				ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0, image.width, image.height);
				canvasbox.innerHTML = "";
				canvasbox.appendChild(canvas);

				// ps里面变量的初始化
				//ps.init(canvas);
				callback(canvas);
			}
			image.src = src;

		}





		function dealFile(file) {
			var reader = new FileReader(),
				type = file.type;

			if (type.indexOf("image") === 0) {
				reader.onload = function(event){
					drawImage(event.target.result);
				}
				reader.readAsDataURL(file);
			}else if (type.indexOf("text") === 0) {
				//······
			}
		}

		function handlerEvent(event) {
			event.preventDefault();
			if (event.type === "drop") {
				var file = event.dataTransfer.files[0],
					type = file.type;
				if(!!filetype && file.type.indexOf(filetype) !== 0) {
					return;
				}
				dealFile(file);
			}
		}

		return{
			openfile:function(file) {
				//console.log(file);
				dealFile(file);
			},

			init:function(distination, type, callback1) {
				canvasbox = document.getElementById(distination);
				filetype = type;
				callback = callback1;


				canvasbox.addEventListener("dragstart", handlerEvent, false);
				canvasbox.addEventListener("dragenter", handlerEvent, false);
				canvasbox.addEventListener("dragover", handlerEvent, false);
				canvasbox.addEventListener("drop", handlerEvent, false);
			}
		}

	}());