import {SupabaseClient} from "@supabase/supabase-js";
import {isNullish} from "../../../../utils";
import {Player} from "../../../../players";
import {Game} from "../../../Game";
import {Round} from "../../Round";
import {Turn} from "../Turn";
import {Roll} from "./Roll";

export const createRoll = async (
    supabase: SupabaseClient,
    game: Game,
    round: Round,
    turn: Turn,
    player: Player,
    index: number,
): Promise<Roll> => {
    const draft = {
        game: game.id,
        round: round.id,
        turn: turn.id,
        player: player.id,
        index,
    };
    console.log("inserting into rolls", draft);
    const result = await supabase.from<Roll>("rolls").insert(draft);
    if (!isNullish(result.error)) {
        console.error("error when inserting into rolls", draft);
        throw result.error;
    }
    console.log("inserted into rolls", result.data[0]);
    return result.data[0];
};
