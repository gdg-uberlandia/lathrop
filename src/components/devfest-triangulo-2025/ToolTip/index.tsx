import React, { useState, useRef, useEffect } from "react";
import styles from "./ToolTip.module.css";
import clsx from "clsx";

interface ToolTipProps {
  children: React.ReactNode;
  content?: string;
  position?: "top" | "bottom" | "left" | "right";
  trigger?: "click" | "hover";
  className?: string;
}

interface ToolTipContextType {
  isOpen: boolean;
  showTooltip: () => void;
  hideTooltip: () => void;
  toggleTooltip: () => void;
}

const ToolTipContext = React.createContext<ToolTipContextType | undefined>(
  undefined,
);

const ToolTipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const showTooltip = () => setIsOpen(true);
  const hideTooltip = () => setIsOpen(false);
  const toggleTooltip = () => setIsOpen((prev) => !prev);

  return (
    <ToolTipContext.Provider
      value={{ isOpen, showTooltip, hideTooltip, toggleTooltip }}
    >
      {children}
    </ToolTipContext.Provider>
  );
};

const useToolTip = () => {
  const context = React.useContext(ToolTipContext);
  if (!context) {
    throw new Error("useToolTip must be used within a ToolTipProvider");
  }
  return context;
};

const ToolTipTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}> = ({ children, asChild = false, onClick }) => {
  const { toggleTooltip } = useToolTip();

  const handleClick = () => {
    toggleTooltip();
    onClick?.();
  };

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    });
  }

  return (
    <button type="button" onClick={handleClick} className={styles.trigger}>
      {children}
    </button>
  );
};

const ToolTipContent: React.FC<{
  children?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}> = ({ children = "Em breve", position = "top", sideOffset = 4 }) => {
  const { isOpen, hideTooltip } = useToolTip();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        hideTooltip();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideTooltip();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, hideTooltip]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={`${styles.content} ${styles[position]}`}
      style={{ "--side-offset": `${sideOffset}px` } as React.CSSProperties}
      role="tooltip"
      aria-live="polite"
    >
      {children}
      <div className={`${styles.arrow} ${styles[`arrow-${position}`]}`} />
    </div>
  );
};

// Componente principal que combina tudo
const ToolTip: React.FC<ToolTipProps> = ({
  children,
  content = "Em breve",
  position = "top",
  trigger = "click",
  className,
}) => {
  return (
    <ToolTipProvider>
      <div className={clsx(styles.ToolTip, className)}>
        <ToolTipTrigger asChild>{children}</ToolTipTrigger>
        <ToolTipContent position={position}>{content}</ToolTipContent>
      </div>
    </ToolTipProvider>
  );
};

// Exportações nomeadas para uso granular
export { ToolTip, ToolTipProvider, ToolTipTrigger, ToolTipContent, useToolTip };

// Exportação padrão
export default ToolTip;
