import { useState } from "react";
import { trpc } from "~/utils/trpc/trpc-client";
import { Button } from "./ui/button";
import { withTrpcProvider } from "./TrpcProvider";

export const QueryTestButton = withTrpcProvider(() => {
  const [value, setValue] = useState(0);
  const { data } = trpc.ping.useQuery();

  return (
    <>
      <Button onClick={() => setValue((v) => v + 1)}>{value}</Button>
      {data}
    </>
  );
});
