// src/components/common/Dropdown/Dropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';
import './Dropdown.css';

interface DropdownProps {
  trigger: React.ReactNode;
  items: Array<{ label: string; onClick: () => void; disabled?: boolean }>;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useKeyboardNavigation({
    onEscape: () => setIsOpen(false),
    onArrowDown: () => {
      if (isOpen) {
        setSelectedIndex((prev) => (prev + 1) % items.length);
      }
    },
    onArrowUp: () => {
      if (isOpen) {
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      }
    },
    onEnter: () => {
      if (isOpen) {
        items[selectedIndex]?.onClick();
        setIsOpen(false);
      }
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="dropdown-trigger"
      >
        {trigger}
      </button>
      {isOpen && (
        <ul role="menu" className="dropdown-menu">
          {items.map((item, index) => (
            <li key={index} role="none">
              <button
                role="menuitem"
                className={`dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                tabIndex={index === selectedIndex ? 0 : -1}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
