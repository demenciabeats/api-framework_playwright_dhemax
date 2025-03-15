const { test, expect } = require('@playwright/test');
const { get } = require('../clients/apiClient');
const logger = require('../utils/logger');
const { compareData } = require('../utils/comparisonUtils');
const apiScenarios = require('../data/apiData');
const { sortKeys } = require('../utils/sortKeys');

test.describe('Pruebas de API pública (sin autenticación)', () => {
  let apiResponse;

  test.beforeAll(async () => {
    await test.step("🔸 Iniciar suite y obtener respuesta de la API pública", async () => {
      logger.info('🔸 Iniciando suite de pruebas de API pública');
      apiResponse = await get(apiScenarios.publicEndpoint.endpoint);
      logger.info('✅ Respuesta de la API recibida:', {
        status: apiResponse.status,
        data: apiResponse.data
      });
    });
  });

  test('Debería obtener datos públicos sin token', async () => {
    await test.step("🔍 Validar código de estado 200", async () => {
      logger.info('🔍 Validando código de estado...');
      expect(apiResponse.status).toBe(200);
    });
  });

  test('Debería validar que se devuelven datos y entregar JSON ordenado', async () => {
    await test.step("📝 Validar presencia de datos en la respuesta", async () => {
      expect(apiResponse.data).toBeDefined();
      expect(apiResponse.data).not.toEqual([]);
      logger.info('✅ Datos presentes en la respuesta');
    });

    await test.step("🔀 Ordenar y validar claves del JSON", async () => {
      const sortedData = sortKeys(apiResponse.data);
      if (sortedData && typeof sortedData === 'object' && !Array.isArray(sortedData)) {
        const keys = Object.keys(sortedData);
        const sortedKeys = [...keys].sort();
        expect(keys).toEqual(sortedKeys);
        logger.info('✅ Claves del JSON ordenadas correctamente');
      } else {
        logger.error('❌ Error: No se pudo ordenar el JSON correctamente');
      }
    });

    await test.step("🔎 Validar estructura del primer producto", async () => {
      if (Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
        const product = apiResponse.data[0];
        const expectedStructure = apiScenarios.publicEndpoint.expectedResponseStructure;
        const result = compareData(product, expectedStructure);
        if (result !== true) {
          console.error("❌ Errores en la estructura:", result);
        } else {
          console.log("✅ La estructura del primer producto es correcta");
        }
        expect(result).toBe(true);
      } else {
        throw new Error("🚨 La respuesta no contiene datos o no es un arreglo.");
      }
    });
  });
});