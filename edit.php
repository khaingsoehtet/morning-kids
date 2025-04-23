<?php
$index = $_GET['index'] ?? null;
$file = 'data.json';

if (!file_exists($file)) {
    echo 'Data file not found.';
    exit;
}

$items = json_decode(file_get_contents($file), true);

if (!isset($items[$index])) {
    echo 'Item not found.';
    exit;
}

$targetDir = "images/";
$imageName = $items[$index]['image']; // Default to existing image

// Check if a new image is uploaded
if (!empty($_FILES['image']['name'])) {
    $imageName = basename($_FILES["image"]["name"]);
    $targetFile = $targetDir . $imageName;

    if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
        echo 'Error uploading image.';
        exit;
    }
}

// Update the item with the new or existing image
$items[$index] = [
    "name" => $_POST['name'] ?? '',
    "age" => $_POST['age'] ?? '',
    "description" => $_POST['description'] ?? '',
    "ingredients" => $_POST['ingredients'] ?? '',
    "price" => is_numeric($_POST['price']) ? $_POST['price'] : 0,
    "available" => $_POST['available'] === "true" ? true : false,
    "image" => $imageName // Use the new or existing image
];

if (file_put_contents($file, json_encode($items, JSON_PRETTY_PRINT)) === false) {
    echo 'Error saving data.';
    exit;
}

echo "Item updated successfully.";
?>
