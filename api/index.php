<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbPath = __DIR__ . '/../db/bounty.db';
if (!file_exists($dbPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbank nicht gefunden. Bitte init.php aufrufen.']);
    exit;
}
$db = new SQLite3($dbPath);
$db->busyTimeout(5000);
$db->exec('PRAGMA journal_mode = WAL');

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$uri = strtok($uri, '?');
$uri = str_replace('/api/', '', $uri);
$parts = explode('/', $uri);
$action = $parts[0] ?? '';

function auth() {
    if (isset($_SESSION['user_id'])) {
        return $_SESSION['user_id'];
    }
    http_response_code(401);
    echo json_encode(['error' => 'Nicht eingeloggt']);
    exit;
}

function isAdmin($db) {
    $id = $_SESSION['user_id'] ?? 0;
    $role = $db->querySingle("SELECT role FROM users WHERE id = $id");
    return in_array($role, ['owner', 'admin']);
}

function isOwner($db) {
    $id = $_SESSION['user_id'] ?? 0;
    $role = $db->querySingle("SELECT role FROM users WHERE id = $id");
    return $role === 'owner';
}

switch ($action) {
    case 'login':
        if ($method !== 'POST') { http_response_code(405); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $pw = $data['password'] ?? '';
        
        $stmt = $db->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $result = $stmt->execute();
        $user = $result->fetchArray(SQLITE3_ASSOC);
        
        if ($user && password_verify($pw, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            echo json_encode(['success' => true, 'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
                'mcname' => $user['mcname'],
                'color' => $user['color']
            ]]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Ungültige Anmeldedaten']);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    case 'me':
        $id = auth();
        $user = $db->querySingle("SELECT id, username, email, role, mcname, color FROM users WHERE id = $id", true);
        echo json_encode($user);
        break;

    case 'users':
        if ($method === 'GET') {
            auth();
            $users = $db->query('SELECT id, username, email, role, mcname, color, created_at FROM users ORDER BY id');
            $list = [];
            while ($row = $users->fetchArray(SQLITE3_ASSOC)) {
                $list[] = $row;
            }
            echo json_encode($list);
        } elseif ($method === 'POST') {
            auth();
            if (!isAdmin($db)) { http_response_code(403); echo json_encode(['error' => 'Keine Berechtigung']); exit; }
            $data = json_decode(file_get_contents('php://input'), true);
            $username = $data['username'] ?? '';
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';
            $role = $data['role'] ?? 'builder';
            $mcname = $data['mcname'] ?? $username;
            $color = $data['color'] ?? '#2ecc71';
            
            if (empty($username) || empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'Pflichtfelder fehlen']);
                exit;
            }
            
            $pw = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $db->prepare('INSERT INTO users (username, email, password, role, mcname, color) VALUES (:username, :email, :password, :role, :mcname, :color)');
            $stmt->bindValue(':username', $username, SQLITE3_TEXT);
            $stmt->bindValue(':email', $email, SQLITE3_TEXT);
            $stmt->bindValue(':password', $pw, SQLITE3_TEXT);
            $stmt->bindValue(':role', $role, SQLITE3_TEXT);
            $stmt->bindValue(':mcname', $mcname, SQLITE3_TEXT);
            $stmt->bindValue(':color', $color, SQLITE3_TEXT);
            $stmt->execute();
            
            echo json_encode(['success' => true, 'id' => $db->lastInsertRowID()]);
        } elseif ($method === 'DELETE') {
            auth();
            if (!isOwner($db)) { http_response_code(403); echo json_encode(['error' => 'Keine Berechtigung']); exit; }
            $userId = $parts[1] ?? 0;
            if ($userId == $_SESSION['user_id']) { http_response_code(400); echo json_encode(['error' => 'Kann sich nicht selbst löschen']); exit; }
            $db->exec("DELETE FROM users WHERE id = $userId");
            echo json_encode(['success' => true]);
        } elseif ($method === 'PUT') {
            auth();
            if (!isAdmin($db)) { http_response_code(403); echo json_encode(['error' => 'Keine Berechtigung']); exit; }
            $userId = $parts[1] ?? 0;
            $data = json_decode(file_get_contents('php://input'), true);
            $fields = [];
            $bindings = [];
            foreach (['username', 'email', 'role', 'mcname', 'color'] as $f) {
                if (isset($data[$f])) {
                    $fields[] = "$f = :$f";
                    $bindings[":$f"] = $data[$f];
                }
            }
            if (isset($data['password']) && !empty($data['password'])) {
                $fields[] = 'password = :password';
                $bindings[':password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
            if (!empty($fields)) {
                $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
                $bindings[':id'] = $userId;
                $stmt = $db->prepare($sql);
                foreach ($bindings as $k => $v) {
                    $stmt->bindValue($k, $v, SQLITE3_TEXT);
                }
                $stmt->execute();
            }
            echo json_encode(['success' => true]);
        }
        break;

    case 'announcements':
        if ($method === 'GET') {
            auth();
            $rows = $db->query('SELECT a.*, u.username, u.mcname, u.color FROM announcements a JOIN users u ON a.author_id = u.id ORDER BY a.created_at DESC');
            $list = [];
            while ($row = $rows->fetchArray(SQLITE3_ASSOC)) {
                $list[] = $row;
            }
            echo json_encode($list);
        } elseif ($method === 'POST') {
            $id = auth();
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare('INSERT INTO announcements (title, content, author_id, category) VALUES (:title, :content, :author_id, :category)');
            $stmt->bindValue(':title', $data['title'] ?? '', SQLITE3_TEXT);
            $stmt->bindValue(':content', $data['content'] ?? '', SQLITE3_TEXT);
            $stmt->bindValue(':author_id', $id, SQLITE3_INTEGER);
            $stmt->bindValue(':category', $data['category'] ?? 'general', SQLITE3_TEXT);
            $stmt->execute();
            echo json_encode(['success' => true, 'id' => $db->lastInsertRowID()]);
        } elseif ($method === 'DELETE') {
            auth();
            if (!isAdmin($db)) { http_response_code(403); echo json_encode(['error' => 'Keine Berechtigung']); exit; }
            $annId = $parts[1] ?? 0;
            $db->exec("DELETE FROM announcements WHERE id = $annId");
            echo json_encode(['success' => true]);
        }
        break;

    case 'projects':
        if ($method === 'GET') {
            auth();
            $rows = $db->query('SELECT p.*, u.username, u.mcname FROM projects p JOIN users u ON p.builder_id = u.id ORDER BY p.created_at DESC');
            $list = [];
            while ($row = $rows->fetchArray(SQLITE3_ASSOC)) {
                $list[] = $row;
            }
            echo json_encode($list);
        } elseif ($method === 'POST') {
            $id = auth();
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare('INSERT INTO projects (name, description, builder_id) VALUES (:name, :description, :builder_id)');
            $stmt->bindValue(':name', $data['name'] ?? '', SQLITE3_TEXT);
            $stmt->bindValue(':description', $data['description'] ?? '', SQLITE3_TEXT);
            $stmt->bindValue(':builder_id', $id, SQLITE3_INTEGER);
            $stmt->execute();
            echo json_encode(['success' => true, 'id' => $db->lastInsertRowID()]);
        } elseif ($method === 'DELETE') {
            auth();
            if (!isAdmin($db)) { http_response_code(403); echo json_encode(['error' => 'Keine Berechtigung']); exit; }
            $pId = $parts[1] ?? 0;
            $db->exec("DELETE FROM projects WHERE id = $pId");
            echo json_encode(['success' => true]);
        }
        break;

    case 'chat':
        if ($method === 'GET') {
            auth();
            $rows = $db->query('SELECT c.*, u.username, u.mcname, u.color FROM chat c JOIN users u ON c.user_id = u.id ORDER BY c.created_at ASC');
            $list = [];
            while ($row = $rows->fetchArray(SQLITE3_ASSOC)) {
                $list[] = $row;
            }
            echo json_encode($list);
        } elseif ($method === 'POST') {
            $id = auth();
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare('INSERT INTO chat (user_id, message) VALUES (:user_id, :message)');
            $stmt->bindValue(':user_id', $id, SQLITE3_INTEGER);
            $stmt->bindValue(':message', $data['message'] ?? '', SQLITE3_TEXT);
            $stmt->execute();
            echo json_encode(['success' => true, 'id' => $db->lastInsertRowID()]);
        } elseif ($method === 'DELETE') {
            auth();
            if (!isAdmin($db)) { http_response_code(403); echo json_encode(['error' => 'Keine Berechtigung']); exit; }
            $msgId = $parts[1] ?? 0;
            $db->exec("DELETE FROM chat WHERE id = $msgId");
            echo json_encode(['success' => true]);
        }
        break;

    case 'tb':
        if ($method === 'GET') {
            auth();
            $rows = $db->query('SELECT t.*, u.username, u.mcname, u.color FROM tb_entries t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC');
            $list = [];
            while ($row = $rows->fetchArray(SQLITE3_ASSOC)) {
                $list[] = $row;
            }
            echo json_encode($list);
        } elseif ($method === 'POST') {
            $id = auth();
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare('INSERT INTO tb_entries (user_id, date, reason, detail) VALUES (:user_id, :date, :reason, :detail)');
            $stmt->bindValue(':user_id', $id, SQLITE3_INTEGER);
            $stmt->bindValue(':date', $data['date'] ?? '', SQLITE3_TEXT);
            $stmt->bindValue(':reason', $data['reason'] ?? '', SQLITE3_TEXT);
            $stmt->bindValue(':detail', $data['detail'] ?? '', SQLITE3_TEXT);
            $stmt->execute();
            echo json_encode(['success' => true, 'id' => $db->lastInsertRowID()]);
        } elseif ($method === 'DELETE') {
            auth();
            $tbId = $parts[1] ?? 0;
            $userId = $_SESSION['user_id'];
            if (!isAdmin($db)) {
                $check = $db->querySingle("SELECT user_id FROM tb_entries WHERE id = $tbId");
                if ($check != $userId) { http_response_code(403); echo json_encode(['error' => 'Keine Berechtigung']); exit; }
            }
            $db->exec("DELETE FROM tb_entries WHERE id = $tbId");
            echo json_encode(['success' => true]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Unbekannter Endpoint']);
}

$db->close();

