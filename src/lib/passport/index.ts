import passport from 'passport'
import { accessTokenStrategy, refreshTokenStrategy } from './jwt-strategy.js';
import { localStrategy } from './local-strategy.js'

passport.use('local', localStrategy);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

export default passport;