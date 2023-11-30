<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Twinkle">
    <meta name="author" content="Pierre-Louis ROUSSEAUX">
    <meta name="robots" content="index, follow">
    <link rel="icon" href="./assets/logo-web.png" type="image/x-icon">

    <title>Twinkle</title>
</head>

<body>
    <img class="logo" src="./assets/logo.png" alt="logo">
    <div class="gallery">
        <?php
        if (isset($_GET["img1"]) && isset($_GET["img2"]) && isset($_GET["img3"]) && isset($_GET["img4"])) {
            echo '<img src="./images/' . $_GET["img1"] . '">';
            echo '<img src="./images/' . $_GET["img2"] . '">';
            echo '<img src="./images/' . $_GET["img3"] . '">';
            echo '<img src="./images/' . $_GET["img4"] . '">';

        }  else {
            $dir = "./images";
            $files = scandir($dir);
            $files = array_reverse($files);
            foreach ($files as $key => $value) {
                if ($value != ".DS_Store" && $value != ".." && $value != "." && $value != ".ftpquota") {
                    $path = $dir . "/" . $value;
                    echo '<img src="' . $path . '">';
                }
            }
        }
        ?>
    </div>
</body>

</html>

<style>
    body{
        background-color: black;
    }

    .logo {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 30vw;
        margin-bottom: 2vh;
    }

    .gallery {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .gallery img {
        width: 80vw;
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 1vh;
    }
</style>