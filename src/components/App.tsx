import { ArrowLeftOnRectangleIcon, Bars3Icon, ChartBarIcon, HomeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Outlet, RootRoute, Route, Router, RouterProvider, useNavigate } from "@tanstack/react-router";
import { useState, type FC } from "react";
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

export const App = () => {
  return (
    <TrpcProvider>
      <RouterProvider router={router} basepath="/app" />
    </TrpcProvider>
  );
};

const SidebarNavigationContent: FC<{ onLinkClick?: () => void }> = (props) => {
  return (
    <div className="flex h-full flex-col">
      <a href="/">
        <Button className="w-full justify-start gap-4" variant="ghost">
          <HomeIcon className="h-4 w-4" />
          <p>Home</p>
        </Button>
      </a>
      <Link to="/" onClick={props.onLinkClick}>
        <Button className="w-full justify-start gap-4" variant="ghost">
          <PencilIcon className="h-4 w-4" />
          <p>Todos</p>
        </Button>
      </Link>
      <Link to="/summary" onClick={props.onLinkClick}>
        <Button className="w-full justify-start gap-4" variant="ghost">
          <ChartBarIcon className="h-4 w-4" />
          <p>Some Other Page</p>
        </Button>
      </Link>
      <a href="/logout" className="mt-auto">
        <Button className="w-full justify-start gap-4" variant="ghost">
          <ArrowLeftOnRectangleIcon className="h-4 w-4" />
          <p>Logout</p>
        </Button>
      </a>
    </div>
  );
};
const AppNavigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end p-1 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost">
              <Bars3Icon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader>
              <SheetTitle>Title Something</SheetTitle>
              <SheetDescription>Something</SheetDescription>
            </SheetHeader>
            <div className="mt-8 flex flex-1 flex-col">
              <SidebarNavigationContent onLinkClick={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden w-64 border border-r bg-gray-50 p-4 shadow-inner md:block">
        <SidebarNavigationContent />
      </div>
    </>
  );
};

// Create a root route
const rootRoute = new RootRoute({
  component: () => {
    return (
      <div className="flex min-h-screen flex-1 flex-col md:flex-row">
        <AppNavigation />
        <div className="relative flex-1">
          <div className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden">
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
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8 p-2 py-8">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl font-bold sm:text-5xl">Todos</h1>
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
            <div key={e.id} className="space-y-px rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
              <p className="text-lg font-semibold">{e.name}</p>
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
                        <Input placeholder="Name" {...field} />
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
