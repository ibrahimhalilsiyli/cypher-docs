"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function GlobalBackButton() {
    const router = useRouter();
    const pathname = usePathname();

    // Don't show on homepage
    if (pathname === "/") return null;

    return (
        <button
            onClick={() => router.back()}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-black shadow-lg hover:bg-primary-hover hover:scale-105 transition-all flex items-center gap-2 font-bold font-mono group"
            aria-label="Go Back"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:inline">GO_BACK</span>
        </button>
    );
}
