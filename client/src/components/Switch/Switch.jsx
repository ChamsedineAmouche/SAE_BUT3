import React, { useState } from "react";

const Switch = ({ option1Title, option2Title, selectedDefault, onSwitchChange }) => {
  const [selected, setSelected] = useState(selectedDefault);

  const handleClick = (option) => {
    setSelected(option);
    if (onSwitchChange) {
      onSwitchChange(option);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-yellowGreen1 bg-opacity-10 mx-12 flex space-x-4 p-2 items-center justify-center rounded-full">
        <span
          onClick={() => handleClick(option1Title)}
          className={`py-2 px-4 rounded-full text-lg font-semibold text-center cursor-pointer whitespace-nowrap ${
            selected === option1Title ? "bg-yellowGreen1 text-white" : "bg-white text-darkGreen"
          }`}
        >
          {option1Title}
        </span>
        <span
          onClick={() => handleClick(option2Title)}
          className={`py-2 px-6 rounded-full text-lg font-semibold text-center cursor-pointer whitespace-nowrap ${
            selected === option2Title ? "bg-yellowGreen1 text-white" : "bg-white text-darkGreen"
          }`}
        >
          {option2Title}
        </span>
      </div>
    </div>
  );
};

export default Switch;