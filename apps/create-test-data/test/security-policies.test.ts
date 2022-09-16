/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs";
import path from "path";
import {faker} from "@faker-js/faker";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {SupabaseQueryBuilder} from "@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder";
import {createUsers, UserWithPassword} from "../src/createUsers";
import {createGames, GameWithEverything, playGames} from "../src/games";
import {capitalize, isNullish} from "../src/utils";
import {getPlayers} from "../src/players";

const tableMethodMap = {
    players: {
        select: async (builder: SupabaseQueryBuilder<any>) =>
            await builder.select().eq("id", usersWithPasswords[0].id),
        update: async (builder: SupabaseQueryBuilder<any>) =>
            await builder.update({
                id: usersWithPasswords[0].id,
                name: faker.name.fullName(),
            }),
        delete: async (builder: SupabaseQueryBuilder<any>) =>
            await builder.delete().eq("id", usersWithPasswords[0].id),
    },
    games: {
        select: async (builder: SupabaseQueryBuilder<any>) =>
            await builder.select().eq("id", gamesWithEverything[0].game.id),
        insert: async (builder: SupabaseQueryBuilder<any>) =>
            await builder.insert({
                name: `${capitalize(faker.word.adjective())} ${capitalize(
                    faker.word.adjective(),
                )}`,
            }),
        update: async (builder: SupabaseQueryBuilder<any>) =>
            await builder.update({
                id: gamesWithEverything[0].game.id,
                name: `${capitalize(faker.word.adjective())} ${capitalize(
                    faker.word.adjective(),
                )}`,
            }),
        delete: async (builder: SupabaseQueryBuilder<any>) =>
            await builder.delete().eq("id", gamesWithEverything[0].game.id),
    },
    players_games: {
        select: async (builder: SupabaseQueryBuilder<any>) =>
            await builder
                .select()
                .eq("player", gamesWithEverything[0].players[0].id)
                .eq("game", gamesWithEverything[0].game.id),
        /* insert: async (builder: SupabaseQueryBuilder<any>) =>
        await builder.insert({
          name: `${capitalize(faker.word.adjective())} ${capitalize(
            faker.word.adjective()
          )}`,
        }),
      update: async (builder: SupabaseQueryBuilder<any>) =>
        await builder.update({
          id: gamesWithEverything[0].game.id,
          name: `${capitalize(faker.word.adjective())} ${capitalize(
            faker.word.adjective()
          )}`,
        }), */
        delete: async (builder: SupabaseQueryBuilder<any>) =>
            await builder
                .delete()
                .eq("player", gamesWithEverything[0].players[0].id)
                .eq("game", gamesWithEverything[0].game.id),
    },
    rounds: {
        select: async (builder: SupabaseQueryBuilder<any>) =>
            await builder
                .select()
                .eq("id", gamesWithEverything[0].rounds[0].round.id),
        /* insert: async (builder: SupabaseQueryBuilder<any>) =>
        await builder.insert({
          name: `${capitalize(faker.word.adjective())} ${capitalize(
            faker.word.adjective()
          )}`,
        }),
      update: async (builder: SupabaseQueryBuilder<any>) =>
        await builder.update({
          id: gamesWithEverything[0].rounds[0].round.id,
          name: `${capitalize(faker.word.adjective())} ${capitalize(
            faker.word.adjective()
          )}`,
        }), */
        delete: async (builder: SupabaseQueryBuilder<any>) =>
            await builder
                .delete()
                .eq("id", gamesWithEverything[0].rounds[0].round.id),
    },
    turns: {
        select: async (builder: SupabaseQueryBuilder<any>) =>
            await builder
                .select()
                .eq("id", gamesWithEverything[0].rounds[0].turns[0].turn.id),
        /* insert: async (builder: SupabaseQueryBuilder<any>) =>
        await builder.insert({
          name: `${capitalize(faker.word.adjective())} ${capitalize(
            faker.word.adjective()
          )}`,
        }),
      update: async (builder: SupabaseQueryBuilder<any>) =>
        await builder.update({
          id: gamesWithEverything[0].rounds[0].turns[0].turn.id,
          name: `${capitalize(faker.word.adjective())} ${capitalize(
            faker.word.adjective()
          )}`,
        }), */
        delete: async (builder: SupabaseQueryBuilder<any>) =>
            await builder
                .delete()
                .eq("id", gamesWithEverything[0].rounds[0].turns[0].turn.id),
    },
    rolls: {
        select: async (builder: SupabaseQueryBuilder<any>) =>
            await builder
                .select()
                .eq(
                    "id",
                    gamesWithEverything[0].rounds[0].turns[0].rolls[0].id,
                ),
        /* insert: async (builder: SupabaseQueryBuilder<any>) =>
        await builder.insert({
          name: `${capitalize(faker.word.adjective())} ${capitalize(
            faker.word.adjective()
          )}`,
        }),
      update: async (builder: SupabaseQueryBuilder<any>) =>
        await builder.update({
          id: gamesWithEverything[0].rounds[0].turns[0].rolls[0].id,
          name: `${capitalize(faker.word.adjective())} ${capitalize(
            faker.word.adjective()
          )}`,
        }), */
        delete: async (builder: SupabaseQueryBuilder<any>) =>
            await builder
                .delete()
                .eq(
                    "id",
                    gamesWithEverything[0].rounds[0].turns[0].rolls[0].id,
                ),
    },
} as const;

let serviceClient: SupabaseClient;
let usersWithPasswords: UserWithPassword[];
let gamesWithEverything: GameWithEverything[];

/*
 * Setting timeout to largest 32-bit signed integer: https://www.folkstalk.com/2022/07/javascript-max-32-bit-integer-with-code-examples.html.
 * Longer timeouts are not supported by Jest.
 * Needed because test data creation may take time.
 */
