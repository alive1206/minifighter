import { NewsViews } from "@/containers";
import { Suspense } from "react";

export default function NewsScreen() {
  return (
    <Suspense>
      <NewsViews />
    </Suspense>
  );
}
