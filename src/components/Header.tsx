"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HamburgerMenu } from "./HamburgerMenu";
import WalletButton from "./WalletButton";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/tokens", title: "Tokens", isExternal: false },
    { href: "/create-token", title: "Create Token", isExternal: false },
    { href: "/my-tokens", title: "My Tokens", isExternal: false },
  ];

  useEffect(() => {
    const links = document.querySelectorAll(".mobile-menu a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        setIsOpen(false);
      });
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        mobileMenuRef.current &&
        !target?.matches(".hamburger-menu") &&
        !target?.matches(".mobile-menu a") &&
        !target?.matches(".mobile-menu") &&
        !target?.matches(".hamburger-menu-open")
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isCurrent = (href: string) => pathname === href;

  return (
    <header className="flex justify-center w-full z-20 bg-white">
      <div className="max-w-7xl w-full flex justify-between items-center px-4 py-1">
        {/* Logo */}
        <Link href="/" className="z-30">
          <img
            src="/logo.png"
            height={53}
            alt="Logo"
            className="lg:hidden max-h-[53px] py-4"
          />
          <img
            src="/logo-text.png"
            alt="Logo"
            className="hidden lg:block max-h-[53px] py-4"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center items-center">
          <div className="flex items-center gap-2.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`h-[44px] flex items-center gap-2 pl-3 pr-4 rounded-[6px] font-inter text-[16px] ${
                  isCurrent(item.href)
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Section */}
        <div className="flex items-center gap-4 ml-4">
          <WalletButton />

          {/* Mobile Menu Button */}
          <div ref={mobileMenuRef} className="lg:hidden relative">
            <HamburgerMenu
              navItems={navItems}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              currentPath={pathname}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
