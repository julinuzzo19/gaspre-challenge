import { Category } from "../models/Category";

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
}
