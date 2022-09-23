import {SupabaseClient} from "@supabase/supabase-js";

import {isNullish} from "../../../utils";

import {Turn} from "./Turn";

export const updateTurn = async (
    supabase: SupabaseClient,
    turn: Turn,
    update: Partial<Turn>,
): Promise<Turn> => {
    console.log("updating turn", turn.id, update);
    const result = await supabase
        .from<Turn>("turns")
        .update({id: turn.id, ...update});
    if (!isNullish(result.error)) {
        console.error("error when updating turn", turn.id, update);
        throw result.error;
    }
    console.log("updated turn", result.data[0]);
    return result.data[0];
};
