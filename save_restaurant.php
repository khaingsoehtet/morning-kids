<?php
require 'auth.php';
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name'], $data['address'], $data['lat'], $data['lng'])) {
    echo json_encode(['success' => false, 'error' => 'Missing fields']);
    exit;
}

try {
    if (isset($data['id']) && $data['id']) {
        $stmt = $pdo->prepare("UPDATE restaurant_info SET name=?, address=?, lat=?, lng=? WHERE id=?");
        $stmt->execute([$data['name'], $data['address'], $data['lat'], $data['lng'], $data['id']]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO restaurant_info (name, address, lat, lng) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['address'], $data['lat'], $data['lng']]);
    }
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>