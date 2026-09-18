var API = '/api';
var currentUser = null;
var currentSection = 'dashboard';
var allUsers = [];

var ROLE_LABELS = {
    owner: 'Owner',
    admin: 'StvOwner',
    builder: 'Builder'
};

var ICONS = {
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
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    userPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'
};

function mcHead(name) {
    return 'https://mc-heads.net/avatar/' + name + '/48';
}

var NAV = {
    owner: [
        { s: 'dashboard', l: 'Dashboard', i: 'dashboard' },
        { s: 'team', l: 'Teammitglieder', i: 'users' },
        { s: 'announcements', l: 'Ankündigungen', i: 'megaphone' },
        { s: 'builder', l: 'Builder-Bereich', i: 'hammer' },
        { s: 'chat', l: 'Leitungs-Chat', i: 'chat' },
        { s: 'tb', l: 'TB Abmeldungen', i: 'calendar' },
        { s: 'manage', l: 'User verwalten', i: 'userPlus' }
    ],
    admin: [
        { s: 'dashboard', l: 'Dashboard', i: 'dashboard' },
        { s: 'team', l: 'Teammitglieder', i: 'users' },
        { s: 'announcements', l: 'Ankündigungen', i: 'megaphone' },
        { s: 'builder', l: 'Builder-Bereich', i: 'hammer' },
        { s: 'chat', l: 'Leitungs-Chat', i: 'chat' },
        { s: 'tb', l: 'TB Abmeldungen', i: 'calendar' },
        { s: 'manage', l: 'User verwalten', i: 'userPlus' }
    ],
    builder: [
        { s: 'dashboard', l: 'Dashboard', i: 'dashboard' },
        { s: 'announcements', l: 'Ankündigungen', i: 'megaphone' },
        { s: 'builder', l: 'Builder-Bereich', i: 'hammer' },
        { s: 'tb', l: 'TB Abmeldungen', i: 'calendar' }
    ]
};

function api(action, method, data) {
    var opts = { method: method || 'GET', headers: { 'Content-Type': 'application/json' } };
    if (data) opts.body = JSON.stringify(data);
    return fetch(API + '/' + action, opts).then(function(r) {
        return r.json();
    });
}

function checkAuth() {
    api('me', 'GET').then(function(u) {
        if (u && u.id) {
            currentUser = u;
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'flex';
            initDashboard();
        }
    }).catch(function() {});
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var pw = document.getElementById('password').value;
    var err = document.getElementById('errorMessage');
    api('login', 'POST', { email: email, password: pw }).then(function(res) {
        if (res.success) {
            currentUser = res.user;
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'flex';
            initDashboard();
        } else {
            err.textContent = res.error || 'Anmeldung fehlgeschlagen';
        }
    }).catch(function() {
        err.textContent = 'Verbindungsfehler';
    });
});

function logout() {
    api('logout', 'POST').then(function() {
        currentUser = null;
        currentSection = 'dashboard';
        document.getElementById('loginPage').style.display = '';
        document.getElementById('dashboardPage').style.display = 'none';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('errorMessage').textContent = '';
    });
}

function initDashboard() {
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userRole').textContent = currentUser.mcname + ' (' + (ROLE_LABELS[currentUser.role] || currentUser.role) + ')';
    document.getElementById('userAvatar').src = mcHead(currentUser.mcname);

    var nav = NAV[currentUser.role] || NAV.builder;
    document.getElementById('sidebarNav').innerHTML = nav.map(function(n) {
        return '<div class="nav-item" onclick="navigateTo(\'' + n.s + '\')" data-section="' + n.s + '">' + ICONS[n.i] + '<span>' + n.l + '</span></div>';
    }).join('');

    loadUsers();
    navigateTo('dashboard');
    updateTime();
    setInterval(updateTime, 1000);
}

function loadUsers() {
    api('users', 'GET').then(function(users) {
        allUsers = users;
    });
}

