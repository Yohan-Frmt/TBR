import PropTypes from "prop-types";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState, } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { JsonValue, SendJsonMessage, WebSocketHook } from "react-use-websocket/dist/lib/types";
import { SocketIOMessageData } from "react-use-websocket/dist/lib/use-socket-io";
import { TMessages, TSocketContext } from "../Type";
import { useUser } from "./UserProvider";

type TProps = {
    children: ReactNode;
    lobby: string;
};

const SocketContext = createContext<TSocketContext>({
    error: null,
    lastJsonMessage: null,
    lastMessages: {},
    readyState: ReadyState.CLOSED,
    lobby: "",
    sendJsonMessage: null,
});

const createUrl = (userId: string, lobby: string): string => `${ import.meta.env.VITE_SOCKET_URL as string }/?${ new URLSearchParams({
    userId,
    lobby
}) }`;

export const SocketProvider = ({ children, lobby }: TProps) => {
    const [error, setError] = useState<string | null>(null);
    const [lastMessages, setLastMessages] = useState<TMessages>({});
    const { userId } = useUser();

    const socketUrl: () => Promise<string> = useCallback(() =>
        new Promise((resolve) => {
            if (userId) resolve(createUrl(userId, lobby));
        }), [lobby, userId]);

    const { sendJsonMessage, lastJsonMessage, readyState }: WebSocketHook<any> =
        useWebSocket(socketUrl, {
            onOpen: (): void =>
                console.log(`WebSocket connection to lobby ${ lobby } opened`),
            shouldReconnect: (): boolean => true,
            onError: (err: Event): void => {
                console.log(JSON.stringify(err));
                setError(
                    `Websocket room for Lobby "${ lobby }" does not exist. Error ${ err.target }`
                );
            },
            retryOnError: true,
        });

    useEffect((): void => {
        if (lastJsonMessage) {
            setLastMessages((prevState: TMessages) => {
                return {
                    ...prevState,
                    [lastJsonMessage.type]: lastJsonMessage.payload,
                };
            });
        }
    }, [lastJsonMessage]);

    return (
        <SocketContext.Provider
            value={ {
                error,
                sendJsonMessage,
                lastJsonMessage,
                lastMessages,
                readyState,
                lobby,
            } }
        >
            { children }
        </SocketContext.Provider>
    );
};

export const useSocket = (messageTypes: string | JsonValue) => {
    const context: TSocketContext = useContext(SocketContext);

    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }

    if (messageTypes) {
        const { lastJsonMessage, lastMessages }: TSocketContext = context;
        const newLastMessage = (() => {
            if (typeof messageTypes === "string") {
                return lastMessages[messageTypes] ? lastMessages[messageTypes] : null;
            }
            return lastJsonMessage;
        })();
        return { ...context, lastMessage: newLastMessage };
    }

    return context;
};
const GenerateEnpoints = (config: any, sendJsonMessage: SendJsonMessage | null) => Object.keys(config).reduce((funcs, funcName) => {
    return {
        ...funcs,
        [funcName]: (...args: any[]) => {
            const message = {
                type: funcName,
                payload: config[funcName].reduce((payload: SocketIOMessageData | null, arg: string, i: number) => {
                    return { ...payload, [arg]: args[i] };
                }, {}),
            };
            const finalMessage = { ...message, data: args[1] };
            console.log(`Sending message ${ JSON.stringify(finalMessage, null, 2) }`);
            return sendJsonMessage && sendJsonMessage(finalMessage);
        },
    };
}, {});

const useGame = (messageTypes: string) => {
    // const { sendJsonMessage } = useSocket(messageTypes);
    //
    // const stdlib = useMemo(() => GenerateEnpoints(config, sendJsonMessage), [
    //     sendJsonMessage,
    // ]);
    //
    // return stdlib;
};
SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
    lobby: PropTypes.string.isRequired,
};
