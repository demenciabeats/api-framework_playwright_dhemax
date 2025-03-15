const { test, expect } = require('@playwright/test');
const { connect, executeQuery, disconnect } = require('../clients/dbClient');
const dbQueries = require('../data/dbQueries');

test.describe('Pruebas de consulta de Charge Plan', () => {

  test.beforeAll(async () => {
    await test.step("🔌 Conectar a la base de datos", async () => {
      await connect();
      console.log("✅ Conectado a la base de datos");
    });
  });

  test.afterAll(async () => {
    await test.step("🔌 Desconectar de la base de datos", async () => {
      await disconnect();
      console.log("✅ Desconectado de la base de datos");
    });
  });

  test('Obtener todos los Planes de Cargos', async () => {
    await test.step("🚀 Ejecutar query getChargePlan sin parámetros", async () => {
      const result = await executeQuery(dbQueries.getChargePlan, []);
      console.log("📑 Resultado de Charge Plan:", result);

      await test.step("📝 Validar que el resultado es un arreglo definido", async () => {
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        console.log("✅ El resultado es un arreglo definido");
      });

      await test.step("🔎 Si hay datos, validar propiedades de un Charge Plan", async () => {
        if (result.length > 0) {
          const plan = result[0];
          expect(plan).toHaveProperty('id');
          expect(plan).toHaveProperty('company_id');
          expect(plan).toHaveProperty('name');
          expect(plan).toHaveProperty('description');
          expect(plan).toHaveProperty('enable');
          expect(plan).toHaveProperty('active');
          expect(plan).toHaveProperty('created_at');
          expect(plan).toHaveProperty('updated_at');
          expect(plan).toHaveProperty('origin');
          console.log("✅ El primer Charge Plan contiene todas las propiedades requeridas");
        } else {
          console.warn("⚠️ No se encontraron Charge Plans para validar las propiedades");
        }
      });
    });
  });
});