function updateTime() {
    document.getElementById('currentTime').textContent = new Date().toLocaleString('de-DE', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

function navigateTo(s) {
    currentSection = s;
    document.querySelectorAll('.nav-item').forEach(function(n) {
        n.classList.toggle('active', n.dataset.section === s);
    });
    document.getElementById('sidebar').classList.remove('open');

    var titles = {
        dashboard: 'Dashboard', team: 'Teammitglieder', announcements: 'Ankündigungen',
        builder: 'Builder-Bereich', chat: 'Leitungs-Chat', tb: 'TB Abmeldungen', manage: 'User verwalten'
    };
    document.getElementById('pageTitle').textContent = titles[s] || 'Dashboard';

    var loaders = {
        dashboard: loadDashboard, team: loadTeam, announcements: loadAnnouncements,
        builder: loadBuilder, chat: loadChat, tb: loadTB, manage: loadManage
    };
    if (loaders[s]) loaders[s]();
}

function loadDashboard() {
    var stats = { users: allUsers.length };
    api('announcements', 'GET').then(function(anns) {
        api('projects', 'GET').then(function(projs) {
            document.getElementById('contentArea').innerHTML =
                '<div class="stats-grid">' +
                    '<div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon blue">' + ICONS.users + '</div></div><div class="stat-card-value">' + stats.users + '</div><div class="stat-card-label">Teammitglieder</div></div>' +
                    '<div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon green">' + ICONS.megaphone + '</div></div><div class="stat-card-value">' + anns.length + '</div><div class="stat-card-label">Ankündigungen</div></div>' +
                    '<div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon purple">' + ICONS.hammer + '</div></div><div class="stat-card-value">' + projs.length + '</div><div class="stat-card-label">Bauprojekte</div></div>' +
                '</div>' +
                '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Schnellaktionen</h3></div><div class="content-card-body"><div class="quick-actions">' +
                    '<button class="quick-action-btn" onclick="navigateTo(\'announcements\')"><div class="quick-action-icon blue">' + ICONS.megaphone + '</div><span class="quick-action-label">Ankündigungen</span></button>' +
                    '<button class="quick-action-btn" onclick="navigateTo(\'builder\')"><div class="quick-action-icon green">' + ICONS.hammer + '</div><span class="quick-action-label">Builder-Bereich</span></button>' +
                    '<button class="quick-action-btn" onclick="navigateTo(\'team\')"><div class="quick-action-icon purple">' + ICONS.users + '</div><span class="quick-action-label">Team</span></button>' +
                    (currentUser.role === 'owner' || currentUser.role === 'admin' ? '<button class="quick-action-btn" onclick="navigateTo(\'chat\')"><div class="quick-action-icon orange">' + ICONS.chat + '</div><span class="quick-action-label">Leitungs-Chat</span></button>' : '') +
                '</div></div></div>' +
                '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Letzte Ankündigungen</h3></div><div class="content-card-body">' +
                (anns.length === 0 ? '<div class="empty-state"><h3>Keine Ankündigungen</h3></div>' :
                anns.slice(0, 3).map(function(a) {
                    return '<div class="announcement-item"><div class="announcement-header"><div style="display:flex;align-items:center;gap:12px"><img class="mc-head-small" src="' + mcHead(a.mcname) + '" alt="" onerror="this.style.display=\'none\'"><span class="announcement-title">' + esc(a.title) + '</span></div><span class="announcement-category ' + a.category + '">' + a.category + '</span></div><div class="announcement-content">' + esc(a.content).substring(0, 150) + (a.content.length > 150 ? '...' : '') + '</div><div class="announcement-meta"><span>' + ICONS.clock + ' ' + fmtDate(a.created_at) + '</span><span>von ' + esc(a.mcname) + '</span></div></div>';
                }).join('')) +
                '</div></div>';
        });
    });
}

function loadTeam() {
    document.getElementById('contentArea').innerHTML =
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Teammitglieder (' + allUsers.length + ')</h3></div><div class="content-card-body"><div class="team-grid">' +
        allUsers.map(function(u) {
            return '<div class="team-card"><div class="team-avatar-wrap"><img class="team-avatar" src="' + mcHead(u.mcname) + '" alt="" onerror="this.style.display=\'none\'"></div><div class="team-info"><div class="team-mcname">' + esc(u.mcname) + '</div><div class="team-email">' + esc(u.email) + '</div><span class="user-item-role ' + u.role + '">' + (ROLE_LABELS[u.role] || u.role) + '</span></div></div>';
        }).join('') +
        '</div></div></div>';
}

function loadAnnouncements() {
    var canEdit = ['owner', 'admin', 'builder'].indexOf(currentUser.role) !== -1;
    var canDelete = currentUser.role === 'owner' || currentUser.role === 'admin';
    api('announcements', 'GET').then(function(list) {
        document.getElementById('contentArea').innerHTML =
            (canEdit ? '<div style="margin-bottom:24px"><button class="btn btn-primary" onclick="showNewAnnouncement()">' + ICONS.plus + ' Neue Ankündigung</button></div>' : '') +
            '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Ankündigungen (' + list.length + ')</h3></div><div class="content-card-body">' +
            (list.length === 0 ? '<div class="empty-state"><h3>Keine Ankündigungen</h3></div>' :
            list.map(function(a) {
                return '<div class="announcement-item"><div class="announcement-header"><div style="display:flex;align-items:center;gap:12px"><img class="mc-head-small" src="' + mcHead(a.mcname) + '" alt="" onerror="this.style.display=\'none\'"><span class="announcement-title">' + esc(a.title) + '</span></div><div style="display:flex;gap:8px;align-items:center"><span class="announcement-category ' + a.category + '">' + a.category + '</span>' + (canDelete || a.author_id == currentUser.id ? '<button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(' + a.id + ')">' + ICONS.trash + '</button>' : '') + '</div></div><div class="announcement-content">' + esc(a.content) + '</div><div class="announcement-meta"><span>' + ICONS.clock + ' ' + fmtDate(a.created_at) + '</span><span>von ' + esc(a.mcname) + '</span></div></div>';
            }).join('')) +
            '</div></div>';
    });
}

function showNewAnnouncement() {
    openModal('Neue Ankündigung',
        '<form id="newAnnForm"><div class="form-group"><label>Titel</label><input type="text" id="annTitle" required></div><div class="form-group"><label>Inhalt</label><textarea id="annContent" required></textarea></div><div class="form-group"><label>Kategorie</label><select id="annCat"><option value="general">Allgemein</option><option value="important">Wichtig</option><option value="update">Update</option></select></div><button type="submit" class="btn btn-primary" style="width:100%">' + ICONS.check + ' Veröffentlichen</button></form>'
    );
    document.getElementById('newAnnForm').addEventListener('submit', function(e) {
        e.preventDefault();
        api('announcements', 'POST', { title: document.getElementById('annTitle').value, content: document.getElementById('annContent').value, category: document.getElementById('annCat').value }).then(function() { closeModal(); loadAnnouncements(); });
    });
}

function deleteAnnouncement(id) {
    if (!confirm('Löschen?')) return;
    api('announcements/' + id, 'DELETE').then(function() { loadAnnouncements(); });
}

function loadBuilder() {
    Promise.all([api('announcements', 'GET'), api('projects', 'GET')]).then(function(res) {
        var anns = res[0], projs = res[1];
        document.getElementById('contentArea').innerHTML =
            '<div style="margin-bottom:24px;display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-primary" onclick="showNewProject()">' + ICONS.plus + ' Neues Bauprojekt</button><button class="btn btn-primary" onclick="showNewBuildAnnouncement()">' + ICONS.plus + ' Neue Bauleitung Ankündigung</button></div>' +
            '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Bauleitung - Ankündigungen</h3></div><div class="content-card-body">' +
            (anns.length === 0 ? '<div class="empty-state"><h3>Keine Ankündigungen</h3></div>' :
            anns.map(function(a) {
                var canDel = currentUser.role === 'owner' || currentUser.role === 'admin' || a.author_id == currentUser.id;
                return '<div class="announcement-item"><div class="announcement-header"><div style="display:flex;align-items:center;gap:12px"><img class="mc-head-small" src="' + mcHead(a.mcname) + '" alt="" onerror="this.style.display=\'none\'"><span class="announcement-title">' + esc(a.title) + '</span></div><div style="display:flex;gap:8px;align-items:center"><span class="announcement-category ' + a.category + '">' + a.category + '</span>' + (canDel ? '<button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(' + a.id + ')">' + ICONS.trash + '</button>' : '') + '</div></div><div class="announcement-content">' + esc(a.content) + '</div><div class="announcement-meta"><span>' + ICONS.clock + ' ' + fmtDate(a.created_at) + '</span><span>von ' + esc(a.mcname) + '</span></div></div>';
            }).join('')) +
            '</div></div>' +
            '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Bauprojekte (' + projs.length + ')</h3></div><div class="content-card-body">' +
            (projs.length === 0 ? '<div class="empty-state"><h3>Keine Bauprojekte</h3></div>' :
            projs.map(function(p) {
                var sl = p.status === 'in_progress' ? 'In Arbeit' : p.status === 'completed' ? 'Fertig' : 'Geplant';
                return '<div class="project-item"><div class="project-header"><span class="project-name">' + esc(p.name) + '</span><span class="project-status ' + p.status + '">' + sl + '</span></div>' + (p.description ? '<div class="project-description">' + esc(p.description) + '</div>' : '') + '<div class="project-meta"><span>' + ICONS.clock + ' ' + fmtDate(p.created_at) + '</span><span>von ' + esc(p.mcname) + '</span></div></div>';
            }).join('')) +
            '</div></div>';
    });
}

function showNewProject() {
    openModal('Neues Bauprojekt',
        '<form id="newProjectForm"><div class="form-group"><label>Projektname</label><input type="text" id="projName" required></div><div class="form-group"><label>Beschreibung</label><textarea id="projDesc"></textarea></div><button type="submit" class="btn btn-primary" style="width:100%">' + ICONS.check + ' Erstellen</button></form>'
    );
    document.getElementById('newProjectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        api('projects', 'POST', { name: document.getElementById('projName').value, description: document.getElementById('projDesc').value }).then(function() { closeModal(); loadBuilder(); });
    });
}

function showNewBuildAnnouncement() {
    openModal('Neue Bauleitung Ankündigung',
        '<form id="newBuildAnnForm"><div class="form-group"><label>Titel</label><input type="text" id="buildAnnTitle" required></div><div class="form-group"><label>Inhalt</label><textarea id="buildAnnContent" required></textarea></div><button type="submit" class="btn btn-primary" style="width:100%">' + ICONS.check + ' Veröffentlichen</button></form>'
    );
    document.getElementById('newBuildAnnForm').addEventListener('submit', function(e) {
        e.preventDefault();
        api('announcements', 'POST', { title: document.getElementById('buildAnnTitle').value, content: document.getElementById('buildAnnContent').value, category: 'update' }).then(function() { closeModal(); loadBuilder(); });
    });
}

function loadChat() {
    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
        document.getElementById('contentArea').innerHTML = '<div class="empty-state"><h3>Keine Berechtigung</h3></div>';
        return;
    }
    api('chat', 'GET').then(function(msgs) {
        document.getElementById('contentArea').innerHTML =
            '<div class="content-card" style="display:flex;flex-direction:column;height:calc(100vh - 180px)">' +
            '<div class="content-card-header"><h3 class="content-card-title">Leitungs-Chat</h3><span style="color:var(--t3);font-size:12px">' + msgs.length + ' Nachrichten</span></div>' +
            '<div class="chat-messages" id="chatMessages">' +
            (msgs.length === 0 ? '<div class="empty-state"><h3>Keine Nachrichten</h3></div>' :
            msgs.map(function(m) {
                var isMe = m.user_id == currentUser.id;
                var canDel = currentUser.role === 'owner' || currentUser.role === 'admin' || isMe;
                return '<div class="chat-msg' + (isMe ? ' chat-msg-me' : '') + '">' +
                    '<img class="chat-avatar" src="' + mcHead(m.mcname) + '" alt="" onerror="this.style.display=\'none\'">' +
                    '<div class="chat-bubble" style="border-left:3px solid ' + m.color + '">' +
                        '<div class="chat-name" style="color:' + m.color + '">' + esc(m.mcname) + '</div>' +
                        '<div class="chat-text">' + esc(m.message) + '</div>' +
                        '<div class="chat-time">' + fmtDate(m.created_at) + (canDel ? ' <span class="chat-delete" onclick="deleteChatMsg(' + m.id + ')">&#10005;</span>' : '') + '</div>' +
                    '</div></div>';
            }).join('')) +
            '</div>' +
            '<div class="chat-input-area"><form id="chatForm" class="chat-form"><input type="text" id="chatInput" placeholder="Nachricht schreiben..." autocomplete="off"><button type="submit" class="btn btn-primary">' + ICONS.send + '</button></form></div>' +
            '</div>';
        var ch = document.getElementById('chatMessages');
        ch.scrollTop = ch.scrollHeight;
        document.getElementById('chatForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var msg = document.getElementById('chatInput').value.trim();
            if (!msg) return;
            api('chat', 'POST', { message: msg }).then(function() { loadChat(); });
        });
    });
}

