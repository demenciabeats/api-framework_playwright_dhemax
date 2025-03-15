// playwright.config.js
const { defineConfig } = require('@playwright/test');
require('dotenv').config(); // Cargar variables de entorno

module.exports = defineConfig({
  testDir: './src/tests', // Directorio donde están los escenarios
  timeout: 60000, // Timeout global para cada prueba (60 segundos)
  retries: 1, // Reintentos en caso de fallo
  workers: 1, // Ejecutar pruebas en secuencia (útil para evitar conflictos con BD)
  fullyParallel: false, // Deshabilitar paralelismo
  reporter: [
    ['list'], // Reportero básico en consola
    ['html', { outputFolder: 'test-results/html' }] // Reporte HTML
  ],
  use: {
    baseURL: process.env.API_BASE_URL, // Usar variable de entorno
    extraHTTPHeaders: {
      'Accept': 'application/json'
    },
    // Configuración para deshabilitar el navegador (no se usa en pruebas de API/BD)
    headless: true,
    browserName: 'chromium',
    launchOptions: {
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    }
  },
  projects: [
    {
      name: 'api-tests',
      testMatch: '**/*.spec.js', // Ejecutar todos los archivos .spec.js
      metadata: {
        environment: 'Staging',
        type: 'API/DB Testing'
      }
    }
  ],
  outputDir: 'test-results/output' // Directorio para resultados de pruebas
});