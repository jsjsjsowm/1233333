import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PlayRouletteDto } from './dto/play-roulette.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async playRoulette(userId: string, playRouletteDto: PlayRouletteDto) {
    const { betAmount } = playRouletteDto;
    
    // Get user and check balance
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.balance < betAmount) {
      throw new BadRequestException('Insufficient balance');
    }

    if (betAmount < 10) {
      throw new BadRequestException('Minimum bet is 10 coins');
    }

    // Generate random number (0-36)
    const result = Math.floor(Math.random() * 37);
    
    // Determine win/loss (simplified: even numbers win, odd lose, 0 loses)
    const isWin = result > 0 && result % 2 === 0;
    const winAmount = isWin ? betAmount * 1.5 : 0;
    const balanceChange = isWin ? winAmount - betAmount : -betAmount;

    // Create game record and update balance in transaction
    const [game] = await this.prisma.$transaction([
      this.prisma.game.create({
        data: {
          userId,
          betAmount,
          winAmount: isWin ? winAmount : null,
          result,
          isWin,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.BET,
          amount: -betAmount,
          description: `Roulette bet - Result: ${result}`,
        },
      }),
      ...(isWin ? [
        this.prisma.transaction.create({
          data: {
            userId,
            type: TransactionType.WIN,
            amount: winAmount,
            description: `Roulette win - Result: ${result}`,
          },
        })
      ] : []),
    ]);

    // Get updated user balance
    const updatedUser = await this.usersService.findById(userId);

    return {
      gameId: game.id,
      result,
      isWin,
      betAmount,
      winAmount: isWin ? winAmount : 0,
      newBalance: updatedUser.balance,
      message: isWin ? 'Поздравляем! Вы выиграли!' : 'Удача в следующий раз!',
    };
  }

  async getGameHistory(userId: string, limit = 20) {
    return this.prisma.game.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getGameStats(userId: string) {
    const totalGames = await this.prisma.game.count({
      where: { userId },
    });

    const totalWins = await this.prisma.game.count({
      where: { userId, isWin: true },
    });

    const totalBetAmount = await this.prisma.game.aggregate({
      where: { userId },
      _sum: { betAmount: true },
    });

    const totalWinAmount = await this.prisma.game.aggregate({
      where: { userId, isWin: true },
      _sum: { winAmount: true },
    });

    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
    const netProfit = (totalWinAmount._sum.winAmount || 0) - (totalBetAmount._sum.betAmount || 0);

    return {
      totalGames,
      totalWins,
      winRate: Math.round(winRate * 100) / 100,
      totalBetAmount: totalBetAmount._sum.betAmount || 0,
      totalWinAmount: totalWinAmount._sum.winAmount || 0,
      netProfit,
    };
  }
}
