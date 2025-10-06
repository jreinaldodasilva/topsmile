// src/components/lazy/LazyWrapper.test.tsx
import React, { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { LazyWrapper } from '../common/LazyWrapper';

describe('LazyWrapper', () => {
  it('renders children when loaded', async () => {
    render(
      <LazyWrapper>
        <div>Loaded Content</div>
      </LazyWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText('Loaded Content')).toBeInTheDocument();
    });
  });

  it('shows custom fallback while loading', () => {
    const LazyComponent = React.lazy(() => new Promise(() => {}));
    render(
      <LazyWrapper fallback={<div>Custom Loading...</div>}>
        <LazyComponent />
      </LazyWrapper>
    );
    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
  });
});
