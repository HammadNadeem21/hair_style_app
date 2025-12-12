import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: false,
    },
    credits: {
        type: Number,
        default: 50
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
