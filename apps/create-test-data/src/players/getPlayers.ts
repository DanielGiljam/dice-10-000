import {SupabaseClient, User} from "@supabase/supabase-js";

import {isNullish} from "../utils";

import {Player} from "./Player";

export const getPlayers = async (
    supabase: SupabaseClient,
    users: User[],
): Promise<Player[]> => {
    const userIds = users.map((user) => user.id);
    const result = await supabase
        .from<Player>("players")
        .select()
        .in("id", userIds);
    if (!isNullish(result.error)) {
        console.error("error when selecting from players", {userIds});
        throw result.error;
    }
    return result.data;
};
