import { Link, Outlet, RootRoute, Route, Router, RouterProvider } from "@tanstack/react-router";

export const App = () => {
  return (
    <div>
      <RouterProvider router={router} basepath="/app" />
    </div>
  );
};

const Root = () => {
  return (
    <>
      <div>
        <Link to="/">Home</Link> <Link to="/about">About</Link>
      </div>
      <hr />
      <Outlet />
    </>
  );
};

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

const Index = () => {
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
};

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

const About = () => {
  return <div>Hello from About!</div>;
};

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
