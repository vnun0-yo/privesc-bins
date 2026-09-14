/* ============================================================
   YenPrivEscBins - Main Script
   13 Themes · Favorites · Command Palette · Particles
   ============================================================ */

'use strict';

// ============================================================
// STATE
// ============================================================
const STATE = {
    binaries: [],
    filtered: [],
    searchQuery: '',
    functionFilter: 'all',
    contextFilter: 'all',
    sortBy: 'alpha-asc',
    theme: 'dark',
    groupSize: 20,
    favorites: [],
    showFavoritesOnly: false,
    animationFrame: null
};

// ============================================================
// DOM CACHE
// ============================================================
let DOM = {};

function cacheDOM() {
    DOM = {
        loadingSkeleton: document.getElementById('loadingSkeleton'),
        mainContent: document.getElementById('mainContent'),
        searchInput: document.getElementById('searchInput'),
        searchClear: document.getElementById('searchClear'),
        searchHints: document.getElementById('searchHints'),
        functionFilters: document.getElementById('functionFilters'),
        contextFilters: document.getElementById('contextFilters'),
        favoritesFilter: document.getElementById('favoritesFilter'),
        clearFavoritesBtn: document.getElementById('clearFavoritesBtn'),
        favoritesStat: document.getElementById('favoritesStat'),
        statTotal: document.getElementById('statTotal'),
        statResults: document.getElementById('statResults'),
        statFavorites: document.getElementById('statFavorites'),
        favCount: document.getElementById('favCount'),
        activeFilters: document.getElementById('activeFilters'),
        binariesList: document.getElementById('binariesList'),
        noResults: document.getElementById('noResults'),
        resetAllBtn: document.getElementById('resetAllBtn'),
        modalOverlay: document.getElementById('modalOverlay'),
        modalTitle: document.getElementById('modalTitle'),
        modalMeta: document.getElementById('modalMeta'),
        modalBody: document.getElementById('modalBody'),
        modalClose: document.getElementById('modalClose'),
        favBtn: document.getElementById('favBtn'),
        shareBtn: document.getElementById('shareBtn'),
        themeBtn: document.getElementById('themeBtn'),
        themeIcon: document.getElementById('themeIcon'),
        randomBtn: document.getElementById('randomBtn'),
        backToTop: document.getElementById('backToTop'),
        toastContainer: document.getElementById('toastContainer'),
        commandPalette: document.getElementById('commandPalette'),
        paletteOverlay: document.getElementById('paletteOverlay'),
        paletteInput: document.getElementById('paletteInput'),
        paletteResults: document.getElementById('paletteResults'),
        particlesCanvas: document.getElementById('particles-canvas')
    };
}

// ============================================================
// UTILITIES
// ============================================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function kebabToTitle(str) {
    if (!str) return '';
    return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

function getFunctionIcon(func) {
    const icons = {
        'shell': '$',
        'command': '>',
        'reverse-shell': '<',
        'bind-shell': '=',
        'file-read': 'R',
        'file-write': 'W',
        'file-upload': 'U',
        'file-download': 'D',
        'library-load': 'L'
    };
    return icons[func] || '*';
}

function getContextColor(context) {
    const colors = {
        'unprivileged': 'var(--color-unprivileged)',
        'sudo': 'var(--color-sudo)',
        'suid': 'var(--color-suid)',
        'limited-suid': 'var(--color-limited-suid)',
        'capabilities': 'var(--color-capabilities)'
    };
    return colors[context] || 'var(--accent-primary)';
}

// ============================================================
// FAVORITES
// ============================================================
function loadFavorites() {
    try {
        const saved = localStorage.getItem('yenprivescbins_favorites');
        STATE.favorites = saved ? JSON.parse(saved) : [];
    } catch (e) {
        STATE.favorites = [];
    }
}

function saveFavorites() {
    try {
        localStorage.setItem('yenprivescbins_favorites', JSON.stringify(STATE.favorites));
    } catch (e) {}
}

function isFavorite(name) {
    return STATE.favorites.includes(name);
}

