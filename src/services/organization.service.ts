import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { AppDataSource } from '../utils/data-source';

const organizationRepository = AppDataSource.getRepository(Organization);

export const createOrganization = async (input: Partial<Organization>) => {
  return await organizationRepository.save(organizationRepository.create({ ...input }));
};

export const getOrganization = async (organizationId: number) => {
  return await organizationRepository.findOneBy({ id: organizationId });
};

export const findOrganizations = async (
  where: FindOptionsWhere<Organization> = {},
  select: FindOptionsSelect<Organization> = {},
  relations: FindOptionsRelations<Organization> = {}
) => {
  return await organizationRepository.find({
    where,
    select,
    relations,
  });
};
