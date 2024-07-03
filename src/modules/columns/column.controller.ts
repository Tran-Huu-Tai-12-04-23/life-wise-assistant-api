import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ColumnService } from './column.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CurrentUser } from 'src/helpers/decorators';
import { UserEntity } from 'src/entities';
import { ColumnDTO } from './dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Columns CRUD')
@Controller('column')
export class ColumnController {
  constructor(private readonly service: ColumnService) {}

  @ApiOperation({
    summary: 'Get all column of team',
  })
  @ApiResponse({ status: 201 })
  @Get(':id')
  async getAllOfTeam(@Param('id') id: string) {
    return await this.service.getAll(id);
  }
  @ApiOperation({
    summary: 'Create new column',
  })
  @ApiResponse({ status: 201 })
  @Post()
  async create(@Body() columnDTO: ColumnDTO, @CurrentUser() user: UserEntity) {
    return await this.service.create(columnDTO, user);
  }

  @ApiOperation({
    summary: 'Update column',
  })
  @ApiResponse({ status: 201 })
  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() columnDTO: ColumnDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.update(id, columnDTO, user);
  }

  @ApiOperation({
    summary: 'Delete column',
  })
  @ApiResponse({ status: 201 })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
