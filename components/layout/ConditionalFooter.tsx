"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const FOOTER_VISIBLE_PATHS = ["/", "/contact", "/about"];

export default function ConditionalFooter() {
    const pathname = usePathname();

    const shouldShowFooter = FOOTER_VISIBLE_PATHS.includes(pathname || "");

    if (!shouldShowFooter) return null;

    return <Footer />;
}
