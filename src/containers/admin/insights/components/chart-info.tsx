import { dateRangeState } from "@/jotai";
import { classNames } from "@/utils";
import { Empty, Typography } from "antd";
import { useAtomValue } from "jotai";
import { isEmpty, isEqual } from "lodash";
import { useMemo } from "react";
import { ChartTitle } from "./chart-title";
import dayjs from "dayjs";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  children?: React.ReactNode;
  extra?: React.ReactNode;
  title?: string;
  desc?: string;
  prefix?: string;
  suffix?: string;
  data?: any;
  showDateRange?: boolean;
  showChart?: boolean;
  showTotal?: boolean;
  forceHideTotal?: boolean;
  height?: string | number;
  animVariants?: any;
  onAnimationComplete?: () => void;
  titleClassName?: string;
};

export const ChartInfo: React.FC<Props> = ({
  children,
  title,
  desc,
  prefix,
  suffix,
  data,
  showDateRange = false,
  showTotal = true,
  showChart = true,
  forceHideTotal = false,
  height = 340,
  extra,
  animVariants,
  onAnimationComplete,
  titleClassName,
}) => {
  const dateRange = useAtomValue(dateRangeState);
  const total = useMemo(() => data?.number?.data, [data?.number?.data]);
  const percent = useMemo(() => data?.compare?.data, [data?.compare?.data]);
  const isEmptyData = useMemo(
    () => isEmpty(data?.chart?.data),
    [data?.chart?.data]
  );

  return (
    <div>
      <div
        className={classNames(
          "mb-2 flex items-center justify-between",
          titleClassName
        )}
      >
        <ChartTitle title={title} desc={desc} />
        {showDateRange && (
          <Typography.Text className="text-sm">
            {isEqual(dateRange?.[0], dateRange?.[1]) ? (
              dayjs(dateRange?.[0]).format("MMM DD, YYYY")
            ) : (
              <>{`${dayjs(dateRange?.[0]).format("MMM DD, YYYY")} - ${dayjs(
                dateRange?.[1]
              ).format("MMM DD, YYYY")}`}</>
            )}
          </Typography.Text>
        )}
      </div>
      {extra && (
        <div className="mb-2 flex items-center justify-end">{extra}</div>
      )}
      {!forceHideTotal && (
        <div className="mb-2 flex items-center">
          <Typography.Text className="mr-2 text-xl font-semibold">
            {showTotal && !isNaN(total) ? (
              <>
                {prefix === "$" && prefix}
                {suffix === "%" && ""}
                {prefix !== "$" && suffix !== "%" && ""}
                {suffix}
              </>
            ) : (
              <>&nbsp;</>
            )}
          </Typography.Text>
          {!isEmpty(percent) && (
            <Typography.Text
              className={classNames(
                "font-bold",
                percent > 0 ? "text-green-500" : "text-red-500"
              )}
            >
              <FontAwesomeIcon
                icon={percent > 0 ? faArrowUp : faArrowDown}
                className="mr-1"
              />
              <span>{(percent * 100)?.toFixed(2)}%</span>
            </Typography.Text>
          )}
        </div>
      )}
      {!isEmptyData
        ? children
        : showChart && (
            <div className="mt-[-50px] flex h-full items-center justify-center">
              <Empty className="m-0" />
            </div>
          )}
    </div>
  );
};
