import {Session, Subscription} from "@supabase/supabase-js";
import create from "zustand";
import {supabase} from "../supabaseClient";
import {isNullish} from "../utils";

export interface AuthStore {
    activate: () => Subscription["unsubscribe"];
    deactivate: Subscription["unsubscribe"];
    session: Session;
    signOut: () => void;
    state: "authenticating" | "authenticated" | "not_authenticated";
}

export const useAuthStore = create<AuthStore>((set) => {
    const session = supabase.auth.session();
    console.log("creating authStore", {session});
    return {
        activate: () => {
            console.log("activating authStore");
            void supabase.auth
                .refreshSession()
                .then(async ({error: refreshError}) => {
                    if (isNullish(refreshError)) return;
                    console.error(refreshError);
                    const {error: signOutError} = await supabase.auth.signOut();
                    if (isNullish(signOutError)) return;
                    console.error(signOutError);
                });
            const {data: subscription, error} = supabase.auth.onAuthStateChange(
                (event, session) => {
                    console.log("supabase.auth.onAuthStateChange", {
                        event,
                        session,
                    });
                    if (event === "SIGNED_IN") {
                        set({state: "authenticated"});
                    }
                    if (event === "SIGNED_OUT") {
                        set({state: "not_authenticated"});
                    }
                    set({session});
                },
            );
            if (!isNullish(error)) {
                throw error;
            }
            const deactivate = () => {
                console.log("deactivating authStore");
                subscription.unsubscribe();
            };
            set({deactivate});
            return deactivate;
        },
        deactivate: () => undefined,
        session,
        signOut: () =>
            void supabase.auth.signOut().then(({error}) => {
                if (!isNullish(error)) {
                    console.error(error);
                }
            }),
        state: "authenticating",
    };
});
