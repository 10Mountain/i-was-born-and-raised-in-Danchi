// Imports removed for local file compatibility


window.addEventListener('load', function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 932;
    canvas.height = 430;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 40;
            this.speed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler();
            this.platforms = [];
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1500;
            this.score = 0;
            this.highScore = parseInt(localStorage.getItem('danchiRunnerHighScore')) || 0;
            this.gameOver = false;
            this.addPlatforms();
        }

        addPlatforms() {
            // Add some test platforms
            this.platforms.push(new Platform(this, 200, 280, 140, 14));
            this.platforms.push(new Platform(this, 450, 210, 140, 14));
            this.platforms.push(new Platform(this, 700, 315, 140, 14));
        }

        update(deltaTime) {
            if (this.gameOver) {
                if (this.input.keys.includes('Enter')) {
                    this.restart();
                }
                return;
            }
            this.background.update();
            this.platforms.forEach(platform => platform.update());
            this.player.update(this.input.keys, deltaTime, this.platforms);

            // Enemies
            if (this.enemyTimer > this.enemyInterval) {
                if (Math.random() < 0.5) {
                    this.enemies.push(new GroundEnemy(this));
                } else {
                    this.enemies.push(new FlyingEnemy(this));
                }
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (this.checkCollision(this.player, enemy)) {
                    this.triggerGameOver();
                }
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            // Add new platforms as we move
            if (this.platforms.length > 0) {
                let lastPlatform = this.platforms[this.platforms.length - 1];
                if (lastPlatform.x < this.width) {
                    let x = this.width + 70 + Math.random() * 140;
                    let y = Math.random() * (this.height - 140 - this.groundMargin) + 70;
                    this.platforms.push(new Platform(this, x, y, 140, 14));
                }
            }

            // Remove off-screen platforms
            this.platforms = this.platforms.filter(platform => platform.x + platform.width > 0);

            // Score
            this.score++;
            if (this.score > this.highScore) {
                this.highScore = this.score;
            }
            if (this.score % 100 === 0) {
                this.sound.playScore();
            }

            // Fall off check
            if (this.player.y > this.height) {
                this.triggerGameOver();
            }
        }

        draw(ctx) {
            this.background.draw(ctx);
            this.platforms.forEach(platform => platform.draw(ctx));
            this.enemies.forEach(enemy => enemy.draw(ctx));
            this.player.draw(ctx);

            // UI
            ctx.fillStyle = 'black';
            ctx.font = '30px Helvetica';
            ctx.fillText('Score: ' + this.score, 20, 50);
            ctx.fillText('High Score: ' + this.highScore, 20, 80);

            if (this.gameOver) {
                ctx.textAlign = 'center';
                ctx.fillStyle = 'black';
                ctx.fillText('GAME OVER', this.width * 0.5, this.height * 0.5);
                ctx.fillText('Press Enter to Restart', this.width * 0.5, this.height * 0.5 + 40);
                ctx.textAlign = 'left';
            }
        }

        checkCollision(player, enemy) {
            return (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            );
        }

        restart() {
            this.player = new Player(this);
            this.platforms = [];
            this.enemies = [];
            this.score = 0;
            this.gameOver = false;
            this.addPlatforms();
            this.speed = 3;
            // Hide restart button if it exists (handled in main scope usually, but we can emit event or handle UI update in update loop)
            const restartBtn = document.getElementById('restartBtn');
            if (restartBtn) restartBtn.style.display = 'none';

            // Restart music
            if (this.sound) this.sound.play();
        }
        triggerGameOver() {
            if (!this.gameOver) {
                this.gameOver = true;
                this.sound.playHit(); // Play hit sound first
                setTimeout(() => this.sound.playGameOver(), 500); // Delay game over sound slightly
                localStorage.setItem('danchiRunnerHighScore', this.highScore);

                const restartBtn = document.getElementById('restartBtn');
                if (restartBtn) restartBtn.style.display = 'block';
            }
        }
    }

    const game = new Game(canvas.width, canvas.height);
    const sound = new SoundController();
    game.sound = sound;
    console.log('Game initialized', game);
    let lastTime = 0;

    // Start Screen Logic
    const startScreen = document.getElementById('startScreen');
    let gameStarted = false;

    startScreen.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameStarted = true;
        sound.play();
        animate(0);
    });

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            game.restart();
            restartBtn.style.display = 'none';
        });
    }

    function animate(timeStamp) {
        if (!gameStarted) return;
        // console.log('Animating...');
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);

        requestAnimationFrame(animate);
    }
    // Removed animate(0) call from bottom, now called on click
});
