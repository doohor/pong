
//Create Environment
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

//Create Users
const user = {
    x : 3,
    y : (canvas.height-100)/2,
    width : 10,
    height : 100,
    color : "White",
    score : 0
}

const computer = {
    x : canvas.width - (user.width+3),
    y : (canvas.height-100)/2,
    width : 10,
    height : 100,
    color : "White",
    speed : 1,
    score: 0,
    AI: 0.01
}


//Create Ball
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 1,
    //ball velocity
    dx : 5,
    dy : 5,
    color : "White"
}

function drawRect(x,y,w,h,color){
    context.fillStyle = color;
    context.fillRect(x,y,w,h);    
}

const net ={
    x : canvas.width/2 -1,
    y : 0,
    width : 2,
    height : 10,
    color : "white"
}

function drawNet(){
    for(let i =0; i<= canvas.height; i +=15){
        drawRect(net.x,net.y + i,net.width,net.height, net.color);
    }
}

function drawCircle(x,y,r,color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x,y,r,0,2*Math.PI,false);
    context.closePath();
    context.fill();
}

function drawText(text,x,y,color){
    context.fillStyle= color;
    context.font = "45px fantasy";
    context.fillText(text,x,y);
}

//render game

function render(){
    //canvas
    drawRect(0,0,canvas.width,canvas.height,"black");
    drawNet();
    //Score
    //drawText("testing", canvas.width/4,canvas.height/5, "white");
    drawText(user.score,canvas.width/4,canvas.height/5,"white");
    drawText(computer.score,canvas.width*3/4,canvas.height/5,"white");
    
    //User Paddle
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(computer.x,computer.y,computer.width,computer.height);


    //draw ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}

//update pos/ mov/ score
function update(){
    //ball
    ball.x += ball.speed*ball.dx;
    ball.y += ball.speed*ball.dy;

    console.log(ball.x);
    console.log(ball.y);
    //computer
    computerAI();
    //User Keypad
    if(upPressed) {
        //update position of upser paddle going up as long as within canvas screen size (user.y = 150 initially)
        if(user.y >= 0)
        user.y -= 5;
    }
    else if(downPressed) {
        if(user.y <= (canvas.height - user.height))
        user.y +=5;
    }
}

function reset(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
}

function score(){
    //user scores
    if(ball.x > canvas.width){
        user.score ++;
        reset();
        render();
    }
    //computer scores
    else if(ball.x < 0){
        computer.score ++;
        reset();
        render();
    }
}

function collision(){

    //if ball goes out of up and down boundary
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
    }
    
    //Simple paddle collision

    //computer paddle
    else if(ball.x + ball.radius > computer.x && ball.y >= computer.y && ball.y <= computer.y + computer.height){
        ball.dx = -ball.dx;
        if(ball.speed <= 3){
            ball.speed = ball.speed + 0.5;
        }

        //ball.acceleration++;
    }
    
    //user paddle
    else if( ball.x - ball.radius < user.x + user.width && ball.y >= user.y && ball.y <= user.y + user.height ){
        ball.dx = -ball.dx;
        if(ball.speed <= 3){
            ball.speed = ball.speed + 0.5;
        }
        //ball.acceleration++;
    }

    //score

    //user scores
    else if(ball.x>canvas.width){
        score();
        computer.AI += 0.1;
        ball.speed = 1;
    }

    //computer scores
    else if(ball.x < 0){
        score();
        ball.speed = 1;
    }
}


function gameplay(){
    render();
    update();
    collision();
}

const framePerSecond = 50;
//setinterval functions(x,1000) -> x every 1000 miliseconds(1sec)
setInterval(gameplay,1000/framePerSecond);


//Paddle movements

var upPressed = false;
var downPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 38) {
        upPressed = true;
    }
    else if(e.keyCode == 40) {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 38) {
        upPressed = false;
    }
    else if(e.keyCode == 40) {
        downPressed = false;
    }
}

////////////////////////////
//computer AI//

function computerAI(){
    
    computer.y = ball.y - computer.AI*(computer.height/2);  
    //constraint
    if(computer.y < 0){
        computer.y = 0;
    }
    if(computer.y > canvas.height - computer.height){
        computer.y = canvas.height - computer.height;
    }

    if(computer.y > ball.y){
        computer.y = computer.y - computer.speed
    }
    else {
        computer.y = computer.y + computer.speed
    }
}