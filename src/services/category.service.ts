import {
  AnalysisReport,
  Category,
  CategorySearchResult,
} from "../models/Category";

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

  public analyzeCategoryTree(category: Category): AnalysisReport {
    const report: AnalysisReport = {
      leafPaths: [],
      totalValid: 0,
      activeCount: 0,
      anomalies: [],
      inactiveCount: 0,
      maxDepth: 0,
    };

    const visitedIds = new Set<number>();
    const visitedNodes = new Set<object>();

    const traverse = (node: Category, path: string, depth: number): void => {
      // INVALID_NODE: Validar que el nodo raíz no sea null o undefined
      if (node == null) {
        report.anomalies.push({
          detail: `La categoría raíz es inválida (null o undefined).`,
          code: "INVALID_NODE",
          partialPath: path,
        });

        return;
      }

      // CYCLE_DETECTED: Validar que no haya ciclos en la jerarquía de categorías
      if (visitedNodes.has(node)) {
        report.anomalies.push({
          detail: `Ciclo en la jerarquía de categorías. ${path} ya fue visitada.`,
          code: "CYCLE_DETECTED",
          id: node.id,
          partialPath: path,
        });
        return;
      }

      visitedNodes.add(node);

      // DUPLICATE_ID: Validar que el nodo raíz no tenga un ID duplicado
      if (typeof node.id === "number") {
        if (visitedIds.has(node.id)) {
          report.anomalies.push({
            detail: `ID duplicado: ${path}`,
            code: "DUPLICATE_ID",
            id: node.id,
            partialPath: path,
          });
        } else {
          visitedIds.add(node.id);
        }
      }

      // INVALID_ID: Validar que el nodo raíz tenga un ID numérico válido
      if (typeof node.id !== "number") {
        report.anomalies.push({
          detail: `ID inválido: ${path}`,
          code: "INVALID_ID",
          id: node.id,
          partialPath: path,
        });
      }

      // INVALID_NAME: Validar que el nodo raíz tenga un nombre no vacío y no solo espacios
      if (typeof node.name !== "string" || node.name.trim() === "") {
        report.anomalies.push({
          detail: `Nombre inválido: ${path}`,
          code: "INVALID_NAME",
          id: node.id,
          partialPath: path,
        });
      }

      // INVALID_SUBCATEGORIES: Validar que el nodo raíz tenga un array de subcategorías válido y que no contenga nodos null o undefined
      if (!Array.isArray(node.subcategories)) {
        report.anomalies.push({
          detail: `Subcategorías inválidas: ${path}`,
          code: "INVALID_SUBCATEGORIES",
          id: node.id,
          partialPath: path,
        });

        return;
      }

      // NULL_CHILD: Validar que el nodo raíz no tenga hijos nulos
      if (node.subcategories.some((sub) => sub == null)) {
        report.anomalies.push({
          detail: `Hijos nulos: ${path}`,
          code: "NULL_CHILD",
          id: node.id,
          partialPath: path,
        });
      }

      // contadores
      report.totalValid++;
      report.maxDepth = Math.max(report.maxDepth, depth);
      node.active ? report.activeCount++ : report.inactiveCount++;

      if (node.subcategories.length === 0 && node.active) {
        report.leafPaths.push(path);
      }

      // recursion
      for (const child of node.subcategories) {
        const childName = child?.name ?? "?";
        traverse(child, `${path}/${childName}`, depth + 1);
      }
    };

    traverse(category, category.name, 0);

    return report;
  }
}
