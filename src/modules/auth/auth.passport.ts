import * as crypto from 'crypto';
import { config } from 'dotenv';
import fetch from 'node-fetch';
import * as passport from 'passport';
import {
  Profile as GitHubProfile,
  Strategy as GitHubStrategy,
} from 'passport-github2';
import {
  Profile as GoogleProfile,
  Strategy as GoogleStrategy,
} from 'passport-google-oauth20';

import { Strategy as FacebookStrategy } from 'passport-facebook';

config();

const secretKey = crypto.randomBytes(64).toString('hex');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: `${process.env.NEXT_PUBLIC_URL_GITHUB}`,
      scope: ['user:email'],
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: (error: any, user?: any) => void,
    ) {
      if (!profile.emails || profile.emails.length === 0) {
        try {
          const fetch = await import('node-fetch').then((mod) => mod.default);
          const response = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `token ${accessToken}`,
              'User-Agent': 'Node.js',
            },
          });
          const emails = await response.json();
          profile.emails = emails.map((email: { email: string }) => ({
            value: email.email,
          }));
        } catch (error) {
          return done(error);
        }
      }
      return done(null, profile);
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.NEXT_PUBLIC_URL_GOOGLE}`,
      scope: ['profile', 'email'],
      proxy: true, // Thêm dòng này
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: (error: any, user?: any) => void,
    ) {
      if (!profile.emails || profile.emails.length === 0) {
        try {
          const response = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo?access_token=' +
              accessToken,
          );
          const userInfo = await response.json();
          profile.emails = [{ value: userInfo.email, verified: true }];
        } catch (error) {
          return done(error);
        }
      }
      return done(null, profile);
    },
  ),
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      callbackURL: `${process.env.NEXT_PUBLIC_URL_FACEBOOK}`,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done: (err: any, user?: any) => void) => {
  done(null, obj);
});

export { passport, secretKey };
