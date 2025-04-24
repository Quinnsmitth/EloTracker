import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const UnityGame = () => {
    const { unityProvider } = useUnityContext({
        loaderUrl: "builds/ChessGame.loader.js",
        dataUrl: "builds/ChessGame.data",
        frameworkUrl: "builds/ChessGame.framework.js",
        codeUrl: "builds/ChessGame.wasm",
    });

    return (
        <Unity
            unityProvider={unityProvider}
            style={{ width: "100%", height: "100%" }}
        />
    );
};

export default UnityGame;
