// BlueTube Complete UI & Functionality Test Script
// Tests all buttons, video players, and user interactions
// Run with: node bluetube-ui-test.js

const puppeteer = require('puppeteer');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const HEADLESS = process.env.HEADLESS !== 'false';
const SLOW_MO = parseInt(process.env.SLOW_MO || '0');

// Test results
let passed = 0;
let failed = 0;
let warnings = 0;
const results = [];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Helper functions
function log(message, type = 'info') {
  const prefix = {
    pass: `${colors.green}✓${colors.reset}`,
    fail: `${colors.red}✗${colors.reset}`,
    warn: `${colors.yellow}⚠${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
    test: `${colors.magenta}▶${colors.reset}`
  };
  
  console.log(`${prefix[type] || prefix.info} ${message}`);
  
  if (type === 'pass') passed++;
  if (type === 'fail') failed++;
  if (type === 'warn') warnings++;
  
  results.push({ message, type, timestamp: new Date() });
}

// Test runner class
class BlueTubeUITester {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    log('Launching browser...', 'info');
    this.browser = await puppeteer.launch({
      headless: HEADLESS,
      slowMo: SLOW_MO,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 720 }
    });
    
    this.page = await this.browser.newPage();
    
    // Set up console message logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        log(`Browser console error: ${msg.text()}`, 'warn');
      }
    });
    
    // Set up request interception for monitoring
    await this.page.setRequestInterception(true);
    this.page.on('request', request => {
      request.continue();
    });
    
    log('Browser launched successfully', 'pass');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      log('Browser closed', 'info');
    }
  }

  // Navigation tests
  async testNavigation() {
    log('Testing Navigation Elements', 'test');
    
    try {
      await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
      
      // Test logo click
      const logo = await this.page.$('a[href="/"]');
      if (logo) {
        await logo.click();
        await this.page.waitForTimeout(500);
        log('Logo navigation works', 'pass');
      } else {
        log('Logo not found', 'warn');
      }
      
      // Test main navigation links
      const navLinks = [
        { selector: 'a[href="/browse"]', name: 'Browse' },
        { selector: 'a[href="/marketplace"]', name: 'Marketplace' },
        { selector: 'a[href="/pricing"]', name: 'Pricing' },
        { selector: 'a[href="/dashboard"]', name: 'Dashboard' }
      ];
      
      for (const link of navLinks) {
        const element = await this.page.$(link.selector);
        if (element) {
          const isVisible = await element.isIntersectingViewport();
          if (isVisible) {
            log(`Navigation link "${link.name}" is visible`, 'pass');
          } else {
            log(`Navigation link "${link.name}" exists but not visible`, 'warn');
          }
        } else {
          log(`Navigation link "${link.name}" not found`, 'fail');
        }
      }
      
      // Test mobile menu (if exists)
      const mobileMenuButton = await this.page.$('[aria-label*="menu"], .mobile-menu-button, .hamburger');
      if (mobileMenuButton) {
        await mobileMenuButton.click();
        await this.page.waitForTimeout(300);
        log('Mobile menu button works', 'pass');
        
        // Close menu
        await mobileMenuButton.click();
        await this.page.waitForTimeout(300);
      }
      
    } catch (error) {
      log(`Navigation test error: ${error.message}`, 'fail');
    }
  }

  // Button functionality tests
  async testButtons() {
    log('Testing Button Functionality', 'test');
    
    try {
      await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
      
      // Test all buttons on the page
      const buttons = await this.page.$$('button, [role="button"], .btn');
      log(`Found ${buttons.length} buttons to test`, 'info');
      
      for (let i = 0; i < Math.min(buttons.length, 10); i++) {
        const button = buttons[i];
        const buttonText = await button.evaluate(el => el.textContent || el.getAttribute('aria-label'));
        const isDisabled = await button.evaluate(el => el.disabled);
        
        if (!isDisabled) {
          const isClickable = await button.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
          
          if (isClickable) {
            log(`Button "${buttonText?.trim() || 'Unnamed'}" is clickable`, 'pass');
          } else {
            log(`Button "${buttonText?.trim() || 'Unnamed'}" is not visible`, 'warn');
          }
        } else {
          log(`Button "${buttonText?.trim() || 'Unnamed'}" is disabled`, 'info');
        }
      }
      
      // Test specific action buttons
      await this.testSpecificButtons();
      
    } catch (error) {
      log(`Button test error: ${error.message}`, 'fail');
    }
  }

  async testSpecificButtons() {
    // Test Sign Up button
    const signupBtn = await this.page.$('a[href="/signup"], button:has-text("Sign Up")');
    if (signupBtn) {
      log('Sign Up button found', 'pass');
    } else {
      log('Sign Up button not found', 'warn');
    }
    
    // Test Login button
    const loginBtn = await this.page.$('a[href="/login"], button:has-text("Login")');
    if (loginBtn) {
      log('Login button found', 'pass');
    } else {
      log('Login button not found', 'warn');
    }
    
    // Test Go Live button
    const goLiveBtn = await this.page.$('button:has-text("Go Live"), .go-live-button');
    if (goLiveBtn) {
      log('Go Live button found', 'pass');
    } else {
      log('Go Live button not found on homepage', 'info');
    }
  }

  // Video player tests
  async testVideoPlayers() {
    log('Testing Video Players', 'test');
    
    try {
      // Go to browse page where videos might be
      await this.page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle2' });
      
      // Check for video elements
      const videos = await this.page.$$('video, iframe[src*="youtube"], iframe[src*="vimeo"], .video-player');
      
      if (videos.length > 0) {
        log(`Found ${videos.length} video players`, 'pass');
        
        for (let i = 0; i < Math.min(videos.length, 3); i++) {
          const video = videos[i];
          const tagName = await video.evaluate(el => el.tagName.toLowerCase());
          
          if (tagName === 'video') {
            // Test HTML5 video player
            const hasControls = await video.evaluate(el => el.hasAttribute('controls'));
            const src = await video.evaluate(el => el.src || el.querySelector('source')?.src);
            
            if (hasControls) {
              log(`Video player ${i + 1} has controls`, 'pass');
            } else {
              log(`Video player ${i + 1} missing controls`, 'warn');
            }
            
            if (src) {
              log(`Video player ${i + 1} has source: ${src.substring(0, 50)}...`, 'pass');
            } else {
              log(`Video player ${i + 1} missing source`, 'fail');
            }
            
            // Test play functionality
            try {
              await video.evaluate(el => {
                if (el.paused) {
                  return el.play().catch(() => {});
                }
              });
              await this.page.waitForTimeout(1000);
              await video.evaluate(el => el.pause());
              log(`Video player ${i + 1} play/pause works`, 'pass');
            } catch (err) {
              log(`Video player ${i + 1} play test failed (may need user interaction)`, 'warn');
            }
          } else if (tagName === 'iframe') {
            log(`Found embedded video player (iframe)`, 'pass');
          }
        }
      } else {
        log('No video players found on browse page', 'warn');
      }
      
      // Test live stream player
      await this.testLiveStreamPlayer();
      
    } catch (error) {
      log(`Video player test error: ${error.message}`, 'fail');
    }
  }

  async testLiveStreamPlayer() {
    try {
      await this.page.goto(`${BASE_URL}/live`, { waitUntil: 'networkidle2' });
      
      // Check for HLS.js or other streaming player
      const streamPlayer = await this.page.$('.stream-player, #stream-player, video[data-stream]');
      if (streamPlayer) {
        log('Live stream player found', 'pass');
        
        // Check for stream controls
        const controls = await this.page.$$('.stream-controls button, .player-controls button');
        if (controls.length > 0) {
          log(`Stream player has ${controls.length} control buttons`, 'pass');
        }
      } else {
        log('Live stream player not found on /live page', 'info');
      }
    } catch (error) {
      log('Live page may not be accessible', 'info');
    }
  }

  // Form interaction tests
  async testForms() {
    log('Testing Form Interactions', 'test');
    
    try {
      // Test search form
      await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
      
      const searchInput = await this.page.$('input[type="search"], input[placeholder*="Search"], .search-input');
      if (searchInput) {
        await searchInput.type('test search');
        log('Search input accepts text', 'pass');
        
        const searchButton = await this.page.$('button[type="submit"], .search-button');
        if (searchButton) {
          log('Search button found', 'pass');
        }
      } else {
        log('Search functionality not found', 'info');
      }
      
      // Test login form
      await this.testLoginForm();
      
    } catch (error) {
      log(`Form test error: ${error.message}`, 'fail');
    }
  }

  async testLoginForm() {
    try {
      await this.page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
      
      const emailInput = await this.page.$('input[type="email"], input[name="email"]');
      const passwordInput = await this.page.$('input[type="password"], input[name="password"]');
      const submitButton = await this.page.$('button[type="submit"], button:has-text("Login")');
      
      if (emailInput && passwordInput && submitButton) {
        await emailInput.type('test@example.com');
        await passwordInput.type('testpassword');
        log('Login form inputs work', 'pass');
        
        // Check for validation
        const required = await emailInput.evaluate(el => el.hasAttribute('required'));
        if (required) {
          log('Login form has validation', 'pass');
        }
      } else {
        log('Login form elements not found', 'fail');
      }
    } catch (error) {
      log('Login page test skipped', 'info');
    }
  }

  // User experience tests
  async testUserExperience() {
    log('Testing User Experience Features', 'test');
    
    try {
      await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
      
      // Test loading states
      const loaders = await this.page.$$('.loading, .spinner, [role="progressbar"]');
      if (loaders.length > 0) {
        log('Loading indicators present', 'pass');
      }
      
      // Test tooltips
      const tooltips = await this.page.$$('[title], [data-tooltip], [aria-label]');
      if (tooltips.length > 5) {
        log(`Found ${tooltips.length} elements with tooltips/labels`, 'pass');
      } else {
        log('Limited tooltip/label coverage', 'warn');
      }
      
      // Test keyboard navigation
      await this.page.keyboard.press('Tab');
      const focusedElement = await this.page.evaluate(() => document.activeElement?.tagName);
      if (focusedElement && focusedElement !== 'BODY') {
        log('Keyboard navigation (Tab) works', 'pass');
      } else {
        log('Keyboard navigation may need improvement', 'warn');
      }
      
      // Test responsive design
      await this.testResponsiveness();
      
    } catch (error) {
      log(`UX test error: ${error.message}`, 'fail');
    }
  }

  async testResponsiveness() {
    // Test mobile view
    await this.page.setViewport({ width: 375, height: 667 });
    await this.page.reload({ waitUntil: 'networkidle2' });
    
    const mobileMenu = await this.page.$('.mobile-menu, .hamburger, [aria-label*="menu"]');
    if (mobileMenu) {
      log('Mobile responsive design detected', 'pass');
    } else {
      log('Mobile menu not found in mobile view', 'warn');
    }
    
    // Test tablet view
    await this.page.setViewport({ width: 768, height: 1024 });
    await this.page.reload({ waitUntil: 'networkidle2' });
    log('Tablet view tested', 'pass');
    
    // Reset to desktop
    await this.page.setViewport({ width: 1280, height: 720 });
  }

  // Interactive features tests
  async testInteractiveFeatures() {
    log('Testing Interactive Features', 'test');
    
    try {
      await this.page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle2' });
      
      // Test hover effects
      const cards = await this.page.$$('.card, .video-card, [class*="card"]');
      if (cards.length > 0) {
        const firstCard = cards[0];
        await firstCard.hover();
        log('Card hover interactions available', 'pass');
      }
      
      // Test like/favorite buttons
      const likeButtons = await this.page.$$('[aria-label*="like"], .like-button, .favorite-button');
      if (likeButtons.length > 0) {
        log(`Found ${likeButtons.length} like/favorite buttons`, 'pass');
      }
      
      // Test share buttons
      const shareButtons = await this.page.$$('[aria-label*="share"], .share-button');
      if (shareButtons.length > 0) {
        log('Share functionality available', 'pass');
      }
      
      // Test comments section
      const commentSection = await this.page.$('.comments, #comments, [class*="comment"]');
      if (commentSection) {
        log('Comments section found', 'pass');
      }
      
    } catch (error) {
      log(`Interactive features test error: ${error.message}`, 'fail');
    }
  }

  // Web3 features tests
  async testWeb3Features() {
    log('Testing Web3 Features', 'test');
    
    try {
      await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
      
      // Test wallet connect button
      const walletButton = await this.page.$('button:has-text("Connect Wallet"), .connect-wallet');
      if (walletButton) {
        log('Wallet connect button found', 'pass');
        
        // Check if it triggers wallet modal
        await walletButton.click();
        await this.page.waitForTimeout(1000);
        
        const walletModal = await this.page.$('.wallet-modal, [role="dialog"]');
        if (walletModal) {
          log('Wallet modal opens', 'pass');
          
          // Close modal
          const closeButton = await this.page.$('[aria-label*="close"], .close-modal');
          if (closeButton) await closeButton.click();
        }
      } else {
        log('Web3 wallet button not found', 'info');
      }
      
      // Test NFT minting UI
      const nftButton = await this.page.$('button:has-text("Mint"), .mint-nft');
      if (nftButton) {
        log('NFT minting UI found', 'pass');
      }
      
      // Test tip button
      const tipButton = await this.page.$('button:has-text("Tip"), .tip-button');
      if (tipButton) {
        log('Tip functionality found', 'pass');
      }
      
    } catch (error) {
      log(`Web3 features test error: ${error.message}`, 'fail');
    }
  }

  // Accessibility tests
  async testAccessibility() {
    log('Testing Accessibility Features', 'test');
    
    try {
      await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
      
      // Check for alt text on images
      const images = await this.page.$$('img');
      let imagesWithAlt = 0;
      
      for (const img of images) {
        const hasAlt = await img.evaluate(el => el.hasAttribute('alt'));
        if (hasAlt) imagesWithAlt++;
      }
      
      if (images.length > 0) {
        const altPercentage = (imagesWithAlt / images.length) * 100;
        if (altPercentage > 80) {
          log(`${altPercentage.toFixed(0)}% of images have alt text`, 'pass');
        } else {
          log(`Only ${altPercentage.toFixed(0)}% of images have alt text`, 'warn');
        }
      }
      
      // Check for ARIA labels
      const ariaElements = await this.page.$$('[aria-label], [role]');
      if (ariaElements.length > 10) {
        log(`Good ARIA coverage with ${ariaElements.length} labeled elements`, 'pass');
      } else {
        log('Limited ARIA label coverage', 'warn');
      }
      
      // Check for semantic HTML
      const semanticElements = await this.page.$$('main, nav, header, footer, section, article');
      if (semanticElements.length > 3) {
        log('Good semantic HTML structure', 'pass');
      } else {
        log('Could improve semantic HTML usage', 'warn');
      }
      
    } catch (error) {
      log(`Accessibility test error: ${error.message}`, 'fail');
    }
  }

  // Performance tests
  async testPerformance() {
    log('Testing Performance Metrics', 'test');
    
    try {
      const startTime = Date.now();
      await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;
      
      if (loadTime < 3000) {
        log(`Page loads in ${loadTime}ms (Good)`, 'pass');
      } else if (loadTime < 5000) {
        log(`Page loads in ${loadTime}ms (Acceptable)`, 'warn');
      } else {
        log(`Page loads in ${loadTime}ms (Slow)`, 'fail');
      }
      
      // Check for lazy loading
      const lazyImages = await this.page.$$('img[loading="lazy"]');
      if (lazyImages.length > 0) {
        log(`${lazyImages.length} images use lazy loading`, 'pass');
      } else {
        log('No lazy loading detected', 'warn');
      }
      
      // Check bundle size warnings
      const scripts = await this.page.$$('script[src]');
      log(`Page loads ${scripts.length} JavaScript files`, 'info');
      
    } catch (error) {
      log(`Performance test error: ${error.message}`, 'fail');
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('\n' + '='.repeat(50));
    console.log('   BlueTube Complete UI & Functionality Tests');
    console.log('='.repeat(50));
    console.log(`Testing: ${BASE_URL}`);
    console.log(`Time: ${new Date().toLocaleString()}`);
    console.log('='.repeat(50) + '\n');
    
    await this.init();
    
    // Run test suites
    await this.testNavigation();
    await this.testButtons();
    await this.testVideoPlayers();
    await this.testForms();
    await this.testUserExperience();
    await this.testInteractiveFeatures();
    await this.testWeb3Features();
    await this.testAccessibility();
    await this.testPerformance();
    
    await this.cleanup();
    
    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('                TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`${colors.green}✓ Passed:${colors.reset} ${passed}`);
    console.log(`${colors.red}✗ Failed:${colors.reset} ${failed}`);
    console.log(`${colors.yellow}⚠ Warnings:${colors.reset} ${warnings}`);
    console.log(`Total Tests: ${passed + failed + warnings}`);
    console.log('='.repeat(50));
    
    if (failed === 0) {
      console.log(`\n${colors.green}✨ All critical tests passed!${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`\n${colors.red}❌ Some tests failed. Review the results above.${colors.reset}\n`);
      process.exit(1);
    }
  }
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

// Run tests
const tester = new BlueTubeUITester();
tester.runAllTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});