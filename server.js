const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');
const fs = require('fs');
const path = require('path');
const {createCanvas, loadImage, registerFont} = require('canvas');
const FormData = require('form-data');
const axios = require('axios');

registerFont("../assets/Figerona.ttf", {family: 'Figerona'});

// Chargez la police

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './index.html'));
});

app.get('/CSS/reset.css', (req, res) => {
    res.sendFile(join(__dirname, './CSS/reset.css'));
});

app.get('/CSS/styles.css', (req, res) => {
    res.sendFile(join(__dirname, './CSS/styles.css'));
});

app.get('/index.js', (req, res) => {
    res.sendFile(join(__dirname, './index.js'));
});

app.get('/assets/classic_background.mp4', (req, res) => {
    res.sendFile(join(__dirname, './assets/classic_background.mp4'));
});

app.get('/assets/techno_background.mp4', (req, res) => {
    res.sendFile(join(__dirname, './assets/techno_background.mp4'));
});

app.get('/assets/pop_background.mp4', (req, res) => {
    res.sendFile(join(__dirname, './assets/pop_background.mp4'));
});

app.get('/assets/Figerona.ttf', (req, res) => {
    res.sendFile(join(__dirname, './assets/Figerona.ttf'));
});

app.get('/assets/rock_background.mp4', (req, res) => {
    res.sendFile(join(__dirname, './assets/rock_background.mp4'));
});

app.get('/images/image_1.png', (req, res) => {
    res.sendFile(join(__dirname, './images/image_1.png'));
});

app.get('/images/image_2.png', (req, res) => {
    res.sendFile(join(__dirname, './images/image_2.png'));
});

app.get('/images/image_3.png', (req, res) => {
    res.sendFile(join(__dirname, './images/image_3.png'));
});

app.get('/images/image_4.png', (req, res) => {
    res.sendFile(join(__dirname, './images/image_4.png'));
});

app.get('/assets/logo.png', (req, res) => {
    res.sendFile(join(__dirname, './assets/logo.png'));
});

app.get('/assets/hand_clap.mp4', (req, res) => {
    res.sendFile(join(__dirname, './assets/hand_clap.mp4'));
});

app.get('/assets/classic.svg', (req, res) => {
    res.sendFile(join(__dirname, './assets/classic.svg'));
});

app.get('/assets/pop.svg', (req, res) => {
    res.sendFile(join(__dirname, './assets/pop.svg'));
});

app.get('/assets/techno.svg', (req, res) => {
    res.sendFile(join(__dirname, './assets/techno.svg'));
});

app.get('/assets/rock.svg', (req, res) => {
    res.sendFile(join(__dirname, './assets/rock.svg'));
});

app.get('/songs/classicSong.mp3', (req, res) => {
    res.sendFile(join(__dirname, './songs/classicSong.mp3'));
});

app.get('/songs/popSong.mp3', (req, res) => {
    res.sendFile(join(__dirname, './songs/popSong.mp3'));
});

app.get('/songs/rockSong.mp3', (req, res) => {
    res.sendFile(join(__dirname, './songs/rockSong.mp3'));
});

app.get('/songs/technoSong.mp3', (req, res) => {
    res.sendFile(join(__dirname, './songs/technoSong.mp3'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('save_image', (data) => {
        saveImage(data)
    })
    socket.on('left_hand_coords', (data) => {
        io.emit('left_hand_coords', data);
    });
    socket.on('right_hand_coords', (data) => {
        io.emit('right_hand_coords', data);
    });
    socket.on('body_is_here', (data) => {
        io.emit('body_is_here', data);
    });
    socket.on('clap', (data) => {
        io.emit('clap', data);
    });
    socket.on('restart', (data) => {
        io.emit('restart', data);
    });
});

let nameIndex;


function saveImage(data) {
    let name;

    try {
        const folderPath = '../images';

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        if (data) {
            fs.writeFileSync(`${folderPath}/image_${data[1]}.png`, data[0], 'base64');

            loadImage(`${folderPath}/image_${data[1]}.png`).then((image) => {
                const canvas = createCanvas(image.width, image.height);
                const context = canvas.getContext('2d');
                let nameIndex = 0

                if (parseInt(data[3]) <= 3) {
                    nameIndex = 0
                } else if (parseInt(data[3]) > 3 && parseInt(data[3]) <= 6) {
                    nameIndex = 1
                } else if (parseInt(data[3]) > 6 && parseInt(data[3]) <= 10) {
                    nameIndex = 2
                } else if (parseInt(data[3]) > 10 && parseInt(data[3]) <= 15) {
                    nameIndex = 3
                } else if (parseInt(data[3]) > 15 && parseInt(data[3]) <= 20) {
                    nameIndex = 4
                } else if (parseInt(data[3]) > 20) {
                    nameIndex = 5
                }

                switch (data[1]) {
                    case(1):
                        name = names["classic"][nameIndex]
                        break
                    case(2):
                        name = names["techno"][nameIndex]
                        break
                    case(3):
                        name = names["pop"][nameIndex]
                        break
                    case(4):
                        name = names["rock"][nameIndex]
                        break
                }


                context.drawImage(image, 0, 0);

                context.font = '30px Figerona';
                context.fontWeight = '200';
                context.fillStyle = 'white';
                let text = `Name: ${name.toUpperCase()}`;
                let textWidth = context.measureText(text).width;
                let x = image.width - 100 - textWidth;
                context.fillText(`${text}`, x, 100);

                text = `Time: ${data[4]}sec`;
                textWidth = context.measureText(text).width;
                context.fillText(`${text}`, 100, 100);

                loadImage("../assets/logo.png").then((logo) => {
                    context.drawImage(logo, image.width - 325, image.height - 185, 300, 177);
                });

                const pointNumberTxt = `${data[3]} stars linked`;
                let y = image.height - 100;
                context.fillText(pointNumberTxt, 100, y);


                const outputFilePath = path.join(path.dirname(`${folderPath}/image_${data[1]}.png`), path.basename(`${folderPath}/image_${data[1]}.png`));
                const output = fs.createWriteStream(outputFilePath);
                const stream = canvas.createPNGStream({quality: 100});

                stream.pipe(output);

                setTimeout(() => {
                    const apiUrl = `http://localhost:9000/api.php?file=${encodeURIComponent(outputFilePath)}&name=${data[2]}`;

                    axios.get(apiUrl)
                        .then(response => {
                            console.log(response.data);
                        })
                        .catch(error => {
                            console.error("Error:", error);
                        });
                }, 1000);
            })
        } else {
            console.error('Images data are invalids');
        }
    } catch (error) {
        console.error(`Error : ${error.message}`);
    }
}


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});


let names = {
    "classic": [
        "Alto",
        "Gloria",
        "Symphonie",
        "Sonate",
        "Vivaldi",
        "4 saisons"
    ],
    "pop": [
        "Dreadnought",
        "Folk",
        "Delaunay",
        "Silver Pop",
        "Bobblehead",
        "Beatmaker"
    ],
    "techno": [
        "Continuum",
        "Skrillex",
        "Uppermost",
        "Martenot",
        "Kraytwerk",
        "Thérémine"
    ],
    "rock": [
        "Celestival Reverie",
        "Nebule Rock",
        "Memphis",
        "Starcatcher",
        "Stardust Dreams",
        "Aero"
    ]
}