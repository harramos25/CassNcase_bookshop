<?php
// Simple API to save stock data
header('Content-Type: application/json');

// Allow CORS if needed, or remove for strict same-origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    
    // Validate JSON
    $data = json_decode($input, true);
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
        exit;
    }

    // Path to stock.json
    $file = '../assets/data/stock.json';

    if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Stock updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to write file']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
