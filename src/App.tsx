import React, { useContext } from 'react';
import styles from './App.module.scss';
import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';
import { AuthContext } from './context/Auth';

export function App() {
    const { user } = useContext(AuthContext);

    console.log(user);

    return (
        <main
            className={`${styles.contentWrapper} ${
                user ? styles.contentSigned : ''
            }`}
        >
            <MessageList />
            {user ? <SendMessageForm /> : <LoginBox />}
        </main>
    );
}
