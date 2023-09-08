import { ArrowLeftOnRectangleIcon, UserIcon } from "@heroicons/react/24/outline";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { trpc } from "~/utils/trpc/trpc-client";
import { withTrpcProvider } from "./TrpcProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Navigation = withTrpcProvider(() => {
  const { data: authData, isFetching } = trpc.auth.getSession.useQuery(undefined, { retry: false });

  const isLoggedIn = authData !== undefined;

  return (
    <div className="flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/">
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/app">
              App
            </NavigationMenuLink>
          </NavigationMenuItem>
          {!isFetching && (
            <>
              {isLoggedIn && (
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className={navigationMenuTriggerStyle()}>
                      {authData.user.name}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <a href="/profile" className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            <p>Profile</p>
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a href="/logout" className="flex items-center gap-2">
                          <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                          <p>Logout</p>
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              )}
              {!isLoggedIn && (
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/login">
                    Login
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
});
