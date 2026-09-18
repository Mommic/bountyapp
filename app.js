const USERS = {
    mommicmc: { id: 1, username: 'mommicmc', email: 'mommicmc@bountymc.de', role: 'owner', color: '#e74c3c', pw: 'admin123', desc: 'Obersteleitung', mcname: 'MommicMc' },
    noahvexon: { id: 2, username: 'noahvexon', email: 'noahvexon@bountymc.de', role: 'owner', color: '#c0392b', pw: 'admin123', desc: 'Stv. Obersteleitung', mcname: 'NoahVexon' },
    zimsahne: { id: 3, username: 'zimsahne', email: 'zimsahne@bountymc.de', role: 'admin', color: '#9b59b6', pw: 'admin123', desc: 'StvOwner, Leitung Support', mcname: '_zImSahne07' },
    craftmaster: { id: 4, username: 'craftmaster', email: 'craftmaster@bountymc.de', role: 'builder', color: '#f39c12', pw: 'admin123', desc: 'Bauleitung, Builder Building', mcname: 'CraftMaster_200' }
};

const ROLE_LABELS = {
    owner: 'Owner',
    admin: 'StvOwner',
    builder: 'Builder'
};

const ICONS = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    hammer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15.06 3.34a3 3 0 0 0-4.24 0L3.34 10.82a3 3 0 0 0 0 4.24l5.58 5.58a3 3 0 0 0 4.24 0l7.48-7.48a3 3 0 0 0 0-4.24L15.06 3.34z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
};

function mcHead(name) {
    return 'https://mc-heads.net/avatar/' + name + '/48';
}

const NAV = {
    owner: [
        { s: 'dashboard', l: 'Dashboard', i: 'dashboard' },
        { s: 'team', l: 'Teammitglieder', i: 'users' },
        { s: 'announcements', l: 'Ankündigungen', i: 'megaphone' },
        { s: 'builder', l: 'Builder-Bereich', i: 'hammer' },
        { s: 'chat', l: 'Leitungs-Chat', i: 'chat' },
        { s: 'tb', l: 'TB Abmeldungen', i: 'calendar' }
    ],
    admin: [
        { s: 'dashboard', l: 'Dashboard', i: 'dashboard' },
        { s: 'team', l: 'Teammitglieder', i: 'users' },
        { s: 'announcements', l: 'Ankündigungen', i: 'megaphone' },
        { s: 'builder', l: 'Builder-Bereich', i: 'hammer' },
        { s: 'chat', l: 'Leitungs-Chat', i: 'chat' },
        { s: 'tb', l: 'TB Abmeldungen', i: 'calendar' }
    ],
    builder: [
        { s: 'dashboard', l: 'Dashboard', i: 'dashboard' },
        { s: 'announcements', l: 'Ankündigungen', i: 'megaphone' },
        { s: 'builder', l: 'Builder-Bereich', i: 'hammer' },
        { s: 'tb', l: 'TB Abmeldungen', i: 'calendar' }
    ]
};

let currentUser = null;
let currentSection = 'dashboard';

function getDB() {
    let d = localStorage.getItem('bountydb2');
    if (!d) {
        d = JSON.stringify({
            announcements: [],
            projects: [],
            chat: [
                { id: 1, user: 'mommicmc', message: 'Willkommen im Leitungs-Chat!', created_at: '2026-09-18T10:00:00' }
            ],
            tb: []
        });
        localStorage.setItem('bountydb2', d);
    }
    return JSON.parse(d);
}

function saveDB(d) {
    localStorage.setItem('bountydb2', JSON.stringify(d));
}

function db() {
    return getDB();
}

function fillLogin(email) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = 'admin123';
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var pw = document.getElementById('password').value;
    var err = document.getElementById('errorMessage');
    var u = Object.values(USERS).find(function(u) { return u.email === email && u.pw === pw; });
    if (u) {
        currentUser = u;
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboardPage').style.display = 'flex';
        initDashboard();
    } else {
        err.textContent = 'Ungültige E-Mail oder Passwort';
    }
});

