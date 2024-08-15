import React, { useEffect, useState } from "react";
import axios from "axios";
// import 'dotenv/config';

const Login = () => {
  const { VITE_GITHUB_CLIENT_ID, VITE_GITHUB_CLIENT_SECRET } = import.meta.env;
  const REDIRECT_URI = "http://localhost:8080/";

  const [token, setToken] = useState(null);

  const getGitHubToken = async (code) => {
    try {
      const response = await axios.post(
        "https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token",
        {
          client_id: VITE_GITHUB_CLIENT_ID,
          client_secret: VITE_GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: REDIRECT_URI,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
          },
        }
      );
      setToken(response.data.access_token);
    } catch (error) {
      console.error("Error fetching GitHub token:", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      getGitHubToken(code);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${VITE_GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  };

  return (
    <div>
      <h1>GitHub Image Bed</h1>
      {!token ? (
        <button onClick={handleLogin}>Login with GitHub</button>
      ) : (<>
        <p>Logged in! Token: {token}</p><a href="/upload">go to upload</a>
      </>)}
    </div>
  );
};

export default Login;
