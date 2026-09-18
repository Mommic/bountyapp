<?php
$dbPath = __DIR__ . '/bounty.db';
$db = new SQLite3($dbPath);

$db->exec('
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT \'builder\',
        mcname TEXT NOT NULL,
        color TEXT DEFAULT \'#2ecc71\',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
');

$db->exec('
    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        category TEXT DEFAULT \'general\',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
    )
');

$db->exec('
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT \'in_progress\',
        builder_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (builder_id) REFERENCES users(id)
    )
');

$db->exec('
    CREATE TABLE IF NOT EXISTS chat (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
');

$db->exec('
    CREATE TABLE IF NOT EXISTS tb_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        reason TEXT NOT NULL,
        detail TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
');

$existing = $db->querySingle('SELECT COUNT(*) FROM users');
if ($existing == 0) {
    $pw = password_hash('admin123', PASSWORD_DEFAULT);
    $db->exec("INSERT INTO users (username, email, password, role, mcname, color) VALUES ('mommicmc', 'mommicmc@bountymc.de', '$pw', 'owner', 'MommicMc', '#e74c3c')");
    $db->exec("INSERT INTO users (username, email, password, role, mcname, color) VALUES ('noahvexon', 'noahvexon@bountymc.de', '$pw', 'owner', 'NoahVexon', '#c0392b')");
    $db->exec("INSERT INTO users (username, email, password, role, mcname, color) VALUES ('zimsahne', 'zimsahne@bountymc.de', '$pw', 'admin', '_zImSahne07', '#9b59b6')");
    $db->exec("INSERT INTO users (username, email, password, role, mcname, color) VALUES ('craftmaster', 'craftmaster@bountymc.de', '$pw', 'builder', 'CraftMaster_200', '#f39c12')");
}

$db->close();
echo 'Datenbank initialisiert!';