function deleteChatMsg(id) {
    if (!confirm('Nachricht löschen?')) return;
    api('chat/' + id, 'DELETE').then(function() { loadChat(); });
}

function loadTB() {
    api('tb', 'GET').then(function(entries) {
        var own = entries.filter(function(e) { return e.user_id == currentUser.id; });
        document.getElementById('contentArea').innerHTML =
            '<div style="margin-bottom:24px"><button class="btn btn-primary" onclick="showNewTB()">' + ICONS.plus + ' TB abmelden</button></div>' +
            '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Meine Abmeldungen (' + own.length + ')</h3></div><div class="content-card-body">' +
            (own.length === 0 ? '<div class="empty-state"><h3>Keine Abmeldungen</h3></div>' :
            own.map(function(e) {
                return '<div class="tb-item"><div class="tb-header"><div style="display:flex;align-items:center;gap:12px"><img class="mc-head-small" src="' + mcHead(e.mcname) + '" alt="" onerror="this.style.display=\'none\'"><span class="tb-date">' + e.date + '</span></div><button class="btn btn-danger btn-sm" onclick="deleteTB(' + e.id + ')">' + ICONS.trash + '</button></div><div class="tb-reason"><strong>Grund:</strong> ' + esc(e.reason) + '</div>' + (e.detail ? '<div class="tb-detail">' + esc(e.detail) + '</div>' : '') + '</div>';
            }).join('')) +
            '</div></div>' +
            '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">Alle Abmeldungen (' + entries.length + ')</h3></div><div class="content-card-body">' +
            (entries.length === 0 ? '<div class="empty-state"><h3>Keine Abmeldungen</h3></div>' :
            entries.map(function(e) {
                var canDel = currentUser.role === 'owner' || currentUser.role === 'admin' || e.user_id == currentUser.id;
                return '<div class="tb-item"><div class="tb-header"><div style="display:flex;align-items:center;gap:12px"><img class="mc-head-small" src="' + mcHead(e.mcname) + '" alt="" onerror="this.style.display=\'none\'"><span class="tb-name" style="color:' + e.color + '">' + esc(e.mcname) + '</span><span class="tb-date">' + e.date + '</span></div>' + (canDel ? '<button class="btn btn-danger btn-sm" onclick="deleteTB(' + e.id + ')">' + ICONS.trash + '</button>' : '') + '</div><div class="tb-reason"><strong>Grund:</strong> ' + esc(e.reason) + '</div>' + (e.detail ? '<div class="tb-detail">' + esc(e.detail) + '</div>' : '') + '</div>';
            }).join('')) +
            '</div></div>';
    });
}