function toggleFavorite(binaryName) {
    const index = STATE.favorites.indexOf(binaryName);
    let added = false;

    if (index > -1) {
        STATE.favorites.splice(index, 1);
    } else {
        STATE.favorites.push(binaryName);
        added = true;
    }

    saveFavorites();
    updateFavoritesCount();

    const card = document.querySelector(`[data-binary-name="${binaryName}"]`);
    if (card) {
        card.classList.toggle('favorite', added);
    }

    if (DOM.favBtn) {
        DOM.favBtn.classList.toggle('active', added);
        DOM.favBtn.textContent = added ? 'Favorited' : 'Favorite';
    }

    showToast(
        added ? `Added ${binaryName} to favorites` : `Removed ${binaryName} from favorites`,
        added ? 'success' : 'info'
    );

    if (STATE.showFavoritesOnly && !added) {
        refresh();
    }
}

function removeFavoriteFromList(binaryName) {
    const index = STATE.favorites.indexOf(binaryName);
    if (index === -1) return;

    STATE.favorites.splice(index, 1);
    saveFavorites();
    updateFavoritesCount();

    const card = document.querySelector(`[data-binary-name="${binaryName}"]`);
    if (card) {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => refresh(), 250);
    } else {
        refresh();
    }

    showToast(`Removed ${binaryName} from favorites`, 'info');
}

function clearAllFavorites() {
    const count = STATE.favorites.length;
    STATE.favorites = [];
    saveFavorites();
    updateFavoritesCount();

    document.querySelectorAll('.binary-card.favorite').forEach(card => {
        card.classList.remove('favorite');
    });

    if (DOM.favBtn) {
        DOM.favBtn.classList.remove('active');
        DOM.favBtn.textContent = 'Favorite';
    }

    if (STATE.showFavoritesOnly) {
        STATE.showFavoritesOnly = false;
        if (DOM.favoritesFilter) DOM.favoritesFilter.classList.remove('active');
    }

    refresh();
    showToast(`Cleared ${count} favorites`, 'success');
}

function updateFavoritesCount() {
    if (DOM.favCount) DOM.favCount.textContent = STATE.favorites.length;
    if (DOM.statFavorites) DOM.statFavorites.textContent = formatNumber(STATE.favorites.length);
}

// ============================================================
// THEME - 13 THEMES
// ============================================================
const THEMES = [
    'dark', 'light', 'cyberpunk', 'nord', 'sunset',
    'matrix', 'ocean', 'royal', 'dracula', 'monokai',
    'gruvbox', 'tokyo', 'sakura'
];

const THEME_LABELS = {
    dark: 'Dark',
    light: 'Light',
    cyberpunk: 'Cyber',
    nord: 'Nord',
    sunset: 'Sunset',
    matrix: 'Matrix',
    ocean: 'Ocean',
    royal: 'Royal',
    dracula: 'Dracula',
    monokai: 'Monokai',
    gruvbox: 'Gruvbox',
    tokyo: 'Tokyo',
    sakura: 'Sakura'
};

