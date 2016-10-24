var rotate=document.getElementById("move");
var RotateImg=rotate.getElementsByTagName("img");
var rotateFocus=rotate.getElementsByClassName("focus")[0];
//var rotateFocus=document.getElementById("rotateFocus");
var lis=rotate.getElementsByTagName("li");
var imgLoad=(function(){
    /**
     * ele:要操作的元素
     * data:需要获取地址的地点
     * index:所在数据的索引值
     * targetEle:需要将数据添加到的那个元素.
    *
    * */
    var xhr=new XMLHttpRequest();
    function getData(ele,data,index){
        data=data+"?_"+Math.random;
        xhr.open("get",data,false);
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4&& /^2\d{2}$/.test(xhr.status)){
                //var curData=utils.listToArray(JSON.parse(xhr.responseText));
                index= index ?index:0;
                    var curData=JSON.parse(xhr.responseText);
                    ele.data= curData[index];
                /*ele.data=JSON.parse(xhr.responseText);*/
            }
        };
        xhr.send(null);
    }
    function addData(ele,tagName,targetEle){
        if(ele.data){
            var str="";
            for(var i=0;i<ele.data.length;i++){
                var curData=ele.data[i];
                if(tagName=="img"){
                    if(targetEle.length>1){
                        str='<a href="javascript:void 0;"><img src="" rel="'+curData["src"]+' " art="'+curData["title"]+'"></a>';
                            targetEle[i].innerHTML+=str;//utils.prepend(str,targetEle[i]);
                    }
                    else{
                    str+='<a href="javascript:void 0;"><img src="" rel="'+curData["src"]+' " art="'+curData["title"]+'"></a>';
                    }
                }
                else if(tagName=="a"){
                    str='<a  href="javascript:void 0;" class="cabaret">'+curData["cabaret"]+'</a><a class="singer clear" href="javascript:void 0;">';
                    if(curData["singerImg"]){
                        str+='<img class="jsForPosition" src="'+curData["singerImg"]+' "/>'+curData["singer"];
                        if(curData["i"]){
                            str+='<i class="singerVip"></i></a>';
                        }else{
                            str+='</a>';
                        }
                    }
                    else if(curData["i"]){
                        str+=curData["singer"]+'<i></i></a>';
                    }
                    else{
                    str+=curData["singer"]+'</a>';
                    }
                    targetEle[i].innerHTML+=str;
                }
            }
                targetEle.innerHTML+=str;
        }
    }
    function allImgLoad(ele){
        for(var i=0;i<ele.length;i++){
            if(i==0){utils.css(ele[i].parentNode,{display:"block"})}
            /*注释忘了*/
            var tempImg=document.createElement("img");
            tempImg.index=i;
            tempImg.src=ele[i].getAttribute("rel");
            tempImg.onload=function(){
                ele[this.index].src=this.src;
            };
            tempImg=null;
        }
    }
    return {
        getData:getData,
        addData:addData,
        allImgLoad:allImgLoad
    };
})();
imgLoad.getData(rotate,"pictures.txt",0);
(function (){
    if(rotate.data){
        var strLi="";
        for(var i=0;i<rotate.data.length;i++){
            strLi+= i==0? '<li class="focusBg"></li>':'<li></li>';
        }
        rotateFocus.innerHTML+=strLi;
    }
})();//焦点跟随
imgLoad.addData(rotate,"img",rotate);
imgLoad.allImgLoad(RotateImg);
var step=0;
function setImg(){
    for(var i=0;i<RotateImg.length;i++){
        if(i==step){
            utils.css(RotateImg[i].parentNode,"display","block");
            lis[i].className="focusBg"
        }else{
            utils.css(RotateImg[i].parentNode,"display","none");
            lis[i].className="";
        }
    }

}
function autoMove(){
    if(step==rotate.data.length-1){
        step=-1;
    }
    step++;
    setImg();
}
var timer=window.setInterval(autoMove,3000);
(function(){
    for(var i=0;i<lis.length;i++){
        lis[i].index=i;
        lis[i].onmouseover=function(){
            timer=window.clearInterval(timer);
            step=this.index;
            setImg();
        };
        rotateFocus.onmouseleave=function(){
            timer=window.setInterval(autoMove,3000);
        }
    }
})();
rotate.onmouseenter=function(){
    timer=window.clearInterval(timer);
};
rotate.onmouseout=function(){
    if(timer){
        return;
    }
    timer=window.setInterval(autoMove,3000);
};
/* 1 轮播图结束*/
var printOne=document.getElementById("printOne");
var printOneImg=printOne.getElementsByTagName("img");
imgLoad.getData(printOne,"pictures.txt",1);
imgLoad.addData(printOne,"img",printOne);
imgLoad.allImgLoad(printOneImg);
/* 2 四张图拼接那块,用数据 1*/
var middleImg=document.getElementsByClassName("middleImg");
var imgLength=middleImg[0].clientWidth;
for(var i= 0,len=middleImg.length;i<len;i++){
    var middleImgTar=utils.getEleByClass("printsTop",middleImg[i]);
    imgLoad.getData(middleImg[i],"pictures.txt",i+2);
    imgLoad.addData(middleImg[i],"img",middleImgTar);
        /* 3 中间三排的图片*/
    var middlePTar=utils.getEleByClass("prints",middleImg[i]);
    imgLoad.addData(middleImg[i],"a",middlePTar);//先执行这个
    for(var j=0;j<middleImgTar.length;j++){//后执行这个图片才能加载出来原因?
        var middleImgs=middleImgTar[j].getElementsByTagName("img");
        imgLoad.allImgLoad(middleImgs);
    }
    ///*针对中间左右点击图下面介绍*/
     if(i>=1){
      middleImg[i].step=0;
      var middleLarge=utils.getEleByClass("middleLarge",middleImg[i])[0];
      var middleImgL=utils.getEleByClass("middleImgL",middleImg[i])[0];
      var middleImgR=utils.getEleByClass("middleImgR",middleImg[i])[0];
            middleImgL.middleLarge=middleLarge;
            middleImgR.middleLarge=middleLarge;
         middleImgL.onclick=function(){
            if(this.parentNode.step==0){
                utils.css(this.middleLarge,"left",this.parentNode.step*-imgLength);
                return;
            }
            this.parentNode.step--;
            animate(this.middleLarge,{left:this.parentNode.step*-imgLength},200);
        };
        middleImgR.onclick=function() {
            if(this.parentNode.step==2){
                utils.css(this.middleLarge,"left",this.parentNode.step*-imgLength);
                return;
            }
            this.parentNode.step++;
            animate(this.middleLarge,{left:this.parentNode.step*-imgLength},200);
        };
    }
    /* 4  给后两排图片添加左右按钮*/
}

