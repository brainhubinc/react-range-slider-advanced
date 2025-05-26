# React Range Slider Advanced 🎚️

![npm](https://img.shields.io/npm/v/react-range-slider-advanced)
![license](https://img.shields.io/npm/l/react-range-slider-advanced)
![downloads](https://img.shields.io/npm/dm/react-range-slider-advanced)

Современный, настраиваемый и интерактивный компонент Range Slider для React-приложений с поддержкой мульти-диапазонов, сетки значений и адаптивным интерфейсом.

## 🌟 Особенности

- Полностью настраиваемый внешний вид
- Поддержка touch-устройств
- Адаптивные подписи значений
- Настраиваемая сетка значений
- Плавная анимация перетаскивания
- Мобильная оптимизация

## 📦 Установка

```bash
npm install react-range-slider-advanced
# или
yarn add react-range-slider-advanced
```

## 🚀 Быстрый старт
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

## ⚙️ Параметры
|   Параметр  |    Тип    | По умолчанию |           Описание               |
|-------------|-----------|--------------|----------------------------------|
| `min`       | `number`  | `0`          | Минимальное значение             |
| `max`       | `number`  | `100`        | Максимальное значение            |
| `fromPr`    | `number`  | `10`         | Начальное значение "от"          |
| `toPr`      | `number`  | `90`         | Начальное значение "до"          |
| `step`      | `number`  | `10`         | Шаг изменения значений           |
| `grid_num`  | `number`  | `10`         | Количество основных делений      |
| `small_max` | `number`  | `2`          | Количество промежуточных делений |
| `onFinish`  | `function`| `console.log`| Колбек при изменении диапазона   |
