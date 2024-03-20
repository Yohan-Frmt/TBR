import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket, useUser } from "../Provider";
import { TBoolean, TLobby, TSocketContext, TUser, TUserPayload } from "../Type";
import { PlayerList } from "./PlayerList";

export const Lobby = () => {
    const { error, lastJsonMessage, lobby }: TSocketContext = useSocket("users");
    const { user: me } = useUser();
    const [currentLobby, setCurrentLobby] = useState<TLobby | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(
            `${ import.meta.env.VITE_API_URL }/lobby/get?${ new URLSearchParams({
                lobby,
            }) }`
        )
            .then((res: Response) => {
                if (res.ok) return res.json();
                throw new Error(`Room ${ lobby } does not exist.`);
            })
            .then((res: TLobby) => setCurrentLobby(res))
            .catch((err: Error) => navigate(`/home/${ err.message }`));
    }, [lobby, setCurrentLobby, navigate]);

    useEffect(() => {
        if (
            lastJsonMessage &&
            lastJsonMessage.payload &&
            (lastJsonMessage.payload as TUserPayload).banned &&
            (lastJsonMessage.payload as TUserPayload).banned
                .map((user: TUser) => user.id)
                .includes(me?.id as string)
        )
            navigate(
                `/home/${ encodeURIComponent(
                    `You have been banned from lobby ${ lobby }.`
                ) }`
            );
    }, [lastJsonMessage, lobby, navigate, me]);

    useEffect(() => {
        console.log(JSON.stringify(lastJsonMessage));
    }, [lastJsonMessage]);

    const isModerator: TBoolean = useMemo(
        () =>
            me &&
            me.id &&
            lastJsonMessage &&
            lastJsonMessage.payload &&
            (lastJsonMessage.payload as TUserPayload).players &&
            (lastJsonMessage.payload as TUserPayload).players[0] &&
            (lastJsonMessage.payload as TUserPayload).players[0].id === me.id,
        [me, lastJsonMessage]
    );

    return (
        <>
            <div>{ error || `This is lobby ${ lobby }.` }</div>
            <div>ERROR : { JSON.stringify(error) }</div>
            <div>CUURENT LOBBY : { JSON.stringify(currentLobby) }</div>
            <div>LAST MESSAGE : { JSON.stringify(lastJsonMessage) }</div>
            <div>PAYLOAD : { JSON.stringify(lastJsonMessage?.payload) }</div>
            { !error && lastJsonMessage && lastJsonMessage.payload && (
                <>
                    <PlayerList
                        users={ (lastJsonMessage.payload as TUserPayload).players }
                        capacity={ currentLobby && String(currentLobby.capacity) }
                        isModerator={ isModerator }
                        id={ me?.id as string }
                    />
                    {/*<SpectatorList*/ }
                    {/*    users={lastJsonMessage.spectators}*/ }
                    {/*    userIsMod={userIsMod}*/ }
                    {/*    myId={me.id}*/ }
                    {/*/>*/ }
                    {/*<UserList*/ }
                    {/*    users={ (lastJsonMessage as TUserPayload).inactives }*/ }
                    {/*    title="Inactive Users"*/ }
                    {/*    userIsMod={ userIsMod }*/ }
                    {/*    myId={ me?.id }*/ }
                    {/*/>*/ }
                    {/*{userIsPlayer && (lastJsonMessage as TUserPayload).players.length > 1 && (*/ }
                    {/*    <Button title="Spectate" onClick={spectate} />*/ }
                    {/*)}*/ }
                    {/*<Game userIsMod={userIsMod} />*/ }
                </>
            ) }
        </>
    );
};
