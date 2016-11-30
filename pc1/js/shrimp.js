var rotate = document.getElementById("move");
var RotateImg = rotate.getElementsByTagName("img");
var rotateFocus = rotate.getElementsByClassName("focus")[0];
//var rotateFocus=document.getElementById("rotateFocus");
var lis = rotate.getElementsByTagName("li");
var imgLoad = (function () {
    /**
     * ele:要操作的元素
     * data:需要获取地址的地点
     * index:所在数据的索引值
     * targetEle:需要将数据添加到的那个元素.
     *
     * */
    var xhr = new XMLHttpRequest();
    function getData(ele, data, index) {
        data = data + "?_" + Math.random;
        xhr.open("get", data, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
                //var curData=utils.listToArray(JSON.parse(xhr.responseText));
                index = index ? index : 0;
                var curData = JSON.parse(xhr.responseText);
                ele.data = curData[index];
                /*ele.data=JSON.parse(xhr.responseText);*/
            }
        };
        xhr.send(null);
    }

    function addData(ele, tagName, targetEle) {
        if (ele.data) {
            var str = "";
            for (var i = 0; i < ele.data.length; i++) {
                var curData = ele.data[i];
                if (tagName == "img") {
                    if (targetEle.length > 1) {
                        str = '<a href="javascript:void 0;"><img src="" rel="' + curData["src"] + ' " art="' + curData["title"] + '"></a>';
                        targetEle[i].innerHTML += str;//utils.prepend(str,targetEle[i]);
                    }
                    else {
                        str += '<a href="javascript:void 0;"><img src="" rel="' + curData["src"] + ' " art="' + curData["title"] + '"></a>';
                    }
                }
                else if (tagName == "a") {
                    str = '<a  href="javascript:void 0;" class="cabaret">' + curData["cabaret"] + '</a><a class="singer clear" href="javascript:void 0;">';
                    if (curData["singerImg"]) {
                        str += '<img class="jsForPosition" src="' + curData["singerImg"] + ' "/>' + curData["singer"];
                        if (curData["i"]) {
                            str += '<i class="singerVip"></i></a>';
                        } else {
                            str += '</a>';
                        }
                    }
                    else if (curData["i"]) {
                        str += curData["singer"] + '<i></i></a>';
                    }
                    else {
                        str += curData["singer"] + '</a>';
                    }
                    targetEle[i].innerHTML += str;
                }
            }
            targetEle.innerHTML += str;
        }
    }

    function allImgLoad(ele) {
        for (var i = 0; i < ele.length; i++) {
            if (i == 0) {
                utils.css(ele[i].parentNode, {display: "block"})
            }
            /*注释忘了*/
            var tempImg = document.createElement("img");
            tempImg.index = i;
            tempImg.src = ele[i].getAttribute("rel");
            tempImg.onload = function () {
                ele[this.index].src = this.src;
            };
            tempImg = null;
        }
    }

    return {
        getData: getData,
        addData: addData,
        allImgLoad: allImgLoad
    };
})();
imgLoad.getData(rotate, "pictures.txt", 0);
(function () {
    if (rotate.data) {
        var strLi = "";
        for (var i = 0; i < rotate.data.length; i++) {
            strLi += i == 0 ? '<li class="focusBg"></li>' : '<li></li>';
        }
        rotateFocus.innerHTML += strLi;
    }
})();//焦点跟随
imgLoad.addData(rotate, "img", rotate);
imgLoad.allImgLoad(RotateImg);
var step = 0;
function setImg() {
    for (var i = 0; i < RotateImg.length; i++) {
        if (i == step) {
            utils.css(RotateImg[i].parentNode, "display", "block");
            lis[i].className = "focusBg"
        } else {
            utils.css(RotateImg[i].parentNode, "display", "none");
            lis[i].className = "";
        }
    }

}
function autoMove() {
    if (step == rotate.data.length - 1) {
        step = -1;
    }
    step++;
    setImg();
}
var timer = window.setInterval(autoMove, 3000);
(function () {
    for (var i = 0; i < lis.length; i++) {
        lis[i].index = i;
        lis[i].onmouseover = function () {
            timer = window.clearInterval(timer);
            step = this.index;
            setImg();
        };
        rotateFocus.onmouseleave = function () {
            timer = window.setInterval(autoMove, 3000);
        }
    }
})();
rotate.onmouseenter = function () {
    timer = window.clearInterval(timer);
};
rotate.onmouseout = function () {
    if (timer) {
        return;
    }
    timer = window.setInterval(autoMove, 3000);
};
/* 1 轮播图结束*/
var printOne = document.getElementById("printOne");
var printOneImg = printOne.getElementsByTagName("img");
imgLoad.getData(printOne, "pictures.txt", 1);
imgLoad.addData(printOne, "img", printOne);
imgLoad.allImgLoad(printOneImg);
/* 2 四张图拼接那块,用数据 1*/
var middleImg = document.getElementsByClassName("middleImg");
var imgLength = middleImg[0].clientWidth;
for (var i = 0, len = middleImg.length; i < len; i++) {
    var middleImgTar = utils.getEleByClass("printsTop", middleImg[i]);
    imgLoad.getData(middleImg[i], "pictures.txt", i + 2);
    imgLoad.addData(middleImg[i], "img", middleImgTar);
    /* 3 中间三排的图片*/
    var middlePTar = utils.getEleByClass("prints", middleImg[i]);
    imgLoad.addData(middleImg[i], "a", middlePTar);//先执行这个
    for (var j = 0; j < middleImgTar.length; j++) {//后执行这个图片才能加载出来原因?
        var middleImgs = middleImgTar[j].getElementsByTagName("img");
        imgLoad.allImgLoad(middleImgs);
    }
    ///*针对中间左右点击图下面介绍*/
    if (i >= 1) {
        middleImg[i].step = 0;
        var middleLarge = utils.getEleByClass("middleLarge", middleImg[i])[0];
        var middleImgL = utils.getEleByClass("middleImgL", middleImg[i])[0];
        var middleImgR = utils.getEleByClass("middleImgR", middleImg[i])[0];
        middleImgL.middleLarge = middleLarge;
        middleImgR.middleLarge = middleLarge;
        middleImgL.onclick = function () {
            if (this.parentNode.step == 0) {
                utils.css(this.middleLarge, "left", this.parentNode.step * -imgLength);
                return;
            }
            this.parentNode.step--;
            animate(this.middleLarge, {left: this.parentNode.step * -imgLength}, 200);
        };
        middleImgR.onclick = function () {
            if (this.parentNode.step == 2) {
                utils.css(this.middleLarge, "left", this.parentNode.step * -imgLength);
                return;
            }
            this.parentNode.step++;
            animate(this.middleLarge, {left: this.parentNode.step * -imgLength}, 200);
        };
    }
    /* 4  给后两排图片添加左右按钮*/
}

