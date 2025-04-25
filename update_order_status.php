<?php
require 'auth.php';
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$order_id = $data['order_id'] ?? null;
$new_status = $data['status'] ?? null;

if (!$order_id || !$new_status) {
    echo json_encode(['success' => false, 'error' => 'Missing fields']);
    exit;
}

// Update order status
$stmt = $pdo->prepare("UPDATE orders SET status=? WHERE id=?");
$stmt->execute([$new_status, $order_id]);

// Log status change
$stmt = $pdo->prepare("INSERT INTO order_status_history (order_id, status) VALUES (?, ?)");
$stmt->execute([$order_id, $new_status]);

echo json_encode(['success' => true]);
?>