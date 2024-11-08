"use client";


import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const { storeId } = useParams();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Adjust to show burger menu on screens md and below (<=1024px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const routes = [
    { label: "Overview", href: `/${storeId}` },
    { label: "Billboards", href: `/${storeId}/billboards`, displayLabel: "Banners" },
    { label: "Categories", href: `/${storeId}/categories` },
    { label: "Products", href: `/${storeId}/products` },
    { label: "Orders", href: `/${storeId}/orders` },
    { label: "Sizes", href: `/${storeId}/sizes` },
    { label: "Colors", href: `/${storeId}/colors` },
    { label: "Settings", href: `/${storeId}/settings` }
  ];

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);  // Close the menu on link click (for mobile)
    }
  };



  return (
    <>
      <nav className={cn("flex items-center justify-between space-x-4 lg:space-x-6", className)}>
        <div className="flex items-center gap-6"> {/* Adjust gap */}
          {/* Mobile Toggle (Burger Menu) */}
          {isMobile && (
            <div
              className="flex flex-col gap-[5px] cursor-pointer"
              onClick={() => setIsOpen(!isOpen)} // Toggle the mobile menu
            >
              <span className="h-[2px] w-[20px] bg-primary"></span>
              <span className="h-[2px] w-[20px] bg-primary"></span>
              <span className="h-[2px] w-[20px] bg-primary"></span>
            </div>
          )}

          {/* Go Live Link */}
          <Link
            href="http://localhost:3001"
            target="_blank"
            className={cn(
              "text-lg font-semibold transition-colors hover:text-orange-600", // Default styling
              "border-2 border-orange-500 rounded-lg shadow-lg px-4 py-2", // Default button styling
              "md:px-3 md:py-1.5 md:text-base", // Medium screen button adjustments
              "sm:px-2 sm:py-1 sm:text-sm" // Small screen button adjustments
            )}
          >
            Live
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile &&
          routes.map(({ href, label, displayLabel }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-lg font-semibold transition-colors hover:text-orange-600", // Font weight and hover state
                "border-2 border-orange-500 rounded-lg shadow-lg px-2 py-1", // Border and shadow for the links
                pathname === href ? "text-orange-500 border-b-4 border-orange-500" : "text-muted-foreground" // Active/inactive states
              )}
            >
              {displayLabel || label}
            </Link>
          ))}
      </nav>

      {/* Mobile Menu */}
      {isOpen && isMobile && (
        <div className="fixed top-16 bg-background flex flex-col items-center gap-4 w-full z-50 text-black">
          {routes.map(({ href, label, displayLabel }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-lg font-semibold transition-colors hover:text-orange-600", // Increased font weight for mobile links
                "border rounded-lg px-2 py-1", // Border and padding for mobile links
                pathname === href ? "text-orange-500 border-b-2 border-orange-500" : "text-primary border border-gray-300" // Active/inactive states
              )}
              onClick={handleLinkClick}
            >
              {displayLabel || label}
            </Link>
          ))}

          {/* Sizes & Colors Dropdown for Mobile */}
          {/* Sizes & Colors Dropdown */}


        </div>
      )}
    </>
  );
}
