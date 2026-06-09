import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { RequirePolicy } from '../authorization/decorators/require-policy.decorator';
import { HomeService } from './home.service';


@Controller()
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('students/:studentId/home')
  @RequirePolicy('home.read_by_student')
  getStudentHome(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.homeService.getStudentHome(studentId);
  }
}
