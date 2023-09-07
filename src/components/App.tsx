import { Link, Outlet, RootRoute, Route, Router, RouterProvider } from "@tanstack/react-router";
import { proxyClient } from "~/utils/trpc/trpc-client";
import { TrpcProvider } from "./TrpcProvider";
import { Dialog, DialogContent } from "./ui/dialog";

export const App = () => {
  return (
    <TrpcProvider>
      <RouterProvider router={router} basepath="/app" />
    </TrpcProvider>
  );
};

// Create a root route
const rootRoute = new RootRoute({
  component: () => {
    return (
      <>
        <div>
          <Link to="/">Home</Link> <Link to="/about">About</Link>
        </div>
        <hr />
        <Outlet />
      </>
    );
  },
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: () => proxyClient.todo.getAll.query(),
  component: ({ useLoader }) => {
    const todos = useLoader();
    return (
      <div>
        <h3>List of todos</h3>
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

const createTodoRoute = new Route({
  getParentRoute: () => indexRoute,
  path: "/",

  validateSearch: () => {
    return true;
  },
  component: () => {
    return (
      <Dialog
        open={true}
        onOpenChange={() => {
          return;
        }}
      >
        <DialogContent></DialogContent>
      </Dialog>
    );
  },
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }
