import PropTypes from "prop-types";
import React, { FormEventHandler, KeyboardEventHandler } from "react";

interface TextInputProps {
    value: string;
    placeholder: string;
    onKeyUp: KeyboardEventHandler;
    onInput: FormEventHandler;
}

export const TextInput = ({ value, placeholder, onKeyUp, onInput }: TextInputProps) => {
    return (
        <input type="text"
               className="box"
               value={ value }
               placeholder={ placeholder }
               onKeyUp={ onKeyUp }
               onInput={ onInput }
        />
    );
};

TextInput.propTypes = {
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onKeyUp: PropTypes.func,
    onInput: PropTypes.func,
};

TextInput.defaultProps = {
    onKeyUp: null,
    onInput: null,

};
