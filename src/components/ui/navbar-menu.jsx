"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx"; // Import clsx

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  icon,
  children,
  showOnlyIconOnSmallScreen,
}) => {
  return (
    <div
      onMouseEnter={() => setActive(item)}
      className="relative flex items-center space-x-2"
    >
      {icon &&
        (showOnlyIconOnSmallScreen ? (
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer text-black dark:text-white"
          >
            {icon}
          </motion.span>
        ) : (
          <span>{icon}</span>
        ))}
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && children && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
  isDarkMode,
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={clsx(
        "relative rounded-full border border-transparent shadow-input flex justify-center space-x-4 px-4 py-4",
        {
          "bg-white text-black dark:bg-black dark:border-white/[0.2]":
            isDarkMode,
          "bg-white text-white dark:bg-gray-800 dark:border-black/[0.2]":
            !isDarkMode,
        }
      )}
    >
      {children}
    </nav>
  );
};

export const HoveredLink = ({ children, ...rest }) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black"
    >
      {children}
    </Link>
  );
};
