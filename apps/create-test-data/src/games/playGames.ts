import {SupabaseClient} from "@supabase/supabase-js";
import {GameWithPlayers} from "./createGames";
import {initPlayerPoints, noOneHasWon} from "./playerPoints";
import {playRound, RoundWithEverything} from "./rounds";
import {updateGame} from "./updateGame";

export interface GameWithEverything extends GameWithPlayers {
    rounds: RoundWithEverything[];
}

export const playGames = async (
    supabase: SupabaseClient,
    gamesWithPlayers: GameWithPlayers[],
): Promise<GameWithEverything[]> => {
    const gamesWithEverything: GameWithEverything[] = [];
    for (const gameWithPlayers of gamesWithPlayers) {
        const {game, players} = gameWithPlayers;
        console.log("playing game", game.name);
        const playerPoints = initPlayerPoints(players);
        let index = 0;
        const rounds: RoundWithEverything[] = [];
        while (noOneHasWon(playerPoints)) {
            rounds.push(
                await playRound(
                    supabase,
                    gameWithPlayers,
                    index++,
                    playerPoints,
                ),
            );
        }
        const update = {ended_at: new Date()};
        const updatedGame = await updateGame(supabase, game, update);
        console.log("finished game", game.name);
        for (const player of players) {
            console.log(`  ${player.name}: ${playerPoints[player.id]}`);
        }
        gamesWithEverything.push({game: updatedGame, players, rounds});
    }
    return gamesWithEverything;
};
