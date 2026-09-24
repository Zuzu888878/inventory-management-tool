import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const maintenanceTypes = ['Inspection', 'Preventive maintenance', 'Repair', 'Calibration'];

export function MaintenanceTypeSearchSelect({ value = '', onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listboxId = useId();
  const normalizedQuery = query.trim().toLowerCase();
  const availableTypes = value && !maintenanceTypes.includes(value) && (!isOpen || !query)
    ? [...maintenanceTypes, value]
    : maintenanceTypes;
  const filteredTypes = availableTypes.filter((type) => type.toLowerCase().includes(normalizedQuery));
  const hasExactMatch = availableTypes.some((type) => type.toLowerCase() === normalizedQuery);
  const hasCustomOption = Boolean(normalizedQuery) && !hasExactMatch;
  const optionCount = filteredTypes.length + Number(hasCustomOption);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function chooseType(type) {
    onChange(type);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(event) {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        event.preventDefault();
        setIsOpen(true);
        setQuery('');
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      setQuery('');
      setHighlightedIndex(-1);
    } else if (event.key === 'ArrowDown' && optionCount) {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % optionCount);
    } else if (event.key === 'ArrowUp' && optionCount) {
      event.preventDefault();
      setHighlightedIndex((index) => index <= 0 ? optionCount - 1 : index - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredTypes.length) {
        chooseType(filteredTypes[highlightedIndex]);
      } else if (hasCustomOption && highlightedIndex === filteredTypes.length) {
        chooseType(query.trim());
      } else if (query.trim()) {
        chooseType(query.trim());
      }
    }
  }

  return (
    <div className="technician-search-select" ref={containerRef}>
      <div className="technician-input-wrapper">
        <span className="technician-input-icon" aria-hidden="true"><Icon name="search" size={15} /></span>
        <input
          type="text"
          className="technician-search-input"
          placeholder={value || 'Search or enter a maintenance type...'}
          value={isOpen ? query : value}
          required
          role="combobox"
          aria-label="Maintenance type"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined}
          autoComplete="off"
          onFocus={() => { setIsOpen(true); setQuery(''); setHighlightedIndex(-1); }}
          onChange={(event) => {
            setQuery(event.target.value);
            setHighlightedIndex(-1);
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {(value || query) && (
          <button
            type="button"
            className="technician-clear-btn"
            aria-label="Clear maintenance type"
            onClick={(event) => {
              event.stopPropagation();
              onChange('');
              setQuery('');
              setIsOpen(true);
            }}
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="technician-dropdown" id={listboxId} role="listbox" aria-label="Maintenance types">
          <div className="technician-dropdown-header">
            <span>Choose a maintenance type</span>
            <small>{filteredTypes.length} {filteredTypes.length === 1 ? 'match' : 'matches'}</small>
          </div>
          <div className="technician-options-list">
            {filteredTypes.map((type, index) => (
              <button
                key={type}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={type === value}
                tabIndex={-1}
                className={`technician-option ${type === value ? 'selected' : ''} ${index === highlightedIndex ? 'highlighted' : ''}`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => chooseType(type)}
              >
                <span className="technician-user-avatar"><Icon name="wrench" size={14} /></span>
                <span className="technician-user-info"><span className="technician-name">{type}</span></span>
                {type === value && <span className="technician-selected-check"><Icon name="check" size={14} /></span>}
              </button>
            ))}
            {hasCustomOption && (
              <button
                id={`${listboxId}-option-${filteredTypes.length}`}
                type="button"
                role="option"
                aria-selected="false"
                tabIndex={-1}
                className={`technician-option ${highlightedIndex === filteredTypes.length ? 'highlighted' : ''}`}
                onMouseEnter={() => setHighlightedIndex(filteredTypes.length)}
                onClick={() => chooseType(query.trim())}
              >
                <span className="technician-user-avatar"><Icon name="plus" size={14} /></span>
                <span className="technician-user-info"><span className="technician-name">Use “{query.trim()}”</span></span>
              </button>
            )}
            {filteredTypes.length === 0 && !hasCustomOption && (
              <div className="technician-no-results"><p>No suggested types. Enter a custom type.</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
