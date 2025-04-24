import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const UnityGame = () => {
    const { unityProvider } = useUnityContext({
        loaderUrl: "builds/myunityapp.loader.js",
        dataUrl: "builds/myunityapp.data",
        frameworkUrl: "builds/myunityapp.framework.js",
        codeUrl: "builds/myunityapp.wasm",
    });

    return (
        <Unity
            unityProvider={unityProvider}
            style={{ width: "100%", height: "100%" }}
        />
    );
};

export default UnityGame;
