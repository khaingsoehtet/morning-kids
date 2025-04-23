<?php
$data = json_decode(file_get_contents('php://input'), true);
$index = $data['index'];

$file = 'data.json';
$items = json_decode(file_get_contents($file), true);

// Just mark unavailable instead of removing
$items[$index]['available'] = false;

file_put_contents($file, json_encode($items, JSON_PRETTY_PRINT));
echo "Deleted";
