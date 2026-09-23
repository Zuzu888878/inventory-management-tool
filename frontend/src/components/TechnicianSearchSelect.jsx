import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

export function TechnicianSearchSelect({
  technicians = [],
  selectedId = null,
  selectedName = '',
  onChange,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listboxId = useId();

  // Find currently selected technician object if available
  const selectedTech = technicians.find(
    (tech) => (selectedId && Number(tech.id) === Number(selectedId)) ||
              (selectedName && (tech.displayName === selectedName || tech.username === selectedName))
  );

  const displayName = selectedTech?.displayName || selectedName || '';

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter technicians based on search query
  const query = searchQuery.trim().toLowerCase();
  const filteredTechnicians = technicians.filter((tech) => {
    if (!query) return true;
    const nameMatch = tech.displayName?.toLowerCase().includes(query);
    const usernameMatch = tech.username?.toLowerCase().includes(query);
    const roleMatch = tech.role?.toLowerCase().includes(query);
    return nameMatch || usernameMatch || roleMatch;
  });

  function handleSelect(tech) {
    if (tech) {
      onChange({ id: tech.id, name: tech.displayName });
    } else {
      onChange({ id: null, name: '' });
    }
    setSearchQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleCustomName() {
    if (!searchQuery.trim()) return;
    onChange({ id: null, name: searchQuery.trim() });
    setSearchQuery('');
    setIsOpen(false);
  }

  function handleKeyDown(event) {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        setIsOpen(true);
        event.preventDefault();
      }
      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredTechnicians.length ? prev + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredTechnicians.length
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (highlightedIndex === 0) {
        handleSelect(null);
      } else if (highlightedIndex > 0 && highlightedIndex <= filteredTechnicians.length) {
        handleSelect(filteredTechnicians[highlightedIndex - 1]);
      } else if (searchQuery.trim()) {
        handleCustomName();
      }
    }
  }

  return (
    <div className="technician-search-select" ref={containerRef}>
      <div className="technician-input-wrapper">
        <span className="technician-input-icon" aria-hidden="true">
          <Icon name="search" size={15} />
        </span>
        <input
          ref={inputRef}
          type="text"
          className="technician-search-input"
          placeholder={displayName ? `${displayName} (Click to change)` : 'Search user by name, username, or role...'}
          value={isOpen ? searchQuery : displayName}
          disabled={disabled}
          onFocus={() => {
            setIsOpen(true);
            setSearchQuery('');
          }}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          autoComplete="off"
        />
        {(displayName || searchQuery) && (
          <button
            type="button"
            className="technician-clear-btn"
            title="Clear technician"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(null);
              setSearchQuery('');
              if (inputRef.current) inputRef.current.focus();
            }}
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="technician-dropdown" id={listboxId} role="listbox">
          <div className="technician-dropdown-header">
            <span>Select a user as technician</span>
            {searchQuery && (
              <small>{filteredTechnicians.length} match{filteredTechnicians.length === 1 ? '' : 'es'}</small>
            )}
          </div>

          <button
            type="button"
            role="option"
            aria-selected={!selectedId && !selectedName}
            className={`technician-option technician-option-unassigned ${
              highlightedIndex === 0 ? 'highlighted' : ''
            }`}
            onClick={() => handleSelect(null)}
          >
            <span className="technician-user-avatar unassigned-avatar">
              <Icon name="user" size={14} />
            </span>
            <div className="technician-user-info">
              <span className="technician-name text-muted">Unassigned / No technician</span>
            </div>
            {!selectedId && !selectedName && (
              <span className="technician-selected-check">
                <Icon name="check" size={14} />
              </span>
            )}
          </button>

          <div className="technician-options-list">
            {filteredTechnicians.map((tech, index) => {
              const isSelected =
                (selectedId && Number(tech.id) === Number(selectedId)) ||
                (!selectedId && selectedName && (tech.displayName === selectedName || tech.username === selectedName));
              const isHighlighted = highlightedIndex === index + 1;

              return (
                <button
                  key={tech.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`technician-option ${isSelected ? 'selected' : ''} ${
                    isHighlighted ? 'highlighted' : ''
                  }`}
                  onClick={() => handleSelect(tech)}
                >
                  <span className="technician-user-avatar">
                    <Icon name="user" size={14} />
                  </span>
                  <div className="technician-user-info">
                    <span className="technician-name">{tech.displayName}</span>
                    <span className="technician-meta">
                      <span className="technician-username">@{tech.username}</span>
                      <span className={`role-badge role-${tech.role}`}>{tech.role}</span>
                    </span>
                  </div>
                  {isSelected && (
                    <span className="technician-selected-check">
                      <Icon name="check" size={14} />
                    </span>
                  )}
                </button>
              );
            })}

            {filteredTechnicians.length === 0 && (
              <div className="technician-no-results">
                <p>No matching users found.</p>
                {searchQuery.trim() && (
                  <button
                    type="button"
                    className="button-outline button-small"
                    onClick={handleCustomName}
                  >
                    Assign unlinked name "{searchQuery.trim()}"
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
