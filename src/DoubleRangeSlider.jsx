import React from "react";
import {
  checkOverlap,
  convertToPercent,
  convertToValue,
  getGridItems,
  prettify,
  updateElement,
  Slider,
} from "./common";

const DoubleRangeSlider = ({
  min = 0,
  max = 100,
  from = 10,
  to = 90,
  step = 10,
  numberOfSections = 10,
  separator = " ",
  valuesSeparator = "—",
  prefix = "",
  postfix = "",
  onFinish = ({ from, to }) => console.log(from, to),
}) => {
  const [fromValue, setFromValue] = React.useState(Number(from));
  const [toValue, setToValue] = React.useState(Number(to));
  const [showSingleValue, setShowSingleValue] = React.useState(false);
  const [showDefaultFromValue, setShowDefaultFromValue] = React.useState(false);
  const [showDefaultToValue, setShowDefaultToValue] = React.useState(false);

  const sliderContainerRef = React.useRef(null);
  const sliderFromRef = React.useRef(null);
  const sliderToRef = React.useRef(null);
  const barRef = React.useRef(null);
  const fromValueRef = React.useRef(null);
  const toValueRef = React.useRef(null);
  const singleValueRef = React.useRef(null);
  const hiddenInputRef = React.useRef(null);
  const toDefaultRef = React.useRef(null);
  const fromDefaultRef = React.useRef(null);
  const isDraggingRef = React.useRef(null);
  const startXRef = React.useRef(0);
  const startLeftRef = React.useRef(0);

  const prettifyCall = React.useCallback((num) => prettify(num, separator), []);

  const convertToPercentCall = React.useCallback(
    (value) => convertToPercent(value, min, max),
    [min, max]
  );

  const convertToValueCall = React.useCallback(
    (percent) => convertToValue(percent, min, max, step),
    [min, max, step]
  );

  const checkOverlapCall = React.useCallback(
    (elem1, elem2) => checkOverlap(elem1, elem2),
    []
  );

  const updateSliderValues = React.useCallback(() => {
    const fromPercent = convertToPercentCall(fromValue);
    const toPercent = convertToPercentCall(toValue);
    const centerPercent = (fromPercent + toPercent) / 2;

    updateElement(sliderFromRef, null, fromPercent, separator, prefix, postfix);
    updateElement(sliderToRef, null, toPercent, separator, prefix, postfix);
    updateElement(fromValueRef, fromValue, fromPercent, separator, prefix, postfix, !showSingleValue);
    updateElement(toValueRef, toValue, toPercent, separator, prefix, postfix, !showSingleValue);

    if (barRef.current) {
      barRef.current.style.left = `${fromPercent}%`;
      barRef.current.style.width = `${toPercent - fromPercent}%`;
    }

    if (singleValueRef.current) {
      singleValueRef.current.style.left = `${centerPercent}%`;
      singleValueRef.current.style.transform = "translateX(-50%)";
      singleValueRef.current.textContent =
        fromValue === toValue
          ? `${prefix} ${prettifyCall(toValue) + postfix}`
          : `${prefix} ${
              prettifyCall(fromValue) + postfix
            } ${valuesSeparator} ${prefix} ${prettifyCall(toValue) + postfix}`;
      singleValueRef.current.style.visibility = showSingleValue
        ? "visible"
        : "hidden";
    }

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = `${fromValue},${toValue}`;
    }

    const overlap = checkOverlapCall(fromValueRef.current, toValueRef.current);
    setShowSingleValue(overlap);

    if (!overlap) {
      setShowDefaultFromValue(
        checkOverlapCall(fromDefaultRef.current, fromValueRef.current)
      );
      setShowDefaultToValue(
        checkOverlapCall(toValueRef.current, toDefaultRef.current)
      );
    } else {
      setShowDefaultFromValue(
        checkOverlapCall(fromDefaultRef.current, singleValueRef.current)
      );
      setShowDefaultToValue(
        checkOverlapCall(singleValueRef.current, toDefaultRef.current)
      );
    }
  }, [
    fromValue,
    toValue,
    convertToPercentCall,
    checkOverlapCall,
    showSingleValue,
    prettifyCall,
  ]);

  const handleStart = React.useCallback(
    (sliderType) => (e) => {
      if (e.cancelable) e.preventDefault();
      isDraggingRef.current = sliderType;

      const clientX = e.clientX || e.touches[0].clientX;
      startXRef.current = clientX;

      const slider =
        sliderType === "from" ? sliderFromRef.current : sliderToRef.current;
      startLeftRef.current = parseFloat(slider.style.left) || 0;
    },
    []
  );

  const handleMove = React.useCallback(
    (e) => {
      if (!isDraggingRef.current || !sliderContainerRef.current) return;

      if (e.cancelable) e.preventDefault();

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      if (clientX === undefined) return;

      const containerRect = sliderContainerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      let newX = Math.max(
        0,
        Math.min(clientX - containerRect.left, containerWidth)
      );
      let newPercent = (newX / containerWidth) * 100;

      if (isDraggingRef.current === "from") {
        const toPercent = parseFloat(sliderToRef.current.style.left);
        newPercent = Math.min(newPercent, toPercent);
        const newValue = convertToValueCall(newPercent);
        setFromValue(newValue);
      } else if (isDraggingRef.current === "to") {
        const fromPercent = parseFloat(sliderFromRef.current.style.left);
        newPercent = Math.max(newPercent, fromPercent);
        const newValue = convertToValueCall(newPercent);
        setToValue(newValue);
      }
    },
    [convertToValueCall]
  );

  const handleEnd = React.useCallback(() => {
    if (isDraggingRef.current) {
      onFinish({ from: fromValue, to: toValue });
      isDraggingRef.current = null;
    }
  }, [fromValue, toValue, onFinish]);

  React.useEffect(() => {
    const handleMoveWrapper = (e) => {
      if (isDraggingRef.current) {
        handleMove(e);
      }
    };

    const handleEndWrapper = () => {
      if (isDraggingRef.current) {
        handleEnd();
      }
    };

    document.addEventListener("mousemove", handleMoveWrapper);
    document.addEventListener("mouseup", handleEndWrapper);
    document.addEventListener("touchmove", handleMoveWrapper, {
      passive: false,
    });
    document.addEventListener("touchend", handleEndWrapper);

    return () => {
      document.removeEventListener("mousemove", handleMoveWrapper);
      document.removeEventListener("mouseup", handleEndWrapper);
      document.removeEventListener("touchmove", handleMoveWrapper);
      document.removeEventListener("touchend", handleEndWrapper);
    };
  }, [handleMove, handleEnd]);

  React.useEffect(() => {
    if (from <= to) {
      setFromValue(Number(from));
      setToValue(Number(to));
    }
  }, [from, to]);

  React.useEffect(() => {
    updateSliderValues();
  }, [fromValue, toValue, updateSliderValues]);

  const getGridItemsMemo = React.useCallback(
    () => getGridItems(numberOfSections, min, max, step, separator),
    [numberOfSections, convertToValueCall, prettifyCall]
  );

  return (
    <div className="range-slider-container">
      <span className="irs js-irs-3 irs-with-grid" ref={sliderContainerRef}>
        <span className="irs">
          <span className="irs-line" tabIndex="-1">
            <span className="irs-line-left"></span>
            <span className="irs-line-mid"></span>
            <span className="irs-line-right"></span>
          </span>
          <span
            className="irs-min"
            ref={fromDefaultRef}
            style={{ visibility: showDefaultFromValue ? "hidden" : "visible" }}
          >
            {`${prefix} ${prettifyCall(min) + postfix}`}
          </span>
          <span
            className="irs-max"
            ref={toDefaultRef}
            style={{ visibility: showDefaultToValue ? "hidden" : "visible" }}
          >
            {`${prefix} ${prettifyCall(max) + postfix}`}
          </span>
          <span className="irs-from" ref={fromValueRef} />
          <span className="irs-to" ref={toValueRef} />
          <span className="irs-single" ref={singleValueRef} />
        </span>
        <span className="irs-grid">{getGridItemsMemo()}</span>
        <span className="irs-bar" ref={barRef} />
        <span className="irs-shadow shadow-from" />
        <span className="irs-shadow shadow-to" />

        <Slider
          sliderRef={sliderFromRef}
          handle={handleStart("from")}
          classNames={"from"}
        />

        <Slider
          sliderRef={sliderToRef}
          handle={handleStart("to")}
          classNames={"to"}
        />
      </span>
      <input
        type="text"
        readOnly
        className="irs-hidden-input"
        ref={hiddenInputRef}
      />
    </div>
  );
};

export default DoubleRangeSlider;
