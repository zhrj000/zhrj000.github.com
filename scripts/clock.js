(function(){
	var timeId=setTimeout(function (){
		
			var pointer=Mixiu.getElementsByClassName(document,"pointer")[0],
				hour=Mixiu.getElementsByClassName(pointer,"hour")[0],
				second=Mixiu.getElementsByClassName(pointer,"second")[0],
				minute=Mixiu.getElementsByClassName(pointer,"minute")[0],
			hours=-new Date().getHours()*360/12-new Date().getMinutes()*360/720-new Date().getSeconds()*360/(12*60*60)-90,
			minutes=-new Date().getMinutes()*360/60-new Date().getSeconds()*360/3600-90,
			seconds=-new Date().getSeconds()*360/60-90;
			hour.style.cssText="-moz-transform:rotate("+hours+"deg);-webkit-transform:rotate("+hours+"deg);"
			minute.style.cssText="-moz-transform:rotate("+minutes+"deg);-webkit-transform:rotate("+minutes+"deg);"
			second.style.cssText="-moz-transform:rotate("+seconds+"deg);-webkit-transform:rotate("+seconds+"deg);"
			timeId=setTimeout(arguments.callee,1000);
	
	},1000);
})();