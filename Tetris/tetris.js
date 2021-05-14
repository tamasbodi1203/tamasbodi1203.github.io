/**
 * Név: Bódi Tamás
 * Neptun: DZ6EHI
 * hxxx azonosító: h751255
 */

const canvas = document.getElementById('gameArea');
const ctx = canvas.getContext('2d');

ctx.scale(20,20);

// Audio
let rotateAudio = new Audio('audio/rotate.wav');
let scoreAudio = new Audio('audio/score.wav')
let moveAudio = new Audio('audio/move.wav');
let themeAudio = new Audio('audio/themeSong.wav')
themeAudio.volume = 0.5;
themeAudio.loop = true;

let paused = true;
let gameOver = false;

// Játék indítása / szüneteltetése
window.onload = function(){
    fillScoreBoard();
    let button = document.getElementById('startBtn');
    button.addEventListener('click', event =>{
        if (button.innerText === 'START') {
            player.name = prompt("Your name: ", "Noobmaster69");
            if (player.name === "") player.name = 'Noobmaster69';
            document.getElementById("currentPlayer").innerText = player.name;
            themeAudio.play();
            paused = false;
            button.innerText = 'PAUSE';
        } else if (button.innerText === 'PAUSE') {
            paused = true;
            button.innerText = 'CONTINUE';
        } else if (button.innerText === 'CONTINUE') {
            paused = false;
            button.innerText = 'PAUSE';
        } else if (button.innerText === 'START NEW GAME') {
            arena.forEach(row => row.fill(0));
            player.score = 0;
            updateScore();
            player.name = prompt("Your name: ", "Noobmaster69");
            paused = false;
            button.innerText = 'PAUSE';
        }
    });

    // Zene némítása
    let muteButton = document.getElementById('muted');
    muteButton.addEventListener('click', event =>{
        if (themeAudio.volume != 0){
            themeAudio.volume = 0;
        } else {
            themeAudio.volume = 0.5;
        }
    });
}

// Toplista feltöltése
function fillScoreBoard() {
    var data = [];
    for (var i = 0; i < localStorage.length; i++) {
        data[i] = [localStorage.key(i), localStorage.getItem(localStorage.key(i))];
        console.log("Játék végén: " + localStorage.key(i));
        console.log("Játék végén: " + localStorage.getItem(localStorage.key(i)));
    }
    // Elemek csökkenő sorrendbe helyezése
    data.sort(function (a, b) {
        return b[1] - a[1];
    });
    // a 3 legtobb pontot elert jatekost jelezzuk ki a listan
    if (data[0] != null) {
        document.getElementById("firstScore").innerText = data[0][1];
        document.getElementById("firstPlayer").innerText = data[0][0];
    }
    if (data[1] != null) {
        document.getElementById("secondScore").innerText = data[1][1];
        document.getElementById("secondPlayer").innerText = data[1][0];
    }
    if (data[2] != null) {
        document.getElementById("thirdScore").innerText = data[2][1];
        document.getElementById("thirdPlayer").innerText = data[2][0];
    }


}

// Elemek mátrixa
function createPiece(type){
    color = getRandomColor();
    if (type === 'T') {
        return [
            [color,color,color],
            [0,color,0],
            [0,0,0]
        ];
    }
    if (type === 'O') {
        return [
            [color,color],
            [color,color],
        ];
    }
    if (type === 'L') {
        return [
            [0,color,0],
            [0,color,0],
            [0,color,color],
        ];
    }
    if (type === 'J') {
        return [
            [0,color,0],
            [0,color,0],
            [color,color,0],
        ];
    }
    if (type === 'I') {
        return [
            [0,color,0,0],
            [0,color,0,0],
            [0,color,0,0],
            [0,color,0,0]
        ];
    }
    if (type === 'S') {
        return [
            [0,color,color],
            [color,color,0],
            [0,0,0],
        ];
    }
    if (type === 'Z') {
        return [
            [color,color,0],
            [0,color,color],
            [0,0,0],
        ];
    }
}

// Játéktér megrajzolása
function draw(){
    ctx.fillStyle = '#323131';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // Négyzetrácsos háttér
    arena.forEach((row, y) => {
        row.forEach((value,x) => {
                ctx.lineWidth = 0.001;
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x, y, 1, 1);
                    });
    });

    drawMatrix(arena, {x: 0, y:0});
    drawMatrix(player.matrix, player.position);
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
        scoreAudio.play();
    }
}

function collide(arena, player) {
    const [matrix, offset] = [player.matrix, player.position];
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < matrix[y].length; ++x) {
                if (matrix[y][x] !== 0 && (arena[y + offset.y] && arena[y + offset.y][x + offset.x]) !== 0) {
                    return true;
                }
            }
        }

    return false;
}

function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

const colors = [
    null,
    'red',
    'green',
    'blue',
    'purple'

];

function getRandomColor(){
   random = Math.floor(Math.random() * colors.length);
   if (random === 0) getRandomColor();
   return random;
}

// Elemek kirajzolása
function drawMatrix(matrix, offset){
    matrix.forEach((row, y) => {
        row.forEach((value,x) => {
            if (value !== 0) {
                ctx.fillStyle = colors[value];
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1);

                // Körvonal
                ctx.lineWidth = 0.075;
                ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.position.y][x + player.position.x ] = value;
            }
        });
    });
}

function updateScore(){
    document.getElementById('currentScore').innerText = player.score;
}

function playerDrop(){
    player.position.y++;
    if (collide(arena, player)) {
        player.position.y--;
        merge(arena,player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.position.y = 0;
    player.position.x = (arena[0].length /2 | 0) - (player.matrix[0].length / 2 | 0);

    //GameOver
    if (collide(arena, player)) {
        paused = true;
        gameOver = true;
        document.getElementById('startBtn').innerText = 'START NEW GAME';
        localStorage.setItem(player.name, player.score);
        if (player.score > document.getElementById("firstScore").innerText){
            console.log("új elsőhely");
            alert("Congratulations, new highest score!");
        } else {
            alert("Game Over!");
        }
        fillScoreBoard();
    }
}

// Mozgatás
function playerMove(direction) {
    player.position.x += direction;
    if (collide(arena, player)) {
        player.position.x -= direction;
    }
}

// Forgatás
function playerRotate(direction){
    const position = player.position.x;
    let offset = 1;
    rotate(player.matrix, direction);
    while (collide(arena,player)) {
        player.position.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -direction);
            player.position.x = position;
            return;
        }
    }
}

// Mátrix transzponálása (sorokból oszlopok) -> Oszlopok tükrözése = Forgatás
function rotate(matrix, direction) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    if (direction > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0){
    const deltaTime = time - lastTime;
    lastTime = time;
    //console.log(deltaTime);

    dropCounter += deltaTime;
    if (dropCounter > dropInterval && !paused) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

// 12x20 négyzet méretű játéktér
const arena = createMatrix(12, 20);

const player = {
    name: 'Noobmaster69',
    position: {x:0, y:0},
    matrix: null,
    score: 0,
}

// Elemek irányítása
document.addEventListener('keydown', event =>{
    if (!paused) {
        if (event.key === 'ArrowLeft') {
            playerMove(-1);
            moveAudio.load();
            moveAudio.play();
        }
        if (event.key === 'ArrowRight') {
            playerMove(1);
            moveAudio.load();
            moveAudio.play();
        }
        if (event.key === 'ArrowDown') {
            playerDrop();
            moveAudio.load();
            moveAudio.play();
        }
        if (event.key === 'ArrowUp') {
            playerRotate(-1);
            rotateAudio.load();
            rotateAudio.play();
        }
    }
});

playerReset();
update();
