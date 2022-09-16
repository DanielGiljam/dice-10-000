export interface Turn {
    id: string;
    created_at: Date;
    player: string;
    round: string;
    game: string;
    ended_at: Date | undefined;
}
