import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

export function AssetSearchSelect({ assets = [], selectedId = '', onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listboxId = useId();
  const selectedAsset = assets.find((asset) => String(asset.id) === String(selectedId));
  const selectedLabel = selectedAsset
    ? `${selectedAsset.assetCode} — ${selectedAsset.name}`
    : '';
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAssets = assets.filter((asset) =>
    [asset.assetCode, asset.name, asset.machineType, asset.category, asset.location, asset.serialNumber]
      .some((value) => value?.toLowerCase().includes(normalizedQuery)),
  );

  useEffect(() => {
    inputRef.current?.setCustomValidity(selectedAsset ? '' : 'Select an asset from the list.');
  }, [selectedAsset]);

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

  function selectAsset(asset) {
    onChange(asset ? String(asset.id) : '');
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
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filteredAssets.length) {
        setHighlightedIndex((index) => (index + 1) % filteredAssets.length);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filteredAssets.length) {
        setHighlightedIndex((index) => index <= 0 ? filteredAssets.length - 1 : index - 1);
      }
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      selectAsset(filteredAssets[highlightedIndex]);
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
          placeholder={selectedLabel || 'Search assets by code, name, or location...'}
          value={isOpen ? query : selectedLabel}
          disabled={disabled}
          required
          role="combobox"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined}
          autoComplete="off"
          onFocus={() => {
            setIsOpen(true);
            setQuery('');
            setHighlightedIndex(-1);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setHighlightedIndex(-1);
            if (selectedId) onChange('');
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {(selectedId || query) && (
          <button
            type="button"
            className="technician-clear-btn"
            aria-label="Clear selected asset"
            onClick={(event) => {
              event.stopPropagation();
              selectAsset(null);
              setIsOpen(true);
              inputRef.current?.focus();
            }}
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="technician-dropdown" id={listboxId} role="listbox" aria-label="Assets">
          <div className="technician-dropdown-header">
            <span>Select an asset</span>
            <small>{filteredAssets.length} {filteredAssets.length === 1 ? 'match' : 'matches'}</small>
          </div>
          <div className="technician-options-list">
            {filteredAssets.map((asset, index) => {
              const isSelected = String(asset.id) === String(selectedId);
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={asset.id}
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  className={`technician-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectAsset(asset)}
                >
                  <span className="technician-user-avatar"><Icon name="assets" size={14} /></span>
                  <span className="technician-user-info">
                    <span className="technician-name">{asset.assetCode} — {asset.name}</span>
                    <span className="technician-meta">
                      {[asset.machineType, asset.location].filter(Boolean).join(' · ') || asset.category}
                    </span>
                  </span>
                  {isSelected && <span className="technician-selected-check"><Icon name="check" size={14} /></span>}
                </button>
              );
            })}
            {filteredAssets.length === 0 && (
              <div className="technician-no-results"><p>No matching assets found.</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
