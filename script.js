// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark-mode');
    themeToggle.textContent = '🌙';
  }
}
initTheme();
themeToggle.onclick = function() {
  body.classList.toggle('dark-mode');
  const dark = body.classList.contains('dark-mode');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  themeToggle.textContent = dark ? '☀️' : '🌙';
};

// Navigation logic
const sections = {
  home: document.getElementById('home-section'),
  save: document.getElementById('save-section'),
  entries: document.getElementById('entries-section')
};
function showSection(sec) {
  for(const name in sections) {
    sections[name].style.display = (name===sec) ? 'block' : 'none';
  }
}
document.getElementById('home-link').onclick = () => showSection('home');
document.getElementById('save-link').onclick = () => showSection('save');
document.getElementById('entries-link').onclick = () => { showSection('entries'); renderEntries(); };

// About/Modal logic
const modal = document.getElementById('about-modal');
document.getElementById('about-link').onclick = ()=> modal.style.display='flex';
document.getElementById('close-modal').onclick = ()=> modal.style.display='none';
modal.onclick = (e)=>{ if(e.target === modal) modal.style.display='none'; };

// Text saving with localStorage (can be replaced by API)
function saveText(obj) {
  const all = JSON.parse(localStorage.getItem('notes')||'[]');
  all.push(obj);
  localStorage.setItem('notes', JSON.stringify(all));
}
function getNotes() {
  return JSON.parse(localStorage.getItem('notes')||'[]');
}
function setNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

document.getElementById('save-btn').onclick = ()=> {
  const textArea = document.getElementById('input-text');
  let txt = textArea.value.trim();
  if(txt) {
    saveText({value:txt, time: Date.now()});
    document.getElementById('save-confirm').textContent = "Saved!";
    setTimeout(()=>document.getElementById('save-confirm').textContent="",1200);
    textArea.value = '';
  }
};
function renderEntries() {
  const ul = document.getElementById('entries-list');
  ul.innerHTML = '';
  getNotes().forEach((note, idx)=>{
    const li = document.createElement('li');
    li.innerHTML = `
        <div>
          <span>${note.value.replace(/\n/g,'<br>')}</span>
        </div>
        <div class='entry-controls'>
          <button onclick="copyText(${idx})">Copy</button>
          <button onclick="deleteEntry(${idx})">Delete</button>
        </div>
    `;
    ul.appendChild(li);
  });
}
window.copyText = function(idx){
  navigator.clipboard.writeText(getNotes()[idx].value);
}
window.deleteEntry = function(idx){
  let arr = getNotes();
  arr.splice(idx,1);
  setNotes(arr);
  renderEntries();
};

// Default to home section
showSection('home');
