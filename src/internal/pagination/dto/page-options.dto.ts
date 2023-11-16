import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from '@internal/pagination/order.enum';
import { Type } from 'class-transformer';

export class PageOptionsDto {
  @ApiProperty()
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiProperty({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({ minimum: 1, maximum: 50, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly search?: string = '';

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
