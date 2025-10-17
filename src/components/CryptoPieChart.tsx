// src/components/CryptoPieChart.tsx
import React from "react";

type CryptoItem = {
  name: string;
  percentage: number;
  color: string; // Hex or Tailwind color
};

type CryptoPieChartProps = {
  data: CryptoItem[];
};

const CryptoPieChart: React.FC<CryptoPieChartProps> = ({ data }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-60 h-60 md:w-40 md:h-40 mx-auto">
        <svg className="rotate-[-90deg] w-full h-full" viewBox="0 0 120 120">
          {data.map((item, index) => {
            const dashArray = (item.percentage / 100) * circumference;
            const dashOffset =
              circumference - (cumulativePercent / 100) * circumference;

            cumulativePercent += item.percentage;

            return (
              <circle
                key={index}
                r={radius}
                cx={60}
                cy={60}
                fill="transparent"
                stroke={item.color}
                strokeWidth={30}
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex flex-col justify-between w-full gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between pb-1">
            <div style={{ color: item.color }}>{item.name}</div>
            <div>{item.percentage.toFixed(2)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoPieChart;
