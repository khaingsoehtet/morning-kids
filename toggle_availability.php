<?php
$index = $_POST['index'];
$file = 'data.json';
$items = json_decode(file_get_contents($file), true);

if (isset($items[$index])) {
  $items[$index]['available'] = !$items[$index]['available'];
  file_put_contents($file, json_encode($items, JSON_PRETTY_PRINT));
  echo json_encode(['success' => true, 'available' => $items[$index]['available']]);
} else {
  echo json_encode(['success' => false]);
}
?>
