<?php
// CORS Headers - allow React frontend to connect
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('DB_HOST', 'localhost');
define('DB_USER', 'root');        
define('DB_PASS', '');            
define('DB_NAME', 'mailer_app');

// ─── Create Connection ─────────────────────────────────
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Database connection failed: " . $conn->connect_error
        ]);
        exit();
    }

    $conn->set_charset("utf8mb4");
    return $conn;
}

// ─── Send JSON Response ────────────────────────
function sendResponse($success, $message, $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    $response = ["success" => $success, "message" => $message];
    if ($data !== null) {
        $response["data"] = $data;
    }
    echo json_encode($response);
    exit();
}

// ─── Sanitize Input ───────────────────────────
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}
?>
