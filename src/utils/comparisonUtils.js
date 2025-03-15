const logger = require('./logger');

/**
 * Compara dos objetos: received y expected.
 * Si coinciden en estructura en base a los validadores (por ejemplo, expect.any(String)),
 * retorna true; si no, retorna un array con mensajes indicativos de las diferencias.
 */
function compareData(received, expected, path = '') {
  const errors = [];
  for (const key in expected) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in received)) {
      errors.push(`Falta la propiedad '${currentPath}'`);
    } else {
      const expectedValue = expected[key];
      const receivedValue = received[key];
      if (
        expectedValue &&
        typeof expectedValue === 'object' &&
        expectedValue.asymmetricMatch === undefined
      ) {
        // Comparación recursiva para objetos
        const subResult = compareData(receivedValue, expectedValue, currentPath);
        if (subResult !== true) {
          errors.push(...subResult);
        }
      } else if (
        expectedValue && expectedValue.asymmetricMatch &&
        !expectedValue.asymmetricMatch(receivedValue)
      ) {
        errors.push(`La propiedad '${currentPath}' no cumple con el validador esperado.`);
      } else if (
        expectedValue && expectedValue.asymmetricMatch === undefined &&
        receivedValue !== expectedValue
      ) {
        errors.push(`La propiedad '${currentPath}' tiene el valor ${JSON.stringify(receivedValue)} pero se esperaba ${JSON.stringify(expectedValue)}`);
      }
    }
  }
  return errors.length ? errors : true;
}

module.exports = { compareData };