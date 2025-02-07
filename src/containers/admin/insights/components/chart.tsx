"use client";
import { classNames } from "@/utils";
import ApexChart from "react-apexcharts";

type Props = {
  options?: ApexCharts.ApexOptions;
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  type?:
    | "line"
    | "area"
    | "bar"
    | "pie"
    | "donut"
    | "radialBar"
    | "scatter"
    | "bubble"
    | "heatmap"
    | "treemap"
    | "boxPlot"
    | "candlestick"
    | "radar"
    | "polarArea"
    | "rangeBar"
    | "rangeArea"
    | undefined;
  height?: string | number;
};

const Chart: React.FC<Props> = ({
  options,
  series = [],
  type,
  height = 250,
}) => {
  return (
    <div
      className={classNames(
        "custom-apex-chart",
        series.length > 1 ? "" : "hide-legend"
      )}
    >
      <ApexChart
        options={{
          ...options,
          stroke: {
            width: 2,
            ...options?.stroke,
          },
          tooltip: {
            cssClass: "rounded-sm",
            intersect: false,
            theme: "light",
            x: {
              format: "ddd, MMM dd",
            },
            ...options?.tooltip,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "left",
            itemMargin: {
              vertical: 6,
              horizontal: 12,
            },
            markers: {
              // radius: 3,
              offsetY: 1,
            },
            showForSingleSeries: true,
            ...options?.legend,
          },
          chart: {
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
            ...options?.chart,
          },
          xaxis: {
            tooltip: {
              enabled: false,
            },
            labels: {
              datetimeFormatter: {
                month: "MMM dd",
                day: "MMM dd",
              },
            },
            ...options?.xaxis,
          },
          yaxis: {
            tooltip: {
              enabled: false,
            },
            ...options?.yaxis,
          },
          theme: {
            mode: "light",
            palette: "palette6",
            ...options?.theme,
          },
          colors: ["#C5AE8F", "#648A7B", "#C58FC4", "#8A7F64", "#8FC5AF"],
        }}
        series={series}
        type={type}
        width="100%"
        height={height}
      />
    </div>
  );
};

export default Chart;
