import {SupabaseClient} from "@supabase/supabase-js";

import {GameWithPlayers} from "../createGames";
import {PlayerPoints, noOneHasWon} from "../playerPoints";

import {Round} from "./Round";
import {createRound} from "./createRound";
import {TurnWithEverything, playTurn} from "./turns";
import {updateRound} from "./updateRound";

export interface RoundWithEverything {
    round: Round;
    turns: TurnWithEverything[];
}

export const playRound = async (
    supabase: SupabaseClient,
    gameWithPlayers: GameWithPlayers,
    index: number,
    playerPoints: PlayerPoints,
): Promise<RoundWithEverything> => {
    const game = gameWithPlayers.game;
    console.log(`playing round ${index + 1} in game ${game.name}`);
    const round = await createRound(supabase, game, index);
    const players = [...gameWithPlayers.players];
    const turns: TurnWithEverything[] = [];
    while (noOneHasWon(playerPoints) && players.length > 0) {
        turns.push(
            await playTurn(
                supabase,
                gameWithPlayers.game,
                round,
                players.shift(),
                playerPoints,
            ),
        );
    }
    const update = {ended_at: new Date()};
    const updatedRound = await updateRound(supabase, round, update);
    console.log(`finished round ${index + 1} in game ${game.name}`);
    for (const player of gameWithPlayers.players) {
        console.log(`  ${player.name}: ${playerPoints[player.id]}`);
    }
    return {round: updatedRound, turns};
};
