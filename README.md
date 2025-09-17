# TopSmile Project

## Testing

### End-to-End (E2E) Testing

This project uses Cypress for E2E testing. You can run the tests using the following command:

```bash
npm run cypress:open
```

### Visual Regression Testing

To prevent unintended UI changes, it is recommended to add visual regression testing to the project.

Visual regression testing tools capture screenshots of the application and compare them against a baseline. This helps to detect any visual changes that might have been introduced accidentally.

Some popular visual regression testing tools are:

*   [Percy](https://percy.io/)
*   [Applitools](https://applitools.com/)
*   [Happo](https://happo.io/)

These tools can be integrated with the existing Cypress tests to provide a comprehensive testing solution.

### Performance Monitoring

To monitor the performance of the application in production, it is recommended to use a performance monitoring tool.

Performance monitoring tools can help to identify and diagnose performance issues, such as slow page loads, high memory usage, and frequent errors.

Some popular performance monitoring services are:

*   [Sentry](https://sentry.io/)
*   [Datadog](https://www.datadoghq.com/)
*   [New Relic](https://newrelic.com/)

These services can be integrated with the application to provide real-time performance data and alerts.
