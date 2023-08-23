"use-client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { NextPage } from "next";
import Image from "next/image";

interface Props {
  text: string | ReactNode;
  items: Array<{ label: any, link?: string, divide?: boolean}>;
}

const Dropdown: NextPage<Props> = (props) => {
  const { text, items } = props;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  };

  function closeDropdown() {
    setIsOpen(false);
  };

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex justify-center items-center w-full"
      >
        { text }
      </button>

      {isOpen && (
        <div className="z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`block px-4 py-2 text-sm text-gray-700 ${ item.link ? "cursor-pointer hover:text-gray-900 hover:bg-gray-100" : "select-none" } ${ index > 0 && item.divide ? "border-t" : ""}`}
                role="menuitem"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
