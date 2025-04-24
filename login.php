<?php
session_start();
header('Content-Type: application/json');

// Set your admin credentials here (or load from env)
$ADMIN_USER = 'admin';
$ADMIN_PASS = 'admin123'; // Change this in production!

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'error' => 'Missing credentials']);
    exit;
}

if ($data['username'] === $ADMIN_USER && $data['password'] === $ADMIN_PASS) {
    $_SESSION['admin_logged_in'] = true;
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
}
?>