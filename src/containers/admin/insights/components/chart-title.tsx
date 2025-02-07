"use client";

import { css } from "@emotion/css";
import { Tooltip, Typography } from "antd";

type Props = {
  title?: string;
  desc?: string;
};

export const ChartTitle: React.FC<Props> = ({ title, desc }) => {
  return (
    <>
      {desc ? (
        <Tooltip
          title={
            <span
              className={css({
                "ol, ul, menu": {
                  listStyleType: "disc",
                  paddingLeft: "20px",
                  marginTop: "16px",
                  marginBottom: "16px",
                },
              })}
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          }
        >
          <Typography.Text className="font-semibold underline decoration-black/[.25] decoration-dashed decoration-from-font underline-offset-4">
            {title}
          </Typography.Text>
        </Tooltip>
      ) : (
        <Typography.Text className="font-semibold">{title}</Typography.Text>
      )}
    </>
  );
};
