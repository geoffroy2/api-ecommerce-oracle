import { Module } from '@nestjs/common';
import { ScentService } from './scent.service';
import { ScentController } from './scent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scent } from './entities/scent.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scent]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ScentController],
  providers: [ScentService],
  exports: [ScentService],
})
export class ScentModule {}
