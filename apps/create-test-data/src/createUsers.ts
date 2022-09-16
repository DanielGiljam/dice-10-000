import {faker} from "@faker-js/faker";
import {SupabaseClient, User} from "@supabase/supabase-js";
import {isNullish} from "./utils";

export interface UserWithPassword extends User {
    password: string;
}

export interface CreateUsersOptions {
    count?: number;
    emailFactory?: (subaddress: string) => string;
}

export const createUsers = async (
    supabase: SupabaseClient,
    {count = 8, emailFactory}: CreateUsersOptions = {},
): Promise<UserWithPassword[]> => {
    const getEmail = isNullish(emailFactory)
        ? () => faker.internet.email()
        : () => emailFactory(faker.random.alphaNumeric(6));
    const getPassword = () => faker.internet.password();
    const users: UserWithPassword[] = [];
    for (let i = 0; i < count; i++) {
        const email = getEmail();
        const password = getPassword();
        console.log("creating user", {email, password});
        const result = await supabase.auth.api.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (!isNullish(result.error)) {
            console.error("error when creating user", email);
            throw result.error;
        }
        console.log("created user", result.data);
        users.push({...result.data, password});
    }
    return users;
};
