import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTelegram } from '../contexts/TelegramContext';
import { API_ENDPOINTS } from '../config/api';
import RouletteWheel from './RouletteWheel';
import BettingPanel from './BettingPanel';
import GameResult from './GameResult';
import styles from './GameScreen.module.css';

interface GameResultData {
  gameId: string;
  result: number;
  isWin: boolean;
  betAmount: number;
  winAmount: number;
  newBalance: number;
  message: string;
}

const GameScreen: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameResult, setGameResult] = useState<GameResultData | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { user, token, updateBalance } = useAuth();
  const { webApp } = useTelegram();

  const handleBet = async (betAmount: number) => {
    if (!user || !token) return;

    try {
      setIsSpinning(true);
      setGameResult(null);
      setShowResult(false);

      // Haptic feedback
      webApp?.HapticFeedback?.impactOccurred('medium');

      const response = await fetch(API_ENDPOINTS.GAMES.PLAY_ROULETTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ betAmount }),
      });

      if (!response.ok) {
        throw new Error('Failed to place bet');
      }

      const result = await response.json();
      setGameResult(result);
      
      // Update balance in context
      updateBalance(result.newBalance);
      
    } catch (error) {
      console.error('Bet error:', error);
      webApp?.HapticFeedback?.notificationOccurred('error');
      setIsSpinning(false);
    }
  };

  const handleSpinComplete = (result: number) => {
    setIsSpinning(false);
    setShowResult(true);
    
    // Haptic feedback based on result
    if (gameResult?.isWin) {
      webApp?.HapticFeedback?.notificationOccurred('success');
    } else {
      webApp?.HapticFeedback?.notificationOccurred('error');
    }
  };

  const handlePlayAgain = () => {
    setShowResult(false);
    setGameResult(null);
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
    <div className={styles.gameScreen}>
      <div className={styles.gameContainer}>
        {/* Game Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.gameTitle}
        >
          <h2>Европейская рулетка</h2>
          <p>Ставьте и выигрывайте!</p>
        </motion.div>

        {/* Roulette Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.wheelSection}
        >
          <RouletteWheel 
            onSpinComplete={handleSpinComplete}
            isSpinning={isSpinning}
            targetNumber={gameResult?.result}
          />
        </motion.div>

        {/* Game Status */}
        <AnimatePresence mode="wait">
          {isSpinning && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.statusMessage}
            >
              <div className={styles.spinningIndicator}>
                <div className={styles.spinner}></div>
                <span>Крутим колесо...</span>
              </div>
            </motion.div>
          )}
          
          {showResult && gameResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={styles.resultSection}
            >
              <GameResult 
                result={gameResult}
                onPlayAgain={handlePlayAgain}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Betting Panel */}
        {!isSpinning && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.bettingSection}
          >
            <BettingPanel 
              onBet={handleBet}
              userBalance={user.balance}
              disabled={isSpinning}
            />
          </motion.div>
        )}

        {/* Game Rules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={styles.rulesSection}
        >
          <div className={styles.rules}>
            <h3>📋 Правила игры</h3>
            <ul>
              <li>🎯 Четные числа (кроме 0) = выигрыш x1.5</li>
              <li>❌ Нечетные числа и 0 = проигрыш</li>
              <li>💰 Минимальная ставка: 10 ₽</li>
              <li>🎰 37 чисел: 0-36</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameScreen;
