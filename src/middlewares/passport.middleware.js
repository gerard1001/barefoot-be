import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GithubStrategy } from 'passport-github';
import 'dotenv';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      done(null, { email, password });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRETE,
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true,
      scope: 'https://www.googleapis.com/auth/user.addresses.read'
    },
    /* istanbul ignore next */
    // eslint-disable-next-line no-unused-vars
    /* istanbul ignore next */
    async (req, accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRETE,
      callbackURL: process.env.FB_CALLBACK_URL,
      passReqToCallback: true,
      profileFields: ['id', 'emails', 'name', 'photos']
    },
    /* istanbul ignore next */
    // eslint-disable-next-line no-unused-vars
    /* istanbul ignore next */
    async (req, accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: process.env.Github_CLIENT_ID,
//       clientSecret: process.env.Github_CLIENT_SECRETE,
//       callbackURL: process.env.Github_CALLBACK_URL,
//       passReqToCallback: true,
//       profileFields: ['id', 'emails', 'name', 'photos']
//     },
//     /* istanbul ignore next */
//     // eslint-disable-next-line no-unused-vars
//     /* istanbul ignore next */
//     async (req, accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//     }
//   )
// );

export default passport;
