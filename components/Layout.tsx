// components/Layout.tsx - Convert from inline styles to CSS Modules + TypeScript
import React, { ReactNode, useState, useEffect } from 'react';
import Navigation from './Navigation';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <div className={styles.layout}>
        <Navigation />
        <main className={styles.main}>{children}</main>

        {/* Donation Button */}
        <a
          href="https://coff.ee/garlanjrobinson"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.donationButton}
        >
          ☕ Buy me a coffee
        </a>
      </div>

      <footer className={styles.footer}>
        <div className={`${styles.footerContainer} ${isMobile ? styles.footerMobile : styles.footerDesktop}`}>
          <div className={styles.logoSection}>
            <span className={styles.logoIcon}>🚁</span>
            <span>© 2024 BlueTubeTV</span>
          </div>
          <div className={styles.footerLinks}>
            <a href="/legal" className={styles.footerLink}>
              Legal
            </a>
            <a href="mailto:support@bluetubetv.live" className={styles.footerLink}>
              Contact
            </a>
            <a href="https://twitter.com/bluetubetv" className={styles.footerLink}>
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;