# React Range Slider Advanced 🎚️

![npm](https://img.shields.io/npm/v/react-range-slider-advanced)
![license](https://img.shields.io/npm/l/react-range-slider-advanced)
![downloads](https://img.shields.io/npm/dm/react-range-slider-advanced)

A modern, customizable, and interactive Range Slider component for React applications with support for multi-range selection, value grids, and adaptive UI.

## 🌟 Features

- Fully customizable appearance
- Touch device support
- Adaptive value labels
- Customizable value grid
- Smooth drag animation
- Mobile-optimized

## 📦 Installation

```bash
npm install react-range-slider-advanced
# or
yarn add react-range-slider-advanced
```

## 🚀 Quick Start
```jsx
import React from 'react';
import RangeSlider from 'react-range-slider-advanced';
import 'react-range-slider-advanced/style.css';

function App() {
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <RangeSlider
        min={0}
        max={1000}
        fromPr={200}
        toPr={800}
        step={50}
        grid_num={10}
        small_max={2}
        onFinish={({ from, to }) => console.log('Selected range:', from, to)}
      />
    </div>
  );
}

export default App;
```

## ⚙️ Props

|      Argument      |    Type   |  Default     |           Description            |
|--------------------|-----------|--------------|----------------------------------|
| `min`              | `number`  | `0`          | Minimum value                    |
| `max`              | `number`  | `100`        | Maximum value                    |
| `from`             | `number`  | `10`         | Initial "from" value             |
| `to`               | `number`  | `90`         | Initial "to" value               |
| `step`             | `number`  | `10`         | Value change step                |
| `numberOfSections` | `number`  | `10`         | Number of main grid divisions    |
| `onFinish`         | `function`| `console.log`| Callback when range is changed   |
