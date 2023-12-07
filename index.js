// Socket communication initialization
const socket = io.connect();

// Game state flags
let can_update = false;
let color = "#FFFFFF"; // Default color for sand squares
let actualMusique = 0; // Current music style
let SVGSize = 55;
let waitTimeForRandomPoint = 0
let previous_timestamp = 0;
let haveScreen = false
let actualScreen = "start";
let songIsPlaying = false;
let introIsStarted = false;
let deltaTime;
let elapsedTimeForMusic = 0;
let endIsShowed = false;
let imageLinks = []
const myVideo = document.querySelector('.myVideo')

// Canvas initialization
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const classicSong = new Audio("./songs/classicSong.mp3")
const technoSong = new Audio("./songs/technoSong.mp3")
const popSong = new Audio("./songs/popSong.mp3")
const rockSong = new Audio("./songs/rockSong.mp3")

// Resize canvas to match screen dimensions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    myVideo.width = window.innerWidth;
    myVideo.height = window.innerHeight;
}

// Call resizeCanvas initially and on window resize
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Arrays to store the state and color of each sand square
let sand_array = []
let fall_array = []

socket.on('connect', () => {
    console.log('connection')
});


// Event listeners for socket events
socket.on('left_hand_coords', (data) => {
    if (!can_update && actualScreen === "game") {
        drawSand(data[0], data[1]);
    }
});

socket.on('right_hand_coords', (data) => {
    if (!can_update && actualScreen === "game") {
        drawSand(data[0], data[1]);
    }
});

socket.on('clap', () => {
    if (actualScreen === "start" && introIsStarted) {
        actualScreen = "game"
        requestAnimationFrame(loop);
        changeMusic();
    } else if (!can_update && elapsedTimeForMusic > 10) {
        changeMusic();
    }
});

socket.on('body_is_here', () => {
    if (actualScreen === "start") {
        setTimeout(() => {
            if (!introIsStarted) {
                showGameIntro()
            }
        }, 2000)
    }
});

socket.on('restart', () => {
    location.reload();
});

let canAddToArray = false

// Function to draw sand at specified coordinates
function drawSand(x, y) {
    let vy = Math.random() * 500 - 250; // Adjusted to center velocity around 0

    if (waitTimeForRandomPoint === 0) {
        waitTimeForRandomPoint = Math.random() * (2 - 1) + 1;
        setTimeout(() => {
            canAddToArray = true
        }, waitTimeForRandomPoint * 1000); // Converted seconds to milliseconds
    } else {
        if (canAddToArray) {
            waitTimeForRandomPoint = 0;
            sand_array.push({x, y, vy, state: 1, color});
            canAddToArray = false
        } else {
            sand_array.push({x, y, vy, state: 0, color});
        }
    }
}


const img = new Image();
const img2 = new Image();

// Function to draw an SVG at specified coordinates and color
function drawSVG(x, y, color, state) {

    switch (color) {
        case "#FCFFD2":
            if (state === 1) {
                img2.src = "./assets/classic.svg";
                ctx.drawImage(img2, x, y, SVGSize, SVGSize);
            } else {
                SVGSize = 35;
                img.src = "./assets/classic.svg";
                ctx.globalAlpha = 0.4;
                ctx.drawImage(img, x, y, SVGSize, SVGSize);
                ctx.globalAlpha = 1.0;
                SVGSize = 55;
            }
            break;
        case "#00CDEF":
            if (state === 1) {
                img2.src = "./assets/techno.svg";
                ctx.drawImage(img2, x, y, SVGSize, SVGSize);
            } else {
                SVGSize = 35;
                img.src = "./assets/techno.svg";
                ctx.globalAlpha = 0.4;
                ctx.drawImage(img, x, y, SVGSize, SVGSize);
                ctx.globalAlpha = 1.0;
                SVGSize = 55;
            }
            break;
        case "#8200FF":
            if (state === 1) {
                img2.src = "./assets/pop.svg";
                ctx.drawImage(img2, x, y, SVGSize, SVGSize);
            } else {
                SVGSize = 35;
                img.src = "./assets/pop.svg";
                ctx.globalAlpha = 0.4;
                ctx.drawImage(img, x, y, SVGSize, SVGSize);
                ctx.globalAlpha = 1.0;
                SVGSize = 55;
            }
            break;
        case "#FF004F":
            if (state === 1) {
                img2.src = "./assets/rock.svg";
                ctx.drawImage(img2, x, y, SVGSize, SVGSize);
            } else {
                SVGSize = 35;
                img.src = "./assets/rock.svg";
                ctx.globalAlpha = 0.4;
                ctx.drawImage(img, x, y, SVGSize, SVGSize);
                ctx.globalAlpha = 1.0;
                SVGSize = 55;
            }
            break;
    }
}

