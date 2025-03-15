const { test, expect } = require('@playwright/test');
const { get } = require('../clients/apiClient');
const logger = require('../utils/logger');
const { sortKeys } = require('../utils/sortKeys');

test.describe('Pruebas adicionales - Validación de formato y orden del JSON', () => {
  let response;

  test.beforeAll(async () => {
    await test.step("🔸 Iniciar pruebas adicionales y obtener respuesta", async () => {
      logger.info('🔸 Iniciando pruebas adicionales');
      response = await get('/products');
      logger.info('✅ Respuesta recibida:', {
        status: response.status,
        data: response.data
      });
    });
  });

  test('Debería ordenar las claves del JSON y validar el formato', async () => {
    await test.step("🔀 Ordenar claves del JSON", async () => {
      const sortedData = sortKeys(response.data);
      console.log("📑 JSON ordenado:", JSON.stringify(sortedData, null, 2));

      if (Array.isArray(sortedData) && sortedData.length > 0) {
        const keys = Object.keys(sortedData[0]);
        const sortedKeys = [...keys].sort();
        expect(keys).toEqual(sortedKeys);
        logger.info('✅ Claves del primer elemento ordenadas correctamente');
      } else if (typeof sortedData === 'object') {
        const keys = Object.keys(sortedData);
        const sortedKeys = [...keys].sort();
        expect(keys).toEqual(sortedKeys);
        logger.info('✅ Claves del objeto ordenadas correctamente');
      } else {
        logger.error("🚨 La respuesta tiene un formato inesperado.");
        throw new Error("La respuesta tiene un formato inesperado.");
      }
    });
  });
});