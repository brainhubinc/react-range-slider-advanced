import React from 'react'
import RangeSlider from 'react-range-slider-advanced'
import 'react-range-slider-advanced/style.css'
function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React Range Slider Example</h1>
      <RangeSlider
        min={0}
        max={1000000}
        fromPr={200}
        toPr={800}
        step={10}
        grid_num={10}
        small_max={5}
        onFinish={({ from, to }) => console.log('Selected range:', from, to)}
      />
    </div>
  )
}

export default App