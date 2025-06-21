import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ArticleList from './components/ArticleList';
import BookmarkPanel from './components/BookmarkPanel';
import Footer from './components/Footer';
import articlesData from './data/articles.json';
import './styles.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500); // Loader for 1.5s
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const categories = ['All', ...Array.from(new Set(articlesData.map(a => a.category)))];

  const filteredArticles = articlesData.filter(a =>
    (selectedCategories.includes('All') || selectedCategories.includes(a.category)) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCategoryChange = cat => {
    if (cat === 'All') setSelectedCategories(['All']);
    else {
      setSelectedCategories(prev => {
        const next = prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev.filter(c => c !== 'All'), cat];
        return next.length ? next : ['All'];
      });
    }
  };

  const handleBookmark = article => {
    setBookmarks(prev => prev.includes(article.id) ? prev.filter(id => id !== article.id) : [...prev, article.id]);
  };

  const handleExport = () => {
    const data = JSON.stringify(articlesData.filter(a => bookmarks.includes(a.id)), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookmarks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = article => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: article.url });
    } else {
      navigator.clipboard.writeText(article.url);
      alert('Link copied!');
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header
        onToggleDarkMode={() => setDarkMode(d => !d)}
        isDarkMode={darkMode}
        onExport={handleExport}
      >
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter
          categories={categories}
          selected={selectedCategories}
          onChange={handleCategoryChange}
        />
      </Header>
      <button id="bookmarkBtn" onClick={() => setShowPanel(true)} style={{position:'fixed',top:20,right:20,zIndex:2000}}>🔖</button>
      {loading ? (
        <div id="loader" style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}>
          <div className="loader-spinner"></div>
        </div>
      ) : (
        <ArticleList
          articles={filteredArticles}
          bookmarks={bookmarks}
          onBookmark={handleBookmark}
          onShare={handleShare}
        />
      )}
      <BookmarkPanel
        open={showPanel}
        bookmarks={bookmarks}
        articles={articlesData}
        onClose={() => setShowPanel(false)}
        onBookmark={handleBookmark}
        onExport={handleExport}
      />
      <Footer />
    </div>
  );
}

export default App;
