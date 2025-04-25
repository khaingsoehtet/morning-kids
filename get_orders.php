<?php
require 'auth.php';
require 'db.php';
$stmt = $pdo->query("SELECT * FROM orders ORDER BY id DESC LIMIT 50");
echo json_encode(['orders' => $stmt->fetchAll()]);
?>