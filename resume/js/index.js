var mySwiper = new Swiper(".swiper-container", {
    direction: "vertical",
    loop: true,
    lazyLoading:true,
    nextButton:"swiper-button-next",
    onSlideChangeEnd: function (swiper) {
        var slides = swiper.slides;
        var curIndex = swiper.activeIndex;
        var trueSlideNum = slides.length - 2;
        var lastSlideNum = trueSlideNum + 1;
        [].forEach.call(slides, function (item, index) {
            item.id = "";
            if (index == curIndex) {
                switch (index) {
                    case 0:
                        item.id = "page" + trueSlideNum;
                        break;
                    case lastSlideNum:
                        item.id = "page1";
                        break;
                    default :
                        item.id = "page" + curIndex;
                }
            }
        })
    },
    /* onInit:function(swiper){
     var slides=swiper.slides;
     slides[0].id="page1"
     }*/
});
var play = document.querySelector("#play");
var music = document.querySelector(".music");
window.setTimeout(function () {
    play.play();
    play.addEventListener("canplay", function () {
        music.className = "music musicMove";
        music.style.opacity = 1;
    })
}, 1000);
music.addEventListener("click", function () {
    if (play.paused) {//停止
        play.play();
        music.className = "music musicMove";
    } else {//播放
        play.pause();
        music.className = "music";
    }
});

function getAngle(x1, y1, x2, y2) {
    // 直角的边长
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    // 斜边长
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    // 余弦
    var cos = y / z;
    // 弧度
    var radina = Math.acos(cos);
    // 角度
    var angle =  180 / (Math.PI / radina);
    return angle;
}
var x=document.documentElement.clientWidth;
var y=document.documentElement.clientHeight;
var render=(function(){
    var line1=document.querySelector(".line1");
    var line2=document.querySelector(".line2");
    var angle = getAngle(0, 0, x, y);
    line1.style.transform="rotate("+angle+"deg)";
    //line1.style.animation="line1 1s 1node both;";
    //line1.style.transition="1s";
    line2.style.transform="rotate("+angle+"deg)";
})();
var flower=(function(){
    function ran(n,m){
        return Math.round(Math.random()*(m-n)+n);
    };
    var flower=document.querySelector("#flowers"),
        str="";
    var widthDoc=document.documentElement.offsetWidth||document.body.offsetWidth,
        heightDoc=document.documentElement.offsetHeight||document.body.offsetHeight;
   function innerHtml(){
       var n=ran(2,5);
       for(var i=0;i<n;i++){
           str+="<span></span>";
       }
       flower.innerHTML=str;
       str="";
   }
    function move(){
        var span=flower.querySelectorAll("span");
        span.forEach(function(item,index){
            item.className="flower"+ran(1,6);
            with (item.style){
                height=width=ran(40,60)+"px";
                left=ran(0,widthDoc)+"px";
                top=ran(1,30)+"px";

            }
        });
    }

    return {
        init:function(){
            innerHtml();
            move();

        }
    }
})();
flower.init();
timer=window.setInterval(flower.init,6000);












