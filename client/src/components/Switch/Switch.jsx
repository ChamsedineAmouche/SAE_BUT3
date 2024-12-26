import React from "react";

const Switch = ({ option1Title, option2Title }) => {
  return (
    <div className="bg-yellowGreen1 bg-opacity-10 mx-12 flex space-x-4 p-2 items-center justify-center rounded-full">
      <span className="bg-white text-darkGreen p-2 rounded-full text-lg font-semibold">{option1Title}</span>
      <span className="bg-white text-darkGreen p-2 rounded-full text-lg font-semibold">{option2Title}</span>
    </div>
  );
};

export default Switch;
