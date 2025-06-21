// NewsBox: Modern News Aggregator

// Sample articles data for each category
const articles = [
  { id: 1, title: 'Champions League Final Recap', category: 'Sports', summary: 'A thrilling match between top teams...', author: 'Alex Sport', date: '2024-06-01', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: 'Olympics 2024 Preview', category: 'Sports', summary: 'Athletes to watch in the upcoming games...', author: 'Sam Athlete', date: '2024-06-02', image: 'https://images.unsplash.com/photo-1505843279827-4b2b0c44b6c5?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'Global Summit on Climate', category: 'World Wide', summary: 'Leaders gather to discuss climate action...', author: 'Jane Global', date: '2024-06-03', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: 'Elections Around the World', category: 'World Wide', summary: 'Major elections and their impact...', author: 'John News', date: '2024-06-04', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80' },
  { id: 5, title: 'Breakthrough in Cancer Research', category: 'Health', summary: 'New therapies show promise...', author: 'Dr. Health', date: '2024-06-05', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80' },
  { id: 6, title: 'Mental Health Awareness', category: 'Health', summary: 'Initiatives to support mental health...', author: 'Sara Care', date: '2024-06-06', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' },
  { id: 7, title: 'SpaceX Launches New Rocket', category: 'Science', summary: 'A new era in space exploration...', author: 'Neil Astro', date: '2024-06-07', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80' },
  { id: 8, title: 'AI in Everyday Life', category: 'Science', summary: 'How artificial intelligence is changing the world...', author: 'Ada Tech', date: '2024-06-08', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80' },
  { id: 9, title: 'Education Reform Bill Passed', category: 'Education', summary: 'Major changes coming to schools...', author: 'Prof. Learn', date: '2024-06-09', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80' },
  { id: 10, title: 'Online Learning Trends', category: 'Education', summary: 'The rise of e-learning platforms...', author: 'Ed Online', date: '2024-06-10', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80' },
  { id: 11, title: 'Top 10 Tech Trends 2024', category: 'New Trends', summary: 'What to watch in technology this year...', author: 'Trendy Tech', date: '2024-06-11', image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80' },
  { id: 12, title: 'Fashion Goes Green', category: 'New Trends', summary: 'Sustainable fashion is on the rise...', author: 'Eco Style', date: '2024-06-12', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80' }
];

const categories = ['Sports', 'World Wide', 'Health', 'Science', 'Education', 'New Trends'];
// Persistent category filter
let currentCategory = localStorage.getItem('newsboxCategory') || 'Sports';

// State
let searchQuery = '';
let bookmarks = JSON.parse(localStorage.getItem('newsboxBookmarks') || '[]');
let darkMode = localStorage.getItem('newsboxDarkMode') === '1';

function setDarkMode(on) {
  document.body.classList.toggle('dark', on);
  localStorage.setItem('newsboxDarkMode', on ? '1' : '0');
}

function toggleBookmark(id) {
  if (bookmarks.includes(id)) {
    bookmarks = bookmarks.filter(bid => bid !== id);
    showToast('Bookmark removed ❌');
  } else {
    bookmarks.unshift(id);
    showToast('Article bookmarked ✅');
  }
  localStorage.setItem('newsboxBookmarks', JSON.stringify(bookmarks));
  renderArticles();
  renderBookmarks();
  updateBookmarkCount();
}

function renderArticles() {
  const articleList = document.getElementById('articleList');
  articleList.innerHTML = '';
  let filtered = articles.filter(a =>
    a.category === currentCategory &&
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  if (filtered.length === 0) {
    articleList.innerHTML = '<p>No articles found for this category.</p>';
    return;
  }
  filtered.forEach(article => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', article.title + ' details');
    card.innerHTML = `
      <img src="${article.image}" alt="${article.title}" class="article-img" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/600x160?text=No+Image';" />
      <div class="article-title">${highlight(article.title, searchQuery)}</div>
      <div class="article-meta">${article.author} | ${article.date} | ${article.category}</div>
      <div class="article-summary">${highlight(article.summary, searchQuery)}</div>
      <button class="bookmark-btn${bookmarks.includes(article.id) ? ' active pulse' : ''}" aria-label="Bookmark">${bookmarks.includes(article.id) ? '★' : '☆'}</button>
    `;
    card.onclick = (e) => {
      if (e.target.classList.contains('bookmark-btn')) return;
      openArticleModal(article);
    };
    card.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.target.classList.contains('bookmark-btn')) openArticleModal(article);
    };
    const btn = card.querySelector('.bookmark-btn');
    btn.onclick = (e) => {
      e.stopPropagation();
      if (bookmarks.includes(article.id)) {
        toggleBookmark(article.id);
      } else {
        if (!bookmarks.includes(article.id)) {
          toggleBookmark(article.id);
          btn.classList.add('pulse');
          setTimeout(() => btn.classList.remove('pulse'), 400);
        } else {
          showToast('Already bookmarked!');
        }
      }
    };
    articleList.appendChild(card);
  });
}

function renderBookmarks() {
  const panel = document.getElementById('bookmarkPanel');
  const list = document.getElementById('bookmarkList');
  list.innerHTML = '';
  if (bookmarks.length === 0) {
    list.innerHTML = '<p>No bookmarks yet.</p>';
    return;
  }
  // Sort bookmarks by date (most recent first)
  bookmarks.forEach(id => {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <img src="${article.image}" alt="${article.title}" class="article-img" />
      <div class="article-title">${article.title}</div>
      <div class="article-meta">${article.author} | ${article.date} | ${article.category}</div>
      <div class="article-summary">${article.summary}</div>
      <button class="bookmark-btn active">★</button>
    `;
    card.querySelector('.bookmark-btn').onclick = () => toggleBookmark(article.id);
    list.appendChild(card);
  });
  updateBookmarkCount();
}

function setupBookmarkBtn() {
  const btn = document.getElementById('bookmarkBtn');
  const panel = document.getElementById('bookmarkPanel');
  const closeBtn = document.getElementById('closeBookmarkPanel');
  // Add backdrop
  let backdrop = document.getElementById('bookmarkBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'bookmarkBackdrop';
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100vw';
    backdrop.style.height = '100vh';
    backdrop.style.background = 'rgba(0,0,0,0.18)';
    backdrop.style.zIndex = '999';
    backdrop.style.display = 'none';
    document.body.appendChild(backdrop);
  }
  btn.onclick = () => {
    panel.classList.remove('hidden');
    panel.classList.add('visible');
    backdrop.style.display = 'block';
    renderBookmarks();
  };
  closeBtn.onclick = () => {
    panel.classList.add('hidden');
    panel.classList.remove('visible');
    backdrop.style.display = 'none';
  };
  backdrop.onclick = () => {
    panel.classList.add('hidden');
    panel.classList.remove('visible');
    backdrop.style.display = 'none';
  };
}

function setupDarkModeBtn() {
  const btn = document.getElementById('darkModeToggle');
  btn.onclick = () => {
    darkMode = !darkMode;
    setDarkMode(darkMode);
  };
  setDarkMode(darkMode);
}

// Loader and skeletons
function showLoader(show) {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.toggle('hidden', !show);
}
function showSkeletons() {
  const articleList = document.getElementById('articleList');
  articleList.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'article-card skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-meta"></div>
      <div class="skeleton-summary"></div>
    `;
    articleList.appendChild(skeleton);
  }
}

// Debounced search
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function(e) {
  clearTimeout(searchTimeout);
  searchQuery = e.target.value;
  searchTimeout = setTimeout(() => {
    renderArticles();
  }, 300);
});

function highlight(text, term) {
  if (!term) return text;
  return text.replace(new RegExp(`(${term})`, 'gi'), '<mark>$1</mark>');
}

// Toast/snackbar
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 1500);
}

// Responsive nav scroll
function setupCategoryNav() {
  const nav = document.getElementById('categoryNav');
  const tabs = nav.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.onclick = function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.textContent;
      localStorage.setItem('newsboxCategory', currentCategory);
      renderArticles();
      nav.scrollTo({ left: this.offsetLeft - 40, behavior: 'smooth' });
    };
    tab.setAttribute('aria-label', tab.textContent + ' category');
  });
}

// Update bookmark count in icon
function updateBookmarkCount() {
  const count = document.getElementById('bookmarkCount');
  if (count) {
    count.textContent = bookmarks.length > 0 ? bookmarks.length : '';
    count.classList.toggle('visually-hidden', bookmarks.length === 0);
  }
}

// Loader on page load
window.addEventListener('DOMContentLoaded', function() {
  showLoader(true);
  showSkeletons();
  setTimeout(() => {
    showLoader(false);
    renderArticles();
  }, 1200);
  setupCategoryNav();
  setupBookmarkBtn();
  setupDarkModeBtn();
  updateBookmarkCount();
});

// Contact form validation and feedback
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const msg = document.getElementById('contactMsg');
    let valid = true;
    if (!name.value.trim()) {
      name.style.borderColor = '#e53935';
      valid = false;
    } else {
      name.style.borderColor = '#c5cae9';
    }
    if (!email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
      email.style.borderColor = '#e53935';
      valid = false;
    } else {
      email.style.borderColor = '#c5cae9';
    }
    if (!msg.value.trim()) {
      msg.style.borderColor = '#e53935';
      valid = false;
    } else {
      msg.style.borderColor = '#c5cae9';
    }
    const status = document.getElementById('contactStatus');
    if (!valid) {
      status.textContent = 'Please fill all fields correctly.';
      status.style.color = '#e53935';
      return;
    }
    status.textContent = 'Thanks for reaching out!';
    status.style.color = '#388e3c';
    contactForm.reset();
    setTimeout(() => { status.textContent = ''; }, 2500);
  };
}

// Banner close button
const closeAd = document.getElementById('closeAd');
if (closeAd) {
  closeAd.onclick = function() {
    const ad = document.getElementById('scrollingAd');
    if (ad) {
      ad.classList.add('hide');
      setTimeout(() => { ad.style.display = 'none'; }, 400);
    }
  };
}

// Article detail modal logic
function openArticleModal(article) {
  const modal = document.getElementById('articleModal');
  document.getElementById('modalImg').src = article.image;
  document.getElementById('modalImg').alt = article.title;
  document.getElementById('modalTitle').textContent = article.title;
  document.getElementById('modalMeta').textContent = `${article.author} | ${article.date} | ${article.category}`;
  document.getElementById('modalSummary').textContent = article.summary;
  modal.classList.add('open');
  modal.focus();
}
function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  modal.classList.remove('open');
}
document.getElementById('closeModal').onclick = closeArticleModal;
document.getElementById('articleModal').onclick = function(e) {
  if (e.target === this) closeArticleModal();
};
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeArticleModal();
});