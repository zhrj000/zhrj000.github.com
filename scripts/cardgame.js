Mixiu.MatchingGame=(function(){
	var deck=[
			'cardAK','cardAK',
			'cardAQ','cardAQ',
			'cardAJ','cardAJ',
			'cardBK','cardBK',
			'cardBQ','cardBQ',
			'cardBJ','cardBJ',
		],
		elapsedTime=0,
		timer,
		cards=document.getElementById("cards");

	function createCards(){
		var card=Mixiu.ClassUtil.getElementsByClassName(cards,"card")[0],
			newcard,
			pattern,
			back;
			cardwidth=Mixiu.StyleUtil.getCssValue(card,"width").replace("px",""),
			cardheight=Mixiu.StyleUtil.getCssValue(card,"height").replace("px","");
		for(var i=1;i<12;i++){
			newcard=card.cloneNode(true);
			cards.appendChild(newcard);
			newcard.style.left=(parseInt(cardwidth)+20)*(i%4)+"px";
			newcard.style.top=(parseInt(cardheight)+20)*Math.floor(i/4)+"px";
			pattern=deck.pop();
			back=Mixiu.ClassUtil.getElementsByClassName(newcard,"back")[0];
			Mixiu.ClassUtil.addClass(back,pattern);
			newcard.setAttribute("data-pattern",pattern);
		}
		card.style.left=0;
		card.style.top=0;
		pattern=deck.pop();
		back=Mixiu.ClassUtil.getElementsByClassName(card,"back")[0];
		Mixiu.ClassUtil.addClass(back,pattern);
		card.setAttribute("data-pattern",pattern);
	}
	function shuffle(){
		return 0.5-Math.random();
	}
	function selectCard(card){
		if(Mixiu.ClassUtil.getElementsByClassName(cards,"card-flipped").length>1){
			return;
		}
		Mixiu.ClassUtil.addClass(card,"card-flipped");
		if(Mixiu.ClassUtil.getElementsByClassName(cards,"card-flipped").length==2){
			setTimeout(checkPattern,700);
		}
	}
	function checkPattern(){
		var flippedcard=Mixiu.ClassUtil.getElementsByClassName(cards,"card-flipped")[0],
			anotherflippedcard=Mixiu.ClassUtil.getElementsByClassName(cards,"card-flipped")[1];
		if(isMatchPattern()){
			Mixiu.ClassUtil.removeClass(flippedcard,"card-flipped");
			Mixiu.ClassUtil.addClass(flippedcard,"card-removed");
			Mixiu.ClassUtil.removeClass(anotherflippedcard,"card-flipped");
			Mixiu.ClassUtil.addClass(anotherflippedcard,"card-removed");
			isGameOver();
		}else{
			Mixiu.ClassUtil.removeClass(flippedcard,"card-flipped");
			Mixiu.ClassUtil.removeClass(anotherflippedcard,"card-flipped");
		}
	}
	function isMatchPattern(){
		var flippedcard=Mixiu.ClassUtil.getElementsByClassName(cards,"card-flipped"),
			pattern=flippedcard[0].getAttribute("data-pattern"),
			anotherpattern=flippedcard[1].getAttribute("data-pattern");
		return(pattern===anotherpattern);
	}
	function isGameOver(){
		if(Mixiu.ClassUtil.getElementsByClassName(cards,"card-removed").length===Mixiu.ClassUtil.getElementsByClassName(cards,"card").length){
			gameOver();
		}
	}
	function gameOver() {
		var doc=document,
			lastScore,
			lastScoreObj,
			lastElapseTime,
			minute,
			second,
			curmonth,
			curday,
			curyear,
			curhours,
			curminutes,
			cursecond,
			now,
			currentTime,
			curobj;
		//停止计时
		clearTimeout(timer);
		//显示花费时间
		doc.getElementById("score").innerHTML=doc.getElementById("elapsed-time").innerHTML;

		lastScore=localStorage.getItem("last-score");
		lastScoreObj=JSON.parse(lastScore);
		if(lastScoreObj===null){
			console.log("null");
			lastScoreObj={"savedTime":"no record","score":0};
			console.log(lastScoreObj.savedTime);
		}
		//上次的成绩
		lastElapseTime=lastScoreObj.score;
		minute=Math.floor(lastElapseTime/60),
		second=lastElapseTime%60;
		if(minute<10)minute="0"+minute;
		if(second<10)second="0"+second;
		doc.getElementById("last-score").innerHTML=(minute+":"+second);
		//上次成绩的时间
		doc.getElementById("saved-time").innerHTML=lastScoreObj.savedTime;

		if(lastElapseTime===0||elapsedTime<lastElapseTime){
			var ribbon=Mixiu.ClassUtil.getElementsByClassName(doc,"ribbon")[0];
			Mixiu.ClassUtil.removeClass(ribbon,"hide");
		}
		//当前日期时间
		currentTime=new Date();
		curmonth=currentTime.getMonth()+1;
		curday=currentTime.getDate();
		curyear=currentTime.getFullYear();
		curhours=currentTime.getHours();
		curminutes=currentTime.getMinutes();
		if(curminutes<10)curminutes="0"+curminutes;
		cursecond=currentTime.getSeconds();
		if(cursecond<10)cursecond="0"+cursecond;
		now=curday+"/"+curmonth+"/"+curyear+" "+curhours+":"+curminutes+":"+cursecond;
		curobj={"savedTime":now,"score":elapsedTime};
		localStorage.setItem("last-score",JSON.stringify(curobj));					

		Mixiu.ClassUtil.removeClass(doc.getElementById("popup"),"hide");
		Mixiu.EventUtil.addHandler(doc.getElementById("replay"),"click",function(event){
			gameReplay();
		});

	}
	function gameReplay(){
		var removedcards=Mixiu.ClassUtil.getElementsByClassName(cards,"card-removed"),
			i;
		for(i=removedcards.length-1;i>=0;i--){
			Mixiu.ClassUtil.removeClass(removedcards[i],"card-removed");
		}
		Mixiu.ClassUtil.addClass(document.getElementById("popup"),"hide");
	}
	function counterTimer(){
		elapsedTime++;
		var minute=Math.floor(elapsedTime/60),
			second=elapsedTime%60;
		if(minute<10)minute="0"+minute;
		if(second<10)second="0"+second;
		document.getElementById("elapsed-time").innerHTML=(minute+":"+second);
		timer=setTimeout(arguments.callee,1000);
	}
	return{
		init:function(){
			deck.sort(shuffle);
			Mixiu.EventUtil.addHandler(cards,"click",function(event){
				var event=Mixiu.EventUtil.getEvent(event),
					target=Mixiu.EventUtil.getTarget(event),
					card=target.parentNode;
				if(Mixiu.ClassUtil.hasClass(card,"card")){
					selectCard(card);
				}	
			});
			createCards();
			timer=setTimeout(counterTimer,1000);
		}
	}

})();
Mixiu.MatchingGame.init();