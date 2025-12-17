import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../../model/user";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ credits: user.credits });

    } catch (error: any) {
        console.error("Error fetching credits:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch credits" },
            { status: 500 }
        );
    }
}