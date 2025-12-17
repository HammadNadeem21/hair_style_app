// Example: Display user credits in a component
"use client";

import { useCreditContext } from "@/context/CreditContext";
import { useSession } from "next-auth/react";

export default function CreditDisplay() {
    const { credits, refreshCredits } = useCreditContext();
    const { data: session } = useSession();

    if (!session?.user) {
        return null; // Don't show if user is not logged in
    }

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm">
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">Available Credits</span>
                <span className="text-lg font-bold text-primaryColor">
                    {credits.toFixed(1)}
                </span>
            </div>
            <button
                onClick={refreshCredits}
                className="text-xs text-gray-600 hover:text-primaryColor transition-colors"
                title="Refresh credits"
            >
                🔄
            </button>
        </div>
    );
}
