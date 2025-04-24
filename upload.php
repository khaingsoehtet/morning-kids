<?php
require 'auth.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        echo "No image uploaded or upload error.";
        exit;
    }
    $image = $_FILES['image']['name'];
    $imageTemp = $_FILES['image']['tmp_name'];
    $targetDir = "images/";
    $targetFile = $targetDir . basename($image);

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($_FILES['image']['type'], $allowedTypes)) {
        echo "Invalid file type. Only JPG, PNG, and GIF are allowed.";
        exit;
    }

    // Validate file size (max 2MB)
    if ($_FILES['image']['size'] > 2 * 1024 * 1024) {
        echo "File size exceeds 2MB limit.";
        exit;
    }

    // Prevent overwrite
    if (file_exists($targetFile)) {
        echo "File already exists. Please rename your file.";
        exit;
    }

    // Handle upload
    if (move_uploaded_file($imageTemp, $targetFile)) {
        echo "Image uploaded successfully!";
    } else {
        echo "Error uploading image.";
    }
}
?>
