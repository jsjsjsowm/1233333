import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TelegramAuthDto } from './dto/telegram-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async authenticateWithTelegram(telegramData: TelegramAuthDto) {
    // Verify Telegram data integrity
    if (!this.verifyTelegramAuth(telegramData)) {
      throw new UnauthorizedException('Invalid Telegram authentication data');
    }

    // Find or create user
    let user = await this.usersService.findByTelegramId(telegramData.id.toString());
    
    if (!user) {
      user = await this.usersService.create({
        telegramId: telegramData.id.toString(),
        username: telegramData.username,
        firstName: telegramData.first_name,
        lastName: telegramData.last_name,
      });
    } else {
      // Update user info
      user = await this.usersService.update(user.id, {
        username: telegramData.username,
        firstName: telegramData.first_name,
        lastName: telegramData.last_name,
      });
    }

    // Generate JWT token
    const payload = { sub: user.id, telegramId: user.telegramId };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance,
      },
    };
  }

  private verifyTelegramAuth(data: TelegramAuthDto): boolean {
    // In production, implement proper Telegram WebApp data verification
    // For now, we'll do basic validation
    return !!(data.id && data.auth_date);
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
