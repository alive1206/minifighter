"use client";

import { imageState } from "@/jotai";
import { DeleteOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";

import { App, Button, Image, Modal } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useAtom, useSetAtom } from "jotai";
import { CloudUpload, LibraryBig } from "lucide-react";
import { useState } from "react";
import { useUploadFileMutation } from "@/hooks";

export const UploadCustom = () => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageSrc, setImageSrc] = useAtom(imageState);
  const [file, setFile] = useState();
  const { message } = App.useApp();

  const { mutate: onUpload, isPending: isLoadingUpload } =
    useUploadFileMutation((rs) => {
      setImageSrc(rs.secure_url || previewImage);
    });

  const handleFileChange = (e: any) => {
    const fileSelected = e.originFileObj;
    if (fileSelected) {
      setFile(fileSelected);
      const blob = new Blob([fileSelected], { type: fileSelected.type });
      const imageUrl = URL.createObjectURL(blob);
      setPreviewImage(imageUrl);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      message.error("No file selected!");
      return;
    }

    onUpload({ data: { file } });

    setPreviewImage("");
    setAction("");
    setOpen(false);
  };

  return (
    <>
      {imageSrc ? (
        <div className="relative w-[150px] h-[150px] group overflow-hidden border rounded-lg">
          <Image
            className=" pointer-events-none p-2"
            width={"100%"}
            height={"100%"}
            src={imageSrc}
            preview={false}
          />
          <div className="opacity-0 h-[calc(100%-16px)] w-[calc(100%-16px)] inset-2 group-hover:opacity-100 absolute bg-[#00000073] top-2 z-10 backdrop-blur-0 duration-200 "></div>
          <button
            type="button"
            className="bg-transparent font-bold z-20 border-none outline-none rounded-[50%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={() => setImageSrc("")}
          >
            <DeleteOutlined className="text-white text-xl" />
          </button>
        </div>
      ) : (
        <Button
          className="p-12 border-dashed flex flex-col w-[150px] h-[150px]"
          onClick={() => setOpen(true)}
        >
          <PlusOutlined />
          Upload
        </Button>
      )}
      <Modal
        open={open}
        closable={false}
        centered
        onCancel={() => setOpen(false)}
        footer={
          action !== ""
            ? [
                <Button
                  type="default"
                  onClick={() => {
                    setAction("");
                    setPreviewImage("");
                  }}
                >
                  Back
                </Button>,
                <Button
                  type="primary"
                  onClick={handleUploadClick}
                  loading={isLoadingUpload}
                  disabled={isLoadingUpload}
                >
                  Upload
                </Button>,
              ]
            : []
        }
      >
        {action === "" && (
          <div className="flex gap-2">
            <Button
              className="w-1/2 h-[150px] flex flex-col"
              onClick={() => setAction("upload")}
            >
              <CloudUpload /> Upload manually
            </Button>
            <Button
              className="w-1/2 h-[150px] flex flex-col"
              onClick={() => setAction("media")}
            >
              <LibraryBig /> Media library
            </Button>
          </div>
        )}
        {action === "upload" ? (
          <>
            {previewImage === "" ? (
              <Dragger
                height={200}
                name="file"
                accept="image/*"
                multiple={false}
                maxCount={1}
                onChange={(e) => handleFileChange(e.file)}
                listType="picture-card"
                showUploadList={{
                  showRemoveIcon: true,
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Dragger>
            ) : (
              <div className="flex items-center justify-center flex-col gap-2">
                <Image
                  className="rounded-lg border p-2"
                  width={150}
                  height={150}
                  preview={false}
                  src={previewImage}
                />

                <Button onClick={() => setPreviewImage("")}>
                  <DeleteOutlined style={{ fontSize: "16px" }} /> Remove
                </Button>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};
