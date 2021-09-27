import { NextFunction, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import fileUpload from 'express-fileupload';
import { logger } from './logger/logger.js';
import { authorizationChecker } from './middleware/authorizationChecker.js';
import loginRouter from './routes/loginRouter.js';
import displayGalleryRouter from './routes/displayGalleryRouter.js';
import addImgRouter from './routes/addImgRouter.js';
import { connectDb } from './database/mongoDbConnect.js';
import { addImagesToDb } from './gallery/addImage/dbImagesCheck.js';
import config from './config.json'

const app = express();
const PORT: number = config.PORT;
const hostname: string = config.hostname;
const swaggerDocument = YAML.load(`server/swagger/swaggerAPI.yaml`);

connectDb()
  .then(() => {
    console.log('Connection success.');
    addImagesToDb(`http://${hostname}:${PORT}`)
      .then(() => {
        console.log('Images add to db');
      })
      .catch(e => {
        console.log(e);
      })
  })
  .catch(e => {
    console.log(e);
  });

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.all('*', authorizationChecker);
app.use(logger);
app.use('/images', express.static(`server/gallery/images`));
app.use(fileUpload());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', loginRouter);
app.use('/', displayGalleryRouter);
app.use('/', addImgRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res.writeHead(404);
  res.end('Not Found');

  logger(`Page ${req.url} not found`);

  next();
});

app.listen(PORT, hostname, () => {
  console.log(`Listening server: ${hostname}:${PORT}`);
  logger('Server start');
});
