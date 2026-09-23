import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const categories = [
  'Fabrication', 'Foundry', 'HVAC', 'Lifting', 'Machining', 'Material Handling', 'Molding',
  'Packaging', 'Prototyping', 'Quality Control', 'Robotics', 'Testing', 'Thermal Processing',
  'Utilities', 'Vehicles',
];

export function CategorySearchSelect({ value = '', onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listboxId = useId();
  const availableCategories = value && !categories.includes(value) ? [...categories, value] : categories;
  const filteredCategories = availableCategories.filter((category) => category.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function chooseCategory(category) {
    onChange(category);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function chooseCustomCategory() {
    const customCategory = query.trim();
    if (customCategory) chooseCategory(customCategory);
  }

  function handleKeyDown(event) {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        setIsOpen(true);
        setQuery('');
        event.preventDefault();
      }
      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % (filteredCategories.length + (query.trim() ? 1 : 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((index) => index <= 0 ? filteredCategories.length + (query.trim() ? 0 : -1) : index - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredCategories.length) chooseCategory(filteredCategories[highlightedIndex]);
      else if (query.trim()) chooseCustomCategory();
    }
  }

  const hasCustomOption = query.trim() && !availableCategories.some((category) => category.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="technician-search-select" ref={containerRef}>
      <div className="technician-input-wrapper">
        <span className="technician-input-icon" aria-hidden="true"><Icon name="search" size={15} /></span>
        <input
          ref={inputRef}
          type="text"
          className="technician-search-input"
          placeholder={value ? `${value} (Click to change)` : 'Search or add a category…'}
          value={isOpen ? query : value}
          onFocus={() => { setIsOpen(true); setQuery(''); setHighlightedIndex(-1); }}
          onChange={(event) => { setQuery(event.target.value); setHighlightedIndex(-1); setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          aria-label="Category"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          autoComplete="off"
          required
        />
        {(value || query) && <button type="button" className="technician-clear-btn" aria-label="Clear category" onClick={(event) => { event.stopPropagation(); chooseCategory(''); setIsOpen(true); inputRef.current?.focus(); }}><Icon name="x" size={14} /></button>}
      </div>
      {isOpen && (
        <div className="technician-dropdown" id={listboxId} role="listbox" aria-label="Asset categories">
          <div className="technician-dropdown-header"><span>Select or add a category</span><small>{filteredCategories.length} {filteredCategories.length === 1 ? 'match' : 'matches'}</small></div>
          <div className="technician-options-list">
            {filteredCategories.map((category, index) => (
              <button key={category} type="button" role="option" aria-selected={category === value} className={`technician-option ${category === value ? 'selected' : ''} ${index === highlightedIndex ? 'highlighted' : ''}`} onClick={() => chooseCategory(category)}>
                <span className="technician-user-avatar"><Icon name="assets" size={14} /></span>
                <span className="technician-user-info"><span className="technician-name">{category}</span></span>
                {category === value && <span className="technician-selected-check"><Icon name="check" size={14} /></span>}
              </button>
            ))}
            {filteredCategories.length === 0 && !hasCustomOption && <div className="technician-no-results"><p>No matching categories.</p></div>}
            {hasCustomOption && (
              <button type="button" role="option" aria-selected="false" className={`technician-option ${highlightedIndex === filteredCategories.length ? 'highlighted' : ''}`} onClick={chooseCustomCategory}>
                <span className="technician-user-avatar"><Icon name="plus" size={14} /></span>
                <span className="technician-user-info"><span className="technician-name">Add “{query.trim()}”</span></span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
