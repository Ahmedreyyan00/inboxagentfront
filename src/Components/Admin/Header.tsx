"use client";

import { FaSearch, FaBell } from "react-icons/fa";

interface HeaderProps {
  title?: string;
  bHasTitle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ bHasTitle, title }) => {
  return (
    <header id="header" className="bg-white border-b border-neutral-200 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl">{title}</h1>
        <div className="flex items-center gap-4">
          {bHasTitle && (
            <>
              {" "}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder={`Search ${title}...`}
                  className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg w-64"
                />
              </div>
            </>
          )}

          <button className="relative">
            <FaBell className="text-neutral-700" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-neutral-900 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
              className="w-8 h-8 rounded-full"
              alt="Avatar"
            />
            <span>Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
