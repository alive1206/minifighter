"use client";

import { AdminLayout } from "@/layouts";
import Chart from "../components/chart";
import { DatePicker } from "antd";

export const Insights = () => {
  return (
    <AdminLayout>
      <div className="border-gray200 flex h-14 items-center justify-center border-b-2 px-4">
        <DatePicker.RangePicker />
      </div>

      {/* <Chart /> */}
    </AdminLayout>
  );
};
