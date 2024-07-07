import {
  Body,
  Controller,
  Delete,
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
import { ColumnDTO, GetAllColumnsDTO, SwapColDTO } from './dto';

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
  @Post('team')
  async getAllOfTeam(@Body() getAllColumnDTO: GetAllColumnsDTO) {
    return await this.service.getAll(getAllColumnDTO);
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
    summary: 'Swap between columns',
  })
  @ApiResponse({ status: 201 })
  @Post('swap-between-col')
  async swapBetweenCol(@Body() swapBetweenColDTO: SwapColDTO) {
    return await this.service.swapCol(swapBetweenColDTO);
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
