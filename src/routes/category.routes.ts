import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { CategoryService } from "../services/category.service";

const router = Router();

// Inyeccion de dependencias

const categoriesService = new CategoryService();

const categoriesController = new CategoryController(categoriesService);

// Definicion de rutas

router.get("/", categoriesController.getActiveLeafPaths.bind(categoriesController));
router.get("/analyze", categoriesController.analyzeCategoryTree.bind(categoriesController));
router.get("/:id", categoriesController.findCategoryById.bind(categoriesController));

export default router;
