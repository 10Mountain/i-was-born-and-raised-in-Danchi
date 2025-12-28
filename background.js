class Background {
    constructor(game) {
        this.game = game;
        this.width = 1600;
        this.height = 600;
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.image = new Image();
        this.image.src = 'assets/background_clean.png';
    }

    update() {
        // Scroll background
        // If player is moving right, background moves left
        // We can link it to player speed or game speed
        // For now, let's make it auto-scroll slowly or link to player

        // Simple parallax: move background when player moves
        // But since player stays in center (mostly), we simulate world movement
        // Here we just scroll it continuously for effect or based on input

        // Let's just scroll it slowly to the left to simulate forward movement
        // Or better, link to game speed if we had a global game speed

        this.x -= this.game.speed * 0.5; // Parallax effect
        if (this.x < -this.width) this.x = 0;
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        } else {
            // Fallback
            ctx.fillStyle = '#f0f8ff';
            ctx.fillRect(0, 0, this.game.width, this.game.height);
            ctx.fillStyle = '#696969';
            ctx.fillRect(0, this.game.height - this.game.groundMargin, this.game.width, this.game.groundMargin);
        }
    }
}
