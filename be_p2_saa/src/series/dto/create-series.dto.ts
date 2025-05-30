import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Paises } from 'src/paises/entities/paises.entity';

export class CreateSeriesDto {
  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo idPais debe estar definido' })
  @IsInt({ message: 'El campo idPais debe ser de tipo numérico' })
  readonly idPais: Paises['id'];

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo titulo no debe ser vacío' })
  @IsString({ message: 'El campo titulo debe ser de tipo cadena' })
  @MaxLength(250, {
    message: 'El campo titulo no debe ser mayor a 250 caracteres',
  })
  readonly titulo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo sinopsis no debe ser vacío' })
  @IsString({ message: 'El campo sinopsis debe ser de tipo cadena' })
  @MaxLength(5000, {
    message: 'El campo sinopsis no debe ser mayor a 5000 caracteres',
  })
  readonly sinopsis: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo director no debe ser vacío' })
  @IsString({ message: 'El campo director debe ser de tipo cadena' })
  @MaxLength(100, {
    message: 'El campo director no debe ser mayor a 100 caracteres',
  })
  readonly director: string;

  @ApiProperty()
  @IsDefined({ message: 'El campo temporadas debe estar definido' })
  @IsInt({ message: 'El campo temporadas debe ser de tipo numérico' })
  readonly temporadas: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo fechaEstreno debe estar definido' })
  @IsDateString({}, { message: 'El campo fechaEstreno debe ser tipo fecha' })
  readonly fechaEstreno: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo tipo de clasificacion no debe ser vacío' })
  @IsString({
    message: 'El campo tipo de clasificacion debe ser de tipo cadena',
  })
  @MaxLength(50, {
    message:
      'El campo tipo de clasificacion no debe ser mayor a 5000 caracteres',
  })
  readonly tipoClasificacion: string;
}
