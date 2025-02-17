"use client";

import { useGetPosts } from "@/hooks";
import { MainLayout } from "@/layouts";
import { css } from "@emotion/css";
import { Button, Image, Modal, Pagination, Space, Spin } from "antd";
import { map } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const NewsViews = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const title = searchParams?.get("title") || "";
  const page = searchParams?.get("page") || 1;
  const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: postList } = useGetPosts({
    url: "/api/post",
    dependencies: ["GET_POSTS_LIST", page, title],
    query: {
      page: page || 1,
      ...(title && { title }),
    },
  });
  useEffect(() => {
    postList && setLoading(false);
  }, [postList]);
  return (
    <MainLayout>
      <div className="relative top-[80px]">
        {loading ? (
          <Space className="flex justify-center items-center h-full">
            <Spin />
          </Space>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center bg-zinc-900 pb-8">
            <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 grid-rows-2 gap-12 place-items-center mb-8">
              {map(postList?.data, (post) => (
                <div
                  key={post?.id}
                  className="flex flex-col cursor-pointer justify-between rounded-lg bg-zinc-900 border w-[250px] h-[200px] overflow-hidden group"
                  onClick={() => {
                    setData(post);
                    setOpen(true);
                  }}
                >
                  <Image
                    className="rounded-lg group-hover:scale-125 transition-transform duration-300 rounded-b-none"
                    width={"100%"}
                    height={150}
                    src={post?.image}
                    preview={false}
                    alt=""
                  />
                  <div className="truncate text-center text-white px-4 font-medium pb-2">
                    {post?.title}
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              current={Number(page) || 1}
              pageSize={10}
              total={postList?.pagination?.totalPosts}
              showSizeChanger={false}
              onChange={(page) => {
                const query = {
                  ...(title && { title: title }),
                };
                const params = new URLSearchParams({
                  ...query,
                  page: String(page),
                });
                router.push(`${pathname}?${params.toString()}`);
              }}
              className={css({
                ".anticon": {
                  color: "white",
                },
                ".anticon:hover": {
                  color: "orange",
                },
                ".ant-pagination-item-active": {
                  borderColor: "orange !important",
                  backgroundColor: "orange",
                },
                ".ant-pagination-item-active a": {
                  color: "white",
                },
                ".ant-pagination-item:hover": {
                  borderColor: "orange !important",
                  backgroundColor: "orange !important",
                },
                ".ant-pagination-item:hover a": {
                  color: "white",
                },
              })}
            />
          </div>
        )}
        <Modal
          title={<span className="font-bold text-xl">{data?.title}</span>}
          className="overflow-x-hidden"
          open={open}
          closeIcon={false}
          width={800}
          footer={[
            <Button type="default" onClick={() => setOpen(false)}>
              Close
            </Button>,
          ]}
        >
          <div dangerouslySetInnerHTML={{ __html: data?.content || "" }}></div>
        </Modal>
      </div>
    </MainLayout>
  );
};