function logout() {
    currentUser = null;
    currentSection = 'dashboard';
    document.getElementById('loginPage').style.display = '';
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('errorMessage').textContent = '';
}

function initDashboard() {
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userRole').textContent = currentUser.desc;
    document.getElementById('userAvatar').src = mcHead(currentUser.mcname);
    document.getElementById('userAvatar').style.background = currentUser.color;
    document.getElementById('userAvatar').style.borderRadius = '10px';

    var nav = NAV[currentUser.role] || NAV.builder;
    document.getElementById('sidebarNav').innerHTML = nav.map(function(n) {
        return '<div class="nav-item" onclick="navigateTo(\'' + n.s + '\')" data-section="' + n.s + '">' + ICONS[n.i] + '<span>' + n.l + '</span></div>';
    }).join('');

    navigateTo('dashboard');
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    document.getElementById('currentTime').textContent = new Date().toLocaleString('de-DE', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function navigateTo(s) {
    currentSection = s;
    document.querySelectorAll('.nav-item').forEach(function(n) {
        n.classList.toggle('active', n.dataset.section === s);
    });
    document.getElementById('sidebar').classList.remove('open');

    var titles = {
        dashboard: 'Dashboard',
        team: 'Teammitglieder',
        announcements: 'Ankündigungen',
        builder: 'Builder-Bereich',
        chat: 'Leitungs-Chat',
        tb: 'TB Abmeldungen'
    };
    document.getElementById('pageTitle').textContent = titles[s] || 'Dashboard';

    var loaders = {
        dashboard: loadDashboard,
        team: loadTeam,
        announcements: loadAnnouncements,
        builder: loadBuilder,
        chat: loadChat,
        tb: loadTB
    };
    if (loaders[s]) loaders[s]();
}

function loadDashboard() {
    var d = db();
    var c = function(key) { return d[key] ? d[key].length : 0; };

    document.getElementById('contentArea').innerHTML =
        '<div class="stats-grid">' +
            '<div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon blue">' + ICONS.users + '</div></div><div class="stat-card-value">' + Object.keys(USERS).length + '</div><div class="stat-card-label">Teammitglieder</div></div>' +
            '<div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon green">' + ICONS.megaphone + '</div></div><div class="stat-card-value">' + c('announcements') + '</div><div class="stat-card-label">Ankündigungen</div></div>' +
            '<div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon purple">' + ICONS.hammer + '</div></div><div class="stat-card-value">' + c('projects') + '</div><div class="stat-card-label">Bauprojekte</div></div>' +
        '</div>' +
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Schnellaktionen</h3></div><div class="content-card-body"><div class="quick-actions">' +
            '<button class="quick-action-btn" onclick="navigateTo(\'announcements\')"><div class="quick-action-icon blue">' + ICONS.megaphone + '</div><span class="quick-action-label">Ankündigungen</span></button>' +
            '<button class="quick-action-btn" onclick="navigateTo(\'builder\')"><div class="quick-action-icon green">' + ICONS.hammer + '</div><span class="quick-action-label">Builder-Bereich</span></button>' +
            '<button class="quick-action-btn" onclick="navigateTo(\'team\')"><div class="quick-action-icon purple">' + ICONS.users + '</div><span class="quick-action-label">Team</span></button>' +
            (currentUser.role === 'owner' || currentUser.role === 'admin' ? '<button class="quick-action-btn" onclick="navigateTo(\'chat\')"><div class="quick-action-icon orange">' + ICONS.chat + '</div><span class="quick-action-label">Leitungs-Chat</span></button>' : '') +
        '</div></div></div>' +
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Letzte Ankündigungen</h3></div><div class="content-card-body">' +
        (d.announcements.length === 0 ? '<div class="empty-state"><h3>Keine Ankündigungen</h3></div>' :
        d.announcements.slice(0, 3).map(function(a) {
            return '<div class="announcement-item"><div class="announcement-header"><span class="announcement-title">' + esc(a.title) + '</span><span class="announcement-category ' + a.category + '">' + a.category + '</span></div><div class="announcement-content">' + esc(a.content).substring(0, 150) + (a.content.length > 150 ? '...' : '') + '</div><div class="announcement-meta"><span>' + ICONS.clock + ' ' + fmtDate(a.created_at) + '</span><span>von ' + esc(a.author) + '</span></div></div>';
        }).join('')) +
        '</div></div>';
}

function loadTeam() {
    var users = Object.values(USERS);
    document.getElementById('contentArea').innerHTML =
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Teammitglieder (' + users.length + ')</h3></div><div class="content-card-body">' +
        '<div class="team-grid">' +
        users.map(function(u) {
            return '<div class="team-card">' +
                '<div class="team-avatar-wrap"><img class="team-avatar" src="' + mcHead(u.mcname) + '" alt="' + esc(u.mcname) + '" onerror="this.style.display=\'none\'"></div>' +
                '<div class="team-info">' +
                    '<div class="team-mcname">' + esc(u.mcname) + '</div>' +
                    '<div class="team-email">' + esc(u.email) + '</div>' +
                    '<span class="user-item-role ' + u.role + '">' + (ROLE_LABELS[u.role] || u.role) + '</span>' +
                    '<div class="team-desc">' + esc(u.desc) + '</div>' +
                '</div>' +
            '</div>';
        }).join('') +
        '</div>' +
        '</div></div>';
}

function loadAnnouncements() {
    var d = db();
    var canEdit = ['owner', 'admin', 'builder'].indexOf(currentUser.role) !== -1;
    var canDelete = currentUser.role === 'owner' || currentUser.role === 'admin';

    document.getElementById('contentArea').innerHTML =
        (canEdit ? '<div style="margin-bottom:24px"><button class="btn btn-primary" onclick="showNewAnnouncement()">' + ICONS.plus + ' Neue Ankündigung</button></div>' : '') +
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Ankündigungen (' + d.announcements.length + ')</h3></div><div class="content-card-body">' +
        (d.announcements.length === 0 ? '<div class="empty-state"><h3>Keine Ankündigungen</h3></div>' :
        d.announcements.map(function(a) {
            var u = Object.values(USERS).find(function(u) { return u.username === a.author; });
            var mcname = u ? u.mcname : a.author;
            return '<div class="announcement-item"><div class="announcement-header"><div style="display:flex;align-items:center;gap:12px"><img class="mc-head-small" src="' + mcHead(mcname) + '" alt="" onerror="this.style.display=\'none\'"><span class="announcement-title">' + esc(a.title) + '</span></div><div style="display:flex;gap:8px;align-items:center"><span class="announcement-category ' + a.category + '">' + a.category + '</span>' +
            (canDelete ? '<button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(' + a.id + ')">' + ICONS.trash + '</button>' : '') +
            '</div></div><div class="announcement-content">' + esc(a.content) + '</div><div class="announcement-meta"><span>' + ICONS.clock + ' ' + fmtDate(a.created_at) + '</span><span>von ' + esc(mcname) + '</span></div></div>';
        }).join('')) +
        '</div></div>';
}

function showNewAnnouncement() {
    openModal('Neue Ankündigung',
        '<form id="newAnnForm">' +
        '<div class="form-group"><label>Titel</label><input type="text" id="annTitle" placeholder="Ankündigungstitel" required></div>' +
        '<div class="form-group"><label>Inhalt</label><textarea id="annContent" placeholder="Ankündigungstext..." required></textarea></div>' +
        '<div class="form-group"><label>Kategorie</label><select id="annCat"><option value="general">Allgemein</option><option value="important">Wichtig</option><option value="update">Update</option></select></div>' +
        '<button type="submit" class="btn btn-primary" style="width:100%">' + ICONS.check + ' Veröffentlichen</button></form>'
    );
    document.getElementById('newAnnForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var d = db();
        d.announcements.unshift({
            id: Date.now(),
            title: document.getElementById('annTitle').value,
            content: document.getElementById('annContent').value,
            author: currentUser.username,
            category: document.getElementById('annCat').value,
            created_at: new Date().toISOString()
        });
        saveDB(d);
        closeModal();
        loadAnnouncements();
    });
}

function deleteAnnouncement(id) {
    if (!confirm('Ankündigung wirklich löschen?')) return;
    var d = db();
    d.announcements = d.announcements.filter(function(a) { return a.id !== id; });
    saveDB(d);
    loadAnnouncements();
}

function loadBuilder() {
    var d = db();
    var buildAnns = d.announcements;

    document.getElementById('contentArea').innerHTML =
        '<div style="margin-bottom:24px;display:flex;gap:12px;flex-wrap:wrap">' +
            '<button class="btn btn-primary" onclick="showNewProject()">' + ICONS.plus + ' Neues Bauprojekt</button>' +
            '<button class="btn btn-primary" onclick="showNewBuildAnnouncement()">' + ICONS.plus + ' Neue Bauleitung Ankündigung</button>' +
        '</div>' +
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Bauleitung - Ankündigungen</h3></div><div class="content-card-body">' +
        (buildAnns.length === 0 ? '<div class="empty-state"><h3>Keine Ankündigungen</h3></div>' :
        buildAnns.map(function(a) {
            var u = Object.values(USERS).find(function(u) { return u.username === a.author; });
            var mcname = u ? u.mcname : a.author;
            var canDel = currentUser.role === 'owner' || currentUser.role === 'admin' || a.author === currentUser.username;
            return '<div class="announcement-item"><div class="announcement-header"><div style="display:flex;align-items:center;gap:12px"><img class="mc-head-small" src="' + mcHead(mcname) + '" alt="" onerror="this.style.display=\'none\'"><span class="announcement-title">' + esc(a.title) + '</span></div><div style="display:flex;gap:8px;align-items:center"><span class="announcement-category ' + a.category + '">' + a.category + '</span>' + (canDel ? '<button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(' + a.id + ')">' + ICONS.trash + '</button>' : '') + '</div></div><div class="announcement-content">' + esc(a.content) + '</div><div class="announcement-meta"><span>' + ICONS.clock + ' ' + fmtDate(a.created_at) + '</span><span>von ' + esc(mcname) + '</span></div></div>';
        }).join('')) +
        '</div></div>' +
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Bauprojekte (' + d.projects.length + ')</h3></div><div class="content-card-body">' +
        (d.projects.length === 0 ? '<div class="empty-state"><h3>Keine Bauprojekte</h3></div>' :
        d.projects.map(function(p) {
            var statusLabel = p.status === 'in_progress' ? 'In Arbeit' : p.status === 'completed' ? 'Fertig' : 'Geplant';
            return '<div class="project-item"><div class="project-header"><span class="project-name">' + esc(p.name) + '</span><span class="project-status ' + p.status + '">' + statusLabel + '</span></div>' +
            (p.description ? '<div class="project-description">' + esc(p.description) + '</div>' : '') +
            '<div class="project-meta"><span>' + ICONS.clock + ' ' + fmtDate(p.created_at) + '</span><span>von ' + esc(p.builder) + '</span></div></div>';
        }).join('')) +
        '</div></div>';
}

function showNewProject() {
    openModal('Neues Bauprojekt',
        '<form id="newProjectForm">' +
        '<div class="form-group"><label>Projektname</label><input type="text" id="projName" placeholder="z.B. Spawn-Gebäude" required></div>' +
        '<div class="form-group"><label>Beschreibung</label><textarea id="projDesc" placeholder="Beschreibe das Projekt..."></textarea></div>' +
        '<button type="submit" class="btn btn-primary" style="width:100%">' + ICONS.check + ' Projekt erstellen</button></form>'
    );
    document.getElementById('newProjectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var d = db();
        d.projects.unshift({
            id: Date.now(),
            name: document.getElementById('projName').value,
            description: document.getElementById('projDesc').value,
            status: 'in_progress',
            builder: currentUser.username,
            created_at: new Date().toISOString()
        });
        saveDB(d);
        closeModal();
        loadBuilder();
    });
}

