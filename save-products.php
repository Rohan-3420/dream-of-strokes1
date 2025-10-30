<?php
// save-products.php - Backend script to save products to JSON file

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Get the raw POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Validate input
    if (!isset($data['products']) || !is_array($data['products'])) {
        throw new Exception('Invalid products data');
    }
    
    // Prepare the data structure
    $fileData = [
        'products' => $data['products']
    ];
    
    // Convert to JSON with pretty print
    $jsonData = json_encode($fileData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if ($jsonData === false) {
        throw new Exception('Failed to encode JSON data');
    }
    
    // Write to file
    $filePath = 'products.json';
    $result = file_put_contents($filePath, $jsonData);
    
    if ($result === false) {
        throw new Exception('Failed to write to file');
    }
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Products saved successfully',
        'count' => count($data['products'])
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