function showNewTB() {
    openModal('TB abmelden',
        '<form id="newTBForm"><div class="form-group"><label>Datum</label><input type="date" id="tbDate" required></div><div class="form-group"><label>Grund</label><select id="tbReason" required><option value="">Wählen...</option><option value="Krank">Krank</option><option value="Urlaub">Urlaub</option><option value="Arbeit/Schule">Arbeit / Schule</option><option value="Termin">Termin</option><option value="Sonstiges">Sonstiges</option></select></div><div class="form-group"><label>Details (optional)</label><textarea id="tbDetail"></textarea></div><button type="submit" class="btn btn-primary" style="width:100%">' + ICONS.check + ' Absenden</button></form>'
    );
    document.getElementById('tbDate').valueAsDate = new Date();
    document.getElementById('newTBForm').addEventListener('submit', function(e) {
        e.preventDefault();
        api('tb', 'POST', { date: document.getElementById('tbDate').value, reason: document.getElementById('tbReason').value, detail: document.getElementById('tbDetail').value }).then(function() { closeModal(); loadTB(); });
    });
}

function deleteTB(id) {
    if (!confirm('Löschen?')) return;
    api('tb/' + id, 'DELETE').then(function() { loadTB(); });
}

function loadManage() {
    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
        document.getElementById('contentArea').innerHTML = '<div class="empty-state"><h3>Keine Berechtigung</h3></div>';
        return;
    }
    var isOwner = currentUser.role === 'owner';
    document.getElementById('contentArea').innerHTML =
        '<div style="margin-bottom:24px"><button class="btn btn-primary" onclick="showAddUser()">' + ICONS.userPlus + ' User hinzufügen</button></div>' +
        '<div class="content-card"><div class="content-card-header"><h3 class="content-card-title">User verwalten (' + allUsers.length + ')</h3></div><div class="content-card-body">' +
        allUsers.map(function(u) {
            return '<div class="user-item">' +
                '<div style="width:44px;height:44px;border-radius:10px;overflow:hidden;flex-shrink:0"><img src="' + mcHead(u.mcname) + '" style="width:100%;height:100%;object-fit:cover;image-rendering:pixelated" onerror="this.style.display=\'none\'"></div>' +
                '<div class="user-item-info"><div class="user-item-name">' + esc(u.mcname) + '</div><div class="user-item-email">' + esc(u.email) + '</div></div>' +
                '<span class="user-item-role ' + u.role + '">' + (ROLE_LABELS[u.role] || u.role) + '</span>' +
                (isOwner && u.id != currentUser.id ? '<button class="btn btn-danger btn-sm" onclick="deleteUser(' + u.id + ')">' + ICONS.trash + '</button>' : '') +
                '</div>';
        }).join('') +
        '</div></div>';
}

