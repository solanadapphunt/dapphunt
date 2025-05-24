import { Search, Bell, ChevronDown, Plus, Menu, X, ChevronRight, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const isMobile = useIsMobile(1024); // Use 1024px as breakpoint
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu (Mobile Only) */}
              {isMobile && (
                <button 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={toggleMobileMenu}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              )}
              
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="DappHunt Logo" 
                  className="h-7 w-auto"
                />
              </Link>
              
              {/* Search Bar (Desktop Only) */}
              {!isMobile && (
                <div className="relative ml-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-10 w-56 bg-gray-50 border-gray-200 focus:bg-white rounded-md h-9"
                  />
                </div>
              )}
              
              {/* Navigation Dropdown (Desktop Only) */}
              {!isMobile && (
                <div className="flex items-center space-x-4 ml-6">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium text-sm h-auto py-1">
                    Launches <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium text-sm h-auto py-1">
                    Products <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium text-sm h-auto py-1">
                    Forums <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium text-sm h-auto py-1" asChild>
                    <Link href="/leaderboard">
                      Leaderboard
                    </Link>
                  </Button>
                  {session?.user && (
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium text-sm h-auto py-1" asChild>
                      <Link href="/admin">
                        Admin
                      </Link>
                    </Button>
                  )}
                  {/* <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium text-sm h-auto py-1">
                    Advertise
                  </Button> */}
                </div>
              )}
            </div>
            
            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Submit Button */}
              <Button 
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-full font-medium text-sm h-9 px-4" 
                asChild
              >
                <Link href="/submit" className="flex items-center">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Submit
                </Link>
              </Button>
              
              {/* Notifications (only if signed in) */}
              {session?.user && (
                <button className="relative p-1.5 text-gray-600 hover:text-gray-900">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-[#EC729C] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    10
                  </span>
                </button>
              )}
              
              {/* User Menu */}
              {status === "loading" ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-1 hover:bg-gray-50 rounded-md p-1">
                      <img 
                        src={session.user.image || `https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=32&h=32&fit=crop&crop=face`} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full"
                      />
                      {!isMobile && (
                        <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-gray-500">@{session.user.username || 'user'}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Bell className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => signIn()}
                  className="bg-[#FF6154] hover:bg-[#E55347] text-white rounded-full font-medium text-sm h-9 px-4"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="pt-16"> {/* Account for header height */}
            <div className="px-4 py-6">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Search..." 
                  className="pl-12 w-full bg-gray-50 border-gray-200 focus:bg-white rounded-lg h-12 text-base"
                />
              </div>

              {/* Menu Items */}
              <nav className="space-y-0">
                <Link 
                  href="/launches" 
                  className="flex items-center justify-between py-4 text-gray-900 hover:bg-gray-50 -mx-4 px-4 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg font-medium">Launches</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                
                <Link 
                  href="/products" 
                  className="flex items-center justify-between py-4 text-gray-900 hover:bg-gray-50 -mx-4 px-4 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg font-medium">Products</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                
                <Link 
                  href="/leaderboard" 
                  className="flex items-center justify-between py-4 text-gray-900 hover:bg-gray-50 -mx-4 px-4 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg font-medium">Leaderboard</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                
                {session?.user && (
                  <Link 
                    href="/admin" 
                    className="flex items-center justify-between py-4 text-gray-900 hover:bg-gray-50 -mx-4 px-4 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg font-medium">Admin</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                )}
                
                <Link 
                  href="/forums" 
                  className="flex items-center justify-between py-4 text-gray-900 hover:bg-gray-50 -mx-4 px-4 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg font-medium">Forums</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                
                {session?.user ? (
                  <>
                    <Link 
                      href="/profile" 
                      className="flex items-center justify-between py-4 text-gray-900 hover:bg-gray-50 -mx-4 px-4 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-lg font-medium">My Profile</span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center justify-between py-4 text-red-600 hover:bg-red-50 -mx-4 px-4 transition-colors w-full text-left"
                    >
                      <span className="text-lg font-medium">Sign Out</span>
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signIn();
                    }}
                    className="flex items-center justify-between py-4 text-[#FF6154] hover:bg-red-50 -mx-4 px-4 transition-colors w-full text-left"
                  >
                    <span className="text-lg font-medium">Sign In</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
