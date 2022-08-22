import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/shared/auth/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret-generate-eam',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [StoreController],
  providers: [StoreService, JwtStrategy],
  exports: [StoreService],
})
export class StoreModule {}
