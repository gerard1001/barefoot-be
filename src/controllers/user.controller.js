/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable require-jsdoc */
import fs from 'fs';
import bcryptjs from 'bcryptjs';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import Profiles from '../services/profile.service';
import UserService from '../services/user.service';
import { User } from '../database/models';
import {
  generateToken,
  hashPassword,
  comparePassword,
  decodeToken
} from '../helpers/user.helpers';
import nodemailer from '../helpers/nodemailer.helper';
import { message } from '../utils/notification.utils';
import eventEmitter from '../services/event.service';
import Notification from '../services/notification.service';

config();

export default class UserController {
  constructor() {
    this.userService = new UserService();
  }

  static async getOneUser(req, res) {
    try {
      const { user } = req;
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await new UserService().getAllUsers(req.user.role_id);
      return res.status(200).json({
        message: 'Retrieved all users successfully',
        data: users
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while creating a user',
        error: error.message
      });
    }
  }

  async createUser(req, res) {
    try {
      const { first_name, last_name, email, password, role_id, location_id } =
        req.body;
      const newUser = await this.userService.createUser(
        {
          first_name,
          last_name,
          email,
          password: hashPassword(password),
          role_id: 4,
          location_id
        },
        res
      );
      const token = generateToken({ id: newUser.id }, '1d');
      await Profiles.createProfile({ user_id: newUser.id });
      const text = `
         Hello, thanks for registering on Barefoot Nomad site.
         Please copy and paste the address below into address bar to verify your account.
         ${process.env.BASE_URL}/api/v1/users/verify-email/${token}
         `;
      const code = `
      <h1><strong>Account created require verification</strong></h1>
      <p style="text-align: center;">Thank you for registering into Barefoot Nomad. Click the link below to verify and activate your account.</p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${process.env.FRONT_END_URL}/verify?token=${token}" target="_blank">Verify email</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
      `;
      const html = message(code);
      await nodemailer(newUser.email, 'Email Verification', text, html);
      return res.status(201).json({
        status: 201,
        message:
          'User registered successfully! Please check your email for verification.',
        token
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while creating a user',
        error: error.message
      });
    }
  }

