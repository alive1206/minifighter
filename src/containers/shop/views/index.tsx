"use client";

import { useGetItems } from "@/hooks";
import { MainLayout } from "@/layouts";
import { classNames, formatCurrency } from "@/utils";
import { BankOutlined, CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Divider, Image, Modal, Radio } from "antd";
import { find, map } from "lodash";
import { useState } from "react";

export const ShopViews = () => {
  const [open, setOpen] = useState(false);
  const [itemIdSelected, setItemIdSelected] = useState("");
  const [paymentMethodSelected, setPaymentMethodSelected] = useState("");

  const { data: itemList } = useGetItems({
    url: "/api/item",
    dependencies: ["GET_ITEMs_LIST"],
  });

  const itemSelected = find(
    itemList?.data,
    (item) => item?.id === itemIdSelected
  );

  return (
    <MainLayout>
      <div className=" pb-16">
        <div className="h-full relative top-[72px] py-16 bg-zinc-900 px-8 flex justify-between gap-2 max-[576px]:flex-col">
          <div className="flex flex-col gap-2 items-center bg-[#fff] rounded-lg  ">
            <h3 className=" font-medium text-2xl w-full text-left py-2 px-4 shadow-md pointer-events-none">
              Select Package
            </h3>
            <div className="grid grid-cols-3 max-md:grid-cols-2 gap-4 py-6 px-4 place-items-center max-w-[720px]">
              {map(itemList?.data, (item) => (
                <div
                  className={`bg-[#fff] rounded-lg shadow-md w-full h-full cursor-pointer hover:shadow-[#f05c22bf] ${
                    itemIdSelected === item?.id && "shadow-[#f05c22bf]"
                  }`}
                  key={item?.id}
                  onClick={() => {
                    setItemIdSelected(item?.id);
                  }}
                >
                  <Image
                    className="rounded-lg rounded-b-none border-b "
                    width={"100%"}
                    height={150}
                    src={item?.image}
                    preview={false}
                    alt=""
                  />
                  <div className="px-4 pb-4">
                    <div className="mb-2 overflow-hidden truncate capitalize font-medium">
                      {item?.name}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-orange-500 font-medium">
                        {formatCurrency(item?.price)} VND
                      </div>
                      <button
                        className={`text-white rounded-lg bg-orange-500 w-[32px] max-[576px]:hidden aspect-square hover:bg-orange-400 ${
                          itemIdSelected === item?.id &&
                          "bg-pink-200 text-orange-500 hover:bg-pink-300"
                        }`}
                      >
                        {itemIdSelected === item?.id ? (
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
          <div className="bg-[#fff] w-[400px] max-md:w-[250px] max-[576px]:w-full h-full rounded-lg sticky top-20 flex flex-col gap-2  items-center">
            <h3 className=" font-medium text-2xl w-full text-left py-2 px-4 shadow-md pointer-events-none">
              Confirm Payment
            </h3>
            <div className="w-full py-6 px-2">
              {!itemSelected ? (
                <div className="border border-dashed pointer-events-none text-lg rounded-lg py-4 text-center text-orange-500 font-medium">
                  Select a package
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <img
                      className="rounded-lg border w-[100px] h-[50px] max-md:w-[75px]"
                      src={itemSelected?.image}
                      alt=""
                    />
                    <div className="flex justify-between flex-col">
                      <div className="truncate capitalize text-gray-400 max-md:text-[10px] max-[576px]:text-xs">
                        {itemSelected?.name}
                      </div>
                      <div className="text-[16px] text-orange-500 font-medium max-md:text-xs max-[576px]:text-md">
                        {formatCurrency(itemSelected?.price)} VND
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded px-2 py-1">x1</div>
                </div>
              )}
              <Divider />
              <div>
                <h4 className="font-medium text-[16px] mb-1 pointer-events-none">
                  Payment Method
                </h4>
                <div>
                  <Radio.Group
                    className={classNames(
                      "w-full flex flex-col gap-2",
                      css({
                        ".ant-radio-button-wrapper": {
                          borderRadius: "8px !important",
                        },
                        ".ant-radio-button-wrapper-checked": {
                          outline: "none",
                          border: "1px solid orange !important",
                          color: "white",
                          background: "orange",
                        },
                        ".ant-radio-button-wrapper-checked:hover": {
                          color: "white",
                        },
                      })
                    )}
                    size="large"
                    onChange={(e) => {
                      setPaymentMethodSelected(e.target.value);
                    }}
                    disabled={!itemSelected}
                  >
                    <Radio.Button className="w-full" value="banking">
                      <BankOutlined style={{ fontSize: "24px" }} />
                      <span className="ml-6 text-lg !rounded-lg max-md:text-md">
                        Bank
                      </span>
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-[16px] mb-1 pointer-events-none">
                  Payment Detail
                </h4>
                <div className="bg-pink-100 rounded-lg px-2 py-4 flex justify-between items-center pointer-events-none">
                  <div className="text-gray-500">Total:</div>
                  <div className="font-medium">
                    {!itemSelected ? "0" : formatCurrency(itemSelected?.price)}
                    <span className="ml-1">VND</span>
                  </div>
                </div>
              </div>
              <button
                disabled={!itemSelected || !paymentMethodSelected}
                className={`w-full  rounded mt-4 text-white py-2 text-lg font-bold ${
                  itemSelected && paymentMethodSelected
                    ? "bg-orange-500 hover:bg-orange-300"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
                onClick={() => setOpen(true)}
              >
                Pay now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        closeIcon={false}
        footer={[<Button onClick={() => setOpen(false)}>Cancel</Button>]}
        centered={true}
      >
        <div className="flex items-center flex-col">
          <Image
            src={`https://api.vietqr.io/image/970436-1017175418-pqcc3el.jpg?accountName=LE%20BAO%20THANG&amount=${itemSelected?.price}`}
            preview={false}
            width={250}
            height={250}
            alt=""
          />
          <h3 className="font-medium text-xl">
            Scan this QR code to proccess your payment
          </h3>
        </div>
      </Modal>
    </MainLayout>
  );
};
