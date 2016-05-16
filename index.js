/*
    author：moon-shine
    data:16-3-15
    version:1.1
    
    参数
    direction:vertical(水平滚动)、horizontal(竖直滚动)
    ele :外盒
    speed：slow、fast、middle
*/
function fullScreen(ele,direction,speed){
    var element=document.getElementById(ele),//父级元素
        bodyHeight=document.body.offsetHeight,//浏览器高度
        ul=document.getElementsByTagName('ul')[0],//ul元素
        li=ul.getElementsByTagName('li'),//ul元素的li
        divindex=0,//当前盒子的索引
        nowslide=0,//当前页面的位置
        mouseDirection,//鼠标滚轮滚动的方向
        divnumber,//滚动页面的数量
        slideDirection,//页面滚动的方向    1:水平滚动
        isSlide = false,
        slideSpeed=2;//滑动的速度
    //判断页面滚动的方向（横向/纵向）
    if(direction=="horizontal"){
        slideDirection=1;//横向滚动
    }else{
        slideDirection=0;//纵向滚动
    }
    //判断页面滚动的速度
    if(speed=="fast"){
        slideSpeed=5;
    }else if(speed=="middle"){
        slideSpeed=3;
    }else if(speed=="slow"){
        slideSpeed=2;
    }
    
    //设置li导航的样式
    function liStyle(){
        for(var i=0,len=li.length;i<len;i++){
            li[i].style.width="18%";
            if(li[i].currentStyle){
                widsize=li[i].currentStyle['width'];
            }else{
                var widsize=document.defaultView.getComputedStyle(li[i],null)['width'];
            }
            //console.log(document.defaultView.getComputedStyle(li[i],null)['width'])//获取li的css的width属性值
            li[i].style.height=widsize;
            li[i].style.borderRadius=widsize;
            li[i].style.marginLeft="2%";
        }
    }
    function main(e){
        
        if(slideDirection){
            element.style.marginLeft=0;//如果是水平滚动，设置大盒子marginleft
        }else{
            element.style.marginTop=0;//如果是垂直滚动，设置大盒子margintop
        }
        
        //获取滚动的子元素div，并放到childElement数组中，方便管理
        childElement=[];
        for(var i=0,len=element.childNodes.length;i<len;i++){
            if(element.childNodes[i].nodeType===1 && element.childNodes[i].nodeName.toLowerCase()==="div"){
                childElement.push(element.childNodes[i]);
                //console.log(childElement)
            }
        }
        
        liStyle();
        //设置子元素div滚动页面的宽高样式
        for(var i=0,len=childElement.length;i<len;i++){
            if(slideDirection){
                childElement[i].style.width=1/(childElement.length)*100+"%";
            }else{
                childElement[i].style.width = document.body.offsetWidth + "px";
            }
        }
        //设置总盒子element的宽度
        if(slideDirection){//水平
            element.style.width=document.body.offsetWidth*childElement.length+"px";
        }else{
            //console.log(childElement)
        }
        //子元素的数量
        divnumber=childElement.length;
        
        //鼠标滚轮滚动事件的兼容
        var eventType="mousewheel";//谷歌、IE
        if(navigator.userAgent.indexOf("Firefox") > 0){
            eventType = "DOMMouseScroll";//Firefox
        }
        
        //绑定滚轮事件
        bindEvent(element,eventType,function(e){
            var event=e || event || window.event;
            if(eventType==="mousewheel"){ 
                if(event.wheelDelta>0){
                    console.log('上');
                    mouseDirection=0;//如果mouseDirection值为0，为上一张
                }else{
                    console.log('下');//如果mouseDirection值为1，为下一张
                    mouseDirection=1;
                }
            }else{
                if(event.detail > 0){
                    mouseDirection = 1;//向下
                }else{
                    mouseDirection = 0;//向上
                }
            }
            slidePage(e);
        },false)
    };
    
    //绑定事件 ---->浏览器的兼容
    function bindEvent(obj,type,fn){
        if(obj.addEventListener){
            obj.addEventListener(type,fn,false);
        }else if(obj.attachEvent){
            obj.attachEvent('on'+type,fn);
        }else{
            obj['on'+type]=fn;
        }
    }
    
    //更改导航图标的样式
    function changeStyle(divindex){
        //导航样式改变
        for(var i=0,len=li.length;i<len;i++){
            li[i].className="";
        }
        li[divindex].className="on";
    }
    
    //页面滚动操作
    function slidePage(e){
            //判断页面是否正在播放
            if(isSlide){
                return;
            }else{
                isSlide=true;
            }
            
            if(mouseDirection){//鼠标向下---->下一张
                if(slideDirection){//水平滚动
                    if(Math.abs(nowslide)<(divnumber-1)*100){
                        var nowWidth=0;
                        divindex++;
                        
                        changeStyle(divindex);
                        
                        var setTime=setInterval(function(){
                            if(nowWidth<100){
                                element.style.marginLeft=nowslide-nowWidth+"%";
                                nowWidth+=slideSpeed;
                            }else{
                                clearInterval(setTime);
                                element.style.marginLeft= -divindex*100 + "%";
                                nowslide = -divindex*100;
                                isSlide = false;
                            }
                        },2)
                    }else{
                        isSlide=false;
                    }
                }else{//垂直滚动
                    if(Math.abs(nowslide)<element.scrollHeight-bodyHeight){
                        //console.log(element.scrollHeight)
                        var nowHeight=0;
                        divindex++;
                        changeStyle(divindex);
                        var setTime=setInterval(function(){
                            if(nowHeight<bodyHeight){
                                element.style.marginTop=nowslide-nowHeight+"px";
                                nowHeight+=slideSpeed;
                            }else{
                                clearInterval(setTime);
                                element.style.marginTop=nowslide - bodyHeight + "px";
                                nowslide-=bodyHeight;
                                isSlide=false;
                            }
                        },2)
                    }else{
                        isSlide=false;
                    }
                }
            }else{//鼠标向上  ---->上一张
                if(nowslide<0){
                    if(slideDirection){//水平滚动
                        divindex--;

                        changeStyle(divindex);//对导航样式改变的一个封装
                        var nowWidth=0;
                        var setTime=setInterval(function(){
                           if(nowWidth<100) {
                               element.style.marginLeft= nowslide+ nowWidth+"%";
                               nowWidth+=slideSpeed;
                           }else{
                                clearInterval(setTime);
                                element.style.marginLeft= "-"+divindex*100+"%";
                                nowslide=-divindex*100;
                                isSlide = false;
                           }
                        },2)
                    }else{//竖直滚动
                        divindex--;
                        changeStyle(divindex);
                        var nowHeight=0;
                        var setTime=setInterval(function(){
                            if(nowHeight<bodyHeight){
                                element.style.marginTop=nowslide+nowHeight+"px";
                                nowHeight+=slideSpeed;
                            }else{
                                clearInterval(setTime);
                                element.style.marginTop=nowslide + bodyHeight + "px";
                                nowslide+=bodyHeight;
                                isSlide=false;
                            }
                        })
                    }
                }else{
                    isSlide=false;
                }
            }
    }
    
    bindEvent(window,"load",function(e){
        main(e);//绑定事件函数
    }); 
    //浏览器窗口调整
    bindEvent(window,'resize',function(e){
        //设置li的样式
        liStyle();
        if(slideDirection){
            element.style.width=document.body.offsetWidth*childElement.length+"px";
            document.getElementById(ele).style.marginLeft=-divindex*100 + "%";
        }else{
            bodyHeight=document.body.offsetHeight;
            document.getElementById(ele).style.marginTop=-divindex*bodyHeight+"px";
            nowslide=-divindex*bodyHeight;
            for(var i=0,len=childElement.length;i<len;i++){
                childElement[i].style.width = document.body.offsetWidth + "px";
            }
        }
    })
}