/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */

import RoleService from '../services/role.service';
import UserService from '../services/user.service';

export default class RoleController {
  async updateRole(req, res) {
    try {
      const { email, role } = req.body;

      const user = await new UserService().getUser(email);
      const { id: roleId } = await new RoleService().getRole(role);

      user.role_id = roleId;
      await user.save();

      return res.status(200).json({
        message: 'User role updated successfully',
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while creating a user',
        error: error.message
      });
    }
  }

  async getRoles(...args) {
    const res = args[1];
    try {
      const roles = await new RoleService().getRoles();
      res
        .status(200)
        .json({ message: 'retrieved all roles successfully', data: roles });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while creating a user',
        error: error.message
      });
    }
  }
}
