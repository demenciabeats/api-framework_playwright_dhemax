# API Framework Playwright Dhemax

Este proyecto es un framework para pruebas de API y de base de datos (DB) utilizando Playwright como herramienta de testeo, con informes detallados generados por Allure. A continuación se explica detalladamente cómo usar la lógica del proyecto, construir tests, validar datos, ejecutar las pruebas y generar reportes.

---

## Índice

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Lógica del Proyecto](#lógica-del-proyecto)
  - [Clientes de API y DB](#clientes-de-api-y-db)
  - [Consultas de Base de Datos (dbQueries)](#consultas-de-base-de-datos-dbqueries)
  - [Datos de Prueba (apiData)](#datos-de-prueba-apidata)
  - [Utilidades](#utilidades)
- [Construcción de Tests con Allure](#construcción-de-tests-con-allure)
  - [Principios Básicos](#principios-básicos)
  - [Decoradores de Allure](#decoradores-de-allure)
- [Manual de Usuario del Framework](#manual-de-usuario-del-framework)
  - [Caso de Uso 1: Probar un Endpoint Público (Ej: GET /posts/1)](#caso-de-uso-1-probar-un-endpoint-público-ej-get-posts1)
  - [Caso de Uso 1.1: Probar un Endpoint Público Genérico (Sin Autenticación)](#caso-de-uso-11-probar-un-endpoint-público-genérico-sin-autenticación)
  - [Caso de Uso 2: Probar un Endpoint con Autenticación (Ej: POST /auth/login)](#caso-de-uso-2-probar-un-endpoint-con-autenticación-ej-post-authlogin)
  - [Caso de Uso 3: Probar Consultas a la Base de Datos](#caso-de-uso-3-probar-consultas-a-la-base-de-datos)
  - [Caso de Uso 4: Flujo Combinado - Crear Recurso (API) y Verificar en DB](#caso-de-uso-4-flujo-combinado---crear-recurso-api-y-verificar-en-db)
  - [Caso de Uso 5: Flujo Combinado - CRUD Completo con Autenticación](#caso-de-uso-5-flujo-combinado---crud-completo-con-autenticación)
- [Ejecución de Tests y Reportes Allure](#ejecución-de-tests-y-reportes-allure)
- [Notas Adicionales](#notas-adicionales)

---

## Requisitos

- **Node.js** (versión >= 18)
- **npm** (gestor de paquetes)

---

## Instalación

1.  Clona el repositorio en tu máquina:
    ```sh
    git clone <URL_DEL_REPOSITORIO>
    ```

2.  Accede a la carpeta del proyecto:
    ```sh
    cd api-framework_playwright_dhemax
    ```

3.  Instala todas las dependencias del proyecto (incluyendo Playwright, Axios, Allure, etc.):
    ```sh
    npm install
    ```
    Esto instalará las dependencias listadas en `package.json`, incluyendo `@playwright/test`, `axios`, `dotenv`, `pg`, `allure-playwright` y `allure-commandline`.

---

## Configuración

Antes de ejecutar las pruebas, asegúrate de configurar las variables de entorno en el archivo `.env` ubicado en la raíz del proyecto. Este archivo es ignorado por Git para proteger información sensible.

Ejemplo de `.env`:
```properties
API_BASE_URL=https://jsonplaceholder.typicode.com/
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
AUTH_REQUIRED=false
AUTH_ENDPOINT=/auth/login
AUTH_USERNAME=mail@dhemax.com
AUTH_PASSWORD=dhemax.123
```

Asegúrate de reemplazar los valores de `API_BASE_URL`, conexión de la base de datos (`DB_*`) y autenticación (`AUTH_*`) según tus necesidades y el entorno contra el que vayas a probar.

---

## Estructura del Proyecto

La estructura principal del proyecto es la siguiente:

```
api-framework_playwright_dhemax/
├── allure-report/             // Informes HTML de Allure generados
├── allure-results/            // Resultados crudos de Allure (JSON, attachments)
├── node_modules/              // Dependencias del proyecto
├── src/
│   ├── clients/
│   │   ├── apiClient.js       // Lógica para hacer peticiones API con axios y gestión de auth
│   │   └── dbClient.js        // Lógica para conectar y realizar consultas en la base de datos
│   ├── data/
│   │   ├── apiData.js         // Datos, endpoints y estructuras esperadas para pruebas API
│   │   └── dbQueries.js       // Sentencias SQL para las consultas a la base de datos
│   ├── tests/
│   │   └── template.spec.js   // Ejemplo de pruebas para API pública con Allure
│   │   └── generic_public_api.spec.js // Plantilla para pruebas genéricas de API pública
│   │   // ... otros archivos .spec.js para diferentes escenarios ...
│   └── utils/
│       ├── comparisonUtils.js // Funciones para comparar datos y validar estructuras
│       ├── logger.js          // Utilitario para registrar información en consola
│       ├── sortKeys.js        // Función para ordenar claves de objetos JSON
│       └── tokenUtils.js      // Lógica para gestionar tokens de autenticación
├── .env                       // Variables de entorno (NO subir a Git)
├── .gitignore                 // Archivos y carpetas ignorados por Git
├── package-lock.json          // Versiones exactas de las dependencias
├── package.json               // Gestión de dependencias y scripts
├── playwright.config.js       // Configuración de Playwright (incluye reporter Allure)
└── README.md                  // Este archivo
```

---

## Lógica del Proyecto

### Clientes de API y DB

-   **API Client (`src/clients/apiClient.js`):**
    Configura un cliente `axios` con una `baseURL` (obtenida de `process.env.API_BASE_URL`) y cabeceras por defecto. Provee métodos asíncronos (`get`, `post`, `put`, `del`) para realizar peticiones HTTP. Si la variable de entorno `AUTH_REQUIRED` está configurada como `true`, el cliente intentará obtener y adjuntar un token de autenticación automáticamente antes de realizar las peticiones. La lógica de autenticación se apoya en `src/utils/tokenUtils.js`.

-   **DB Client (`src/clients/dbClient.js`):**
    Gestiona la conexión a una base de datos PostgreSQL utilizando los parámetros definidos en el archivo `.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). Proporciona funciones para `connect`, `disconnect` y `executeQuery(query, params)` para interactuar con la base de datos.

### Consultas de Base de Datos (dbQueries)

-   **Archivo:** `src/data/dbQueries.js`
    Almacena las sentencias SQL como strings. Estas consultas pueden ser parametrizadas y se utilizan junto con `dbClient.js` para obtener o modificar datos en la base de datos.

### Datos de Prueba (apiData)

-   **Archivo:** `src/data/apiData.js`
    Define escenarios de prueba para la API. Cada escenario incluye el `endpoint`, el `method` HTTP y, crucialmente, la `expectedResponseStructure`. Esta estructura utiliza los matchers de Playwright (`expect.any(String)`, `expect.any(Number)`, etc.) para facilitar la validación de los tipos de datos en las respuestas de la API mediante `comparisonUtils.js`.

### Utilidades

-   **Logger (`src/utils/logger.js`):**
    Proporciona funciones (`info`, `error`, `warn`) para registrar mensajes en la consola de forma estandarizada, utilizando `chalk` para dar color y mejorar la legibilidad.

-   **SortKeys (`src/utils/sortKeys.js`):**
    Ofrece una función para ordenar alfabéticamente las claves de un objeto JSON de manera recursiva. Útil para comparar objetos o para mostrar datos de forma consistente.

-   **Comparison Utils (`src/utils/comparisonUtils.js`):**
    La función principal `compareData(received, expected)` compara un objeto recibido (ej: respuesta de API) con una estructura esperada (definida en `apiData.js`). Devuelve `true` si la estructura y los tipos de datos coinciden, o un array de errores si hay discrepancias.

-   **Token Utils (`src/utils/tokenUtils.js`):**
    Centraliza la lógica para obtener un token de autenticación. Actualmente, realiza una petición POST al `AUTH_ENDPOINT` con las credenciales `AUTH_USERNAME` y `AUTH_PASSWORD` del `.env`. El token obtenido se utiliza por el `apiClient.js`.

---

## Construcción de Tests con Allure

Los tests se encuentran en la carpeta `src/tests` y utilizan la sintaxis de Playwright (`test.describe`, `test`, `expect`). La integración con Allure permite enriquecer estos tests con metadatos para generar informes más comprensibles.

### Principios Básicos

1.  **Organización:** Agrupa tests relacionados en un mismo archivo `.spec.js` usando `test.describe`.
2.  **Pasos Claros:** Divide la lógica de cada test en pasos lógicos usando `allure.step()`.
3.  **Validaciones Precisas:** Usa `expect` de Playwright para las aserciones.
4.  **Reutilización:** Utiliza los clientes (`apiClient`, `dbClient`) y utilidades (`compareData`, `logger`) para mantener los tests concisos y DRY (Don't Repeat Yourself).

### Decoradores de Allure

Importa `allure` desde `allure-playwright` en tus archivos de test:
`const allure = require('allure-playwright');` (o `import allure from 'allure-playwright';` si usas módulos ES).

Funciones comunes de Allure:
-   `allure.step("Nombre del paso", async () => { /* código del paso */ })`: Define un paso de prueba. Los pasos se anidan en el informe.
-   `allure.description("Descripción detallada del test.")`: Añade una descripción al test.
-   `allure.severity(allure.SEVERITY.CRITICAL)`: Define la severidad (BLOCKER, CRITICAL, NORMAL, MINOR, TRIVIAL).
-   `allure.epic("Épica a la que pertenece el test")`, `allure.feature("Funcionalidad probada")`, `allure.story("Historia de usuario")`: Categorizan los tests.
-   `allure.attachment("Nombre del adjunto", contenido, tipo)`: Adjunta datos al informe (ej: JSON de request/response, screenshots, logs).
    -   Tipos comunes: `'application/json'`, `'text/plain'`, `'image/png'`.
-   `allure.link(url, nombre, tipo)`: Enlaza a URLs externas (ej: JIRA, TMS). Tipos: `issue`, `tms`.
-   `allure.issue(id, nombre)`: Atajo para `allure.link` de tipo `issue`.
-   `allure.tms(id, nombre)`: Atajo para `allure.link` de tipo `tms`.

---

## Manual de Usuario del Framework

Esta sección describe cómo utilizar el framework para diferentes escenarios de prueba.

### Caso de Uso 1: Probar un Endpoint Público (Ej: GET /posts/1)

**Objetivo:** Verificar que un endpoint público responde correctamente y que la estructura de datos es la esperada.

**Pasos:**

1.  **Definir el escenario en `src/data/apiData.js`:**
    ```javascript
    const { expect } = require('@playwright/test');

    const apiScenarios = {
      publicEndpointById: {
        endpoint: '/posts/1',
        method: 'GET',
        expectedResponseStructure: {
          userId: expect.any(Number),
          id: expect.any(Number),
          title: expect.any(String),
          body: expect.any(String)
        }
      },
    };

    module.exports = apiScenarios;
    ```

2.  **Crear/Modificar el archivo de test (ej: `src/tests/template.spec.js`):**
    ```javascript
    const { test, expect } = require('@playwright/test');
    const allure = require('allure-playwright');
    const { get } = require('../clients/apiClient');
    const logger = require('../utils/logger');
    const { compareData } = require('../utils/comparisonUtils');
    const apiScenarios = require('../data/apiData');
    const { sortKeys } = require('../utils/sortKeys');

    test.describe('Pruebas de API para Endpoint Público Específico', () => {
      let apiResponse;
      const scenario = apiScenarios.publicEndpointById;

      test.beforeAll(async () => {
        allure.epic('API Pública');
        allure.feature('Posts');
        allure.story('Obtener un Post específico');

        await test.step(`🔸 [${scenario.method}] ${scenario.endpoint} - Obtener Post por ID`, async () => {
          logger.info(`Iniciando prueba para ${scenario.endpoint}`);
          try {
            apiResponse = await get(scenario.endpoint);
            allure.attachment('API Response (Full Data)', JSON.stringify(apiResponse.data, null, 2), 'application/json');
            logger.info('Respuesta recibida:', { status: apiResponse.status });
          } catch (error) {
            logger.error('Error al obtener respuesta de la API:', error.message);
            allure.attachment('API Error', JSON.stringify(error.response?.data || error.message, null, 2), 'application/json');
            throw error;
          }
        });
      });

      test('Debería obtener una respuesta exitosa (código esperado)', async () => {
        const expectedStatusCode = scenario.expectedStatusCode || 200;
        allure.description(`Verifica que el endpoint devuelve un código de estado ${expectedStatusCode}.`);
        allure.severity('Critical');
        await test.step(`🔍 Validar código de estado ${expectedStatusCode}`, async () => {
          expect(apiResponse.status).toBe(expectedStatusCode);
          logger.info(`Código de estado es ${apiResponse.status}`);
        });
      });

      test('Debería validar la estructura del post y el ID', async () => {
        allure.description('Verifica la estructura del post y que el ID sea el esperado.');
        allure.severity('Critical');
        await test.step("📝 Validar presencia y tipo de datos", async () => {
          expect(apiResponse.data).toBeDefined();
          expect(typeof apiResponse.data).toBe('object');
          logger.info('Datos presentes y es un objeto.');
        });

        await test.step("🔎 Validar estructura del post", async () => {
          const result = compareData(apiResponse.data, scenario.expectedResponseStructure);
          if (result !== true) {
            logger.error("Errores en la estructura:", result);
            allure.attachment('Errores de Estructura', JSON.stringify(result, null, 2), 'application/json');
          }
          expect(result).toBe(true);
          logger.info('Estructura del post es correcta.');
          
          const sortedItem = sortKeys(apiResponse.data);
          logger.info("📑 Objeto de la respuesta (ordenado):", JSON.stringify(sortedItem, null, 2));
          allure.attachment('Objeto de Respuesta Ordenado', JSON.stringify(sortedItem, null, 2), 'application/json');
        });

        await test.step("🆔 Validar que el ID del post es el esperado por el escenario", async () => {
          if (scenario.endpoint.includes('/posts/')) {
             const expectedId = parseInt(scenario.endpoint.split('/').pop());
             expect(apiResponse.data.id).toBe(expectedId);
             logger.info(`El ID del post es ${expectedId}, como se esperaba.`);
          }
        });
      });
    });
    ```

### Caso de Uso 1.1: Probar un Endpoint Público Genérico (Sin Autenticación)

**Objetivo:** Utilizar una plantilla de prueba genérica para verificar cualquier endpoint público (GET, POST, etc., sin autenticación), su código de estado y, opcionalmente, la estructura de su respuesta.

**Pasos:**

1.  **Crear el archivo de test genérico `src/tests/generic_public_api.spec.js`:**
    Copia el contenido de la plantilla proporcionada anteriormente en este archivo. La plantilla está diseñada para leer una configuración de escenario desde `apiData.js`.

2.  **Definir el escenario en `src/data/apiData.js`:**
    Debes crear una entrada en el objeto `apiScenarios` con un nombre único. Este nombre se usará en la constante `SCENARIO_NAME` dentro de `generic_public_api.spec.js`.

    Ejemplo para un endpoint `GET /users/2`:
    ```javascript
    genericGetUserById: {
      endpoint: '/users/2',
      method: 'GET',
      expectedStatusCode: 200,
      expectedResponseStructure: {
        id: expect.any(Number),
        name: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
      }
    },
    ```

    Ejemplo para un endpoint `GET /comments` que devuelve un array:
    ```javascript
    genericGetCommentsList: {
      endpoint: '/comments',
      method: 'GET',
      expectedStatusCode: 200,
      expectedResponseStructure: [
        {
          postId: expect.any(Number),
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          body: expect.any(String)
        }
      ]
    },
    ```

    Ejemplo para un endpoint `POST /posts` (sin autenticación en este ejemplo):
    ```javascript
    genericCreatePost: {
      endpoint: '/posts',
      method: 'POST',
      payload: {
        title: 'foo',
        body: 'bar',
        userId: 1
      },
      expectedStatusCode: 201,
      expectedResponseStructure: {
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
        userId: expect.any(Number)
      }
    },
    ```

3.  **Configurar `SCENARIO_NAME` en `src/tests/generic_public_api.spec.js`:**
    Abre `src/tests/generic_public_api.spec.js` y modifica la constante `SCENARIO_NAME` para que coincida con la clave del escenario que definiste en `apiData.js`.
    ```javascript
    const SCENARIO_NAME = 'genericGetUserById';
    ```

4.  **Ejecutar el test genérico:**
    ```sh
    npx playwright test src/tests/generic_public_api.spec.js
    ```

### Caso de Uso 2: Probar un Endpoint con Autenticación (Ej: POST /auth/login)

**Objetivo:** Verificar que un endpoint con autenticación responde correctamente y que la estructura de datos es la esperada.

**Pasos:** (similar al Caso de Uso 1, pero con autenticación)

---

## Ejecución de Tests y Reportes Allure

Los scripts para ejecutar tests y generar reportes Allure están definidos en `package.json`:

1.  **Ejecutar todos los tests y generar reporte Allure:**
    ```sh
    npm run test:allure
    ```

2.  **Ejecutar solo los tests (Playwright):**
    ```sh
    npm run test
    ```

3.  **Ejecutar un archivo de test específico:**
    ```sh
    npx playwright test src/tests/template.spec.js
    ```

4.  **Generar el reporte Allure (después de ejecutar tests):**
    ```sh
    npm run allure:generate
    ```

5.  **Abrir el último reporte Allure generado:**
    ```sh
    npm run allure:open
    ```

6.  **Ver el reporte HTML de Playwright:**
    ```sh
    npx playwright show-report test-results/html
    ```

---

## Notas Adicionales

-   **Variables de Entorno:** Es crucial tener el archivo `.env` correctamente configurado.
-   **Desarrollo de Nuevos Tests:**
    -   Crea nuevos archivos `.spec.js` en `src/tests/`.
    -   Define nuevos escenarios y estructuras esperadas en `src/data/apiData.js`.
    -   Añade nuevas queries SQL en `src/data/dbQueries.js` si es necesario.
    -   Utiliza los decoradores de Allure para enriquecer tus tests.
-   **Playwright Config (`playwright.config.js`):**
    Este archivo define el directorio de tests (`testDir`), timeouts, reintentos, y muy importante, la configuración del reporter de Allure (`allure-playwright`). También incluye `environmentInfo` para el reporte Allure.
-   **Depuración y Logs:**
    -   Utiliza `logger.js` para logs consistentes.
    -   Los adjuntos de Allure (`allure.attachment`) son excelentes para capturar el estado de las requests/responses durante la ejecución.
    -   Puedes usar `console.log` para depuración rápida, pero `logger` es preferible para logs que quieras mantener.

---

Este manual debe cubrir las bases para que puedas entender, utilizar y ampliar el proyecto. Si tienes dudas adicionales o necesitas más ejemplos, revisa cada uno de los archivos y sigue el flujo desde la configuración de variables hasta la ejecución de tests. ¡Buena suerte!