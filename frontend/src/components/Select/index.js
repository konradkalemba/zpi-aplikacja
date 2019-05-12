import React from "react";
import styles from "./styles.module.scss";
import {Field} from "formik";
import { FormControl, InputGroup } from 'react-bootstrap';


const Select = ({
                    field: {name, value, onChange, onBlur},
                    id,
                    title,
                    items,
                    placeholderMsg
                }) => {
    return (

        <Field
            component="select"
            name={name}
            className={styles.selectInput}
        >
            <option value="" disabled selected>{placeholderMsg}</option>
            {items.map((item) => <option
                value={item.id} key={item.id}>{item.name}</option>)}
        </Field>
    );
};

export default Select