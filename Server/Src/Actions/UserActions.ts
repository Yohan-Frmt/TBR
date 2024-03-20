import Log from "../Middleware/Log";
import { Lobbies } from "../Model/Lobbies";
import { User } from "../Model/User";

export class UserActions {
    public static Join = (name: string, userId: string) =>
        Lobbies.JoinLobby(name, userId);

    public static Leave = (name: string, userId: string) =>
        Lobbies.Leave(name, userId);

    public static SetName = async (
        lobby: string,
        userId: string,
        user: User
    ): Promise<User | undefined> => {
        Log.Info(`Setting the name of ${ userId } to ${ user.name }`);
        return undefined;
        // return (await Lobbies.Get(lobby))?.Users.find(
        //   ({ id }) => id === userId
        // )?.SetName(user.id, user.name);
    };
}
