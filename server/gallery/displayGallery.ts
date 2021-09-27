import {Request} from "express";
import { Images } from '../database/Models/Images.js';

type LoginResponse = {
  errorMessage: string;
} | {
  objects: Array<string>;
  page: number;
  total: number;
}

interface Path {
  path: string
}

async function displayGallery(req: Request): Promise<LoginResponse> {
  const { page = '1', limit = '0' } = req.params;
  const numberPage: number = Number(page);
  const numberLimit: number = Number(limit);

  const total: number = Math.ceil(await Images.count() / numberLimit);

  if (numberPage > total || numberPage < 1) {
    return {
      errorMessage: 'Указаной страницы несуществует',
    };
  }

  const pathImages: Array<Path> = await Images.find({},
    {
      _id: false,
      path: 1
    }).lean()
    .skip((numberPage - 1) * numberLimit)
    .limit(Number(limit));

  const images = pathImages.map(img => img.path);

  return {
    objects: images,
    page: numberPage,
    total: total,
  };
}

export { displayGallery };

// Infinity load
