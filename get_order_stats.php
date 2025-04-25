<?php
require 'auth.php';
require 'db.php';

// Get order counts by status
$statusCounts = [];
$statuses = ['ORDER_PLACED','PAYMENT_CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED'];
foreach ($statuses as $status) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE status=?");
    $stmt->execute([$status]);
    $statusCounts[$status] = (int)$stmt->fetchColumn();
}

// Get total orders
$stmt = $pdo->query("SELECT COUNT(*) FROM orders");
$totalOrders = (int)$stmt->fetchColumn();

// Get 5 most recent orders
$stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");
$recentOrders = $stmt->fetchAll();

echo json_encode([
    'success' => true,
    'total_orders' => $totalOrders,
    'status_counts' => $statusCounts,
    'recent_orders' => $recentOrders
]);
?>