function initTheme() {
    const savedTheme = localStorage.getItem('yenprivescbins_theme');

    if (savedTheme && THEMES.includes(savedTheme)) {
        STATE.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        STATE.theme = 'light';
    }

    applyTheme(STATE.theme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    STATE.theme = theme;

    if (DOM.themeIcon) {
        DOM.themeIcon.textContent = THEME_LABELS[theme] || 'Dark';
    }

    localStorage.setItem('yenprivescbins_theme', theme);
}

function toggleTheme() {
    const currentIndex = THEMES.indexOf(STATE.theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const newTheme = THEMES[nextIndex];

    applyTheme(newTheme);
    showToast(`Theme: ${THEME_LABELS[newTheme]} (${nextIndex + 1}/${THEMES.length})`, 'info');
}

// ============================================================
// DATA PROCESSING
// ============================================================
function processData() {
    STATE.binaries = (window.BINARIES_DATA || []).map(binary => {
        const b = { ...binary };
        if (!b.functions) b.functions = {};
        if (!b.contexts) b.contexts = [];

        b.functionCount = Object.keys(b.functions).length;
        b.contextCount = b.contexts.length;

        let cmdCount = 0;
        Object.values(b.functions).forEach(func => {
            if (Array.isArray(func)) cmdCount += func.length;
            else if (func) cmdCount += 1;
        });
        b.commandCount = cmdCount;

        return b;
    });

    STATE.binaries.sort((a, b) => a.name.localeCompare(b.name));
    STATE.filtered = [...STATE.binaries];
}

// ============================================================
// FILTERING
// ============================================================
function applyFilters() {
    let filtered = [...STATE.binaries];

    if (STATE.showFavoritesOnly) {
        filtered = filtered.filter(b => STATE.favorites.includes(b.name));
    }

    if (STATE.searchQuery.trim()) {
        const q = STATE.searchQuery.toLowerCase();
        filtered = filtered.filter(b => {
            if (b.name.toLowerCase().includes(q)) return true;
            if (b.description && b.description.toLowerCase().includes(q)) return true;
            for (const f of Object.keys(b.functions)) {
                if (f.toLowerCase().includes(q)) return true;
            }
            for (const c of b.contexts) {
                if (c.toLowerCase().includes(q)) return true;
            }
            return false;
        });
    }

    if (STATE.functionFilter !== 'all') {
        filtered = filtered.filter(b => b.functions.hasOwnProperty(STATE.functionFilter));
    }

    if (STATE.contextFilter !== 'all') {
        filtered = filtered.filter(b => b.contexts.includes(STATE.contextFilter));
    }

    filtered = sortBinaries(filtered, STATE.sortBy);

    STATE.filtered = filtered;
}

function sortBinaries(binaries, sortBy) {
    const sorted = [...binaries];

    switch (sortBy) {
        case 'alpha-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'alpha-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'functions-desc':
            sorted.sort((a, b) => b.functionCount - a.functionCount || a.name.localeCompare(b.name));
            break;
        case 'functions-asc':
            sorted.sort((a, b) => a.functionCount - b.functionCount || a.name.localeCompare(b.name));
            break;
        case 'commands-desc':
            sorted.sort((a, b) => b.commandCount - a.commandCount || a.name.localeCompare(b.name));
            break;
        case 'commands-asc':
            sorted.sort((a, b) => a.commandCount - b.commandCount || a.name.localeCompare(b.name));
            break;
        default:
            sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
}

// ============================================================
// GROUPING - 20 BINARIES PER GROUP, DIFFERENT COLOR EACH
// ============================================================
const GROUP_COLORS = [
    '#2563eb', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981',
    '#f59e0b', '#ef4444', '#6366f1', '#14b8a6', '#a855f7',
    '#0ea5e9', '#d946ef', '#22c55e', '#f97316', '#e11d48',
    '#0891b2', '#7c3aed', '#db2777', '#059669', '#ca8a04'
];

function groupBinaries(binaries) {
    const groups = [];
    const size = STATE.groupSize;

    for (let i = 0; i < binaries.length; i += size) {
        const chunk = binaries.slice(i, i + size);
        const first = chunk[0].name.charAt(0).toUpperCase();
        const last = chunk[chunk.length - 1].name.charAt(0).toUpperCase();

        let title = (first === last)
            ? `Binaries - ${first}`
            : `Binaries - ${first} to ${last}`;

        const groupIndex = Math.floor(i / size);
        const color = GROUP_COLORS[groupIndex % GROUP_COLORS.length];

        groups.push({
            title: title,
            items: chunk,
            color: color,
            index: groupIndex
        });
    }

    return groups;
}

// ============================================================
// HIGHLIGHT
// ============================================================
function highlightText(text, query) {
    if (!query || !text) return escapeHtml(text);

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const escapedText = escapeHtml(text);

    return escapedText.replace(regex, '<span class="highlight">$1</span>');
}

// ============================================================
// RENDERING
// ============================================================
function renderBinaries() {
    const list = DOM.binariesList;
    if (!list) return;

    list.innerHTML = '';

    if (STATE.filtered.length === 0) {
        if (DOM.noResults) DOM.noResults.classList.remove('hidden');
        return;
    }

    if (DOM.noResults) DOM.noResults.classList.add('hidden');

    const groups = groupBinaries(STATE.filtered);

    groups.forEach((group) => {
        const groupEl = document.createElement('div');
        groupEl.className = 'binary-group';
        // Animation delay staggered per group - 20 groups with color rotation
        groupEl.style.animationDelay = (group.index * 60) + 'ms';
        groupEl.style.setProperty('--group-color', group.color);

        const header = document.createElement('div');
        header.className = 'binary-group-header';
        header.innerHTML = `
            <span class="binary-group-title" style="color: ${group.color};">${escapeHtml(group.title)}</span>
            <span class="binary-group-count">${group.items.length} binaries</span>
        `;

        const content = document.createElement('div');
        content.className = 'binary-group-content';

        group.items.forEach((binary, cardIndex) => {
            const card = document.createElement('div');
            card.className = 'binary-card';
            card.dataset.binaryName = binary.name;
            card.style.animationDelay = (cardIndex * 25) + 'ms';
            card.style.setProperty('--group-color', group.color);

            const fav = isFavorite(binary.name);
            if (fav) card.classList.add('favorite');

            const funcs = Object.keys(binary.functions).slice(0, 3);
            const remaining = Object.keys(binary.functions).length - 3;

            const funcTagsHtml = funcs.map(f =>
                `<span class="function-tag">${escapeHtml(kebabToTitle(f))}</span>`
            ).join('');

            const moreHtml = remaining > 0
                ? `<span class="function-tag">+${remaining}</span>`
                : '';

            const removeFavBtn = `<button class="remove-fav-btn" title="Remove from favorites" data-remove-fav="${escapeHtml(binary.name)}">X</button>`;

            card.innerHTML = `
                ${removeFavBtn}
                <h3>${highlightText(binary.name, STATE.searchQuery)}</h3>
                <div class="functions">${funcTagsHtml}${moreHtml}</div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-fav-btn')) return;
                openModal(binary.name);
            });

            const rmBtn = card.querySelector('.remove-fav-btn');
            if (rmBtn) {
                rmBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFavoriteFromList(binary.name);
                });
            }

            content.appendChild(card);
        });

        groupEl.appendChild(header);
        groupEl.appendChild(content);
        list.appendChild(groupEl);
    });
}

// ============================================================
// STATS
// ============================================================
function updateStats() {
    if (DOM.statTotal) DOM.statTotal.textContent = formatNumber(STATE.binaries.length);
    if (DOM.statResults) DOM.statResults.textContent = formatNumber(STATE.filtered.length);
    updateFavoritesCount();
}

// ============================================================
// ACTIVE FILTERS
// ============================================================
function updateActiveFilters() {
    if (!DOM.activeFilters) return;

    DOM.activeFilters.innerHTML = '';

    const filters = [];

    if (STATE.showFavoritesOnly) {
        filters.push({ type: 'favorites', label: 'Favorites Only' });
    }
    if (STATE.searchQuery.trim()) {
        filters.push({ type: 'search', label: `Search: "${STATE.searchQuery}"` });
    }
    if (STATE.functionFilter !== 'all') {
        filters.push({ type: 'function', label: `Function: ${kebabToTitle(STATE.functionFilter)}` });
    }
    if (STATE.contextFilter !== 'all') {
        filters.push({ type: 'context', label: `Context: ${kebabToTitle(STATE.contextFilter)}` });
    }

    filters.forEach(filter => {
        const el = document.createElement('div');
        el.className = 'active-filter';
        el.innerHTML = `
            <span>${escapeHtml(filter.label)}</span>
            <button class="active-filter-remove">X</button>
        `;
        el.querySelector('.active-filter-remove').addEventListener('click', () => {
            removeFilter(filter.type);
        });
        DOM.activeFilters.appendChild(el);
    });
}

function removeFilter(type) {
    if (type === 'search') {
        STATE.searchQuery = '';
        if (DOM.searchInput) DOM.searchInput.value = '';
        if (DOM.searchClear) DOM.searchClear.classList.remove('visible');
    }
    if (type === 'function') STATE.functionFilter = 'all';
    if (type === 'context') STATE.contextFilter = 'all';
    if (type === 'favorites') {
        STATE.showFavoritesOnly = false;
        if (DOM.favoritesFilter) DOM.favoritesFilter.classList.remove('active');
    }

    syncFilterUI();
    refresh();
}

function resetAllFilters() {
    STATE.searchQuery = '';
    STATE.functionFilter = 'all';
    STATE.contextFilter = 'all';
    STATE.sortBy = 'alpha-asc';
    STATE.showFavoritesOnly = false;

    if (DOM.searchInput) DOM.searchInput.value = '';
    if (DOM.searchClear) DOM.searchClear.classList.remove('visible');
    if (DOM.favoritesFilter) DOM.favoritesFilter.classList.remove('active');

    syncFilterUI();
    refresh();
    showToast('Filters reset', 'info');
}

function syncFilterUI() {
    if (DOM.functionFilters) {
        DOM.functionFilters.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === STATE.functionFilter);
        });
    }

    if (DOM.contextFilters) {
        DOM.contextFilters.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === STATE.contextFilter);
        });
    }

    document.querySelectorAll('.filter-btn[data-sort]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === STATE.sortBy);
    });

    if (DOM.favoritesFilter) {
        DOM.favoritesFilter.classList.toggle('active', STATE.showFavoritesOnly);
    }
}

function refresh() {
    applyFilters();
    renderBinaries();
    updateStats();
    updateActiveFilters();
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, type = 'info') {
    if (!DOM.toastContainer) return;

    const icons = { success: 'OK', error: 'X', warning: '!', info: 'i' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================
// COPY
// ============================================================
function copyToClipboard(text, buttonEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopiedFeedback(buttonEl);
        }).catch(() => fallbackCopy(text, buttonEl));
    } else {
        fallbackCopy(text, buttonEl);
    }
}

function fallbackCopy(text, buttonEl) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showCopiedFeedback(buttonEl);
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
    document.body.removeChild(textarea);
}

function showCopiedFeedback(buttonEl) {
    if (!buttonEl) return;
    buttonEl.classList.add('copied');
    showToast('Copied to clipboard', 'success');
    setTimeout(() => buttonEl.classList.remove('copied'), 1500);
}

// ============================================================
// MODAL
// ============================================================
function openModal(name) {
    const binary = STATE.binaries.find(b => b.name === name);
    if (!binary) return;

    if (DOM.modalTitle) DOM.modalTitle.textContent = binary.name;

    if (DOM.modalMeta) {
        DOM.modalMeta.innerHTML = `
            <div class="modal-meta-item">
                <span class="label">Functions:</span>
                <span class="value">${binary.functionCount}</span>
            </div>
            <div class="modal-meta-item">
                <span class="label">Contexts:</span>
                <span class="value">${binary.contextCount}</span>
            </div>
            <div class="modal-meta-item">
                <span class="label">Commands:</span>
                <span class="value">${binary.commandCount}</span>
            </div>
        `;
    }

    let html = '';

    for (const [funcName, commands] of Object.entries(binary.functions)) {
        html += `<div class="function-group">`;
        html += `<h3>[${getFunctionIcon(funcName)}] ${escapeHtml(kebabToTitle(funcName))}</h3>`;

        const cmdArray = Array.isArray(commands) ? commands : [commands];

        cmdArray.forEach((cmd, index) => {
            const code = typeof cmd === 'string' ? cmd : cmd.code;
            const ctx = typeof cmd === 'object' ? cmd.context : null;
            const codeId = `code-${funcName}-${index}`;

            html += `<div class="command-block">`;
            if (ctx) {
                const ctxColor = getContextColor(ctx);
                html += `<div class="command-context" style="--context-color: ${ctxColor};">${escapeHtml(kebabToTitle(ctx))}</div>`;
            }
            html += `<div class="command-code" id="${codeId}">${escapeHtml(code)}</div>`;
            html += `<button class="copy-btn" data-code-id="${codeId}"></button>`;
            html += `</div>`;
        });

        html += `</div>`;
    }

    if (DOM.modalBody) {
        DOM.modalBody.innerHTML = html;

        DOM.modalBody.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const codeId = btn.dataset.codeId;
                const codeEl = document.getElementById(codeId);
                if (codeEl) copyToClipboard(codeEl.textContent, btn);
            });
        });
    }

    if (DOM.favBtn) {
        const isFav = isFavorite(binary.name);
        DOM.favBtn.classList.toggle('active', isFav);
        DOM.favBtn.textContent = isFav ? 'Favorited' : 'Favorite';

        const newFav = DOM.favBtn.cloneNode(true);
        DOM.favBtn.parentNode.replaceChild(newFav, DOM.favBtn);
        DOM.favBtn = newFav;

        DOM.favBtn.addEventListener('click', () => {
            toggleFavorite(binary.name);
        });
    }

    DOM.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (DOM.modalOverlay) DOM.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// EVENTS - SEARCH
// ============================================================
function initSearch() {
    if (!DOM.searchInput) return;

    const handleSearch = debounce((e) => {
        STATE.searchQuery = e.target.value;

        if (DOM.searchClear) {
            DOM.searchClear.classList.toggle('visible', e.target.value.length > 0);
        }

        refresh();
    }, 200);

    DOM.searchInput.addEventListener('input', handleSearch);

    if (DOM.searchClear) {
        DOM.searchClear.addEventListener('click', () => {
            DOM.searchInput.value = '';
            STATE.searchQuery = '';
            DOM.searchClear.classList.remove('visible');
            refresh();
            DOM.searchInput.focus();
        });
    }

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            DOM.searchInput.focus();
            DOM.searchInput.select();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== DOM.searchInput &&
            document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            DOM.searchInput.focus();
        }
    });

    DOM.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') DOM.searchInput.blur();
    });
}

// ============================================================
// EVENTS - FILTERS
// ============================================================
function initFilters() {
    if (DOM.functionFilters) {
        DOM.functionFilters.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                DOM.functionFilters.querySelectorAll('.filter-btn').forEach(b =>
                    b.classList.remove('active')
                );
                btn.classList.add('active');
                STATE.functionFilter = btn.dataset.filter;
                refresh();
            });
        });
    }

    if (DOM.contextFilters) {
        DOM.contextFilters.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                DOM.contextFilters.querySelectorAll('.filter-btn').forEach(b =>
                    b.classList.remove('active')
                );
                btn.classList.add('active');
                STATE.contextFilter = btn.dataset.filter;
                refresh();
            });
        });
    }

    document.querySelectorAll('.filter-btn[data-sort]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn[data-sort]').forEach(b =>
                b.classList.remove('active')
            );
            btn.classList.add('active');
            STATE.sortBy = btn.dataset.sort;
            refresh();
        });
    });

    if (DOM.favoritesFilter) {
        DOM.favoritesFilter.addEventListener('click', () => {
            STATE.showFavoritesOnly = !STATE.showFavoritesOnly;
            DOM.favoritesFilter.classList.toggle('active', STATE.showFavoritesOnly);
            refresh();
        });
    }

    if (DOM.clearFavoritesBtn) {
        DOM.clearFavoritesBtn.addEventListener('click', () => {
            if (STATE.favorites.length === 0) {
                showToast('No favorites to clear', 'info');
                return;
            }

            if (confirm(`Remove all ${STATE.favorites.length} favorites?`)) {
                clearAllFavorites();
            }
        });
    }

    if (DOM.favoritesStat) {
        DOM.favoritesStat.addEventListener('click', () => {
            if (DOM.favoritesFilter) DOM.favoritesFilter.click();
        });
    }

    if (DOM.resetAllBtn) {
        DOM.resetAllBtn.addEventListener('click', resetAllFilters);
    }
}

// ============================================================
// EVENTS - MODAL
// ============================================================
function initModal() {
    if (DOM.modalOverlay) {
        DOM.modalOverlay.addEventListener('click', (e) => {
            if (e.target === DOM.modalOverlay) closeModal();
        });
    }

    if (DOM.modalClose) {
        DOM.modalClose.addEventListener('click', closeModal);
    }

    if (DOM.shareBtn) {
        DOM.shareBtn.addEventListener('click', () => {
            const name = DOM.modalTitle?.textContent;
            if (!name) return;

            const url = `${window.location.origin}${window.location.pathname}#${name}`;

            if (navigator.share) {
                navigator.share({
                    title: `YenPrivEscBins - ${name}`,
                    url: url
                }).catch(() => {});
            } else {
                copyToClipboard(url, DOM.shareBtn);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (DOM.modalOverlay?.classList.contains('active')) {
                closeModal();
            }
            if (DOM.commandPalette && !DOM.commandPalette.classList.contains('hidden')) {
                closeCommandPalette();
            }
        }
    });
}

// ============================================================
// EVENTS - HEADER
// ============================================================
function initHeader() {
    if (DOM.themeBtn) {
        DOM.themeBtn.addEventListener('click', toggleTheme);
    }

    if (DOM.randomBtn) {
        DOM.randomBtn.addEventListener('click', () => {
            if (STATE.binaries.length === 0) return;
            const random = STATE.binaries[Math.floor(Math.random() * STATE.binaries.length)];
            openModal(random.name);
            showToast(`Random: ${random.name}`, 'info');
        });
    }
}

// ============================================================
// EVENTS - BACK TO TOP
// ============================================================
function initBackToTop() {
    if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', () => {
        if (DOM.backToTop) {
            DOM.backToTop.classList.toggle('visible', window.pageYOffset > 400);
        }
    });
}

// ============================================================
// PARTICLES BACKGROUND
// ============================================================
function initParticles() {
    const canvas = DOM.particlesCanvas;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', debounce(resize, 200));

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 1
        });
    }

    function getColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        const colors = {
            'cyberpunk': 'rgba(255, 0, 255, 0.4)',
            'light': 'rgba(37, 99, 235, 0.4)',
            'nord': 'rgba(136, 192, 208, 0.4)',
            'sunset': 'rgba(255, 107, 53, 0.5)',
            'matrix': 'rgba(0, 255, 65, 0.5)',
            'ocean': 'rgba(0, 212, 255, 0.5)',
            'royal': 'rgba(212, 175, 55, 0.5)',
            'dracula': 'rgba(189, 147, 249, 0.5)',
            'monokai': 'rgba(249, 38, 114, 0.5)',
            'gruvbox': 'rgba(250, 189, 47, 0.5)',
            'tokyo': 'rgba(122, 162, 247, 0.5)',
            'sakura': 'rgba(255, 133, 192, 0.5)'
        };
        return colors[theme] || 'rgba(96, 165, 250, 0.4)';
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        const color = getColor();

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            particles.slice(i + 1).forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = color.replace(/[\d.]+\)$/, (0.15 * (1 - dist / 120)).toFixed(2) + ')');
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        STATE.animationFrame = requestAnimationFrame(draw);
    }

    draw();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (STATE.animationFrame) {
                cancelAnimationFrame(STATE.animationFrame);
                STATE.animationFrame = null;
            }
        } else if (!STATE.animationFrame) {
            draw();
        }
    });
}

