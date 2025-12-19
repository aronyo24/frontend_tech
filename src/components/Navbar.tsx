import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Notifications from "./Notifications";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  type MenuKey = "simple" | "research" | "media" | "company";
  type SubMenuKey = Exclude<MenuKey, "simple">;

  const menuItems: Record<MenuKey, { name: string; path: string }[]> = {
    simple: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Services", path: "/services" },
      { name: "Blog", path: "/blog" },
    ],
    research: [
      { name: "Projects", path: "/projects" },
      { name: "Publications", path: "/publications" },
      { name: "Sessions", path: "/sessions" },
    ],
    media: [
      { name: "Blog", path: "/blog" },
      { name: "Gallery", path: "/gallery" },
    ],
    company: [
      { name: "Team", path: "/team" },
      { name: "Clients", path: "/clients" },
      { name: "Contact", path: "/contact" },
    ]
  };


  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  const dropdownGroups: { label: string; key: SubMenuKey }[] = [
    { label: "Research", key: "research" },
    { label: "Media", key: "media" },
    { label: "Company", key: "company" },
  ];

  const isGroupActive = (key: SubMenuKey) =>
    menuItems[key].some((link) => isActive(link.path));

  const displayName = (() => {
    if (!user) {
      return "";
    }
    const primary = user.profile?.display_name?.trim();
    if (primary) {
      return primary;
    }
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
    if (fullName) {
      return fullName;
    }
    return user.username ?? user.email ?? "User";
  })();

  const userInitial = displayName.charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 z-50">
            <img
              src="/t_logo.svg"
              alt="Technoheaven logo"
              className="h-10 w-auto object-contain transition-all md:h-12"
            />
          </Link>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {menuItems.simple.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.name}
              </Link>
            ))}

            {dropdownGroups.map(({ label, key }) => (
              <DropdownMenu key={key}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "group inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none",
                      isGroupActive(key)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2 space-y-1">
                  {menuItems[key].map((link) => (
                    <DropdownMenuItem key={link.path} asChild>
                      <Link
                        to={link.path}
                        className={cn(
                          "flex w-full rounded-md px-3 py-2 text-sm transition-colors",
                          isActive(link.path)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>

          {/* Right Side - Login & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Notifications />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="relative hidden h-10 w-10 rounded-lg border-border/70 bg-background/70 text-muted-foreground transition hover:text-primary md:inline-flex"
            >
              <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative flex items-center gap-2 rounded-lg border border-border/70 bg-background/70 p-1 pr-3 text-left text-sm shadow-sm transition hover:border-primary focus:outline-none"
                  >
                    <Avatar className="h-9 w-9 rounded-md border border-border/70 bg-muted">
                      {user?.profile?.profile_image ? (
                        <AvatarImage src={user.profile.profile_image} alt={displayName} />
                      ) : (
                        <AvatarFallback className="rounded-md text-sm font-semibold">
                          {userInitial}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="hidden flex-col leading-tight md:flex">
                      <span className="text-xs text-muted-foreground">Signed in</span>
                      <span className="text-sm font-medium text-foreground">{displayName}</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {user?.is_staff && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/moderation">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      void handleLogout();
                    }}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/signin">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="default">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  toggleTheme();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-border/70 bg-background/70 text-muted-foreground transition hover:text-primary"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </Button>

              {menuItems.simple.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-md transition-all ${isActive(link.path)
                    ? "text-primary font-medium bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                <Accordion type="multiple" className="w-full">
                  {dropdownGroups.map(({ label, key }) => (
                    <AccordionItem key={key} value={key}>
                      <AccordionTrigger className="px-4 text-sm font-semibold text-muted-foreground">
                        {label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {menuItems[key].map((link) => (
                            <li key={link.path}>
                              <Link
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "block rounded-md px-4 py-2 text-sm transition-colors",
                                  isActive(link.path)
                                    ? "bg-muted font-medium text-primary"
                                    : "text-muted-foreground hover:bg-muted",
                                )}
                              >
                                {link.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {isAuthenticated ? (
                <div className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-background/80 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-md border border-border/70 bg-muted">
                      {user?.profile?.profile_image ? (
                        <AvatarImage src={user.profile.profile_image} alt={displayName} />
                      ) : (
                        <AvatarFallback className="rounded-md text-base font-semibold">
                          {userInitial}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground">Signed in</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-medium text-primary">
                      Go to dashboard
                    </Link>
                    {user?.is_staff && (
                      <Link to="/admin/moderation" onClick={() => setIsOpen(false)} className="text-sm font-medium text-primary">
                        Admin Panel
                      </Link>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="flex w-full items-center justify-center gap-2"
                      onClick={() => {
                        void handleLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link to="/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="default" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
