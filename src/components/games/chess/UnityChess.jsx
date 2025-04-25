import React, { useState, useEffect, useRef } from 'react';

const UnityGame = () => {
    const [isLoading, setIsLoading] = useState(false);  // Track loading state
    const unityContainerRef = useRef(null);

    const loadUnity = () => {
        setIsLoading(true); // Set loading state to true when the button is clicked

        const script = document.createElement("script");
        script.src = "/UnityGame/Build/UnityGame.loader.js";

        script.onload = () => {
            console.log("Unity loader script loaded!");

            window.createUnityInstance(unityContainerRef.current, {
                dataUrl: "/UnityGame/Build/UnityGame.data",
                frameworkUrl: "/UnityGame/Build/UnityGame.framework.js",
                codeUrl: "/UnityGame/Build/UnityGame.wasm",
                streamingAssetsUrl: "StreamingAssets",
                companyName: "BadBishop",
                productName: "BadChess",
                productVersion: ".1"
            })
                .then(() => {
                    console.log("Unity loaded!");
                    setIsLoading(false); // Set loading state to false once Unity is loaded
                })
                .catch((message) => {
                    console.error("Unity failed to load:", message);
                    setIsLoading(false); // Set loading state to false in case of failure
                });
        };

        document.body.appendChild(script);
    };

    return (
        <div style={styles.container}>
            {/* Button to start loading Unity */}
            <button onClick={loadUnity} disabled={isLoading} style={styles.button}>
                {isLoading ? 'Loading Unity...' : 'Load Unity Game'}
            </button>

            {/* Unity container */}
            <div
                ref={unityContainerRef}
                className="unity-container"
                style={{ width: '960px', height: '600px' }}
            >
                {/* Unity WebGL game will be rendered here */}
            </div>
        </div>
    );
};

// Inline styles for centering the button
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',  // Full viewport height
        flexDirection: 'column',  // Stack the button and Unity container
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '20px',  // Space between the button and Unity container
    }
};

export default UnityGame;
