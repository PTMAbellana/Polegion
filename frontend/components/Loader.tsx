const Loader = () => {
    return (
      <div 
        id="loader"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.95)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div 
          className="loader-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div 
            className="my-loader"
            style={{
              width: '200px',
              height: '200px',
              flexShrink: 0,
            }}
          >
            <img 
              src="/images/polegion-logo.gif" 
              alt="Loading..." 
              className="loader-logo"
              width={200}
              height={200}
              style={{
                display: 'block',
                width: '200px',
                height: '200px',
                maxWidth: '200px',
                maxHeight: '200px',
                objectFit: 'contain',
              }}
            />
          </div>
          <p 
            className="loading-text"
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#667eea',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  };
  
  export default Loader;