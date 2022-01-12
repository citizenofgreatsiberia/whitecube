(function () {
    let coins = [];
    let enemies = [];
    const coinSound = document.querySelector('.coin-sound');

    const button = document.querySelector('.play');
    const modal = document.querySelector('.modal');
    const modalScore = document.querySelector('.score');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.querySelector('body').appendChild(canvas);
    let w, h;

    const config = {
        bgColor: '#17202A',
        coinCount: 5,
        enemiesCount: 10,
        colLine: 20,
        score: 0,
        opacity: 150,
        coinColor: 'rgba(255, 195, 0)',
    }

    const snake = {
        x: innerWidth / 2,
        y: innerHeight / 2,
        width: 20,
        height: 20,
        color: '#fff',
        speed: 5,
        key: undefined,
    }

    class Coin {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.color = config.coinColor;
            this.width = 20;
            this.height = 20;
        }
        reDraw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.closePath();
        }

        remove() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
        }
    }

    class Enemy {
        constructor() {
            this.x = Math.random() * w * 0.95;
            this.y = Math.random() * h * 0.95;
            this.color = '#CB4335';
            this.width = 20;
            this.height = 20;
            this.speedX = Math.random() * snake.speed;
            this.speedY = Math.random() * snake.speed;
        }
        reDraw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.closePath();
        }
        walk() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.x + this.speedX > w && this.speedX > 0 || this.x + this.speedX < 0 && this.speedX < 0 ? this.speedX *= -1 : this.speedX;
            this.y + this.speedY > h && this.speedY > 0 || this.y + this.speedY < 0 && this.speedY < 0 ? this.speedY *= -1 : this.speedY;
        }
    }

    function score() {
        ctx.font = "22px Arial";
        ctx.fillStyle = this.color;
        ctx.fillText(`Score: ${config.score}`, 20, 50);
    }

    function restart() {
        location.reload();
    }

    function reDrawSnake() {
        switch (snake.key) {
            case 'ArrowRight':
                snake.x += snake.speed;
                break;
            case 'ArrowLeft':
                snake.x -= snake.speed;
                break;
            case 'ArrowUp':
                snake.y -= snake.speed;
                break;
            case 'ArrowDown':
                snake.y += snake.speed;
                break;
        }
        snake.x > w && snake.key == 'ArrowRight' ? snake.x -= w : snake.x;
        snake.x < 0 && snake.key == 'ArrowLeft' ? snake.x += w : snake.x;
        snake.y < 0 && snake.key == 'ArrowUp' ? snake.y += h : snake.y;
        snake.y > h && snake.key == 'ArrowDown' ? snake.y -= h : snake.y;
        ctx.beginPath();
        ctx.fillStyle = snake.color;
        ctx.closePath();
        ctx.fillRect(snake.x, snake.y, snake.width, snake.height);
    }

    function moveSnake(event) {
        snake.key = event.code;
    }

    function reDrawBackground() {
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, w, h);
    }

    function reDrawCoin() {
        for (let i = 0; i < coins.length; i++) {
            coins[i].reDraw();
        }
    }

    function updateCoins() {
        for (let i = 0; i < coins.length; i++) {
            let coinCenter = { x: coins[i].x + coins[i].width / 2, y: coins[i].y + coins[i].height / 2 };
            let snakeCenter = { x: snake.x + snake.width / 2, y: snake.y + snake.height / 2 };
            let distX = Math.abs(coinCenter.x - snakeCenter.x);
            let distY = Math.abs(coinCenter.y - snakeCenter.y);
            let dist = Math.sqrt(distX * distX + distY * distY) || 1;
            let alpha = config.opacity / dist;
            coins[i].color = `rgba(255, 195, 0, ${alpha})`;
        }
    }

    function reDrawEnemies() {
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].reDraw();
            enemies[i].walk();
        }
    }

    function coinCollision() {
        for (let i = 0; i < coins.length; i++) {
            let coinCenter = { x: coins[i].x + coins[i].width / 2, y: coins[i].y + coins[i].height / 2 };
            let snakeCenter = { x: snake.x + snake.width / 2, y: snake.y + snake.height / 2 };
            if (Math.abs(snakeCenter.x - coinCenter.x) < config.colLine && Math.abs(snakeCenter.y - coinCenter.y) < config.colLine) {
                coins[i].remove();
                config.score++;
                coinSound.play();
            }
        }
    }

    function enemiesCollision() {
        for (let i = 0; i < enemies.length; i++) {
            let enemyCenter = { x: enemies[i].x + enemies[i].width / 2, y: enemies[i].y + enemies[i].height / 2 };
            let snakeCenter = { x: snake.x + snake.width / 2, y: snake.y + snake.height / 2 };
            if (Math.abs(snakeCenter.x - enemyCenter.x) < config.colLine && Math.abs(snakeCenter.y - enemyCenter.y) < config.colLine) {
                snake.speed = 0;
                for (let i = 0; i < enemies.length; i++) {
                    enemies[i].speedX = 0;
                    enemies[i].speedY = 0;
                }
                modalScore.innerHTML = `Your score: ${config.score}`;
                setTimeout(() => {
                    modal.classList.add('active');
                }, 600);
            }
        }
    }

    function loop() {
        reDrawBackground();
        coinCollision();
        enemiesCollision();
        reDrawCoin();
        reDrawEnemies();
        reDrawSnake();
        updateCoins();
        score();
        window.requestAnimationFrame(loop);
    }

    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;

        for (let i = 0; i < config.coinCount; i++) {
            coins.push(new Coin());
        }

        for (let i = 0; i < config.enemiesCount; i++) {
            enemies.push(new Enemy());
        }

        loop();
    }
    init();
    button.addEventListener('click', restart);
    document.addEventListener('keydown', moveSnake);
}());