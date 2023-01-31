/* eslint-disable import/prefer-default-export */
import { Role } from '../database/models';

export const checkRole = async (id) => {
  const role = await Role.findOne({ where: { id } });
  return role;
};