function showNewBuildAnnouncement() {
    openModal('Neue Bauleitung Ankündigung',
        '<form id="newBuildAnnForm">' +
        '<div class="form-group"><label>Titel</label><input type="text" id="buildAnnTitle" placeholder="Ankündigungstitel" required></div>' +
        '<div class="form-group"><label>Inhalt</label><textarea id="buildAnnContent" placeholder="Ankündigungstext..." required></textarea></div>' +
        '<button type="submit" class="btn btn-primary" style="width:100%">' + ICONS.check + ' Veröffentlichen</button></form>'
    );
    document.getElementById('newBuildAnnForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var d = db();
        d.announcements.unshift({
            id: Date.now(),
            title: document.getElementById('buildAnnTitle').value,
            content: document.getElementById('buildAnnContent').value,
            author: currentUser.username,
            category: 'update',
            created_at: new Date().toISOString()
        });
        saveDB(d);
        closeModal();
        loadBuilder();
    });
}

function loadChat() {
    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
        document.getElementById('contentArea').innerHTML = '<div class="empty-state"><h3>Keine Berechtigung</h3></div>';
        return;
    }
    var d = db();
    var messages = d.chat || [];

    document.getElementById('contentArea').innerHTML =
        '<div class="content-card" style="display:flex;flex-direction:column;height:calc(100vh - 180px)">' +
        '<div class="content-card-header"><h3 class="content-card-title">Leitungs-Chat</h3><span style="color:var(--t3);font-size:12px">' + messages.length + ' Nachrichten</span></div>' +
        '<div class="chat-messages" id="chatMessages">' +
        (messages.length === 0 ? '<div class="empty-state"><h3>Keine Nachrichten</h3></div>' :
        messages.map(function(m) {
            var u = Object.values(USERS).find(function(u) { return u.username === m.user; });
            var mcname = u ? u.mcname : m.user;
            var color = u ? u.color : '#666';
            var isMe = m.user === currentUser.username;
            var canDel = currentUser.role === 'owner' || currentUser.role === 'admin' || isMe;
            return '<div class="chat-msg' + (isMe ? ' chat-msg-me' : '') + '">' +
                '<img class="chat-avatar" src="' + mcHead(mcname) + '" alt="" onerror="this.style.display=\'none\'">' +
                '<div class="chat-bubble" style="border-left:3px solid ' + color + '">' +
                    '<div class="chat-name" style="color:' + color + '">' + esc(mcname) + '</div>' +
                    '<div class="chat-text">' + esc(m.message) + '</div>' +
                    '<div class="chat-time">' + fmtDate(m.created_at) + (canDel ? ' <span class="chat-delete" onclick="deleteChatMsg(' + m.id + ')">&#10005;</span>' : '') + '</div>' +
                '</div>' +
            '</div>';
        }).join('')) +
        '</div>' +
        '<div class="chat-input-area">' +
        '<form id="chatForm" class="chat-form">' +
            '<input type="text" id="chatInput" placeholder="Nachricht schreiben..." autocomplete="off">' +
            '<button type="submit" class="btn btn-primary">' + ICONS.send + '</button>' +
        '</form>' +
        '</div>' +
        '</div>';

    var chatEl = document.getElementById('chatMessages');
    chatEl.scrollTop = chatEl.scrollHeight;

    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var input = document.getElementById('chatInput');
        var msg = input.value.trim();
        if (!msg) return;
        var d = db();
        if (!d.chat) d.chat = [];
        d.chat.push({
            id: Date.now(),
            user: currentUser.username,
            message: msg,
            created_at: new Date().toISOString()
        });
        saveDB(d);
        input.value = '';
        loadChat();
    });
}

