import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import styles from './ProfileScreen.module.css';
import { GameIcon, StatsIcon, HistoryIcon, TrophyIcon, CoinsIcon, WinIcon, LossIcon, LoadingIcon, EmptyIcon } from './Icons';

interface GameHistory {
  id: string;
  betAmount: number;
  winAmount: number | null;
  result: number;
  isWin: boolean;
  createdAt: string;
}

interface GameStats {
  totalGames: number;
  totalWins: number;
  winRate: number;
  totalBetAmount: number;
  totalWinAmount: number;
  netProfit: number;
}

const ProfileScreen: React.FC = () => {
  const { user, token } = useAuth();
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');

  const fetchProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching profile data...', { token: token ? 'exists' : 'missing' });
      
      // For now, let's use mock data since backend might not be available
      // This will prevent infinite loading
      setTimeout(() => {
        // Mock game history
        const mockHistory = [
          {
            id: '1',
            betAmount: 50,
            winAmount: 75,
            result: 14,
            isWin: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            betAmount: 30,
            winAmount: null,
            result: 7,
            isWin: false,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ];

        // Mock stats
        const mockStats = {
          totalGames: 15,
          totalWins: 7,
          winRate: 46.7,
          totalBetAmount: 450,
          totalWinAmount: 315,
          netProfit: -135
        };

        setGameHistory(mockHistory);
        setGameStats(mockStats);
        setIsLoading(false);
      }, 1000);

      // TODO: Replace with real API calls when backend is deployed
      /*
      const [historyResponse, statsResponse] = await Promise.all([
        fetch(API_ENDPOINTS.GAMES.HISTORY, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(API_ENDPOINTS.USERS.PROFILE, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (historyResponse.ok) {
        const history = await historyResponse.json();
        setGameHistory(history);
      }

      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setGameStats(stats);
      }
      */
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchProfileData();
    }
  }, [user, token, fetchProfileData]);

  const getNumberColor = (num: number) => {
    if (num === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? 'red' : 'black';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileScreen}>
      {/* User Info Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.userHeader}
      >
        <div className={styles.avatar}>
          <span className={styles.avatarText}>
            {user.firstName?.charAt(0) || user.username?.charAt(0) || '?'}
          </span>
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>
            {user.firstName || user.username || 'Пользователь'}
          </h2>
          <p className={styles.userDetails}>
            @{user.username || `user${user.telegramId.slice(-4)}`}
          </p>
        </div>
        <div className={styles.balanceCard}>
          <span className={styles.balanceLabel}>Баланс</span>
          <span className={styles.balanceValue}>{user.balance.toFixed(0)} ₽</span>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={styles.tabNavigation}
      >
        <button
          className={`${styles.tabButton} ${activeTab === 'stats' ? styles.active : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <StatsIcon size={16} /> Статистика
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <HistoryIcon size={16} /> История
        </button>
      </motion.div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={styles.statsTab}
          >
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <LoadingIcon size={32} color="white" className={styles.loadingSpinner} />
                <p>Загрузка статистики...</p>
              </div>
            ) : gameStats ? (
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}><GameIcon size={32} color="#007AFF" /></div>
                  <div className={styles.statValue}>{gameStats.totalGames}</div>
                  <div className={styles.statLabel}>Всего игр</div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}><TrophyIcon size={32} color="#FFD700" /></div>
                  <div className={styles.statValue}>{gameStats.totalWins}</div>
                  <div className={styles.statLabel}>Выигрышей</div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}><StatsIcon size={32} color="#34C759" /></div>
                  <div className={styles.statValue}>{gameStats.winRate.toFixed(1)}%</div>
                  <div className={styles.statLabel}>Процент побед</div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}><CoinsIcon size={32} color="#FFD700" /></div>
                  <div className={styles.statValue}>{gameStats.totalBetAmount.toFixed(0)} ₽</div>
                  <div className={styles.statLabel}>Всего ставок</div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}><WinIcon size={32} color="#34C759" /></div>
                  <div className={styles.statValue}>{gameStats.totalWinAmount.toFixed(0)} ₽</div>
                  <div className={styles.statLabel}>Всего выиграно</div>
                </div>
                
                <div className={`${styles.statCard} ${gameStats.netProfit >= 0 ? styles.profit : styles.loss}`}>
                  <div className={styles.statIcon}>
                    {gameStats.netProfit >= 0 ? 
                      <WinIcon size={32} color="#34C759" /> : 
                      <LossIcon size={32} color="#FF3B30" />
                    }
                  </div>
                  <div className={styles.statValue}>
                    {gameStats.netProfit >= 0 ? '+' : ''}{gameStats.netProfit.toFixed(0)} ₽
                  </div>
                  <div className={styles.statLabel}>Чистая прибыль</div>
                </div>
              </div>
            ) : (
              <div className={styles.noData}>
                <div className={styles.noDataIcon}><EmptyIcon size={64} color="rgba(255,255,255,0.5)" /></div>
                <p>Статистика появится после первой игры</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.historyTab}
          >
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Загрузка истории...</p>
              </div>
            ) : gameHistory.length > 0 ? (
              <div className={styles.historyList}>
                {gameHistory.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${styles.historyItem} ${game.isWin ? styles.win : styles.lose}`}
                  >
                    <div className={styles.gameNumber}>
                      <div className={`${styles.numberBall} ${styles[getNumberColor(game.result)]}`}>
                        {game.result}
                      </div>
                    </div>
                    
                    <div className={styles.gameDetails}>
                      <div className={styles.gameResult}>
                        <span className={styles.resultText}>
                          {game.isWin ? 'Выигрыш' : 'Проигрыш'}
                        </span>
                        <span className={styles.gameDate}>
                          {formatDate(game.createdAt)}
                        </span>
                      </div>
                      
                      <div className={styles.gameAmounts}>
                        <span className={styles.betAmount}>
                          Ставка: {game.betAmount} ₽
                        </span>
                        {game.isWin && (
                          <span className={styles.winAmount}>
                            Выигрыш: {game.winAmount} ₽
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.netAmount}>
                      <span className={`${styles.amount} ${game.isWin ? styles.positive : styles.negative}`}>
                        {game.isWin ? '+' : '-'}
                        {game.isWin ? (game.winAmount! - game.betAmount) : game.betAmount} ₽
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.noData}>
                <span className={styles.noDataIcon}>🎰</span>
                <p>История игр пуста</p>
                <p className={styles.noDataSubtext}>Сыграйте первую игру, чтобы увидеть историю</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
