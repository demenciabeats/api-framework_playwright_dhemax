const { test, expect } = require('@playwright/test');
const dbQueries = require('../data/dbQueries');

test.describe('Validación de Queries DB', () => {
  test('getUserById debe estar definida y contener SELECT', async () => {
    await test.step("📄 Validar definición y contenido de SELECT en getUserById", async () => {
      expect(dbQueries.getUserById).toBeDefined();
      expect(typeof dbQueries.getUserById).toBe('string');
      expect(dbQueries.getUserById).toMatch(/SELECT/i);
      console.log("✅ getUserById definida correctamente y contiene SELECT");
    });
  });

  test('insertUser debe estar definida y contener INSERT INTO', async () => {
    await test.step("📄 Validar definición y contenido de INSERT INTO en insertUser", async () => {
      expect(dbQueries.insertUser).toBeDefined();
      expect(typeof dbQueries.insertUser).toBe('string');
      expect(dbQueries.insertUser).toMatch(/INSERT INTO/i);
      console.log("✅ insertUser definida correctamente y contiene INSERT INTO");
    });
  });

  test('updateUser debe estar definida y contener UPDATE', async () => {
    await test.step("📄 Validar definición y contenido de UPDATE en updateUser", async () => {
      expect(dbQueries.updateUser).toBeDefined();
      expect(typeof dbQueries.updateUser).toBe('string');
      expect(dbQueries.updateUser).toMatch(/UPDATE/i);
      console.log("✅ updateUser definida correctamente y contiene UPDATE");
    });
  });

  test('deleteUser debe estar definida y contener DELETE', async () => {
    await test.step("📄 Validar definición y contenido de DELETE en deleteUser", async () => {
      expect(dbQueries.deleteUser).toBeDefined();
      expect(typeof dbQueries.deleteUser).toBe('string');
      expect(dbQueries.deleteUser).toMatch(/DELETE/i);
      console.log("✅ deleteUser definida correctamente y contiene DELETE");
    });
  });
});