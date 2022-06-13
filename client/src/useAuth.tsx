import { useState, useEffect } from 'react';
import Axios from "axios";

export default function useAuth(code: string) {
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [expiresIn, setExpiresIn] = useState<number>();


    useEffect(() => {
        Axios.post("http://localhost:3001/login", { code })
        .then(res => {
            setAccessToken(res.data.access_token);
            setRefreshToken(res.data.refresh_token);
            setExpiresIn(res.data.expires_in);
            sessionStorage.setItem('accessToken', res.data.access_token);
            window.history.pushState({}, '', "/");
        })
        .catch(() => {
            window.location.href = "/";
        });
    }, [code]);


    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        
        const interval = setInterval(() => {
            Axios.post("http://localhost:3001/refresh", { refreshToken })
            .then(res => {
                setAccessToken(res.data.access_token);
                setExpiresIn(res.data.expires_in);
                sessionStorage.setItem('accessToken', res.data.access_token);
                window.history.pushState({}, '', "/")
            })
            .catch(() => {
                window.location.href = "/";
            });
        }, (expiresIn - 60) * 1000);

        return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);

    return accessToken;
}
