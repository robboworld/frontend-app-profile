import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@openedx/paragon';
import { ExpandMore } from '@openedx/paragon/icons';

const TYPEAHEAD_RESET_MS = 800;

function normalizeSearchLabel(label) {
  return String(label ?? '').trim().toLocaleLowerCase();
}

function findOptionIndexByPrefix(options, prefix, startIndex = -1) {
  if (!prefix) {
    return -1;
  }
  const normalizedPrefix = prefix.toLocaleLowerCase();
  for (let i = startIndex + 1; i < options.length; i += 1) {
    if (normalizeSearchLabel(options[i].label).startsWith(normalizedPrefix)) {
      return i;
    }
  }
  for (let i = 0; i <= startIndex; i += 1) {
    if (normalizeSearchLabel(options[i].label).startsWith(normalizedPrefix)) {
      return i;
    }
  }
  return -1;
}

const RobboSelect = ({
  id,
  name,
  value,
  onChange,
  options,
  disabled,
  readOnly,
  className,
  placeholder,
  'data-hj-suppress': dataHjSuppress,
}) => {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const optionRefs = useRef([]);
  const typeaheadRef = useRef({
    prefix: '',
    lastChar: '',
    lastMatchIndex: -1,
    timer: null,
  });

  const selectableOptions = useMemo(
    () => options.filter((option) => !option.divider),
    [options],
  );

  const selectedOption = useMemo(
    () => selectableOptions.find((option) => option.value === value),
    [selectableOptions, value],
  );

  const displayLabel = selectedOption?.label?.trim()
    ? selectedOption.label
    : (placeholder || selectedOption?.label || '');

  const resetTypeahead = useCallback(() => {
    const state = typeaheadRef.current;
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
    state.prefix = '';
    state.lastChar = '';
    state.lastMatchIndex = -1;
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    resetTypeahead();
  }, [resetTypeahead]);

  const openMenu = useCallback((initialIndex) => {
    if (disabled || readOnly) {
      return;
    }
    if (typeof initialIndex === 'number') {
      setHighlightedIndex(initialIndex);
    } else {
      const selectedIndex = selectableOptions.findIndex((option) => option.value === value);
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
    setOpen(true);
  }, [disabled, readOnly, selectableOptions, value]);

  const applyTypeahead = useCallback((char) => {
    const state = typeaheadRef.current;
    if (state.timer) {
      clearTimeout(state.timer);
    }
    state.timer = setTimeout(() => {
      resetTypeahead();
    }, TYPEAHEAD_RESET_MS);

    const isSameCharRepeat = char.toLocaleLowerCase() === state.lastChar.toLocaleLowerCase()
      && state.prefix.length === 1
      && state.prefix.toLocaleLowerCase() === char.toLocaleLowerCase();

    const nextPrefix = isSameCharRepeat ? state.prefix : `${state.prefix}${char}`;
    const startFrom = isSameCharRepeat ? state.lastMatchIndex : -1;
    const matchIndex = findOptionIndexByPrefix(selectableOptions, nextPrefix, startFrom);

    if (matchIndex < 0) {
      return;
    }

    state.prefix = nextPrefix;
    state.lastChar = char;
    state.lastMatchIndex = matchIndex;
    setHighlightedIndex(matchIndex);
  }, [resetTypeahead, selectableOptions]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [closeMenu, open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const highlightedOption = optionRefs.current[highlightedIndex];
    if (highlightedOption) {
      highlightedOption.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, open]);

  const emitChange = (nextValue) => {
    if (onChange) {
      onChange({ target: { name, value: nextValue } });
    }
  };

  const handleToggle = () => {
    if (disabled || readOnly) {
      return;
    }
    if (open) {
      closeMenu();
      return;
    }
    openMenu();
  };

  const handleSelect = (optionValue) => {
    emitChange(optionValue);
    closeMenu();
  };

  const handleKeyDown = (event) => {
    if (disabled || readOnly) {
      return;
    }

    const { key } = event;

    if (key === 'Escape') {
      if (open) {
        event.preventDefault();
        closeMenu();
      }
      return;
    }

    if (key === 'ArrowDown') {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      setHighlightedIndex((prev) => Math.min(prev + 1, selectableOptions.length - 1));
      return;
    }

    if (key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (key === 'Enter' || key === ' ') {
      if (!open) {
        event.preventDefault();
        openMenu();
        return;
      }
      if (key === 'Enter') {
        event.preventDefault();
        const highlighted = selectableOptions[highlightedIndex];
        if (highlighted) {
          handleSelect(highlighted.value);
        }
      }
      return;
    }

    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      }
      applyTypeahead(key);
    }
  };

  const optionIdPrefix = id || name || 'robbo-select';

  return (
    <div
      ref={containerRef}
      className={classNames('robbo-select', className, {
        'robbo-select--open': open,
        'robbo-select--disabled': disabled || readOnly,
      })}
      data-hj-suppress={dataHjSuppress || undefined}
    >
      <button
        type="button"
        id={id}
        className="robbo-select__trigger"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled || readOnly}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-activedescendant={
          open && selectableOptions[highlightedIndex]
            ? `${optionIdPrefix}-option-${selectableOptions[highlightedIndex].value}`
            : undefined
        }
      >
        <span
          className={classNames('robbo-select__value', {
            'robbo-select__value--placeholder': !selectedOption?.label?.trim(),
          })}
        >
          {displayLabel}
        </span>
        <Icon className="robbo-select__arrow" src={ExpandMore} />
      </button>
      {open && (
        <ul className="robbo-select__menu" role="listbox" aria-labelledby={id}>
          {selectableOptions.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <li
                key={`${option.value}-${option.label}`}
                id={`${optionIdPrefix}-option-${option.value}`}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                className={classNames('robbo-select__option', {
                  'robbo-select__option--highlighted': isHighlighted,
                })}
                role="option"
                aria-selected={isSelected}
              >
                <button
                  type="button"
                  className="robbo-select__option-button"
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="robbo-select__option-label">{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

RobboSelect.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    divider: PropTypes.bool,
  })).isRequired,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  'data-hj-suppress': PropTypes.bool,
};

RobboSelect.defaultProps = {
  id: undefined,
  name: undefined,
  value: '',
  onChange: null,
  disabled: false,
  readOnly: false,
  className: '',
  placeholder: '',
  'data-hj-suppress': false,
};

export default RobboSelect;
