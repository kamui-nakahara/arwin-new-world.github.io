const ce=document.getElementById("my_canvas");
const cc=ce.getContext("2d");
const h1=document.getElementById("my_h1");
const button1=document.getElementById("input1");
const button2=document.getElementById("input2");
const button3=document.getElementById("input3");
const button4=document.getElementById("input4");
const button5=document.getElementById("input5");
const button6=document.getElementById("input6");
var blocks=Object();
var block=[250,-50];
var block2=[200,-50];
var move_blocks=Object();
var state=false;
var game="gamestart";
var cs=["#0000ff","#00ff00","#00ffff","#ff0000","#ff00ff","#ffff00","#ffffff"];
var now_color=[cs[random(0,6)],cs[random(0,6)]];
var flag=0;
var score=0;
var size=1;
function push(button){
    if (state){
        button.value="開始";
        state=false;
    }else{
        button.value="停止"
        state=true;
        mainloop();
    }
}
function push2(){
    rotate();
    put_block();
}
function push3(){
    left();
    put_block();
}
function push4(){
    right();
    put_block();
}
function push5(){
    fall();
    put_block();
}
function push6(button){
    if (button.value=="スマホモードに切り替え"){
        button.value="パソコンモードに切り替え";
        size=1.5;
        ce.width=750;
        ce.height=900;
        h1.style.fontSize="45px";
        input1.style.fontSize="45px";
        input2.style.fontSize="45px";
        input3.style.fontSize="45px";
        input4.style.fontSize="45px";
        input5.style.fontSize="45px";
        input6.style.fontSize="45px";
    }else{
        button.value="スマホモードに切り替え";
        size=1;
        ce.width=500;
        ce.height=600;
        h1.style.fontSize="30px";
        input1.style.fontSize="30px";
        input2.style.fontSize="30px";
        input3.style.fontSize="30px";
        input4.style.fontSize="30px";
        input5.style.fontSize="30px";
        input6.style.fontSize="30px";
    }
}
function random(x,y){
    return Math.floor(Math.random()*(y-x)*1.1)+x;
}
function put_block(){
    cc.fillStyle="#000000";
    cc.fillRect(0,0,500*size,600*size);
    for (var i in blocks){
        n=i.split(",");
        x=Number(n[0]);
        y=Number(n[1]);
        cc.fillStyle=blocks[i];
        cc.fillRect(x*size,y*size,50*size,50*size);
    }
    cc.fillStyle=now_color[0];
    cc.fillRect(block[0]*size,block[1]*size,50*size,50*size);
    cc.fillStyle=now_color[1];
    cc.fillRect(block2[0]*size,block2[1]*size,50*size,50*size);
}
function mainloop(){
    if (state){
        block[1]+=50;
        block2[1]+=50;
        if ([block[0],block[1]+50] in blocks | [block2[0],block2[1]+50] in blocks | block[1]===550 | block2[1]===550){
            blocks[block]=now_color[0];
            blocks[block2]=now_color[1];
            block=[250,-50];
            block2=[200,-50];
            now_color=[cs[random(0,6)],cs[random(0,6)]];
            flag=0;
        }
        var deletepositions={};
        for (var i in blocks){
            nu=i.split(",");
            p=[Number(nu[0]),Number(nu[1])];
            if (blocks[p]==blocks[[p[0],p[1]-50]] & blocks[p]==blocks[[p[0],p[1]+50]]){
                deletepositions[p]=0;
                deletepositions[[p[0],p[1]-50]]=0;
                deletepositions[[p[0],p[1]+50]]=0;
                score+=1;
            }
            if (blocks[p]==blocks[[p[0]-50,p[1]]] & blocks[p]==blocks[[p[0]+50,p[1]]]){
                deletepositions[p]=0;
                deletepositions[[p[0]-50,p[1]]]=0;
                deletepositions[[p[0]+50,p[1]]]=0;
                score+=1;
            }
            if (blocks[p]==blocks[[p[0]-50,p[1]-50]] & blocks[p]==blocks[[p[0]+50,p[1]+50]]){
                deletepositions[p]=0;
                deletepositions[[p[0]-50,p[1]-50]]=0;
                deletepositions[[p[0]+50,p[1]+50]]=0;
                score+=1;
            }
            if (blocks[p]==blocks[[p[0]-50,p[1]+50]] & blocks[p]==blocks[[p[0]+50,p[1]-50]]){
                deletepositions[p]=0;
                deletepositions[[p[0]-50,p[1]+50]]=0;
                deletepositions[[p[0]+50,p[1]-50]]=0;
                score+=1;
            }
        }
        for (var i=0;i<=500;i+=50){
            for (var j=0;j<=600;j+=50){
                if ([i,j] in deletepositions){
                    delete blocks[[i,j]];
                    for (var k=j;k>=0;k-=50){
                        if ([i,k] in blocks){
                            blocks[[i,k+50]]=blocks[[i,k]];
                            delete blocks[[i,k]];
                        }
                    }
                }
            }
        }
        put_block();
        for (var i=0;i<=500;i+=50){
            if ([i,0] in blocks){
                game="gameover";
                state=false;
                break;
            }
        }
        h1.textContent="SCORE:"+score;
        if (game=="gameover"){
            t=h1.textContent;
            h1.textContent=t+"  "+"Game Over";
            h1.style.color="red";
        }
        timer1=setTimeout(mainloop,500);
    }
}
function left(){
    if (block[0]!==0 & block2[0]!==0 & !([block[0]-50,block[1]] in blocks) & !([block2[0]-50,block2[1]] in blocks)){
        block[0]-=50;
        block2[0]-=50;
    }
}
function right(){
    if (block[0]!==450 & block2[0]!==450 & !([block[0]+50,block[1]] in blocks) & !([block2[0]+50,block2[1]] in blocks)){
        block[0]+=50;
        block2[0]+=50;
    }
}
function fall(){
    p1=[];
    p2=[];
    for (var i=0;i<=600;i+=50){
        if ([block[0],i] in blocks){p1.push(i-50)}
        if ([block2[0],i] in blocks){p2.push(i-50)}
    }
    if (String(p1)==""){p1=[500];}
    if (String(p2)==""){p2=[500];}
    y1=Math.min.apply(null,p1);
    y2=Math.min.apply(null,p2);
    Y=Math.min.apply(null,[y1,y2]);
    switch (flag){
        case 0:
            y1=Y;
            y2=Y;
            break;
        case 1:
            y1=Y;
            y2=y1-50
            break;
        case 2:
            y1=Y;
            y2=Y;
            break;
        case 3:
            y2=Y;
            y1=y2-50
            break;
    }
    block=[block[0],y1-50];
    block2=[block2[0],y2-50];
}
function rotate(){
    switch (flag){
        case 0:
            if (!([block2[0]+50,block2[1]-50] in blocks)){
                block2=[block2[0]+50,block2[1]-50];
                flag=1;
            }
            break;
        case 1:
            if (!([block2[0]+50,block2[1]+50] in blocks)){
                block2=[block2[0]+50,block2[1]+50];
                flag=2;
            }
            break;
        case 2:
            if (!([block2[0]-50,block2[1]+50] in blocks)){
                block2=[block2[0]-50,block2[1]+50];
                flag=3;
            }
            break;
        case 3:
            if (!([block2[0]-50,block2[1]-50] in blocks)){
                block2=[block2[0]-50,block2[1]-50];
                flag=0;
            }
            break;
    }
}
function key_down(e){
    var code=e.keyCode;
    switch (code){
        case 37:
            if (state){
                left();
                put_block();
            }
            break;
        case 39:
            if (state){
                right();
                put_block();
            }
            break;
        case 40:
            if (state){
                fall();
                put_block();
            }
            break;
        case 38:
            if (state){
                rotate();
                put_block();
            }
            break;
        case 32:
            if (state){
                state=false;
                button1.value="開始";
            }else{
                state=true;
                button1.value="停止";
                mainloop();
            }
            break;
    }
}
ce.setAttribute('tabindex',0);
ce.addEventListener("keydown",key_down,true);