let elapsedTime = 0;
const removalTime = 6;

// Function to update game state
function update(deltaTime) {
    const gravity = 600;

    elapsedTime += deltaTime;

    let i = -1;
    fall_array.forEach(point => {
        i++;
        if (elapsedTime > 4.5 && !haveScreen) {
            if (songIsPlaying) {
                stopSong()
            }
            haveScreen = true
            generateImage();
        }
        if (elapsedTime > removalTime || point.state === 0) {
            point.vy += gravity * deltaTime;
            point.y = point.y + (point.vy * deltaTime);
            if (point.y + SVGSize / 2 > canvas.height) {
                fall_array.splice(i, 1);
            }
        }
    });

    if (fall_array.length === 0) {
        elapsedTime = 0;
        can_update = false;
        if (actualMusique > 4) {
            actualScreen = "end"
        }
    }
}

let imgCount = 0;

function generateImage() {
    imgCount++
    const image = new Image();
    image.src = canvas.toDataURL('image/png');
    let data = image.src.substring(22)
    const pointNumber = constellation_points.length
    const currentDate = new Date();
    const formattedDateTime = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}`;
    imageLinks.push(`${formattedDateTime}.png`)
    socket.emit('save_image', [data, imgCount, formattedDateTime, pointNumber, Math.floor(elapsedTimeForMusic - 4)]);
}

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

let constellation_points = []

// Function to draw on the canvas
function draw() {
    ctx.drawImage(myVideo, 0, 0, canvas.width, canvas.height);


    let i = -1


    constellation_points.forEach(point => {
        i++
        if (i !== 0) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = point.color;
            drawLine(ctx, constellation_points[i - 1].x + SVGSize / 2, constellation_points[i - 1].y + SVGSize / 2, point.x + SVGSize / 2, point.y + SVGSize / 2)
        }
    });
    constellation_points = []
    sand_array.forEach(point => {
        if (point.state === 1) {
            constellation_points.push(point)
        }
        drawSVG(point.x, point.y, point.color, point.state);
    });


    if (can_update) {
        i = -1
        constellation_points.forEach(point => {
            i++
            if (i !== 0) {
                ctx.lineWidth = 4;
                ctx.strokeStyle = point.color;
                drawLine(ctx, constellation_points[i - 1].x + SVGSize / 2, constellation_points[i - 1].y + SVGSize / 2, point.x + SVGSize / 2, point.y + SVGSize / 2)
            }
        });
        constellation_points = []
        fall_array.forEach(point => {
            if (point.state === 1) {
                constellation_points.push(point)
            }
            drawSVG(point.x, point.y, point.color, point.state);
        });
    }
}

// Function to change color based on a number
function changeColor(number) {
    switch (number) {
        case 2:
            color = "#00CDEF";
            break;
        case 1:
            color = "#FCFFD2";
            break;
        case 4:
            color = "#FF004F";
            break;
        case 3:
            color = "#8200FF";
            break;
    }
}

// Function to change music style
function changeMusic() {
    actualMusique++;

    fall_array = sand_array
    sand_array = []

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


function playSong() {
    switch (actualMusique) {
        case 1:
            classicSong.play();
            songIsPlaying = true;
            break;
        case 2:
            technoSong.play();
            songIsPlaying = true;
            break;
        case 3:
            popSong.play();
            songIsPlaying = true;
            break;
        case 4:
            rockSong.play();
            songIsPlaying = true;
            break;
    }
}

function stopSong() {
    switch (actualMusique - 1) {
        case 1:
            fadeOutAudioAndPause(classicSong);
            break;
        case 2:
            fadeOutAudioAndPause(technoSong);
            break;
        case 3:
            fadeOutAudioAndPause(popSong);
            break;
        case 4:
            fadeOutAudioAndPause(rockSong);
            break;
    }
}

function fadeOutAudioAndPause(audioElement) {
    const fadeDuration = 1500;
    const volumeStep = audioElement.volume / (fadeDuration / 100);

    const fadeOut = setInterval(() => {
        if (audioElement.volume > 0 && audioElement.volume - volumeStep > 0) {
            audioElement.volume -= volumeStep;
        } else {
            clearInterval(fadeOut);
            audioElement.pause();
            audioElement.volume = 1;
            songIsPlaying = false;
        }
    }, 100);
}


function loop(timestamp) {
    deltaTime = (timestamp - previous_timestamp) / 1000;

    previous_timestamp = timestamp


    if (can_update) {
        update(deltaTime);
    }
    if (haveScreen && !can_update) {
        haveScreen = false;
    }
    if (actualScreen === "game") {
        document.querySelector('.startMenu').style.display = "none";
        document.getElementById('canvas').style.display = "block";
        myVideo.style.display = "block"
        draw();
        if (elapsedTimeForMusic > 60) {
            changeMusic();
            elapsedTimeForMusic = 0
        }
        if (!can_update && !songIsPlaying) {
            playSong()
            changeBackground()
            elapsedTimeForMusic = 0
            elapsedTime = 0;
            constellation_points = []
        }
    } else if (actualScreen === "end") {
        if (!endIsShowed) {
            showEnd()
        }
    }
    elapsedTimeForMusic += deltaTime
    requestAnimationFrame(loop);
}


function changeBackground() {

    switch (actualMusique) {
        case 1:
            myVideo.src = "./assets/pop_background.mp4"
            break;
        case 2:
            myVideo.src = "./assets/rock_background.mp4"
            break;
        case 3:
            myVideo.src = "./assets/classic_background.mp4"
            break;
        case 4:
            myVideo.src = "./assets/techno_background.mp4"
            break;
    }
}

function showStartMenu() {
    document.getElementById('canvas').style.display = "none";
    myVideo.style.display = "none"
    mySpan.style.display = "none"
}

function showGameIntro() {
    introIsStarted = true;
    document.querySelector('.startMenu .logo').style.display = "none";
    document.querySelector('.startMenu .intro').style.display = "block";
}

let haveAnimQR = false;

function showEnd() {
    endIsShowed = true;
    document.querySelector('canvas').style.display = "none";
    myVideo.style.display = "none"
    document.querySelector('.endMenu').style.display = "grid";

    const imageSources = [
        "./images/image_1.png",
        "./images/image_2.png",
        "./images/image_3.png",
        "./images/image_4.png"
    ];

    const images = document.querySelectorAll('.endMenu img');

    images.forEach((img, index) => {
        fetchImage(img, imageSources[index]);
    });

    const url = `https://twinkle.pierrelouisrousseaux.fr/index.php?img1=${imageLinks[0]}&img2=${imageLinks[1]}&img3=${imageLinks[2]}&img4=${imageLinks[3]}`;
    qrCodeGenerator("qrcode", url)
    if (!haveAnimQR) {
        document.querySelector('#qrcode').style.opacity = "0"
    }
    setTimeout(() => {
        if (!haveAnimQR) {
            haveAnimQR = true;
            document.querySelector('#qrcode').style.animation = "qrCodeArrived 2s"
            setTimeout(() => {
                document.querySelector('#qrcode').style.opacity = "1";
                setTimeout(() => {
                    socket.emit("restart", true)
                }, 90000)
            }, 4000)
        }
    }, 4000)
}

function fetchImage(img, src) {
    fetch(src)
        .then(response => response.blob())
        .then(blob => {
            const objectURL = URL.createObjectURL(blob);
            img.setAttribute('data-src', src);
            img.src = '';
            img.src = objectURL;
        })
        .catch(error => console.error('Error fetching image:', error));
}

// Start the game loop
window.addEventListener("click", () => {
    showStartMenu()
});

function qrCodeGenerator(place, url) {
    new QRCode(`${place}`, {
        text: `${url}`,
        width: 288,
        height: 288,
        colorDark: "white",
        colorLight: "black",
        correctLevel: QRCode.CorrectLevel.H
    });
}

function detectEnterKeyRelease(event) {
    if (event.key === "Enter") {
        socket.emit('clap', true);
    }
}


document.addEventListener("keyup", detectEnterKeyRelease);