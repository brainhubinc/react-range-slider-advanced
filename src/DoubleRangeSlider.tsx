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

interface DoubleRangeSliderProps {
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
  numberOfSections?: number;
  separator?: string;
  valuesSeparator?: string;
  prefix?: string;
  postfix?: string;
  onFinish?: ({ from, to }: { from: number; to: number }) => void;
}

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
  onFinish = () => {},
}: DoubleRangeSliderProps) => {
  const [fromValue, setFromValue] = React.useState<number>(Number(from));
  const [toValue, setToValue] = React.useState<number>(Number(to));
  const [showSingleValue, setShowSingleValue] = React.useState<boolean>(false);
  const [showDefaultFromValue, setShowDefaultFromValue] =
    React.useState<boolean>(false);
  const [showDefaultToValue, setShowDefaultToValue] =
    React.useState<boolean>(false);

  const sliderContainerRef = React.useRef<HTMLDivElement>(null);
  const sliderFromRef = React.useRef<HTMLDivElement>(null);
  const sliderToRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLSpanElement>(null);
  const fromValueRef = React.useRef<HTMLSpanElement>(null);
  const toValueRef = React.useRef<HTMLSpanElement>(null);
  const singleValueRef = React.useRef<HTMLSpanElement>(null);
  const hiddenInputRef = React.useRef<HTMLInputElement>(null);
  const toDefaultRef = React.useRef<HTMLSpanElement>(null);
  const fromDefaultRef = React.useRef<HTMLSpanElement>(null);
  const isDraggingRef = React.useRef<"from" | "to" | null>(null);
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
    (elem1: HTMLElement, elem2: HTMLElement) => checkOverlap(elem1, elem2),
    []
  );

  const updateSliderValues = React.useCallback(() => {
    const fromPercent = convertToPercentCall(fromValue);
    const toPercent = convertToPercentCall(toValue);
    const centerPercent = (fromPercent + toPercent) / 2;

    updateElement(
      sliderFromRef as React.RefObject<HTMLElement>,
      null,
      fromPercent,
      separator,
      prefix,
      postfix
    );
    updateElement(
      sliderToRef as React.RefObject<HTMLElement>,
      null,
      toPercent,
      separator,
      prefix,
      postfix
    );
    updateElement(
      fromValueRef as React.RefObject<HTMLElement>,
      fromValue,
      fromPercent,
      separator,
      prefix,
      postfix,
      !showSingleValue
    );
    updateElement(
      toValueRef as React.RefObject<HTMLElement>,
      toValue,
      toPercent,
      separator,
      prefix,
      postfix,
      !showSingleValue
    );

    if (barRef.current) {
      barRef.current.style.left = `${fromPercent}%`;
      barRef.current.style.width = `${toPercent - fromPercent}%`;
    }

    if (singleValueRef.current) {
      singleValueRef.current.style.left = `${centerPercent}%`;
      singleValueRef.current.style.transform = "translateX(-50%)";
      singleValueRef.current.textContent =
        fromValue === toValue
          ? prefix + prettifyCall(toValue) + postfix
          : `${prefix + prettifyCall(fromValue) + postfix} ${valuesSeparator} ${
              prefix + prettifyCall(toValue) + postfix
            }`;
      singleValueRef.current.style.visibility = showSingleValue
        ? "visible"
        : "hidden";
    }

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = `${fromValue},${toValue}`;
    }

    if (fromValueRef.current && toValueRef.current) {
      const overlap = checkOverlapCall(
        fromValueRef.current,
        toValueRef.current
      );
      setShowSingleValue(overlap);

      if (!overlap) {
        if (fromDefaultRef.current && fromValueRef.current) {
          setShowDefaultFromValue(
            checkOverlapCall(fromDefaultRef.current, fromValueRef.current)
          );
        }
        if (toValueRef.current && toDefaultRef.current) {
          setShowDefaultToValue(
            checkOverlapCall(toValueRef.current, toDefaultRef.current)
          );
        }
      } else {
        if (fromDefaultRef.current && singleValueRef.current) {
          setShowDefaultFromValue(
            checkOverlapCall(fromDefaultRef.current, singleValueRef.current)
          );
        }
        if (singleValueRef.current && toDefaultRef.current) {
          setShowDefaultToValue(
            checkOverlapCall(singleValueRef.current, toDefaultRef.current)
          );
        }
      }
    }
  }, [
    fromValue,
    toValue,
    convertToPercentCall,
    checkOverlapCall,
    showSingleValue,
    prettifyCall,
    separator,
    prefix,
    postfix,
    valuesSeparator,
  ]);

  const handleStart = React.useCallback(
    (sliderType: "from" | "to") => (e: React.MouseEvent | React.TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      isDraggingRef.current = sliderType;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      startXRef.current = clientX;

      const slider =
        sliderType === "from" ? sliderFromRef.current : sliderToRef.current;
      if (slider) {
        startLeftRef.current = parseFloat(slider.style.left) || 0;
      }
    },
    []
  );

  const handleMove = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !sliderContainerRef.current) return;

      if (e.cancelable) e.preventDefault();

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      if (clientX === undefined) return;

      const containerRect = sliderContainerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      let newX = Math.max(
        0,
        Math.min(clientX - containerRect.left, containerWidth)
      );
      let newPercent = (newX / containerWidth) * 100;

      if (isDraggingRef.current === "from" && sliderToRef.current) {
        const toPercent = parseFloat(sliderToRef.current.style.left);
        newPercent = Math.min(newPercent, toPercent);
        const newValue = convertToValueCall(newPercent);
        setFromValue(newValue);
      } else if (isDraggingRef.current === "to" && sliderFromRef.current) {
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
    if (from <= to) {
      setFromValue(Number(from));
      setToValue(Number(to));
    }
  }, [from, to]);

  React.useEffect(() => {
    updateSliderValues();
  }, [fromValue, toValue, updateSliderValues]);

  const getGridItemsMemo = React.useCallback(
    () => getGridItems({ numberOfSections, min, max, step, separator }),
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
