<?php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['customer_name'] ?? '';
$phone = $data['customer_phone'] ?? '';

if (!$name || !$phone) {
    echo json_encode(['success' => false, 'error' => 'Missing fields']);
    exit;
}

// Create order
$stmt = $pdo->prepare("INSERT INTO orders (customer_name, customer_phone) VALUES (?, ?)");
$stmt->execute([$name, $phone]);
$order_id = $pdo->lastInsertId();

// Log initial status
$stmt = $pdo->prepare("INSERT INTO order_status_history (order_id, status) VALUES (?, ?)");
$stmt->execute([$order_id, 'ORDER_PLACED']);

echo json_encode(['success' => true, 'order_id' => $order_id]);
?>