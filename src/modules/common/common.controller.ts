import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CommonService } from './common.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('common module includes history module , ...')
@Controller('common')
export class CommonController {
  constructor(private readonly service: CommonService) {}
}
