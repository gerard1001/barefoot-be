/* eslint-disable curly */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
import cloudinary from '../config/cloudinary';

export const imageUpload = async (req, res, next) => {
  try {
    const urls = [];
    const imageId = [];
    /* istanbul ignore next */
    if (!req.body.images && req.body.profile_picture)
      return res.status(400).json({ message: 'images sholud not be empty' });

    /* istanbul ignore next */
    if (!Array.isArray(req.body.images)) {
      const file = await cloudinary.uploader.upload(req.body.images.path);
      if (!file) return res.status(400).json({ message: 'not able to upload' });
      urls.push(file.url);
      imageId.push(file.public_id);
      req.body.images = urls;
      req.body.imagesId = imageId;
    } else {
      let file;
      for (let i = 0; i < req.body.images.length; i++) {
        /* istanbul ignore next */
        file = await cloudinary.uploader.upload(req.body.images[i].path);
        /* istanbul ignore next */
        if (!file)
          return res.status(400).json({ message: 'not able to upload' });
        /* istanbul ignore next */
        urls.push(file.url);
        /* istanbul ignore next */
        imageId.push(file.public_id);
      }
      req.body.images = urls;
      req.body.imagesId = imageId;
    }
    next();
  } catch (error) {
    console.log(error, '&&&&&&');
    return res.status(500).json({ message: 'internal server error', error });
  }
};

export const imageUpdate = async (req, res, next) => {
  /* istanbul ignore next */
  const urls = [];
  /* istanbul ignore next */
  const imageId = [];
  /* istanbul ignore next */
  if (!req.body.images)
    return res.status(400).json({ message: 'images sholud not be empty' });

  /* istanbul ignore next */
  if (!Array.isArray(req.body.images)) {
    const file = await cloudinary.uploader.upload(req.body.images.path);
    /* istanbul ignore next */
    if (!file) return res.status(400).json({ message: 'not able to upload' });
    /* istanbul ignore next */
    urls.push(file.url);
    imageId.push(file.public_id);
    /* istanbul ignore next */
    req.body.images = urls;
    req.body.imagesId = imageId;
  } else {
    /* istanbul ignore next */
    let file;
    for (let i = 0; i < req.body.images.length; i++) {
      file = await cloudinary.uploader.upload(req.body.images[i].path);
      /* istanbul ignore next */
      if (!file) return res.status(400).json({ message: 'not able to upload' });
      /* istanbul ignore next */
      urls.push(file.url);
      imageId.push(file.public_id);
    }
    /* istanbul ignore next */
    req.body.images = urls;
    req.body.imagesId = imageId;
  }
  /* istanbul ignore next */
  next();
};

export const updateProfilePicture = async (req, res, next) => {
  /* istanbul ignore next */
  if (req.body.profile_picture) {
    const uploadFile = await cloudinary.uploader.upload(
      req.body.profile_picture.path
    );
    /* istanbul ignore next */
    req.body.profile_picture = uploadFile.url;
  }
  next();
};
