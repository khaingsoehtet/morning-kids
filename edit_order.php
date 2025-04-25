<?php
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true);
$order_id = $data['order_id'] ?? null;
$name = $data['customer_name'] ?? '';
$phone = $data['customer_phone'] ?? '';
if (!$order_id || !$name || !$phone) {
    echo json_encode(['success' => false, 'error' => 'Missing fields']);
    exit;
}
// Only allow edit if status is not shipped or beyond
$stmt = $pdo->prepare("SELECT status FROM orders WHERE id=?");
$stmt->execute([$order_id]);
$status = $stmt->fetchColumn();
if (!in_array($status, ['ORDER_PLACED', 'PAYMENT_CONFIRMED', 'PROCESSING'])) {
    echo json_encode(['success' => false, 'error' => 'Order cannot be edited at this stage.']);
    exit;
}
$stmt = $pdo->prepare("UPDATE orders SET customer_name=?, customer_phone=? WHERE id=?");
$stmt->execute([$name, $phone, $order_id]);
echo json_encode(['success' => true]);
?>