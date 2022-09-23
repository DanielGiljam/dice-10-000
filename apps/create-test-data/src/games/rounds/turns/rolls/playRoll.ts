import {SupabaseClient} from "@supabase/supabase-js";

import {Player} from "../../../../players";
import {Game} from "../../../Game";
import {Round} from "../../Round";
import {Turn} from "../Turn";

import {Roll} from "./Roll";
import {createRoll} from "./createRoll";
import {generateOutcome} from "./generateOutcome";
import {optimallyLockDice} from "./optimallyLockDice";
import {updateRoll} from "./updateRoll";

export const playRoll = async (
    supabase: SupabaseClient,
    game: Game,
    round: Round,
    turn: Turn,
    player: Player,
    index: number,
    numberOfDice: number,
): Promise<Roll> => {
    console.log(
        `playing roll ${index + 1} in ${player.name}'s turn in round ${
            round.index + 1
        } in game ${game.name}`,
    );
    const roll = await createRoll(supabase, game, round, turn, player, index);
    const outcome = generateOutcome(numberOfDice);
    const locked_dice = optimallyLockDice(outcome); // eslint-disable-line @typescript-eslint/naming-convention
    const update = {ended_at: new Date(), outcome, locked_dice};
    const updatedRoll = await updateRoll(supabase, roll, update);
    console.log(
        `finished roll ${index + 1} in ${player.name}'s turn in round ${
            round.index + 1
        } in game ${game.name}`,
    );
    return updatedRoll;
};
