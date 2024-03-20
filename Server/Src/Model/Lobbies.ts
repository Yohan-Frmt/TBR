import { TUser } from "../Type";
import { Lobby } from "./Lobby";
import { NameGenerator } from "./NameGenerator";
import { User } from "./User";

export class Lobbies {
    static Lobbies: Record<string, Lobby> = {};

    // private static FromRedis = (str: TLobby): Lobby => new Lobby(str.name, str.capacity, str.Users, str.isPrivate);

    public static Create = async (capacity: number = -1): Promise<Lobby> => {
        let name: string = NameGenerator.GenerateNewName();
        const lobby: Lobby = new Lobby(name, capacity);
        this.Lobbies[name] = lobby;
        // await Redis.Set<Lobby>(name, lobby);
        return lobby;
    };

    public static Delete = async (name: string) => {
        const lobby = await this.GetLobby(name);
        if (lobby) delete this.Lobbies[name];
        // if (lobby) await Redis.Delete(name);
    };

    public static GetLobby = async (name: string): Promise<Lobby | null> => {
        // const desiredLobby = await Redis.Get<Lobby>(name);
        console.log("GET LOBBY : ", name);
        console.log("GET LOBBY : ", this.Lobbies);
        const desiredLobby = this.Lobbies[name];
        return desiredLobby;
        // return desiredLobby ? this.FromRedis(desiredLobby) : null;
    };

    public static GetUsers = async (name: string) => {
        const lobby = await this.GetLobby(name);
        return lobby?.GetUsers();
    };

    public static JoinLobby = async (
        lobbyName: string,
        userId: string
    ): Promise<TUser | undefined> => {
        const lobby = await this.GetLobby(lobbyName);
        return lobby?.Join(userId);
    };

    public static Leave = async (
        lobbyName: string,
        userId: string
    ): Promise<User | undefined> => {
        const lobby = await this.GetLobby(lobbyName);
        return lobby?.Leave(userId);
    };

    private static IsBannedFromLobby = (
        lobby: Lobby,
        userId: string
    ): boolean | undefined => this.GetUserInLobby(lobby, userId)?.isBanned;

    private static CanPlay = (lobby: Lobby): boolean =>
        lobby.isPrivate
            ? false
            : lobby.capacity < 0 ||
            this.GetUsersInLobby(lobby).players.length < lobby.capacity;

    private static GetUserInLobby = (
        lobby: Lobby,
        userId: string
    ): TUser | undefined => {
        const idx: number = lobby.Users.findIndex(({ id }) => id === userId);
        return idx >= 0 ? lobby.Users[idx] : undefined;
    };
    private static GetUsersInLobby = (lobby: Lobby) => {
        const players: TUser[] = [];
        const inactives: TUser[] = [];
        const banned: TUser[] = [];
        const spectators: TUser[] = [];
        for (const user of lobby.Users) {
            if (user.isBanned) banned.push(user);
            else if (!user.isActive) inactives.push(user);
            else if (user.isSpectating) spectators.push(user);
            else players.push(user);
        }
        return {
            players,
            inactives,
            banned,
            spectators,
        };
    };
}
