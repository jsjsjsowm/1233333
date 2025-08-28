import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './RouletteWheel.module.css';

interface RouletteWheelProps {
  onSpinComplete: (result: number) => void;
  isSpinning: boolean;
  targetNumber?: number;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ onSpinComplete, isSpinning, targetNumber }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Roulette numbers in European order
  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  const getNumberColor = (num: number) => {
    if (num === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? 'red' : 'black';
  };

  const spinWheel = (targetNumber: number) => {
    const targetIndex = numbers.indexOf(targetNumber);
    const sectorAngle = 360 / numbers.length;
    const targetAngle = targetIndex * sectorAngle;
    
    // Add multiple full rotations for dramatic effect
    const fullRotations = 5 + Math.random() * 3; // 5-8 rotations
    const finalRotation = rotation + (fullRotations * 360) + (360 - targetAngle);
    
    setRotation(finalRotation);
    
    // Call onSpinComplete after animation
    setTimeout(() => {
      onSpinComplete(targetNumber);
    }, 4000);
  };

  React.useEffect(() => {
    if (isSpinning && targetNumber !== undefined) {
      spinWheel(targetNumber);
    }
  }, [isSpinning, targetNumber]);

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.wheelWrapper}>
        {/* Pointer */}
        <div className={styles.pointer}></div>
        
        {/* Wheel */}
        <motion.div
          ref={wheelRef}
          className={styles.wheel}
          animate={{ rotate: rotation }}
          transition={{
            duration: isSpinning ? 4 : 0,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {numbers.map((number, index) => {
            const angle = (360 / numbers.length) * index;
            const color = getNumberColor(number);
            
            return (
              <div
                key={number}
                className={`${styles.sector} ${styles[color]}`}
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <div className={styles.number}>
                  {number}
                </div>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center circle */}
        <div className={styles.centerCircle}>
          <div className={styles.centerDot}></div>
        </div>
      </div>
      
      {/* Wheel shadow */}
      <div className={styles.wheelShadow}></div>
    </div>
  );
};

export default RouletteWheel;
