import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/Login/LoginPage';
import Dashboard from '../../components/Admin/Dashboard/Dashboard';
import PatientDashboard from '../../pages/Patient/Dashboard/PatientDashboard';
import { AuthProvider } from '../../contexts/AuthContext';
import { PatientAuthProvider } from '../../contexts/PatientAuthContext';

expect.extend(toHaveNoViolations);

describe('Accessibility Integration', () => {
    it('should have no accessibility violations on LoginPage', async () => {
        const { container } = render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations on Dashboard', async () => {
        const { container } = render(
            <BrowserRouter>
                <AuthProvider>
                    <Dashboard />
                </AuthProvider>
            </BrowserRouter>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have proper keyboard navigation on forms', async () => {
        const { container } = render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        const emailInput = container.querySelector('input[type="email"]');
        const passwordInput = container.querySelector('input[type="password"]');
        const submitButton = container.querySelector('button[type="submit"]');

        // Check tab order
        expect(emailInput).toHaveAttribute('tabIndex', '0');
        expect(passwordInput).toHaveAttribute('tabIndex', '0');
        expect(submitButton).toHaveAttribute('tabIndex', '0');

        // Check ARIA attributes
        expect(emailInput).toHaveAttribute('aria-label');
        expect(passwordInput).toHaveAttribute('aria-label');
        expect(submitButton).toHaveAttribute('aria-label');
    });

    it('should have proper heading hierarchy', async () => {
        const { container } = render(
            <BrowserRouter>
                <AuthProvider>
                    <Dashboard />
                </AuthProvider>
            </BrowserRouter>
        );

        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));

        // Check that heading levels are in proper order (no skipping levels)
        for (let i = 1; i < headingLevels.length; i++) {
            expect(headingLevels[i]).toBeLessThanOrEqual(headingLevels[i - 1] + 1);
        }
    });

    it('should have sufficient color contrast', async () => {
        const { container } = render(
            <BrowserRouter>
                <PatientAuthProvider>
                    <PatientDashboard />
                </PatientAuthProvider>
            </BrowserRouter>
        );

        const results = await axe(container, {
            rules: {
                'color-contrast': { enabled: true }
            }
        });

        // Check for color contrast violations
        const contrastViolations = results.violations.filter(violation => violation.id === 'color-contrast');

        expect(contrastViolations).toHaveLength(0);
    });

    it('should have proper form labels and descriptions', async () => {
        const { container } = render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            // Each input should have either a label or aria-label
            const hasLabel =
                input.hasAttribute('aria-label') ||
                input.hasAttribute('aria-labelledby') ||
                container.querySelector(`label[for="${input.id}"]`);

            expect(hasLabel).toBe(true);
        });
    });

    it('should support screen reader announcements', async () => {
        const { container } = render(
            <BrowserRouter>
                <AuthProvider>
                    <Dashboard />
                </AuthProvider>
            </BrowserRouter>
        );

        // Check for ARIA live regions for dynamic content
        const liveRegions = container.querySelectorAll('[aria-live]');
        expect(liveRegions.length).toBeGreaterThan(0);

        // Check for proper ARIA attributes on interactive elements
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            expect(button).toHaveAttribute('aria-label');
        });
    });

    it('should handle focus management properly', async () => {
        const { container } = render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            expect(element).toHaveAttribute('tabIndex');
            const tabIndex = element.getAttribute('tabIndex');
            expect(tabIndex).not.toBe('-1'); // Should not be explicitly removed from tab order
        });
    });
});
