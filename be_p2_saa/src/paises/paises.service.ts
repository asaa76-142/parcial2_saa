import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaiseDto } from './dto/create-paise.dto';
import { UpdatePaiseDto } from './dto/update-paise.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paises } from './entities/paises.entity';

@Injectable()
export class PaisesService {
  constructor(
    @InjectRepository(Paises) private paisesRepository: Repository<Paises>,
  ) {}

  async create(createPaisesDto: CreatePaiseDto): Promise<Paises> {
    const existe = await this.paisesRepository.findOneBy({
      descripcion: createPaisesDto.descripcion.trim(),
    });

    if (existe) throw new ConflictException('El Pais ya existe');

    const paises = new Paises();
    paises.descripcion = createPaisesDto.descripcion.trim();
    return this.paisesRepository.save(paises);
  }

  async findAll(): Promise<Paises[]> {
    return this.paisesRepository.find({
      select: {
        id: true,
        descripcion: true,
      },
    });
  }

  async findOne(id: number): Promise<Paises> {
    const paises = await this.paisesRepository.findOne({
      where: { id },
    });

    if (!paises) throw new NotFoundException('El pais no existe');

    return paises;
  }

  // async findAllByPaise(idArtista: number): Promise<Paises[]> {
  //   return this.paisesRepository.findBy({ idArtista });
  // }

  async update(id: number, updatePaiseDto: UpdatePaiseDto): Promise<Paises> {
    const paises = await this.findOne(id);
    Object.assign(paises, updatePaiseDto);
    return this.paisesRepository.save(paises);
  }

  async remove(id: number) {
    const paises = await this.findOne(id);
    return this.paisesRepository.softRemove(paises);
  }
}
