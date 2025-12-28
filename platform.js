class Platform {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // Procedural texture properties
        this.cracks = [];
        this.generateCracks();
    }

    generateCracks() {
        const numCracks = Math.floor(this.width / 50);
        for (let i = 0; i < numCracks; i++) {
            this.cracks.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                length: 10 + Math.random() * 20,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    update() {
        // Scroll with the background/game speed
        this.x -= this.game.speed;
    }

    draw(ctx) {
        // Utility Pole Look

        const poleWidth = 20;
        const poleX = this.x + this.width / 2 - poleWidth / 2;
        const groundY = this.game.height - this.game.groundMargin;

        // 1. Vertical Pole (extends to ground)
        ctx.fillStyle = '#5c5c5c'; // Dark grey concrete
        ctx.fillRect(poleX, this.y, poleWidth, groundY - this.y);

        // Pole highlights/shading
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(poleX, this.y, 5, groundY - this.y);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(poleX + poleWidth - 5, this.y, 5, groundY - this.y);

        // 2. Horizontal Cross-arm (The Platform)
        ctx.fillStyle = '#6e6e6e';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Cross-arm details
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(this.x + 10, this.y + 5, this.width - 20, this.height - 10); // Inner detail

        // 3. Insulators (White cups on top)
        const numInsulators = 3;
        const spacing = this.width / (numInsulators + 1);
        ctx.fillStyle = '#eeeeee';
        for (let i = 1; i <= numInsulators; i++) {
            // Cup shape
            ctx.beginPath();
            ctx.arc(this.x + spacing * i, this.y - 5, 8, 0, Math.PI * 2);
            ctx.fill();
            // Base
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x + spacing * i - 3, this.y, 6, 5);
            ctx.fillStyle = '#eeeeee'; // Reset for next
        }

        // 4. Transformer (Optional, attached to pole)
        // Draw a cylinder/box on the pole below the arm
        ctx.fillStyle = '#4a5a6a'; // Bluish grey
        ctx.fillRect(poleX - 15, this.y + 30, 50, 60);
        // Detail
        ctx.fillStyle = '#2a3a4a';
        ctx.fillRect(poleX - 10, this.y + 35, 40, 50);

        // Text "10Mountain"
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('10', poleX + 10, this.y + 55);
        ctx.font = '8px Arial';
        ctx.fillText('Mountain', poleX + 10, this.y + 70);
        ctx.textAlign = 'left'; // Reset alignment

        // Wires (Decorational lines connecting to off-screen or just hanging)
        // Maybe too complex for now, let's stick to the structure
    }
}
