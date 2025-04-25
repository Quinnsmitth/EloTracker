import React, { useEffect, useRef } from 'react';
import "../games.css";
const UnityGame = () => {
    const unityContainerRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/UnityGame/Build/UnityGame.loader.js";
        script.onload = () => {
            window
                .createUnityInstance(unityContainerRef.current, {
                    dataUrl: "/UnityGame/Build/UnityGame.data.gz",
                    frameworkUrl: "/UnityGame/Build/UnityGame.framework.js.gz",
                    codeUrl: "/UnityGame/Build/UnityGame.wasm.gz",
                    streamingAssetsUrl: "StreamingAssets",
                    companyName: "YourCompany",
                    productName: "YourProduct",
                    productVersion: "1.0",
                })
                .then(() => {
                    console.log("Unity loaded!");
                })
                .catch((message) => {
                    console.error("Unity failed to load:", message);
                });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);


    return (
        <div className="game-container">
            {/* This div will hold the Unity WebGL canvas */}
            <div
                ref={unityContainerRef} // Correctly setting the ref to the div
                className="unity-container"
                style={{ width: '960px', height: '600px' }} // Adjust dimensions as needed
            >
                {/* Unity WebGL will render here */}
            </div>
        </div>
    );
};

export default UnityGame;
