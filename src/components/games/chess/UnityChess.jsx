import React, { useState, useEffect, useRef } from 'react';

const UnityGame = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); // Prevent multiple loads
    const unityContainerRef = useRef(null);
    const originalQuerySelectorRef = useRef(null);

    const loadUnity = () => {
        if (isLoading || isLoaded || window.unityInstance) return; // Prevent multiple initializations
        setIsLoading(true);

        // Patch querySelector to avoid '#' selector crash
        originalQuerySelectorRef.current = Document.prototype.querySelector;
        Document.prototype.querySelector = function(selector) {
            if (selector === "#") {
                console.warn("Blocked invalid selector: #");
                return null;
            }
            return originalQuerySelectorRef.current.call(this, selector);
        };

        const script = document.createElement("script");
        script.src = "/UnityGame2/Build/UnityGame2.loader.js"; // <-- fixed path to match assets

        script.onload = () => {
            console.log("Unity loader script loaded!");

            window.createUnityInstance(unityContainerRef.current, {
                dataUrl: "/UnityGame2/Build/UnityGame2.data",
                frameworkUrl: "/UnityGame2/Build/UnityGame2.framework.js", // NOT the .gz version in dev
                codeUrl: "/UnityGame2/Build/UnityGame2.wasm",
                streamingAssetsUrl: "StreamingAssets",
                companyName: "BadBishop",
                productName: "BadChess",
                productVersion: ".1"
            })

                .then((instance) => {
                    console.log("Unity loaded!");
                    setIsLoading(false);
                    setIsLoaded(true);
                    window.unityInstance = instance; // Store the Unity instance
                })
                .catch((message) => {
                    console.error("Unity failed to load:", message);
                    setIsLoading(false);
                });
        };

        script.onerror = () => {
            console.error("Failed to load Unity loader script.");
            setIsLoading(false);
        };

        document.body.appendChild(script);
    };

    useEffect(() => {
        return () => {
            if (window.unityInstance) {
                window.unityInstance.Quit().then(() => {
                    console.log("Unity instance quit successfully.");
                    delete window.unityInstance;
                });
            }
            if (originalQuerySelectorRef.current) {
                Document.prototype.querySelector = originalQuerySelectorRef.current;
            }
        };
    }, []);

    return (
        <div style={styles.container}>
            <button onClick={loadUnity} disabled={isLoading || isLoaded} style={styles.button}>
                {isLoading ? (
                    <div style={styles.spinner}></div> // Added spinner
                ) : isLoaded ? (
                    'Unity Loaded'
                ) : (
                    'Load Unity Game'
                )}
            </button>

            <div
                ref={unityContainerRef}
                className="unity-container"
                style={{ width: '960px', height: '600px', background: '#000' }}
            />
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
        marginBottom: '20px',
    },
    spinner: {
        width: '20px',
        height: '20px',
        border: '3px solid #ccc',
        borderTop: '3px solid #333',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
};

// Inject CSS animation for spinner
const styleSheet = document.styleSheets[0];
if (styleSheet) {
    styleSheet.insertRule(`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `, styleSheet.cssRules.length);
}

export default UnityGame;
