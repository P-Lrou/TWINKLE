// Socket communication initialization
const socket = io();

// Game state flags
let can_update = false;
let color = "#FFFFFF"; // Default color for sand squares
let actualMusique = 0; // Current music style

// Canvas initialization
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cellSize = 30;

// Resize canvas to match screen dimensions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Call resizeCanvas initially and on window resize
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Calculate number of squares in the canvas
const width = Math.floor(canvas.width / cellSize);
const height = Math.floor(canvas.height / cellSize);

// Arrays to store the state and color of each sand square
let sand_array = Array.from(Array(height), () => Array(width).fill({state: 0, color: color}));
let fall_array = Array.from(Array(height + 20), () => Array(width).fill({state: 0, color: color}));

// Event listeners for socket events
socket.on('left_hand_coords', (data) => {
    drawSand(data[0], data[1]);
});

socket.on('right_hand_coords', (data) => {
    drawSand(data[0], data[1]);
});

// socket.on('head_coords', (data) => {
//     drawSand(data[0], data[1]);
// });

socket.on('clap', () => {
    if (!can_update) {
        changeMusic();
    }
});

// Function to draw sand at specified coordinates
function drawSand(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
        sand_array[gridY][gridX] = {state: 1, color: color};
    }
}


const img = new Image();

// Function to draw an SVG at specified coordinates and color
function drawSVG(x, y, color) {
    let svg = undefined;

    switch (color) {
        case "#FFE863":
            svg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080"> width="${cellSize}" height="${cellSize}">
                    <path class="cls-1" d="m543.26,231.76s-10.63,302.1-297.76,308.15c-.74.02-.8,1.09-.06,1.18,55.12,6.6,294.57,50.05,297.65,307.15,0,0,5.24-301.46,291.41-308.13.74-.02.8-1.09.07-1.18-54.58-6.58-298.68-50.38-291.31-307.17Z" fill="${color}" />
                </svg>`;
            break;
        case "#1701FB":
            svg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 235 264">
                    <g>
                        <polyline class="cls-2" points="118.61 215.7 118.61 163.16 118.61 162.28" stroke="${color}" stroke-width="10"/>
                        <polyline class="cls-2" points="118.61 46.87 118.61 96.47 118.61 97.4" stroke="${color}" stroke-width="10"/>
                        <path class="cls-1" d="m118.97,96.94c-.12.16-.24.30-.36.46-.54.70-1.09,1.41-1.63,2.13-1,1.31-2.01,2.65-2.99,4-.72.94-1.45,1.93-2.15,2.89-1,1.37-1.99,2.75-2.99,4.16-1.13,1.59-2.27,3.22-3.40,4.86-1.39,2.01-2.77,4.06-4.16,6.13-1.77,2.67-3.5,5.33-5.17,7.96-2.77-4.42-5.39-8.78-7.8-13.04-18.23-31.92-26.91-57.94-19.86-62.65,7.05-4.7,27.74,13.43,50.15,42.63.12.16.24.30.36.46Z" stroke="${color}" stroke-width="10"/>
                        <path class="cls-1" d="m169.92,206.43c-7.13,4.74-28.26-13.89-50.97-43.71,4.6-6.13,9.27-12.7,13.89-19.64.08-.12.16-.24.24-.36,2.95-4.44,5.79-8.86,8.44-13.2,2.65,4.24,5.19,8.42,7.54,12.52,18.91,32.7,28.06,59.61,20.86,64.39Z" stroke="${color}" stroke-width="10"/>
                        <path class="cls-1" d="m149.18,116.53c-2.37,4.22-4.94,8.56-7.66,12.98-2.07-3.3-4.2-6.61-6.43-9.95-.92-1.39-1.85-2.75-2.77-4.10-4.44-6.55-8.92-12.76-13.35-18.53,21.93-28.28,42.03-45.68,48.94-41.08,6.91,4.60-1.27,29.67-18.73,60.68Z" stroke="${color}" stroke-width="10"/>
                        <path class="cls-1" d="m132.84,143.08c-4.62,6.93-9.29,13.51-13.89,19.64-.12-.14-.22-.30-.34-.44-4.54-5.99-9.16-12.4-13.73-19.19,4.44.18,9.02.26,13.73.26s9.63-.10,14.23-.26Z" stroke="${color}" stroke-width="10"/>
                        <path class="cls-1" d="m118.95,162.72c-.12.14-.22.30-.34.44-23.15,30.73-44.88,50.10-52.15,45.28-7.34-4.88,2.33-32.78,22.03-66.38,2.39-4.10,4.94-8.28,7.64-12.52,2.27,3.68,4.68,7.42,7.18,11.17.52.80,1.07,1.59,1.59,2.37,4.56,6.79,9.18,13.20,13.73,19.19.12.14.22.30.34.44Z" stroke="${color}" stroke-width="10"/>
                        <path class="cls-1" d="m141.52,129.52c-2.65,4.34-5.49,8.76-8.44,13.20-.08.12-.16.24-.24.36-4.60.16-9.37.26-14.23.26s-9.29-.08-13.73-.26c-.52-.78-1.07-1.57-1.59-2.37-2.49-3.76-4.90-7.50-7.18-11.17,1.67-2.63,3.40-5.29,5.17-7.96,1.39-2.07,2.77-4.12,4.16-6.13,1.13-1.65,2.27-3.28,3.40-4.86,1-1.41,1.99-2.79,2.99-4.16.70-.96,1.43-1.95,2.15-2.89.98-1.35,1.99-2.69,2.99-4.00,.54-.72,1.09-1.43,1.63-2.13,.12-.16,.24-.30,.36-.46,4.42,5.77,8.90,11.98,13.35,18.53,.92,1.35,1.85,2.71,2.77,4.10,2.23,3.34,4.36,6.65,6.43,9.95Z" stroke="${color}" stroke-width="10"/>
                        <path class="cls-1" d="m104.88,143.08c-5.75-.20-11.23-.54-16.40-1.03-24.92-2.21-42.23-7.09-42.23-12.78s17.22-10.55,42.07-12.78c2.41,4.26,5.02,8.62,7.80,13.04,2.27,3.68,4.68,7.42,7.18,11.17,.52,.80,1.07,1.59,1.59,2.37Z" stroke="${color}" stroke-width="10"/>
                        <path class="cls-1" d="m190.96,129.27c0,5.67-17.16,10.53-41.90,12.76-5.11,.46-10.55,.82-16.22,1.05,.08-.12,.16-.24,.24-.36,2.95-4.44,5.79-8.86,8.44-13.20,2.71-4.42,5.29-8.76,7.66-12.98,24.68,2.23,41.78,7.09,41.78,12.74Z" stroke="${color}" stroke-width="10"/>
                    </g>
                    <g>
                        <polygon class="cls-3" points="118.61 40.94 116.67 32.08 114.72 23.23 118.61 23.24 122.5 23.23 120.55 32.08 118.61 40.94" fill="${color}"/>
                        <polygon class="cls-3" points="118.61 5.67 120.55 14.53 122.5 23.38 118.61 23.37 114.72 23.38 116.67 14.53 118.61 5.67" fill="${color}"/>
                    </g>
                    <g>
                        <polygon class="cls-3" points="118.61 258 116.67 249.14 114.72 240.29 118.61 240.3 122.5 240.29 120.55 249.14 118.61 258" fill="${color}"/>
                        <polygon class="cls-3" points="118.61 222.73 120.55 231.59 122.5 240.44 118.61 240.43 114.72 240.44 116.67 231.59 118.61 222.73" fill="${color}"/>
                    </g>
                </svg>`;
            break;
        case "#8200FF":
            svg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 235 264">
                    <polygon class="cls-1" points="140.06 98.38 120.95 5 98.53 98.38 119.3 75.83 140.06 98.38" fill="${color}"/>
                      <polygon class="cls-1" points="140.06 165.62 120.95 259 98.53 165.62 119.3 188.17 140.06 165.62" fill="${color}"/>
                      <polygon class="cls-1" points="77.97 146.7 7.88 133.06 77.97 117.06 61.05 131.88 77.97 146.7" fill="${color}"/>
                      <polygon class="cls-1" points="157.3 117.06 227.39 130.71 157.3 146.7 174.22 131.88 157.3 117.06" fill="${color}"/>
                      <polygon class="cls-1" points="51.83 69.42 51.83 89.09 77.04 98.38 71.14 72.93 51.83 69.42" fill="${color}"/>
                      <polygon class="cls-1" points="51.83 193.63 51.83 173.96 77.04 164.67 71.14 190.12 51.83 193.63" fill="${color}"/>
                      <polygon class="cls-1" points="186.3 193.63 186.3 173.96 161.09 164.67 166.99 190.12 186.3 193.63" fill="${color}"/>
                      <polygon class="cls-1" points="186.3 69.42 186.3 89.09 161.09 98.38 166.99 72.93 186.3 69.42" fill="${color}"/>
                      <polygon class="cls-1" points="119.84 117.06 94.84 131.88 119.84 146.7 143.76 131.88 119.84 117.06" fill="${color}"/>
                </svg>`;
            break;
        case "#FF0000":
            svg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 235 264">
                    <polyline class="cls-2" points="78.64 146.34 22.63 102.83 92.79 110.86" stroke="${color}" stroke-width="5" />
                    <polyline class="cls-2" points="165.4 146.34 221.42 102.83 151.26 110.86" stroke="${color}" stroke-width="5" />
                    <polyline class="cls-2" points="158.79 160.37 179.57 228.19 126.81 181.25" stroke="${color}" stroke-width="5" />
                    <polyline class="cls-2" points="79.26 160.37 58.47 228.19 111.24 181.25" stroke="${color}" stroke-width="5" />
                    <polyline class="cls-2" points="101.21 97.91 122.38 30.21 139.39 98.75" stroke="${color}" stroke-width="5" />
                    <polygon class="cls-1" points="153.39 185.41 120.26 167.68 86.87 184.93 93.49 147.94 66.77 121.51 104 116.38 120.87 82.8 137.26 116.62 174.41 122.29 147.31 148.33 153.39 185.41" fill="${color}"/>
                </svg>`;
            break;
    }

    img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    ctx.drawImage(img, x * cellSize, y * cellSize, cellSize, cellSize);
}

