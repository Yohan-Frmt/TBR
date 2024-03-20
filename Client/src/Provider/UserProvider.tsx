import PropTypes from "prop-types";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState, } from "react";
import Storage from "../Storage";
import { TUser, TUserContext } from "../Type";

type TProps = {
    children: ReactNode;
};

const UserContext: React.Context<TUserContext> = createContext<TUserContext>({
    userId: "",
    user: null,
    setUsername: (): void => {
    },
});
const GetUser = async (): Promise<TUser> => {

    const FetchUser = async (url: string): Promise<TUser> =>
        fetch(url, {
            headers: new Headers({ "content-type": "application/json" }),
        })
            .then((res: Response) => res.json());

    const GetNewUser = async (): Promise<TUser> => {
        const user: TUser = await FetchUser(`${ import.meta.env.VITE_API_URL }/users/new`);
        Storage.setItem<string>("userId", user.id);
        return user;
    };
    const userId: number | null = Storage.getItem<number>("userId");

    if (!userId) return GetNewUser();
    return FetchUser(
        `${ import.meta.env.VITE_API_URL }/users/get?${ new URLSearchParams({
            userId: String(userId),
        }) }`
    );
};
export const UserProvider = ({ children }: TProps) => {
    const [userId, setUserId]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [user, setUser]: [TUser | null, React.Dispatch<React.SetStateAction<TUser | null>>] = useState<TUser | null>(null);
    const isSelectedUser = (currentUser: TUser): boolean => Object.keys(currentUser).length > 0 && currentUser.id !== ''

    const setUsername = useCallback(
        (name: string): void => {
            if (user) {
                const params = new URLSearchParams({ userId: String(user.id), name });
                fetch(`${ import.meta.env.VITE_API_URL }/users/setName?${ params }`, {
                    method: "PUT",
                })
                    .then((res: Response) => {
                        if (!res.ok) {
                            throw new Error(res.statusText);
                        }
                        return res.json();
                    })
                    .then((res) => {
                        setUser(res);
                    })
                    .catch((error) => {
                        console.error('A problem occurred when updating the username:', error);
                    });
            }
        },
        [user]
    );

    useEffect((): void => {
        GetUser().then((currentUser: TUser): void => {
            if (isSelectedUser(currentUser)) setUser(currentUser);
        });
    }, []);

    useEffect(() => {
        if (user && user.id !== userId) setUserId(user.id);
    }, [user, userId]);

    return (
        <UserContext.Provider value={ { userId, user, setUsername } }>
            { children }
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// export const useUser = () => useContext<TUserContext>(UserContext);
export const useUser = () => {
    const context: TUserContext = useContext<TUserContext>(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
