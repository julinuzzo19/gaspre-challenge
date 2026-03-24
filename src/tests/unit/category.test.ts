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
          active: false, // rama inactiva
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
});
