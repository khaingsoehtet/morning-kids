<?php
require 'auth.php';
require 'db.php';

$id = $_POST['id'] ?? null;
if (!$id) {
    echo json_encode(['success' => false, 'error' => 'No ID provided']);
    exit;
}
$stmt = $pdo->prepare("DELETE FROM restaurant_info WHERE id=?");
$stmt->execute([$id]);
echo json_encode(['success' => true]);
?>