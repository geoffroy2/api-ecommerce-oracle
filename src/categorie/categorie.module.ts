import { Module } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CategorieController } from './categorie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorie } from './entities/categorie.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/shared/auth/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categorie]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CategorieController],
  providers: [CategorieService],
  exports: [CategorieService],
})
export class CategorieModule {}
