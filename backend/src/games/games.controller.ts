import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { GamesService } from './games.service';
import { PlayRouletteDto } from './dto/play-roulette.dto';

@ApiTags('games')
@Controller('games')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post('roulette/play')
  @ApiOperation({ summary: 'Play roulette game' })
  @ApiResponse({ status: 200, description: 'Game played successfully' })
  @ApiResponse({ status: 400, description: 'Invalid bet or insufficient balance' })
  async playRoulette(@CurrentUser() user: any, @Body() playRouletteDto: PlayRouletteDto) {
    return this.gamesService.playRoulette(user.id, playRouletteDto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get game history' })
  @ApiResponse({ status: 200, description: 'Game history retrieved successfully' })
  async getGameHistory(@CurrentUser() user: any, @Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 20;
    return this.gamesService.getGameHistory(user.id, limitNumber);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get game statistics' })
  @ApiResponse({ status: 200, description: 'Game stats retrieved successfully' })
  async getGameStats(@CurrentUser() user: any) {
    return this.gamesService.getGameStats(user.id);
  }
}
