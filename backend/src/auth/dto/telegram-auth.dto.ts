import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TelegramAuthDto {
  @ApiProperty({ description: 'Telegram user ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'First name', required: false })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ description: 'Username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Photo URL', required: false })
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiProperty({ description: 'Auth date timestamp' })
  @IsNumber()
  auth_date: number;

  @ApiProperty({ description: 'Hash for verification' })
  @IsString()
  hash: string;
}
