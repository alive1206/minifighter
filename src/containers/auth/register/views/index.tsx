"use client";

import { useCreateUserMutation, useCurrentUser } from "@/hooks";
import { MainLayout } from "@/layouts";
import { css } from "@emotion/css";
import { Button, Form, Input, Space, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const RegisterForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const user = useCurrentUser();
  const { mutate: onCreate, isPending: isLoadingCreate } =
    useCreateUserMutation();

  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      const timeOut = setTimeout(() => setLoadingUser(false), 1000);

      return () => clearTimeout(timeOut);
    }
  }, [user, router]);

  const onSubmit = useCallback(() => {
    form.submit();
    form.validateFields().then(async (values) => {
      const data = {
        username: values?.username,
        password: values?.password,
      };
      onCreate({ data });
    });
  }, [form, onCreate]);

  if (loadingUser) {
    return (
      <MainLayout>
        <Space className="flex justify-center items-center h-full">
          <Spin />
        </Space>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-full relative">
        <Form
          className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-1/3 from-transparent to-zinc-900 to-75% bg-gradient-to-t p-4 rounded-lg shadow-lg max-lg:w-2/3 bg-no-repeat bg-center bg-cover"
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={
              <span className="text-white">
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
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-white">
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
            <Input.Password size="large" />
          </Form.Item>
          <Button
            className="w-full mb-1"
            htmlType="submit"
            onClick={onSubmit}
            loading={isLoadingCreate}
            disabled={isLoadingCreate}
            block
            size="large"
          >
            Register
          </Button>
          <div className="flex items-center justify-center">
            <div className="text-gray-500 mr-1">Have already an account?</div>
            <Link className="text-white" href="/auth/login">
              Login here
            </Link>
          </div>
        </Form>
      </div>
    </MainLayout>
  );
};