jest.setTimeout(2147483647);
beforeAll(async () => {
    serviceClient = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY,
    );
    const testDataPath = path.resolve(__dirname, "../test-data.json");
    if (fs.existsSync(testDataPath)) {
        const testData = JSON.parse(
            fs.readFileSync(testDataPath, {encoding: "utf-8"}),
        );
        usersWithPasswords = testData.usersWithPasswords;
        gamesWithEverything = testData.gamesWithEverything;
    } else {
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY,
        );
        usersWithPasswords = await createUsers(supabase, {count: 5});
        const players = await getPlayers(supabase, usersWithPasswords);
        const gamesWithPlayers1 = await createGames(
            supabase,
            players.slice(0, 3),
            {
                count: 1,
            },
        );
        const [gameWithEverything1] = await playGames(
            supabase,
            gamesWithPlayers1,
        );
        const gamesWithPlayers2 = await createGames(
            supabase,
            players.slice(2),
            {
                count: 1,
            },
        );
        const [gameWithEverything2] = await playGames(
            supabase,
            gamesWithPlayers2,
        );
        gamesWithEverything = [gameWithEverything1, gameWithEverything2];
        fs.writeFileSync(
            testDataPath,
            JSON.stringify({usersWithPasswords, gamesWithEverything}),
        );
    }
});

(
    [
        [
            "anon",
            {
                players: {},
                players_games: {},
                games: {},
                rounds: {},
                turns: {},
                rolls: {},
            },
        ],
        [
            "involved player",
            {
                players: {
                    select: "can",
                    update: "can",
                },
                players_games: {},
                games: {
                    select: "can",
                },
                rounds: {
                    select: "can",
                },
                turns: {
                    select: "can",
                },
                rolls: {
                    select: "can",
                },
            },
            (usersWithPasswords: UserWithPassword[]) => usersWithPasswords[0],
        ],
        [
            "not involved player",
            {
                players: {},
                players_games: {},
                games: {},
                rounds: {},
                turns: {},
                rolls: {},
            },
            (usersWithPasswords: UserWithPassword[]) =>
                usersWithPasswords[usersWithPasswords.length - 1],
        ],
    ] as const
).forEach(([actor, canOrCannotMap, selectUser]) => {
    describe(actor, () => {
        let client: SupabaseClient;
        beforeAll(async () => {
            client = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY,
            );
            if (!isNullish(selectUser)) {
                const {email, password} = selectUser(usersWithPasswords);
                const result = await client.auth.signIn({email, password});
                if (result.error) {
                    throw result.error;
                }
                await client.auth.setAuth(result.session.access_token);
            }
        });
        Object.entries(tableMethodMap).forEach(([table, methodMap]) => {
            Object.entries(methodMap).forEach(
                ([method, testImplementation]) => {
                    const canOrCannot =
                        canOrCannotMap[table][method] ?? "cannot";
                    describe(`${canOrCannot} ${method} ${table}`, () => {
                        let result;
                        beforeAll(async () => {
                            result = await testImplementation(
                                client.from(table),
                            );
                        });
                        if (method === "select") {
                            test('postgREST response status is "OK"', () =>
                                expect(result.status).toBe(200));
                            if (canOrCannot === "can") {
                                test("there is result data", () =>
                                    expect(result.data.length).toBeGreaterThan(
                                        0,
                                    ));
                            } else {
                                test("there is no result data", () =>
                                    expect(result.data.length).toBe(0));
                            }
                        } else if (method === "update") {
                            if (canOrCannot === "can") {
                                test('postgREST response status is "OK"', () =>
                                    expect(result.status).toBe(200));
                                test("there is result data", () =>
                                    expect(result.data.length).toBeGreaterThan(
                                        0,
                                    ));
                            } else {
                                test('postgREST response status is "Not found"', () =>
                                    expect(result.status).toBe(404));
                            }
                        } else if (method === "insert") {
                            if (canOrCannot === "can") {
                                test('postgREST response status is "Created"', () =>
                                    expect(result.status).toBe(201));
                                test("there is result data", () =>
                                    expect(result.data.length).toBeGreaterThan(
                                        0,
                                    ));
                            } else if (actor === "anon") {
                                test('postgREST response status is "Unauthorized"', () =>
                                    expect(result.status).toBe(401));
                            } else {
                                test('postgREST response status is "Forbidden"', () =>
                                    expect(result.status).toBe(403));
                            }
                        } else if (method === "delete") {
                            test("postgREST response status is ok", () =>
                                expect(result.status).toBe(200));
                            if (canOrCannot === "can") {
                                describe("the row was actually deleted", () => {
                                    let result;
                                    beforeAll(async () => {
                                        result = await methodMap["select"](
                                            serviceClient.from(table),
                                        );
                                        console.log(
                                            `${actor} ${canOrCannot} ${method} ${table} confirmation result`,
                                            result,
                                        );
                                    });
                                    test("postgREST response status is ok", () =>
                                        expect(result.status).toBe(200));
                                    test("there is no result data", () =>
                                        expect(result.data.length).toBe(0));
                                });
                            } else {
                                describe("the row was not actually deleted", () => {
                                    let result;
                                    beforeAll(async () => {
                                        result = await methodMap["select"](
                                            serviceClient.from(table),
                                        );
                                    });
                                    test("postgREST response status is ok", () =>
                                        expect(result.status).toBe(200));
                                    test("there is result data", () =>
                                        expect(
                                            result.data.length,
                                        ).toBeGreaterThan(0));
                                });
                            }
                        }
                    });
                },
            );
        });
    });
});
