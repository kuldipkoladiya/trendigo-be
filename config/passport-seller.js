import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import SellerUser from 'models/sellerUser.model';
import config from './config';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
};

const jwtVerify = async (payload, done) => {
  try {
    const seller = await SellerUser.findById(payload.sub);
    if (!seller) {
      return done(null, false);
    }
    return done(null, seller);
  } catch (error) {
    return done(error, false);
  }
};

const sellerJwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default sellerJwtStrategy;
