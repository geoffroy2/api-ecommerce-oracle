import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
// import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Store } from 'src/store/entities/store.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret-generate-eam',
    });
  }

  async validate(payload: any) {
    const store = await this.storeRepository.findOne({
      where: { id: payload.id },
    });
    if (!store) {
      throw new UnauthorizedException('Login first to access this ressources');
    }
    return {
      userId: store.id,
      email: store.email,
    };
  }
}
