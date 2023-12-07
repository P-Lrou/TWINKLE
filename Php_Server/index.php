<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Twinkle">
    <meta name="author" content="Pierre-Louis ROUSSEAUX">
    <meta name="robots" content="index, follow">·

    <title>Twinkle</title>·
</head>

<body>
    <img class="logo" src="../assets/logo.png" alt="logo">
    <div class="gallery">
        <?php
        if (isset($_GET["img1"]) && isset($_GET["img2"]) && isset($_GET["img3"]) && isset($_GET["img4"])) {



            echo '<a href="./images/' . $_GET["img1"] . '" download="' . $_GET["img1"] . '"><img src="./images/' . $_GET["img1"] . '"></a>';
            echo '<a href="./images/' . $_GET["img2"] . '" download="' . $_GET["img2"] . '"><img src="./images/' . $_GET["img2"] . '"></a>';
            echo '<a href="./images/' . $_GET["img3"] . '" download="' . $_GET["img3"] . '"><img src="./images/' . $_GET["img3"] . '"></a>';
            echo '<a href="./images/' . $_GET["img4"] . '" download="' . $_GET["img4"] . '"><img src="./images/' . $_GET["img4"] . '"></a>';

        }  else {
            $dir = "../images";
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
        margin-top: -5%;
        width: 35%;
    }

    .gallery {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .gallery img {
        margin: 0.2vw;
        width: 24vw;
        display: block;
        margin-bottom: 1vh;
    }

    @media screen and (orientation:portrait){
        .gallery img {
            width: 80vw;
            display: block;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 1vh;
        }
    }
</style>