function loadTB() {
    var d = db();
    var entries = d.tb || [];

    var ownEntries = entries.filter(function(e) { return e.user === currentUser.username; });
    var allEntries = entries;

    document.getElementById('contentArea').innerHTML =
        '<div style="margin-bottom:24px"><button class="btn btn-primary" onclick="showNewTB()">' + ICONS.plus + ' TB abmelden</button></div>' +
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Meine Abmeldungen (' + ownEntries.length + ')</h3></div><div class="content-card-body">' +
        (ownEntries.length === 0 ? '<div class="empty-state"><h3>Keine Abmeldungen</h3><p>Du bist für alle TBs angemeldet.</p></div>' :
        ownEntries.map(function(e) {
            var u = Object.values(USERS).find(function(u) { return u.username === e.user; });
            var mcname = u ? u.mcname : e.user;
            return '<div class="tb-item">' +
                '<div class="tb-header"><div style="display:flex;align-items:center;gap:12px"><img class="mc-head-small" src="' + mcHead(mcname) + '" alt="" onerror="this.style.display=\'none\'"><span class="tb-date">' + fmtDate(e.date) + '</span></div><button class="btn btn-danger btn-sm" onclick="deleteTB(' + e.id + ')">' + ICONS.trash + '</button></div>' +
                '<div class="tb-reason"><strong>Grund:</strong> ' + esc(e.reason) + '</div>' +
                (e.detail ? '<div class="tb-detail">' + esc(e.detail) + '</div>' : '') +
            '</div>';
        }).join('')) +
        '</div></div>' +
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Alle Abmeldungen (' + allEntries.length + ')</h3></div><div class="content-card-body">' +
        (allEntries.length === 0 ? '<div class="empty-state"><h3>Keine Abmeldungen</h3></div>' :
        allEntries.map(function(e) {
            var u = Object.values(USERS).find(function(u) { return u.username === e.user; });
            var mcname = u ? u.mcname : e.user;
            var color = u ? u.color : '#666';
            return '<div class="tb-item">' +
                '<div class="tb-header"><div style="display:flex;align-items:center;gap:12px"><img class="mc-head-small" src="' + mcHead(mcname) + '" alt="" onerror="this.style.display=\'none\'"><span class="tb-name" style="color:' + color + '">' + esc(mcname) + '</span><span class="tb-date">' + fmtDate(e.date) + '</span></div></div>' +
                '<div class="tb-reason"><strong>Grund:</strong> ' + esc(e.reason) + '</div>' +
                (e.detail ? '<div class="tb-detail">' + esc(e.detail) + '</div>' : '') +
            '</div>';
        }).join('')) +
        '</div></div>';
}

