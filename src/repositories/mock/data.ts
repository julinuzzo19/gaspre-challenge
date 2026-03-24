import type { Category } from "../../models/Category";

export const DATA: Category = {
  id: 1,
  name: "Electrónica",
  active: true,
  subcategories: [
    {
      id: 2,
      name: "Computadoras",
      active: true,
      subcategories: [
        {
          id: 5,
          name: "Laptops",
          active: true,
          subcategories: [
            { id: 51, name: "Gaming", active: true, subcategories: [] },
            { id: 52, name: "Ultrabooks", active: true, subcategories: [] },
            { id: 53, name: "2 en 1", active: false, subcategories: [] },
          ],
        },
        {
          id: 6,
          name: "Desktops",
          active: false,
          subcategories: [
            { id: 61, name: "Torres", active: true, subcategories: [] },
            { id: 62, name: "All-in-One", active: false, subcategories: [] },
          ],
        },
        {
          id: 7,
          name: "Componentes",
          active: true,
          subcategories: [
            { id: 71, name: "Procesadores", active: true, subcategories: [] },
            {
              id: 72,
              name: "Tarjetas Gráficas",
              active: true,
              subcategories: [],
            },
            { id: 73, name: "Memorias RAM", active: true, subcategories: [] },
          ],
        },
        {
          id: 8,
          name: "Monitores",
          active: true,
          subcategories: [
            { id: 81, name: "4K", active: true, subcategories: [] },
            { id: 82, name: "Curvos", active: true, subcategories: [] },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Celulares",
      active: true,
      subcategories: [
        {
          id: 31,
          name: "Smartphones",
          active: true,
          subcategories: [
            { id: 311, name: "Android", active: true, subcategories: [] },
            { id: 312, name: "iOS", active: true, subcategories: [] },
          ],
        },
        { id: 32, name: "Teléfonos Básicos", active: false, subcategories: [] },
        {
          id: 33,
          name: "Accesorios para Celulares",
          active: true,
          subcategories: [
            { id: 331, name: "Fundas", active: true, subcategories: [] },
            { id: 332, name: "Cargadores", active: true, subcategories: [] },
            {
              id: 333,
              name: "Protectores de Pantalla",
              active: true,
              subcategories: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Accesorios",
      active: true,
      subcategories: [
        {
          id: 41,
          name: "Audífonos",
          active: true,
          subcategories: [
            { id: 411, name: "Inalámbricos", active: true, subcategories: [] },
            { id: 412, name: "Diadema", active: true, subcategories: [] },
            { id: 413, name: "Deportivos", active: false, subcategories: [] },
          ],
        },
        {
          id: 42,
          name: "Teclados",
          active: true,
          subcategories: [
            { id: 421, name: "Mecánicos", active: true, subcategories: [] },
            { id: 422, name: "Ergonómicos", active: true, subcategories: [] },
          ],
        },
        { id: 43, name: "Mouse", active: true, subcategories: [] },
        { id: 44, name: "Almacenamiento", active: true, subcategories: [] },
      ],
    },
    {
      id: 9,
      name: "Audio y Video",
      active: true,
      subcategories: [
        {
          id: 91,
          name: "Televisores",
          active: true,
          subcategories: [
            { id: 911, name: "OLED", active: true, subcategories: [] },
            { id: 912, name: "QLED", active: true, subcategories: [] },
            { id: 913, name: "4K", active: true, subcategories: [] },
          ],
        },
        {
          id: 92,
          name: "Barras de Sonido",
          active: true,
          subcategories: [],
        },
        {
          id: 93,
          name: "Proyectores",
          active: false,
          subcategories: [],
        },
      ],
    },
    {
      id: 10,
      name: "Gaming",
      active: true,
      subcategories: [
        {
          id: 101,
          name: "Consolas",
          active: true,
          subcategories: [
            { id: 1011, name: "PlayStation", active: true, subcategories: [] },
            { id: 1012, name: "Xbox", active: true, subcategories: [] },
            {
              id: 1013,
              name: "Nintendo Switch",
              active: true,
              subcategories: [],
            },
          ],
        },
        {
          id: 102,
          name: "Periféricos Gaming",
          active: true,
          subcategories: [
            { id: 1021, name: "Mouse Gaming", active: true, subcategories: [] },
            {
              id: 1022,
              name: "Teclados Mecánicos",
              active: true,
              subcategories: [],
            },
            { id: 1023, name: "Sillas Gamer", active: true, subcategories: [] },
          ],
        },
      ],
    },
  ],
};
