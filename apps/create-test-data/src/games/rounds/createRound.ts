import {SupabaseClient} from "@supabase/supabase-js";

import {isNullish} from "../../utils";
import {Game} from "../Game";

import {Round} from "./Round";

export const createRound = async (
    supabase: SupabaseClient,
    game: Game,
    index: number,
): Promise<Round> => {
    const draft = {game: game.id, index};
    console.log("inserting into rounds", draft);
    const result = await supabase.from<Round>("rounds").insert(draft);
    if (!isNullish(result.error)) {
        console.error("error when inserting into rounds", draft);
        throw result.error;
    }
    console.log("inserted into rounds", result.data[0]);
    return result.data[0];
};