/*获得具体的介绍歌手信息*/
var forPosition=document.getElementById("forPosition");
var jsForPosition=forPosition.getElementsByClassName("jsForPosition");
imgLoad.getData(forPosition,"pictures.txt",6);
for(i=0;i<jsForPosition.length;i++){
    var introduce=forPosition.getElementsByClassName("introduce")[i];
    var introduceTopName=forPosition.getElementsByClassName("introduceTopName",forPosition)[i];
    var intNumber=forPosition.getElementsByClassName("intNumber")[i];
    var intNumberI=intNumber.getElementsByTagName('i');
    var intFans=forPosition.getElementsByClassName("intFans")[i];
    var intFansI=intFans.getElementsByTagName("i");
    var follow=forPosition.getElementsByClassName("follow")[i];
    jsForPosition[i].i=i;
    jsForPosition[i].addEventListener("mouseenter",function (){forIntroduce(this)});
    introduce.onmouseenter=function(){
        this.style.display="block";
    };
    introduce.onmouseleave=jsForPosition[i].onmouseleave=function(){
        introduce.style.display="none";
    }
}
function forIntroduce(ele){
    var str="",
        src=jsForPosition[ele.i]["src"], //src=middleImg[2].data[ele.i]["singerImg"];
        imgSrc=introduce.getElementsByTagName('img')[0],
        _true= imgSrc.src==src? 0: 1,
        eleData=forPosition.data[ele.i],
        intTriangle=utils.getEleByClass("intTriangle",introduce)[0];
    introduce.style.display="block";
    var eleHeight=introduce.offsetHeight,
        eleWidth=introduce.offsetWidth,
        eleClient=(document.documentElement.scrollHeight||document.body.scrollHeight)-utils.offset(introduce).top;

    introduce.style.left=(ele.i%5)*eleWidth+"px";
    console.log(utils.offset(introduce).top);
        if(eleHeight>eleClient){
            introduce.style.top=eleHeight+"px";
            intTriangle.className+='';
        }else{
            introduce.style.top=0;
            intTriangle.className+='intTriangleBottom';
        }
    if(_true){
        imgSrc.src=src;
        var name=middleImg[2].data[ele.i].singer;
        str+='<a href="javascript:void 0;">'+name;
        var vip=utils.next(ele);
        if(vip){
            str+='<span class="singerVip"></span></a>';
        }else{
            str+='</a>';
        }
        str+='<h4 class="introduceAddress">';
        str+='<u class="'+(eleData.sex%2==0?"introduceSex":"")+'"></u>'+eleData['site']+'</h4>';
        introduceTopName.innerHTML+=str;
        getNumber(eleData["i"]);
        for(var i=0;i<intFansI.length;i++){
            switch (i){
                case 0:
                    intFansI[i].innerHTML=eleData.care;
                    break;
                case 1:
                    intFansI[i].innerHTML=eleData.fans;
                    break;
                case 2:
                    intFansI[i].innerHTML=eleData.collect;
                    break;
            }
        }
        if(eleData.follow){
            var followI=follow.getElementsByTagName("i")[0];
            var followH4=follow.getElementsByTagName("h4")[0];
            followI.className="followMe";
            followH4.style.color="#666";
        }
    }
}
var forPosition=document.getElementById("forPosition");
var jsForPosition=forPosition.getElementsByClassName("jsForPosition");
imgLoad.getData(forPosition,"pictures.txt",6);
for(i=0,len=jsForPosition.length;i<len;i++){
    var introduce=forPosition.getElementsByClassName("introduce");
    var introduceTopName=forPosition.getElementsByClassName("introduceTopName",forPosition);
    var intNumber=forPosition.getElementsByClassName("intNumber");
    //var intNumberI=intNumber[i].getElementsByTagName('i');
    var intFans=forPosition.getElementsByClassName("intFans");
    var follow=forPosition.getElementsByClassName("follow");
    introduce[i].i=jsForPosition[i].i=i;
    jsForPosition[i].addEventListener("mouseenter",function (){
        forIntroduce.call(this)}
    );
    jsForPosition[i].onmouseenter=function(){
        forIntroduce.call(this);
    };
    introduce[i].onmouseenter=function(){
        this.style.display="block";
    };
    introduce[i].onmouseleave=jsForPosition[i].onmouseleave=function(){
        introduce[this.i].style.display="none";
    }
}
function forIntroduce(){
    var str="",
        src=jsForPosition[this.i]["src"], //src=middleImg[2].data[this.i]["singerImg"];
        imgSrc=introduce[this.i].getElementsByTagName('img')[0],
        _true= imgSrc.src==src? 0: 1,
        eleData=forPosition.data[this.i],
        intTriangle=utils.getEleByClass("intTriangle",introduce[this.i])[0];
    introduce[this.i].style.display="block";
    var eleHeight=introduce[this.i].offsetHeight,
        eleWidth=middlePTar[this.i].offsetWidth,
        eleClient=forPosition.offsetTop-(document.documentElement.scrollTop||document.body.scrollTop)+32;
    var intFansI=intFans[this.i].getElementsByTagName("i");
    if(eleClient<0){
        introduce[this.i].style.top=eleHeight+"px";
        introduce[this.i].style.left=((this.i%5)==0&&1)?(this.i%5)*eleWidth-32+"px":(this.i%5)*eleWidth+"px";
        utils.addClass(intTriangle,"intTriangleBottom");
    }else if(eleClient>0){
        introduce[this.i].style.left=((this.i%5)==0&&1)?(this.i%5)*eleWidth-32+"px":(this.i%5)*eleWidth+"px";
        introduce[this.i].style.top=-32+"px";
        utils.removerClass(intTriangle,"intTriangleBottom");
    }
    if(_true){
        imgSrc.src=src;
        var name=middleImg[2].data[this.i]["singer"];
        str+='<a href="javascript:void 0;">'+name;
        var vip=utils.next(this);
        if(vip){
            str+='<span class="singerVip"></span></a>';
        }else{
            str+='</a>';
        }
        str+='<h4 class="introduceAddress">';
        str+='<u class="'+(eleData.sex%2==0?"introduceSex":"")+'"></u>'+eleData['site']+'</h4>';
        introduceTopName[this.i].innerHTML+=str;
        var intNumberI=intNumber[this.i].getElementsByTagName('i');
        getNumber(intNumberI,eleData["i"]);
        for(var i= 0,len=intFansI.length;i<len;i++){
            switch (i){
                case 0:
                    intFansI[i].innerHTML+=eleData.care;
                    //console.log(intFansI[i]);
                    break;
                case 1:
                    intFansI[i].innerHTML=eleData.fans;
                    break;
                case 2:
                    intFansI[i].innerHTML=eleData.collect;
                    break;
            }
        }
        if(eleData.follow){
            var followI=follow[this.i].getElementsByTagName("i")[0];
            var followH4=follow[this.i].getElementsByTagName("h4")[0];
            followI.className="followMe";
            followH4.style.color="#666";
        }
    }
}
/*将数组转化为数组,获取单个数字*/
function getNumber(ele,number){
    var aryI=number.split("");
    var dif=ele.length-aryI.length;
    for(var i=0;i<ele.length;i++){
        for(var j=0;j<aryI.length;j++){
            ele[i].innerHTML=aryI[i-dif]?aryI[i-dif]:0;
        }
     }
}









var printsLength=utils.getEleByClass("printsTop",middleImg[0]);
function printLength(i){
    var printsTop=utils.getEleByClass("printsTop",middleImg[0])[i];
    var printsTopFirst=utils.firstEleChild(printsTop,"p");
    var printsTopLast=utils.getEleByClass("hiddenTow",printsTop)[0];
    printsTopFirst.onmouseenter=function(){
        printsTopLast.style.display="block";
        this.style.display="none";
    };
    printsTop.onmouseleave=function(){
        printsTopLast.style.display="none";
        printsTopFirst.style.display="block";
    };
}
for( i=0,len=printsLength.length;i<len;i++){
    printLength(i);
 }












var centerImg=document.getElementById("centerImg");
var centerImgs=centerImg.getElementsByTagName("img");
imgLoad.getData(centerImg,"pictures.txt",5);
imgLoad.addData(centerImg,"img",centerImg);
imgLoad.allImgLoad(centerImgs);



















































