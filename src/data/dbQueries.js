const dbQueries = {
  // Consulta 1: Obtener un usuario por su ID
  getUserById: `
      SELECT id, name, email
      FROM users
      WHERE id = $1;
    `,

  // Consulta 2: Insertar un nuevo usuario
  insertUser: `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email;
    `,

  // Consulta 3: Actualizar un usuario existente
  updateUser: `
      UPDATE users
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING id, name, email;
    `,

  // Consulta 4: Eliminar un usuario por su ID
  deleteUser: `
      DELETE FROM users
      WHERE id = $1;
    `,
  
  // Nueva Consulta: Obtener todos los planes de cargos
  getChargePlan: `
      SELECT id, company_id, "name", description, "enable", active, created_at, updated_at, origin
      FROM public.dhx_charge_plan;
    `
};

module.exports = dbQueries;