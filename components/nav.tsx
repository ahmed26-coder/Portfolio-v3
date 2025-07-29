"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, Mail, Sun, Menu, X, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

interface MenuItemProps {
    icon: LucideIcon;
    label: string;
    isExpanded: boolean;
    isActive: boolean;
    onClick: () => void;
}

const MenuItem = React.memo(function MenuItem({ icon: Icon, label, isExpanded, isActive, onClick }: MenuItemProps) {
    return (
        <div
            className={`flex items-center p-3 text-lg rounded-lg cursor-pointer transition-all duration-200 ${
                isActive
                    ? "bg-gray-200 dark:bg-[#AEB1B7]/32 text-black dark:text-white font-semibold"
                    : "text-[#666666] dark:text-[#FFFFFF]/50"
            }`}
            onClick={onClick}
        >
            <Icon
                className={`w-6 h-6 ${
                    isActive
                        ? "text-black dark:text-white"
                        : "text-[#666666] dark:text-[#FFFFFF]/50"
                }`}
            />
            {isExpanded && <span className="ml-3">{label}</span>}
        </div>
    );
});

const SocialIcon = React.memo(function SocialIcon({ height = 24, width = 24, icon, href = "#", title = "" }: {
    icon: string | React.ElementType;
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
                <Image height={height} width={width} src={icon} alt={title} />
            ) : (
                React.createElement(icon, {
                    className: "w-6 h-6 text-[#666666] dark:text-[#FFFFFF]/40"
                })
            )}
        </a>
    );
});

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const pathname = usePathname();
    const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsMobileHeaderVisible(currentScrollY <= lastScrollY.current || currentScrollY <= 50);
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = useMemo(() => [
        { href: "/", title: "home", icon: Home, label: "Home" },
        { href: "/about", title: "about us", icon: User, label: "About" },
        { href: "/portfolio", title: "Portfolio", icon: Briefcase, label: "Portfolio" },
        { href: "/contact", title: "contact us", icon: Mail, label: "Contact" }
    ], []);

    const socialLinks = useMemo(() => [
        { href: "https://wa.me/201016626452", title: "Whats app", icon: "/whatsapp-svgrepo-com.svg" },
        { href: "https://www.linkedin.com/in/ahmed-adham-479334331/", title: "Linkedin", icon: "/linkedin-svgrepo-com.svg", width: 30, height: 30 },
        { href: "https://github.com/ahmed26-coder", title: "github", icon: "/github-svgrepo-com.svg" }
    ], []);

    const activeItem = useMemo(() => {
        const current = menuItems.find((item) => item.href === pathname);
        return current?.label || "";
    }, [pathname, menuItems]);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    const mobileMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            const is4K = window.innerWidth >= 1636;
            setIsLargeScreen(is4K);
            setIsExpanded(is4K);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
            signal: controller.signal
        });
        return () => controller.abort();
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="grid grid-cols-1 z-50">
                <div
                    className={`hidden lg:flex flex-col h-[100vh] top-0 bg-gray-100 dark:bg-black p-4 sm:sticky left-0 transition-all duration-300 ${isExpanded ? "fixed w-56 left-0 z-50" : "sticky w-20 sm:sticky top-0"}`}
                    onMouseEnter={!isLargeScreen ? () => setIsExpanded(true) : undefined}
                    onMouseLeave={!isLargeScreen ? () => setIsExpanded(false) : undefined}
                >
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
                        {isExpanded && (
                            <>
                                <div className="text-center mt-2">
                                    <h2 className="text-2xl text-[#111111] dark:text-white font-semibold">Ahmad Adham</h2>
                                    <p className="text-base text-[#666666]">Front-end Developer</p>
                                    <p className="text-base text-[#666666]">Web Designer</p>
                                </div>
                                <div className="flex space-x-3 mt-3 justify-center">
                                    {socialLinks.map((link, index) => (
                                        <SocialIcon key={index} {...link} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <nav className="space-y-4 flex flex-col items-center mx-auto justify-center">
                        {menuItems.map(({ href, icon: Icon, label, title }) => (
                            <Link aria-label={title} key={label} href={href}>
                                <MenuItem
                                    icon={Icon}
                                    label={label}
                                    isExpanded={isExpanded}
                                    isActive={activeItem === label}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                            </Link>
                        ))}
                    </nav>
                    <div onClick={toggleTheme} className="flex justify-center dark:text-[#FFFFFF]/40 my-10">
                        <SocialIcon icon={Sun} title="Toggle Theme" />
                    </div>
                    {!isExpanded && (
                        <div className="flex-col space-y-3 mt-5 mx-auto justify-center items-center">
                            {socialLinks.map((link, index) => (
                                <SocialIcon key={index} {...link} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Header */}
            <div className={`z-50 lg:hidden fixed top-0 left-0 w-full bg-gray-100 dark:bg-black flex justify-between items-center p-4 shadow-lg transition-transform duration-300 ${isMobileHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <Link href="/">
                    <div className="flex items-center space-x-3">
                        <Image src="/me.jpg" alt="Profile" width={45} height={40} className="rounded-full" priority />
                        <div>
                            <h2 className="text-lg text-[#111111] dark:text-white font-semibold">Ahmad Adham</h2>
                            <p className="text-sm text-[#666666]">Front-end Developer</p>
                        </div>
                    </div>
                </Link>
                <div className="flex gap-5 items-center">
                    <div onClick={toggleTheme} className="flex justify-center dark:text-[#FFFFFF]/40">
                        <SocialIcon icon={Sun} title="Toggle Theme" />
                    </div>
                    <button aria-label="Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-white">
                        {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/40 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setIsMobileMenuOpen(false)} />
                        <motion.div
                            ref={mobileMenuRef}
                            initial={{ x: -350, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -350, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="z-50 lg:hidden fixed top-0 left-0 w-[270px] min-h-screen bg-gray-100 dark:bg-black p-4 shadow-xl"
                        >
                            <div className="flex flex-col items-center mb-4">
                                <Image className="rounded-full" src="/me.jpg" alt="Profile" width={60} height={60} priority placeholder="blur" blurDataURL="/example-blur.jpg" />
                                <div className="text-center mt-2">
                                    <h2 className="text-xl text-[#111111] dark:text-white font-semibold">Ahmad Adham</h2>
                                    <p className="text-sm text-[#666666]">Front-end Developer</p>
                                    <p className="text-sm text-[#666666]">Web Designer</p>
                                </div>
                                <div className="flex space-x-3 mt-3 justify-center">
                                    {socialLinks.map((link, index) => (
                                        <SocialIcon key={index} {...link} />
                                    ))}
                                </div>
                            </div>
                            <nav className="space-y-3 flex flex-col items-center justify-center">
                                {menuItems.map(({ href, icon, label, title }) => (
                                    <Link aria-label={title} key={label} href={href} onClick={() => setIsMobileMenuOpen(false)}>
                                        <MenuItem
                                            icon={icon}
                                            label={label}
                                            isExpanded={true}
                                            isActive={activeItem === label}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        />
                                    </Link>
                                ))}
                            </nav>
                            <div onClick={toggleTheme} className="flex justify-center dark:text-[#FFFFFF]/40 my-6">
                                <SocialIcon icon={Sun} title="Toggle Theme" />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