function showNewTB() {
    openModal('TB abmelden',
        '<form id="newTBForm">' +
        '<div class="form-group"><label>Datum der TB</label><input type="date" id="tbDate" required></div>' +
        '<div class="form-group"><label>Grund</label><select id="tbReason" required>' +
            '<option value="">Grund wählen...</option>' +
            '<option value="Krank">Krank</option>' +
            '<option value="Urlaub">Urlaub</option>' +
            '<option value="Arbeit/Schule">Arbeit / Schule</option>' +
            '<option value="Termin">Termin</option>' +
            '<option value="Sonstiges">Sonstiges</option>' +
        '</select></div>' +
        '<div class="form-group"><label>Details (optional)</label><textarea id="tbDetail" placeholder="Weitere Infos..."></textarea></div>' +
        '<button type="submit" class="btn btn-primary" style="width:100%">' + ICONS.check + ' Abmeldung absenden</button></form>'
    );
    document.getElementById('tbDate').valueAsDate = new Date();
    document.getElementById('newTBForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var d = db();
        if (!d.tb) d.tb = [];
        d.tb.unshift({
            id: Date.now(),
            user: currentUser.username,
            date: document.getElementById('tbDate').value,
            reason: document.getElementById('tbReason').value,
            detail: document.getElementById('tbDetail').value,
            created_at: new Date().toISOString()
        });
        saveDB(d);
        closeModal();
        loadTB();
    });
}

function deleteTB(id) {
    if (!confirm('Abmeldung wirklich löschen?')) return;
    var d = db();
    d.tb = d.tb.filter(function(e) { return e.id !== id; });
    saveDB(d);
    loadTB();
}

function deleteChatMsg(id) {
    if (!confirm('Nachricht wirklich löschen?')) return;
    var d = db();
    d.chat = d.chat.filter(function(m) { return m.id !== id; });
    saveDB(d);
    loadChat();
}

function openModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function esc(t) {
    var d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
}

function fmtDate(s) {
    return new Date(s).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
