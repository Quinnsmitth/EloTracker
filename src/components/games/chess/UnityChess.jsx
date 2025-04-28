import React, { useState, useEffect, useRef } from 'react';

const UnityGame = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded]   = useState(false);
  const unityContainerRef         = useRef(null);

  const loadUnity = () => {
    console.log('▶ loadUnity() called', { isLoading, isLoaded, hasInstance: !!window.unityInstance });
    if (isLoading || isLoaded || window.unityInstance) {
      console.log('— exiting early (already loading/loaded or instance exists)');
      return;
    }
    setIsLoading(true);

    const script = document.createElement('script');
    script.src = '/UnityGame2/Build/UnityGame2.loader.js';
    script.onload = () => {
      console.log('✅ loader script loaded');
      window.createUnityInstance(unityContainerRef.current, {
        dataUrl: '/UnityGame2/Build/UnityGame2.data',
        frameworkUrl: '/UnityGame2/Build/UnityGame2.framework.js',
        codeUrl: '/UnityGame2/Build/UnityGame2.wasm',
        streamingAssetsUrl: 'StreamingAssets',
        companyName: 'BadBishop',
        productName: 'BadChess',
        productVersion: '.1',
      })
      .then(instance => {
        console.log('🚀 Unity instance created!');
        setIsLoading(false);
        setIsLoaded(true);
        window.unityInstance = instance;
      })
      .catch(err => {
        console.error('❌ Unity failed to create instance:', err);
        setIsLoading(false);
      });
    };
    script.onerror = e => {
      console.error('❌ Failed to load loader script:', e);
      setIsLoading(false);
    };

    console.log('— appending <script> to DOM');
    document.body.appendChild(script);
  };

  // cleanup on unmount
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
        ref={unityContainerRef}
        className="unity-container"
        style={{ width: 960, height: 600, background: '#000' }}
      />
    </div>
  );
};

const styles = {
  container: {
    display:       'flex',
    justifyContent:'center',
    alignItems:    'center',
    height:        '100vh',
    flexDirection:'column',
  },
  button: {
    padding:    '10px 20px',
    fontSize:   '16px',
    cursor:     'pointer',
    marginBottom:'20px',
  },
  spinner: {
    width:         20,
    height:        20,
    border:        '3px solid #ccc',
    borderTop:     '3px solid #333',
    borderRadius: '50%',
    animation:     'spin 1s linear infinite',
  },
};

// inject spinner keyframes once
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
