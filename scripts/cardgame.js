(function(){
	var matchingGame={};
	matchingGame.deck=[
		'cardAK','cardAK',
		'cardAQ','cardAQ',
		'cardAJ','cardAJ',
		'cardBK','cardBK',
		'cardBQ','cardBQ',
		'cardBJ','cardBJ',
	];
	matchingGame.deck.sort(shuffle);

	var cards=document.getElementById("cards");
		Mixiu.EventUtil.addHandler(cards,"click",function(event){
			var event=Mixiu.EventUtil.getEvent(event),
				target=Mixiu.EventUtil.getTarget(event),
				card=target.parentNode;
			if(Mixiu.ClassUtil.hasClass(card,"card")){
				selectCard(card);
			}	
		});
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
			pattern=matchingGame.deck.pop();
			back=Mixiu.ClassUtil.getElementsByClassName(newcard,"back")[0];
			Mixiu.ClassUtil.addClass(back,pattern);
			newcard.setAttribute("data-pattern",pattern);
		}
		card.style.left=0;
		card.style.top=0;
		pattern=matchingGame.deck.pop();
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
			cards.removeChild(flippedcard);
			Mixiu.ClassUtil.removeClass(anotherflippedcard,"card-flipped");
			Mixiu.ClassUtil.addClass(anotherflippedcard,"card-removed");
			cards.removeChild(anotherflippedcard);
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
	createCards();

})();