<?php
require 'db.php';

$id = $_GET['id'] ?? null;
if (!$id) {
    echo json_encode(['error' => 'No ID provided']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM menu_items WHERE id=?");
$stmt->execute([$id]);
$item = $stmt->fetch();

if ($item) {
    echo json_encode($item);
} else {
    echo json_encode(['error' => 'Item not found']);
}
?>
