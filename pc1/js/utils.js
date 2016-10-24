var utils=(function(){
        var isStanderBrowser="getComputedStyle" in window;
        function jsonParse(jsonStr){
            return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
        }
        function listToArray(lisAry){
            try{
                return Array.prototype.slice.call(lisAry);
            }catch(e){
                var ary=[];
                for(var i=0;i<lisAry.length;i++){
                    ary.push(lisAry[i]);
                }
                return ary;
            }
        }
        function getRandom(n,m){
            n=Number(n);
            m=Number(m);
            if(isNaN(n)||isNaN(m)){
                return Math.random();
            }
            if(n>m){
                var temp=n;
                n=m;
                m=temp;
            }
            return Math.round(Math.random()*(m-n)+n)
        }
        function offset(ele){
            var left=null;
            var top=null;
            left=ele.offsetLeft;
            top=ele.offsetTop;
            var par=ele.offsetParent;
            while(par) {
                if (!window.navigator.userAgent.indexOf("MSIE 8")) {
                    /*  !/MSIE 8/.test(window.navigator.userAgent);*/
                    left+=ele.clientLeft;
                    top+=ele.clientTop;
                }
                left+=ele.offsetLeft;
                top+=ele.offsetTop;
                par=par.offsetParent;
            }
            return {left:left,top:top}
        }
        function win(attr,val){
            if(typeof val!=="undefined"){
                document.documentElement[attr]=val;
                document.body[attr]=val;
            }
            return document.documentElement[attr]||document.body[attr];
        }
        function prev(ele){//获取上一个元素哥哥节点
            if(isStanderBrowser){
                return ele.previousElementSibling;
            }
            var pre=ele.previousSibling;
            while(pre&&pre.nodeType!=1){
                pre=pre.previousSibling;
            }
            return pre;
        }
        function preAll(ele){//获取所有元素哥哥节点
            var ary=[];
            var pre=prev(ele);
            while(pre){
                ary.unshift(pre);
                pre=prev(pre);
            }
            return ary;
        }
        function next(ele){//获取上一个元素弟弟节点
            if(isStanderBrowser){
                return ele.nextElementSibling;
            }
            var next=ele.nextSibling;
            while(next&&next.nodeType!=1){
                next=ele.nextSibling;
            }
            return next;
        }
        function nextAll(ele){
            var ary=[];
            var nextSibling=next(ele);
            while(nextSibling){
                ary.push(nextSibling);
                nextSibling=next(nextSibling);
            }
            return ary;
        }
        function children(ele,tagName){//在所有ele元素中,我只要tagName标签
            var ary=[];
            if(isStanderBrowser){
                ary=listToArray(ele.children);
            }else{
                var nodes=ele.childNodes;//获取所有的子节点
                for(var i=0;i<nodes.length;i++){//在所有子节点内挑出节点类型为1的
                    var curNode=nodes[i];
                    if(curNode.nodeType==1){
                        ary.push(curNode);
                    }
                }
            }
            if(typeof tagName=="string"){//tagName传值了,并且是个字符串
                for(i=0;i<ary.length;i++){
                    var curEle=ary[i];//现在都是一个元素
                    if(curEle.nodeName.toLowerCase()!==tagName.toLowerCase()){
                        ary.splice(i,1);
                        i--;
                    }
                }
            }
            return ary;
        }
        function sibling(ele){//获取相邻的两个兄弟元素节点
            var ary=[];
            var pre=(prev(ele));//判断是否存在
            var next=(next(ele));
            if(pre){
                ary.push(pre);
            }
            next? ary.push(next):void 0;
            return ary;
        }
        function siblings(ele){
            return preAll(ele).concat(nextAll(ele));
        }
        function index(ele){//索引值和所有元素哥哥集合的length相等
            return preAll(ele).length;
        }
        function firstEleChild(ele){//获取第一个元素子节点
            //如果获取children的集合,长度大于0,说明至少有一个孩子
            if(isStanderBrowser){
                return ele.firstElementChild;
            }
            var chs=children(ele);
            return chs.length>0?chs[0]:null;
        }
        function lastEleChild(ele){
            if(isStanderBrowser){
                return ele.lastElementChild;
            }
            var chs=children(ele);
            return chs.length>0?chs[chs.length-1]:null;
        }
        function append(newEle,container){//向容器的末尾添加
            container.appendChild(newEle);
        }
        function prepend(newEle,container){//向容器的开头添加
            var firstChild=firstEleChild(container);
            if(firstChild){//如果第一个元素孩子存在,那么就直接插入到它前面,如果不存在,说明一个孩子都没有,那么直接appendChild到最后就可以了.
                container.insertBefore(newEle,firstChild);
            }else{
                container.appendChild(newEle);
            }
        }
        function insertBefore(newEle,oldEle){//我要把这个新元素插入到这个oldEle前面
            oldEle.parentNode.insertBefore(newEle,oldEle);//只能父级调用
        }
        function insertAfter(newEle,oldEle){
            var next=next(oldEle);
            //如果弟弟存在就直接插入到弟弟的前面,如果不存在说明我就是最后一个,就直接appendChild就可以了
            next?oldEle.parentNode.insertBefore(newEle,oldEle):oldEle.parentNode.appendChild(newEle);
        }
        function hasClass(ele,strClass){//判断ele是否含有strClass这个类
            /*先去掉strClass的收尾空格*/
            strClass=strClass.replace(/(^\s+|\s+$)/g,"");//去掉你传值的收尾空格.
            //利用传值进来的这个字符串组合成一个新的正则来验证ele.className是否符合刚刚这个正则.
            var reg=new RegExp("(^| +)"+strClass+"( +|$)");//   \s  转义了.
            return reg.test(ele.className);
        }
        function addClass(ele,strClass){
            strClass.replace(/(^ +| +$)/g,"");
            var strClassAry=strClass.split(/ +/);
            for(var i=0;i<strClassAry.length;i++){
                var curClass=strClassAry[i];
                if(!hasClass(ele,curClass)){//如果不包含这个类才添加
                    ele.className+=" "+curClass;
                }
                /*ul.classList.add   原生的,在移动端可随便用*/
            }
        }
        function removerClass(ele,strClass){//在ele的className中,移除这个strClass
            var strClassAry=strClass.replace(/(^ +| +$)/g,"").split(/ +/);//去收尾空格
            for(var i=0;i<strClassAry.length;i++){//循环移除
                var curClass=strClassAry[i];
                if(hasClass(ele,curClass)){
                    var reg=new RegExp("(^| +)"+ curClass+"( +|$)","g");
                    /*把所有能用c2,c3拼接成的正则能在className中能用匹配到的全部用" "空格字符串替换*/
                    ele.className=ele.className.replace(reg," ");
                }
            }
        }
        function getEleByClass(strClass,context){
            context = context || document;
            if (isStanderBrowser) {
                return context.getElementsByClassName(strClass);
            }
            var ary = [];
            var strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/);
            var tags = context.getElementsByTagName("*");
            for (var i = 0; i < tags.length; i++) {
                var flag = true;
                var curTag = tags[i];
                for (var j = 0; j < strClassAry.length; j++) {
                    var curClass = strClassAry[j];
                    var reg = new RegExp("(^| +)" + curClass + "( +|$)");
                    if (!reg.test(curTag.className)){
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    ary.push(curTag);
                }
            }
            return ary;
        }
        function getCss(attr){
            var val=null;
            if(isStanderBrowser){
                val=window.getComputedStyle(this,null)[attr];
            }
            else{
                if(attr=="opacity"){
                    val=this.currentStyle["filter"];
                    var reg=/^alpha\(opacity=(\d+(?:\.\d))\)$/;
                    val=reg.test(val)?reg.exec(val)[1]/100:1;
                }else{
                    val=this.currentStyle[attr];
                }
            }
            reg=/-?\d+(\.\d+)?(px|pt|em|rem|deg)?/;
            if(reg.test(val)){
                val=parseFloat(val);
            }
            return val;
        }
        function setCss(attr,val){
            if(attr=="opacity"){
                this.style.opacity=val;
                this.style.filter="alpha(opacity="+val*100+")";
                return;
            }
            if(attr=="float"){
                this.style.cssFloat=val;
                this.style.styleFloat=val;
                return;
            }
            var reg=/^(width|height|left|top|rigth|bottom|(margin|padding)(Left|Top|Rigth|Bottom)?)$/;
            if(reg.test(attr)){
                if(!isNaN(val)){
                    val+="px";
                }
            }
            this.style[attr]=val;
        }
        function setGroupCss(options){//options,保证是一个对象
            //判断options是不是一个对象已经判断过了
            //options=options||true;
            //console.log(options.toString);
            //if(options.toString()=="[object Object]"){//options.toString()   需要执行.
            //我就能保证options是一个对象{}

            for(var key in options){//原型上的不要
                if(options.hasOwnProperty(key)){
                    setCss.call(this,key,options[key]);
                }
            }
            //}

        }
        function css(ele){//根据参数的个数或者类型的不同来调用不同处理函数
            var argAry=listToArray(arguments).slice(1);
            var secondParam=arguments[1];
            var thirdParam=arguments[2];
            if(typeof secondParam=="string"){
                if(typeof thirdParam=="undefined"){
                    return  getCss.apply(ele,argAry);
                }
                return  setCss.apply(ele,argAry);
            }
            secondParam=secondParam||[];//传的值有可能是undefined.
            if(secondParam.toString()=="[object Object]"){
                //只要代码运行到这一行说明第二个参数已经传了.
                return setGroupCss.apply(ele,argAry);
                /*apply和call方法一样,就是传参方式不一样*/
            }
        }
        return {
            jsonParse:jsonParse,
            listToArray:listToArray,
            getRandom:getRandom,
            offset:offset,
            win:win,
            prev:prev,
            preAll:preAll,
            next:next,
            nextAll:nextAll,
            children:children,
            sibling:sibling,
            siblings:siblings,
            index:index,
            firstEleChild:firstEleChild,
            lastEleChild:lastEleChild,
            append:append,
            prepend:prepend,
            insertBefore:insertBefore,
            insertAfter:insertAfter,
            hasClass:hasClass,
            addClass:addClass,
            removerClass:removerClass,
            getEleByClass:getEleByClass,
            css:css
        }

    }
)();

