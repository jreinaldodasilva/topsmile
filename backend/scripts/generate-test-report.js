#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate comprehensive test analytics report
 */

const reportsDir = path.join(__dirname, '../reports');
const analyticsDir = path.join(reportsDir, 'analytics');
const performanceDir = path.join(reportsDir, 'performance');
const coverageDir = path.join(reportsDir, 'coverage-history');

function ensureDirectories() {
  [reportsDir, analyticsDir, performanceDir, coverageDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function getLatestFile(directory, pattern) {
  if (!fs.existsSync(directory)) return null;
  
  const files = fs.readdirSync(directory)
    .filter(file => file.match(pattern))
    .map(file => ({
      name: file,
      path: path.join(directory, file),
      mtime: fs.statSync(path.join(directory, file)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);
  
  return files.length > 0 ? files[0].path : null;
}

function loadJsonFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.warn(`Failed to load ${filePath}:`, error.message);
    return null;
  }
}

function generateHtmlReport(data) {
  const { analytics, performance, coverage } = data;
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TopSmile - Relatório de Testes</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; color: #2c3e50; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .metric { text-align: center; padding: 15px; background: #ecf0f1; border-radius: 5px; }
        .metric-value { font-size: 2em; font-weight: bold; color: #3498db; }
        .metric-label { color: #7f8c8d; margin-top: 5px; }
        .success { color: #27ae60; }
        .warning { color: #f39c12; }
        .error { color: #e74c3c; }
        .list { list-style: none; padding: 0; }
        .list li { padding: 8px; margin: 4px 0; background: #f8f9fa; border-left: 4px solid #3498db; }
        .flaky { border-left-color: #e74c3c; }
        .slow { border-left-color: #f39c12; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #3498db; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 TopSmile - Relatório de Testes</h1>
            <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        </div>

        ${analytics ? `
        <div class="card">
            <h2>📈 Resumo dos Testes</h2>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value ${analytics.summary.totalTests > 0 ? 'success' : 'error'}">${analytics.summary.totalTests}</div>
                    <div class="metric-label">Total de Testes</div>
                </div>
                <div class="metric">
                    <div class="metric-value success">${analytics.summary.passed}</div>
                    <div class="metric-label">Aprovados</div>
                </div>
                <div class="metric">
                    <div class="metric-value ${analytics.summary.failed > 0 ? 'error' : 'success'}">${analytics.summary.failed}</div>
                    <div class="metric-label">Falharam</div>
                </div>
                <div class="metric">
                    <div class="metric-value ${analytics.summary.failureRate > 10 ? 'error' : analytics.summary.failureRate > 5 ? 'warning' : 'success'}">${analytics.summary.failureRate.toFixed(1)}%</div>
                    <div class="metric-label">Taxa de Falha</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${analytics.summary.averageDuration.toFixed(0)}ms</div>
                    <div class="metric-label">Duração Média</div>
                </div>
            </div>

            ${analytics.flakyTests.length > 0 ? `
            <h3>⚠️ Testes Instáveis</h3>
            <ul class="list">
                ${analytics.flakyTests.map(test => `<li class="flaky">${test}</li>`).join('')}
            </ul>
            ` : ''}

            ${analytics.slowestTests.length > 0 ? `
            <h3>🐌 Testes Mais Lentos</h3>
            <table>
                <thead>
                    <tr><th>Teste</th><th>Duração (ms)</th></tr>
                </thead>
                <tbody>
                    ${analytics.slowestTests.map(test => `
                        <tr><td>${test.name}</td><td>${test.duration}</td></tr>
                    `).join('')}
                </tbody>
            </table>
            ` : ''}
        </div>
        ` : ''}

        ${performance ? `
        <div class="card">
            <h2>⚡ Performance</h2>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">${performance.summary.averageDuration}ms</div>
                    <div class="metric-label">Duração Média</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${performance.summary.averageMemoryUsage}MB</div>
                    <div class="metric-label">Uso Médio de Memória</div>
                </div>
                <div class="metric">
                    <div class="metric-value ${performance.summary.slowTestsCount > 0 ? 'warning' : 'success'}">${performance.summary.slowTestsCount}</div>
                    <div class="metric-label">Testes Lentos</div>
                </div>
                <div class="metric">
                    <div class="metric-value ${performance.summary.memoryLeaksCount > 0 ? 'error' : 'success'}">${performance.summary.memoryLeaksCount}</div>
                    <div class="metric-label">Vazamentos de Memória</div>
                </div>
            </div>
        </div>
        ` : ''}

        ${coverage ? `
        <div class="card">
            <h2>📋 Cobertura de Código</h2>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value ${coverage.summary.averageCoverage >= 75 ? 'success' : coverage.summary.averageCoverage >= 60 ? 'warning' : 'error'}">${coverage.summary.averageCoverage}%</div>
                    <div class="metric-label">Cobertura Média</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${coverage.summary.totalFiles}</div>
                    <div class="metric-label">Arquivos Totais</div>
                </div>
                <div class="metric">
                    <div class="metric-value ${coverage.summary.coverageGoalMet ? 'success' : 'warning'}">${coverage.summary.coverageGoalMet ? 'Sim' : 'Não'}</div>
                    <div class="metric-label">Meta Atingida (75%)</div>
                </div>
            </div>

            ${coverage.uncoveredFiles.length > 0 ? `
            <h3>📁 Arquivos com Baixa Cobertura</h3>
            <table>
                <thead>
                    <tr><th>Arquivo</th><th>Cobertura</th></tr>
                </thead>
                <tbody>
                    ${coverage.uncoveredFiles.slice(0, 10).map(file => `
                        <tr><td>${file.file}</td><td>${file.coverage}%</td></tr>
                    `).join('')}
                </tbody>
            </table>
            ` : ''}
        </div>
        ` : ''}

        <div class="card">
            <h2>📝 Recomendações</h2>
            <ul class="list">
                ${analytics && analytics.summary.failureRate > 10 ? '<li class="error">Alta taxa de falha - revisar testes falhando</li>' : ''}
                ${analytics && analytics.flakyTests.length > 0 ? '<li class="warning">Testes instáveis detectados - investigar e corrigir</li>' : ''}
                ${performance && performance.summary.slowTestsCount > 5 ? '<li class="warning">Muitos testes lentos - otimizar performance</li>' : ''}
                ${coverage && coverage.summary.averageCoverage < 75 ? '<li class="warning">Cobertura abaixo da meta - adicionar mais testes</li>' : ''}
                ${coverage && coverage.regressions && coverage.regressions.length > 0 ? '<li class="error">Regressão na cobertura detectada</li>' : ''}
                <li class="success">Executar testes regularmente para manter qualidade</li>
                <li class="success">Monitorar métricas de performance continuamente</li>
            </ul>
        </div>
    </div>
</body>
</html>
  `;
}

function main() {
  console.log('🔍 Gerando relatório de testes...');
  
  ensureDirectories();
  
  // Load latest reports
  const analyticsFile = getLatestFile(analyticsDir, /test-analytics-.*\.json$/);
  const performanceFile = getLatestFile(performanceDir, /performance-.*\.json$/);
  const coverageFile = getLatestFile(coverageDir, /coverage-report-.*\.json$/);
  
  const data = {
    analytics: loadJsonFile(analyticsFile),
    performance: loadJsonFile(performanceFile),
    coverage: loadJsonFile(coverageFile)
  };
  
  // Generate HTML report
  const htmlReport = generateHtmlReport(data);
  const htmlPath = path.join(reportsDir, `test-report-${Date.now()}.html`);
  fs.writeFileSync(htmlPath, htmlReport);
  
  // Generate JSON summary
  const jsonSummary = {
    timestamp: new Date().toISOString(),
    ...data,
    recommendations: []
  };
  
  const jsonPath = path.join(reportsDir, `test-summary-${Date.now()}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonSummary, null, 2));
  
  console.log('✅ Relatório gerado com sucesso!');
  console.log(`📄 HTML: ${htmlPath}`);
  console.log(`📊 JSON: ${jsonPath}`);
}

if (require.main === module) {
  main();
}

module.exports = { generateHtmlReport, loadJsonFile };