<?php
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input.']);
    exit;
}

if (file_put_contents('data.json', json_encode($data, JSON_PRETTY_PRINT)) === false) {
    echo json_encode(['success' => false, 'error' => 'Failed to write to file.']);
    exit;
}

echo json_encode(['success' => true]);
?>
