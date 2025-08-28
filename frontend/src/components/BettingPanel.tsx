import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './BettingPanel.module.css';

interface BettingPanelProps {
  onBet: (amount: number) => void;
  userBalance: number;
  disabled: boolean;
}

const BettingPanel: React.FC<BettingPanelProps> = ({ onBet, userBalance, disabled }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const quickBets = [10, 25, 50, 100, 250, 500];

  const handleQuickBet = (amount: number) => {
    setBetAmount(amount);
    setShowCustomInput(false);
    setCustomAmount('');
  };

  const handleCustomBet = () => {
    const amount = parseInt(customAmount);
    if (amount >= 10 && amount <= userBalance) {
      setBetAmount(amount);
      setShowCustomInput(false);
      setCustomAmount('');
    }
  };

  const handlePlaceBet = () => {
    if (betAmount >= 10 && betAmount <= userBalance && !disabled) {
      onBet(betAmount);
    }
  };

  const canBet = betAmount >= 10 && betAmount <= userBalance && !disabled;

  return (
    <div className={styles.bettingPanel}>
      <div className={styles.header}>
        <h3>💰 Сделать ставку</h3>
        <div className={styles.balanceInfo}>
          Баланс: <span className={styles.balance}>{userBalance.toFixed(0)} ₽</span>
        </div>
      </div>

      {/* Current Bet Display */}
      <div className={styles.currentBet}>
        <span className={styles.betLabel}>Ставка:</span>
        <span className={styles.betAmount}>{betAmount} ₽</span>
      </div>

      {/* Quick Bet Buttons */}
      <div className={styles.quickBets}>
        <div className={styles.quickBetsLabel}>Быстрые ставки:</div>
        <div className={styles.quickBetsGrid}>
          {quickBets.map((amount) => (
            <motion.button
              key={amount}
              className={`${styles.quickBetBtn} ${betAmount === amount ? styles.active : ''}`}
              onClick={() => handleQuickBet(amount)}
              disabled={disabled || amount > userBalance}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              {amount} ₽
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className={styles.customBet}>
        {!showCustomInput ? (
          <button
            className={styles.customBetBtn}
            onClick={() => setShowCustomInput(true)}
            disabled={disabled}
          >
            ✏️ Своя сумма
          </button>
        ) : (
          <div className={styles.customInput}>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Введите сумму"
              min="10"
              max={userBalance}
              className={styles.input}
            />
            <div className={styles.customButtons}>
              <button
                className={styles.confirmBtn}
                onClick={handleCustomBet}
                disabled={!customAmount || parseInt(customAmount) < 10 || parseInt(customAmount) > userBalance}
              >
                ✓
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomAmount('');
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bet Button */}
      <motion.button
        className={`${styles.betButton} ${canBet ? styles.canBet : styles.cantBet}`}
        onClick={handlePlaceBet}
        disabled={!canBet}
        whileTap={canBet ? { scale: 0.95 } : {}}
        whileHover={canBet ? { scale: 1.02 } : {}}
      >
        {disabled ? (
          <>
            <div className={styles.spinner}></div>
            Крутим...
          </>
        ) : !canBet ? (
          betAmount > userBalance ? 'Недостаточно средств' : 'Минимум 10 ₽'
        ) : (
          `🎰 Крутить за ${betAmount} ₽`
        )}
      </motion.button>

      {/* Potential Win */}
      {canBet && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.potentialWin}
        >
          Возможный выигрыш: <span className={styles.winAmount}>{(betAmount * 1.5).toFixed(0)} ₽</span>
        </motion.div>
      )}
    </div>
  );
};

export default BettingPanel;
