import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.userInfo}>
            <h1 className={styles.title}>🎰 Рулетка</h1>
            {user && (
              <div className={styles.balance}>
                <span className={styles.balanceLabel}>Баланс:</span>
                <span className={styles.balanceValue}>{user.balance.toFixed(0)} ₽</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={styles.content}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <Link
          to="/"
          className={`${styles.navItem} ${location.pathname === '/' ? styles.active : ''}`}
        >
          <div className={styles.navIcon}>🎰</div>
          <span className={styles.navLabel}>Игра</span>
        </Link>
        <Link
          to="/profile"
          className={`${styles.navItem} ${location.pathname === '/profile' ? styles.active : ''}`}
        >
          <div className={styles.navIcon}>👤</div>
          <span className={styles.navLabel}>Профиль</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
