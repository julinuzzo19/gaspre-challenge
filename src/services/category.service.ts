import { Category, CategorySearchResult } from "../models/Category";

export class CategoryService {
  /**
   *
   * @param category Categoría raíz desde la cual se quieren obtener las rutas completas de las categorías activas.
   * @param currentPath Es un string que representa la ruta actual en el proceso de construcción de las rutas completas. Se va concatenando a medida que se desciende en la jerarquía de categorías.
   * @param paths Es un array de strings que almacena las rutas completas de las categorías hoja activas.
   * @returns Un array de strings que contiene las rutas completas de las categorías hoja activas.
   */
  public getActiveLeafPaths(category: Category): string[] | undefined {
    if (!category.active) return undefined;

    const paths: string[] = [];
    this.collectLeafPaths(category, category.name, paths);
    return paths.sort();
  }

  private collectLeafPaths(
    category: Category,
    currentPath: string,
    paths: string[],
  ): void {
    if (!category.active) return;

    if (category.subcategories.length === 0) {
      paths.push(currentPath);
    } else {
      for (const subcategory of category.subcategories) {
        this.collectLeafPaths(
          subcategory,
          `${currentPath}/${subcategory.name}`,
          paths,
        );
      }
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
