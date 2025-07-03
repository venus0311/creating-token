import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../app/HamburgerMenu.css";

interface HamburgerMenuProps {
  navItems: Array<{ href: string; title: string; isExternal: boolean }>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentPath: string;
}

export const HamburgerMenu = ({
  navItems,
  isOpen,
  setIsOpen,
  currentPath,
}: HamburgerMenuProps) => {
  const router = useRouter();
  const HamburgerIcon = () => (
    <img src="/hamburger.svg" className="w-11 h-11 mt-2" alt="Menu" />
  );

  const handleNavItemClick = (href: string, isExternal: boolean) => {
    setIsOpen(false);
    if (isExternal) {
      window.open(href, "_blank");
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`hamburger-menu ${isOpen ? "hamburger-menu-open" : ""}`}
      >
        <HamburgerIcon />
      </button>

      <nav className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white p-4 -mb-16"
          >
            x
          </button>
        </div>
        <ul>
          {navItems.map(({ href, title, isExternal }, index) => (
            <li key={index}>
              <a
                href={href}
                className={`mobile-menu-item ${
                  currentPath === href ? "mobile-menu-item-active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavItemClick(href, isExternal);
                }}
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
