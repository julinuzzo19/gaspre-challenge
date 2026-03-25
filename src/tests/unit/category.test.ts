import { CategoryService } from "../../services/category.service";
import { MALFORMED_DATA } from "../../repositories/mock/malformed-data";

const service = new CategoryService();

describe("Fase 1 - getActiveLeafPaths", () => {
  it("caso base: devuelve rutas de hojas activas ordenadas alfabéticamente", () => {
    const structure = {
      id: 1,
      name: "Electrónica",
      active: true,
      subcategories: [
        {
          id: 2,
          name: "Computadoras",
          active: true,
          subcategories: [
            { id: 5, name: "Laptops", active: true, subcategories: [] },
            { id: 6, name: "Desktops", active: false, subcategories: [] },
          ],
        },
        { id: 3, name: "Celulares", active: true, subcategories: [] },
        { id: 4, name: "Accesorios", active: true, subcategories: [] },
      ],
    };

    const result = service.getActiveLeafPaths(structure);

    expect(result).toEqual([
      "Electrónica/Accesorios",
      "Electrónica/Celulares",
      "Electrónica/Computadoras/Laptops",
    ]);
  });

  it("rama inactiva: si un ancestro está inactivo, sus hijos no aparecen aunque estén activos", () => {
    const structure = {
      id: 1,
      name: "Electrónica",
      active: true,
      subcategories: [
        {
          id: 2,
          name: "Computadoras",
          active: false,
          subcategories: [
            { id: 5, name: "Laptops", active: true, subcategories: [] },
          ],
        },
        { id: 3, name: "Celulares", active: true, subcategories: [] },
      ],
    };

    const result = service.getActiveLeafPaths(structure);

    expect(result).toEqual(["Electrónica/Celulares"]);
  });

  it("raíz inactiva: no devuelve ninguna ruta", () => {
    const structure = {
      id: 1,
      name: "Electrónica",
      active: false,
      subcategories: [
        { id: 2, name: "Celulares", active: true, subcategories: [] },
      ],
    };

    const result = service.getActiveLeafPaths(structure);

    expect(result).toBeUndefined();
  });

  it("nodo raíz hoja activo: devuelve solo su nombre como ruta", () => {
    const structure = {
      id: 1,
      name: "Solo",
      active: true,
      subcategories: [],
    };

    const result = service.getActiveLeafPaths(structure);

    expect(result).toEqual(["Solo"]);
  });
});

describe("Fase 2 - findCategoryById", () => {
  const structure = {
    id: 1,
    name: "Electrónica",
    active: true,
    subcategories: [
      {
        id: 2,
        name: "Computadoras",
        active: true,
        subcategories: [
          { id: 5, name: "Laptops", active: true, subcategories: [] },
        ],
      },
      { id: 3, name: "Celulares", active: true, subcategories: [] },
    ],
  };

  it("búsqueda exitosa: nodo hoja en profundidad 2", () => {
    const result = service.findCategoryById(structure, 5);

    expect(result).toEqual({
      node: { id: 5, name: "Laptops", active: true, subcategories: [] },
      path: "Electrónica/Computadoras/Laptops",
      depth: 2,
      parentId: 2,
      isLeaf: true,
    });
  });

  it("búsqueda exitosa: nodo intermedio (no hoja)", () => {
    const result = service.findCategoryById(structure, 2);

    expect(result).toEqual({
      node: {
        id: 2,
        name: "Computadoras",
        active: true,
        subcategories: [
          { id: 5, name: "Laptops", active: true, subcategories: [] },
        ],
      },
      path: "Electrónica/Computadoras",
      depth: 1,
      parentId: 1,
      isLeaf: false,
    });
  });

  it("búsqueda exitosa: nodo raíz (depth 0, parentId null)", () => {
    const result = service.findCategoryById(structure, 1);

    expect(result).toEqual({
      node: structure,
      path: "Electrónica",
      depth: 0,
      parentId: null,
      isLeaf: false,
    });
  });

  it("búsqueda sin resultado: retorna null cuando el id no existe", () => {
    const result = service.findCategoryById(structure, 99);

    expect(result).toBeNull();
  });
});

describe("Fase 3 - analyzeCategoryTree", () => {
  it("estructura válida: contadores correctos y rutas de hojas activas", () => {
    const structure = {
      id: 1,
      name: "Raíz",
      active: true,
      subcategories: [
        { id: 2, name: "Activo", active: true, subcategories: [] },
        { id: 3, name: "Inactivo", active: false, subcategories: [] },
      ],
    };

    const result = service.analyzeCategoryTree(structure);

    expect(result.anomalies).toHaveLength(0);
    expect(result.totalValid).toBe(3);
    expect(result.activeCount).toBe(2);
    expect(result.inactiveCount).toBe(1);
    expect(result.maxDepth).toBe(1);
    expect(result.leafPaths).toEqual(["Raíz/Activo"]);
  });

  it("INVALID_ID: reporta anomalía cuando el id no es número", () => {
    const result = service.analyzeCategoryTree(MALFORMED_DATA);

    const invalidId = result.anomalies.find((a) => a.code === "INVALID_ID");
    expect(invalidId).toBeDefined();
  });

  it("INVALID_NAME: reporta anomalía cuando el nombre es vacío o solo espacios", () => {
    const result = service.analyzeCategoryTree(MALFORMED_DATA);

    const invalidNames = result.anomalies.filter(
      (a) => a.code === "INVALID_NAME",
    );
    expect(invalidNames.length).toBeGreaterThanOrEqual(2);
  });

  it("INVALID_SUBCATEGORIES: reporta anomalía cuando subcategories no es array", () => {
    const result = service.analyzeCategoryTree(MALFORMED_DATA);

    const invalidSubs = result.anomalies.find(
      (a) => a.code === "INVALID_SUBCATEGORIES",
    );
    expect(invalidSubs).toBeDefined();
    expect(invalidSubs?.id).toBe(4);
  });

  it("DUPLICATE_ID: reporta anomalía cuando dos nodos tienen el mismo id", () => {
    const result = service.analyzeCategoryTree(MALFORMED_DATA);

    const duplicate = result.anomalies.find((a) => a.code === "DUPLICATE_ID");
    expect(duplicate).toBeDefined();
    expect(duplicate?.id).toBe(6);
  });

  it("CYCLE_DETECTED: reporta anomalía y no entra en loop infinito", () => {
    const result = service.analyzeCategoryTree(MALFORMED_DATA);

    const cycle = result.anomalies.find((a) => a.code === "CYCLE_DETECTED");
    expect(cycle).toBeDefined();
  });

  it("NULL_CHILD: reporta anomalía cuando un hijo es null", () => {
    const result = service.analyzeCategoryTree(MALFORMED_DATA);

    const nullChild = result.anomalies.find(
      (a) =>
        (a.code === "NULL_CHILD" || a.code === "INVALID_NODE") &&
        a.partialPath?.includes("Con hijo nulo"),
    );
    expect(nullChild).toBeDefined();
  });
});