/*获得具体的介绍歌手信息*/
var forPosition = document.getElementById("forPosition");
var masterVar = (function () {
    function forIntroduce(n, jsP, e) {
        var str = "";
        this.eleData = jsP.data[this.i];
        jsP.intTriangle = utils.getEleByClass("intTriangle", jsP.introduce[this.i])[0];
        if (n == 7) {
            var src7 = this["src"];
            var imgSRC = jsP.introduce[this.i].getElementsByTagName("img")[0];
            var that = imgSRC.src == src7 ? null : 1;
            //if(this.addSrc){var that=0}else{that=1node}
            jsP.introduce[this.i].style.display = "block";
            jsP.introduce[this.i].style.left = 330 + "px";
            var clientY = e.clientY;
            if (clientY > 230) {//
                utils.removerClass(jsP.intTriangle, "intTriangleBottom");
                jsP.introduce[this.i].style.top = -230 + "px";
            } else {
                jsP.introduce[this.i].style.top = 45 + "px";
                utils.addClass(jsP.intTriangle, "intTriangleBottom");
            }
        }
        if (n == undefined) {
            var imgSrc = jsP.introduce[this.i].getElementsByTagName('img')[0];
            /*  var str = "",
             eleData = forPosition.data[this.i],
             intTriangle = utils.getEleByClass("intTriangle", introduce[this.i])[0];*/
            var src6 = jsP.jsForPosition[this.i]["src"]; //src=middleImg[2].data[this.i]["singerImg"];
            var _true = imgSrc.src == src6 ? null : 1;
            jsP.introduce[this.i].style.display = "block";
            var eleHeight = jsP.introduce[this.i].offsetHeight,
                eleWidth = middlePTar[this.i].offsetWidth,
                eleClient = jsP.offsetTop - (document.documentElement.scrollTop || document.body.scrollTop) + 32;

            if (eleClient < 0) {
                jsP.introduce[this.i].style.top = eleHeight + "px";
                jsP.introduce[this.i].style.left = ((this.i % 5) == 0 && 1) ? (this.i % 5) * eleWidth - 32 + "px" : (this.i % 5) * eleWidth + "px";
                utils.addClass(jsP.intTriangle, "intTriangleBottom");
            } else if (eleClient > 0) {
                jsP.introduce[this.i].style.left = ((this.i % 5) == 0 && 1) ? (this.i % 5) * eleWidth - 32 + "px" : (this.i % 5) * eleWidth + "px";
                jsP.introduce[this.i].style.top = -32 + "px";
                utils.removerClass(jsP.intTriangle, "intTriangleBottom");
            }
        }
        if (_true || that) {
            if (_true) {
                imgSrc.src = src6;
                this.name = middleImg[2].data[this.i]["singer"];
                this.vip = utils.next(this);
            }
            if (that) {
                imgSRC.src = src7;
                this.name = utils.getEleByClass("nominateSinger", jsP.jsForPosition[this.i])[0].innerHTML;
            }
            str += '<a href="javascript:void 0;">' + this.name;
            if (this.vip) {
                str += '<span class="singerVip"></span></a>';
            } else {
                str += '</a>';
            }
            str += '<h4 class="introduceAddress">';
            str += '<u class="' + (this.eleData.sex % 2 == 0 ? "introduceSex" : "") + '"></u>' + this.eleData['site'] + '</h4>';
            jsP.introduceTopName[this.i].innerHTML += str;
            this.intFansI = jsP.intFans[this.i].getElementsByTagName("i");
            this.intNumberI = jsP.intNumber[this.i].getElementsByTagName('i');
            getNumber(this.intNumberI, this.eleData["i"]);
            for (var i = 0, len = this.intFansI.length; i < len; i++) {
                switch (i) {
                    case 0:
                        this.intFansI[i].innerHTML += this.eleData.care;
                        break;
                    case 1:
                        this.intFansI[i].innerHTML = this.eleData.fans;
                        break;
                    case 2:
                        this.intFansI[i].innerHTML = this.eleData.collect;
                        break;
                }
            }
            if (this.eleData.follow) {
                this.followI = jsP.follow[this.i].getElementsByTagName("i")[0];
                this.followH4 = jsP.follow[this.i].getElementsByTagName("h4")[0];
                this.followI.className = "followMe";
                this.followH4.style.color = "#666";
            }
        }
    }

    function bindHTML(variable, n) {
        if (n == 6) {
            variable.jsForPosition = variable.getElementsByClassName("jsForPosition");
        }
        if (n == 7) {
            variable.jsForPosition = variable.getElementsByClassName("nominateHiddenL");
        }
        imgLoad.getData(variable, "pictures.txt", n);
        /*数据6*/
        for (i = 0, len = variable.jsForPosition.length; i < len; i++) {
            variable.introduce = variable.getElementsByClassName("introduce");
            variable.introduceTopName = variable.getElementsByClassName("introduceTopName", variable);
            variable.intNumber = variable.getElementsByClassName("intNumber");
            //var intNumberI=intNumber[i].getElementsByTagName('i');
            variable.intFans = variable.getElementsByClassName("intFans");
            variable.follow = variable.getElementsByClassName("follow");
            variable.introduce[i].i = variable.jsForPosition[i].i = i;
            try {
                variable.jsForPosition[i].addEventListener("mouseenter", function () {
                    var _that = this;
                    if (n == 6) {//如果是获取第六组数据时;
                        forIntroduce.call(this, null, variable);
                        return;
                    }
                    var hiddenPlay = utils.getEleByClass("hiddenPlay", this)[0];
                    hiddenPlay.onmouseenter = function (e) {
                        e = e || window.event;
                        var imgSrc = utils.firstEleChild(this);
                        imgSrc.i = _that.i;
                        forIntroduce.call(imgSrc, n, variable, e);
                    }
                });
            }
            catch (e) {
                variable.jsForPosition[i].onmouseenter = function () {
                    var _that = this;
                    if (n == 6) {//如果是获取第六组数据时;
                        forIntroduce.call(this);
                        return;
                    }
                    var hiddenPlay = utils.getEleByClass("hiddenPlay", this)[0];
                    hiddenPlay.onmouseenter = function (e) {
                        e = e || window.event;
                        var imgSrc = utils.firstEleChild(this);
                        imgSrc.i = _that.i;

                        forIntroduce.call(imgSrc, n, variable, e);

                    }
                }
            }
            variable.introduce[i].onmouseenter = function () {
                this.style.display = "block";
            };
            variable.introduce[i].onmouseleave = variable.jsForPosition[i].onmouseleave = function () {
                variable.introduce[this.i].style.display = "none";
            }
        }
    }

    return {
        init: function (variable, n) {
            //variable.jsForPosition=variable;
            bindHTML(variable, n);
        }
    }
})();
masterVar.init(forPosition, 6);
var nominate = document.getElementById("nominate");
masterVar.init(nominate, 7);
/*将数组转化为数组,获取单个数字*/
function getNumber(ele, number) {
    var aryI = number.split("");
    var dif = ele.length - aryI.length;
    for (var i = 0; i < ele.length; i++) {
        for (var j = 0; j < aryI.length; j++) {
            ele[i].innerHTML = aryI[i - dif] ? aryI[i - dif] : 0;
        }
    }
}
var printsLength = utils.getEleByClass("printsTop", middleImg[0]);
function printLength(i) {
    var printsTop = utils.getEleByClass("printsTop", middleImg[0])[i];
    var printsTopFirst = utils.firstEleChild(printsTop, "p");
    var printsTopLast = utils.getEleByClass("hiddenTow", printsTop)[0];
    printsTopFirst.onmouseenter = function () {
        printsTopLast.style.display = "block";
        this.style.display = "none";
    };
    printsTop.onmouseleave = function () {
        printsTopLast.style.display = "none";
        printsTopFirst.style.display = "block";
    };
}
for (i = 0, len = printsLength.length; i < len; i++) {
    printLength(i);
}
var centerImg = document.getElementById("centerImg");
var centerImgs = centerImg.getElementsByTagName("img");
imgLoad.getData(centerImg, "pictures.txt", 5);
imgLoad.addData(centerImg, "img", centerImg);
imgLoad.allImgLoad(centerImgs);

