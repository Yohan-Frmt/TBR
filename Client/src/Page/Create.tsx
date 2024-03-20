import { FormEvent, KeyboardEvent, useCallback, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button, TextInput } from "../Component";
import { useUser } from "../Provider";

export const Create = () => {
    const { userId } = useUser();
    const [playerCount, setPlayerCount] = useState<string>("");
    const navigate: NavigateFunction = useNavigate();

    const createLobby = useCallback(async (id: string, capacity: string) => {
        const result = await fetch(
            `${ import.meta.env.VITE_API_URL }/lobby/new?${ new URLSearchParams({
                id,
                capacity,
            }) }`
        );
        const lobby = await result.json();
        navigate(`/lobby/${ lobby.name }`);
    }, [navigate]);

    const handleOnClick = useCallback(async () => {
        if (userId) {
            const capacity: string = playerCount || "0";
            await createLobby(userId, capacity);
        }
    }, [userId, createLobby, playerCount]);

    return (
        <>
            <TextInput
                value={ playerCount }
                placeholder={ "Enter how many player are playing!" }
                onKeyUp={ (event: KeyboardEvent) =>
                    event.key === "Enter" && handleOnClick()
                }
                onInput={ (event: FormEvent) =>
                    setPlayerCount(
                        (event.target as HTMLInputElement).value.toUpperCase()
                    )
                }
            />
            <Button title={ "Create Lobby" } onClick={ handleOnClick }/>
        </>
    );
};
