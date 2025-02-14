"use client";

import {
  useCreateUserAdminMutation,
  useDeleteUserAdminMutation,
  useGetUsers,
  useUpdateUserAdminMutation,
} from "@/hooks";
import { AdminLayout } from "@/layouts";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export const AdminUser = () => {
  const [form] = useForm();
  const [userForm] = useForm();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const username = searchParams?.get("username") || "";
  const page = searchParams?.get("page") || 1;
  const queryClient = useQueryClient();
  const { mutate: onCreate, isPending: isLoadingCreate } =
    useCreateUserAdminMutation();
  const { mutate: onUpdate, isPending: isLoadingUpdate } =
    useUpdateUserAdminMutation();
  const { mutate: onDelete } = useDeleteUserAdminMutation();
  const { data: userList } = useGetUsers({
    url: "/api/user",
    dependencies: ["GET_USERS_LIST", page, username],
    query: {
      page: page || 1,
      ...(username && { username }),
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
        title: "Username",
        dataIndex: "username",
        key: "username",
      },

      {
        title: "Role",
        key: "role",
        dataIndex: "role",
        render: (_: any, record: any) => (
          <>
            <Tag>{record.role.toUpperCase()}</Tag>
          </>
        ),
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
                userForm.setFieldsValue(record);
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
    userForm.submit();
    userForm.validateFields().then(async (values) => {
      const data = {
        username: values?.username,
        password: values?.password,
        role: values?.role,
      };
      onCreate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GET_USERS_LIST"] });
            setOpen(false);
            userForm.resetFields();
          },
        }
      );
    });
  }, [userForm, onCreate]);

  const handleUpdate = useCallback(() => {
    userForm.submit();
    userForm.validateFields().then(async (values) => {
      const data = {
        username: values?.username,
        password: values?.password,
        role: values?.role,
      };
      onUpdate(
        { id: values?.id, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GET_USERS_LIST"] });
            setOpen(false);
            userForm.resetFields();
          },
        }
      );
    });
  }, [userForm, onUpdate]);

  const handleDelete = useCallback(
    (id: any) => {
      onDelete(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GET_USERS_LIST"] });
          },
        }
      );
      setConfirmId(null);
    },
    [onDelete]
  );

  return (
    <AdminLayout>
      <div className="w-full flex justify-between">
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            const query = {
              ...(values.username && { username: values.username }),
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
              <Form.Item name="username" className="mb-0">
                <Input placeholder="Search by username" allowClear />
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
            userForm.resetFields();
          }}
        >
          Add
        </Button>
      </div>
      <Table
        dataSource={userList?.data}
        columns={columns}
        rowKey="id"
        scroll={{
          x: "auto",
        }}
        pagination={{
          current: Number(page) || 1,
          pageSize: 10,
          total: userList?.pagination?.totalUsers,
          showSizeChanger: false,
          onChange: (page) => {
            const query = {
              ...(username && { username: username }),
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
        title={action === "add" ? "Add new user" : "Update user"}
        closable={false}
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
      >
        <Form form={userForm} layout="vertical" requiredMark={false}>
          {action === "edit" && (
            <Form.Item label={<span>Id</span>} name="id">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            label={
              <span>
                Username <span className="text-red-500">*</span>
              </span>
            }
            name="username"
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
                Password <span className="text-red-500">*</span>
              </span>
            }
            name="password"
            rules={[
              {
                required: true,
                message: "Required!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Role <span className="text-red-500">*</span>
              </span>
            }
            name="role"
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <Select
              options={[
                { value: "User", label: "User" },
                { value: "Admin", label: "Admin" },
                { value: "SuperAdmin", label: "SuperAdmin" },
              ]}
            />
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