/*主内容右边的获取时间*/
function getDate(){
    var musicianDate=document.getElementById("musician-date");
    var curDate=new Date;
    var recommendDate=document.getElementById("recommendDate");
    var str="";
    var regMonth=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
    var regDay=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    var dayTime=["拂晓","黎明","清晨","上午","中午","下午","傍晚","深夜"];
        str+="<li>"+regMonth[curDate.getMonth()]+"</li>";
        str+="<li>"+curDate.getDate()+"</li>";
        str+="<li>"+regDay[curDate.getDay()]+"</li>";
    musicianDate.innerHTML=str;
    var house=parseInt(curDate.getHours()),
        number=null;
    if(house<=3){
        number=0;
    }else if(house<=6){
        number=1;
    }else if(house<=9){
        number=2;
    }else if(house<=12){
        number=3
    }else if(house<=15){
        number=4;
    }else if(house<=18){
        number=5;
    }else if(house<=21){
        number=6;
    }else if(house<=0){
        number=7;
    };
    str="<span>"+regDay[curDate.getDay()]+"</span><span>"+dayTime[number]+"</span>";
    recommendDate.innerHTML=str;
}
getDate();
/*主内容右边的点击切换*/
function discuss() {
    var discuss = document.getElementById("discuss");
    var discussChoose = utils.getEleByClass("discussChoose", discuss)[0];
    var discussList = utils.getEleByClass("discussList", discuss)[0];
    var discussChooseLis = discussChoose.getElementsByTagName("li");
    var discussListLis = discussList.getElementsByTagName("li");
    for (var j = 0, len = discussChooseLis.length; j < len; j++) {
        discussChooseLis[j].index=j;
        discussChooseLis[j].onclick = function () {
            if(this.className=="disChoose"){return;};/*因为边框加上后不知道怎么去掉,只能通过改变类名来添加样式*/
            for(var i=0;i<len;i++){
                discussListLis[i].style.display = "none";
                discussChooseLis[i].className="";
                if(i==1){
                    this.style.widths = 74 + "px";
                    //this.style.borderBottom="1px solid #ededed";
                    //this.style.borderBottom="transparent";
                }
            }
            discussListLis[this.index].style.display = 'block';
            this.className="disChoose disChoose"+this.index;
        }
    }
}
discuss();