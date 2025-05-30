import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series) private seriesReposiroty: Repository<Series>,
  ) {}

  async create(createSeriesDto: CreateSeriesDto): Promise<Series> {
    const existe = await this.seriesReposiroty.findOneBy({
      idPais: createSeriesDto.idPais,
      titulo: createSeriesDto.titulo.trim(),
      sinopsis: createSeriesDto.sinopsis.trim(),
      director: createSeriesDto.director.trim(),
      temporadas: createSeriesDto.temporadas,
      fechaEstreno: createSeriesDto.fechaEstreno,
      tipoClasificacion: createSeriesDto.tipoClasificacion,
    });
    if (existe) throw new ConflictException('La serie ya existe');

    const series = new Series();
    series.idPais = createSeriesDto.idPais;
    series.titulo = createSeriesDto.titulo.trim();
    series.sinopsis = createSeriesDto.sinopsis.trim();
    series.director = createSeriesDto.director.trim();
    series.temporadas = createSeriesDto.temporadas;
    series.fechaEstreno = createSeriesDto.fechaEstreno;
    series.tipoClasificacion = createSeriesDto.tipoClasificacion;
    return this.seriesReposiroty.save(series);
  }

  async findAll(): Promise<Series[]> {
    return this.seriesReposiroty.find({
      relations: { paises: true },
      select: {
        id: true,
        titulo: true,
        sinopsis: true,
        director: true,
        temporadas: true,
        fechaEstreno: true,
        tipoClasificacion: true,
        paises: { id: true, descripcion: true },
      },
      // order: { album: { artista: { nombre: 'ASC' } }, nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Series> {
    const series = await this.seriesReposiroty.findOne({
      where: { id },
      relations: { paises: true },
    });

    if (!series) throw new NotFoundException('La serie no existe');
    return series;
  }

  // async findAllByPais(idPais: number): Promise<Series[]> {
  //   return this.seriesReposiroty.findBy({ idPais });
  // }

  async update(id: number, updateSeriesDto: UpdateSeriesDto): Promise<Series> {
    const series = await this.findOne(id);
    const generoUpdate = Object.assign(series, updateSeriesDto);
    return this.seriesReposiroty.save(generoUpdate);
  }

  async remove(id: number) {
    const series = await this.findOne(id);
    return this.seriesReposiroty.softRemove(series);
  }
}
