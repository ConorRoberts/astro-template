import { QueryClientProvider } from "@tanstack/react-query";
import type { FC, PropsWithChildren } from "react";
import { queryClient, trpc, trpcClient } from "~/utils/trpc/trpc-client";

export const TrpcProvider: FC<PropsWithChildren> = (props) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export const withTrpcProvider = <T extends object>(PassedComponent: FC<T>) => {
  return (props: T) => (
    <TrpcProvider>
      <PassedComponent {...props} />
    </TrpcProvider>
  );
};
