import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAccessibility } from '../hooks/useAccessibility';
import Button from '../components/UI/Button/Button';

// Test component to verify accessibility hook
const TestAccessibilityComponent: React.FC = () => {
    const { announceToScreenReader, focusElement } = useAccessibility();

    const handleClick = () => {
        announceToScreenReader('Button clicked successfully', 'polite');
    };

    return (
        <div>
            <Button onClick={handleClick}>Test Button</Button>
            <main id="main-content" tabIndex={-1}>
                Main content
            </main>
        </div>
    );
};

describe('Accessibility Improvements', () => {
    test('Button component has proper accessibility attributes', () => {
        render(<Button loading>Loading Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-busy', 'true');
        expect(button).toHaveAttribute('aria-describedby', 'loading-status');
        expect(screen.getByText('Carregando')).toBeInTheDocument();
    });

    test('useAccessibility hook can be used in components', () => {
        render(<TestAccessibilityComponent />);

        const button = screen.getByRole('button', { name: 'Test Button' });
        const mainContent = screen.getByRole('main');

        expect(button).toBeInTheDocument();
        expect(mainContent).toHaveAttribute('tabindex', '-1');
    });

    test('Button announces loading state to screen readers', () => {
        const { rerender } = render(<Button>Normal Button</Button>);

        // Initially not loading
        let button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-busy', 'false');

        // When loading
        rerender(<Button loading>Loading Button</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-busy', 'true');
    });
});
