/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */
import { Role } from '../database/models';

export default class RoleService {
  async getRole(name) {
    return Role.findOne({ where: { name } });
  };

  async getRoles() {
    return Role.findAll();
  }
}
