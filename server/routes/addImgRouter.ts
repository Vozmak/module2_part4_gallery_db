import { Request, Response } from 'express';
import { addImgGallery } from '../gallery/addImage/addImgGallery.js';
import { errorMessage } from '../functions/errorMessageCheck.js';
import * as express from 'express';
const router = express.Router();

router.post('/gallery', async (req: Request, res: Response) => {
  const upload = await addImgGallery(req);

  errorMessage(res, upload, 400);

  res.end(JSON.stringify(upload));
});

export default router
