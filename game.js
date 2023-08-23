const canvas = document.querySelector('#game');
//el getContext se usa para señalizar las dimensiones en la que vamos usar el formato de la pagina si en una dimension, dos dimensiones o tres dimensiones
const game = canvas.getContext ('2d');
const BtnUp = document.querySelector('#up');
const BtnLeft = document.querySelector('#left');
const BtnRight = document.querySelector('#right');
const BtnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

//variables globales
let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition =
{
    x: undefined,
    y: undefined,
};
const giftPosition =
{
    x: undefined,
    y: undefined,
};

let enemyPositions = [];

//esto para visualizar si llegan a ver errores mas adelante
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function fixNumber(n)
{
    return Number(n.tofixed(2));
}


function setCanvasSize()
{
    if(window.innerHeight > window.innerWidth)
    {
        canvasSize = window.innerWidth * 0.7;
    } else
    {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
    
    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
}

function startGame() 
{   
    console.log({canvasSize, elementsSize});
    
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';
    
    const map = maps[level];

    if(!map)
    {
        gameWin();
        return;
    }

    if(!timeStart)
    {
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map( row => row.trim().split(''));
    console.log({map,mapRows, mapRowCols});

    showLives();
    
    enemyPositions = [];
    game.clearRect(0,0,canvasSize, canvasSize);

    mapRowCols.forEach( ( row, rowI ) => { row.forEach((col, colI) =>
            { 
                const emoji = emojis[col]; 
                const posX = elementsSize * (colI + 1);
                const posY = elementsSize * (rowI + 1);

                if ( col == 'O')
                {
                    if (!playerPosition.x && !playerPosition.y)
                    {
                        playerPosition.x = posX;
                        playerPosition.y = posY;
                        console.log({playerPosition});
                    }
                } else if ( col == 'I')
                {
                    giftPosition.x = posX;
                    giftPosition.y = posY;
                } else if (col == 'X')
                {
                    enemyPositions.push
                    (
                        {
                            x: posX,
                            y: posY,
                        }
                    );
                }

                game.fillText(emoji, posX, posY);
            }); 
        });

        movePlayer();
}

function movePlayer()
{
    const giftColitionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftColitionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftColition = giftColitionX && giftColitionY; 

    if(giftColition)
    {
        levelWin();
    }
    
    const enemyColition = enemyPositions.find(enemy =>
    {
        const enemyColitionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyColitionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyColitionX && enemyColitionY;
    });

    if (enemyColition)
    {
        levelFail();
    }

    game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y);
}

function levelWin()
{
    console.log('Subiste de nivel');
    level++;
    startGame();
}
function levelFail()
{   
    console.log(lives);
    lives--;

    if ( lives <= 0)
    {
        level = 0;
        lives = 3;
        timeStart = undefined;
    } 
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}
function gameWin()
{
    console.log('Terminaste el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime)
    {
        if(recordTime >= playerTime)
        {
            localStorage.setItem('record_time',playerTime)
            pResult.innerHTML = 'SUPERASTE EL RECORD :D';
        } else 
        {
            pResult.innerHTML = 'lo siento, no superaste el record :C';
        }
    }  
    else 
    {
        localStorage.setItem('record_time',playerTime);
        pResult.innerHTML = 'Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)';
    }

    console.log({recordTime, playerTime});
}

function showLives()
{   
    const heartsArray = Array(lives).fill(emojis['HEART']);
    spanLives.innerHTML = "";
    heartsArray.forEach(heart => spanLives.append(heart));
    
}

function showTime()
{
    spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord()
{
    spanRecord.innerHTML = localStorage.getItem('record_time');
}
window.addEventListener('keydown',moveByKeys);
BtnUp.addEventListener('click', moveUp); 
BtnLeft.addEventListener('click', moveLeft); 
BtnRight.addEventListener('click', moveRight); 
BtnDown.addEventListener('click', moveDown); 

function moveByKeys(event)
{
    if (event.key == 'ArrowUp') moveUp();
    else if ( event.key == 'ArrowLeft') moveLeft();
    else if ( event.key == 'ArrowRight') moveRight();
    else if ( event.key == 'ArrowDown') moveDown();
}

function moveUp()
{
    console.log('Me quiero mover hacia arriba');
    if(Math.floor(playerPosition.y) > elementsSize)
    {
        playerPosition.y = (playerPosition.y - elementsSize);
        startGame();
    }
}

function moveLeft()
{
    console.log('Me quiero mover hacia izquierda');
    if(Math.floor(playerPosition.x) > elementsSize)
    {
        playerPosition.x = (playerPosition.x - elementsSize);
        startGame();
    }
}

function moveRight()
{
    console.log('Me quiero mover hacia derecha');
    if(Math.ceil(playerPosition.x) < 10*elementsSize)
    {
        playerPosition.x = (playerPosition.x + elementsSize);
        startGame();
    }
}

function moveDown()
{
    console.log('Me quiero mover hacia hacia abajo');
    if(Math.ceil(playerPosition.y) < 10*elementsSize)
    {
        playerPosition.y = (playerPosition.y + elementsSize);
        startGame();
    }
}

