import { CategoryService } from "../../services/category.service";

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
