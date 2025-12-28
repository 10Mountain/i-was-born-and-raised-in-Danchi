class Enemy {
    constructor(game) {
        this.game = game;
        this.markedForDeletion = false;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        this.x -= this.speedX + this.game.speed;
        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        }
        if (this.x < 0 - this.width) this.markedForDeletion = true;
    }

    draw(ctx) {
        if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight, this.x, this.y, this.width, this.height);
        } else {
            // Fallback for when image is not loaded or generated yet
            ctx.fillStyle = this.color || 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }


}

class GroundEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.width = 100;
        this.height = 60; // Slightly taller for cuteness
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin + 20; // Lowered to sit on ground
        this.image = new Image();
        this.image.src = 'assets/enemy_car.png';
        this.speedX = 0; // Ground enemy moves with the ground
        this.speedY = 0;
        this.color = 'red'; // Cute Red Car
        this.maxFrame = 0; // Static image
    }

    draw(ctx) {
        if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight, this.x, this.y, this.width, this.height);
        } else {
            // Procedural Cute Red Car Drawing
            ctx.fillStyle = this.color;

            // Main Body (Rounded)
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y + 30);
            ctx.lineTo(this.x + 90, this.y + 30);
            ctx.quadraticCurveTo(this.x + 100, this.y + 30, this.x + 100, this.y + 50);
            ctx.lineTo(this.x + 100, this.y + 50);
            ctx.lineTo(this.x, this.y + 50);
            ctx.quadraticCurveTo(this.x, this.y + 30, this.x + 10, this.y + 30);
            ctx.fill();

            // Roof (Rounded Bubble)
            ctx.beginPath();
            ctx.arc(this.x + 50, this.y + 30, 25, Math.PI, 0);
            ctx.fill();

            // Windows (Light Blue)
            ctx.fillStyle = '#87CEEB';
            ctx.beginPath();
            ctx.arc(this.x + 50, this.y + 30, 18, Math.PI, 0);
            ctx.fill();

            // Wheels
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + 25, this.y + 50, 12, 0, Math.PI * 2);
            ctx.arc(this.x + 75, this.y + 50, 12, 0, Math.PI * 2);
            ctx.fill();

            // Hubcaps
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x + 25, this.y + 50, 5, 0, Math.PI * 2);
            ctx.arc(this.x + 75, this.y + 50, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class FlyingEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.width = 60;
        this.height = 40;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() * 2 + 1; // 1 to 3 speed
        this.speedY = 0;
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
        this.image = new Image();
        this.image.src = 'assets/enemy_crow.png';
        this.color = 'black'; // Black for crow
        this.maxFrame = 0; // Static image
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }

    draw(ctx) {
        if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight, this.x, this.y, this.width, this.height);
        } else {
            // Procedural Crow Drawing
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Body
            ctx.ellipse(this.x + 30, this.y + 20, 20, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            // Wings (flap based on time/angle)
            ctx.beginPath();
            ctx.moveTo(this.x + 30, this.y + 20);
            if (Math.sin(this.angle * 5) > 0) {
                // Wing up
                ctx.lineTo(this.x + 30, this.y - 10);
                ctx.lineTo(this.x + 50, this.y + 20);
            } else {
                // Wing down
                ctx.lineTo(this.x + 30, this.y + 40);
                ctx.lineTo(this.x + 50, this.y + 20);
            }
            ctx.fill();

            // Beak
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 20);
            ctx.lineTo(this.x + 10, this.y + 25);
            ctx.lineTo(this.x + 10, this.y + 15);
            ctx.fill();
        }
    }
}
