const { test, expect } = require('@playwright/test');
const { get } = require('../clients/apiClient');
const logger = require('../utils/logger');
const { compareData } = require('../utils/comparisonUtils');
const apiScenarios = require('../data/apiData');
const { sortKeys } = require('../utils/sortKeys');
const { allure: allureApi } = require('allure-playwright'); // Modificado para acceder a la API correcta

// --- Inicio del código de depuración ---
// console.log('Objeto allureApi importado:', allureApi);
// if (allureApi) {
//   console.log('¿Tiene allureApi la propiedad "step"?', allureApi.hasOwnProperty('step'));
//   console.log('Tipo de allureApi.step:', typeof allureApi.step);
// }
// --- Fin del código de depuración ---

test.describe('Pruebas de API para endpoint público', () => {
    let apiResponse;
  
    test.beforeAll(async () => {
      // Mover las llamadas de Allure aquí
      allureApi.epic('API Pública');
      allureApi.feature('Endpoint de Posts');
      allureApi.story('Obtención de Posts');

      await test.step("🔸 Iniciar suite y obtener respuesta de la API", async () => {
        logger.info('🔸 Iniciando suite de pruebas de API para endpoint público');
        apiResponse = await get(apiScenarios.publicEndpoint.endpoint);
        logger.info('✅ Respuesta de la API recibida:', {
          status: apiResponse.status,
          dataSummary: typeof apiResponse.data === 'object' && apiResponse.data !== null ? 'Object received' : typeof apiResponse.data
        });
        allureApi.attachment('API Response (Summary)', JSON.stringify({ status: apiResponse.status, dataSummary: typeof apiResponse.data === 'object' && apiResponse.data !== null ? 'Object received' : typeof apiResponse.data }, null, 2), 'application/json');
        if (apiResponse && apiResponse.data) {
          allureApi.attachment('API Response (Full Data)', JSON.stringify(apiResponse.data, null, 2), 'application/json');
        }
      });
    });

    test('Debería obtener una respuesta exitosa (código 200)', async () => {
        allureApi.description('Este test verifica que el endpoint público devuelve un código de estado 200.');
        allureApi.severity('Critical'); // SEVERITY.CRITICAL si usas la importación directa de allure-js-commons
        await test.step("🔍 Validar código de estado 200", async () => {
          logger.info('🔍 Validando código de estado...');
          expect(apiResponse.status).toBe(200);
          logger.info('✅ Código de estado es 200');
        });
    });

    test('Debería validar que se devuelven datos y su estructura', async () => {
        allureApi.description('Este test verifica la presencia de datos y la correcta estructura del objeto de respuesta.');
        allureApi.severity('Critical'); // SEVERITY.CRITICAL si usas la importación directa de allure-js-commons
        await test.step("📝 Validar presencia y tipo de datos en la respuesta", async () => {
          expect(apiResponse.data).toBeDefined();
          expect(typeof apiResponse.data).toBe('object'); 
          expect(apiResponse.data).not.toBeNull(); 
          logger.info('✅ Datos presentes en la respuesta y es un objeto.');
        });

        await test.step("🔎 Validar estructura del objeto de la respuesta", async () => {
            if (apiResponse.data && typeof apiResponse.data === 'object') {
              const responseData = apiScenarios.publicEndpoint.endpoint.endsWith('/1') ? apiResponse.data : (Array.isArray(apiResponse.data) ? apiResponse.data[0] : apiResponse.data);
              
              if (!responseData) {
                const errorMsg = "❌ No hay datos en la respuesta para validar la estructura (o el primer elemento del array está vacío).";
                logger.error(errorMsg);
                allureApi.attachment('Error de Datos', errorMsg, 'text/plain');
                expect(responseData).toBeDefined(); 
                return;
              }

              const expectedStructure = apiScenarios.publicEndpoint.expectedResponseStructure;
              
              if (!expectedStructure) {
                const warnMsg = "⚠️ No se encontró expectedResponseStructure para publicEndpoint en apiData.js. Omitiendo validación de estructura.";
                logger.warn(warnMsg);
                allureApi.attachment('Advertencia de Estructura', warnMsg, 'text/plain');
                test.skip(true, "expectedResponseStructure no definida.");
                return;
              }

              const result = compareData(responseData, expectedStructure);
              if (result !== true) {
                logger.error("❌ Errores en la estructura del objeto:", result);
                allureApi.attachment('Errores de Estructura', JSON.stringify(result, null, 2), 'application/json');
              } else {
                logger.info("✅ La estructura del objeto es correcta");
              }
              expect(result).toBe(true);

              const sortedItem = sortKeys(responseData);
              logger.info("📑 Objeto de la respuesta (ordenado):", JSON.stringify(sortedItem, null, 2));
              allureApi.attachment('Objeto de Respuesta Ordenado', JSON.stringify(sortedItem, null, 2), 'application/json');

            } else {
              const warnMsg = "⚠️ No hay datos (objeto) para validar la estructura.";
              logger.warn(warnMsg);
              allureApi.attachment('Advertencia de Datos', warnMsg, 'text/plain');
              expect(apiResponse.data).toBeDefined();
              expect(typeof apiResponse.data).toBe('object');
              expect(apiResponse.data).not.toBeNull();
            }
          });
  });     
});