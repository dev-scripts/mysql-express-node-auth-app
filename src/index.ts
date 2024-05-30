import express, {
  Application,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";

import { ValidateError } from "tsoa";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import passport from "passport";
import { RegisterRoutes } from "./routes";
import { envVariables } from "./configs";
import { AuthError } from "./error/auth.error";
import "./configs/auth.config";
import { dataSource } from "./configs";

const PORT = envVariables.PORT || 8000;
const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(passport.initialize());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

if (!dataSource.isConnected) {
  dataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
    });
}

// Define CORS middleware to allow all origins
app.use((req: ExRequest, res: ExResponse, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Access-Token");
  next();
});

// catch general error
RegisterRoutes(app);
app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (err instanceof AuthError) {
    return res.status(401).json({
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message,
    });
  }
  next();
});
