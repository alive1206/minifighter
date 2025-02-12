"use client";

import { useGetItems } from "@/hooks";
import { MainLayout } from "@/layouts";
import { formatCurrency } from "@/utils";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { map } from "lodash";
import { useState } from "react";

export const ShopViews = () => {
  const [itemSelected, setItemSelected] = useState("");

  const { data: itemList } = useGetItems({
    url: "/api/item",
    dependencies: ["GET_ITEMs_LIST"],
  });
  return (
    <MainLayout>
      <div className=" pb-16">
        <div className="h-full relative top-[72px] py-16 bg-zinc-900 px-4">
          <div className="grid grid-cols-3 gap-4 px-4 place-items-center max-w-[720px] border bg-[#fff] rounded-lg py-4">
            {map(itemList?.data, (item) => (
              <div
                className="bg-[#fff] rounded-lg shadow-md w-full h-full cursor-pointer hover:shadow-[#f05c22bf]"
                key={item?.id}
              >
                <Image
                  className="rounded-lg rounded-b-none border-b "
                  width={"100%"}
                  height={150}
                  src={item?.image}
                  preview={false}
                />
                <div className="px-4 pb-4">
                  <div className="mb-4 overflow-hidden truncate capitalize font-medium">
                    {item?.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-orange-500 font-medium">
                      {formatCurrency(item?.price)} VND
                    </div>
                    <button
                      className={`text-white rounded-lg bg-orange-500 w-[32px] aspect-square hover:bg-orange-400 ${
                        itemSelected === item?.id &&
                        "bg-pink-200 text-orange-500 hover:bg-pink-300"
                      }`}
                      onClick={() => setItemSelected(item?.id)}
                    >
                      {itemSelected === item?.id ? (
                        <CheckOutlined />
                      ) : (
                        <PlusOutlined />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
