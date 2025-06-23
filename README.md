# React Range Slider Advanced 🎚️

[![npm](https://img.shields.io/npm/v/react-range-slider-advanced)](https://www.npmjs.com/package/react-range-slider-advanced)
[![license](https://img.shields.io/npm/l/react-range-slider-advanced)](https://www.npmjs.com/package/react-range-slider-advanced)
[![downloads](https://img.shields.io/npm/dt/react-range-slider-advanced)](https://www.npmjs.com/package/react-range-slider-advanced)

A modern, customizable, and interactive Range Slider component for React applications with support for multi-range selection, value grids, and adaptive UI.

## 🌟 Features

- Fully customizable appearance
- Touch device support
- Adaptive value labels
- Customizable value grid
- Smooth drag animation
- Mobile-optimized

<p><img src="https://github.com/user-attachments/assets/6cc286b9-02e7-4f3a-b1ee-ccb37233705b" width="800"></p>

**[Example - CodeSandbox](https://codesandbox.io/p/devbox/unruffled-cray-5v9yhk)**

## 📦 Installation

```bash
npm install react-range-slider-advanced
# or
yarn add react-range-slider-advanced
```

## 🚀 Quick Start
```jsx
import React from "react";
import {
  DoubleRangeSlider,
  SimpleRangeSlider,
} from "react-range-slider-advanced";
import "react-range-slider-advanced/style.css";
function App() {
  const min = 0;
  const max = 10000;
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>React Range Slider Example</h1>
      <DoubleRangeSlider
        min={min}
        max={max}
        from={min}
        to={max}
        step={10}
        numberOfSections={10}
        separator=","
        prefix="P"
        postfix="k"
        valuesSeparator='-'
        onFinish={({ from, to }) => console.log("Selected range:", from, to)}
      />
      <SimpleRangeSlider
        min={min}
        max={max}
        value={min}
        step={10}
        numberOfSections={10}
        separator=" "
        postfix="$"
        onFinish={(val) => console.log("Selected range:", val)}
      />
    </div>
  );
}

export default App;
```

## ⚙️ Props

### SimpleRangeSlider 🎚️
|      Argument      |    Type   |  Default     |           Description            |
|--------------------|-----------|--------------|----------------------------------|
| `min`              | `number`  | `0`          | Minimum value                    |
| `max`              | `number`  | `100`        | Maximum value                    |
| `value`            | `number`  | `10`         | Initial value                    |
| `step`             | `number`  | `10`         | Value change step                |
| `numberOfSections` | `number`  | `10`         | Number of main grid divisions    |
| `separator`        | `string`  | ` `          | Numbers separator                |
| `prefix`           | `string`  | ``           | Symbol before value              |
| `postfix`          | `string`  | ``           | Symbol after value               |
| `onFinish`         | `function`| ``           | Callback when range is changed   |

### DoubleRangeSlider 🎚️🎚️
|      Argument      |    Type   |  Default     |           Description            |
|--------------------|-----------|--------------|----------------------------------|
| `min`              | `number`  | `0`          | Minimum value                    |
| `max`              | `number`  | `100`        | Maximum value                    |
| `from`             | `number`  | `10`         | Initial "from" value             |
| `to`               | `number`  | `90`         | Initial "to" value               |
| `step`             | `number`  | `10`         | Value change step                |
| `numberOfSections` | `number`  | `10`         | Number of main grid divisions    |
| `separator`        | `string`  | ` `          | Numbers separator                |
| `valuesSeparator`  | `string`  | `-`          | Separator between values         |
| `prefix`           | `string`  | ``           | Symbol before value              |
| `postfix`          | `string`  | ``           | Symbol after value               |
| `onFinish`         | `function`| ``           | Callback when range is changed   |
