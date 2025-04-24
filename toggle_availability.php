<?php
require 'db.php';

$id = $_POST['id'] ?? null;
if (!$id) {
    echo json_encode(['success' => false, 'error' => 'No ID provided']);
    exit;
}

// Toggle availability
$stmt = $pdo->prepare("UPDATE menu_items SET available = NOT available WHERE id=?");
$stmt->execute([$id]);

// Get new status
$stmt = $pdo->prepare("SELECT available FROM menu_items WHERE id=?");
$stmt->execute([$id]);
$row = $stmt->fetch();

echo json_encode(['success' => true, 'available' => (bool)$row['available']]);
?>
