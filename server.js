const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');
const fs = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './index.html'));
});

app.get('/CSS/reset.css', (req, res) => {
    res.sendFile(join(__dirname, './CSS/reset.css'));
});

app.get('/index.js', (req, res) => {
    res.sendFile(join(__dirname, './index.js'));
});

app.get('/assets/background_1.png', (req, res) => {
    res.sendFile(join(__dirname, './assets/background_1.png'));
});

app.get('/assets/background_2.png', (req, res) => {
    res.sendFile(join(__dirname, './assets/background_2.png'));
});

app.get('/assets/background_3.png', (req, res) => {
    res.sendFile(join(__dirname, './assets/background_3.png'));
});

app.get('/assets/background_4.png', (req, res) => {
    res.sendFile(join(__dirname, './assets/background_4.png'));
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
    socket.on('left_hand_coords', (data) => {
        io.emit('left_hand_coords', data);
    });
    socket.on('right_hand_coords', (data) => {
        io.emit('right_hand_coords', data);
    });
    socket.on('head_coords', (data) => {
        io.emit('head_coords', data);
    });
    socket.on('clap', (data) => {
        io.emit('clap', data);
    });
    socket.on('save_image', (data) => {
        saveImage(data)
    })
});


function saveImage(data) {

    try {
        const fileName = `image_${Date.now()}.png`;
        const folderPath = './images';

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        if (data) {
            fs.writeFileSync(`${folderPath}/${fileName}`, data, 'base64');
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
