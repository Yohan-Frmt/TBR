import PropTypes from "prop-types";
import { MouseEventHandler } from "react";

interface ButtonProps {
    onClick: MouseEventHandler;
    title: string;
}

export const Button = ({ onClick, title }: ButtonProps): JSX.Element => (
    <button
        tabIndex={ 0 }
        type="button"
        className="button  "
        onClick={ onClick }
    >
        { title }
    </button>
);

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};
