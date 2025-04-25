<?php
require 'auth.php';
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'error' => 'No ID provided']);
    exit;
}

// 1. Get the image filename for this item
$stmt = $pdo->prepare("SELECT image FROM menu_items WHERE id=?");
$stmt->execute([$id]);
$row = $stmt->fetch();

if (!$row) {
    echo json_encode(['success' => false, 'error' => 'Item not found']);
    exit;
}

$image = $row['image'];

// 2. Delete the item from the database
$stmt = $pdo->prepare("DELETE FROM menu_items WHERE id=?");
$stmt->execute([$id]);

// 3. Check if any other item uses the same image
$stmt = $pdo->prepare("SELECT COUNT(*) FROM menu_items WHERE image=?");
$stmt->execute([$image]);
$count = $stmt->fetchColumn();

// 4. If not, delete the image file from disk
if ($count == 0 && $image && file_exists(__DIR__ . "/images/" . $image)) {
    @unlink(__DIR__ . "/images/" . $image);
}

echo json_encode(['success' => true]);
?>
