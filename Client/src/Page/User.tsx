import PropTypes from "prop-types";
import { TBoolean } from "../Type";

type TProps = {
    name: string;
    userId: string;
    id: string;
    isModerator: TBoolean;
    isSpectator: TBoolean;
    isInactive: TBoolean;
}
export const User = ({ name, userId, id, isModerator, isSpectator, isInactive }: TProps) => {
    return (
        <div key={ `user-${ userId }` }>
            { name }
        </div>
    );
};

User.propTypes = {
    name: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isModerator: PropTypes.bool.isRequired,
    isSpectator: PropTypes.bool,
    isInactive: PropTypes.bool,
};

User.defaultProps = {
    isSpectator: false,
    isInactive: false,
};
