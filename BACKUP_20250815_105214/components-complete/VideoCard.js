// components/VideoCard.js - BlueTubeTV Ocean Theme 🌊
import { useState } from 'react';
import { useRouter } from 'next/router';

const VideoCard = ({ 
  id, 
  title, 
  streamer, 
  viewers, 
  thumbnail, 
  category, 
  isLive = false,
  duration,
  uploadedAt 
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    router.push(`/${isLive ? 'stream' : 'video'}/${id}`);
  };

  const formatViewers = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div style={styles.thumbnailContainer}>
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            style={styles.thumbnail}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iIzAwMzU2NiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjMDBiNGQ4IiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MijwvdGV4dD48L3N2Zz4=';
            }}
          />
        ) : (
          <div style={styles.placeholderThumb}>
            <span style={styles.waveEmoji}>🌊</span>
          </div>
        )}
        
        {/* Live Badge */}
        {isLive && (
          <div className="live-badge" style={styles.liveBadge}>
            <span className="live-dot"></span>
            LIVE
          </div>
        )}
        
        {/* Duration Badge */}
        {!isLive && duration && (
          <div style={styles.durationBadge}>
            {formatDuration(duration)}
          </div>
        )}
        
        {/* Hover Overlay */}
        {isHovered && (
          <div style={styles.hoverOverlay}>
            <div style={styles.playButton}>
              <span style={styles.playIcon}>▶</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Title */}
        <h3 style={styles.title}>{title}</h3>
        
        {/* Meta Info */}
        <div style={styles.meta}>
          <span style={styles.streamer}>{streamer}</span>
          <span style={styles.separator}>•</span>
          <span style={styles.viewers}>
            {isLive ? (
              <>👁 {formatViewers(viewers)} watching</>
            ) : (
              <>🌊 {formatViewers(viewers)} views</>
            )}
          </span>
        </div>
        
        {/* Category Badge */}
        <div style={styles.categoryContainer}>
          <span style={styles.categoryBadge}>
            {getCategoryEmoji(category)} {category}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper function for category emojis
const getCategoryEmoji = (category) => {
  const emojis = {
    'Underwater': '🤿',
    'Aerial': '✈️',
    'Racing': '🏁',
    'Tutorial': '📚',
    'Cinematic': '🎬',
    'Freestyle': '🎮',
    'default': '🌊'
  };
  return emojis[category] || emojis['default'];
};

const styles = {
  card: {
    background: 'rgba(0, 53, 102, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 180, 216, 0.2)',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    height: '100%',
  },
  cardHover: {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: '0 15px 40px rgba(0, 180, 216, 0.3)',
    borderColor: 'rgba(0, 180, 216, 0.5)',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #003566 0%, #006ba6 100%)',
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderThumb: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #003566 0%, #0077b6 100%)',
  },
  waveEmoji: {
    fontSize: '48px',
    animation: 'float 3s ease-in-out infinite',
  },
  liveBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 2,
  },
  durationBadge: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    zIndex: 2,
  },
  hoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 119, 182, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.2s ease',
    backdropFilter: 'blur(3px)',
  },
  playButton: {
    width: '60px',
    height: '60px',
    background: 'rgba(0, 180, 216, 0.9)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)',
    animation: 'pulse 2s infinite',
  },
  playIcon: {
    fontSize: '24px',
    color: '#ffffff',
    marginLeft: '4px',
  },
  content: {
    padding: '16px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    fontSize: '14px',
  },
  streamer: {
    color: '#00b4d8',
    fontWeight: '500',
  },
  separator: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  viewers: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '13px',
  },
  categoryContainer: {
    display: 'flex',
    gap: '8px',
  },
  categoryBadge: {
    display: 'inline-block',
    background: 'rgba(0, 180, 216, 0.2)',
    color: '#00d4ff',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid rgba(0, 180, 216, 0.3)',
  },
};

// Add animation keyframe if needed
if (typeof document !== 'undefined' && !document.getElementById('videocard-animations')) {
  const style = document.createElement('style');
  style.id = 'videocard-animations';
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

export default VideoCard;