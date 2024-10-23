// src/utils/redirectToLogin.ts

import { NavigateFunction } from 'react-router-dom';

export const redirectToLogin = (message:string, navigate: NavigateFunction) => {
    const accessToken = localStorage.getItem("access_token");

    // Check if access token exists
    if (!accessToken) {
        // Remove tokens from local storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Alert the user and redirect to login
        alert("Your session has expired. Please log in again.");
        navigate("/login");
    }
};
