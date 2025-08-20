// components/SponsoredJobCard.js
const SponsoredJobCard = ({ job }) => {
  const sponsoredCardStyle = {
    border: '2px solid #fbbf24',
    backgroundColor: '#fefce8',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const sponsoredBadgeStyle = {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
    marginRight: '12px'
  };

  const commissionStyle = {
    color: '#92400e',
    fontSize: '12px',
    fontWeight: '500'
  };

  return (
    <div style={sponsoredCardStyle}>
      <div style={{marginBottom: '12px'}}>
        <span style={sponsoredBadgeStyle}>SPONSORED</span>
        <span style={commissionStyle}>Higher commission rate: 30%</span>
      </div>
      
      <h3 style={{fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0'}}>
        {job.title}
      </h3>
      
      <p style={{color: '#6b7280', fontSize: '14px', margin: '4px 0'}}>
        {job.brand_name} • {job.location}
      </p>
      
      <p style={{margin: '12px 0', lineHeight: '1.5'}}>
        {job.description}
      </p>
      
      <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px'}}>
        <span style={{
          backgroundColor: '#dcfce7',
          color: '#166534',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          Budget: ${job.budget}
        </span>
        
        <button style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default SponsoredJobCard;