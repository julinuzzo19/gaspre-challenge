/**
 * Estructura malformada para testear Fase 3.
 * Contiene intencionalmente todos los tipos de anomalías esperables.
 */

// Nodo reutilizado para simular referencia circular
const cycleNode: any = {
  id: 99,
  name: "CycleNode",
  active: true,
  subcategories: [] as any[],
};
cycleNode.subcategories.push(cycleNode); // CYCLE_DETECTED

export const MALFORMED_DATA: any = {
  id: 1,
  name: "Raíz",
  active: true,
  subcategories: [
    // INVALID_ID: id no es número
    {
      id: "abc",
      name: "ID inválido",
      active: true,
      subcategories: [],
    },

    // INVALID_NAME: nombre vacío
    {
      id: 2,
      name: "",
      active: true,
      subcategories: [],
    },

    // INVALID_NAME: nombre con solo espacios
    {
      id: 3,
      name: "   ",
      active: true,
      subcategories: [],
    },

    // INVALID_SUBCATEGORIES: subcategories no es array
    {
      id: 4,
      name: "Subcategorías inválidas",
      active: true,
      subcategories: "no-es-array",
    },

    // NULL_CHILD: nodo null dentro de subcategories
    {
      id: 5,
      name: "Con hijo nulo",
      active: true,
      subcategories: [
        null,
        { id: 51, name: "Hijo válido", active: true, subcategories: [] },
      ],
    },

    // DUPLICATE_ID: id 6 aparece dos veces
    {
      id: 6,
      name: "Duplicado A",
      active: true,
      subcategories: [],
    },
    {
      id: 6,
      name: "Duplicado B",
      active: true,
      subcategories: [],
    },

    // INVALID_NODE: nodo undefined dentro de subcategories
    {
      id: 7,
      name: "Con hijo undefined",
      active: true,
      subcategories: [
        undefined,
        { id: 71, name: "Hijo válido", active: true, subcategories: [] },
      ],
    },

    // CYCLE_DETECTED: referencia circular
    cycleNode,

    // Nodo válido para verificar que el procesamiento continúa tras los errores
    {
      id: 100,
      name: "Nodo válido al final",
      active: true,
      subcategories: [
        { id: 101, name: "Hoja activa", active: true, subcategories: [] },
        { id: 102, name: "Hoja inactiva", active: false, subcategories: [] },
      ],
    },
  ],
};
