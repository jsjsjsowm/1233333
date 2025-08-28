import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RouletteWheel from './RouletteWheel';
import { useAuth } from '../contexts/AuthContext';
import styles from './GameScreen.module.css';
import { API_ENDPOINTS } from '../config/api';
import { WinIcon, LossIcon, CoinsIcon, GameIcon, HistoryIcon } from './Icons';
import BettingPanel from './BettingPanel';
import GameResult from './GameResult';

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

  const handleBet = async (betAmount: number) => {
    if (!user || !token) return;

    try {
      setIsSpinning(true);
      setGameResult(null);
      setShowResult(false);

      // Haptic feedback would go here for Telegram Mini App

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
      setIsSpinning(false);
    }
  };

  const handleSpinComplete = (result: number) => {
    setIsSpinning(false);
    setShowResult(true);
    
    // Haptic feedback would go here for Telegram Mini App
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
            <h3><HistoryIcon size={20} color="white" /> Правила игры</h3>
            <ul>
              <li><WinIcon size={16} color="#34C759" /> Четные числа (кроме 0) = выигрыш x1.5</li>
              <li><LossIcon size={16} color="#FF3B30" /> Нечетные числа и 0 = проигрыш</li>
              <li><CoinsIcon size={16} color="#FFD700" /> Минимальная ставка: 10 ₽</li>
              <li><GameIcon size={16} color="#007AFF" /> 37 чисел: 0-36</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameScreen;
