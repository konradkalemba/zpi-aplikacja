import React from "react";
import styles from "./styles.module.scss";
import {Field} from "formik";
import Select from "react-select";

const SelectField = ({
  options,
  field,
  form,
  isMulti = false,
  placeholder = 'Wybierz'
}) => {
  const onChange = (option) => {
    form.setFieldValue(
      field.name,
      isMulti
        ? (option).map((item) => item.value)
        : (option).value
    );
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter(option => field.value.indexOf(option.value) >= 0)
        : options.find(option => option.value === field.value);
    } else {
      return isMulti ? [] : ('');
    }
  };
  return (
    <Select
        className={styles.selectInput}
        options={options}
        name={field.name}
        placeholder={placeholder}
        value={getValue()}
        isMulti={isMulti}
        onChange={onChange}
        onBlur={field.onBlur}
    />
  )
}

export default SelectField