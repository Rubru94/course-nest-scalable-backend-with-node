import { ImageExtension } from '../../common/enums';

const validExtensions = Object.values(ImageExtension);

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  /* if (!file) return callback(new Error('File is empty'), false); */

  const fileExtension = file.mimetype.split('/')[1];
  console.log({ fileExtension });

  if (validExtensions.includes(fileExtension as ImageExtension))
    return callback(null, true);

  callback(null, false);
};
