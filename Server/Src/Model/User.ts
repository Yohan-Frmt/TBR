/**
 * For Permanent Users
 */
// import mongoose from "mongoose";
//
// interface IUser {
//     _id: mongoose.Types.ObjectId;
//     username: string;
// }
//
// interface IUserMethods {
// }
//
// interface IUserModel extends mongoose.Model<IUser, {}, IUserMethods> {
//     CreateWithDefaultUsername(): Promise<mongoose.HydratedDocument<IUser, IUserMethods>>;
//
//     FindById(id: string): mongoose.Query<mongoose.HydratedDocument<IUser, IUserMethods>, mongoose.HydratedDocument<IUser, IUserMethods>>;
//
//     FindById(id: string): mongoose.Query<mongoose.HydratedDocument<IUser, IUserMethods> | null, mongoose.HydratedDocument<IUser, IUserMethods>, IUser>;
// }
//
// const UserSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>(
//     {
//         username: {
//             type: String,
//             trim: true,
//             minlength: 2,
//             get: ([x, ...y]: [string, string[]]) => x.toUpperCase() + y.join('')
//         },
//     }
// );
//
// UserSchema.static('CreateWithDefaultUsername', async function () {
//     const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
//     const user: IUser = {
//         _id: id,
//         username: `user-${ id.toString() }`,
//     }
//     return await this.create(user);
// });
//
// UserSchema.static('FindById', function (id: string) {
//     return this.findOne({ _id: id });
// });
//
// export const User: IUserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);

import { hash } from "../Helper";

/**
 * For Temporary Users
 */
export class User {
    public isActive: boolean;
    public isSpectating: boolean;
    public isBanned: boolean;
    public count: number;

    constructor(public id: string, public name = "") {
        this.isActive = true;
        this.isSpectating = false;
        this.isBanned = false;
        this.count = 0;
    }
}

export class Users {
    static Count = Math.floor(Math.random() * 9001) | 0;
    static Users: Record<string, User> = {};
    static MaximumNameLength = 9;

    private static GenerateNewId() {
        let h: number = hash(this.Count);
        const id: string[] = [];
        for (let i = 0; i < this.MaximumNameLength; i += 1) {
            id.push(`${ h % 10 }`);
            h = (h / 10) | 0;
        }
        this.Count += 1;
        return id.join("");
    }

    static Create = async (): Promise<User> => {
        let id: string = this.GenerateNewId();
        if (await this.GetUser(id)) id = this.GenerateNewId();
        const user: User = new User(id);
        this.Users[id] = user;
        // await Redis.Set<User>(id, user);
        return user;
    };

    static GetUser = async (id: string): Promise<User | undefined> => {
        // const user = await Redis.Get<User>(id);
        const user = this.Users[id];
        return user ?? undefined;
    };

    static Name = async (id: string, name: string): Promise<User | undefined> => {
        // const user = await Redis.Get<User>(id);
        // if (user) return new User(user.id, name);
        return undefined;
    };
}
