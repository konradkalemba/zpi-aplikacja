import React, {Component} from "react";
import styles from './styles.module.scss';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Select from "../Select";
import InputItem from "../InputItem";
import PreferenceItem from '../PreferenceItem'

class Preferences extends Component {

  render() {
    return (
      <div className={styles.preferencesWrapper}>
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
            console.log(values);
            setSubmitting(false);
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
              <div className={styles.row}>
                <PreferenceItem
                  children={
                    <Field
                      name="adType"
                      component={Select}
                      title={'Rodzaj ogłoszenia'}
                      placeholderMsg={'Rodzaj ogłoszenia'}
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
                  }
                />
                <PreferenceItem
                  children={
                    <Field name="roomsNumber"
                           component={Select}
                           title={'Liczba pokoi'}
                           placeholderMsg={'Liczba pokoi'}
                           items={[
                             {name: '1'},
                             {name: '2'},
                             {name: '3'},
                             {name: '4'}
                           ]}
                    />
                  }
                />
                <PreferenceItem
                  children={
                    <Field name="floor" component={Select} title={'Pietro'} placeholderMsg={'Wybierz piętro'}
                           items={[
                             {name: '1'},
                             {name: '2'},
                             {name: '3'},
                             {name: '4'}
                           ]}
                    />
                  }
                />
              </div>
              <div className={styles.row}>
                <PreferenceItem
                  children={
                    <React.Fragment>
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
                    </React.Fragment>
                  }
                />

                <PreferenceItem
                  children={
                    <React.Fragment>
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
                    </React.Fragment>
                  }
                />
                <PreferenceItem
                  children={
                    <button type="submit" className={styles.searchButton} disabled={isSubmitting}>
                      Search
                    </button>
                  }
                />
              </div>


            </Form>
          )
        }}
        </Formik>
      </div>
    );
  }
}

export default Preferences;

