<?php
require 'db.php';

$order_id = $_GET['order_id'] ?? null;
if (!$order_id) {
    echo json_encode(['success' => false, 'error' => 'Missing order_id']);
    exit;
}

$stmt = $pdo->prepare("SELECT status, changed_at FROM order_status_history WHERE order_id=? ORDER BY changed_at ASC");
$stmt->execute([$order_id]);
$history = $stmt->fetchAll();

echo json_encode(['success' => true, 'history' => $history]);
?>