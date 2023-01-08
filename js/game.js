var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var health = 3;
var vriz = 400;
var strt = 1;

function sleep (time) 
{
return new Promise((resolve) => setTimeout(resolve, time));
}

// Завантажуємо зображення:
var bird = new Image(); //створюємо пташку
var bg = new Image(); //створюємо задній фон
var fg = new Image(); //створюємо передній фон
var pipeUp = new Image(); // створюємо перешкоду зверху
var pipeBottom = new Image(); // створюємо перешкоду знизу
var healthimg = new Image();
var game_over = new Image();

bird.src = "img/bird.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";
healthimg.src = "img/heart.png";
game_over.src = "img/gameover.png";

// Додаємо Звукові файли
var fly = new Audio();
var score_audio = new Audio();
var start_game = new Audio();
var boom = new Audio();
var lose = new Audio();

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";
start_game.src = "audio/letsgo.mp3";
boom.src = "audio/boom.mp3";
lose.src = "audio/gameover.mp3"

// Створюємо змінну яка буде використовуватися для додавання відступу між перешкодами.
var gap = 100;
// При натисканні любої клавіши птичка підлітає догори. Для цього використовуємо метод
document.addEventListener("keydown", moveUp);
// Створюємо функцію підйому пташки:
function moveUp() 
{
yPos -= 30;
// Підключаємо відтворення звуків:
if (strt == 1) {
    start_game.play();
    strt = 0;
}
else
{
    fly.play();
}
} 

// Для створення перешкод задаємо пустий масив:
var pipe = [];
// Створюємо перший об’єкт масиву:
pipe[0] = 
{
x : cvs.width, // задаємо координати по х
y : 0 // // задаємо координати по у
}
// Створюємо змінну для обчислення балів:
var score = 0;
// Створюємо змінні які відповідають за позицію пташки
var xPos = 10;
var yPos = 150;
// створюємо змінну переміщення пташки
var grav = 1.5;

function draw() 
{
// Малюємо задній фон:
ctx.drawImage(bg, 0, 0);
// Малюємо перешкоди:
for(var i = 0; i < pipe.length; i++) {  
    if (health > 0)
    {  
 // Малюємо інші картинки - перешкоди – фон зверху та знизу:
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
    // Задаємо переміщення блоків по х:
    pipe[i].x--;
    // Малюємо інші блоки:
    if(pipe[i].x == 100) {
    pipe.push({ // додаємо новій об’єкт в масив
    x : cvs.width,
    y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
    });
    }
    if (vriz == 400) 
    {   
    // Відслідковуємо врізання пташки перешкоду:
    if(xPos + bird.width >= pipe[i].x
    && xPos <= pipe[i].x + pipeUp.width
    && (yPos <= pipe[i].y + pipeUp.height
    || yPos + bird.height >= pipe[i].y + pipeUp.height + gap) 
    || yPos + bird.height >= cvs.height -fg.height)
    {
    vriz = 0;
    health--;
   if (health>=0) 
    {
        boom.play(); 
    }
  
    if (health <= 0) {
        ctx.drawImage(game_over,40,140);
        lose.play();
        sleep(4500).then(() => 
        {
            location.reload(); 
        });
        }
    }
    }
    else
    {
        vriz = vriz+1;
    }
    // Обчислюємо кількість балів
    if(pipe[i].x == 5) 
    {
    score++;
    score_audio.play();
    }
    }
    }
    // Малюємо передній фон знизу:
    ctx.drawImage(fg, 0, cvs.height - fg.height);
     if (health == 3) 
    {
        ctx.drawImage(healthimg,288-55, 512-55);  
        ctx.drawImage(healthimg,288-55-55, 512-55);
        ctx.drawImage(healthimg,288-55-55-55, 512-55);    
    }
    if (health == 2) 
    {
        ctx.drawImage(healthimg,288-55, 512-55);  
        ctx.drawImage(healthimg,288-55-55, 512-55);
        
    }
    if (health == 1) 
    {
        ctx.drawImage(healthimg,288-55, 512-55);  
    }

    // Малюємо пташку
    ctx.drawImage(bird, xPos, yPos);   
    
    // Змінюємо положення пташки на одиницю:
    if (yPos <= 0) 
    {
        yPos = 0;
        yPos += grav;
    }
    else
    {
    if (yPos >= 367) {
        yPos = 367;
    }
    else
    {
    yPos += grav;
    }
    }
    
    // Створюємо відображення кількості балів на екрані.
    ctx.fillStyle = "#000";
    ctx.font = "24px Verdana";
    ctx.fillText("Счет: " + score, 10, cvs.height - 20);
    if (health >0) 
    {
    // Для падіння пташки низ викликаємо функцію draw() постійно:
    requestAnimationFrame(draw);  
    }
    }
    // Викликаємо функцію draw() після того як всі зображення намальовані.
    if (health >0) 
    {
    pipeBottom.onload = draw;
    }
