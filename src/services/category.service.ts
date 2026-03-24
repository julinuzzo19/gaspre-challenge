import { Category, CategorySearchResult } from "../models/Category";

export class CategoryService {
  /**
   *
   * @param category Categoría raíz desde la cual se quieren obtener las rutas completas de las categorías activas.
   * @param currentPath Es un string que representa la ruta actual en el proceso de construcción de las rutas completas. Se va concatenando a medida que se desciende en la jerarquía de categorías.
   * @param paths Es un array de strings que almacena las rutas completas de las categorías hoja activas.
   * @returns Un array de strings que contiene las rutas completas de las categorías hoja activas.
   */
  public getActiveLeafPaths(
    category: Category,
    currentPath: string = "",
    paths: string[] = [],
  ) {
    try {
      const newPath = currentPath
        ? `${currentPath}/${category.name}`
        : category.name;

      // Si la categoría no está activa, no se incluyen sus subcategorías, incluso si estas están activas.
      if (!category.active) {
        return;
      }

      // Si la categoría es una hoja (no tiene subcategorías) y está activa, se agrega su ruta completa a la lista de rutas.
      if (category.subcategories.length === 0) {
        paths.push(newPath);
      } else {
        // si no es hoja, por cada subcategoría se repite el proceso, concatenando el nombre de la categoría padre a la ruta.
        for (const subcategory of category.subcategories) {
          this.getActiveLeafPaths(subcategory, newPath, paths);
        }
      }

      // Ordena alfabéticamente las rutas completas
      return paths.sort();
    } catch (error) {
      console.log({ error });
      throw new Error("Error al obtener las rutas de categorías activas");
    }
  }

  /**
   *
   * @param data  Categoría raíz desde la cual se quiere buscar la categoría por ID. Se asume que esta categoría tiene una estructura de árbol con subcategorías anidadas.
   * @param categoryId  ID de la categoría que se desea encontrar dentro de la estructura de categorías.
   * @returns Un objeto que contiene la información de la categoría encontrada, incluyendo el nodo de la categoría, su ruta completa, su profundidad en la jerarquía, el ID de su categoría padre y si es una hoja o no. Si no se encuentra la categoría, se retorna `undefined`.
   */
  public findCategoryById(data: Category, categoryId: number) {
    const search: (
      node: Category,
      parentId: number | null,
      depth: number,
      currentPath: string,
    ) => CategorySearchResult | null = (
      node: Category,
      parentId: number | null,
      depth: number,
      currentPath: string,
    ) => {
      // Si el nodo actual es el que estamos buscando, retornamos la información requerida.
      if (node.id === categoryId) {
        return {
          node: node,
          path: currentPath,
          depth,
          parentId,
          isLeaf: node.subcategories.length === 0,
        };
      }

      // Si el nodo actual no es el que buscamos, iteramos sobre sus subcategorías (si las tiene) y continuamos la búsqueda.
      for (const subcategory of node.subcategories) {
        const result = search(
          subcategory,
          node.id, // parentId del nodo hijo es el id del nodo actual
          depth + 1, // incrementamos la profundidad al descender en la jerarquía
          `${currentPath}/${subcategory.name}`, // concatenamos el nombre de la subcategoría a la ruta actual
        );
        if (result) {
          return result;
        }
      }

      return null;
    };

    return search(data, null, 0, data.name);
  }
}
