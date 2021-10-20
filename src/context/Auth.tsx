import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';
import { clientId } from './authConfig.json';

type User = {
    id: string;
    name: string;
    login: string;
    // eslint-disable-next-line camelcase
    avatar_url: string;
};

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextData);

type propsAuthProvider = {
    children: ReactNode;
};

type AuthResponse = {
    token: string;
    user: {
        id: string;
        // eslint-disable-next-line camelcase
        avatar_url: string;
        name: string;
        login: string;
    };
};

export function AuthProvider(props: propsAuthProvider) {
    const [user, setUser] = useState<User | null>(null);

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}`;

    const signIn = async (code: string) => {
        const response = await api.post<AuthResponse>('authenticate', {
            code,
        });

        const { token, user } = response.data;

        localStorage.setItem('@dowhile:token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(user);
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('@dowhile:token');
    };

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token');

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>('profile').then((res) => {
                setUser(res.data);
            });
        }
    }, []);

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        if (hasGithubCode) {
            const [urlWithoutCode, code] = url.split('?code=');

            window.history.pushState({}, '', urlWithoutCode);

            signIn(code);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    );
}
