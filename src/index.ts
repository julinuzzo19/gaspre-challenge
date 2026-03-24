import express, { Express } from "express";
import cors from "cors";
import CategoryRoutes from "./routes/category.routes";
import { PORT } from "./config/envs";

export default class App {
  public readonly app: Express;

  constructor(private port?: number | string) {
    this.app = express();
    this.app.set("port", this.port || 3000);

    this.app.use(cors());
    this.app.use(express.json());

    this.app.use("/categories", CategoryRoutes);
  }

  public getServer(): Express {
    return this.app;
  }

  public listen(): void {
    const port = this.app.get("port");

    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

function main() {
  const app = new App(PORT);

  try {
    app.listen();
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
