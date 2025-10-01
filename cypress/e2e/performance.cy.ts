describe('Performance E2E Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.get('[name="email"]').type('admin@test.com');
    cy.get('[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  describe('Page Load Performance', () => {
    it('should load dashboard under 3 seconds', () => {
      const startTime = performance.now();
      
      cy.visit('/dashboard').then(() => {
        const loadTime = performance.now() - startTime;
        expect(loadTime).to.be.lessThan(3000);
      });

      cy.get('[data-testid="dashboard-content"]').should('be.visible');
    });

    it('should load patient list efficiently with large dataset', () => {
      // Seed database with many patients
      cy.task('seedPatients', 1000);
      
      const startTime = performance.now();
      
      cy.visit('/patients').then(() => {
        const loadTime = performance.now() - startTime;
        expect(loadTime).to.be.lessThan(5000);
      });

      cy.get('[data-testid="patient-list"]').should('be.visible');
      cy.get('[data-testid="patient-item"]').should('have.length.at.least', 10);
    });

    it('should handle calendar view with many appointments', () => {
      cy.task('seedAppointments', 500);
      
      cy.visit('/calendar');
      
      // Should load within reasonable time
      cy.get('[data-testid="calendar-grid"]', { timeout: 10000 }).should('be.visible');
      
      // Should show appointments
      cy.get('[data-testid="appointment-item"]').should('have.length.at.least', 1);
    });
  });

  describe('User Interaction Performance', () => {
    it('should handle rapid navigation without lag', () => {
      const pages = ['/patients', '/appointments', '/calendar', '/dashboard'];
      
      pages.forEach(page => {
        const startTime = performance.now();
        
        cy.visit(page).then(() => {
          const navigationTime = performance.now() - startTime;
          expect(navigationTime).to.be.lessThan(2000);
        });
        
        cy.get('main').should('be.visible');
      });
    });

    it('should handle search with large datasets efficiently', () => {
      cy.task('seedPatients', 1000);
      cy.visit('/patients');
      
      const searchInput = cy.get('[data-testid="search-input"]');
      
      // Type search query
      const startTime = performance.now();
      searchInput.type('John');
      
      // Results should appear quickly
      cy.get('[data-testid="search-results"]', { timeout: 2000 }).should('be.visible');
      
      cy.then(() => {
        const searchTime = performance.now() - startTime;
        expect(searchTime).to.be.lessThan(2000);
      });
    });

    it('should handle form submissions without blocking UI', () => {
      cy.visit('/patients/new');
      
      // Fill form
      cy.get('[name="firstName"]').type('Performance');
      cy.get('[name="lastName"]').type('Test');
      cy.get('[name="email"]').type('perf@test.com');
      cy.get('[name="phone"]').type('555-0123');
      cy.get('[name="dateOfBirth"]').type('1990-01-01');
      
      const startTime = performance.now();
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Should show loading state immediately
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      
      // Should complete submission
      cy.url({ timeout: 5000 }).should('include', '/patients');
      
      cy.then(() => {
        const submissionTime = performance.now() - startTime;
        expect(submissionTime).to.be.lessThan(3000);
      });
    });
  });

  describe('Memory and Resource Usage', () => {
    it('should not accumulate memory during navigation', () => {
      // Navigate between pages multiple times
      for (let i = 0; i < 10; i++) {
        cy.visit('/patients');
        cy.visit('/appointments');
        cy.visit('/calendar');
        cy.visit('/dashboard');
      }
      
      // Check that page still responds normally
      cy.get('[data-testid="dashboard-content"]').should('be.visible');
      
      // Performance should not degrade
      const startTime = performance.now();
      cy.visit('/patients').then(() => {
        const loadTime = performance.now() - startTime;
        expect(loadTime).to.be.lessThan(3000);
      });
    });

    it('should handle long-running sessions without degradation', () => {
      // Simulate user activity over time
      for (let i = 0; i < 20; i++) {
        cy.visit('/patients');
        cy.get('[data-testid="search-input"]').type(`search${i}`);
        cy.wait(100);
        cy.get('[data-testid="search-input"]').clear();
        
        if (i % 5 === 0) {
          cy.visit('/calendar');
          cy.wait(200);
        }
      }
      
      // Should still be responsive
      cy.get('[data-testid="patient-list"]').should('be.visible');
    });
  });

  describe('Network Performance', () => {
    it('should handle slow network conditions gracefully', () => {
      // Simulate slow network
      cy.intercept('GET', '/api/patients*', (req) => {
        req.reply((res) => {
          // Add 2 second delay
          return new Promise(resolve => {
            setTimeout(() => resolve(res.send()), 2000);
          });
        });
      });
      
      cy.visit('/patients');
      
      // Should show loading state
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      
      // Should eventually load content
      cy.get('[data-testid="patient-list"]', { timeout: 10000 }).should('be.visible');
      
      // Loading spinner should disappear
      cy.get('[data-testid="loading-spinner"]').should('not.exist');
    });

    it('should handle network errors gracefully', () => {
      // Simulate network error
      cy.intercept('GET', '/api/patients*', { forceNetworkError: true });
      
      cy.visit('/patients');
      
      // Should show error message
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'Unable to load');
      
      // Should provide retry option
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('should cache data effectively', () => {
      cy.visit('/patients');
      
      // Wait for initial load
      cy.get('[data-testid="patient-list"]').should('be.visible');
      
      // Navigate away and back
      cy.visit('/dashboard');
      
      const startTime = performance.now();
      cy.visit('/patients').then(() => {
        const loadTime = performance.now() - startTime;
        // Should be faster due to caching
        expect(loadTime).to.be.lessThan(1000);
      });
      
      cy.get('[data-testid="patient-list"]').should('be.visible');
    });
  });

  describe('Concurrent User Simulation', () => {
    it('should handle multiple tabs/windows', () => {
      // Open multiple windows (simulated)
      cy.window().then((win) => {
        // Simulate multiple concurrent operations
        cy.visit('/patients');
        cy.get('[data-testid="search-input"]').type('concurrent test');
        
        // Open new patient form in "another tab"
        cy.visit('/patients/new');
        cy.get('[name="firstName"]').type('Concurrent');
        
        // Go back to patient list
        cy.visit('/patients');
        cy.get('[data-testid="patient-list"]').should('be.visible');
      });
    });
  });

  describe('Large Dataset Handling', () => {
    it('should handle pagination efficiently', () => {
      cy.task('seedPatients', 1000);
      cy.visit('/patients');
      
      // Should load first page quickly
      cy.get('[data-testid="patient-list"]').should('be.visible');
      cy.get('[data-testid="pagination"]').should('be.visible');
      
      // Navigate through pages
      for (let page = 2; page <= 5; page++) {
        const startTime = performance.now();
        
        cy.get(`[data-testid="page-${page}"]`).click();
        
        cy.get('[data-testid="patient-list"]').should('be.visible');
        
        cy.then(() => {
          const pageLoadTime = performance.now() - startTime;
          expect(pageLoadTime).to.be.lessThan(2000);
        });
      }
    });

    it('should handle virtual scrolling for large lists', () => {
      cy.task('seedPatients', 5000);
      cy.visit('/patients?view=scroll');
      
      // Should load initial items
      cy.get('[data-testid="virtual-list"]').should('be.visible');
      cy.get('[data-testid="patient-item"]').should('have.length.at.most', 50);
      
      // Scroll down to load more
      cy.get('[data-testid="virtual-list"]').scrollTo('bottom');
      
      // Should load more items without performance issues
      cy.get('[data-testid="patient-item"]').should('have.length.at.least', 50);
    });
  });

  describe('Mobile Performance', () => {
    it('should perform well on mobile viewport', () => {
      cy.viewport('iphone-x');
      
      const startTime = performance.now();
      cy.visit('/dashboard').then(() => {
        const loadTime = performance.now() - startTime;
        expect(loadTime).to.be.lessThan(4000); // Slightly higher threshold for mobile
      });
      
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
    });

    it('should handle touch interactions efficiently', () => {
      cy.viewport('iphone-x');
      cy.visit('/patients');
      
      // Simulate touch scrolling
      cy.get('[data-testid="patient-list"]')
        .trigger('touchstart', { touches: [{ clientX: 100, clientY: 200 }] })
        .trigger('touchmove', { touches: [{ clientX: 100, clientY: 100 }] })
        .trigger('touchend');
      
      // Should remain responsive
      cy.get('[data-testid="patient-list"]').should('be.visible');
    });
  });
});