import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlayRouletteDto {
  @ApiProperty({ description: 'Bet amount in coins', minimum: 10 })
  @IsNumber()
  @Min(10, { message: 'Minimum bet is 10 coins' })
  betAmount: number;
}