function showAddUser() {
    openModal('User hinzufügen',
        '<form id="addUserForm"><div class="form-group"><label>Username</label><input type="text" id="newUsername" required></div><div class="form-group"><label>E-Mail</label><input type="email" id="newEmail" required></div><div class="form-group"><label>Passwort</label><input type="password" id="newPassword" required></div><div class="form-group"><label>Minecraft Name</label><input type="text" id="newMcname" required></div><div class="form-group"><label>Rolle</label><select id="newRole"><option value="builder">Builder</option><option value="admin">StvOwner</option><option value="owner">Owner</option></select></div><div class="form-group"><label>Farbe</label><input type="color" id="newColor" value="#2ecc71"></div><button type="submit" class="btn btn-primary" style="width:100%">' + ICONS.check + ' Erstellen</button></form>'
    );
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        api('users', 'POST', {
            username: document.getElementById('newUsername').value,
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            mcname: document.getElementById('newMcname').value,
            role: document.getElementById('newRole').value,
            color: document.getElementById('newColor').value
        }).then(function(res) {
            if (res.success) { closeModal(); loadUsers().then(function() { loadManage(); }); }
            else { alert(res.error || 'Fehler'); }
        });
    });
}

function deleteUser(id) {
    if (!confirm('User wirklich löschen?')) return;
    api('users/' + id, 'DELETE').then(function() { loadUsers().then(function() { loadManage(); }); });
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
    return new Date(s).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

document.addEventListener('DOMContentLoaded', checkAuth);
