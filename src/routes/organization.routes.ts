import express from 'express';
import {
    createOrganizationHandler,
    getOrganizationHandler,
    getOrganizationsHandler,
    updateOrganizationHandler,
    deleteOrganizationHandler,
    resizeOrganizationImage,
    uploadOrganizationImage
} from '../controllers/organization.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from "../middleware/validate";
import {
    createOrganizationSchema,
    getOrganizationSchema,
    updateOrganizationSchema,
    deleteOrganizationSchema,
} from "../schemas/organization.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);


router
    .route('/')
    .post(
        uploadOrganizationImage,
        resizeOrganizationImage,
        validate(createOrganizationSchema),
        createOrganizationHandler
    )
    .get(getOrganizationsHandler);

router
    .route('/:organizationId')
    .get(validate(getOrganizationSchema), getOrganizationHandler)
    .patch(validate(updateOrganizationSchema), updateOrganizationHandler)
    .delete(validate(deleteOrganizationSchema), deleteOrganizationHandler);

export default router;
