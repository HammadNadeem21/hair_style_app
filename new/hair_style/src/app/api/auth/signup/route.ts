import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "../../../../../model/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        console.log("Signup attempt for:", email);

        if (!name || !email || !password) {
            console.log("Signup validation failed: missing fields");
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        console.log("Existing user check:", !!existingUser);

        if (existingUser) {
            console.log("User already exists:", email);
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });
        console.log("User created successfully in DB:", email);

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating user", error },
            { status: 500 }
        );
    }
}
