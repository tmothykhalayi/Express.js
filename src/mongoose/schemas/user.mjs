import { Schema } from "mongoose";
const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
   
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type String,
        default: 'user'
    },
    password:{
        not empty: true,
        min: 8,
        max: 20
    }
    created_at: Date,
    updated_at: Date
});
export const user = mongoose.model('User', userSchema);

