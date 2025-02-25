import express from 'express';
import { loggingMiddleware } from './utils/middlewares.mjs';

const app = express();

app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
