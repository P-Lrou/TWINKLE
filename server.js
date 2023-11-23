const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');
const fs = require('fs');
const path = require('path');

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

app.get('/assets/background_classic.png', (req, res) => {
    res.sendFile(join(__dirname, './assets/background_classic.png'));
});

app.get('/assets/background_pop.png', (req, res) => {
    res.sendFile(join(__dirname, './assets/background_pop.png'));
});

app.get('/assets/background_rock.png', (req, res) => {
    res.sendFile(join(__dirname, './assets/background_rock.png'));
});

app.get('/assets/background_techno.png', (req, res) => {
    res.sendFile(join(__dirname, './assets/background_techno.png'));
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


function saveImage(data) {

    try {
        const folderPath = './images';

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        if (data) {
            fs.writeFileSync(`${folderPath}/image_${data[1]}.png`, data[0], 'base64');
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
