/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-plusplus */
import express from 'express';
import path from 'path';
import passport from '../../middlewares/passport.middleware';
import UserController from '../../controllers/user.controller';
import userValidation from '../../validations/user.validation';
import {
  checkEmailExist,
  checkVerifiedUser,
  retrieveFEBaseUrl
} from '../../middlewares/user.middleware';
import {
  checkLoggedInUser,
  roles,
  checkRoleSame,
  checkEmailNotExist
} from '../../middlewares/role.middleware';
import roleValidation from '../../validations/role.validation';
import RoleController from '../../controllers/role.controller';
import {
  EmailValidation,
  PasswordValidation
} from '../../validations/resetPassword.validation';
import upload from '../../helpers/multer';
import profileValidation from '../../validations/profile.validation';
import { validateLocationId } from '../../middlewares/location.middleware';
import registerValidation from '../../validations/register.validation';
import { updateProfilePicture } from '../../middlewares/imageUpload.middleware';

const routes = express.Router();

routes.get(
  '/',
  checkLoggedInUser,
  roles('SUPER_ADMIN', 'MANAGER'),
  async (req, res) => {
    await UserController.getAllUsers(req, res);
  }
);

routes.get('/getOne', checkLoggedInUser, UserController.getOneUser);

routes.post(
  '/register',
  registerValidation,
  validateLocationId,
  checkEmailExist,
  passport.authenticate('local', { session: false }),
  async (req, res) => {
    await new UserController().createUser(req, res);
  }
);

routes.get('/verify-email/:token', async (req, res) => {
  await new UserController().verifyNewUser(req, res);
});

routes.get('/verified', async (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/verified.html'));
});

routes.post('/login', userValidation, checkVerifiedUser, async (req, res) => {
  await new UserController().userLogin(req, res);
});

routes.get(
  '/google/login',
  retrieveFEBaseUrl,
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    prompt: 'select_account'
  }),
  async (req, res) => {
    /* istanbul ignore next */
    await new UserController().googleLogin(req, res);
  }
);

routes.get(
  '/facebook/login',
  retrieveFEBaseUrl,
  passport.authenticate('facebook', {
    session: false
    // scope: ['email', 'public_profile', 'user_photos']
  }),
  async (req, res) => {
    /* istanbul ignore next */
    await new UserController().githubLogin(req, res);
  }
);

routes.get(
  '/github/login',
  retrieveFEBaseUrl,
  passport.authenticate('github', {
    session: false,
    scope: ['email', 'public_profile', 'user_photos']
  }),
  async (req, res) => {
    /* istanbul ignore next */
    await new UserController().facebookLogin(req, res);
  }
);

routes.patch(
  '/assignRole',
  roleValidation,
  checkLoggedInUser,
  roles('SUPER_ADMIN'),
  checkEmailNotExist,
  checkRoleSame,
  async (req, res) => {
    await new RoleController().updateRole(req, res);
  }
);

routes.get(
  '/getRoles',
  checkLoggedInUser,
  roles('SUPER_ADMIN'),
  async (req, res) => {
    await new RoleController().getRoles(req, res);
  }
);

routes.patch(
  '/reset-password/:token',
  PasswordValidation,
  UserController.reset
);

routes.post('/forgot-password', EmailValidation, UserController.forgot);

routes.post('/logout', checkLoggedInUser, async (req, res) => {
  await new UserController().Logout(req, res);
});

routes.patch(
  '/profile',
  checkLoggedInUser,
  validateLocationId,
  updateProfilePicture,
  profileValidation,
  upload.single('profile_picture'),
  async (req, res) => {
    await new UserController().profileUpdate(req, res);
  }
);

routes.put(
  '/assign-to-manager',
  checkLoggedInUser,
  roles('SUPER_ADMIN'),
  UserController.assignUserToManager
);

export default routes;