  async verifyNewUser(req, res) {
    try {
      const { token } = req.params;

      const userInfo = decodeToken(token);

      const userId = userInfo.id;

      const user = await this.userService.getUserId(userId);

      await user.update({ isVerified: true }, { where: { id: userId } });
      return res.status(200).json({
        status: 200,
        message: 'Your email has been verified successfully'
      });

      // return res.redirect(`${process.env.BASE_URL}/api/v1/users/verified`);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  async userLogin(req, res) {
    try {
      const user = await this.userService.userLogin(req.body.email, res);
      const validation = await comparePassword(
        req.body.password,
        user.password
      );
      if (validation) {
        const token = await generateToken(
          {
            email: user.email,
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name
          },
          '1d'
        );
        return res.status(201).header('authenticate', token).json({
          message: 'Logged in successfully',
          token,
          role_id: user.role_id,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_picture: user.profile_picture
        });
      }
      return res.status(400).json({ message: 'Invalid password' });
    } catch (error) {
      return res.status(404).json({
        message: 'Error occured while logging in',
        error
      });
    }
  }

  static async forgot(req, res) {
    try {
      const exist = await new UserService().userExist(req.body.email);
      if (exist.email) {
        const tokenid = generateToken({ id: exist.id }, '10m');
        const code = `
        <h1><strong>You have requested to reset your password</strong></h1>
        <p>We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${process.env.FRONT_END_URL}/resetPassword?token=${tokenid}" target="_blank">Reset password</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        `;
        const html = message(code);
        await nodemailer(
          exist.email,
          'Reset password',
          'Request for reset password',
          html
        );
        return res.status(200).json({
          status: 200,
          message: 'Password reset link has been sent to your email'
        });
      } else {
        res.status(404).json({ status: 404, message: 'Email not found' });
      }
    } catch (error) {
      /* istanbul ignore next */
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async reset(req, res) {
    try {
      const { password } = req.body;
      const { token } = req.params;
      const userInfo = jwt.verify(token, process.env.SECRETE);
      const userId = userInfo.id;
      const newPassword = await bcryptjs.hash(password, 10);
      User.update({ password: newPassword }, { where: { id: userId } });
      return res
        .status(200)
        .send({ message: 'Your new password has been set return to Login' });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  async googleLogin(req, res) {
    try {
      const profile = req.user;

      let user = await new UserService().getUser(profile.emails[0].value);

      if (!user) {
        user = await new UserService().createUser({
          email: profile.emails && profile.emails[0].value,
          password: null,
          role_id: 4,
          first_name: profile.name && profile.name.familyName,
          last_name:
            profile.name &&
            [profile.name.middleName, profile.name.givenName].join(' '),
          profile_picture: profile.photos && profile.photos[0].value,
          provider: 'GOOGLE',
          isVerified: true,
          location_id: 1
        });

        await Profiles.createProfile({ user_id: user.id });
      }

      const token = generateToken(
        {
          email: user.email,
          userId: user.id,
          firstName: user.first_name,
          lastName: user.last_name
        },
        '1d'
      );

      const params = new URLSearchParams();
      params.set('email', user.email);
      params.set('first_name', user.first_name);
      params.set('last_name', user.last_name);
      params.set('profile_picture', user.profile_picture);
      params.set('role_id', user.role_id);
      params.set('token', token);

      return res
        .status(200)
        .send(
          `<script> window.location = "${fs.readFileSync(
            'FE_BASE_URL'
          )}/?${params}"</script>`
        );
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while logging in',
        data: error.message
      });
    }
  }

  async facebookLogin(req, res) {
    try {
      const profile = req.user;

      let user = await new UserService().getUser(profile.emails[0].value);

      if (!user) {
        user = await new UserService().createUser({
          email: profile.emails && profile.emails[0].value,
          password: null,
          role_id: 4,
          first_name: profile.name && profile.name.familyName,
          last_name:
            profile.name &&
            [profile.name.middleName, profile.name.givenName].join(' '),
          profile_picture: profile.photos && profile.photos[0].value,
          provider: 'FACEBOOK',
          isVerified: true,
          location_id: 1
        });

        await Profiles.createProfile({ user_id: user.id });
      }

      const token = generateToken(
        {
          email: user.email,
          userId: user.id,
          firstName: user.first_name,
          lastName: user.last_name
        },
        '1d'
      );

      const params = new URLSearchParams();
      params.set('email', user.email);
      params.set('first_name', user.first_name);
      params.set('last_name', user.last_name);
      params.set('profile_picture', user.profile_picture);
      params.set('role_id', user.role_id);
      params.set('token', token);

      return res
        .status(200)
        .send(
          `<script> window.location = "${fs.readFileSync(
            'FE_BASE_URL'
          )}/?${params}"</script>`
        );
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while logging in',
        data: error.message
      });
    }
  }

  async githubLogin(req, res) {
    try {
      const profile = req.user;

      let user = await new UserService().getUser(profile.emails[0].value);

      if (!user) {
        user = await new UserService().createUser({
          email: profile.emails && profile.emails[0].value,
          password: null,
          role_id: 4,
          first_name: profile.name && profile.name.familyName,
          last_name:
            profile.name &&
            [profile.name.middleName, profile.name.givenName].join(' '),
          profile_picture: profile.photos && profile.photos[0].value,
          provider: 'FACEBOOK',
          isVerified: true,
          location_id: 1
        });

        await Profiles.createProfile({ user_id: user.id });
      }

      const token = generateToken(
        {
          email: user.email,
          userId: user.id,
          firstName: user.first_name,
          lastName: user.last_name
        },
        '1d'
      );

      const params = new URLSearchParams();
      params.set('email', user.email);
      params.set('first_name', user.first_name);
      params.set('last_name', user.last_name);
      params.set('profile_picture', user.profile_picture);
      params.set('role_id', user.role_id);
      params.set('token', token);

      return res
        .status(200)
        .send(
          `<script> window.location = "${fs.readFileSync(
            'FE_BASE_URL'
          )}/?${params}"</script>`
        );
    } catch (error) {
      return res.status(500).json({
        message: 'Error occured while logging in',
        data: error.message
      });
    }
  }

  async Logout(req, res) {
    try {
      const user = await this.userService.userLogout(
        req.headers.authorization.split(' ')[1]
      );
      /* istanbul ignore next */
      if (user.first_name) {
        return res.status(200).json({
          message: `You have been logged out ${user.first_name} ${user.last_name}`
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error.message,
        message: 'error occured while logging you out'
      });
    }
  }

  async profileUpdate(req, res) {
    try {
      const { user } = req;
      const {
        first_name,
        last_name,
        occupation,
        language,
        nationality,
        bio,
        age,
        gender,
        date_of_birth,
        location_id,
        profile_picture,
        email_notification,
        in_app_notification,
        country
      } = req.profile.value;
      const updatedUser = await this.userService.updateUserProfile(
        {
          first_name,
          last_name,
          location_id,
          email_notification,
          in_app_notification,
          profile_picture
        },
        {
          occupation,
          language,
          nationality,
          bio,
          age,
          gender,
          date_of_birth,
          country
        },
        user.id
      );
      return res.status(200).json({
        message: 'Profile updated',
        data: [
          updatedUser.user[0] && updatedUser.user[1][0],
          updatedUser.profile[0] && updatedUser.profile[1][0]
        ]
      });
      //
    } catch (error) {
      /* istanbul ignore next */
      return res.status(500).json({
        message: 'Error occured while updating your profile',
        error
      });
    }
  }

  static async assignUserToManager(req, res) {
    try {
      const { userId, managerId } = req.body;
      const userExist = await UserService.findById(userId);

      if (userExist) {
        const manager = await UserService.findById(managerId);
        if (manager && manager.Role.name === 'MANAGER') {
          await UserService.update({ manager_id: managerId }, { id: userId });
          /* istanbul ignore next */
          if (userExist.in_app_notification === true) {
            const notify = await Notification.createNotification({
              details: `You have been assigned to Manager ${manager.first_name} ${manager.last_name}`,
              type: 'assign',
              from_user_id: manager.id,
              to_user_id: userExist.id
            });
            eventEmitter.emit('appNotification', {
              recipient: userExist,
              notify
            });
          }
          return res.status(200).send({ message: 'User assigned to manager' });
        }

        return res.status(400).send({ message: 'No Manger with such Id' });
      }
      return res.status(400).send({ message: 'No user with such Id' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}
