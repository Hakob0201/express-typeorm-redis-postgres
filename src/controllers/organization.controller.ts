import { NextFunction, Request, Response } from 'express';
import {
  CreateOrganizationInput,
  DeleteOrganizationInput,
  GetOrganizationInput,
  UpdateOrganizationInput,
} from '../schemas/organization.schema';
import { createOrganization, findOrganizations, getOrganization } from '../services/organization.service';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';
import multer from 'multer';
import sharp from 'sharp';

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
  }

  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5000000, files: 1 },
});

export const uploadOrganizationImage = upload.single('image');

export const resizeOrganizationImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    if (!file) return next();

    const user = res.locals.user;

    const fileName = `user-${user.id}-${Date.now()}.jpeg`;
    await sharp(req.file?.buffer)
      .resize(800, 450)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${__dirname}/../../public/organizations/${fileName}`);

    req.body.image = fileName;

    next();
  } catch (err: any) {
    next(err);
  }
};

export const createOrganizationHandler = async (
  req: Request<{}, {}, CreateOrganizationInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user.id as number);

    const organization = await createOrganization(req.body);
    const userOrganization =  await createUserOrganization(organization, user!);

    res.status(201).json({
      status: 'success',
      data: {
        organization,
      },
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'Organization with that title already exist',
      });
    }
    next(err);
  }
};

export const getOrganizationHandler = async (
  req: Request<GetOrganizationInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization = await getOrganization(req.params.organizationId);

    if (!organization) {
      return next(new AppError(404, 'Organization with that ID not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        organization,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getOrganizationsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizations = await findOrganizations({}, {}, {});

    res.status(200).json({
      status: 'success',
      results: organizations.length,
      data: {
        organizations,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateOrganizationHandler = async (
  req: Request<UpdateOrganizationInput['params'], {}, UpdateOrganizationInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization = await getOrganization(req.params.organizationId);

    if (!organization) {
      return next(new AppError(404, 'Organization with that ID not found'));
    }

    Object.assign(organization, req.body);

    const updatedOrganization = await organization.save();

    res.status(200).json({
      status: 'success',
      data: {
        organization: updatedOrganization,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteOrganizationHandler = async (
  req: Request<DeleteOrganizationInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization = await getOrganization(req.params.organizationId);

    if (!organization) {
      return next(new AppError(404, 'Organization with that ID not found'));
    }

    await organization.remove();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};
