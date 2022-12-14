import {Auth as SupabaseAuth} from "@supabase/ui";
import React from "react";

import {supabase} from "../supabaseClient";

export const Auth: React.FC = () => (
    <div
        className={"flex flex-col gap-8 items-center justify-center h-full p-8"}
    >
        <header>
            <h1 className={"text-2xl"}>Dice 10 000</h1>
        </header>
        <main>
            <SupabaseAuth
                className={"max-w-md w-full"}
                providers={["google", "github"]}
                supabaseClient={supabase}
            />
        </main>
    </div>
);
