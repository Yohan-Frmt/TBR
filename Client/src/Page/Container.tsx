import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketProvider } from "../Provider";
import { Lobby } from "./Lobby";

export const Container = () => {
  const { name: lobby } = useParams();

  useEffect(() => {
    window.onbeforeunload = () =>
      "Are you sure that you want to leave the room?";
    // @ts-ignore
    return () => (window.onbeforeunload = undefined);
  }, []);

  return (
    <SocketProvider lobby={lobby || "none"}>
      <Lobby />
    </SocketProvider>
  );
};
