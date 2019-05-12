import React from "react";
import styles from './styles.module.scss'

const InputItem = ({
                       field: {name, value, onChange, onBlur},
                       form: {touched, errors},
                       id,
                       placeholder,
                       type,

                   }) => {
    return (
        <input
            name={name}
            id={id}
            type={type}
            onChange={onChange}
            onBlur={onBlur}
            className={styles.textInput}
            placeholder={placeholder}
        />
    );
};

export default InputItem