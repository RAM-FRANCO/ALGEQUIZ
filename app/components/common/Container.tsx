import React from "react";

export function Container({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className='container m-auto px-5 text-black h-screen flex flex-col justify-center items-center'>
        {children}
      </div>
    </div>
  );
}
