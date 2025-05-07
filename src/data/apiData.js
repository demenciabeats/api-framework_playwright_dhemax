const { expect } = require('@playwright/test');

const apiScenarios = {
  publicEndpoint: {
    endpoint: '/posts', // Assuming this endpoint might now return a single post object or /posts/1 for a specific post
    method: 'GET',
    // This structure is for a single post object
    expectedResponseStructure: {
      userId: expect.any(Number),
      id: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String)
    }
  },

  genericPublicEndpoint: {
    endpoint: '/users/2', // Cambia esto al endpoint que quieras probar
    method: 'GET',        // GET, POST, PUT, DELETE, etc.
    // payload: { key: 'value' }, // Solo si es POST o PUT y requiere un cuerpo
    expectedStatusCode: 200, // Opcional, por defecto es 200
    expectedResponseStructure: { // Define la estructura esperada
      id: expect.any(Number),
      name: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
      address: {
        street: expect.any(String),
        suite: expect.any(String),
        city: expect.any(String),
        zipcode: expect.any(String),
        geo: {
          lat: expect.any(String),
          lng: expect.any(String)
        }
      },
      phone: expect.any(String),
      website: expect.any(String),
      company: {
        name: expect.any(String),
        catchPhrase: expect.any(String),
        bs: expect.any(String)
      }
    }
  },

  genericPublicListEndpoint: {
    endpoint: '/comments',
    method: 'GET',
    expectedStatusCode: 200,
    // Para arrays, la estructura esperada es un array con UN objeto modelo
    expectedResponseStructure: [ 
      {
        postId: expect.any(Number),
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        body: expect.any(String)
      }
    ]
  }
};

module.exports = apiScenarios;