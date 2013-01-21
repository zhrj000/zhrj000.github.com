var Mod=(function(ClassUtil){

	function hasClass(node,classname){
		if((" "+node.className+" ").replace(/[\n\t\r]/g," ").indexOf(" "+classname+" ")!==-1){
			return true;
		}else{
			return false;
		}
	}

	function getByClass(node,classname){
		if(node.getElementsByClassName){
			return node.getElementsByClassName(classname);
		}else{
			var result=[],
				elements=node.getElementsByTagName("*"),
				classnames=[],
				i,
				j;
			for(i=0;i<elements.length;i+=1){
				if(hasClass(elements[i],classname)){
					result[result.length]=elements[i];
				}
			}
		}
		return result;
	}

	function getNameType(name){
		name=name.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,'');
		//alert(name[0]);   //ie7以下不支持方括号访问字符串里的字符,改用charAt获取
		//alert(name.charAt(0));
		if(name.charAt(0)==="#"){
			return{
				type:0,
				name:name.slice(1)
			}
		}else if(name.charAt(0)==="."){
			return{
				type:1,
				name:name.slice(1)
			}
		}else{
			return{
				type:2,
				name:name
			}
		}
	}

	ClassUtil.$=function(){
		var node=null,
			name='',
			obj='';
		if(arguments.length===1){
			node=document;
			name=arguments[0];
		}else{
			node=arguments[0];
			name=arguments[1];
		}
		obj=getNameType(name);
		switch (obj.type){
			case 0:
				return document.getElementById(obj.name);
				break;
			case 1:
				return getByClass(node,obj.name);
				break;
			case 2:
				return node.getElementsByTagName(obj.name);
				break;
			default:
				return null;
		}
	};

	ClassUtil.hasClass=hasClass;

	ClassUtil.addClass=function(node,classname){
		if(!hasClass(node,classname)){
			node.className=(node.className+(" "+classname)).replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,'');
		}
	};

	ClassUtil.removeClass=function(node,classname){
		if(hasClass(node,classname)){
			node.className=(" "+node.className+" ").replace(/[\n\t\r]/g," ").replace(" "+classname+" "," ").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,'');
		}
	};

	return ClassUtil;
}(Mod||{}));


// //测试
// test('Mod.getEle()', function() {
//   //列举各种可能的情况，注意使用 ! 保证表达式符合应该的逻辑
//   ok(Mod.getEle("#qunit-tests"), ' success');
//   //ok(!Mod.addHandler(), '"2"不是一个数字');
// })
