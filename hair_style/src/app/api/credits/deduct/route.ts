import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "../../../../../model/user";

export async function POST(request: NextRequest) {
    try {
        const { email, creditsToDeduct } = await request.json();

        if (!email || creditsToDeduct === undefined) {
            return NextResponse.json(
                { error: "Email and creditsToDeduct are required" },
                { status: 400 }
            );
        }

        if (creditsToDeduct <= 0) {
            return NextResponse.json(
                { error: "Credits to deduct must be greater than 0" },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if user has enough credits
        if (user.credits < creditsToDeduct) {
            return NextResponse.json(
                { error: "Insufficient credits", currentCredits: user.credits },
                { status: 400 }
            );
        }

        // Deduct credits
        user.credits -= creditsToDeduct;
        await user.save();

        return NextResponse.json({
            success: true,
            remainingCredits: user.credits,
            deductedCredits: creditsToDeduct
        });

    } catch (error: any) {
        console.error("Error deducting credits:", error);
        return NextResponse.json(
            { error: error.message || "Failed to deduct credits" },
            { status: 500 }
        );
    }
}