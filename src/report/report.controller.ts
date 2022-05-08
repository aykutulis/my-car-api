import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ReportService } from './report.service';
import { Serialize } from '../interceptors/serialize-interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dts';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('/reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  updateReport(@Param('id') id: number, @Body() body: ApproveReportDto) {
    return this.reportService.changeApproval(id, body.approved);
  }

  @Get()
  async getEstimate(@Query() query: GetEstimateDto) {
    const report = await this.reportService.createEstimate(query);
    console.log(report);
    return report;
  }
}
