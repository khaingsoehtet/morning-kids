<?php
require 'db.php';
$stmt = $pdo->query("SELECT * FROM restaurant_info");
echo json_encode($stmt->fetchAll());
?>