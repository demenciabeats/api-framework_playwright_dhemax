const { test, expect } = require('@playwright/test');
const { connect, executeQuery, disconnect } = require('../clients/dbClient');
const dbQueries = require('../data/dbQueries');
const logger = require('../utils/logger');

test.describe('Prueba de query parametrizada', () => {

  test.beforeAll(async () => {
    await test.step("🔌 Conectar a la base de datos", async () => {
      await connect();
      logger.info("🔌 Conectado a la base de datos");
    });
  });

  test.afterAll(async () => {
    await test.step("🔌 Desconectar de la base de datos", async () => {
      await disconnect();
      logger.info("🔌 Desconectado de la base de datos");
    });
  });

  test('Obtener usuario por ID', async () => {
    await test.step("⚙️ Ejecutar query getUserById con parámetro", async () => {
      const userId = 1; // Define el parámetro deseado
      const result = await executeQuery(dbQueries.getUserById, [userId]);
      console.log("📑 Resultado de getUserById:", result);

      await test.step("📝 Validar respuesta de getUserById", async () => {
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        if (result.length > 0) {
          const user = result[0];
          expect(user).toHaveProperty('id', userId);
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('email');
          console.log("✅ El usuario fue obtenido correctamente");
        } else {
          console.warn("⚠️ No se encontró usuario con ID:", userId);
        }
      });
    });
  });
});