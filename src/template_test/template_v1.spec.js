const { test, expect } = require('@playwright/test');
const { get } = require('../clients/apiClient');
const logger = require('../utils/logger');
const { compareData } = require('../utils/comparisonUtils');
const apiScenarios = require('../data/apiData'); // Uses apiData.js
const { sortKeys } = require('../utils/sortKeys'); // Assuming this utility exists

test.describe('Pruebas de API para endpoint público', () => {
    let apiResponse;
  
    test.beforeAll(async () => {
      await test.step("🔸 Iniciar suite y obtener respuesta de la API", async () => {
        logger.info('🔸 Iniciando suite de pruebas de API para endpoint público');
        apiResponse = await get(apiScenarios.publicEndpoint.endpoint);
        logger.info('✅ Respuesta de la API recibida:', {
          status: apiResponse.status,
          // Log only a summary of data if it's large
          dataSummary: Array.isArray(apiResponse.data) ? `Array of ${apiResponse.data.length} items` : typeof apiResponse.data
        });
      });
    });

    test('Debería obtener una respuesta exitosa (código 200)', async () => {
        await test.step("🔍 Validar código de estado 200", async () => {
          logger.info('🔍 Validando código de estado...');
          expect(apiResponse.status).toBe(200);
          logger.info('✅ Código de estado es 200');
        });
    });

    test('Debería validar que se devuelven datos y su estructura', async () => {
        await test.step("📝 Validar presencia y tipo de datos en la respuesta", async () => {
          expect(apiResponse.data).toBeDefined();
          expect(Array.isArray(apiResponse.data)).toBe(true);
          logger.info('✅ Datos presentes en la respuesta y es un array.');
          // Optionally, check if the array is not empty if that's an expectation
          if (Array.isArray(apiResponse.data)) {
            expect(apiResponse.data.length).toBeGreaterThan(0);
            logger.info(`✅ El array de datos contiene ${apiResponse.data.length} elementos.`);
          }
        });

        await test.step("🔎 Validar estructura del primer elemento de la respuesta", async () => {
            if (Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
              const firstItem = apiResponse.data[0];
              // Ensure apiScenarios.publicEndpoint.expectedResponseStructure is defined in your apiData.js
              // and matches the structure of a single item from the /products endpoint.
              const expectedStructure = apiScenarios.publicEndpoint.expectedResponseStructure;
              
              if (!expectedStructure) {
                logger.warn("⚠️ No se encontró expectedResponseStructure para publicEndpoint en apiData.js. Omitiendo validación de estructura.");
                test.skip(true, "expectedResponseStructure no definida.");
                return;
              }

              const result = compareData(firstItem, expectedStructure);
              if (result !== true) {
                logger.error("❌ Errores en la estructura del primer elemento:", result);
              } else {
                logger.info("✅ La estructura del primer elemento es correcta");
              }
              expect(result).toBe(true);

              // Log sorted version of the first item for review
              const sortedItem = sortKeys(firstItem);
              logger.info("📑 Primer elemento de la respuesta (ordenado):", JSON.stringify(sortedItem, null, 2));

            } else {
              logger.warn("⚠️ No hay datos (elementos en el array) para validar la estructura.");
              // Depending on requirements, you might want to fail the test if data is expected
              // For now, it just logs a warning if the array is empty.
            }
          });
  });     
});