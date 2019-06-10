import React from 'react';
import styles from './styles.module.scss';

const PreferenceItem = props => (
  <div className={styles.preferenceItem}>
    {props.children}
  </div>
);

export default PreferenceItem;