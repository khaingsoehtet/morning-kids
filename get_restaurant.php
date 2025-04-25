<?php
require 'db.php';
$stmt = $pdo->query("SELECT * FROM restaurant_info LIMIT 1");
$info = $stmt->fetch();
echo json_encode($info ?: []);
?>