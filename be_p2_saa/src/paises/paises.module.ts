import { Module } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { PaisesController } from './paises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paises } from './entities/paises.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paises])],
  controllers: [PaisesController],
  providers: [PaisesService],
})
export class PaisesModule {}
