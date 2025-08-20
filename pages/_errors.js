function Error({ statusCode }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0B1929 0%, #1e3c72 50%, #2a5298 100%)'
    }}>
      <h1 style={{ color: 'white', fontSize: '48px' }}>
        {statusCode === 404 ? '404 - Page Not Found' : `${statusCode} - Loading...`}
      </h1>
      <a href="/" style={{ color: '#00d4ff', marginTop: '20px', fontSize: '20px' }}>
        Go Home
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;