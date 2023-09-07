import { ArrowLeftOnRectangleIcon, HomeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Link, Outlet, RootRoute, Route, Router, RouterProvider, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { trpc } from "~/utils/trpc/trpc-client";
import { TrpcProvider } from "./TrpcProvider";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

export const App = () => {
  return (
    <TrpcProvider>
      <RouterProvider router={router} basepath="/app" />
    </TrpcProvider>
  );
};

const AppNavigation = () => {
  return (
    <div className="flex flex-col w-64 bg-gray-50 shadow-inner border border-r p-4">
      <a href="/">
        <Button className="gap-4 w-full justify-start" variant="ghost">
          <HomeIcon className="w-4 h-4" />
          <p>Home</p>
        </Button>
      </a>
      <Link to="/">
        <Button className="gap-4 w-full justify-start" variant="ghost">
          <PencilIcon className="w-4 h-4" />
          <p>Todos</p>
        </Button>
      </Link>
      <a href="/logout" className="mt-auto">
        <Button className="gap-4 w-full justify-start" variant="ghost">
          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
          <p>Logout</p>
        </Button>
      </a>
    </div>
  );
};

// Create a root route
const rootRoute = new RootRoute({
  component: () => {
    return (
      <div className="flex flex-1 min-h-screen">
        <AppNavigation />
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col">
            <Outlet />
          </div>
        </div>
      </div>
    );
  },
});

const indexRoute = new Route({
  getParentRoute: () => createTodoLayoutRoute,
  path: "/",

  component: () => {
    const { data: todos = [] } = trpc.todo.getAll.useQuery();
    return (
      <div className="w-full max-w-xl p-2 mx-auto py-8">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-bold text-3xl sm:text-5xl">Todos</h1>
          <Link
            search={{
              create: true,
            }}
          >
            <Button>Create</Button>
          </Link>
        </div>
        {todos.map((e) => (
          <div key={e.id}>{e.id}</div>
        ))}
      </div>
    );
  },
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => <div>Hello from About!</div>,
});

const createTodoLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: "create-todo",
  validateSearch: (search) => {
    return z
      .object({ create: z.boolean().default(false) })
      .catch({ create: false })
      .parse(search);
  },
  component: ({ useSearch }) => {
    const navigate = useNavigate();
    const open = useSearch({ select: (data) => data.create });

    return (
      <>
        <Dialog
          open={open}
          onOpenChange={() => {
            navigate({ search: { create: undefined } });
          }}
        >
          <DialogContent>
            <DialogTitle>Create Todo</DialogTitle>
          </DialogContent>
        </Dialog>
        <Outlet />
      </>
    );
  },
});

const routeTree = rootRoute.addChildren([createTodoLayoutRoute.addChildren([indexRoute]), aboutRoute]);

const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
