# API Framework Playwright DHEmax

Este proyecto es un framework para pruebas de API y de base de datos (DB) utilizando Playwright como herramienta de testeo. A continuación se explica detalladamente cómo usar la lógica del proyecto, construir tests, validar datos y ejecutar las pruebas.

---

## Índice

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Lógica del Proyecto](#lógica-del-proyecto)
  - [Clientes de API y DB](#clientes-de-api-y-db)
  - [Consultas de Base de Datos (dbQueries)](#consultas-de-base-de-datos-dbqueries)
  - [Utilidades](#utilidades)
- [Construcción de Tests](#construcción-de-tests)
  - [Tests de API](#tests-de-api)
  - [Tests de Autenticación](#tests-de-autenticación)
  - [Tests Adicionales](#tests-adicionales)
- [Ejecución de Tests](#ejecución-de-tests)
- [Notas Adicionales](#notas-adicionales)

---

## Requisitos

- **Node.js** (versión >= 18)
- **npm** (gestor de paquetes)
- **Playwright** instalado (se recomienda instalar las dependencias mediante `npm install`)

---

## Instalación

1. Clona el repositorio en tu máquina:
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Accede a la carpeta del proyecto:
   ```sh
   cd d:\Development\Automation_Playwright\api-framework_playwright_dhemax
   ```

3. Instala las dependencias:
   ```sh
   npm install
   ```

---

## Configuración

Antes de ejecutar las pruebas, asegúrate de configurar las variables de entorno en el archivo `.env` ubicado en la raíz del proyecto.

Ejemplo de `.env`:
```properties
API_BASE_URL=https://fakestoreapi.com
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
AUTH_REQUIRED=false
AUTH_ENDPOINT=/auth/login
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
```

Asegúrate de reemplazar los valores de conexión de la base de datos y autenticación según tus necesidades.

---

## Estructura del Proyecto

La estructura principal del proyecto es la siguiente:

```
├── clients/
│   ├── apiClient.js         // Lógica para hacer peticiones API con axios
│   └── dbClient.js          // Lógica para conectar y realizar consultas en la base de datos
├── data/
│   ├── apiData.js           // Datos y endpoints para las pruebas de API (incluye estructuras esperadas)
│   └── dbQueries.js         // Sentencias SQL para las consultas a la base de datos
├── src/
│   ├── tests/
│   │   ├── test.spec.js     // Pruebas para la API pública
│   │   ├── auth.spec.js     // Pruebas del endpoint de autenticación
│   │   ├── extra.spec.js    // Tests adicionales
│   │   └── dbQueries.spec.js// Pruebas unitarias para las consultas DB
│   └── utils/
│       ├── comparisonUtils.js // Funciones para comparar datos y validar estructuras
│       ├── logger.js          // Utilitario para registrar la información en consola
│       ├── sortKeys.js        // Función para ordenar claves de objetos JSON
│       └── tokenUtils.js      // Lógica para gestionar tokens de autenticación
├── test-results/            // Resultado de la ejecución de las pruebas (HTML y output)
├── playwright.config.js     // Configuración de Playwright
└── package.json             // Gestión de dependencias y scripts
```

---

## Lógica del Proyecto

### Clientes de API y DB

- **API Client (`src/clients/apiClient.js`):**  
  Configura un cliente axios con una URL base y cabeceras apropiadas. Se proveen métodos `get`, `post`, `put` y `del` para realizar peticiones. Si `AUTH_REQUIRED` está configurado, se gestiona la autenticación a través de la función `login` en `tokenUtils.js`.

- **DB Client (`src/clients/dbClient.js`):**  
  (Si está implementado) Se conecta a la base de datos usando los parámetros en `.env` y ejecuta las consultas definidas en `dbQueries.js`.

### Consultas de Base de Datos (dbQueries)

- **Archivo:** `src/data/dbQueries.js`  
  Contiene sentencias SQL para operaciones comunes como `SELECT`, `INSERT`, `UPDATE` y `DELETE`. Estas sentencias se validan mediante tests.

### Utilidades

- **Logger (`src/utils/logger.js`):**  
  Permite registrar información y mensajes de log en consola para facilitar el debugging.

- **SortKeys (`src/utils/sortKeys.js`):**  
  Función recursiva para ordenar las claves de objetos y arrays de forma alfabética, ideal para comparar o imprimir el JSON de forma estructurada.

- **Comparison Utils (`src/utils/comparisonUtils.js`):**  
  Funciones que permiten comparar datos y validar que la estructura recibida cumpla con la definida mediante validadores (por ejemplo, `expect.any(String)`).

- **Token Utils (`src/utils/tokenUtils.js`):**  
  Maneja la autenticación y la gestión de tokens de acceso.

---

## Construcción de Tests

Los tests se encuentran organizados en la carpeta `src/tests` y se dividen en distintos archivos según el escenario:

### Tests de API

- **Archivo:** `src/tests/test.spec.js`  
  En este test se realizan peticiones a la API pública mediante el método `get`. Se valida el código de estado, la presencia y el orden de los datos, y se compara la estructura del primer elemento con la definida en `apiData.js`.  
  La estructura esperada se define centralizadamente en `src/data/apiData.js`, en el objeto `apiScenarios.publicEndpoint.expectedResponseStructure`.

### Tests de Autenticación

- **Archivo:** `src/tests/auth.spec.js`  
  Estas pruebas realizan un POST al endpoint de autenticación y validan la recepción de un token (y otros posibles datos) acorde a la estructura definida en `apiData.js` dentro de `apiScenarios.authEndpoint.expectedResponseStructure`.

### Tests Adicionales

- **Archivo:** `src/tests/extra.spec.js`  
  Tests adicionales que pueden incluir validaciones de ordenamiento, formatos y consistencia de los datos. Se pueden agregar nuevos escenarios y combinaciones según las necesidades del proyecto.

---

## Ejecución de Tests

Para ejecutar los tests, utiliza los siguientes comandos:

- **Ejecución de tests para API pública:**  
  ```sh
  npx playwright test src/tests/test.spec.js
  ```

- **Ejecución de tests para autenticación:**  
  ```sh
  npx playwright test src/tests/auth.spec.js
  ```

- **Ejecución de tests adicionales:**  
  ```sh
  npx playwright test src/tests/extra.spec.js
  ```

- **Ejecución de tests de consultas DB:**  
  ```sh
  npx playwright test src/tests/dbQueries.spec.js
  ```

- **Para ver el reporte HTML de los tests:**  
  ```sh
  npx playwright show-report test-results/html
  ```

---

## Notas Adicionales

- **Variables de Entorno:**  
  Asegúrate de tener configurado el archivo `.env` correctamente para que las peticiones a la API y las conexiones a la base de datos se realicen con los valores adecuados.

- **Desarrollo de Nuevos Tests:**  
  - Para agregar nuevos tests, crea un archivo `.spec.js` en la carpeta `src/tests`.
  - Utiliza los clientes y utilidades existentes para evitar duplicar lógica.
  - Valida cualquier nueva función o endpoint utilizando los métodos de `@playwright/test` (como `test` y `expect`).

- **Integración con el Framework:**  
  El proyecto utiliza la estructura de Playwright. Las configuraciones en `playwright.config.js` definen la carpeta de tests, el reporte HTML y otras opciones importantes. Ajusta este archivo si necesitas cambiar el timeout, los reintentos u otras configuraciones.

- **Depuración y Logs:**  
  Utiliza el logger (`src/utils/logger.js`) para imprimir información adicional en la consola durante la ejecución de los tests, facilitando la identificación de problemas y el seguimiento del flujo de datos.

---

Este manual debe cubrir las bases para que puedas entender y ampliar el proyecto. Si tienes dudas adicionales o necesitas más ejemplos, revisa cada uno de los archivos y sigue el flujo desde la configuración de variables hasta la ejecución de tests. ¡Buena suerte!