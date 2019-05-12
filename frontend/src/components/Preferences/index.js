import React, {Component} from "react";
import styles from './styles.module.scss';
import {DisplayFormikState} from "./helper";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Select from "../Select";
import InputItem from "../InputItem";

class Preferences extends Component {

    render() {
        return (
            <Formik
                initialValues={{
                    adType: 'flat',
                    roomsNumber: '',
                    floor: '',
                    priceMin: '',
                    priceMax: '',
                    propertySizeMin: '',
                    propertySizeMax: ''
                }}
                onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 500);
                }}
            >{props => {
                const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                } = props;
                return (
                    <Form>
                        <Field name="adType" component={Select} title={'Rodzaj ogłoszenia'} placeholderMsg={'Rodzaj ogłoszenia'}
                               items={[
                                   {
                                       id: 'flat',
                                       name: 'Mieszkanie'
                                   },
                                   {
                                       id: 'room',
                                       name: 'Pokój'
                                   }
                               ]}
                        />

                        {values.adType === 'flat' ?
                            <Field name="roomsNumber" component={Select} title={'Liczba pokoi'} placeholderMsg={'Liczba pokoi'}
                                   items={[
                                       {name: '1'},
                                       {name: '2'},
                                       {name: '3'},
                                       {name: '4'}
                                   ]}
                            /> : null}
                        <Field name="floor" component={Select} title={'Pietro'} placeholderMsg={'Wybierz piętro'}
                               items={[
                                   {name: '1'},
                                   {name: '2'},
                                   {name: '3'},
                                   {name: '4'}
                               ]}
                        />
                        <Field
                            component={InputItem}
                            name="priceMin"
                            id="priceMin"
                            placeholder="Cena min."
                            type={'number'}
                        />
                        <Field
                            component={InputItem}
                            name="priceMax"
                            id="priceMax"
                            placeholder="Cena max."
                            type={'number'}
                        />
                        <Field
                            component={InputItem}
                            name="propertySizeMin"
                            id="propertySizeMin"
                            placeholder="Powierzchnia min."
                            type={'number'}
                        />
                        <Field
                            component={InputItem}
                            name="propertySizeMax"
                            id="propertySizeMax"
                            placeholder="Powierzchnia max."
                            type={'number'}
                        />


                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                        <DisplayFormikState {...props} />
                    </Form>
                )
            }}
            </Formik>
        );
    }
}

export default Preferences;

