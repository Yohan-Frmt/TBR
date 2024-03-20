import PropTypes from "prop-types";
import React from "react";
import { TBoolean, TUser } from "../Type";
import { User } from "./User";

type TProps = {
    users: TUser[];
    capacity: string | null;
    id: string;
    isModerator: TBoolean;
};

export const PlayerList = ({ users, capacity, id, isModerator }: TProps) => {
    return users && users.length > 0 ? (
        <>
            <div>
                Players
                { capacity &&
                    `: ${ users && users.length }/${
                        Number(capacity) >= 0 ? capacity : "∞"
                    }` }
            </div>
            <div>
                { users &&
                    users.map(
                        (user: TUser) =>
                            user && (
                                <User
                                    key={ user.id }
                                    name={ user.name }
                                    userId={ user.id }
                                    id={ id }
                                    isModerator={ isModerator }
                                    isInactive
                                />
                            )
                    ) }
            </div>
        </>
    ) : null;
};

PlayerList.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    capacity: PropTypes.string,
    id: PropTypes.string.isRequired,
    isModerator: PropTypes.bool.isRequired,
};

PlayerList.defaultProps = {
    capacity: null,
};
