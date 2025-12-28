class Player {
    constructor(game) {
        this.game = game;
        this.width = 100; // Adjusted for sprite size
        this.height = 100;
        this.x = 100;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.jumpStrength = 24;
        this.speed = 0;
        this.maxSpeed = 6;
        this.image = new Image();
        this.image.src = 'assets/character_single.png';

        // Procedural Animation properties
        this.angle = 0;
        this.va = 0; // Velocity of angle
        this.bobTimer = 0;
        this.bobAmount = 0;
    }

    update(input, deltaTime, platforms) {
        // Horizontal Movement
        this.x += this.speed;
        if (input.includes('ArrowRight')) {
            this.speed = this.maxSpeed;
        } else if (input.includes('ArrowLeft')) {
            this.speed = -this.maxSpeed;
        } else {
            this.speed = 0;
        }

        // Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // Vertical Movement (Jumping)
        if (input.includes('ArrowUp') && this.onGround(platforms)) {
            this.vy -= this.jumpStrength;
            if (this.game.sound) this.game.sound.playJump();
        }
        this.y += this.vy;

        // Gravity
        if (!this.onGround(platforms)) {
            this.vy += this.weight;
        } else {
            this.vy = 0;
            // Snap to ground/platform
            if (this.y > this.game.height - this.height - this.game.groundMargin) {
                this.y = this.game.height - this.height - this.game.groundMargin;
            }
        }

        // Check platform collisions
        this.checkPlatformCollisions(platforms);

        // Procedural Animation Logic
        // Running: Bob and rotate slightly
        if (this.speed !== 0 && this.onGround(platforms)) {
            this.bobTimer += deltaTime * 0.015;
            this.angle = Math.sin(this.bobTimer) * 0.1; // Slight rotation
            this.bobAmount = Math.sin(this.bobTimer * 2) * 5; // Bob up and down
        } else {
            // Idle or Jumping
            if (this.onGround(platforms)) {
                // Idle: Return to neutral
                this.angle *= 0.9;
                this.bobAmount *= 0.9;
            } else {
                // Jumping: Tilt slightly based on velocity
                if (this.vy < 0) this.angle = -0.1; // Tilt up/forward
                else this.angle = 0.1; // Tilt down/landing
                this.bobAmount = 0;
            }
        }
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.save(); // Save current canvas state

            // Move pivot to center of player for rotation
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2 + this.bobAmount);

            // Rotate
            ctx.rotate(this.angle);

            // Flip if moving left
            if (this.speed < 0) {
                ctx.scale(-1, 1);
            }

            // Draw image centered at (0, 0)
            ctx.drawImage(
                this.image,
                0,
                0,
                this.image.width,
                this.image.height,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );

            ctx.restore(); // Restore canvas state
        } else {
            // Fallback
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    onGround(platforms) {
        // Ground check
        if (this.y >= this.game.height - this.height - this.game.groundMargin) return true;

        // Platform check
        return this.onPlatform;
    }

    checkPlatformCollisions(platforms) {
        this.onPlatform = false;
        platforms.forEach(platform => {
            if (
                this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + platform.height &&
                this.vy >= 0
            ) {
                this.onPlatform = true;
                this.y = platform.y - this.height;
                this.vy = 0;
            }
        });
    }
}
