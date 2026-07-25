import path from "node:path";

import express from "express";
import { engine } from "express-handlebars";

import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import homeRoutes from "./routes/home.routes";

const app = express();
const viewsPath = path.join(process.cwd(), "src", "views");

app.engine(
  "hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(viewsPath, "layouts"),
  }),
);

app.set("view engine", "hbs");
app.set("views", viewsPath);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", homeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
