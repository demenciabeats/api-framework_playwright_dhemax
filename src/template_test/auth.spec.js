const { test, expect } = require('@playwright/test');
const { post } = require('../clients/apiClient');
const logger = require('../utils/logger');
const { compareData } = require('../utils/comparisonUtils');
const apiScenarios = require('../data/apiData');

test.describe('Pruebas de autenticación', () => {
  let authResponse;

  test.beforeAll(async () => {
    await test.step("🔸 Iniciar suite y enviar petición de autenticación", async () => {
      logger.info('🔸 Iniciando suite de pruebas de autenticación');
      authResponse = await post(apiScenarios.authEndpoint.endpoint, {
        email: 'fprovoste@dhemax.com',
        password: 'dhemax.2024'
      });
      logger.info('✅ Respuesta de autenticación recibida:', {
        status: authResponse.status,
        data: authResponse.data
      });
    });
  });

  test('Debería obtener token de autenticación', async () => {
    await test.step("🔍 Validar código de estado 200", async () => {
      logger.info('🔍 Validando código de estado...');
      expect(authResponse.status).toBe(200);
    });
    
    await test.step("🔎 Validar estructura del token y mostrar datos ordenados", async () => {
      const expectedAuthStructure = apiScenarios.authEndpoint.expectedResponseStructure;
      const result = compareData(authResponse.data, expectedAuthStructure);
      if (result !== true) {
        console.error("❌ Errores en la estructura de autenticación:", result);
      } else {
        console.log("✅ La estructura del token es correcta");
      }
      expect(result).toBe(true);
      
      // Ordenar y mostrar el objeto recibido
      const { sortKeys } = require('../utils/sortKeys');
      const sortedData = sortKeys(authResponse.data);
      console.log("📑 Resultado de la respuesta ordenada:", JSON.stringify(sortedData, null, 2));
    });
  });
});