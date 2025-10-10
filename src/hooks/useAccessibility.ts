import { useEffect, useCallback, useRef } from 'react';

interface AccessibilityOptions {
    announcePageChanges?: boolean;
    manageFocus?: boolean;
    trapFocus?: boolean;
    enableKeyboardNavigation?: boolean;
}

export const useAccessibility = (options: AccessibilityOptions = {}) => {
    const {
        announcePageChanges = true,
        manageFocus = true,
        trapFocus = false,
        enableKeyboardNavigation = true
    } = options;

    const focusTrapRef = useRef<HTMLElement | null>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Announce page changes to screen readers
    const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }, []);

    // Focus management
    const focusElement = useCallback(
        (selector: string | HTMLElement) => {
            if (!manageFocus) return;

            const element = typeof selector === 'string' ? (document.querySelector(selector) as HTMLElement) : selector;

            if (element) {
                element.focus();
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
        [manageFocus]
    );

    // Skip to main content
    const skipToMain = useCallback(() => {
        const mainContent = document.querySelector('main, [role="main"], #main-content');
        if (mainContent) {
            (mainContent as HTMLElement).focus();
            (mainContent as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // Focus trap for modals
    const enableFocusTrap = useCallback(
        (container: HTMLElement) => {
            if (!trapFocus) return;

            previousFocusRef.current = document.activeElement as HTMLElement;
            focusTrapRef.current = container;

            const focusableElements = container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            const handleTabKey = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            };

            const handleEscapeKey = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    disableFocusTrap();
                }
            };

            container.addEventListener('keydown', handleTabKey);
            container.addEventListener('keydown', handleEscapeKey);

            if (firstElement) {
                firstElement.focus();
            }

            return () => {
                container.removeEventListener('keydown', handleTabKey);
                container.removeEventListener('keydown', handleEscapeKey);
            };
        },
        [trapFocus]
    );

    const disableFocusTrap = useCallback(() => {
        if (previousFocusRef.current) {
            previousFocusRef.current.focus();
            previousFocusRef.current = null;
        }
        focusTrapRef.current = null;
    }, []);

    // Keyboard navigation
    useEffect(() => {
        if (!enableKeyboardNavigation) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Alt + S: Skip to main content
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                skipToMain();
                announceToScreenReader('Navegando para o conteúdo principal');
            }

            // Alt + M: Open main menu
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                const menuButton = document.querySelector('[aria-label*="menu"], [aria-label*="Menu"]');
                if (menuButton) {
                    (menuButton as HTMLElement).click();
                    announceToScreenReader('Menu principal aberto');
                }
            }

            // Alt + H: Go to home
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                const homeLink = document.querySelector('a[href="/"], a[href="#/"]');
                if (homeLink) {
                    (homeLink as HTMLElement).click();
                    announceToScreenReader('Navegando para a página inicial');
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [enableKeyboardNavigation, skipToMain, announceToScreenReader]);

    // Color contrast checker
    const checkColorContrast = useCallback((foreground: string, background: string): boolean => {
        // Simple contrast ratio calculation (WCAG AA requires 4.5:1)
        const getLuminance = (color: string) => {
            const rgb = parseInt(color.replace('#', ''), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = (rgb >> 0) & 0xff;

            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });

            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const l1 = getLuminance(foreground);
        const l2 = getLuminance(background);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

        return ratio >= 4.5; // WCAG AA standard
    }, []);

    return {
        announceToScreenReader,
        focusElement,
        skipToMain,
        enableFocusTrap,
        disableFocusTrap,
        checkColorContrast
    };
};

// Hook for managing ARIA attributes
export const useAriaAttributes = () => {
    const setAriaLabel = useCallback((element: HTMLElement, label: string) => {
        element.setAttribute('aria-label', label);
    }, []);

    const setAriaDescribedBy = useCallback((element: HTMLElement, describedById: string) => {
        element.setAttribute('aria-describedby', describedById);
    }, []);

    const setAriaExpanded = useCallback((element: HTMLElement, expanded: boolean) => {
        element.setAttribute('aria-expanded', expanded.toString());
    }, []);

    const setAriaHidden = useCallback((element: HTMLElement, hidden: boolean) => {
        element.setAttribute('aria-hidden', hidden.toString());
    }, []);

    const setRole = useCallback((element: HTMLElement, role: string) => {
        element.setAttribute('role', role);
    }, []);

    return {
        setAriaLabel,
        setAriaDescribedBy,
        setAriaExpanded,
        setAriaHidden,
        setRole
    };
};
