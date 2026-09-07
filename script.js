// --- THEME TOGGLE LOGIC ---
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function setTheme(isLight) {
    if (isLight) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '☾'; // Display moon icon for light mode
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '☼'; // Display sun icon for dark mode
    }
}

// Check stored theme preference on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    setTheme(true);
}

// Click listener
themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') !== 'light';
    setTheme(isLight);
});

// --- TERMINAL DATA & LOGIC ---
const initialLines = [
    { prompt: 'visitor@portfolio:~$', text: 'whoami', type: 'cmd' },
    { text: 'Jakub Hluško', type: 'name' },
    { text: 'Student developer • Python, C#, Go', type: 'text' },
    { text: 'location: Czech Republic', type: 'text' },
    { text: 'status: open to opportunities', type: 'text' }
];

const terminalContent = document.getElementById('terminal-content');
let lineIdx = 0;
let charIdx = 0;
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Create terminal HTML line
function createLine(lineInfo, textToDisplay, isActive) {
    const div = document.createElement('div');
    div.className = 'term-line';
    let html = '';
    
    if (lineInfo.prompt) html += `<span class="term-prompt">${lineInfo.prompt}</span>`;
    
    let textClass = 'term-text';
    if (lineInfo.type === 'name') textClass = 'term-name';
    if (lineInfo.type === 'cmd') textClass = 'term-cmd';
    
    html += `<span class="${textClass}">${textToDisplay}</span>`;
    if (isActive) html += `<span class="caret" aria-hidden="true"></span>`;
    
    div.innerHTML = html;
    return div;
}

// Interactive terminal input field
function appendInteractiveInput() {
    const wrapper = document.createElement('div');
    wrapper.className = 'term-line term-input-wrapper';
    wrapper.innerHTML = `
        <span class="term-prompt">visitor@portfolio:~$</span>
        <input type="text" id="term-cmd-input" class="term-cmd-input" autocomplete="off" spellcheck="false" placeholder="Type a command (e.g. 'projects', 'about', 'contact', 'help')...">
    `;
    terminalContent.appendChild(wrapper);

    const inputEl = document.getElementById('term-cmd-input');
    inputEl.focus();

    // Listen for Enter key
    inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const cmd = this.value.trim().toLowerCase();
            handleCommand(cmd, wrapper);
        }
    });
}

// Handle terminal commands and navigation
function handleCommand(cmd, oldWrapper) {
    oldWrapper.remove();
    const historyLine = createLine({ prompt: 'visitor@portfolio:~$', type: 'cmd' }, cmd, false);
    historyLine.style.marginTop = '1rem';
    terminalContent.appendChild(historyLine);

    let responseText = '';
    let targetHash = ''; 

    if (cmd === 'help') {
        responseText = 'Available commands: about, projects, contact, clear, theme, help';
    } else if (['about', 'cd about', './about', 'whoami'].includes(cmd)) {
        responseText = 'Opening ./about.md...';
        targetHash = '#about';
    } else if (['projects', 'cd projects', 'ls projects'].includes(cmd)) {
        responseText = 'Navigating to ./projects...';
        targetHash = '#projects';
    } else if (['contact', 'cd contact', 'mail'].includes(cmd)) {
        responseText = 'Opening ./contact.sh...';
        targetHash = '#contact';
    } else if (['theme', 'light', 'dark'].includes(cmd)) {
        const isLight = document.documentElement.getAttribute('data-theme') !== 'light';
        setTheme(isLight);
        responseText = 'Toggling system theme...';
    } else if (cmd === 'clear') {
        terminalContent.innerHTML = ''; 
    } else if (cmd !== '') {
        responseText = 'bash: ' + cmd + ': command not found. Type \'help\' for available commands.';
    }

    if (responseText && cmd !== 'clear') {
        const respDiv = document.createElement('div');
        respDiv.className = 'term-line term-text';
        respDiv.style.marginTop = '0.25rem';
        respDiv.textContent = responseText;
        terminalContent.appendChild(respDiv);
    }

    appendInteractiveInput();
    
    const termBody = document.querySelector('.terminal-body');
    termBody.scrollTop = termBody.scrollHeight;

    if (targetHash) {
        setTimeout(() => {
            window.location.hash = targetHash;
        }, 450);
    }
}

// Render typing animation
function renderTerminal() {
    terminalContent.innerHTML = '';
    const isDone = lineIdx >= initialLines.length;
    
    for (let i = 0; i < (isDone ? initialLines.length : lineIdx + 1); i++) {
        const isActive = (i === lineIdx && !isDone);
        const text = isActive ? initialLines[i].text.slice(0, charIdx) : initialLines[i].text;
        terminalContent.appendChild(createLine(initialLines[i], text, isActive));
    }

    if (isDone) {
        appendInteractiveInput();
    }
}

function tickTerminal() {
    if (lineIdx >= initialLines.length) return renderTerminal();

    const currentLine = initialLines[lineIdx];
    renderTerminal();

    if (charIdx >= currentLine.text.length) {
        lineIdx++;
        charIdx = 0;
        setTimeout(tickTerminal, 200); 
    } else {
        charIdx++;
        setTimeout(tickTerminal, 15); 
    }
}

// --- FULLPAGE SCROLL OBSERVER ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'hero' && !window.terminalPlayed) {
                window.terminalPlayed = true;
                if (isReducedMotion) {
                    lineIdx = initialLines.length;
                    renderTerminal();
                } else {
                    setTimeout(tickTerminal, 300);
                }
            } else if (entry.target.id === 'hero' && window.terminalPlayed) {
                const inputEl = document.getElementById('term-cmd-input');
                if(inputEl) inputEl.focus();
            }

            const reveals = entry.target.querySelectorAll('.reveal-init');
            reveals.forEach((el, index) => {
                setTimeout(() => el.classList.add('reveal-in'), index * 150);
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.snap-section').forEach(sec => observer.observe(sec));

// --- GITHUB REPOS FETCH ---
async function fetchGitHubRepos() {
    const container = document.getElementById('repos-container');
    if (!container) return;

    try {
        const response = await fetch('https://api.github.com/users/Luckeris/repos?sort=updated&per_page=6');
        if (!response.ok) throw new Error('API rate limit or network error');
        
        const repos = await response.json();
        container.innerHTML = ''; 

        repos.filter(repo => !repo.fork).slice(0, 4).forEach((repo, index) => {
            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.className = 'repo-card';
            card.style.animationDelay = `${index * 0.15}s`;

            const language = repo.language ? `<span><div class="lang-dot"></div> ${repo.language}</span>` : '';
            const stars = repo.stargazers_count > 0 ? `<span>★ ${repo.stargazers_count}</span>` : '';

            card.innerHTML = `
                <div class="repo-name">
                    <span>${repo.name}</span>
                    <span class="text-muted">↗</span>
                </div>
                <div class="repo-desc">${repo.description || 'No description provided.'}</div>
                <div class="repo-stats">${language}${stars}</div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = '<span class="text-muted">Failed to load repositories. Please check my GitHub directly.</span>';
    }
}

fetchGitHubRepos();
