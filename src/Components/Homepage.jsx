import React, { useState, useEffect, useRef } from "react";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from "victory";
import "./Homepage.css";

function Homepage() {
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const intervalIdRef = useRef(null);
  const [intervalTime, setIntervalTime] = useState(1000);
  const [chartWidth, setChartWidth] = useState(1000);
  const [numChannels, setNumChannels] = useState(2); // Default number of channels

  const barColors = ["#91E631", "#5C1DEC", "#EA1448"];
  const numericalIndicators = Array.from({ length: numChannels }, (_, index) =>
    String.fromCharCode(65 + index)
  ); // A, B, ...

  useEffect(() => {
    let intervalId;

    const generateRandomNumbers = () => {
      const randomNumbersArray = Array.from({ length: numChannels }, () =>
        Math.floor(Math.random() * 11)
      );

      setRandomNumbers((prevNumbers) => [...prevNumbers, randomNumbersArray]);
    };

    if (isGenerating) {
      intervalIdRef.current = setInterval(generateRandomNumbers, intervalTime);
    }

    return () => clearInterval(intervalIdRef.current);
  }, [isGenerating, numChannels, intervalTime]);

  const handleStart = () => {
    setIsGenerating(true);
  };

  const handleStop = () => {
    setIsGenerating(false);
    clearInterval(intervalIdRef.current);
  };

  const handleIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value, 10);
    setIntervalTime(newInterval);
  };

  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10);
    setChartWidth(newWidth);
  };

  const handleNumChannelsChange = (e) => {
    const newNumChannels = parseInt(e.target.value, 10);
    setNumChannels(newNumChannels);
  };

  return (
    <div className="body">
      <div className="parameters">
        <h3>Random Numbers Bar Chart</h3>
        <label>
          Interval Time (ms):
          <input
            type="number"
            value={intervalTime}
            onChange={handleIntervalChange}
          />
        </label>
        <label>
          Chart Width:
          <input
            type="number"
            value={chartWidth}
            onChange={handleWidthChange}
          />
        </label>
        <label>
          Number of Channels:
          <input
            type="number"
            value={numChannels}
            onChange={handleNumChannelsChange}
          />
        </label>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
      </div>
      {/* CHARTS HERE */}
      <div className="charts-container">
        {numericalIndicators.map((indicator, index) => (
          <div className="chart" style={{ overflowX: "auto" }} key={indicator}>
            <VictoryChart
              theme={VictoryTheme.material}
              width={chartWidth}
              height={300}
              domainPadding={20}
            >
              <VictoryBar
                data={randomNumbers.map((numbers, i) => ({
                  x: i + 1,
                  y: numbers[index],
                  label: `${indicator}: ${numbers[index]}`,
                }))}
                style={{
                  data: {
                    fill: barColors[index % barColors.length],
                    width: 30,
                    strokeWidth: 2,
                    stroke: "white",
                    borderRadius: 5,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  },
                }}
              />
              <VictoryAxis
                tickValues={Array.from(
                  { length: randomNumbers.length },
                  (_, i) => i + 1
                )}
              />
              <VictoryAxis
                dependentAxis
                tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              />
            </VictoryChart>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;
