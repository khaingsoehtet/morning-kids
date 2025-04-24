<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid input.',
        'debug' => file_get_contents('php://input')
    ]);
    exit;
}

// Validate required fields
$required = ['name', 'age_group', 'description', 'ingredients', 'price', 'image', 'available'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        echo json_encode([
            'success' => false,
            'error' => "Missing required field: $field"
        ]);
        exit;
    }
}

try {
    if (isset($data['id']) && $data['id'] !== '') {
        $stmt = $pdo->prepare("UPDATE menu_items SET name=?, age_group=?, description=?, ingredients=?, price=?, image=?, available=? WHERE id=?");
        $stmt->execute([
            $data['name'],
            $data['age_group'],
            $data['description'],
            $data['ingredients'],
            $data['price'],
            $data['image'],
            $data['available'],
            $data['id']
        ]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO menu_items (name, age_group, description, ingredients, price, image, available) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['age_group'],
            $data['description'],
            $data['ingredients'],
            $data['price'],
            $data['image'],
            $data['available']
        ]);
    }
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'data' => $data
    ]);
}
?>