'use strict'
/*---common---*/
const bodyElement = document.querySelector('body');
const canvasPlaySpace = document.createElement('canvas');
const ctx = canvasPlaySpace.getContext('2d');
bodyElement.append(canvasPlaySpace);

let coins = [];
let enemies = [];
const width = innerWidth;
const height = innerHeight;
/*---common---*/

/*---modal variables---*/
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal-text');
const modalBtn = document.querySelector('.modal-btn');
/*---modal variables---*/

/*---options---*/
const options = {
    score: 0,
    coins: 5,
    enemies: 10,
    cubeSize: 20,
    speed: 5,
    colLine: 20,
    levelingFactor: 0.95,
    bgColor: '#34495E',
};
/*---options---*/

/*---player---*/
const player = {
    x: width / 2,
    y: height / 2,
    color: '#fff',
    initialSpeed: 5,
    maxSpeed: 20,
    size: 20,
    key: null,
};
/*---player---*/

/*---coins---*/
class Coin {
    constructor() {
        this.x = Math.random() * width * options.levelingFactor;
        this.y = Math.random() * height * options.levelingFactor;
        this.color = '#F1C40F';
        this.size = 20;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    remove() {
        this.x = Math.random() * width * options.levelingFactor;
        this.y = Math.random() * height * options.levelingFactor;
    }
}
/*---coins---*/

/*---enemies---*/
class Enemy {
    constructor() {
        this.x = Math.random() * width * options.levelingFactor;
        this.y = Math.random() * height * options.levelingFactor;
        this.color = '#C0392B';
        this.size = 20;
        this.speedX = options.speed * Math.random();
        this.speedY = options.speed * Math.random();
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    walk() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.x + this.speedX > width && this.speedX > 0 || this.x + this.speedX < 0 && this.speedX < 0 ? this.speedX *= -1 : this.speedX;
        this.y + this.speedY > height && this.speedY > 0 || this.y + this.speedY < 0 && this.speedY < 0 ? this.speedY *= -1 : this.speedY;
    }
}
/*---enemies---*/

/*---score counter---*/
function score() {
    ctx.font = "22px Arial";
    ctx.fillStyle = '#fff';
    ctx.fillText(`Score: ${options.score}`, 20, 50);
}

function viewCounter() {

}
/*---score counter---*/

/*---modal---*/
const endModal = {
    title: 'Game over!',
    btnText: 'RERUN'
}

const startModal = {
    title: 'Welcome!',
    text: `Используя клавиши-стрелки, перемещайте белый квадрат. Собирайте желтые квадраты и уклоняйтесь от красных. С каждым желтым квадратом количество очков и скорость белого квадрата будут возрастать. Столкновение с красным квадратом приведет к завершению игры.`,
    btnText: 'START',
}

function renderStartModal() {
    if (!modal.classList.contains('start')) {
        modal.classList.add('active', 'start');
        modalText.innerHTML = startModal.text;
        modalTitle.innerHTML = startModal.title;
        modalBtn.innerHTML = startModal.btnText;
    }

}

function renderEndModal() {
    modal.classList.add('active');
    modalText.innerHTML = `Your score: ${options.score}`;
    modalTitle.innerHTML = endModal.title;
    modalBtn.innerHTML = endModal.btnText;
}

function runModalEvent() {
    if (modal.classList.contains('start')) {
        modal.classList.remove('active', 'start');
        init();
    } else {
        location.reload();
    }
}
/*---modal---*/

/*---mechanics---*/
function redrawBG() {
    ctx.fillStyle = options.bgColor;
    ctx.fillRect(0, 0, width, height);
}

function movePlayer(event) {
    player.key = event.code;
}

function boostPlayer() {
    if (player.initialSpeed < player.maxSpeed) {
        player.initialSpeed += 0.5;
    }
}

function redrawPlayer() {
    switch (player.key) {
        case 'ArrowRight':
            player.x > width ? player.x -= width : player.x += player.initialSpeed;
            break;
        case 'ArrowLeft':
            player.x < 0 ? player.x += width : player.x -= player.initialSpeed;
            break;
        case 'ArrowDown':
            player.y > height ? player.y -= height : player.y += player.initialSpeed;
            break;
        case 'ArrowUp':
            player.y < 0 ? player.y += height : player.y -= player.initialSpeed;
            break;
    }

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function redrawCoins() {
    for (let i = 0; i < coins.length; i++) {
        coins[i].draw();
    }
}

function coinCollisions() {
    for (let i = 0; i < coins.length; i++) {
        const coinCenter = { x: coins[i].x + coins[i].size / 2, y: coins[i].y + coins[i].size / 2 };
        const playerCenter = { x: player.x + player.size / 2, y: player.y + player.size / 2 };

        if (Math.abs(playerCenter.x - coinCenter.x) < options.colLine && Math.abs(playerCenter.y - coinCenter.y) < options.colLine) {
            options.score++;
            coins[i].remove();
            boostPlayer();
        }
    }
}

function redrawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        enemies[i].walk();
    }
}

function enemiesCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        const enemyCenter = { x: enemies[i].x + enemies[i].size / 2, y: enemies[i].y + enemies[i].size / 2 };
        const playerCenter = { x: player.x + player.size / 2, y: player.y + player.size / 2 };

        if (Math.abs(playerCenter.x - enemyCenter.x) < options.colLine && Math.abs(playerCenter.y - enemyCenter.y) < options.colLine) {
            player.initialSpeed = 0;
            renderEndModal();
            for (let i = 0; i < enemies.length; i++) {
                enemies[i].speedX = 0;
                enemies[i].speedY = 0;
            }
        }
    }
}

/*---mechanics---*/

/*---requestAnimationFrameLoop---*/
function loop() {
    redrawBG();
    redrawPlayer();
    redrawCoins();
    coinCollisions();
    redrawEnemies();
    enemiesCollisions();
    score();
    window.requestAnimationFrame(loop);

}
/*---requestAnimationFrameLoop---*/

/*---init function---*/
function init() {
    canvasPlaySpace.width = width;
    canvasPlaySpace.height = height;

    for (let i = 0; i < options.coins; i++) {
        coins.push(new Coin());
    }

    for (let i = 0; i < options.enemies; i++) {
        enemies.push(new Enemy());
    }
    loop();
}
renderStartModal();
/*---init function---*/

modalBtn.addEventListener('click', runModalEvent);
document.addEventListener('keydown', movePlayer);