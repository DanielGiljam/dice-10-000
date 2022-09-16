export interface Game {
    id: string;
    created_at: Date;
    name: string;
    ended_at: Date | undefined;
}
