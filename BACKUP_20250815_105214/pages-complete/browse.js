// pages/browse.js - BlueTubeTV Ocean Theme
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';

const Browse = () => {
  const [streams, setStreams] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreams();
  }, [filter]);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockStreams = [
        {
          id: 1,
          title: 'Deep Ocean Exploration',
          streamer: 'OceanPilot',
          viewers: 1234,
          thumbnail: '/api/placeholder/320/180',
          category: 'Underwater',
          isLive: true,
        },
        {
          id: 2,
          title: 'Sky High Adventures',
          streamer: 'SkyDiver',
          viewers: 567,
          thumbnail: '/api/placeholder/320/180',
          category: 'Aerial',
          isLive: true,
        },
        {
          id: 3,
          title: 'Coastal Drone Racing',
          streamer: 'WaveRider',
          viewers: 890,
          thumbnail: '/api/placeholder/320/180',
          category: 'Racing',
          isLive: false,
        },
      ];
      
      setStreams(mockStreams);
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Underwater', 'Aerial', 'Racing', 'Tutorial'];

  const filteredStreams = filter === 'all' 
    ? streams 
    : streams.filter(stream => stream.category === filter);

  return (
    <Layout>
      <div className="earth-view">
        <div className="content-section">
          <div className="header-content" style={styles.headerCard}>
            <h1 className="gradient-title" style={styles.title}>
              Explore the Ocean of Content 🌊
            </h1>
            <p className="header-subtitle">
              Dive into live streams from around the blue planet
            </p>
          </div>
          
          {/* Category Filter */}
          <div style={styles.filterContainer}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={filter === category ? 'glass-card' : ''}
                style={{
                  ...styles.filterButton,
                  ...(filter === category ? styles.activeFilter : {})
                }}
              >
                {category === 'all' ? '🌊 All Streams' : category}
              </button>
            ))}
          </div>

          {/* Streams Grid */}
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Scanning the ocean...</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredStreams.length > 0 ? (
                filteredStreams.map(stream => (
                  <div key={stream.id} className="stream-card">
                    <VideoCard {...stream} />
                  </div>
                ))
              ) : (
                <div className="glass-card" style={styles.noStreams}>
                  <p>🌊 No streams found in these waters</p>
                  <p style={styles.subText}>Check back soon for more content!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  headerCard: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  title: {
    fontSize: '42px',
    fontWeight: '900',
    marginBottom: '10px',
  },
  filterContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '40px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  filterButton: {
    padding: '12px 24px',
    background: 'rgba(0, 119, 182, 0.1)',
    border: '2px solid rgba(0, 180, 216, 0.3)',
    borderRadius: '25px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  activeFilter: {
    background: 'rgba(0, 180, 216, 0.2) !important',
    color: '#00d4ff',
    borderColor: '#00b4d8',
    transform: 'scale(1.05)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(0, 180, 216, 0.2)',
    borderTop: '3px solid #00b4d8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    color: '#00b4d8',
    fontSize: '18px',
  },
  noStreams: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '20px',
    color: 'rgba(255,255,255,0.9)',
  },
  subText: {
    marginTop: '10px',
    fontSize: '16px',
    color: 'rgba(255,255,255,0.6)',
  },
};

export default Browse;