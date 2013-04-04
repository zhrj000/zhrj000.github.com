(function(){

	var $=function(){
		var node=null,
			name='';
		if(arguments.length===1){
			node=document;
			name=arguments[0];
		}else{
			node=arguments[0];
			name=arguments[1];
		}
		return node.getElementById(name);
		
	},
	object=function (o){
		var F=function(){};
		F.prototype=o;
		return new F();
	},
	inheritPrototype=function (subType,superType){
		var prototype=object(superType.prototype);
		prototype.constructor=subType;
		subType.prototype=prototype;
	};


	//Canvas画布
	function Canvas(canvas){
		this.canvas=canvas;
		this.ctx=canvas.getContext('2d');
	}
	Canvas.prototype={
		//画圆（起点坐标x、y,半径radius，填充颜色color）
		drawCircle:function(x,y,radius,color){
			this.ctx.fillStyle=color;
			this.ctx.beginPath();
			this.ctx.arc(x,y,radius,0,Math.PI*2,true);
			this.ctx.closePath();
			this.ctx.fill();
		},
		drawLine:function(xb,yb,xe,ye,thickness,color){
			this.ctx.beginPath();
			this.ctx.moveTo(xb,yb);
			this.ctx.lineTo(xe,ye);
			this.ctx.lineWidth=thickness+"px";
			this.ctx.strokeStyle=color;
			this.ctx.closePath();
			this.ctx.stroke();
		},
		drawText:function(ctx,x,y,text,color){
			this.ctx.font="14px Arial";
			this.ctx.fillStyle=color;
			this.ctx.fillText(text,x,y);
		},
		drawFan:function(ctx,x,y,length,radB,radE,color){		
			this.ctx.fillStyle=color;
			this.ctx.beginPath();
			this.ctx.moveTo(x,y);
			this.ctx.arc(x,y,length,Math.PI/180*radB,Math.PI/180*radE,false);
			this.ctx.closePath();
			this.ctx.fill();			
		},
		drawRectangle:function(ctx,x,y,width,height,color){
			this.ctx.fillStyle=color;				
			this.ctx.beginPath();
			this.ctx.moveTo(x,y);
			this.ctx.lineTo(x+width,y);
			this.ctx.lineTo(x+width,y+height);
			this.ctx.lineTo(x,y+height);
			this.ctx.closePath();
			this.ctx.fill();
		}
	}

	
	
	function Scorescanvas(canvas){
		Canvas.call(this,canvas);
	}
	inheritPrototype(Scorescanvas,Canvas);


	Scorescanvas.prototype.drawBrokenLine=function(scores,name){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.drawCoordinate(this.ctx,10,290,470,240,"#fff");

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
		this.drawText(ctx,10,20,name+"同学的成绩折线图","#FFF");

		//画一根及格线
		this.drawLine(ctx,10,290-pointL*60,460,290-pointL*60,1,"#FF0000");
		this.drawText(ctx,10,290-pointL*60,"pass line","#FF0000");
		//画分数线
		for(var i=0;i<count;i+=1){
			x[i]=(i+1)*boutL+10,
			y[i]=290-scores[i]*pointL;
			this.drawCircle(ctx,x[i],y[i],4,"#49B4F2");
			this.drawText(ctx,x[i],y[i],scores[i],"#fff");
			if(i!==0){
				if(y[i]>y[i-1]){
					this.drawLine(ctx,x[i],y[i],x[i-1],y[i-1],1,"#49B4F2");
				}else{
					this.drawLine(ctx,x[i],y[i],x[i-1],y[i-1],1,"#49B4F2");
				}
				
			}
		}
	}

	var scorescanvas=new Scorescanvas($('canvas'));
	scorescanvas.test1();
	scorescanvas.test2();




}());