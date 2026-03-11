<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, "Method not allowed. Use POST.", null, 405);
}

// ─── Parse JSON Body ────────────────────────────────────
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    sendResponse(false, "Invalid JSON body.", null, 400);
}

// ─── Validate Required Fields ──────────────────────────
$name  = sanitize($input['name']  ?? '');
$email = sanitize($input['email'] ?? '');
$phone = sanitize($input['phone'] ?? '');

if (empty($name) || empty($email) || empty($phone)) {
    sendResponse(false, "Name, email, and phone are required.", null, 400);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, "Invalid email address format.", null, 400);
}

// Validate phone: allow digits, spaces, dashes, parentheses, plus sign (7–15 digits)
if (!preg_match('/^[\+\d\s\-\(\)]{7,20}$/', $phone)) {
    sendResponse(false, "Invalid phone number format.", null, 400);
}

// Validate name length
if (strlen($name) < 2 || strlen($name) > 100) {
    sendResponse(false, "Name must be between 2 and 100 characters.", null, 400);
}

// ─── Database Insert ────────────────────────────────
$conn = getDBConnection();

// Check for duplicate email
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    $checkStmt->close();
    $conn->close();
    sendResponse(false, "A user with this email already exists.", null, 409);
}
$checkStmt->close();

// Insert new user
$stmt = $conn->prepare(
    "INSERT INTO users (name, email, phone, created_at) VALUES (?, ?, ?, NOW())"
);
$stmt->bind_param("sss", $name, $email, $phone);

if ($stmt->execute()) {
    $newId = $conn->insert_id;
    $stmt->close();
    $conn->close();
    sendResponse(true, "User registered successfully.", [
        "id"    => $newId,
        "name"  => $name,
        "email" => $email,
        "phone" => $phone
    ], 201);
} else {
    $stmt->close();
    $conn->close();
    sendResponse(false, "Failed to register user. Please try again.", null, 500);
}
?>
