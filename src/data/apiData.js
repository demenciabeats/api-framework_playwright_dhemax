const { expect } = require('@playwright/test');
const apiScenarios = {
    // Escenario 1: Obtener información de un usuario
    getUser: {
      endpoint: '/users/1',
      method: 'GET',
      expectedResponse: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    },
  
    // Escenario 2: Crear un nuevo usuario
    createUser: {
      endpoint: '/users',
      method: 'POST',
      requestBody: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      },
      expectedResponse: {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      },
    },
  
    // Escenario 3: Actualizar un usuario existente
    updateUser: {
      endpoint: '/users/1',
      method: 'PUT',
      requestBody: {
        name: 'John Updated',
        email: 'john.updated@example.com',
      },
      expectedResponse: {
        id: 1,
        name: 'John Updated',
        email: 'john.updated@example.com',
      },
    },
  
    // Escenario 4: Eliminar un usuario
    deleteUser: {
      endpoint: '/users/1',
      method: 'DELETE',
      expectedResponse: {}, // Respuesta esperada después de eliminar
    },
    publicEndpoint: {
      endpoint: '/products',
      method: 'GET',
      expectedResponse: {
        success: expect.any(Boolean),
        data: {
          service: expect.any(String),
          version: expect.any(String),
          items: expect.any(Array)
        }
      },
      // Estructura que se espera recibir de la API para cada producto.
      expectedResponseStructure: {
        category: expect.any(String),
        description: expect.any(String),
        id: expect.any(Number),
        image: expect.any(String),
        price: expect.any(Number),
        rating: {
          count: expect.any(Number),
          rate: expect.any(Number)
        },
        title: expect.any(String)
      }
    },
    authEndpoint: {
      endpoint: '/api/auth/login',
      method: 'POST',
      // Estructura esperada para el token de autenticación
      expectedResponseStructure: {
        access_token: expect.any(String),
        message: expect.any(String)
      }
    }
  };
  
  module.exports = apiScenarios;