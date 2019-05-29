import React, {Component} from "react";
import styles from './styles.module.scss';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Select from "../Select";
import InputItem from "../InputItem";
import PreferenceItem from '../PreferenceItem'
import axios from 'axios';
import { connect } from 'react-redux';
import { setAds } from '../../actions';

const mapDispatchToProps = dispatch => ({
  setAds: ads => dispatch(setAds(ads))
});

class Preferences extends Component {
  render() {
    return (
      <div className={styles.preferencesWrapper}>
        <Formik
          initialValues={{
            size: '',
            roomsNumber: '',
            floor: '',
            priceMin: '',
            priceMax: '',
            areaMin: '',
            areaMax: ''
          }}
          onSubmit={(values, {setSubmitting}) => {            
            if (Array.isArray(values.roomsNumber)) {
              values.roomsNumber = values.roomsNumber.join(',');
            }

            if (Array.isArray(values.floor)) {
              values.floor = values.floor.join(',');
            }

            axios.get('http://localhost:3000/ads', {
                params: values
              })
              .then(
                (result) => {
                  this.props.setAds(result.data);
                  this.setState({
                    isLoaded: true
                  });
                },
                (error) => {
                  this.setState({
                    isLoaded: true,
                    error
                  });
                }
              )

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
                      name="size"
                      component={Select}
                      title={'Rodzaj ogłoszenia'}
                      placeholder={'Rodzaj ogłoszenia'}
                      options={[
                        {
                          value: 'flat',
                          label: 'Mieszkanie'
                        },
                        {
                          value: 'room',
                          label: 'Pokój'
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
                           placeholder={'Liczba pokoi'}
                           options={[
                             {value: '1', label: '1'},
                             {value: '2', label: '2'},
                             {value: '3', label: '3'},
                             {value: '4', label: '4'}
                           ]}
                           isMulti={true}
                    />
                  }
                />
                <PreferenceItem
                  children={
                    <Field name="floor" component={Select} title={'Pietro'} placeholder={'Wybierz piętro'}
                           options={[
                             {value: '1', label: '1'},
                             {value: '2', label: '2'},
                             {value: '3', label: '3'},
                             {value: '4', label: '4'},
                             {value: '5', label: '5'},
                             {value: '6', label: '6'}
                           ]}
                           isMulti={true}
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
                        name="areaMin"
                        id="areaMin"
                        placeholder="Powierzchnia min."
                        type={'number'}
                      />
                      <Field
                        component={InputItem}
                        name="areaMax"
                        id="areaMax"
                        placeholder="Powierzchnia max."
                        type={'number'}
                      />
                    </React.Fragment>
                  }
                />
                <PreferenceItem
                  children={
                    <button type="submit" className={styles.searchButton} disabled={isSubmitting}>
                      Filtruj
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

export default connect(
  null,
  mapDispatchToProps
)(Preferences);