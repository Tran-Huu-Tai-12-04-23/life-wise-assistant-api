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
import { UserEntity } from 'src/entities';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { ColumnService } from './column.service';
import {
  ColumnDTO,
  GetAllColumnsDTO,
  GetDataToFilterDTO,
  SwapColDTO,
} from './dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Columns CRUD')
@Controller('column')
export class ColumnController {
  constructor(private readonly service: ColumnService) {}

  @ApiOperation({
    summary: 'Get data to filter',
  })
  @ApiResponse({ status: 201 })
  @Post('filter-data')
  async getDataToFilter(@Body() getDataToFilter: GetDataToFilterDTO) {
    return await this.service.getDataToFIlter(getDataToFilter);
  }

  @ApiOperation({
    summary: 'Get all column of team',
  })
  @ApiResponse({ status: 201 })
  @Post('team')
  async getAllOfTeam(
    @Body() getAllColumnDTO: GetAllColumnsDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.getAll(getAllColumnDTO, user);
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

  @ApiOperation({ summary: 'Sort task when has bugs hihi' })
  @Get('reset-task')
  async resetTask() {
    return await this.service.resetTask();
  }
}
