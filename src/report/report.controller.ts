import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { ReportService } from './report.service';
import { Serialize } from '../interceptors/serialize-interceptor';
import { AuthGuard } from '../guards/auth-guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }
}
