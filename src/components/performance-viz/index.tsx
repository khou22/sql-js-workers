import ApexCharts from "apexcharts";
import { useContext, useMemo } from "react";
import Chart from "react-apexcharts";
import PerformanceContext from "../../context/performance";

const ChartOptions: ApexCharts.ApexOptions = {
  chart: {
    height: 450,
    type: "rangeBar",
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "80%",
    },
  },
  xaxis: {
    type: "datetime",
  },
  stroke: {
    width: 1,
  },
  fill: {
    type: "solid",
    opacity: 0.6,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
};

const TimelineRangeChart: React.FC = () => {
  const { reads } = useContext(PerformanceContext);

  const data = useMemo(() => {
    return [
      {
        name: "reads",
        data: reads.map((readRange) => ({
          x: "query-editor",
          y: [readRange.start, readRange.end],
        })),
      },
    ];
  }, [reads]);

  return (
    <div id="chart">
      <Chart
        options={ChartOptions}
        series={data}
        type="rangeBar"
        height={450}
      />
    </div>
  );
};

export default TimelineRangeChart;
