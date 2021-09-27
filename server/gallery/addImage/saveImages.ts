import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { Images } from '../../database/Models/Images.js';
import ErrnoException = NodeJS.ErrnoException;
import { imageToDbCheck } from './dbImagesCheck.js';
// @ts-ignore
import { fileMetadataAsync } from 'file-metadata';

async function saveImages(imgData: UploadedFile, req: Request): Promise<void> {
  if (await imageToDbCheck(`http://${req.headers.host}/images/${imgData.name}`)) {
    return;
  }
  await fs.writeFile(`server/gallery/images/${imgData.name}`, imgData.data, (err: ErrnoException | null) => {
    if (err) {
      throw err
    }
  });

  await Images.create({
    path: `http://${req.headers.host}/images/${imgData.name}`,
    metadata: await fileMetadataAsync(`server/gallery/images/${imgData.name}`),
  })

}

export { saveImages }