// ============================================================
// COMMAND PALETTE
// ============================================================
function initCommandPalette() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            openCommandPalette();
        }
    });

    if (DOM.paletteOverlay) {
        DOM.paletteOverlay.addEventListener('click', closeCommandPalette);
    }

    if (DOM.paletteInput) {
        DOM.paletteInput.addEventListener('input', debounce((e) => {
            renderPaletteResults(e.target.value);
        }, 100));

        DOM.paletteInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const first = DOM.paletteResults?.querySelector('.palette-item');
                if (first) first.click();
            }
        });
    }
}

function openCommandPalette() {
    if (!DOM.commandPalette) return;
    DOM.commandPalette.classList.remove('hidden');
    if (DOM.paletteInput) {
        DOM.paletteInput.value = '';
        DOM.paletteInput.focus();
    }
    renderPaletteResults('');
}

function closeCommandPalette() {
    if (!DOM.commandPalette) return;
    DOM.commandPalette.classList.add('hidden');
}

function renderPaletteResults(query) {
    if (!DOM.paletteResults) return;

    const q = query.toLowerCase().trim();
    let results = [];

    if (!q) {
        results = STATE.binaries.slice(0, 10).map(b => ({
            type: 'binary',
            name: b.name,
            icon: '*'
        }));
    } else {
        const binaryResults = STATE.binaries
            .filter(b => b.name.toLowerCase().includes(q))
            .slice(0, 8)
            .map(b => ({ type: 'binary', name: b.name, icon: '*' }));

        const functions = new Set();
        STATE.binaries.forEach(b => {
            Object.keys(b.functions).forEach(f => {
                if (f.toLowerCase().includes(q)) functions.add(f);
            });
        });
        const functionResults = [...functions].slice(0, 4).map(f => ({
            type: 'function',
            name: kebabToTitle(f),
            value: f,
            icon: getFunctionIcon(f)
        }));

        results = [...binaryResults, ...functionResults];
    }

    if (results.length === 0) {
        DOM.paletteResults.innerHTML = '<div class="palette-empty">No results found</div>';
        return;
    }

    DOM.paletteResults.innerHTML = results.map(r => `
        <div class="palette-item" data-type="${r.type}" data-value="${escapeHtml(r.value || r.name)}">
            <span class="palette-item-icon">${r.icon}</span>
            <span class="palette-item-text">${escapeHtml(r.name)}</span>
            <span class="palette-item-type">${r.type}</span>
        </div>
    `).join('');

    DOM.paletteResults.querySelectorAll('.palette-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            const value = item.dataset.value;

            closeCommandPalette();

            if (type === 'binary') {
                openModal(value);
            } else if (type === 'function') {
                STATE.functionFilter = value;
                syncFilterUI();
                refresh();
                showToast(`Filtered: ${value}`, 'info');
            }
        });
    });
}

