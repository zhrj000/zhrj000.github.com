
//以o开头，表示原始的
//以n开头，表示当前的

var ps=(function(){

	var canvas=null,		//画板
		context=null,		//画笔
		imagedata=null,		//图像的像素
		aImgdata=null,		//中间变量，为透明度
		hasDeg=0,			//多次旋转失真，用hasDeg使之在当前图片的基础上旋转
		lastOp=0,			//上一次操作，1表示旋转，2表示缩放，0表示其他
		oImg={				//原始图像的各种信息
			height:0,
			width:0,
			imgdata:[]
		},
		curMat=null;	//当前图像像素矩阵



	//图片变化之后，有些全局变量需要更新
	function renewData(){
		var w=canvas.width,
			h=canvas.height;

		aImgdata=context.getImageData(0,0,w,h);
		hasDeg=0;
		curMat=Matrix(h,w,imagedata.data);
		lastOp=0;
	}


	//如果canvas里面的图片大小变换了，resetcanvas的大小和位置
	function resetCanvasStyle(nWidth,nHeight){

		canvas.width=nWidth;
		canvas.height=nHeight;

		canvas.style.top=(document.getElementById('panel').offsetHeight-nHeight)/2+'px';
		canvas.style.left=(document.getElementById('panel').offsetWidth-nWidth)/2+'px';

		

	}

	/**
     * 像素矩阵
     * @param  {Number} row 矩阵行数 
     * @param  {Number} col 矩阵列数 
     * @param  {Array} datas canvas里面的imagedata数据
     * @return {Array}	存放像素的二维数组
     */
	function Matrix(row,col,datas){
		var mat=new Array(row);
		for(var r=0;r<row;r+=1){
			mat[r]=new Array(col);
		}
		for(var i=0,len=datas.length;i<len;i+=4){
			var r=datas[i+0],
				g=datas[i+1],
				b=datas[i+2],
				a=datas[i+3],
				x=Math.floor(i/(col*4)),
				y=(i%(col*4))/4,
				pix=new Pixels(r,g,b,a);
			mat[x][y]=pix;
		}
		return mat;
	}
	
	/**
     * 像素
     * @param  {Number} r red值
     * @param  {Number} g green值
     * @param  {Number} b blue值
     * @param  {Number} a pactity透明度值
     */
	function Pixels(r,g,b,a){
		this.r=r;
		this.g=g;
		this.b=b;
		this.a=a;
	}



	return{
		//当图片拉进canvas创建时初始化ps
		init:function(_canvas){
			var h=_canvas.height,
				w=_canvas.width;

			//初始化画布、画笔
			canvas=_canvas;
			context=canvas.getContext('2d');
			imagedata=context.getImageData(0,0,w,h);
			

			//初始化原始图片数据
			oImg.height=h;
			oImg.width=w;
			oImg.imgdata=context.getImageData(0,0,w,h);
			

			//初始化几个全局变量
			renewData();			

		},
		//恢复到原图
		recover:function(){

			resetCanvasStyle(oImg.width,oImg.height);
			context.putImageData(oImg.imgdata,0,0);
			imagedata=context.getImageData(0,0,canvas.width,canvas.height);						
			renewData();
			
		},
		//灰度图
		gray:function(){

			imagedata=context.getImageData(0,0,canvas.width,canvas.height);
			for(var i=0,n=imagedata.data.length;i<n;i+=4){
				imagedata.data[i+0]=(imagedata.data[i+0]+imagedata.data[i+1]+imagedata.data[i+2])/3;
				imagedata.data[i+1]=imagedata.data[i+0];
				imagedata.data[i+2]=imagedata.data[i+0];
			}
			context.putImageData(imagedata,0,0);
			renewData();			
			
		},
		//图像反显
		antisign:function(){

			imagedata=context.getImageData(0,0,canvas.width,canvas.height);
			for(var i=0,n=imagedata.data.length;i<n;i+=4){
				imagedata.data[i+0]=255-imagedata.data[i+0];
				imagedata.data[i+1]=255-imagedata.data[i+2];
				imagedata.data[i+2]=255-imagedata.data[i+1];
			}
			context.putImageData(imagedata,0,0);
			renewData();
			
		},
		//二值化图
		binarization:function(){

			imagedata=context.getImageData(0,0,canvas.width,canvas.height);
			for(var i=0,n=imagedata.data.length;i<n;i+=4){
				imagedata.data[i+0]=((imagedata.data[i+0]+imagedata.data[i+1]+imagedata.data[i+2])/3>122)?255:0;
				imagedata.data[i+1]=imagedata.data[i+0];
				imagedata.data[i+2]=imagedata.data[i+0];
			}
			context.putImageData(imagedata,0,0);
			renewData();
			
		},
		//高斯模糊
		//参考资料http://www.ruanyifeng.com/blog/2012/11/gaussian_blur.html
		//权重公式g(x,y)=(1/(2*pi*sigma*sigma))*exp(-(x*x+y*y)/(2*sigma*sigma))
		gblur:function(radius,sigma){

			var width=canvas.width,
				height=canvas.height;
			imagedata=context.getImageData(0,0,width,height);
			curMat=Matrix(height,width,imagedata.data);

			var gMat=[],	//高斯权重矩阵
				gSum=0,
				count=0,
				gcount=0;	//权重矩阵的下标

			for(var x=-radius;x<=radius;x+=1){
				for(var y=-radius;y<=radius;y+=1){
					var val=(1/(2*Math.PI*sigma*sigma))*Math.exp(-(x*x+y*y)/(2*sigma*sigma));
					gMat[gMat.length]=val;
					gSum+=val;
				}
			}
			for(var i=0,len=gMat.length;i<len;i+=1){
				gMat[i]/=gSum;
			}


			for(var i=0;i<height;i+=1){
				for(var j=0;j<width;j+=1){
					//像素矩阵curMat中的某个像素(i,j)
					gcount=0;	//归零
					imagedata.data[count+0]=0;
					imagedata.data[count+1]=0;
					imagedata.data[count+2]=0;
					for(var x=-radius;x<=radius;x+=1){
						for(var y=-radius;y<=radius;y+=1){
				
							if((i+x)>=0&&(i+x)<height&&(j+y)>=0&&(j+y)<width){
								
								imagedata.data[count+0]+=curMat[i+x][j+y].r*gMat[gcount];
								imagedata.data[count+1]+=curMat[i+x][j+y].g*gMat[gcount];
								imagedata.data[count+2]+=curMat[i+x][j+y].b*gMat[gcount];
							}else{
								imagedata.data[count+0]+=curMat[i][j].r*gMat[gcount];
								imagedata.data[count+1]+=curMat[i][j].g*gMat[gcount];
								imagedata.data[count+2]+=curMat[i][j].b*gMat[gcount];
							}
							gcount+=1;
						}
					}
					count+=4;
				}
			}
			context.putImageData(imagedata,0,0);
			renewData();

			
		},
		//拉普拉斯锐化
		//数字图像处理P99
		//g(x,y)=f(x,y)+c*[f(x+1,y)+f(x-1,y)+f(x,y+1)+f(x,y-1)-4f(x,y)];
		sharpen:function(){

			var width=canvas.width,
				height=canvas.height;
			imagedata=context.getImageData(0,0,width,height);
			curMat=Matrix(height,width,imagedata.data);

			var x,y,xp,xm,yp,ym,
				count=0;

			for(x=0;x<height;x+=1){
				for(y=0;y<width;y+=1){
					xp=x+1;
					xm=x-1;
					yp=y+1;
					ym=y-1;
					if(xp>height-1){
						xp=height-1;
					}
					if(xm<0){
						xm=0;
					}
					if(yp>width-1){
						yp=width-1;
					}
					if(ym<0){
						ym=0;
					}
					imagedata.data[count+0]=curMat[x][y].r+(-1)*(curMat[xp][y].r+curMat[xm][y].r+curMat[x][yp].r+curMat[x][ym].r-4*curMat[x][y].r);
					imagedata.data[count+1]=curMat[x][y].g+(-1)*(curMat[xp][y].g+curMat[xm][y].g+curMat[x][yp].g+curMat[x][ym].g-4*curMat[x][y].g);
					imagedata.data[count+2]=curMat[x][y].b+(-1)*(curMat[xp][y].b+curMat[xm][y].b+curMat[x][yp].b+curMat[x][ym].b-4*curMat[x][y].b);
					//imagedata.data[count+0]=curMat[x][y].r+(-1)*(curMat[xp][y].r+curMat[xm][y].r+curMat[x][yp].r+curMat[x][ym].r-4*curMat[x][y].r);
					count+=4;
				}
			}
			context.putImageData(imagedata,0,0);
			renewData();
			
		},
		//翻转
		mirroring:function(type){

			imagedata=context.getImageData(0,0,canvas.width,canvas.height);
			curMat=Matrix(canvas.height,canvas.width,imagedata.data);
			var width=canvas.width,
				height=canvas.height,
				count;
			switch(type){
				case 0: 			//水平镜像
					count=0;
					for(var i=0;i<height;i+=1){
						for(var j=0;j<width;j+=1){
							imagedata.data[count+0]=curMat[i][width-j-1].r;
							imagedata.data[count+1]=curMat[i][width-j-1].g;
							imagedata.data[count+2]=curMat[i][width-j-1].b;
							imagedata.data[count+3]=curMat[i][width-j-1].a;
							count+=4;

						}
					}
					context.putImageData(imagedata,0,0);
					break;
				case 1: 			//垂直镜像
					count=0;
					for(var i=0;i<height;i+=1){
						for(var j=0;j<width;j+=1){
							imagedata.data[count+0]=curMat[height-i-1][j].r;
							imagedata.data[count+1]=curMat[height-i-1][j].g;
							imagedata.data[count+2]=curMat[height-i-1][j].b;
							imagedata.data[count+3]=curMat[height-i-1][j].a;
							count+=4;

						}
					}
					context.putImageData(imagedata,0,0);
					break;
			}
			renewData();
			
		},
		//调色
		mixing:function(type,val){
			var nImgdata=context.getImageData(0,0,canvas.width,canvas.height);
			switch(type){
				case 'r':
					for(var i=0,n=imagedata.data.length;i<n;i+=4){
						nImgdata.data[i+0]=imagedata.data[i+0]*(1+val/100);
					}
					context.putImageData(nImgdata,0,0);
					aImgdata=context.getImageData(0,0,canvas.width,canvas.height);
					break;
				case 'g':
					for(var i=0,n=imagedata.data.length;i<n;i+=4){
						nImgdata.data[i+1]=imagedata.data[i+1]*(1+val/100);
					}
					context.putImageData(nImgdata,0,0);
					aImgdata=context.getImageData(0,0,canvas.width,canvas.height);
					break;
				case 'b':
					for(var i=0,n=imagedata.data.length;i<n;i+=4){
						nImgdata.data[i+2]=imagedata.data[i+2]*(1+val/100);
					}
					context.putImageData(nImgdata,0,0);
					aImgdata=context.getImageData(0,0,canvas.width,canvas.height);
					break;
				case 'a':
					for(var i=0,n=imagedata.data.length;i<n;i+=4){
						nImgdata.data[i+0]=aImgdata.data[i+0];
						nImgdata.data[i+1]=aImgdata.data[i+1];
						nImgdata.data[i+2]=aImgdata.data[i+2];
						if(aImgdata.data[i+3]===0){
							nImgdata.data[i+3]=0;
						}else{
							nImgdata.data[i+3]=val;
						}
						
					}
					context.putImageData(nImgdata,0,0);
					break;
				default:
					break;
			}
			curMat=Matrix(canvas.height,canvas.width,nImgdata.data);
			hasDeg=0;
			lastOp=0;
		},
		//图片旋转
		rotate:function(degree){

			if(lastOp===2){	//如果上一步操作是缩放的话
				curMat=Matrix(canvas.height,canvas.width,imagedata.data);
			}

			hasDeg+=parseInt(degree);
			degree=hasDeg;

			var oldX1,oldY1,oldX2,oldY2,oldX3,oldY3,oldX4,oldY4,	//原图4个点的坐标，以图像中心为原点
				newX1,newY1,newX2,newY2,newX3,newY3,newX4,newY4,	//新图4个点的坐标
				oldH=curMat.length,
				oldW=curMat[0].length,
				newW,newH,				//新图宽和高
				radian=Math.PI*(degree/180),	//角度转弧度
				sinR=Math.sin(radian),			//弧度正弦值
				cosR=Math.cos(radian),			//弧度余弦值
			//	nMat,	//新的矩阵
				f1,
				f2,
				count=0;

			oldX1=-(oldW-1)/2;
			oldY1=(oldH-1)/2;
			oldX2=(oldW-1)/2;
			oldY2=(oldH-1)/2;
			oldX3=-(oldW-1)/2;
			oldY3=-(oldH-1)/2;
			oldX4=(oldW-1)/2;
			oldY4=-(oldH-1)/2;

			newX1=oldX1*cosR+oldY1*sinR;
			newY1=-oldX1*sinR+oldY1*cosR;
			newX2=oldX2*cosR+oldY2*sinR;
			newY2=-oldX2*sinR+oldY2*cosR;
			newX3=oldX3*cosR+oldY3*sinR;
			newY3=-oldX3*sinR+oldY3*cosR;
			newX4=oldX4*cosR+oldY4*sinR;
			newY4=-oldX4*sinR+oldY4*cosR;

			newW=Math.round(Math.max(Math.abs(newX4-newX1),Math.abs(newX2-newX3))+1);
			newH=Math.round(Math.max(Math.abs(newY4-newY1),Math.abs(newY2-newY3))+1);
			

			// 两个常数，这样不用以后每次都计算了
			f1=-0.5*(newW-1)*cosR-0.5*(newH-1)*sinR+0.5*(oldW-1);
			f2=0.5*(newW-1)*sinR-0.5*(newH-1)*cosR+0.5*(oldH-1);

			
			resetCanvasStyle(newW,newH);
			imagedata=context.getImageData(0,0,canvas.width,canvas.height);
			
			for(var i1=0;i1<newH;i1+=1){
				for(var j1=0;j1<newW;j1+=1){

					// 计算该象素在源DIB中的坐标
					var i0=-j1*sinR+i1*cosR+f2+0.5,
						j0=j1*cosR+i1*sinR+f1+0.5,
						i=Math.floor(i0),
					    u=i0-i,
					    j=Math.floor(j0),
					    v=j0-j,
					    jj=j+1,
					    ii=i+1;

					//对边界值的处理
					if(ii>oldH-1){
						ii=oldH-1;
					}
					if(jj>oldW-1){
						jj=oldW-1;
					}

					// 判断是否在源图范围内
					if(j0>=0&&j0<oldW&&i0>=0&&i0<oldH){
						//nMat[i1][j1]=new Pixels(0,0,0,0);

						imagedata.data[count+0]=(1-u)*(1-v)*curMat[i][j].r+(1-u)*v*curMat[i][jj].r+u*(1-v)*curMat[ii][j].r+u*v*curMat[ii][jj].r;
						imagedata.data[count+1]=(1-u)*(1-v)*curMat[i][j].g+(1-u)*v*curMat[i][jj].g+u*(1-v)*curMat[ii][j].g+u*v*curMat[ii][jj].g;
						imagedata.data[count+2]=(1-u)*(1-v)*curMat[i][j].b+(1-u)*v*curMat[i][jj].b+u*(1-v)*curMat[ii][j].b+u*v*curMat[ii][jj].b;
						imagedata.data[count+3]=(1-u)*(1-v)*curMat[i][j].a+(1-u)*v*curMat[i][jj].a+u*(1-v)*curMat[ii][j].a+u*v*curMat[ii][jj].a;
					}else{
						imagedata.data[count+0]=255;
						imagedata.data[count+1]=255;
						imagedata.data[count+2]=255;
						imagedata.data[count+3]=0;
					}
					
					count+=4;

				}
			}
			context.putImageData(imagedata,0,0);
			aImgdata=context.getImageData(0,0,canvas.width,canvas.height);
			lastOp=1;

		},
		//双线性内插法放大图片
		//f(i+u，j+v) =(1-u)×(1-v) ×f(i，j)+(1-u) ×v×f(i,j+1)+u×(1-v) ×f(i+1,j)+u×v×f(i+1,j+1)公式
		zoom:function(multiple){
			
			if(lastOp===1){	//如果上一步操作是旋转的话
				curMat=Matrix(canvas.height,canvas.width,imagedata.data);
			}

			var newH=Math.round(curMat.length*multiple),
				newW=Math.round(curMat[0].length*multiple),
				count=0;

			
			resetCanvasStyle(newW,newH);
			imagedata=context.getImageData(0,0,canvas.width,canvas.height);

			for(var row=0;row<newH;row+=1){
				for(var col=0;col<newW;col+=1){

					//获取新的(row,col)所对应的旧的(orow,ocol)
					var orow=row/multiple,
					    ocol=col/multiple,
					    i=Math.floor(orow),
					    u=orow-i,
					    j=Math.floor(ocol),
					    v=ocol-j,
					    jj=j+1,
					    ii=i+1;

					//对边界值的处理
					if(ii>curMat.length-1){
						ii=curMat.length-1;
					}
					if(jj>curMat[0].length-1){
						jj=curMat[0].length-1;
					}

					imagedata.data[count+0]=(1-u)*(1-v)*curMat[i][j].r+(1-u)*v*curMat[i][jj].r+u*(1-v)*curMat[ii][j].r+u*v*curMat[ii][jj].r;
					imagedata.data[count+1]=(1-u)*(1-v)*curMat[i][j].g+(1-u)*v*curMat[i][jj].g+u*(1-v)*curMat[ii][j].g+u*v*curMat[ii][jj].g;
					imagedata.data[count+2]=(1-u)*(1-v)*curMat[i][j].b+(1-u)*v*curMat[i][jj].b+u*(1-v)*curMat[ii][j].b+u*v*curMat[ii][jj].b;
					imagedata.data[count+3]=(1-u)*(1-v)*curMat[i][j].a+(1-u)*v*curMat[i][jj].a+u*(1-v)*curMat[ii][j].a+u*v*curMat[ii][jj].a;
					
				
					count+=4;
					
				}
			}
			context.putImageData(imagedata,0,0);
			aImgdata=context.getImageData(0,0,canvas.width,canvas.height);
			lastOp=2;
			hasDeg=0;
		},
		
		spall:function(start,distance){
			var oH=canvas.height,
				oW=canvas.width,
				nH=oH,
				nW=oW,
				count=0;
				nW=oW+distance;
			resetCanvasStyle(nW,nH);
			imagedata=context.getImageData(0,0,nW,nH);

			//Math.random()*(20-10)+10
			for(var i=0;i<oH;i+=1){
				var e=start+Math.round(distance/5),
					b=start-Math.round(distance/5),
					ran=Math.round(Math.random()*(e-b)+b);
					console.log(ran);
				for(var j=0;j<oW;j+=1){
					if(j!==ran){
						imagedata.data[count+0]=curMat[i][j].r;
						imagedata.data[count+1]=curMat[i][j].g;
						imagedata.data[count+2]=curMat[i][j].b;
						imagedata.data[count+3]=curMat[i][j].a;
						count+=4;
					}else{
						imagedata.data[count+0]=curMat[i][j].r;
						imagedata.data[count+1]=curMat[i][j].g;
						imagedata.data[count+2]=curMat[i][j].b;
						imagedata.data[count+3]=curMat[i][j].a;
						count+=4;
						for(var k=0;k<distance;k+=1){
							imagedata.data[count+0]=255;
							imagedata.data[count+1]=255;
							imagedata.data[count+2]=255;
							imagedata.data[count+3]=0;
							count+=4;
						}
					}
				}
			}
			context.putImageData(imagedata,0,0);
			renewData();		

		},
		mosaics:function(){

			imagedata=context.getImageData(0,0,canvas.width,canvas.height);
			curMat=Matrix(canvas.height,canvas.width,imagedata.data);
			var width=canvas.width,
				height=canvas.height,
				count=0;

			for(var i=0;i<height;i+=1){
				for(var j=0;j<width;j+=1){
					var im,jm;
					im=(i+(3-i%7))>(height-1)?(height-1):(i+(3-i%7));
					jm=(j+(3-j%7))>(width-1)?(width-1):(j+(3-j%7));
				
					imagedata.data[count+0]=curMat[im][jm].r;
					imagedata.data[count+1]=curMat[im][jm].g;
					imagedata.data[count+2]=curMat[im][jm].b;
					imagedata.data[count+3]=curMat[im][jm].a;
					count+=4;
				}
			}
			context.putImageData(imagedata,0,0);
			renewData();
		}
	


	}

}());

