import React from "react";
import {
  checkOverlap,
  convertToPercent,
  convertToValue,
  getGridItems,
  prettify,
  Slider,
  updateElement,
} from "./common";

interface SimpleRangeSliderProps {
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  numberOfSections?: number;
  separator?: string;
  prefix?: string;
  postfix?: string;
  onFinish?: (currentValue: number) => void;
}

const SimpleRangeSlider: React.FC<SimpleRangeSliderProps> = ({
  min = 0,
  max = 100,
  value = 10,
  step = 10,
  numberOfSections = 10,
  separator = " ",
  prefix = "",
  postfix = "",
  onFinish = (currentValue) => console.log(currentValue),
}) => {
  const [currentValue, setCurrentValue] = React.useState<number>(Number(value));
  const [showDefaultFromValue, setShowDefaultFromValue] = React.useState<boolean>(false);
  const [showDefaultToValue, setShowDefaultToValue] = React.useState<boolean>(false);

  const sliderContainerRef = React.useRef<HTMLDivElement>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLSpanElement>(null);
  const valueRef = React.useRef<HTMLSpanElement>(null);
  const hiddenInputRef = React.useRef<HTMLInputElement>(null);
  const toDefaultRef = React.useRef<HTMLSpanElement>(null);
  const fromDefaultRef = React.useRef<HTMLSpanElement>(null);
  const isDraggingRef = React.useRef<boolean>(false);
  const startXRef = React.useRef<number>(0);
  const startLeftRef = React.useRef<number>(0);

  const prettifyCall = React.useCallback(
    (num: number) => prettify(num, separator),
    [separator]
  );

  const convertToPercentCall = React.useCallback(
    (value: number) => convertToPercent(value, min, max),
    [min, max]
  );

  const convertToValueCall = React.useCallback(
    (percent: number) => convertToValue(percent, min, max, step),
    [min, max, step]
  );

  const checkOverlapCall = React.useCallback(
    (elem1: HTMLElement | null, elem2: HTMLElement | null) => checkOverlap(elem1, elem2),
    []
  );

  const updateSliderValues = React.useCallback(() => {
    const currentPercent = convertToPercentCall(currentValue);

    updateElement(
      sliderRef as React.RefObject<HTMLElement>,
      null,
      currentPercent,
      separator,
      prefix,
      postfix
    );
    updateElement(
      valueRef as React.RefObject<HTMLElement>,
      currentValue,
      currentPercent,
      separator,
      prefix,
      postfix
    );

    if (barRef.current) {
      barRef.current.style.left = "0%";
      barRef.current.style.width = `${currentPercent}%`;
    }

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = `$${currentValue}`;
    }

    setShowDefaultFromValue(
      checkOverlapCall(fromDefaultRef.current, valueRef.current)
    );
    setShowDefaultToValue(
      checkOverlapCall(valueRef.current, toDefaultRef.current)
    );
  }, [currentValue, convertToPercentCall, checkOverlapCall, separator, prefix, postfix]);

  const handleStart = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    isDraggingRef.current = true;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;

    const slider = sliderRef.current;
    if (slider) {
      startLeftRef.current = parseFloat(slider.style.left) || 0;
    }
  }, []);

  const handleMove = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !sliderContainerRef.current) return;
      if (e.cancelable) e.preventDefault();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      if (clientX === undefined) return;

      const containerRect = sliderContainerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      let newX = Math.max(
        0,
        Math.min(clientX - containerRect.left, containerWidth)
      );
      let newPercent = (newX / containerWidth) * 100;
      const newValue = convertToValueCall(newPercent);
      setCurrentValue(newValue);
    },
    [convertToValueCall]
  );

  const handleEnd = React.useCallback(() => {
    if (isDraggingRef.current) {
      onFinish(currentValue);
      isDraggingRef.current = false;
    }
  }, [currentValue, onFinish]);

  React.useEffect(() => {
    const handleMoveWrapper = (e: MouseEvent | TouchEvent) => {
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
    setCurrentValue(Number(value));
  }, [value]);

  React.useEffect(() => {
    updateSliderValues();
  }, [currentValue, updateSliderValues]);

  const getGridItemsCall = React.useCallback(
    () => getGridItems({numberOfSections, min, max, step, separator}),
    [numberOfSections, min, max, step, separator]
  );

  return (
    <div className="range-slider-container">
      <span className="irs js-irs-3 irs-with-grid" ref={sliderContainerRef}>
        <span className="irs">
          <span className="irs-line" tabIndex={-1}>
            <span className="irs-line-left"></span>
            <span className="irs-line-mid"></span>
            <span className="irs-line-right"></span>
          </span>
          <span
            className="irs-min"
            ref={fromDefaultRef}
            style={{ visibility: showDefaultFromValue ? "hidden" : "visible" }}
          >
            {prefix + prettifyCall(min) + postfix}
          </span>
          <span
            className="irs-max"
            ref={toDefaultRef}
            style={{ visibility: showDefaultToValue ? "hidden" : "visible" }}
          >
            {prefix + prettifyCall(max) + postfix}
          </span>
          <span className="irs-to" ref={valueRef} />
        </span>
        <span className="irs-grid">{getGridItemsCall()}</span>
        <span className="irs-bar" ref={barRef} />
        <span className="irs-shadow shadow-from" />
        <span className="irs-shadow shadow-to" />
        <Slider sliderRef={sliderRef} handle={handleStart} classNames={"to"} />
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

export default SimpleRangeSlider;