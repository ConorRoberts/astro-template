import { ArrowLeftOnRectangleIcon, ChartBarIcon, HomeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Outlet, RootRoute, Route, Router, RouterProvider, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertTodoSchema } from "~/db/schema";
import { trpc } from "~/utils/trpc/trpc-client";
import { LoadingSpinner } from "./LoadingSpinner";
import { TrpcProvider } from "./TrpcProvider";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

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
      <Link to="/summary">
        <Button className="gap-4 w-full justify-start" variant="ghost">
          <ChartBarIcon className="w-4 h-4" />
          <p>Some Other Page</p>
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
      <div className="w-full max-w-xl p-2 mx-auto py-8 flex flex-col gap-8">
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
        <div className="flex flex-col gap-4">
          {todos.map((e) => (
            <div key={e.id} className="bg-white border border-neutral-200 shadow-lg p-4 rounded-xl space-y-px">
              <p className="font-semibold text-lg">{e.name}</p>
              <p className="text-xs text-neutral-500">Created: {e.createdAt.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
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
  loader: () => {
    const formSchema = insertTodoSchema.pick({ name: true });

    return { formSchema };
  },
  component: ({ useLoader, useSearch }) => {
    const formSchema = useLoader({ select: (data) => data.formSchema });
    const navigate = useNavigate();
    const open = useSearch({ select: (data) => data.create });
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
      },
    });
    const { mutateAsync: createTodo, isLoading: isCreateTodoLoading } = trpc.todo.create.useMutation();

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
      await createTodo({ name: values.name });
      await navigate({ search: { create: undefined } });
    };

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>The name of the todo.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex sm:justify-end">
                  <Button type="submit">
                    <p>Submit</p>
                    {isCreateTodoLoading && <LoadingSpinner />}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Outlet />
      </>
    );
  },
});

const todoSummaryRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/summary",
  component: () => {
    return (
      <div>
        <h1>This is another page</h1>
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([createTodoLayoutRoute.addChildren([indexRoute]), todoSummaryRoute]);

const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
