<?php

require_once('./configuration.php');

$ftp_server = FTP_SERVER; // FTP address of your server
$ftp_username = FTP_USERNAME; // FTP username
$ftp_password = FTP_PASSWORD; // FTP password

$local_directory = "../images";
$remote_directory = "./";

// Connect to the FTP server
$ftp_conn = ftp_connect($ftp_server);

// Check if the connection is successful
if (!$ftp_conn) {
    die("FTP connection failed\n");
}

// Login to the FTP server
$login = ftp_login($ftp_conn, $ftp_username, $ftp_password);

// Check if the login is successful
if (!$login) {
    die("FTP login failed\n");
}

// Enable passive mode
ftp_pasv($ftp_conn, true);

// Check if a file path is provided in the GET parameters
if (!empty($_GET['file']) and !empty($_GET['name'])) {
    // Get the file path from the GET parameters
    $fileToTransfer = $_GET['file'];
    $newFileName = $_GET['name'] . '.png';

    // Extract file information
    $file = basename($fileToTransfer);
    $local_file = $local_directory . "/" . $file;
    $remote_file = $remote_directory . $newFileName;

    // Transfer the file
    if (ftp_put($ftp_conn, $remote_file, $fileToTransfer, FTP_BINARY)) {
        echo "Transfer successful: $file\n";
    } else {
        echo "Transfer failed for: $file\n";
    }
} else {
    echo "No file path provided in the request\n";
}

// Close the FTP connection
ftp_close($ftp_conn);