// ============================================================
// URL HASH
// ============================================================
function checkURLHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const binary = STATE.binaries.find(b => b.name === hash);
        if (binary) {
            setTimeout(() => openModal(hash), 300);
        }
    }

    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        if (newHash) {
            const b = STATE.binaries.find(b => b.name === newHash);
            if (b) openModal(newHash);
        }
    });
}

// ============================================================
// INITIALIZATION
// ============================================================
function init() {
    const start = performance.now();

    cacheDOM();
    initTheme();
    loadFavorites();
    processData();

    initSearch();
    initFilters();
    initModal();
    initHeader();
    initBackToTop();
    initCommandPalette();

    syncFilterUI();
    refresh();

    initParticles();
    checkURLHash();

    setTimeout(() => {
        if (DOM.loadingSkeleton) DOM.loadingSkeleton.classList.add('hidden');
        if (DOM.mainContent) DOM.mainContent.classList.remove('hidden');
    }, 300);

    const duration = Math.round(performance.now() - start);
    console.log(`YenPrivEscBins loaded: ${STATE.binaries.length} binaries in ${duration}ms`);
    console.log(`Favorites: ${STATE.favorites.length}`);
    console.log(`Themes available: ${THEMES.length}`);
    console.log(`Group size: ${STATE.groupSize} per group · Colors: ${GROUP_COLORS.length}`);
}

// ============================================================
// START
// ============================================================
document.addEventListener('DOMContentLoaded', init);

// ============================================================
// EXPOSE FOR DEBUGGING
// ============================================================
window.YenApp = {
    STATE,
    DOM,
    refresh,
    openModal,
    closeModal,
    showToast,
    toggleTheme,
    toggleFavorite,
    clearAllFavorites,
    removeFavoriteFromList,
    openCommandPalette,
    closeCommandPalette,
    THEMES,
    THEME_LABELS,
    GROUP_COLORS
};
window.closeModal = closeModal;

console.log('%cYenPrivEscBins v2.0', 'color: #60a5fa; font-size: 16px; font-weight: bold;');
console.log('%cType YenApp for debugging', 'color: #8b5cf6; font-style: italic;');