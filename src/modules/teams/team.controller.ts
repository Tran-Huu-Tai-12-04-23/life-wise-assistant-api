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
import { RemoveUserTeamDTO, TeamDTO } from './dto';
import { TeamsService } from './team.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CurrentUser } from 'src/helpers/decorators';
import { UserEntity } from 'src/entities';
import { TeamEntity } from 'src/entities/team.entity';
import { PaginationDTO } from '../dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Teams CRUD')
@Controller('team')
export class TeamController {
  constructor(private readonly service: TeamsService) {}

  @ApiOperation({
    summary: 'Create new team',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Post()
  async create(@Body() teamDTO: TeamDTO, @CurrentUser() user: UserEntity) {
    return await this.service.create(teamDTO, user);
  }

  @ApiOperation({
    summary: 'Pagination all teams',
  })
  @ApiResponse({ status: 200 })
  @Post('pagination')
  async pagination(@Body() paginationDTO: PaginationDTO) {
    return await this.service.pagination(paginationDTO);
  }

  @ApiOperation({
    summary: 'Find detail of team',
  })
  @ApiResponse({ status: 200, type: TeamEntity })
  @Get(':id')
  async detail(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.service.detail(id, user);
  }

  @ApiOperation({
    summary: 'Remove user from team',
  })
  @ApiResponse({ status: 200, type: TeamEntity })
  @Put()
  async update(@Body() removeUserTeamDTO: RemoveUserTeamDTO) {
    return await this.service.removeUserFromTeam(removeUserTeamDTO);
  }

  @ApiOperation({
    summary: 'Delete soft team by id',
  })
  @ApiResponse({ status: 200, type: TeamEntity })
  @Delete(':id')
  async deleteSoft(@Param('id') id: string) {
    return await this.service.deleteTeam(id);
  }
  @ApiOperation({
    summary: 'Delete team by id',
  })
  @ApiResponse({ status: 200, type: TeamEntity })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.forceDeleteTeam(id);
  }
}
