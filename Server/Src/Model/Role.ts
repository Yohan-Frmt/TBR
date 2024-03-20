import mongoose, { Document, Model, Schema } from "mongoose";

type NameTransformerFunc = ([x, ...y]: string[]) => string;

interface IRole extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
}

interface IRoleModel extends Model<IRole> {
}

const nameTransformer: NameTransformerFunc = ([x, ...y]) =>
    x.toUpperCase() + y.join("");

const RoleDefinition: Schema<IRole, IRoleModel> = new Schema({
    name: {
        type: String,
        trim: true,
        get: nameTransformer,
    },
});

export const Role: IRoleModel = mongoose.model<IRole, IRoleModel>("Role", RoleDefinition);
