const { test, expect } = require('@playwright/test');
const { get, post, put, del } = require('../clients/apiClient'); // Incluir otros métodos si es necesario
const logger = require('../utils/logger');
const { compareData } = require('../utils/comparisonUtils');
const apiScenarios = require('../data/apiData');
const { sortKeys } = require('../utils/sortKeys');
const { allure: allureApi } = require('allure-playwright');

// --- Configuración del Escenario de Prueba ---
// Cambia 'genericPublicEndpoint' por el nombre del escenario que definas en apiData.js
const SCENARIO_NAME = 'genericPublicEndpoint'; 
// -------------------------------------------

test.describe(`Pruebas de API Genérica para Endpoint Público: ${SCENARIO_NAME}`, () => {
    let apiResponse;
    let scenario; // Para almacenar la configuración del escenario

    test.beforeAll(async () => {
        scenario = apiScenarios[SCENARIO_NAME];
        if (!scenario) {
            throw new Error(`Escenario '${SCENARIO_NAME}' no encontrado en apiData.js. Por favor, defínelo.`);
        }

        allureApi.epic('API Pública Genérica');
        allureApi.feature(`Endpoint: ${scenario.endpoint}`);
        allureApi.story(`Operación: ${scenario.method}`);

        await test.step(`🔸 [${scenario.method}] ${scenario.endpoint} - Obtener y preparar respuesta de la API`, async () => {
            logger.info(`🔸 Iniciando prueba para [${scenario.method}] ${scenario.endpoint}`);
            
            // Determinar el método HTTP a usar
            switch (scenario.method.toUpperCase()) {
                case 'GET':
                    apiResponse = await get(scenario.endpoint);
                    break;
                case 'POST':
                    // Asumir que scenario.payload existe para POST, o ajustar según necesidad
                    apiResponse = await post(scenario.endpoint, scenario.payload || {}); 
                    break;
                // Añadir casos para PUT, DELETE, etc., si es necesario
                // case 'PUT':
                //     apiResponse = await put(scenario.endpoint, scenario.payload || {});
                //     break;
                // case 'DELETE':
                //     apiResponse = await del(scenario.endpoint);
                //     break;
                default:
                    throw new Error(`Método HTTP '${scenario.method}' no soportado en esta plantilla genérica.`);
            }
            
            logger.info('✅ Respuesta de la API recibida:', {
                status: apiResponse.status,
                dataSummary: typeof apiResponse.data === 'object' && apiResponse.data !== null ? (Array.isArray(apiResponse.data) ? `Array[${apiResponse.data.length}]` : 'Object received') : typeof apiResponse.data
            });

            allureApi.attachment('API Request Details', JSON.stringify({ method: scenario.method, endpoint: scenario.endpoint, payload: scenario.payload }, null, 2), 'application/json');
            allureApi.attachment('API Response (Summary)', JSON.stringify({ status: apiResponse.status, dataSummary: typeof apiResponse.data === 'object' && apiResponse.data !== null ? (Array.isArray(apiResponse.data) ? `Array[${apiResponse.data.length}]` : 'Object received') : typeof apiResponse.data }, null, 2), 'application/json');
            
            if (apiResponse && apiResponse.data) {
                allureApi.attachment('API Response (Full Data)', JSON.stringify(apiResponse.data, null, 2), 'application/json');
            }
        });
    });

    test('Debería obtener una respuesta exitosa (código esperado)', async () => {
        const expectedStatusCode = scenario.expectedStatusCode || 200; // Permitir definir código esperado o default 200
        allureApi.description(`Este test verifica que el endpoint devuelve un código de estado ${expectedStatusCode}.`);
        allureApi.severity('Critical');
        await test.step(`🔍 Validar código de estado ${expectedStatusCode}`, async () => {
            logger.info(`🔍 Validando código de estado (esperado: ${expectedStatusCode})...`);
            expect(apiResponse.status).toBe(expectedStatusCode);
            logger.info(`✅ Código de estado es ${apiResponse.status}`);
        });
    });

    test('Debería validar que se devuelven datos y su estructura (si aplica)', async () => {
        allureApi.description('Este test verifica la presencia de datos y la correcta estructura de la respuesta.');
        allureApi.severity('Critical');

        if (!scenario.expectedResponseStructure) {
            logger.info("ℹ️ No se ha definido 'expectedResponseStructure' para este escenario. Omitiendo validación de estructura.");
            allureApi.description('Este test verifica la presencia de datos. La validación de estructura se omite por no estar definida.');
            test.skip(true, "Validación de estructura no definida en apiData.js para este escenario.");
            return;
        }
        
        await test.step("📝 Validar presencia y tipo de datos en la respuesta", async () => {
            expect(apiResponse.data).toBeDefined();
            // Ajustar si la respuesta esperada no es siempre un objeto (ej. un array directamente)
            // expect(typeof apiResponse.data).toBe('object'); 
            // expect(apiResponse.data).not.toBeNull(); 
            logger.info('✅ Datos presentes en la respuesta.');
        });

        await test.step("🔎 Validar estructura de la respuesta", async () => {
            // Determinar si la respuesta es un array o un objeto para la validación
            let dataToValidate;
            if (Array.isArray(scenario.expectedResponseStructure) && Array.isArray(apiResponse.data)) {
                // Si se espera un array y se recibe un array, validar el primer elemento o cada elemento
                // Por simplicidad, aquí validamos el primer elemento si existe.
                // Se podría extender para validar cada elemento del array.
                if (apiResponse.data.length === 0 && scenario.expectedResponseStructure.length > 0) {
                     const errorMsg = "❌ Se esperaba un array con elementos, pero se recibió un array vacío.";
                     logger.error(errorMsg);
                     allureApi.attachment('Error de Datos', errorMsg, 'text/plain');
                     expect(apiResponse.data.length).toBeGreaterThan(0);
                     return;
                }
                dataToValidate = apiResponse.data.length > 0 ? apiResponse.data[0] : {}; // Validar el primer item o un objeto vacío si el array está vacío
                // La estructura esperada debería ser la estructura del objeto DENTRO del array
                // ej: expectedResponseStructure: [{ id: expect.any(Number), ... }]
                // entonces scenario.expectedResponseStructure[0] sería la estructura del objeto.
                if (!Array.isArray(scenario.expectedResponseStructure) || scenario.expectedResponseStructure.length === 0) {
                    const errorMsg = "❌ 'expectedResponseStructure' está definido como un array pero está vacío o no es un array de estructuras.";
                    logger.error(errorMsg);
                    allureApi.attachment('Error de Configuración', errorMsg, 'text/plain');
                    throw new Error(errorMsg);
                }
                scenario.expectedResponseStructure = scenario.expectedResponseStructure[0];

            } else if (typeof scenario.expectedResponseStructure === 'object' && typeof apiResponse.data === 'object') {
                dataToValidate = apiResponse.data;
            } else {
                const errorMsg = "⚠️ El tipo de 'apiResponse.data' y 'expectedResponseStructure' no coinciden o no son objetos/arrays para la validación estructural.";
                logger.warn(errorMsg);
                allureApi.attachment('Advertencia de Tipos', errorMsg, 'text/plain');
                // Podrías fallar aquí o simplemente no validar la estructura si los tipos no son los esperados para la comparación.
                // Por ahora, solo se loguea y se continúa, lo que podría llevar a un error en compareData.
                // Considera añadir un expect() aquí si esto debe ser un fallo.
                expect(typeof apiResponse.data).toEqual(typeof scenario.expectedResponseStructure); // Fallará si los tipos base no coinciden
                dataToValidate = apiResponse.data; // Intentar validar de todas formas
            }
            
            if (!dataToValidate && scenario.expectedResponseStructure) { // Si dataToValidate es undefined/null pero se esperaba estructura
                const errorMsg = "❌ No hay datos válidos para validar la estructura, pero se esperaba una.";
                logger.error(errorMsg);
                allureApi.attachment('Error de Datos', errorMsg, 'text/plain');
                expect(dataToValidate).toBeDefined(); 
                return;
            }
            
            // Si no hay datos ni estructura esperada, no hay nada que hacer.
            if (!dataToValidate && !scenario.expectedResponseStructure) {
                 logger.info("ℹ️ No hay datos en la respuesta ni estructura esperada. Omitiendo validación de estructura.");
                 return;
            }


            const result = compareData(dataToValidate, scenario.expectedResponseStructure);
            if (result !== true) {
                logger.error("❌ Errores en la estructura de la respuesta:", result);
                allureApi.attachment('Errores de Estructura', JSON.stringify(result, null, 2), 'application/json');
            } else {
                logger.info("✅ La estructura de la respuesta es correcta");
            }
            expect(result).toBe(true);

            if (dataToValidate) {
                const sortedItem = sortKeys(dataToValidate);
                logger.info("📑 Respuesta (ordenada):", JSON.stringify(sortedItem, null, 2));
                allureApi.attachment('Respuesta Ordenada', JSON.stringify(sortedItem, null, 2), 'application/json');
            }
        });
    });     
});