import {Request} from 'express';
import {FileArray, UploadedFile} from "express-fileupload";
import { saveImages } from './saveImages.js';
// @ts-ignore
import { fileMetadataAsync } from 'file-metadata';


async function addImgGallery(req: Request) {
    const formData: FileArray | undefined = req.files;

    if (!formData || Object.keys(formData).length === 0) {
        return {
            errorMessage: 'Нет изображений для загрузки'
        };
    }

    let imgData: UploadedFile | Array<UploadedFile> = formData.photo;
    let responseImg: Array<string> = [];

    if (Array.isArray(imgData)) {
        for (const imgInfo of imgData) {
            try {
                await saveImages(imgInfo, req);

                responseImg.push(imgInfo.name);
            } catch (e) {
                console.log(e)
                responseImg.push(`${imgInfo.name} не было загружено`)
            }
        }
    } else {
        try {
            await saveImages(imgData, req);

            responseImg.push(imgData.name);
        } catch (e) {
            console.log(e)
            return {
                errorMessage: 'Ошибка загрузки'
            }
        }
    }

    return {
        message: 'Изображения успешно загружены',
        objects: responseImg,
    };
}

export {addImgGallery}
