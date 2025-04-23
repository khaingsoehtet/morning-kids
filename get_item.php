<?php
$index = $_GET['index'];
$file = 'data.json';
$items = json_decode(file_get_contents($file), true);

if (isset($items[$index])) {
  echo json_encode($items[$index]);
} else {
  echo json_encode(['error' => 'Item not found']);
}
?>
