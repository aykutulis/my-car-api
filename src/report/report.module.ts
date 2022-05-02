import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Report } from './report.entity';

const reportTypeOrmModule = TypeOrmModule.forFeature([Report]);

@Module({
  imports: [reportTypeOrmModule],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
