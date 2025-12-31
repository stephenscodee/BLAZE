import { Controller, Post, Body, Get, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { GenerationsService } from './generations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerationStatus } from '@prisma/client';

@Controller('generations')
export class GenerationsController {
  constructor(private readonly generationsService: GenerationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() body: any) {
    return this.generationsService.create({
      ...body,
      userId: req.user.userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generationsService.findOne(id);
  }

  // Internal endpoint for AI Service (should be protected by an internal API KEY in production)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: GenerationStatus; assets?: any[]; errorMessage?: string }
  ) {
    return this.generationsService.updateStatus(id, body);
  }
}
