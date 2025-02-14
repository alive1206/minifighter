"use client";

import { AdminLayout } from "@/layouts";
import Chart from "../components/chart";
import { DatePicker, Image } from "antd";
import { COMING_SOON } from "@public/index";

export const Insights = () => {
  return (
    <AdminLayout>
      {/* <div className="border-gray200 flex h-14 items-center justify-center border-b-2 px-4">
        <DatePicker.RangePicker />
      </div> */}

      {/* <Chart /> */}
      <div className="w-full h-full flex justify-center items-center flex-col">
        <Image
          width={150}
          height={150}
          src={COMING_SOON}
          alt="under-construction"
          preview={false}
        />
        <div className="border  rounded-lg p-2 uppercase text-center">
          <div className="text-6xl">Coming Soon</div>
          <div className="text-xl ">Stay tunned</div>
        </div>
      </div>
    </AdminLayout>
  );
};
