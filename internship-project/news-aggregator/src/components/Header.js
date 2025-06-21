import React from 'react';

function Header({ onToggleDarkMode, isDarkMode, onExport, children }) {
  return (
    <header className="header">
      <h1>NewsBox</h1>
      {children}
      <button onClick={onToggleDarkMode} aria-label="Toggle dark mode">
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <button onClick={onExport} aria-label="Export bookmarks">⬇️ Export</button>
    </header>
  );
}

export default Header;
