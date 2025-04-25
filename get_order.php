<?php
require 'db.php';
$order_id = $_GET['order_id'] ?? null;
if (!$order_id) {
    echo json_encode(['success' => false, 'error' => 'Missing order_id']);
    exit;
}
$stmt = $pdo->prepare("SELECT * FROM orders WHERE id=?");
$stmt->execute([$order_id]);
$order = $stmt->fetch();
if ($order) {
    echo json_encode(['success' => true] + $order);
} else {
    echo json_encode(['success' => false, 'error' => 'Order not found']);
}
?>