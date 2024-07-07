import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

export class PaginationDTO<T = any> {
  @ApiProperty({
    description: 'Điều kiện lọc',
    example: { code: 'xxxx', name: 'xxx xxxx xxxx' },
  })
  where: T;
  @ApiProperty({ description: 'Số record bỏ qua', example: 0 })
  skip: number;
  @ApiProperty({ description: 'Số record lấy', example: 10 })
  take: number;

  @ApiProperty({ description: 'Sắp xếp' })
  @IsObject()
  @IsOptional()
  order?: any;
}
