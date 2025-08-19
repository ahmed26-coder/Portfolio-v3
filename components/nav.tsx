"use client";

import React from "react";
import { useState, useRef, useEffect, useMemo, useCallback, MutableRefObject } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, Mail, Sun, Menu, X, LucideIcon, Pin } from "lucide-react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./languages";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Utility function for debouncing
const debounce = <Args extends unknown[]>(func: (...args: Args) => void, wait: number): ((...args: Args) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  isExpanded: boolean;
  isActive: boolean;
  onClick: () => void;
}

interface SocialLink {
  href?: string;
  title: string;
  icon: string | LucideIcon;
  width?: number;
  height?: number;
}

interface MenuItemConfig {
  href: string;
  title: string;
  icon: LucideIcon;
  label: string;
  key: string;
}

const MenuItem = React.memo(function MenuItem({ icon: Icon, label, isExpanded, isActive, onClick }: MenuItemProps) {
  return (
    <div
      className={`flex gap-4 items-center w-full px-3 py-2 text-lg rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-gray-200 dark:bg-[#AEB1B7]/32 text-black dark:text-white font-semibold"
          : "text-[#666666] dark:text-[#FFFFFF]/50"
      }`}
      onClick={onClick}
    >
      <Icon
        className={`w-6 h-6 ${isActive ? "text-black dark:text-white" : "text-[#666666] dark:text-[#FFFFFF]/50"}`}
      />
      {isExpanded && <span>{label}</span>}
    </div>
  );
});

const SocialIcon = React.memo(function SocialIcon({
  height = 24,
  width = 24,
  icon,
  href,
  title = "",
}: {
  icon: string | LucideIcon;
  href?: string;
  title?: string;
  width?: number;
  height?: number;
}) {
  const isImage = typeof icon === "string";
  return (
    <a
      href={href}
      aria-label={title}
      target={href !== "#" ? "_blank" : undefined}
      rel={href !== "#" ? "noopener noreferrer" : undefined}
      className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
    >
      {isImage ? (
        <Image height={height} width={width} src={icon} alt={title} priority />
      ) : (
        React.createElement(icon, {
          className: "w-6 h-6 text-[#666666] dark:text-[#FFFFFF]/40",
        })
      )}
    </a>
  );
});

