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
import { TeamEntity } from 'src/entities/team.entity';
import { CurrentUser } from 'src/helpers/decorators';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PaginationDTO } from '../dto';
import {
  InviteLstMemberDTO,
  RemoveUserTeamDTO,
  TeamDTO,
  TeamInviteDTO,
  TeamPermissionUpdateDTO,
} from './dto';
import { TeamsService } from './team.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Teams CRUD')
@Controller('team')
export class TeamController {
  constructor(private readonly service: TeamsService) {}

  // #region team permission
  @ApiOperation({
    summary: 'Update team permission of user',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Put('permission')
  async updateTeamPermission(
    @Body() body: TeamPermissionUpdateDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.updateTeamPermission(body, user);
  }

  @ApiOperation({
    summary: 'Load user team permission',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Get('permission/:teamId/:userId')
  async loadUserTeamPermission(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.loadUserTeamPermission(teamId, userId, user);
  }
  // #endregion

  @ApiOperation({
    summary: 'Invited multi user',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Post('history-pagination/:teamId')
  async paginationForTeamHistory(
    @Body() data: PaginationDTO,
    @CurrentUser() user: UserEntity,
    @Param('teamId') teamId: string,
  ) {
    return await this.service.paginationForTeamHistory(data, teamId, user);
  }

  @ApiOperation({
    summary: 'Invited multi user',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Post('invite-member-to-team')
  async inviteMemberToTeam(
    @Body() data: TeamInviteDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.inviteMemberToTeam(data, user);
  }

  @ApiOperation({
    summary: 'Accept to team',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Put('accept-invite/:teamInviteId')
  async acceptInviteTeam(
    @Param('teamInviteId') teamInviteId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.acceptInviteTeam(teamInviteId, user);
  }

  @ApiOperation({
    summary: 'Reject to team',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Put('reject-invite/:teamInviteId')
  async rejectInviteTeam(
    @Param('teamInviteId') teamInviteId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.rejectInviteTeam(teamInviteId, user);
  }

  @ApiOperation({
    summary: 'Generate invite link',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Get('generate-invite-token/:teamId')
  async generateInviteToken(
    @Param('teamId') teamId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.generateInviteToken(teamId, user);
  }

  @ApiOperation({
    summary: 'Join to team by invite link',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Get('join-to-team/:token')
  async joinToTeamByLink(
    @Param('token') token: string,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.joinToTeamByLink(token, user);
  }

  @ApiOperation({
    summary: 'Create new team',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Post()
  async create(@Body() teamDTO: TeamDTO, @CurrentUser() user: UserEntity) {
    return await this.service.create(teamDTO, user);
  }

  @ApiOperation({
    summary: 'Get your workplace',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Get('work-place')
  async getYourWorkPlace(@CurrentUser() user: UserEntity) {
    return await this.service.getYourWorkPlace(user);
  }

  @ApiOperation({
    summary: 'Invite member to team',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Get('invite/:id')
  async inviteMember(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.service.addUserToTeam(id, user.id);
  }

  @ApiOperation({
    summary: 'Invite lst member to team',
  })
  @ApiResponse({ status: 201, type: TeamEntity })
  @Post('invite-multi/:id')
  async inviteLstMember(
    @Param('id') id: string,
    @Body()
    data: InviteLstMemberDTO,
  ) {
    return await this.service.addUsersToTeam(id, data);
  }

  @ApiOperation({
    summary: 'Pagination all teams',
  })
  @ApiResponse({ status: 200 })
  @Post('pagination')
  async pagination(
    @Body() paginationDTO: PaginationDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.service.pagination(paginationDTO, user);
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
