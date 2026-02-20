import {Document,Schema,model} from 'mongoose';


export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}
const userSchema: Schema<IUser> = new Schema({
    name :{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
}, {timestamps: true});

const User =  model<IUser>('User', userSchema);

export default User;
