(function () {
	var jsonText = '[{"sid":"01","pid":"0","letter":"首页","url":"Default.aspx","img":"images/logo.png","lv":"1"},{"sid":"02","pid":"0","letter":"关于","url":"About.aspx","img":"images/logo.png","lv":"1"},{"sid":"03","pid":"0","letter":"报表设置","url":"page.html","img":"images/logo.png","lv":"1"},{"sid":"04","pid":"0","letter":"系统监控","url":"page.html","img":"images/logo.png","lv":"1"},{"sid":"05","pid":"0","letter":"分机报表","url":"page.html","img":"images/logo.png","lv":"1"},{"sid":"011","pid":"01","letter":"1客户报表","url":"page.html","img":"images/logo.png","lv":"2"},{"sid":"012","pid":"01","letter":"1录音报表","url":"page.html","img":"images/logo.png","lv":"2"},{"sid":"06","pid":"0","letter":"高级设置aaa","url":"page.html","img":"images/logo.png","lv":"1"},{"sid":"041","pid":"04","letter":"22户报表","url":"page.html","img":"images/logo.png","lv":"2"},{"sid":"042","pid":"04","letter":"22音报表","url":"page.html","img":"images/logo.png","lv":"2"},{"sid":"0411","pid":"041","letter":"gfgs4报表","url":"page2.aspx","img":"images/logo.png","lv":"3"},{"sid":"0421","pid":"042","letter":"2222报表","url":"page.html","img":"images/logo.png","lv":"3"},{"sid":"013","pid":"01","letter":"1服务评价","url":"page.html","img":"images/logo.png","lv":"2"},{"sid":"021","pid":"02","letter":"2设置","url":"page.html","img":"images/logo.png","lv":"2"},{"sid":"022","pid":"02","letter":"2基本设置","url":"page.html","img":"images/logo.png","lv":"2"},{"sid":"0111","pid":"011","letter":"3333","url":"About.aspx","img":"images/logo.png","lv":"3"},{"sid":"0112","pid":"011","letter":"54dfg","url":"page1.aspx","img":"images/logo.png","lv":"3"},{"sid":"031","pid":"03","letter":"23333评价","url":"page.html","img":"images/logo.png","lv":"2"},{"sid":"032","pid":"03","letter":"23333置","url":"page.html","img":"images/logo.png","lv":"2"},{"sid":"033","pid":"03","letter":"233333设置","url":"page.html","img":"images/logo.png","lv":"2"}]';
	//菜单类
	function Navigation(classname, idname) {
		this.classname = classname;
		this.idname = idname;
		this.menu = [];
		if (typeof this.createNav != "function") {
		    Navigation.prototype.createNav = function () {
		        var ul = document.createElement("ul"),
					i = 0,
					max;
		        for (i = 0, max = this.menu.length; i < max; i += 1) {
		            ul.appendChild(createLi(this.menu[i]));
		        }
		        ul.className = this.classname;
		        ul.id = this.idname;
		        if (this.menu[0].lv !== "1") {
		            ul.style.display = "none";
		        }
		        return ul;
		    };
		}
	}
	//创建菜单项
	function createLi(menu) {
	    var li = document.createElement("li"),
			a = document.createElement("a"),
			lv = Number(menu.lv),
		textNode = document.createTextNode(menu.letter);
		a.href = menu.url;
		a.title = menu.sid;
		a.style.backgroundImage = "url(" + menu.img + ")";
		a.appendChild(textNode);
		li.appendChild(a);
		Mixiu.EventUtil.addHandler(a, "mouseover", function (event) {		//给每个菜单项添加mouseover事件
		    var that = Mixiu.EventUtil.getTarget(Mixiu.EventUtil.getEvent(event));

		    if (that.className !== "nav_select") {
		        clearNodeClass(that.parentNode);
		        that.className = "nav_select";
		        hideChildNav(lv); 	//隐藏所有子菜单
		        if (document.getElementById(that.title)) {	//显示当前菜单项的子菜单
		            document.getElementById(that.title).style.display = "block";
		        }
		    }

		});
		Mixiu.EventUtil.addHandler(a, "click", function (event) {		//给每个菜单项添加mouseover事件
		    var that = Mixiu.EventUtil.getTarget(Mixiu.EventUtil.getEvent(event));
		    if (that.href !== "") {
		        CookieUtil.unset("nav_title", that.title);
		        CookieUtil.set("nav_title", that.title);
		    }
		});
		return li;
	}
	//清除未选中菜单项类名
	function clearNodeClass(node) {
		node.firstChild.className = "";
		var temp = node.previousSibling;
		while (temp != null) {
		    temp.firstChild.className = "";
		    temp = temp.previousSibling;
		}
		temp = node.nextSibling;
		while (temp != null) {
		    temp.firstChild.className = "";
		    temp = temp.nextSibling;
		}
	}
	//隐藏子孙菜单
	function hideChildNav(lv) {
		var nav = Mixiu.EventUtil.getElementsByClassName(document, setNavClassName(lv + 1)),
			i;
		if (nav.length > 0) {
		    i = nav.length;
		    while (i--) {
		        clearNodeClass(nav[i].firstChild); //隐藏的同时去掉菜单项的标志类
		        nav[i].style.display = "none";
		    }
		    lv = lv + 1;
		    arguments.callee(lv); //递归，如果还有子菜单，子菜单隐藏
		}
	}

	//设置菜单类名
	function setNavClassName(lv) {
		 return "nav_" + lv;
	}

	//
	function getInitTitle(navtree, navTitle) {
		var nav = Mixiu.EventUtil.getElementByIdName(navtree, navTitle);
		if (nav) {
		    navTitle = nav.firstChild.firstChild.title;
		    arguments.callee(navtree, navTitle);
		}
		return navTitle;
	}

	//
	function hoverInit(navtree, navtitle) {
		if (!navtitle) {
		    navtitle = getInitTitle(navtree, navtree.firstChild.firstChild.firstChild.title);
		    navtitle = Mixiu.EventUtil.getElementByIdName(navtree, navtitle).firstChild.firstChild.title;

		    CookieUtil.set("nav_title", navtitle);
		}
		var nav = Mixiu.EventUtil.getElementByTitleName(navtree, navtitle);
		if (nav) {
		    nav.parentNode.parentNode.style.display = "block";
		    nav.className = "nav_select";
		    arguments.callee(navtree, nav.parentNode.parentNode.id);
		}


	}
	 /* p=parentNode, c=childNode */

	function contains(p, c) {

		return p.contains ? p != c && p.contains(c) : !!(p.compareDocumentPosition(c) & 16);

	}


	/* e即为事件，target即为绑定事件的节点 */

	function fixedMouse(e, target) {

		var related,

        type = e.type.toLowerCase(); //这里获取事件名字

		if (type == 'mouseover') {

		    related = e.relatedTarget || e.fromElement;

		} else if (type = 'mouseout') {

		    related = e.relatedTarget || e.toElement;

		} else return true;

		return related && related.prefix != 'xul' && !contains(target, related) && related !== target;

	}

	function aboutHref(node) {
		var href = location.href.toString(),
		    elements = node.getElementsByTagName("*"),
			i = elements.length;
		while (i--) {
		    if (href.indexOf(elements[i].href) !== -1) {
		        CookieUtil.set("nav_title", elements[i].title);
		        console.log("haskjfashgkjas:  "+elements[i].title+",,,href="+href);
		        return;
		    }
		}
	}


	/*创建一整棵navTree，
	json串中，每个对象的sid属性作为节点的a的title值
	拥有相同pid的对象生成一个菜单，pid作为生成菜单的id，
	每个菜单的id与其父级菜单项的title相对应，同个层次的菜单有相同的类名
	*/
	function createNavTree(jsonText, classname) {
		var object = JSON.parse(jsonText),
			navTree = document.createElement("div"),
			i = 0,
			max,
			i = object.length,
			curPid = -9999, 	//-9999时表示当前菜单无效
			navNode,
			navBranch;
		navTree.className = classname;
		for (i = 0, max = object.length; i < max; i += 1) {

		    navNode = object[i];
		    //出现新pid，即不属于同个菜单，将之前生成菜单Navigation对象插入到navTree中
		    if (navNode.pid !== curPid) {
		        if (curPid !== -9999) {
		            //每次将菜单插入到比它小一个等级的菜单的前面
		            var nextNode = Mixiu.EventUtil.getElementsByClassName(navTree, setNavClassName(Number(object[i - 1].lv) + 1));
		            if (nextNode.length !== 0) {
		                navTree.insertBefore(navBranch.createNav(), nextNode[0]);
		            } else {
		                navTree.appendChild(navBranch.createNav());
		            }
		        }

		        curPid = navNode.pid;

		        //如果拥有相同父元素的菜单已存在，直接插入节点
		        if (Mixiu.EventUtil.getElementByIdName(navTree, curPid)) {
		            Mixiu.EventUtil.getElementByIdName(navTree, curPid).appendChild(createLi(navNode));
		            curPid = -9999;
		        } else {	//否则创建新的菜单对象
		            navBranch = new Navigation(setNavClassName(navNode.lv), curPid);
		        }

		    }

		    //往菜单中添加菜单项
		    navBranch.menu.push(navNode);


		    //如果到了最后,添加菜单到树
		    if (i === max - 1 && curPid !== -9999) {
		        var nextNode = Mixiu.EventUtil.getElementsByClassName(navTree, setNavClassName(Number(object[i - 1].lv) + 1));
		        if (nextNode.length !== 0) {
		           navTree.insertBefore(navBranch.createNav(), nextNode[0]);
		        } else {
		            navTree.appendChild(navBranch.createNav());
		        }
		    }
		}
		aboutHref(navTree);
		hoverInit(navTree, CookieUtil.get("nav_title"));
		            
		Mixiu.EventUtil.addHandler(navTree, "mouseout", function (event) {
		    event = Mixiu.EventUtil.getEvent(event);

		    if (fixedMouse(event, this)) {

		        hideChildNav(0);
		        hoverInit(this, CookieUtil.get("nav_title"));
		    }
		});


		return navTree;
	}

	Mixiu.EventUtil.addHandler(window, "load", function () {
		document.getElementsByClassName("demoDivInner")[0].appendChild(createNavTree(jsonText, "navTree"));
	});

})();


