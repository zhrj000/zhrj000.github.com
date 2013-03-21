//(function(){

	//画成绩分析折线图
	function drawBrokenLine(scores,name){
		var canvas=document.getElementById("canvas"),
			ctx=canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawCoordinate(ctx,10,290,470,240,"#fff");

		var count=scores.length,  //分数个数
			pointL=240/100,       //每分长度
			boutL,                //每次长度
			x=[],
			y=[];
		if(count<=10){
			boutL=45;
		}else{
			boutL=450/count;
		}
		drawText(ctx,10,20,name+"同学的成绩折线图","#FFF");

		//画一根及格线
		drawLine(ctx,10,290-pointL*60,460,290-pointL*60,1,"#FF0000");
		drawText(ctx,10,290-pointL*60,"pass line","#FF0000");
		//画分数线
		for(var i=0;i<count;i++){
			x[i]=(i+1)*boutL+10,
			y[i]=290-scores[i]*pointL;
			drawCircle(ctx,x[i],y[i],4,"#49B4F2");
			drawText(ctx,x[i],y[i],scores[i],"#fff");
			if(i!==0){
				if(y[i]>y[i-1]){
					drawLine(ctx,x[i],y[i],x[i-1],y[i-1],1,"#49B4F2");
				}else{
					drawLine(ctx,x[i],y[i],x[i-1],y[i-1],1,"#49B4F2");
				}
				
			}
		}
	}

	//画饼状图
	function drawPieChart(scores,name){
		var canvas=document.getElementById("canvas"),
			ctx=canvas.getContext('2d'),
			level=[{count:0,text:"90~100",colors:"#8FB5EB"},
				   {count:0,text:"80~90",colors:"#8FEB90"},
				   {count:0,text:"70~80",colors:"#FFEB9B"},
				   {count:0,text:"60~70",colors:"#CC8FEB"},
				   {count:0,text:"0~60",colors:"#FF9B9B"}],
			slength=scores.length,
			beginrad=0,
			endrad=0;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawText(ctx,10,20,name+"的成绩分布饼状图","#FFF");
		for(var i=slength-1;i>=0;i--){
			if(scores[i]>=90){
				level[0].count++;
			}else if(scores[i]>=80){
				level[1].count++;
			}else if(scores[i]>=70){
				level[2].count++;
			}else if(scores[i]>=60){
				level[3].count++;
			}else{
				level[4].count++;
			}
		}
		for(i=4;i>=0;i--){			
			endrad=level[i].count/slength*360+beginrad;
			drawFan(ctx,150,150,100,beginrad,endrad,level[i].colors);
			if((endrad-beginrad)!==0){
				// console.log((endrad+beginrad)/2);
				// console.log(150+50*Math.cos((endrad+beginrad)/2*Math.PI/180));
				// console.log(150+50*Math.sin((endrad+beginrad)/2*Math.PI/180));
				drawText(ctx,150+50*Math.cos((endrad+beginrad)/2*Math.PI/180)-10,150+50*Math.sin((endrad+beginrad)/2*Math.PI/180),Math.round((level[i].count/slength)*1000)/10+"%","#000");
			}
			beginrad=endrad;
			drawRectangle(ctx,400,30*(i+1),15,15,level[i].colors);
			drawText(ctx,420,30*(i+1)+14,level[i].text,"#fff");
		}


	}

	//画长方形
	function drawRectangle(ctx,x,y,width,height,color){
		ctx.fillStyle=color;				
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x+width,y);
		ctx.lineTo(x+width,y+height);
		ctx.lineTo(x,y+height);
		ctx.closePath();
		ctx.fill();
	}
	//画扇形
	function drawFan(ctx,x,y,length,radB,radE,color){
		if(radE-radB>180){
			drawFan(ctx,x,y,length,radB,radB+180,color);
			drawFan(ctx,x,y,length,radB+180,radE,color);
		}else{
			ctx.fillStyle=color;
			ctx.beginPath();
			ctx.moveTo(x,y);
			ctx.arc(x,y,length,Math.PI/180*radB,Math.PI/180*radE,false);
			ctx.closePath();
			ctx.fill();
			//drawIsoscelesTriangle(ctx,x,y,length,radB,radE,color);
		}
	}
	//绘制文本
	function drawText(ctx,x,y,text,color){
		ctx.font="14px Arial";
		ctx.fillStyle=color;
		ctx.fillText(text,x,y);
	}

	//画直线
	function drawLine(ctx,xb,yb,xe,ye,thickness,color){
		ctx.beginPath();
		ctx.moveTo(xb,yb);
		ctx.lineTo(xe,ye);
		ctx.lineWidth=thickness+"px";
		ctx.strokeStyle=color;
		ctx.closePath();
		ctx.stroke();
	}

	//画圆
	function drawCircle(ctx,x,y,radius,color){
		ctx.fillStyle=color;
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	}

	//添加三角形
	// function addTringle(ctx,x,y,length,num,color){
	// 	var rad=num*Math.PI/180;
	// 	ctx.rotate(rad);
	// 	if(num%180===0){
	// 		ctx.translate(-(x+length/2),-y);
	// 		drawTriangle(ctx,x,y,length,color);
	// 		ctx.translate((x+length/2),y);
	// 	}else if(num%270===0){
	// 		ctx.translate(-(y+length/2),(x-length/2));
	// 		drawTriangle(ctx,x,y,length,color);
	// 		ctx.translate((y+length/2),-(x-length/2));
	// 	}
	// 	ctx.rotate(-rad);				
	// }

	// //画三角形
	// function drawTriangle(ctx,x,y,length,color){		
	// 	ctx.fillStyle=color;				
	// 	ctx.beginPath();
	// 	ctx.moveTo(0,0);
	// 	ctx.lineTo(length,0);
	// 	ctx.lineTo((length/2),length*Math.sin(Math.PI/3));
	// 	ctx.lineTo(0,0);
	// 	ctx.closePath();
	// 	ctx.fill();
	// } 


	//画一个等腰三角形，起点，腰长，开始角度，结束角度，颜色
	function drawIsoscelesTriangle(ctx,x,y,length,radB,radE,color){
		radB=radB*Math.PI/180;
		radE=radE*Math.PI/180;
		ctx.fillStyle=color;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x+length*Math.cos(radB),y+length*Math.sin(radB));
		ctx.lineTo(x+length*Math.cos(radE),y+length*Math.sin(radE));
		ctx.closePath();
		ctx.fill();
	}
	//画二维直角坐标系
	function drawCoordinate(ctx,originX,originY,lengthX,lengthY,color){
		drawLine(ctx,originX,originY,originX,originY-lengthY,1,color);
		drawLine(ctx,originX,originY,lengthX-originX,originY,1,color);
		drawIsoscelesTriangle(ctx,originX,originY-lengthY,10,60,120,color);
		drawIsoscelesTriangle(ctx,lengthX-originX,originY,10,150,210,color);
		
		// addTringle(ctx,originX,originY-lengthY,10,180,color);
		// addTringle(ctx,lengthX-originX,originY,10,270,color);
	}

// 	var scores=[90,89,55,76,88,83,100,90,91,92,91.5];
// 	drawBrokenLine(scores);
// 	var canvas=document.getElementById("canvas"),
// 			ctx=canvas.getContext('2d');
// 	ctx.clearRect(0,0,canvas.width,canvas.height);
// 	drawPieChart();
// })();


/*
  关于canvas的变形，其实将canvas看成一个不透明的画布，上面可以画东西，而context则是一个透明的画布的感觉，
  大小与canvas一样大小，原点与canvas的原点重合，在canvas上的所有变形如旋转或者移动都是context的操作
 */