const DesktopSidebar = ({
  isExpanded,
  setIsExpanded,
  isLargeScreen,
  isPinned,
  setIsPinned,
  normalizedPathname,
  menuItems,
  socialLinks,
  toggleTheme,
  tProfile,
  locale,
}: {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  isLargeScreen: boolean;
  isPinned: boolean;
  setIsPinned: (value: boolean) => void;
  normalizedPathname: string;
  menuItems: MenuItemConfig[];
  socialLinks: SocialLink[];
  toggleTheme: () => void;
  tProfile: (key: string) => string;
  locale: string;
}) => (
  <div
    className={`hidden lg:flex flex-col h-[100vh] top-0 bg-white dark:bg-black sm:sticky left-0 transition-[width,padding,opacity] duration-300 ease-in-out hover:bg-white dark:hover:bg-black ${
      isExpanded || isPinned ? "fixed w-56 left-0 p-4 z-50 opacity-100" : "sticky w-20 py-4 px-0 sm:sticky top-0 opacity-90"
    }`}
    onMouseEnter={!isLargeScreen && !isPinned ? () => setIsExpanded(true) : undefined}
    onMouseLeave={!isLargeScreen && !isPinned ? () => setIsExpanded(false) : undefined}
  >
    {isExpanded && !isLargeScreen && (
      <button
        onClick={() => setIsPinned(!isPinned)}
        className={`absolute top-4 right-4 ${
          isPinned
            ? "text-green-500 hover:text-green-600"
            : "text-[#666666] dark:text-[#FFFFFF]/50 hover:text-black dark:hover:text-white"
        }`}
        aria-label={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
      >
        <Pin size={20} />
      </button>
    )}
    <div className="flex flex-col items-center mb-6">
      <Image
        className="rounded-full"
        src="/me.jpg"
        alt="Profile"
        width={40}
        height={40}
        priority
        placeholder="blur"
        blurDataURL="/example-blur.jpg"
      />
      {(isExpanded || isPinned) && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center mt-2"
        >
          <h2 className="text-2xl text-[#111111] dark:text-white font-semibold">{tProfile("name")}</h2>
          <p className="text-base text-[#666666]">{tProfile("jobTitle1")}</p>
          <p className="text-base text-[#666666]">{tProfile("jobTitle2")}</p>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex space-x-3 mt-3 justify-center"
          >
            {socialLinks.map((link, index) => (
              <SocialIcon key={index} {...link} />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
    <nav className="flex flex-col justify-center mx-auto">
      {menuItems.map(({ href, icon: Icon, label, key, title }) => (
        <Link locale={locale} className="my-2 w-full items-center" aria-label={title} key={key} href={href}>
          <MenuItem
            icon={Icon}
            label={label}
            isExpanded={isExpanded || isPinned}
            isActive={normalizedPathname === href}
            onClick={() => {}}
          />
        </Link>
      ))}
    </nav>
    <div onClick={toggleTheme} className="flex justify-center dark:text-[#FFFFFF]/40 my-1">
      <SocialIcon icon={Sun} title="Toggle Theme" />
    </div>
    {!(isExpanded || isPinned) && (
      <div className="flex-col space-y-3 mt-5 mx-auto justify-center items-center">
        {socialLinks.map((link, index) => (
          <SocialIcon key={index} {...link} />
        ))}
      </div>
    )}
    <LanguageSwitcher isSidebarExpanded={isExpanded || isPinned} />
  </div>
);

const MobileSidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  normalizedPathname,
  menuItems,
  socialLinks,
  toggleTheme,
  tProfile,
  locale,
  mobileMenuRef,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  normalizedPathname: string;
  menuItems: MenuItemConfig[];
  socialLinks: SocialLink[];
  toggleTheme: () => void;
  tProfile: (key: string) => string;
  locale: string;
  mobileMenuRef: MutableRefObject<HTMLDivElement | null>;
}) => (
  <AnimatePresence>
    {isMobileMenuOpen && (
      <>
        <motion.div
          className="fixed inset-0 bg-black/40 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <motion.div
          ref={mobileMenuRef}
          initial={{ x: locale === "ar" ? 350 : -350, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: locale === "ar" ? 350 : -350, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={`z-50 lg:hidden fixed top-0 ${locale === "ar" ? "right-0" : "left-0"} w-56 min-h-screen bg-gray-100 dark:bg-black p-4 shadow-xl`}
        >
          <div className="flex flex-col items-center mb-4">
            <Image
              className="rounded-full"
              src="/me.jpg"
              alt="Profile"
              width={60}
              height={60}
              priority
              placeholder="blur"
              blurDataURL="/example-blur.jpg"
            />
            <div className="text-center mt-2">
              <h2 className="text-xl text-[#111111] dark:text-white font-semibold">{tProfile("name")}</h2>
              <p className="text-sm text-[#666666]">{tProfile("jobTitle1")}</p>
              <p className="text-sm text-[#666666]">{tProfile("jobTitle2")}</p>
            </div>
            <div className="flex space-x-3 mt-3 justify-center">
              {socialLinks.map((link, index) => (
                <SocialIcon key={index} {...link} />
              ))}
            </div>
          </div>
          <nav className="flex flex-col justify-center mx-3">
            {menuItems.map(({ href, icon, label, title }) => (
              <Link
                locale={locale}
                className="my-2 w-full items-center"
                aria-label={title}
                key={label}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MenuItem
                  icon={icon}
                  label={label}
                  isExpanded={true}
                  isActive={normalizedPathname === href}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </Link>
            ))}
          </nav>
          <div onClick={toggleTheme} className="flex justify-center items-center py-1 mx-auto dark:text-[#FFFFFF]/40">
            <SocialIcon icon={Sun} title="Toggle Theme" />
          </div>
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const pathname = usePathname();
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const t = useTranslations("nav.menu");
  const tProfile = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const normalizedPathname = pathname.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname;

  const menuItems = useMemo<MenuItemConfig[]>(
    () => [
      { href: "/", title: t("Home"), icon: Home, label: t("Home"), key: "Home" },
      { href: "/about", title: t("About"), icon: User, label: t("About"), key: "About" },
      { href: "/portfolio", title: t("Portfolio"), icon: Briefcase, label: t("Portfolio"), key: "Portfolio" },
      { href: "/contact", title: t("Contact"), icon: Mail, label: t("Contact"), key: "Contact" },
    ],
    [t]
  );

  const socialLinks = useMemo<SocialLink[]>(
    () => [
      { href: "https://wa.me/201016626452", title: "WhatsApp", icon: "/whatsapp-svgrepo-com.svg" },
      {
        href: "https://www.linkedin.com/in/ahmed-adham-479334331/",
        title: "LinkedIn",
        icon: "/linkedin-svgrepo-com.svg",
        width: 30,
        height: 30,
      },
      { href: "https://github.com/ahmed26-coder", title: "GitHub", icon: "/github-svgrepo-com.svg" },
    ],
    []
  );

  const { theme, setTheme } = useTheme();
  const toggleTheme = useCallback(() => setTheme(theme === "light" ? "dark" : "light"), [theme, setTheme]);

  // Restore pin state from localStorage on mount
  useEffect(() => {
  try {
    const savedPinned = localStorage.getItem("sidebarPinned") === "true";
    setIsPinned(savedPinned);
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    setIsPinned(false);
  }
  }, []);

  // Save pin state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarPinned", String(isPinned));
  }, [isPinned]);

  // Handle screen resizing
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1636px)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsLargeScreen(e.matches);
      setIsExpanded(e.matches);
      if (!e.matches) setIsPinned(false);
    };

    setIsLargeScreen(mediaQuery.matches);
    setIsExpanded(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Handle scroll with debounce
  useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollY = window.scrollY;
      setIsMobileHeaderVisible(currentScrollY <= lastScrollY.current || currentScrollY <= 50);
      lastScrollY.current = currentScrollY;
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const controller = new AbortController();
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, {
      passive: true,
      signal: controller.signal,
    });
    return () => controller.abort();
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="grid grid-cols-1 z-50">
        <DesktopSidebar
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isLargeScreen={isLargeScreen}
          isPinned={isPinned}
          setIsPinned={setIsPinned}
          normalizedPathname={normalizedPathname}
          menuItems={menuItems}
          socialLinks={socialLinks}
          toggleTheme={toggleTheme}
          tProfile={tProfile}
          locale={locale}
        />
      </div>
      <div
        className={`z-50 lg:hidden fixed top-0 left-0 w-full bg-gray-100 dark:bg-black flex justify-between items-center p-4 shadow-lg transition-transform duration-300 ${
          isMobileHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link locale={locale} href="/">
          <div className="flex items-center space-x-3">
            <Image src="/me.jpg" alt="Profile" width={45} height={40} className="rounded-full" priority />
            <div>
              <h2 className="text-lg text-[#111111] dark:text-white font-semibold">{tProfile("name")}</h2>
              <p className="text-sm text-[#666666]">{tProfile("jobTitle1")}</p>
            </div>
          </div>
        </Link>
        <div className="flex gap-5 items-center">
          <div onClick={toggleTheme} className="flex justify-center dark:text-[#FFFFFF]/40">
            <SocialIcon icon={Sun} title="Toggle Theme" />
          </div>
          <button
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 dark:text-white"
          >
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>
      <MobileSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        normalizedPathname={normalizedPathname}
        menuItems={menuItems}
        socialLinks={socialLinks}
        toggleTheme={toggleTheme}
        tProfile={tProfile}
        locale={locale}
        mobileMenuRef={mobileMenuRef}
      />
    </>
  );
}

export default React.memo(Sidebar);