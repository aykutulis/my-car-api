import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { ReportService } from './report.service';
import { AuthGuard } from '../guards/auth-guard';
import { CreateReportDto } from './dtos/create-report.dto';

@Controller('/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }
}
