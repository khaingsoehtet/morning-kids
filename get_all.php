<?php
require 'db.php';

$stmt = $pdo->query("SELECT * FROM menu_items");
$items = $stmt->fetchAll();

echo json_encode($items);
?>