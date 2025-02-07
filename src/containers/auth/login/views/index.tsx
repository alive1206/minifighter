"use client";

import { MainLayout } from "@/layouts";
import { App, Button, Form, Input } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoginForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  return (
    <MainLayout>
      <div className="h-full relative">
        <Form
          className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-1/3 from-transparent to-zinc-900 to-75% bg-gradient-to-t p-4 rounded-lg shadow-lg max-lg:w-2/3 bg-no-repeat bg-center bg-cover"
          form={form}
          layout="vertical"
          onFinish={() => {
            setLoading(true);
            signIn("credentials", {
              ...form.getFieldsValue(),
              redirect: false,
            }).then((response) => {
              if (response?.ok) {
                message.success("Login successfully!");
                setLoading(false);
                router.push("/");
              } else {
                message.error("Username or password is not correct!");
                setLoading(false);
              }
            });
          }}
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
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Button
            className="w-full mb-1"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>
          <div className="flex items-center justify-center">
            <div className="text-gray-500 mr-1">Not registered?</div>
            <Link className="text-white" href="/auth/register">
              Create an account
            </Link>
          </div>
        </Form>
      </div>
    </MainLayout>
  );
};
