import { PageMetaDto } from '@internal/pagination/dto/page-meta.dto';
import { PageOptionsDto } from '@internal/pagination/dto/page-options.dto';
import { PageDto } from '@internal/pagination/dto/page.dto';
import { Injectable } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { AppDataSource } from '@/typeOrm.config';
import { Like } from 'typeorm';
import { Order } from '@internal/pagination/order.enum';

@Injectable()
export class PaginationService {
  async findAll(entity: EntityClassOrSchema, pageOptionsDto: PageOptionsDto) {
    const repository = AppDataSource.getRepository(entity);
    const { tableName } = repository.metadata;

    const { skip, take, search, order } = pageOptionsDto;

    if (!pageOptionsDto) {
      return await repository.find();
    }

    const [users, itemCount] = await repository.findAndCount({
      relations: this.getRelations(tableName),
      skip,
      take,
      where: this.getWhere(tableName, search),
      order: this.getOrder(tableName, order),
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptions: pageOptionsDto,
    });

    return new PageDto(users, pageMetaDto);
  }

  getWhere(tableName: string, search: string) {
    switch (tableName) {
      case 'users':
        return [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ];
      case 'roles':
        return { name: Like(`%${search}%`) };
      default:
        return {};
    }
  }

  getOrder(tableName: string, order: Order) {
    switch (tableName) {
      case 'users':
        return { email: order };
      default:
        return {};
    }
  }

  getRelations(tableName: string) {
    switch (tableName) {
      case 'users':
        return ['roles'];
      case 'roles':
        return ['permissions'];
      default:
        return {};
    }
  }
}
