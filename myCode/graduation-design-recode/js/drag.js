var drag = (function(){

	/**
	 * 创建画布
	 * @param  {Number} w 画布宽度
	 * @param  {Number} h 画布高度
	 * @return {Object} canvas 画布
	 */
	function createCanvas(w,h) {

		var canvas = document.createElement('canvas');

		canvas.id = 'canvas';
		canvas.width = w;
		canvas.height = h;

		return canvas;
	}

	
	function drawImg(canv, img) {

		var ctx = canv.getContext('2d');
			
		ctx.drawImage(img, 0, 0, img.width, img.height);
	}

	return{
		dealFile:function(box, file, callback) {
			var reader = new FileReader(),
				type = file.type;

			if (type.indexOf('image') === 0) {
				reader.onload = function(e){
					var src = e.target.result,
						img = new Image();
					img.onload = function() {
						var h = img.height,
							w = img.width
							canvas = createCanvas(w, h);

						drawImg(canvas, img);
						box.innerHTML = '';
						box.appendChild(canvas);
						ps.init(canvas);
					}
					img.src = src;
				}
				reader.readAsDataURL(file);
			}
		},
		init:function(box_id,callback) {

			var box = document.getElementById(box_id);

			box.addEventListener("dragstart", function(e){
				e.preventDefault();
			}, false);

			box.addEventListener("dragenter", function(e){
				e.preventDefault();
			}, false);

			box.addEventListener("dragover", function(e){
				e.preventDefault();
			}, false);

			box.addEventListener("drop", function(e){
				e.preventDefault();

				var file = e.dataTransfer.files[0];
				drag.dealFile(box,file);

			}, false);
		}
	}

}());