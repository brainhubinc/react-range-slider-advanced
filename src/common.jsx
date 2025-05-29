import React from "react";
export const prettify = (num, separator) => {
  if (num === null || num === undefined) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
export const convertToPercent = (value, min, max) =>
  ((value - min) / (max - min)) * 100;
export const convertToValue = (percent, min, max, step) => {
  const value = min + ((max - min) * percent) / 100;
  const steppedValue = Math.round(value / step) * step;
  return Math.max(min, Math.min(steppedValue, max));
};
export const checkOverlap = (elem1, elem2) => {
  if (!elem1 || !elem2) return false;
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();
  return !(rect1.right < rect2.left || rect1.left > rect2.right);
};
export const updateElement = (
  ref,
  value,
  left,
  separator,
  prefix,
  postfix,
  isVisible = true,
) => {
  if (ref.current) {
    ref.current.style.left = `${left}%`;
    ref.current.style.transform = "translateX(-50%)";
    if (value !== null) {
      ref.current.textContent = prefix + prettify(value, separator) + postfix;
    }
    if (isVisible !== undefined) {
      ref.current.style.visibility = isVisible ? "visible" : "hidden";
    }
  }
};

export const getGridItems = (
  numberOfSections,
  min,
  max,
  step,
  separator
) => {
  const items = [];
  const stepPercent = 100 / numberOfSections;
  const numberOfSmallSections = (() => {
    if (numberOfSections > 28) {
      return 0;
    }
    if (numberOfSections > 14) {
      return 1;
    }
    if (numberOfSections > 7) {
      return 2;
    }
    if (numberOfSections > 4) {
      return 3;
    }
    return 4;
  })();
  for (let i = 0; i <= numberOfSections; i++) {
    const elements = [];
    const bigPercent = i * stepPercent;

    elements.push(
      <span
        key={`big-${i}`}
        className="irs-grid-pol"
        style={{ left: `${bigPercent}%` }}
      />
    );

    if (i < numberOfSections && numberOfSmallSections > 0) {
      const smallStepPercent = stepPercent / (numberOfSmallSections + 1);
      for (let j = 1; j <= numberOfSmallSections; j++) {
        const smallPercent = bigPercent + j * smallStepPercent;
        if (smallPercent >= 100) break;

        elements.push(
          <span
            key={`small-${i}-${j}`}
            className="irs-grid-pol small"
            style={{ left: `${smallPercent}%` }}
          />
        );
      }
    }

    if (i % 2 === 0) {
      const value = convertToValue(bigPercent, min, max, step);
      elements.push(
        <span
          key={`text-${i}`}
          className={`irs-grid-text js-grid-text-${i}`}
          style={{ left: `${bigPercent}%`, transform: "translateX(-50%)" }}
        >
          {prettify(value, separator)}
        </span>
      );
    }

    items.push(
      <React.Fragment key={`fragment-${i}`}>{elements}</React.Fragment>
    );
  }

  return items;
};
export const Slider = ({ sliderRef, handle, classNames }) => {
  return (
    <div className={classNames}>
      <div
        ref={sliderRef}
        className="slider-container"
        onMouseDown={handle}
        onTouchStart={handle}
      >
        <span className="slider-pointer" />
        <span className="slider-handle" />
        <div className="slider-lines-container">
          <span className="slider-left-line" />
          <span className="slider-right-line" />
        </div>
      </div>
    </div>
  );
};
