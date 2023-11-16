import { Module } from '@nestjs/common';
import { PaginationService } from '@internal/pagination/pagination.service';

@Module({
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {}
