//middlewares.mjs
//importing routers from express
import { mockusers } from "./constants.mjs";  
//importing the schema
export const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  };
  
  app.use(loggingMiddleware);
  
  const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
      