// Function to update game state
function update() {
    let hasFallingSand = false;

    for (let y = fall_array.length - 1; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
            if (fall_array[y][x].state === 1) {
                if (y + 1 < fall_array.length) {
                    fall_array[y + 1][x] = {state: 1, color: fall_array[y][x].color};
                    fall_array[y][x] = {state: 0, color: color};
                    hasFallingSand = true;
                } else {
                    fall_array[y][x] = {state: 0, color: color};
                }
            }
        }
    }

    if (!hasFallingSand) {
        can_update = false;
    }
}

// Function to draw on the canvas
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width * cellSize, height * cellSize);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (sand_array[y][x].state === 1) {
                drawSVG(x, y, sand_array[y][x].color);
            }
        }
    }

    if (can_update) {
        for (let y = 0; y < fall_array.length; y++) {
            for (let x = 0; x < width; x++) {
                if (fall_array[y][x].state === 1) {
                    drawSVG(x, y, fall_array[y][x].color);
                }
            }
        }
    }
}

// Function to change color based on a number
function changeColor(number) {
    switch (number) {
        case 2:
            color = "#1701FB";
            break;
        case 1:
            color = "#FFE863";
            break;
        case 4:
            color = "#FF0000";
            break;
        case 3:
            color = "#8200FF";
            break;
    }
}

// Function to change music style
function changeMusic() {
    actualMusique++;
    if (actualMusique >= 5) {
        actualMusique = 1;
    }

    fall_array = [...sand_array.map(row => [...row])];
    sand_array = Array.from(Array(height), () => Array(width).fill({state: 0, color: color}));

    can_update = true;
    switch (actualMusique) {
        case 1:
            changeColor(1);
            break;
        case 2:
            changeColor(2);
            break;
        case 3:
            changeColor(3);
            break;
        case 4:
            changeColor(4);
            break;
    }
}

// Main game loop
function loop() {
    if (can_update) {
        update();
    }
    draw();
    requestAnimationFrame(loop);
}

// Start the game loop
loop();
changeMusic();
