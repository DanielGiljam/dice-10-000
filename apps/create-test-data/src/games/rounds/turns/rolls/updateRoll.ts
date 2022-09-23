import {SupabaseClient} from "@supabase/supabase-js";

import {isNullish} from "../../../../utils";

import {Roll} from "./Roll";

export const updateRoll = async (
    supabase: SupabaseClient,
    roll: Roll,
    update: Partial<Roll>,
): Promise<Roll> => {
    console.log("updating roll", roll.id, update);
    const result = await supabase
        .from<Roll>("rolls")
        .update({id: roll.id, ...update});
    if (!isNullish(result.error)) {
        console.error("error when updating roll", roll.id, update);
        throw result.error;
    }
    console.log("updated roll", result.data[0]);
    return result.data[0];
};
