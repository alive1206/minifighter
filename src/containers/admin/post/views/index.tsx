"use client";

import { UploadCustom } from "@/components";
import { imageState } from "@/jotai";
import { AdminLayout } from "@/layouts";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { env } from "@/config";
import {
  useCreatePostAdminMutation,
  useDeletePostAdminMutation,
  useGetPosts,
  useUpdatePostAdminMutation,
} from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";

export const AdminPost = () => {
  const [form] = useForm();
  const [postForm] = useForm();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [imageSrc, setImageSrc] = useAtom(imageState);
  const editorRef = useRef<any>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const title = searchParams?.get("title") || "";
  const page = searchParams?.get("page") || 1;
  const queryClient = useQueryClient();
  const { mutate: onCreate, isPending: isLoadingCreate } =
    useCreatePostAdminMutation();
  const { mutate: onUpdate, isPending: isLoadingUpdate } =
    useUpdatePostAdminMutation();
  const { mutate: onDelete } = useDeletePostAdminMutation();
  const { data: postList } = useGetPosts({
    url: "/api/post",
    dependencies: ["GET_POSTS_LIST", page, title],
    query: {
      page: page || 1,
      ...(title && { title }),
    },
  });

  const columns = useMemo(
    () => [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },

      {
        title: "Action",
        key: "action",
        render: (_: any, record: any) => (
          <Space size="middle">
            <Button
              onClick={() => {
                setAction("edit");
                setOpen(true);
                postForm.setFieldsValue(record);
                setImageSrc(record.image);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete record"
              description="Are you sure to delete this record?"
              open={confirmId === record.id}
              onConfirm={() => handleDelete(record.id)}
              onCancel={() => setConfirmId(null)}
            >
              <Button danger onClick={() => setConfirmId(record.id)}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [confirmId]
  );

  const handleCreate = useCallback(() => {
    postForm.submit();
    postForm.validateFields().then(async (values) => {
      const data = {
        title: values?.title,
        content: editorRef.current.getContent(),
        image: values?.image,
      };
      onCreate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GET_POSTS_LIST"] });
            setOpen(false);
            postForm.resetFields();
          },
        }
      );
    });
  }, [postForm, onCreate]);

  const handleUpdate = useCallback(
    (id: any) => {
      postForm.submit();
      postForm.validateFields().then(async (values) => {
        const data = {
          title: values?.title,
          content: editorRef.current.getContent(),
          image: values?.image,
        };
        onUpdate(
          { id: values?.id, data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["GET_POSTS_LIST"] });
              setOpen(false);
              postForm.resetFields();
            },
          }
        );
      });
    },
    [postForm, onUpdate]
  );

  const handleDelete = useCallback(
    (id: any) => {
      onDelete(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GET_POSTS_LIST"] });
          },
        }
      );
      setConfirmId(null);
    },
    [onDelete]
  );

  useEffect(() => {
    if (imageSrc) {
      postForm.setFieldsValue({ image: imageSrc });
    }
  }, [imageSrc, postForm]);

  return (
    <AdminLayout>
      <div className="w-full flex justify-between">
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            const query = {
              ...(values.title && { title: values.title }),
            };
            const params = new URLSearchParams({
              ...query,
              page: 1,
            });

            router.push(`${pathname}?${params.toString()}`);
          }}
          className="w-2/3"
        >
          <Row gutter={[8, 16]} className="mb-2">
            <Col span={24} lg={6}>
              <Form.Item name="title" className="mb-0">
                <Input placeholder="Search by post title" allowClear />
              </Form.Item>
            </Col>
            <Col span={24} lg={6}>
              <Space>
                <Button
                  onClick={() => {
                    form.resetFields();
                    router.push(pathname as string);
                  }}
                >
                  Clear
                </Button>
                <Button htmlType="submit">Search</Button>
              </Space>
            </Col>
          </Row>
        </Form>
        <Button
          className="mb-2"
          onClick={() => {
            setAction("add");
            setOpen(true);
            postForm.resetFields();
            setImageSrc("");
          }}
        >
          Add
        </Button>
      </div>
      <Table
        dataSource={postList?.data}
        columns={columns}
        rowKey="id"
        scroll={{
          x: "auto",
        }}
        pagination={{
          current: Number(page) || 1,
          pageSize: 6,
          total: postList?.pagination?.totalPosts,
          showSizeChanger: false,
          onChange: (page) => {
            const query = {
              ...(title && { title: title }),
            };
            const params = new URLSearchParams({
              ...query,
              page: String(page),
            });
            router.push(`${pathname}?${params.toString()}`);
          },
        }}
      ></Table>

      <Drawer
        title={action === "add" ? "Add new post" : "Update post"}
        closable={false}
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        size="large"
      >
        <Form form={postForm} layout="vertical" requiredMark={false}>
          {action === "edit" && (
            <Form.Item label={<span>Id</span>} name="id">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            label={
              <span>
                Title <span className="text-red-500">*</span>
              </span>
            }
            name="title"
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={<span>Content</span>} name="content">
            <Editor
              apiKey={env.TINYMCE_API_KEY}
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue="<p>This is the initial content of the editor.</p>"
              init={{
                height: 500,
                menubar: "file edit view insert format",
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </Form.Item>
          <Form.Item label={<span>Image</span>} name="image">
            <UploadCustom />
          </Form.Item>
          {action === "add" ? (
            <Button
              className="w-full"
              htmlType="submit"
              onClick={handleCreate}
              loading={isLoadingCreate}
              disabled={isLoadingCreate}
            >
              Add
            </Button>
          ) : (
            <Button
              className="w-full"
              htmlType="submit"
              onClick={handleUpdate}
              loading={isLoadingUpdate}
              disabled={isLoadingUpdate}
            >
              Update
            </Button>
          )}
        </Form>
      </Drawer>
    </AdminLayout>
  );
};
