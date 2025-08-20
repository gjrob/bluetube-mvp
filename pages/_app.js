import GoLiveButton from '../components/GoLiveButton';
import SimpleNav from '../components/SimpleNav';
import MonetizationWidgets from '../components/MonetizationWidgets'; // ADD THIS
import { useEffect } from 'react'
import Head from 'next/head'
import '../styles/globals.css'
import { analytics } from '../lib/analytics-enhanced'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize system if needed
    if (typeof window !== 'undefined') {
      console.log('BlueTubeTV initialized');
      
      // Load Buy Me a Coffee widget
      const script = document.createElement('script');
      script.setAttribute('data-name', 'BMC-Widget');
      script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
      script.setAttribute('data-id', 'bluetubetv'); // Change to your BMC username
      script.setAttribute('data-description', 'Support BlueTubeTV!');
      script.setAttribute('data-message', 'Love our drone content? Buy us a coffee!');
      script.setAttribute('data-color', '#0080FF');
      script.setAttribute('data-position', 'Right');
      script.setAttribute('data-x_margin', '18');
      script.setAttribute('data-y_margin', '18');
      script.async = true;
      
      document.body.appendChild(script);
      
      return () => {
        // Cleanup on unmount
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0e7490 100%)'
    }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>BlueTubeTV - Drone Streaming Platform</title>
      </Head>
      <Component {...pageProps} />
      
      {/* Add Monetization Widgets if component exists */}
      {typeof MonetizationWidgets !== 'undefined' && <MonetizationWidgets />}
    </div>
  )
}

export default MyApp
