"use client";

import { AdminLayout } from "@/layouts";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Space,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UploadCustom } from "@/components";
import {
  useCreateItemAdminMutation,
  useDeleteItemAdminMutation,
  useGetItems,
  useUpdateItemAdminMutation,
} from "@/hooks";
import { useAtom } from "jotai";
import { imageState } from "@/jotai";
import { formatCurrency } from "@/utils";

export const AdminShop = () => {
  const [form] = useForm();
  const [itemForm] = useForm();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [imageSrc, setImageSrc] = useAtom(imageState);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const name = searchParams?.get("name") || "";
  const page = searchParams?.get("page") || 1;
  const queryClient = useQueryClient();
  const { mutate: onCreate, isPending: isLoadingCreate } =
    useCreateItemAdminMutation();
  const { mutate: onUpdate, isPending: isLoadingUpdate } =
    useUpdateItemAdminMutation();
  const { mutate: onDelete } = useDeleteItemAdminMutation();
  const { data: itemList } = useGetItems({
    url: "/api/item",
    dependencies: ["GET_ITEMS_LIST", page, name],
    query: {
      page: page || 1,
      ...(name && { name }),
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
        title: "Name",
        dataIndex: "name",
        key: "name",
      },

      {
        title: "Price",
        key: "price",
        dataIndex: "price",
        render: (text: any) => {
          return <>{formatCurrency(text)} VND</>;
        },
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
                itemForm.setFieldsValue(record);
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
    itemForm.submit();
    itemForm.validateFields().then(async (values) => {
      const data = {
        name: values?.name,
        price: values?.price,
        image: values?.image,
      };
      onCreate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GET_ITEMS_LIST"] });
            setOpen(false);
            itemForm.resetFields();
          },
        }
      );
    });
  }, [itemForm, onCreate]);

  const handleUpdate = useCallback(
    (id: any) => {
      itemForm.submit();
      itemForm.validateFields().then(async (values) => {
        const data = {
          name: values?.name,
          price: values?.price,
          image: values?.image,
        };
        onUpdate(
          { id: values?.id, data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["GET_ITEMS_LIST"] });
              setOpen(false);
              itemForm.resetFields();
            },
          }
        );
      });
    },
    [itemForm, onUpdate]
  );

  const handleDelete = useCallback(
    (id: any) => {
      onDelete(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GET_ITEMS_LIST"] });
          },
        }
      );
      setConfirmId(null);
    },
    [onDelete]
  );

  useEffect(() => {
    if (imageSrc) {
      itemForm.setFieldsValue({ image: imageSrc });
    }
  }, [imageSrc, itemForm]);

  return (
    <AdminLayout>
      <div className="w-full flex justify-between">
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            const query = {
              ...(values.name && { name: values.name }),
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
              <Form.Item name="name" className="mb-0">
                <Input placeholder="Search by item name" allowClear />
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
            itemForm.resetFields();
            setImageSrc("");
          }}
        >
          Add
        </Button>
      </div>
      <Table
        dataSource={itemList?.data}
        columns={columns}
        rowKey="id"
        scroll={{
          x: "auto",
        }}
        pagination={{
          current: Number(page) || 1,
          pageSize: 10,
          total: itemList?.pagination?.totalItems,
          showSizeChanger: false,
          onChange: (page) => {
            const query = {
              ...(name && { name: name }),
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
        title={action === "add" ? "Add new item" : "Update item"}
        closable={false}
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
      >
        <Form form={itemForm} layout="vertical" requiredMark={false}>
          {action === "edit" && (
            <Form.Item label={<span>Id</span>} name="id">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            label={
              <span>
                Name <span className="text-red-500">*</span>
              </span>
            }
            name="name"
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Price <span className="text-red-500">*</span>
              </span>
            }
            name="price"
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <InputNumber
              className="w-full"
              addonAfter="VND"
              formatter={(value) =>
                value !== undefined ? formatCurrency(value) : ""
              }
              parser={(value) => Number(value?.replace(/,/g, ""))}
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
