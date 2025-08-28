import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        games: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async findByTelegramId(telegramId: string) {
    return this.prisma.user.findUnique({
      where: { telegramId },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateBalance(id: string, amount: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }

  async getProfile(id: string) {
    const user = await this.findById(id);
    if (!user) return null;

    const totalGames = await this.prisma.game.count({
      where: { userId: id },
    });

    const totalWins = await this.prisma.game.count({
      where: { userId: id, isWin: true },
    });

    const totalWinnings = await this.prisma.game.aggregate({
      where: { userId: id, isWin: true },
      _sum: { winAmount: true },
    });

    const totalLosses = await this.prisma.game.aggregate({
      where: { userId: id, isWin: false },
      _sum: { betAmount: true },
    });

    return {
      ...user,
      stats: {
        totalGames,
        totalWins,
        winRate: totalGames > 0 ? (totalWins / totalGames) * 100 : 0,
        totalWinnings: totalWinnings._sum.winAmount || 0,
        totalLosses: totalLosses._sum.betAmount || 0,
      },
    };
  }
}
