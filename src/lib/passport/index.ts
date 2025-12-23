import passport from 'passport'
import { accessTokenStrategy, refreshTokenStrategy } from './jwt-strategy.js';

passport.use('local', localStrategy);
passport.use('accessToken', accessTokenStrategy);
passport.use('refreshToken', refreshTokenStrategy);

export default passport;