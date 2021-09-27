// @ts-ignore
import { fileMetadataAsync } from 'file-metadata';
import * as fs from 'fs';
import * as util from 'util';
import { logger } from '../../logger/logger.js';
import { Images } from '../../database/Models/Images.js';

interface Image {
  path: string;
  metadata: object;
}

const readdir = util.promisify(fs.readdir);

async function addImagesToDb(host: string): Promise<void> {
  const pathImages = await getImagesInfoServer(host);

  for (const pathImg of pathImages) {
    const resultFind = await Images.findOne({ path: pathImg.path });

    if (!resultFind) {
      await Images.create(pathImg);
      logger(`Add ${pathImg.path} to db`);
    }
  }
}

async function imageToDbCheck(imgPath: string): Promise<boolean> {
  return Images.findOne({ path: imgPath });
}

async function getImagesInfoServer(host: string): Promise<Array<Image>> {
  let pathImages: Array<Image> = [];
  const imagesDir: Array<string> = await readdir(`server/gallery/images`);
  const imagesDirInfo = imagesDir.map(async img => {
      const metadata = await fileMetadataAsync(`server/gallery/images/${img}`);
      return {
        path: `${host}/images/${img}`,
        metadata: metadata,
      };
    },
  );
  const resolveImages = await Promise.all(imagesDirInfo);
  pathImages.push(...resolveImages);

  return pathImages;
}

export { addImagesToDb, imageToDbCheck };
