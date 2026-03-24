import { Response, Request } from "express";
import { HttpStatusCode } from "axios";
import { CategoryService } from "../services/category.service";
import { DATA } from "../repositories/mock/data";

export class CategoryController {
  constructor(readonly categoriesService: CategoryService) {}

  public async getActiveLeafPaths(
    _req: Request<{}, any, any, any>,
    res: Response,
  ): Promise<void> {
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
}
