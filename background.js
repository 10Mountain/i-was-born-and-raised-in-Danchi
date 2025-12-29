class Background {
    constructor(game) {
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.speed = 0;
        this.buildings = [];
        this.clouds = [];
        this.trees = [];
        this.generateBuildings();
        this.generateClouds();
    }

    generateBuildings() {
        let currentX = 0;
        while (currentX < this.game.width * 2) {
            const buildingWidth = 140 + Math.random() * 60; // Slightly wider
            const rows = 5; // Fixed 5 stories
            const rowHeight = 40;
            const buildingHeight = rows * rowHeight + 10; // Exact height for 5 stories

            const building = {
                x: currentX,
                y: this.game.height - this.game.groundMargin - buildingHeight,
                width: buildingWidth,
                height: buildingHeight,
                color: '#F9F9F9', // White/Light Grey
                windows: [],
                balconies: [],
                hasWaterTank: Math.random() > 0.3
            };

            // Grid layout
            const cols = Math.floor(buildingWidth / 35);
            // const rows = Math.floor(buildingHeight / 40); // Controlled above

            for (let r = 0; r < rows; r++) {
                // Balcony line (White/Grey)
                building.balconies.push({
                    y: 40 * r + 35,
                    h: 8 // Thicker balcony
                });

                for (let c = 0; c < cols; c++) {
                    // Blue Windows
                    if (Math.random() > 0.05) { // Most windows present
                        building.windows.push({
                            x: 10 + c * 35,
                            y: 10 + r * 40,
                            w: 22,
                            h: 22, // Square-ish windows
                            color: '#4FC3F7' // Bright Blue
                        });
                    }
                }
            }
            this.buildings.push(building);

            // Trees between buildings
            if (Math.random() > 0.3) {
                this.trees.push({
                    x: currentX + buildingWidth + 5 + Math.random() * 20,
                    y: this.game.height - this.game.groundMargin,
                    size: 30 + Math.random() * 20
                });
            }

            currentX += buildingWidth + 40 + Math.random() * 60; // Gap
        }
    }

    generateClouds() {
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.game.width,
                y: Math.random() * (this.game.height / 2),
                width: 60 + Math.random() * 60,
                speed: 0.2 + Math.random() * 0.3
            });
        }
    }

    update() {
        // Buildings
        this.buildings.forEach(building => {
            building.x -= this.game.speed * 0.2;
        });

        // Loop Buildings
        if (this.buildings.length > 0 && this.buildings[0].x + this.buildings[0].width < 0) {
            const first = this.buildings.shift();
            let lastX = this.buildings[this.buildings.length - 1].x + this.buildings[this.buildings.length - 1].width;
            first.x = lastX + 40 + Math.random() * 60;
            this.buildings.push(first);

            // Allow adding new trees/clouds logic if infinite, but simple looping for now
        }

        // Trees loop
        this.trees.forEach(tree => {
            tree.x -= this.game.speed * 0.2;
        });
        if (this.trees.length > 0 && this.trees[0].x < -50) {
            const firstTree = this.trees.shift();
            let lastBuildingX = this.buildings[this.buildings.length - 1].x + this.buildings[this.buildings.length - 1].width;
            firstTree.x = lastBuildingX + 20 + Math.random() * 50;
            this.trees.push(firstTree);
        }

        // Clouds
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed + this.game.speed * 0.1;
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.game.width + Math.random() * 200;
                cloud.y = Math.random() * (this.game.height / 3);
            }
        });
    }

    draw(ctx) {
        // Sky
        ctx.fillStyle = '#1E88E5'; // Bright Blue
        ctx.fillRect(0, 0, this.game.width, this.game.height);

        // Clouds
        ctx.fillStyle = '#FFFFFF';
        this.clouds.forEach(cloud => {
            ctx.beginPath();
            ctx.ellipse(cloud.x, cloud.y, cloud.width, cloud.width * 0.6, 0, 0, Math.PI * 2);
            ctx.ellipse(cloud.x + 20, cloud.y - 10, cloud.width * 0.8, cloud.width * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        // Ground (Grass)
        ctx.fillStyle = '#66BB6A'; // Light Green
        ctx.fillRect(0, this.game.height - this.game.groundMargin, this.game.width, this.game.groundMargin + 100); // Overlay lower part

        // Buildings
        this.buildings.forEach(building => {
            // Main structure (White)
            ctx.fillStyle = building.color;
            ctx.fillRect(building.x, building.y, building.width, building.height);

            // Side/Edge
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#DDDDDD';
            ctx.strokeRect(building.x, building.y, building.width, building.height);

            // Water Tank
            if (building.hasWaterTank) {
                ctx.fillStyle = '#EEEEEE';
                ctx.fillRect(building.x + 20, building.y - 20, 30, 20);
                ctx.strokeStyle = '#CCCCCC';
                ctx.strokeRect(building.x + 20, building.y - 20, 30, 20);
            }

            // Balconies
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            building.balconies.forEach(balcony => {
                ctx.fillRect(building.x - 2, building.y + balcony.y, building.width + 4, balcony.h);
            });
            ctx.shadowColor = 'transparent'; // Reset

            // Windows
            ctx.fillStyle = '#29B6F6'; // Light Blue Window
            building.windows.forEach(win => {
                ctx.fillRect(building.x + win.x, building.y + win.y, win.w, win.h);
                // Simple glare
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.fillRect(building.x + win.x + 2, building.y + win.y + 2, 5, 5);
                ctx.fillStyle = '#29B6F6'; // Reset
            });
        });

        // Trees
        this.trees.forEach(tree => {
            // Trunk
            ctx.fillStyle = '#8D6E63';
            ctx.fillRect(tree.x - 5, tree.y - 20, 10, 20);
            // Leaves (Simple circle/bush)
            ctx.fillStyle = '#2E7D32'; // Dark Green
            ctx.beginPath();
            ctx.arc(tree.x, tree.y - 30, tree.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
