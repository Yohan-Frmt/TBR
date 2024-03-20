import { User, Users } from "./User";

export class Lobby {
    public Users: User[] = [];
    public isPrivate: boolean = true;

    constructor(public name: string, public capacity: number = -1) {
    }

    private GetUser = (userId: string): User | undefined => {
        const idx: number = this.Users.findIndex(({ id }) => id === userId);
        return idx >= 0 ? this.Users[idx] : undefined;
    };

    private IsBanned = (userId: string): boolean | undefined =>
        this.GetUser(userId)?.isBanned;

    public async GetUsers() {
        const players: User[] = [];
        const inactives: User[] = [];
        const banned: User[] = [];
        const spectators: User[] = [];

        console.log("GET USERS : ", this.Users);
        for (const { id, isActive, isSpectating, isBanned } of this.Users) {
            const user = await Users.GetUser(id);
            console.log("GetUsers")
            if (user) {
                if (banned) banned.push(user);
                else if (!isActive) inactives.push(user);
                else if (isSpectating) spectators.push(user);
                else players.push(user);
            }
        }
        return { players, inactives, spectators, banned };
    }

    public Join = async (userId: string): Promise<User | undefined> => {
        if (this.IsBanned(userId)) return undefined;
        const idx: number = this.Users.findIndex(({ id }) => id === userId);
        const user = idx >= 0 ? this.Users[idx] : new User(userId);
        if (idx >= 0 && !user.isActive) this.Users.splice(idx, 1);
        if (idx < 0 && user.isActive) {
            if (!await this.CanPlay()) user.isSpectating = true;
            this.Users.push(user);
        }
        user.isActive = true;
        user.count += 1;
        // this.promoteSpectator();
        return user;
    };

    public Leave = (userId: string): User | undefined => {
        if (this.IsBanned(userId)) return undefined;
        const index = this.Users.findIndex(({ id }) => id === userId);
        if (index < 0) return undefined;
        const user = this.Users[index];
        if (!user.isActive) return undefined;
        user.count -= 1;
        if (user.count === 0) user.isActive = false;
        // this.promoteSpectator();
        return user;
    };

    private CanPlay = async (): Promise<boolean> => !this.isPrivate && (this.capacity < 0 || (await this.GetUsers()).players.length < this.capacity);
}


//
// interface ILobbyMethods {}
//
// interface ILobby {
//   _id: mongoose.Types.ObjectId;
//   name: string;
// }
//
// interface ILobbyModel extends mongoose.Model<ILobby, {}, ILobbyMethods> {
//   Create(): Promise<mongoose.HydratedDocument<ILobby, ILobbyMethods>>;
//
//   FindByName(
//     id: string
//   ): mongoose.Query<
//     mongoose.HydratedDocument<ILobby, ILobbyMethods> | null,
//     mongoose.HydratedDocument<ILobby, ILobbyMethods>,
//     ILobby
//   >;
// }
//
// const LobbySchema = new mongoose.Schema<ILobby, ILobbyModel, ILobbyMethods>({
//   name: {
//     type: String,
//     trim: true,
//     minlength: 2,
//     get: ([x, ...y]: [string, string[]]) => x.toUpperCase() + y.join(""),
//   },
// });
//
// LobbySchema.static("CreateWithName", async function (name: string) {
//   const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
//   const lobby: ILobby = {
//     _id,
//     name,
//   };
//
//   return await this.create(lobby);
// });
//
// LobbySchema.static("FindByName", function (name: string) {
//   return this.findOne({ name });
// });
