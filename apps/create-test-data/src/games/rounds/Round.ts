export interface Round<T = never> {
    id: string;
    created_at: Date;
    index: number;
    game: string;
    turns: T extends never ? never : T[];
    ended_at: Date | undefined;
}
