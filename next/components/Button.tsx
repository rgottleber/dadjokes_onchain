import React, { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button
    className="bg-primaryDark text-primaryLight font-sans px-4 py-2 rounded"
    onClick={onClick}
  >
    {children}
  </button>
);
