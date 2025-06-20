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
    <div style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont,\"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif"
    }}>
      <h1>React Range Slider Example</h1>
      <DoubleRangeSlider
        min={min}
        max={max}
        from={min}
        to={max}
        step={10}
        numberOfSections={10}
        prefix="P "
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
