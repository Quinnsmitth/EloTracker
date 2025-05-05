import React, { useState, useEffect, useRef } from 'react';

const UnityGame = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const unityContainerRef = useRef(null); 
  const unityCanvasRef = useRef(null); 

  const loadUnity = async () => {
    if (isLoading || isLoaded || window.unityInstance) {
      console.log('— exiting early (already loading/loaded or instance exists)');
      return;
    }
    setIsLoading(true);

    const script = document.createElement('script');
    script.src = '/UnityGame2/Build/UnityGame2.loader.js';  
    script.onload = () => {
      console.log('— loader script loaded');

      window
          .createUnityInstance(unityCanvasRef.current, {  
            dataUrl: '/UnityGame2/Build/UnityGame2.data.gz',
            frameworkUrl: '/UnityGame2/Build/UnityGame2.framework.js',
            codeUrl: '/UnityGame2/Build/UnityGame2.wasm.gz',
            streamingAssetsUrl: 'StreamingAssets',
            companyName: 'BadBishop',
            productName: 'BadChess',
            productVersion: '1.0',
          })
          .then(instance => {
            console.log('Unity instance created!');
            setIsLoading(false);
            setIsLoaded(true);
            window.unityInstance = instance;
          })
          .catch(err => {
            console.error('Unity failed to create instance:', err);
            setIsLoading(false);
          });
    };

    script.onerror = (e) => {
      console.error('Failed to load loader script:', e);
      setIsLoading(false);
    };

    console.log('— appending <script> to DOM');
    document.body.appendChild(script);
  };

  useEffect(() => {
    return () => {
      if (window.unityInstance) {
        window.unityInstance.Quit().then(() => {
          console.log('🗑️ Unity instance quit');
          delete window.unityInstance;
        });
      }
    };
  }, []);

  return (
      <div style={styles.container}>
        <button
            onClick={loadUnity}
            disabled={isLoading || isLoaded}
            style={styles.button}
        >
          {isLoading ? <div style={styles.spinner} /> : isLoaded ? 'Unity Loaded' : 'Load Unity Game'}
        </button>
        <div
            key="unity-container"
            ref={unityContainerRef}
            className="unity-container"
            style={{ width: 960, height: 600, background: '#000' }}
        >
          <canvas
              ref={unityCanvasRef}
              id="unity-canvas"
              width="960"
              height="600"
              tabIndex="-1"
              style={{ width: '100%', height: '100%' }}
          ></canvas>
        </div>
      </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  spinner: {
    width: 20,
    height: 20,
    border: '3px solid #ccc',
    borderTop: '3px solid #333',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

;(function injectSpinnerCSS() {
  const rule = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = rule;
  document.head.appendChild(styleEl);
})();

export default UnityGame;