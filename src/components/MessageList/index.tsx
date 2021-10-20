import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import io from 'socket.io-client';

import styles from './styles.module.scss';
import Logo from '../../assets/logo.svg';

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        // eslint-disable-next-line camelcase
        avatar_url: string;
    };
};

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesQueue, setMessagesQueue] = useState<Message[]>([]);

    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.on('new_message', (message: Message) => {
            setMessagesQueue([message, ...messagesQueue]);
        });
    }, []);

    useEffect(() => {
        if (messagesQueue.length > 0) {
            if (messages.length > 2) messages.pop();

            const tempMessages = messages;
            setMessages([]);
            setMessages([messagesQueue[0], ...tempMessages]);
        }
    }, [JSON.stringify(messagesQueue[0])]);

    useEffect(() => {
        api.get<Message[]>('messages/lastthree').then((response) => {
            setMessages(response.data);
        });
    }, []);

    return (
        <div className={styles.messageListWrapper}>
            <img src={Logo} alt="DoWhile2021" />

            <ul className={styles.messageList}>
                {messages.map((message) => {
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>
                                {message.text}
                            </p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img
                                        src={message.user.avatar_url}
                                        alt={message.user.name}
                                    />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
