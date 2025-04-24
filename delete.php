<?php
require 'auth.php';
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'error' => 'No ID provided']);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM menu_items WHERE id=?");
$stmt->execute([$id]);

echo json_encode(['success' => true]);
?>
