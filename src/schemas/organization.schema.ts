import { object, string, TypeOf } from 'zod';

export const createOrganizationSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    })
  }),
});

const params = {
  params: object({
    organizationId: string(),
  }),
};

export const getOrganizationSchema = object({
  ...params,
});

export const updateOrganizationSchema = object({
  ...params,
  body: object({
    title: string(),
    content: string(),
    image: string(),
  }).partial(),
});

export const deleteOrganizationSchema = object({
  ...params,
});

export type CreateOrganizationInput = TypeOf<typeof createOrganizationSchema>['body'];
export type GetOrganizationInput = TypeOf<typeof getOrganizationSchema>['params'];
export type UpdateOrganizationInput = TypeOf<typeof updateOrganizationSchema>;
export type DeleteOrganizationInput = TypeOf<typeof deleteOrganizationSchema>['params'];
