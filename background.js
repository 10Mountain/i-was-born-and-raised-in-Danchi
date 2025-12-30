class Background {
    constructor(game) {
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.image = new Image();
        this.image.src = 'assets/background_scene.jpg';
        this.x = 0;
        this.y = 0;
        this.speedModifier = 0.2; // Adjust for parallax effect if needed
    }

    update() {
        if (this.game.speed > 0) {
            this.x -= this.game.speed * this.speedModifier;
            if (this.x <= -this.width) {
                this.x = 0;
            }
        }
    }

    draw(ctx) {
        // Draw the background image twice to create a seamless scrolling effect
        if (this.image.complete) {
            const aspectRatio = this.image.width / this.image.height;
            const renderHeight = this.game.height;
            const renderWidth = renderHeight * aspectRatio;

            // If the image is narrower than the screen, we might need more than 2 draw calls, 
            // but assuming the image is wide enough or we stretch/tile it.
            // For this specific case, let's tile it horizontally based on renderWidth.

            // Calculate how many tiles we need to cover the screen plus overflow
            // However, for simple scrolling loop where x resets at -renderWidth:

            // Update x logic in update() to match renderWidth
            // We need to override the width property to be the renderWidth for the update logic to work correctly
            this.width = renderWidth;

            let currentX = this.x;
            // Draw as many tiles as needed to cover the screen
            while (currentX < this.game.width) {
                ctx.drawImage(this.image, currentX, this.y, renderWidth, renderHeight);
                currentX += renderWidth;
            }
        } else {
            // Fallback while loading
            ctx.fillStyle = '#1E88E5';
            ctx.fillRect(0, 0, this.game.width, this.game.height);
        }
    }
}