var utilsOld={
    jsonParse:function jsonParse(jsonStr){
        return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
    },
    listToArray:function listToArray(lisAry){
        try{
            return Array.prototype.slice.call(lisAry);
        }catch(e){
            var ary=[];
            for(var i=0;i<lisAry.length;i++){
                ary.push(lisAry[i]);
            }
            return ary;
        }
    },
    getRandom:function getRandom(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n)||isNaN(m)){
            return Math.random();
        }
        if(n>m){
            var temp=n;
            n=m;
            m=temp;
        }
        return Math.round(Math.random()*(m-n)+n)
    },
    offset:function offset(ele){
        var left=null;
        var top=null;
        left=ele.offsetLeft;
        top=ele.offsetTop;
        var par=ele.offsetParent;
        while(par) {
            if (!window.navigator.userAgent.indexOf("MSIE 8")) {
                /*  !/MSIE 8/.test(window.navigator.userAgent);*/
                left+=ele.clientLeft;
                top+=ele.clientTop;
            }
            left+=ele.offsetLeft;
            top+=ele.offsetTop;
            par=par.offsetParent;
        }
        return {left:left,top:top}
    },
    win:function win(attr,val){
        if(typeof val!=="undefined"){
            document.documentElement[attr]=val;
            document.body[attr]=val;
        }
        return document.documentElement[attr]||document.body[attr];
    },
    getCss:function getCss(ele,attr){
        var val=null;
        if(window.getComputedStyle){
            val=window.getComputedStyle(ele,null)[attr];
        }
        else{
            if(attr=="opacity"){
                val=ele.currentStyle["filter"];
                var reg=/^alpha\(opacity=(\d+(?:\.\d))\)$/;
                val=reg.test(val)?reg.exec(val)[1]/100:1;
            }else{
                val=ele.currentStyle[attr];
            }
        }
        reg=/-?\d+(\.\d+)?(px|pt|em|rem|deg)?/;
        if(reg.test(val)){
            val=parseFloat(val);
        }
        return val;
    },
    setCss:function setCss(ele,attr,val){
        if(attr=="opacity"){
            ele.style.opacity=val;
            ele.style.filter="alpha(opacity="+val*100+")";
            return;
        }
        if(attr=="float"){
            ele.style.cssFloat=val;
            ele.style.styleFloat=val;
            return;
        }
        var reg=/^(width|height|left|top|rigth|bottom|(margin|padding)(Left|Top|Rigth|Bottom)?)$/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val+="px";
            }
        }
        ele.style[attr]=val;
    },
    prev:function prev(ele){//获取上一个元素哥哥节点
        if("computeStyle" in window){
            return ele.previousElementSibling;
        }
        var pre=ele.previousSibling;
        while(pre&&pre.nodeType!=1){
            pre=pre.previousSibling;
        }
        return pre;
    },
    preAll:function preAll(ele){//获取所有元素哥哥节点
        var ary=[];
        var pre=this.prev(ele);
        while(pre){
            ary.unshift(pre);
            pre=this.prev(pre);
        }
        return ary;
    },
    next:function next(ele){//获取上一个元素弟弟节点
        var next=ele.nextSibling;
        while(next&&next.nodeType!=1){
            next=ele.nextSibling;
        }
        return next;
    },
    nextAll:function nextAll(ele){
        var ary=[];
        var next=this.next(ele);
        while(next){
            ary.push(next);
            next=this.next(next);
        }
        return ary;
    },
    children:function(ele,tagName){//在所有ele元素中,我只要tagName标签
        if(ele.children){
            return ele.children;
        }
        var ary=[];
        var nodes=ele.childNodes;//获取所有的子节点
        for(var i=0;i<nodes.length;i++){//在所有子节点内挑出节点类型为1的
            var curNode=nodes[i];
            if(curNode.nodeType==1){
                ary.push(curNode);
            }
        }
        if(typeof tagName=="string"){//tagName传值了,并且是个字符串
            for(i=0;i<ary.length;i++){
                var curEle=ary[i];//现在都是一个元素
                if(curEle.nodeName.toLowerCase()!==tagName.toLowerCase()){
                    ary.splice(i,1);
                    i--;
                }
            }
        }
        return ary;
    },
    sibling:function(ele){//获取相邻的两个兄弟元素节点
        var ary=[];
        var pre=(this.prev(ele));//判断是否存在
        var next=(this.next(ele));
        if(pre){
            ary.push(pre);
        }
        next? ary.push(next):void 0;
        return ary;
    },
    siblings:function(ele){
        return this.preAll(ele).concat(this.nextAll(ele));
    },
    index:function(ele){//索引值和所有元素哥哥集合的length相等
        return this.preAll(ele).length;
    },
    firstEleChild:function(ele){//获取第一个元素子节点
        //如果获取children的集合,长度大于0,说明至少有一个孩子
        var chs=this.children(ele);
        return chs.length>0?chs[0]:null;
    },
    lastEleChild:function (ele){
        var chs=this.children(ele);
        return chs.length>0?chs[chs.length-1]:null;
    },
    append:function(newEle,container){//向容器的末尾添加
        container.appendChild(newEle);
    },
    prepend:function(newEle,container){//向容器的开头添加
        var firstChild=this.firstEleChild(container);
        if(firstChild){//如果第一个元素孩子存在,那么就直接插入到它前面,如果不存在,说明一个孩子都没有,那么直接appendChild到最后就可以了.
            container.insertBefore(newEle,firstChild);
        }else{
            container.appendChild(newEle);
        }
    },
    insertBefore:function(newEle,oldEle){//我要把这个新元素插入到这个oldEle前面
        oldEle.parentNode.insertBefore(newEle,oldEle);//只能父级调用
    },
    insertAfter:function(newEle,oldEle){
        var next=this.next(oldEle);
        //如果弟弟存在就直接插入到弟弟的前面,如果不存在说明我就是最后一个,就直接appendChild就可以了
        next?oldEle.parentNode.insertBefore(newEle,oldEle):oldEle.parentNode.appendChild(newEle);
    },
    hasClass:function(ele,strClass){//判断ele是否含有strClass这个类
        /*先去掉strClass的收尾空格*/
        strClass=strClass.replace(/(^\s+|\s+$)/g,"");//去掉你传值的收尾空格.
        //利用传值进来的这个字符串组合成一个新的正则来验证ele.className是否符合刚刚这个正则.
        var reg=new RegExp("(^| +)"+strClass+"( +|$)");//   \s  转义了.
        return reg.test(ele.className);
    },
    addClass:function(ele,strClass){
        strClass.replace(/(^ +| +$)/g,"");
        var strClassAry=strClass.split(/ +/);
        for(var i=0;i<strClassAry.length;i++){
            var curClass=strClassAry[i];
            if(!this.hasClass(ele,curClass)){//如果不包含这个类才添加
                ele.className+=" "+curClass;
            }
            /*ul.classList.add   原生的,在移动端可随便用*/
        }
    },
    removerClass:function(ele,strClass){//在ele的className中,移除这个strClass
        var strClassAry=strClass.replace(/(^ +| +$)/g,"").split(/ +/);//去收尾空格
        for(var i=0;i<strClassAry.length;i++){//循环移除
            var curClass=curClass[i];
            if(this.hasClass(ele,curClass)){
                var reg=new RegExp("(^| +)"+ curClass+"( +|$)","g");
                /*把所有能用c2,c3拼接成的正则能在className中能用匹配到的全部用" "空格字符串替换*/
                ele.className=ele.className.replace(reg," ");
            }
        }
    },
    setGroupCss:function(ele,options){//options,保证是一个对象
        options=options||true;
        if(options.toString()=="[object Object]"){//options.toString()   需要执行.
            //我就能保证options是一个对象{}
            for(var key in options){//原型上的不要
                if(options.hasOwnProperty(key)){
                    this.setCss(ele,key,options[key]);
                }
            }
        }

    },
    getEleByClass:function(strClass,context){
        context = context || document;
        if (context.getElementsByClassName) {
            return context.getElementsByClassName(strClass);
        }
        var ary = [];
        var strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/);
        var tags = context.getElementsByTagName("*");
        for (var i = 0; i < tags.length; i++) {
            var flag = true;
            var curTag = tags[i];
            for (var j = 0; j < strClassAry.length; j++) {
                var curClass = strClassAry[j];
                var reg = new RegExp("(^| +)" + curClass + "( +|$)");
                if (!reg.test(curTag.className)) {
                    flag = false;
                    break;
                }

            }
            if (flag) {
                ary.push(curTag);
            }
        }

        return ary;
    }
};

var utils2=(function (){
    var isStanderBrowser="getComputedStyle" in window;
    function a(){}
    function b(){
        a();//通过作用域来查找的
        a();//通过this来查找的
    }
    window.a=a;//这个就是直接赋值给window当做全局的一个属性.
    return {a:a,b:b};//如果不return,外面没有办法找到
})();