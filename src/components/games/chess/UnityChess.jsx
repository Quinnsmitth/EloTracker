import React, { useEffect, useRef } from 'react';
const UnityGame = () => {
    const unityContainerRef = useRef(null);
//w
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/UnityGame/Build/UnityGame.loader.js";
        script.onload = () => {
            window
                .createUnityInstance(unityContainerRef.current, {
                    dataUrl: "/UnityGame/Build/UnityGame.data",
                    frameworkUrl: "/UnityGame/Build/UnityGame.framework.js",
                    codeUrl: "/UnityGame/Build/UnityGame.wasm",
                    streamingAssetsUrl: "StreamingAssets",
                    companyName: "BadBishop",
                    productName: "BadChess",
                    productVersion: ".1",
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
        <div
            id="unity-container"
            ref={unityContainerRef}
            className="unity-container"
            style={{ width: '960px', height: '600px' }}
        ></div>

    );
};

export default UnityGame;
