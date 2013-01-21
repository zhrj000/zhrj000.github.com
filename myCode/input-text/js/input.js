var publicUtil={

	addHandler:function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,true);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	},

	getElementsByClassName:function(node,classname){
		if(node.getElementsByClassName){
			return node.getElementsByClassName(classname);
		}else{
			var result=[],
				elements=node.getElementsByTagName("*"),
				classnames=[],
				i,
				j;
			for(i=0;i<elements.length;i++){
				classnames=elements[i].className.split(' ');
				for(j=0;j<classnames.length;j++){
					if(classname===classnames[j]){
						result[result.length]=elements[i];
					}
				}
			}
		}
		return result;
	}


};


var inputMod=(function(){

	var form=null,
		input_txt='ui-input-txt';

	function getLabel(fors){
		var ele=form.getElementsByTagName("label");
		for(var i=0,max=ele.length;i<max;i++){
			//alert(ele[i].getAttribute("for"));    //ie6不行。。。为啥
			//alert(ele[i].getAttributeNode("for").value);  //这个就可以了
			if(ele[i].getAttributeNode("for").value===fors){
				return ele[i];
			}
		}
		return null;
	}

	function inputHandler(event){
		event=event||window.event;
		var target=event.target||event.srcElement,
			label=getLabel(target.id);
		if((' '+target.className+' ').replace(" /[\n\t\r]/g"," ").indexOf(" "+input_txt+" ")!==-1&&label){
			switch(event.type){
				case "keypress":
					label.style.display="none";
					break;
				case "blur":            //blur focus不冒泡的，怎么事件委托？非ie用捕获，ie用focusout
					if(target.value===''){
						label.style.display="";
					}
					break;
				case "focusout":
					if(target.value===''){
						label.style.display="";
					}
					break;
				case "focus":            //blur focus不冒泡的，怎么事件委托？非ie用捕获，ie用focusout
					if(target.value===''){
						label.style.color="red";
					}
					break;
				case "focusin":
					if(target.value===''){
						label.style.color="red";
					}
					break;

			}
		}
		
	}
	function addInputEvent(){
		alert(form.attachEvent);
		publicUtil.addHandler(form,"keypress",inputHandler);
		if(form.attachEvent){                         //解决blur focus不冒泡，上面addEventListerner参数变成true了
			publicUtil.addHandler(form,"focusin",inputHandler);
			//publicUtil.addHandler(form,"focusout",inputHandler);
		}else{
			publicUtil.addHandler(form,"focus",inputHandler);
			//publicUtil.addHandler(form,"blur",inputHandler);
		}
	}
	
	return{
		init:function(id){
			form=document.getElementById(id);
			addInputEvent();
		}
	}

})();

 inputMod.init("form-1");

/*
* ------------with jq
*/
var inputMod2=(function(){
	var form=null,
		input_txt="ui-input-txt";

	function inputHandler(event){
		var target=$(event.target),
			label=form.find("label[for="+target.attr("id")+"]");
		//console.log(target.attr('id'));
		if(target.hasClass(input_txt)){
			switch(event.type){
				case "keypress":
					label.hide();
					break;
				case "focusout":
					if(target.attr("value")===""){
						label.show();						
					}
					break;

			}
		}

	}

	return{
		init:function(id){
			form=$("#"+id);
			form.on("keypress",inputHandler);
			form.on("focusout",inputHandler);
		}
	}

})();
//inputMod2.init("form-1");