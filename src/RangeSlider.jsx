import React from 'react';
import './index.css';

const RangeSlider = ({
  min = 0,
  max =  100,
  fromPr = 10,
  toPr = 90,
  step = 10,
  grid_num = 10,
  small_max = 2,
  onFinish=({from, to}) => console.log(from, to),
}) => {
  const [fromValue, setFromValue] = React.useState(Number(fromPr))
  const [toValue, setToValue] = React.useState(Number(toPr))
  const [showSingleValue, setShowSingleValue] = React.useState(false)
  const [showDefaultFromValue, setShowDefaultFromValue] = React.useState(false)
  const [showDefaultToValue, setShowDefaultToValue] = React.useState(false)

  const sliderContainerRef = React.useRef(null)
  const sliderFromRef = React.useRef(null)
  const sliderToRef = React.useRef(null)
  const barRef = React.useRef(null)
  const fromValueRef = React.useRef(null)
  const toValueRef = React.useRef(null)
  const singleValueRef = React.useRef(null)
  const hiddenInputRef = React.useRef(null)
  const toDefaultRef = React.useRef(null)
  const fromDefaultRef = React.useRef(null)
  const isDraggingRef = React.useRef(null)
  const startXRef = React.useRef(0)
  const startLeftRef = React.useRef(0)

  const prettify = React.useCallback((num) => {
    if (num === null || num === undefined) return ''
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }, [])

  const convertToPercent = React.useCallback(
    (value) => ((value - min) / (max - min)) * 100,
    [min, max]
  )

  const convertToValue = React.useCallback(
    (percent) => {
      const value = min + ((max - min) * percent) / 100
      const steppedValue = Math.round(value / step) * step
      return Math.max(min, Math.min(steppedValue, max))
    },
    [min, max, step]
  )

  const checkOverlap = React.useCallback((elem1, elem2) => {
    if (!elem1 || !elem2) return false
    const rect1 = elem1.getBoundingClientRect()
    const rect2 = elem2.getBoundingClientRect()
    return !(rect1.right < rect2.left || rect1.left > rect2.right)
  }, [])

  const updateSliderValues = React.useCallback(() => {
    const fromPercent = convertToPercent(fromValue)
    const toPercent = convertToPercent(toValue)
    const centerPercent = (fromPercent + toPercent) / 2

    const updateElement = (ref, value, left, isVisible = true) => {
      if (ref.current) {
        ref.current.style.left = `${left}%`
        ref.current.style.transform = 'translateX(-50%)'
        if (value !== null) {
          ref.current.textContent = `Р ${prettify(value)}`
        }
        if (isVisible !== undefined) {
          ref.current.style.visibility = isVisible ? 'visible' : 'hidden'
        }
      }
    }

    updateElement(sliderFromRef, null, fromPercent)
    updateElement(sliderToRef, null, toPercent)
    updateElement(fromValueRef, fromValue, fromPercent, !showSingleValue)
    updateElement(toValueRef, toValue, toPercent, !showSingleValue)

    if (barRef.current) {
      barRef.current.style.left = `${fromPercent}%`
      barRef.current.style.width = `${toPercent - fromPercent}%`
    }

    if (singleValueRef.current) {
      singleValueRef.current.style.left = `${centerPercent}%`
      singleValueRef.current.style.transform = 'translateX(-50%)'
      singleValueRef.current.textContent =
        fromValue === toValue
          ? `Р ${prettify(toValue)}`
          : `Р ${prettify(fromValue)} — Р ${prettify(toValue)}`
      singleValueRef.current.style.visibility = showSingleValue
        ? 'visible'
        : 'hidden'
    }

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = `${fromValue},${toValue}`
    }

    const overlap = checkOverlap(fromValueRef.current, toValueRef.current)
    setShowSingleValue(overlap)

    if (!overlap) {
      setShowDefaultFromValue(
        checkOverlap(fromDefaultRef.current, fromValueRef.current)
      )
      setShowDefaultToValue(
        checkOverlap(toValueRef.current, toDefaultRef.current)
      )
    } else {
      setShowDefaultFromValue(
        checkOverlap(fromDefaultRef.current, singleValueRef.current)
      )
      setShowDefaultToValue(
        checkOverlap(singleValueRef.current, toDefaultRef.current)
      )
    }
  }, [
    fromValue,
    toValue,
    convertToPercent,
    checkOverlap,
    showSingleValue,
    prettify,
  ])

  const handleStart = React.useCallback(
    (sliderType) => (e) => {
      if (e.cancelable) e.preventDefault()
      isDraggingRef.current = sliderType

      const clientX = e.clientX || e.touches[0].clientX
      startXRef.current = clientX

      const slider =
        sliderType === 'from' ? sliderFromRef.current : sliderToRef.current
      startLeftRef.current = parseFloat(slider.style.left) || 0
    },
    []
  )

  const handleMove = React.useCallback(
    (e) => {
      if (!isDraggingRef.current || !sliderContainerRef.current) return

      if (e.cancelable) e.preventDefault()

      const clientX = e.clientX || (e.touches && e.touches[0].clientX)
      if (clientX === undefined) return

      const containerRect = sliderContainerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      let newX = Math.max(
        0,
        Math.min(clientX - containerRect.left, containerWidth)
      )
      let newPercent = (newX / containerWidth) * 100

      if (isDraggingRef.current === 'from') {
        const toPercent = parseFloat(sliderToRef.current.style.left)
        newPercent = Math.min(newPercent, toPercent)
        const newValue = convertToValue(newPercent)
        setFromValue(newValue)
      } else if (isDraggingRef.current === 'to') {
        const fromPercent = parseFloat(sliderFromRef.current.style.left)
        newPercent = Math.max(newPercent, fromPercent)
        const newValue = convertToValue(newPercent)
        setToValue(newValue)
      }
    },
    [convertToValue]
  )

  const handleEnd = React.useCallback(() => {
    if (isDraggingRef.current) {
      onFinish({ from: fromValue, to: toValue })
      isDraggingRef.current = null
    }
  }, [fromValue, toValue, onFinish])

  React.useEffect(() => {
    const handleMoveWrapper = (e) => {
      if (isDraggingRef.current) {
        handleMove(e)
      }
    }

    const handleEndWrapper = () => {
      if (isDraggingRef.current) {
        handleEnd()
      }
    }

    document.addEventListener('mousemove', handleMoveWrapper)
    document.addEventListener('mouseup', handleEndWrapper)
    document.addEventListener('touchmove', handleMoveWrapper, {
      passive: false,
    })
    document.addEventListener('touchend', handleEndWrapper)

    return () => {
      document.removeEventListener('mousemove', handleMoveWrapper)
      document.removeEventListener('mouseup', handleEndWrapper)
      document.removeEventListener('touchmove', handleMoveWrapper)
      document.removeEventListener('touchend', handleEndWrapper)
    }
  }, [handleMove, handleEnd])

  React.useEffect(() => {
    if (fromPr <= toPr) {
      setFromValue(Number(fromPr))
      setToValue(Number(toPr))
    }
  }, [fromPr, toPr])

  React.useEffect(() => {
    updateSliderValues()
  }, [fromValue, toValue, updateSliderValues])

  const getGridItems = React.useCallback(() => {
    const items = []
    const stepPercent = 100 / grid_num

    for (let i = 0; i <= grid_num; i++) {
      const elements = []
      const bigPercent = i * stepPercent

      elements.push(
        <span
          key={`big-${i}`}
          className="irs-grid-pol"
          style={{ left: `${bigPercent}%` }}
        />
      )

      if (i < grid_num && small_max > 0) {
        const smallStepPercent = stepPercent / (small_max + 1)
        for (let j = 1; j <= small_max; j++) {
          const smallPercent = bigPercent + j * smallStepPercent
          if (smallPercent >= 100) break

          elements.push(
            <span
              key={`small-${i}-${j}`}
              className="irs-grid-pol small"
              style={{ left: `${smallPercent}%` }}
            />
          )
        }
      }

      if (i % 2 === 0) {
        const value = convertToValue(bigPercent)
        elements.push(
          <span
            key={`text-${i}`}
            className={`irs-grid-text js-grid-text-${i}`}
            style={{ left: `${bigPercent}%`, transform: 'translateX(-50%)'}}
          >
            {prettify(value)}
          </span>
        )
      }

      items.push(
        <React.Fragment key={`fragment-${i}`}>{elements}</React.Fragment>
      )
    }

    return items
  }, [grid_num, small_max, convertToValue, prettify])

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
            style={{ visibility: showDefaultFromValue ? 'hidden' : 'visible' }}
          >
            {`Р ${min}`}
          </span>
          <span
            className="irs-max"
            ref={toDefaultRef}
            style={{ visibility: showDefaultToValue ? 'hidden' : 'visible' }}
          >
            {`Р ${prettify(max)}`}
          </span>
          <span className="irs-from" ref={fromValueRef} />
          <span className="irs-to" ref={toValueRef} />
          <span className="irs-single" ref={singleValueRef} />
        </span>
        <span className="irs-grid">{getGridItems()}</span>
        <span className="irs-bar" ref={barRef} />
        <span className="irs-shadow shadow-from" />
        <span className="irs-shadow shadow-to" />
        <span
          className={`irs-slider from ${fromValue === min ? 'type_last' : ''}`}
          ref={sliderFromRef}
          onMouseDown={handleStart('from')}
          onTouchStart={handleStart('from')}
        />
        <span
          className={`irs-slider to ${toValue === max ? 'type_last' : ''}`}
          ref={sliderToRef}
          onMouseDown={handleStart('to')}
          onTouchStart={handleStart('to')}
        />
      </span>
      <input
        type="text"
        readOnly
        className="irs-hidden-input"
        ref={hiddenInputRef}
      />
    </div>
  )
}

export default RangeSlider;