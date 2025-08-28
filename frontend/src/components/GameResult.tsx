import React from 'react';
import { motion } from 'framer-motion';
import styles from './GameResult.module.css';

interface GameResultProps {
  result: {
    gameId: string;
    result: number;
    isWin: boolean;
    betAmount: number;
    winAmount: number;
    newBalance: number;
    message: string;
  };
  onPlayAgain: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ result, onPlayAgain }) => {
  const getNumberColor = (num: number) => {
    if (num === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? 'red' : 'black';
  };

  const numberColor = getNumberColor(result.result);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={styles.gameResult}
    >
      <div className={`${styles.resultCard} ${result.isWin ? styles.win : styles.lose}`}>
        {/* Result Number */}
        <div className={styles.resultNumber}>
          <div className={`${styles.numberBall} ${styles[numberColor]}`}>
            {result.result}
          </div>
          <div className={styles.numberLabel}>
            Выпало число
          </div>
        </div>

        {/* Win/Lose Status */}
        <div className={styles.resultStatus}>
          <div className={`${styles.statusIcon} ${result.isWin ? styles.winIcon : styles.loseIcon}`}>
            {result.isWin ? '🎉' : '😔'}
          </div>
          <h3 className={styles.statusMessage}>
            {result.message}
          </h3>
        </div>

        {/* Amount Details */}
        <div className={styles.amountDetails}>
          <div className={styles.betInfo}>
            <span className={styles.label}>Ставка:</span>
            <span className={styles.amount}>-{result.betAmount} ₽</span>
          </div>
          
          {result.isWin && (
            <div className={styles.winInfo}>
              <span className={styles.label}>Выигрыш:</span>
              <span className={`${styles.amount} ${styles.winAmount}`}>
                +{result.winAmount} ₽
              </span>
            </div>
          )}
          
          <div className={styles.netResult}>
            <span className={styles.label}>Итого:</span>
            <span className={`${styles.amount} ${result.isWin ? styles.profit : styles.loss}`}>
              {result.isWin ? '+' : ''}{result.isWin ? result.winAmount - result.betAmount : -result.betAmount} ₽
            </span>
          </div>
        </div>

        {/* New Balance */}
        <div className={styles.newBalance}>
          <span className={styles.balanceLabel}>Новый баланс:</span>
          <span className={styles.balanceValue}>{result.newBalance.toFixed(0)} ₽</span>
        </div>

        {/* Play Again Button */}
        <motion.button
          className={styles.playAgainBtn}
          onClick={onPlayAgain}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎰 Играть еще
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameResult;
