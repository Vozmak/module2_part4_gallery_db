import { Request, Response } from 'express';
import { login } from '../login/login';
import { errorMessage } from '../function/errorMessageCheck';
import * as express from 'express';
const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const resBody = login(req);

  errorMessage(res, resBody, 406);

  res.end(JSON.stringify(resBody));
});

export default router
