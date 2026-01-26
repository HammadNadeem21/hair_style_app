import React from "react";
import { useSession } from "next-auth/react";

type CreditContextType = {
    credits: number;
    setCredits: (credits: number) => void;
    refreshCredits: () => Promise<void>;
}

const CreditContext = React.createContext<CreditContextType | null>(null);

export const CreditProvider = ({ children }: { children: React.ReactNode }) => {
    const [credits, setCredits] = React.useState<number>(0);
    const { data: session } = useSession();

    // Fetch credits from database when user logs in
    const refreshCredits = React.useCallback(async () => {
        if (session?.user?.email) {
            try {
                const res = await fetch("/api/credits/get", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: session.user.email })
                });

                if (res.ok) {
                    const data = await res.json();
                    setCredits(data.credits);
                }
            } catch (error) {
                console.error("Failed to fetch credits:", error);
            }
        }
    }, [session?.user?.email]);

    // Fetch credits when user session changes
    React.useEffect(() => {
        refreshCredits();
    }, [refreshCredits]);

    return (
        <CreditContext.Provider value={{ credits, setCredits, refreshCredits }}>
            {children}
        </CreditContext.Provider>
    );
};

export const useCreditContext = () => {
    const context = React.useContext(CreditContext);
    if (!context) {
        throw new Error("useCreditContext must be used within a CreditProvider");
    }
    return context;
};
