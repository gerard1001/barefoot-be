/* eslint-disable curly */
/* eslint-disable no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { User, Blacklist, Role, Profile } from '../database/models';
import { decodeToken } from '../helpers/user.helpers';
import RoleService from '../services/role.service';

export const checkLoggedInUser = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'User not logged in' });
    const blackListed = await Blacklist.findOne({ where: { token } });
    /* istanbul ignore next */
    if (blackListed)
      return res.status(401).json({ message: 'Please login first' });

    const decoded = decodeToken(token);
    const freshUser = await User.findByPk(decoded.userId, {
      include: [
        {
          model: Role,
          as: 'Role'
        },
        {
          model: Profile,
          as: 'profile'
        }
      ]
    });
    req.user = freshUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Access denied' });
  }
};

export const roles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.Role.name)) {
      return next(
        res
          .status(403)
          .json({ message: 'You are not allowed to perform this action' })
      );
    }
    next();
  };
};

export const checkRoleSame = async (req, res, next) => {
  const { email, role } = req.body;

  const user = await User.findOne({ where: { email } });
  const { id: roleId } = await new RoleService().getRole(role);

  if (user && user.role_id === roleId) {
    return res.status(409).json({
      message: `User already have ${role} role`
    });
  }

  next();
};

export const checkEmailNotExist = async (req, res, next) => {
  const { email } = req.body;
  const emailExist = await User.findOne({
    where: {
      email
    }
  });
  if (emailExist) {
    next();
  } else {
    return res
      .status(404)
      .json({ message: `User with email ${email} does not exist` });
  }
};
