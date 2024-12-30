import React, { useState } from "react";
import styles from './RadioButton.module.css';  // Importer les styles du module CSS

const RadioButton = ({ id, label, checked, onChange }) => {
  return (
    <div className={styles.main}>
      <label htmlFor="">{label}</label>
      <div className={styles.container}>  {/* Utiliser le module CSS ici */}
      
        <input 
          type="checkbox" 
          className={styles.checkbox}  // Utiliser la classe spécifique au module
          id={id} 
          checked={checked} 
          onChange={onChange} 
        />
        <label className={styles.switch} htmlFor={id}>
          <span className={styles.slider}></span>
        </label>
      </div>
    </div>

  );
};

export default RadioButton;
