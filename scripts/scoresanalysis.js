var moduleScores=(function(){
	var datatable=null,
		db=openDatabase('MyData','','My Database',1024*1024*2),
		EventUtil={
			addHandler:function(element,type,handdler){
				if(element.addEventListener){
					element.addEventListener(type,handdler,false);
				}else if(element.attachEvent){
					element.attachEvent("on"+type,handdler);
				}else{
					element["on"+type]=handdler;
				}
			},
			removeHandler:function(element,type,handdler){
				if(element.removeEventListener){
					element.removeEventListener(type,handdler,false);
				}else if(element.detachEvent){
					element.detachEvent("on"+type,handdler);
				}else{
					element["on"+type]=null;
				}
			},
			getEvent:function(event){
				return event?event:window.event;
			},
			getTarget:function(event){
				return event.target||event.srcElement;
			}
		},
		ClassUtil={
			hasClass:function(node,classname){
				var classnames=node.className.split(' '),
					j;
				for(j=0;j<classnames.length;j++){
					if(classname===classnames[j]){
						return true;
					}
				}
				return false;
			},
			addClass:function(node,classname){
				var classnames=node.className.split(' '),
					j;
				for(j=0;j<classnames.length;j++){
					if(classname===classnames[j]){
						break;
					}
				}
				if(j===classnames.length){
					node.className+=(" "+classname);
				}
			},
			removeClass:function(node,classname){
				var classnames=node.className.split(' '),
					j;
				for(j=0;j<classnames.length;j++){
					if(classname===classnames[j]){
						if(0===j){
							node.className=node.className.toString().replace(classname,'');
						}else{
							node.className=node.className.toString().replace(' '+classname,'');
						}
				
					}
				}
			}
		};
	function showCanvascard(element,x,y){
		var tr=element.parentNode,
			ths=tr.childNodes,
			scores=[],
			name,
			canvascard=document.getElementById("canvascard");
		canvascard.style.top=y+"px";
		canvascard.style.left=x+"px";
		//alert(canvascard.style.top+","+canvascard.style.left);
		canvascard.style.display="block";
		if(ClassUtil.hasClass(element,"viewanaly")){
			for(var i=0,max=ths.length;i<max;i++){
				if(ClassUtil.hasClass(ths[i],"stu_score")){
					scores[scores.length]=Number(ths[i].innerText);
				}else if(ClassUtil.hasClass(ths[i],"stu_name")){
					name=ths[i].innerText;
				}
			}
	 		drawBrokenLine(scores,name);
		}else if(ClassUtil.hasClass(element,"transcripts_name")){
			var tranid=element.getAttribute("data-tranid"),
				tds=document.getElementsByClassName("stu_score");
			name=element.innerText;
			for(var i=0,max=tds.length;i<max;i++){
				if(tds[i].getAttribute("data-tranid")===tranid){
					scores[scores.length]=Number(tds[i].innerText);
				}
			}
			drawPieChart(scores,name);
		}
		
	}
	//剩下所有的数据除了表头剩下
	function removeAllData(){
		//去掉datatable的所有子节点
		for(var i=datatable.childNodes.length-1;i>=0;i--){
			datatable.removeChild(datatable.childNodes[i]);
		}
		var frag=document.createDocumentFragment(),
			tr=document.createElement('tr'),
			th2=document.createElement('th'),
			th3=document.createElement('th');
		th2.innerHTML="学号";
		th3.innerHTML="姓名";
		frag.appendChild(th2);
		frag.appendChild(th3);
		//取出成绩单表头
		db.transaction(function(tx){
			tx.executeSql('SELECT * FROM TranInfo',[],function(tx,rs){
				for(var i=0;i<rs.rows.length;i++){
					var th=document.createElement('th'),
						input=document.createElement('input');
					th.innerText=rs.rows.item(i).transcripts;
					th.setAttribute("data-tranid",rs.rows.item(i).tranid);
					ClassUtil.addClass(th,"transcripts_name");
					ClassUtil.addClass(th,"clickable");
					frag.appendChild(th);
				}
				tr.appendChild(frag);
			});
		});
		datatable.appendChild(tr);
	}

	//row是学生信息
	function showData(row){
		var frag=document.createDocumentFragment(),
			tr=document.createElement('tr'),
			td2=document.createElement('td'),
			td3=document.createElement('td');
		td2.innerHTML=row.stuid;
		td2.className="viewanaly";
		td3.innerHTML=row.name;
		td3.setAttribute("data-stuid",row.stuid);
		ClassUtil.addClass(td3,"stu_name");
		ClassUtil.addClass(td3,"clickable");
		frag.appendChild(td2);
		frag.appendChild(td3);
		//取出每个学生信息的同时取出相应的所有成绩
		db.transaction(function(tx){
			var transcripts=datatable.getElementsByClassName("transcripts_name");
			for(var i=0,max=transcripts.length;i<max;i++){
				(function(num){
					var tranid=transcripts[num].getAttribute("data-tranid");
					tx.executeSql('SELECT scores FROM ScoresInfo WHERE stuid=? AND tranid=?',[row.stuid,tranid],function(tx,rs){
						var td=document.createElement('td');
						td.setAttribute("data-stuid",row.stuid);
						td.setAttribute("data-tranid",tranid);
						ClassUtil.addClass(td,"stu_score");
						ClassUtil.addClass(td,"clickable");						
						//alert(row.stuid+","+tranid);
						//alert(rs.rows.item.length);
						if(rs.rows.length===0){
							tx.executeSql('INSERT INTO ScoresInfo VALUES(?,?,?)',[td.getAttribute("data-stuid"),td.getAttribute("data-tranid"),0]);
							td.innerHTML="0";
						}else{
					 		td.innerHTML=rs.rows.item(0).scores;
						}
						tr.appendChild(td);
					},function(tx,error){
						//alert(error.source+"::"+error.message);
					});
				})(i);				
			}		
			tr.appendChild(frag);
		});
		datatable.appendChild(tr);
	}

	//取出所有数据
	function showAllData(){
		db.transaction(function(tx){
			//如果3个表都不存在则创建
			tx.executeSql('CREATE TABLE IF NOT EXISTS StuInfo(stuid unique,name TEXT)',[]);
			tx.executeSql('CREATE TABLE IF NOT EXISTS TranInfo(tranid unique,transcripts TEXT)',[]);
			tx.executeSql('CREATE TABLE IF NOT EXISTS ScoresInfo(stuid INTEGER,tranid TEXT,scores REAL)',[]);
			
			tx.executeSql('SELECT * FROM StuInfo',[],function(tx,rs){

				//取出所有数据之前先清除掉所有已经存在的数据
				removeAllData();
				
				for(var i=0;i<rs.rows.length;i++){
					showData(rs.rows.item(i));
				}
			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
	}
	function addStuInfo(stuid,name){
		db.transaction(function(tx){
			//alert("tx:"+tx);
			tx.executeSql(' INSERT  INTO  StuInfo  VALUES(?, ?)',[stuid,name],function(tx,rs){

			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
	}
	function delStuInfo(){
		var stuid=document.getElementById("stuid").value,
			name=document.getElementById("name").value;
		db.transaction(function(tx){
			//alert("tx:"+tx);
			tx.executeSql(' DELETE  FROM  StuInfo  WHERE stuid=?',[stuid],function(tx,rs){

			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
		document.getElementById("stuid").value="";
		document.getElementById("name").value="";
		showAllData();
	}
	function updateStuInfo(stuid,name){
		db.transaction(function(tx){
			tx.executeSql('UPDATE StuInfo set name=?  WHERE stuid=?;',[name,stuid],function(tx,rs){

			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
	}
	function saveStuInfo(){
		var stuid=document.getElementById("stuid").value,
			name=document.getElementById("name").value;
		addStuInfo(stuid,name);
		document.getElementById("stuid").value="";
		document.getElementById("name").value="";
		showAllData();
	}
	function addTranInfo(tranid,transcripts){
		db.transaction(function(tx){
			tx.executeSql('INSERT INTO TranInfo VALUES(?,?)',[tranid,transcripts],function(tx,rs){

			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
	}
	function delTranInfo(){
		var transcripts=document.getElementById("transcripts").value,
			time=new Date().getTime().toString();
		db.transaction(function(tx){
			//alert("tx:"+tx);
			tx.executeSql(' DELETE  FROM  TranInfo  WHERE transcripts=?',[transcripts],function(tx,rs){

			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
		document.getElementById("transcripts").value="";
		showAllData();
	}
	function updateTranInfo(tranid,transcripts){
		db.transaction(function(tx){
			tx.executeSql('UPDATE TranInfo set transcripts=?  WHERE tranid=?;',[transcripts,tranid],function(tx,rs){

			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
	}
	function saveTranInfo(){
		var transcripts=document.getElementById("transcripts").value,
			time=new Date().getTime().toString();
		addTranInfo(time,transcripts);
		document.getElementById("transcripts").value="";
		showAllData();
	}
	function updateScoresInfo(stuid,tranid,scores){
		db.transaction(function(tx){
			tx.executeSql('UPDATE ScoresInfo set scores=?  WHERE stuid=? AND tranid=?;',[scores,stuid,tranid],function(tx,rs){

			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
	}
	function saveAll(){
		var change=datatable.getElementsByClassName("read-write");
		for(var i=change.length-1;i>=0;i--){
			if(ClassUtil.hasClass(change[i],"transcripts_name")){
				var tranid=change[i].getAttribute("data-tranid"),
					transcripts=change[i].innerText.toString();
				//alert("tranid:"+tranid+",transcripts:"+transcripts);
				updateTranInfo(tranid,transcripts);
				ClassUtil.removeClass(change[i],"read-write");
			}else if(ClassUtil.hasClass(change[i],"stu_name")){
				var stuid=change[i].getAttribute("data-stuid"),
					name=change[i].innerText.toString();
				updateStuInfo(stuid,name);
				ClassUtil.removeClass(change[i],"read-write");
			}else if(ClassUtil.hasClass(change[i],"stu_score")){
				var stuid=change[i].getAttribute("data-stuid"),
					tranid=change[i].getAttribute("data-tranid"),
					scores=change[i].innerText.toString();
				updateScoresInfo(stuid,tranid,scores);
				ClassUtil.removeClass(change[i],"read-write");
			}
		}
	}

	function getElementLeft(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}

　　　　return actualLeft;
　　}

　　function getElementTop(element){
　　　　var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
　　　　}

　　　　return actualTop;
　　}
	function addEvents(){
		datatable=document.getElementById("datatable");
		EventUtil.addHandler(document,"click",function(event){
			event=EventUtil.getEvent(event);
			var target=EventUtil.getTarget(event);
			switch(target.id){
				case "savestu":
					saveStuInfo();
					break;
				case "savetran":
					saveTranInfo();
					break;
				case "saveall":
					saveAll();
					break;
				case "delstu":
					delStuInfo();
					break;
				case "deltran":
					delTranInfo();
					break;
			}
		});
		EventUtil.addHandler(datatable,"click",function(event){
			event=EventUtil.getEvent(event);
			var target=EventUtil.getTarget(event);
			if(ClassUtil.hasClass(target,"clickable")){
				ClassUtil.addClass(target,"read-write");
			}
		});
		EventUtil.addHandler(document,"mouseover",function(event){
			event=EventUtil.getEvent(event);
			var target=EventUtil.getTarget(event);
			if(ClassUtil.hasClass(target,"viewanaly")){
				var x=getElementLeft(target),
					y=getElementTop(target)-document.getElementById("canvas").height-22;
				showCanvascard(target,x,y);
			}else if(ClassUtil.hasClass(target,"transcripts_name")){
				var x=getElementLeft(target),
					y=getElementTop(target)-document.getElementById("canvas").height-22;
				showCanvascard(target,x,y);
			}else if(target.id==="canvascard"||target.id==="canvas"){

			}else{
				var canvascard=document.getElementById("canvascard");
				canvascard.style.display="none";
			}
		});
	}
	return{
		init:function(){
			showAllData();
			addEvents();
		}
	}
})();
moduleScores.init();



//数据库地址：C:\Users\Administrator\AppData\Local\Google\Chrome\User Data\Default\databases