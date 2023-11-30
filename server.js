const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');
const fs = require('fs');
const path = require('path');
const {createCanvas, loadImage} = require('canvas');
const FormData = require('form-data');
const axios = require('axios');

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

app.get('/assets/hand_clap.gif', (req, res) => {
    res.sendFile(join(__dirname, './assets/hand_clap.gif'));
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

                switch (data[1]) {
                    case(1):
                        nameIndex = Math.floor(Math.random() * names["classic"].length);
                        name = names["classic"][nameIndex]
                        break
                    case(2):
                        nameIndex = Math.floor(Math.random() * names["techno"].length);
                        name = names["techno"][nameIndex]
                        break
                    case(3):
                        nameIndex = Math.floor(Math.random() * names["pop"].length);
                        name = names["pop"][nameIndex]
                        break
                    case(4):
                        nameIndex = Math.floor(Math.random() * names["rock"].length);
                        name = names["rock"][nameIndex]
                        break
                }


                context.drawImage(image, 0, 0);

                context.fillStyle = 'white';
                context.fillText(`${name}`, 50, 50);

                const pointNumberTxt = `Number of stars linked : ${data[3]}`;
                const textWidth = context.measureText(pointNumberTxt).width;
                const x = image.width - 50 - textWidth;
                context.fillText(pointNumberTxt, x, 50);

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
        "sonate",
        "lied",
        "menuet",
        "scherzo",
        "rondo",
        "symphonie",
        "gloria",
        "4 saisons",
        "printemps",
        "beethoven",
        "vivaldi",
        "brahms",
        "haydn",
        "alto",
        "clavecin",
        "violoncelle"
    ],
    "pop": [
        "dreadnought",
        "folk",
        "jakson",
        "delaynay",
        "bobblehead",
        "beatmaker"
    ],
    "techno": [
        "kraftwerk",
        "skrillex",
        "martenot",
        "orgue",
        "thérémine",
        "synthophone",
        "hansketch",
        "continumm"
    ],
    "rock": [
        "acid",
        "aero",
        "death",
        "krautrock",
        "stones",
        "kranklin",
        "swing",
        "memphis",
        "jagger",
        "haley",
        "presley",
        "electrique"
    ]
}