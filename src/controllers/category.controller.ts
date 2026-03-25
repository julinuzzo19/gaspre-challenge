import { Response, Request } from "express";
import { HttpStatusCode } from "axios";
import { CategoryService } from "../services/category.service";
import { DATA } from "../repositories/mock/data";
import { MALFORMED_DATA } from "../repositories/mock/malformed-data";

export class CategoryController {
  constructor(readonly categoriesService: CategoryService) {}

  public getActiveLeafPaths(_req: Request, res: Response): void {
    try {
      const result = this.categoriesService.getActiveLeafPaths(DATA);

      res.status(HttpStatusCode.Ok).json(result);
    } catch (error) {
      console.log({ error });
      res.status(HttpStatusCode.InternalServerError).json({
        message: "Error al obtener las rutas de categorías activas",
      });
    }
  }

  public findCategoryById(
    req: Request<{ id: string }, any, any, any>,
    res: Response,
  ): void {
    try {
      if (!req?.params?.id) {
        res.status(HttpStatusCode.BadRequest).json({
          message: "ID de categoría es requerido",
        });
      }
      const categoryId = parseInt(req.params.id);
      const result = this.categoriesService.findCategoryById(DATA, categoryId);

      res.status(HttpStatusCode.Ok).json(result);
    } catch (error) {
      console.log({ error });
      res.status(HttpStatusCode.InternalServerError).json({
        message: "Error al obtener la categoría por ID",
      });
    }
  }

  public analyzeCategoryTree(req: Request, res: Response): void {
    try {
      const result = this.categoriesService.analyzeCategoryTree(MALFORMED_DATA);

      res.status(HttpStatusCode.Ok).json(result);
    } catch (error) {
      console.log({ error });
      res.status(HttpStatusCode.InternalServerError).json({
        message: "Error al analizar el árbol de categorías",
      });
    }
  }
}
