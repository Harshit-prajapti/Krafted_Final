"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DOWNLOAD_COUNTER_KEY = "krafted_app_download_counter";
const BASE_DOWNLOADS = 2100;
const MIN_UPDATE_DELAY_MS = 60 * 60 * 1000;
const MAX_UPDATE_DELAY_MS = 10 * 60 * 60 * 1000;

function getRandomDelayMs() {
    return MIN_UPDATE_DELAY_MS + Math.floor(Math.random() * (MAX_UPDATE_DELAY_MS - MIN_UPDATE_DELAY_MS));
}

function getRandomIncrement() {
    return Math.floor(Math.random() * 18) + 3;
}

function formatDownloadCount(count: number) {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(".0", "")}k`;
    }

    return `${count}`;
}

function getInstallInstructions() {
    if (typeof window === "undefined") {
        return {
            title: "Install the Krafted app",
            description: "Open the site in a supported browser to install the app.",
            steps: ["Use Chrome, Edge, or Safari on your device."],
        };
    }

    const userAgent = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS/i.test(userAgent);
    const isChromeLike = /Chrome|CriOS|Edg|SamsungBrowser/i.test(userAgent);

    if (isIos && isSafari) {
        return {
            title: "Install on iPhone or iPad",
            description: "Safari supports adding Krafted to the Home Screen.",
            steps: [
                'Tap the Share button in Safari.',
                'Choose "Add to Home Screen".',
                'Tap "Add" to finish installing.',
            ],
        };
    }

    if (isIos) {
        return {
            title: "Open in Safari to install",
            description: "Apple only allows web app installation from Safari.",
            steps: [
                "Open this site in Safari.",
                'Tap Share and then "Add to Home Screen".',
                'Tap "Add" to finish installing.',
            ],
        };
    }

    if (isAndroid && isChromeLike) {
        return {
            title: "Install on Android",
            description: "Your browser can install the Krafted app directly.",
            steps: [
                "Tap the browser menu.",
                'Choose "Install app" or "Add to Home screen".',
                'Confirm the install prompt.',
            ],
        };
    }

    if (isAndroid) {
        return {
            title: "Open in Chrome or Edge",
            description: "Android install prompts are most reliable in Chrome, Edge, and Samsung Internet.",
            steps: [
                "Open this site in Chrome, Edge, or Samsung Internet.",
                "Tap the browser menu.",
                'Choose "Install app".',
            ],
        };
    }

    return {
        title: "Install on desktop",
        description: "Desktop installation works best in Chrome or Edge.",
        steps: [
            "Open this site in Chrome or Edge.",
            "Click the install icon in the address bar.",
            'Confirm the install prompt to add Krafted to your desktop.',
        ],
    };
}

export default function WhatsAppButton() {
    const pathname = usePathname();
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [downloadCount, setDownloadCount] = useState(BASE_DOWNLOADS);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIosInstallable, setIsIosInstallable] = useState(false);
    const [showInstallHelp, setShowInstallHelp] = useState(false);

    const whatsappNumber = "+918889997527";
    const message = encodeURIComponent("Hello! I'm interested in your luxury furniture collection.");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    const formattedDownloads = formatDownloadCount(downloadCount);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

        setIsInstalled(isStandalone);
        setIsIosInstallable(
            /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
            !isStandalone
        );

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch((error) => {
                console.error("Failed to register service worker:", error);
            });
        }

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setInstallPrompt(null);
            setShowInstallHelp(false);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        let timeoutId: number | undefined;

        const syncCounter = () => {
            const now = Date.now();
            const storedState = window.localStorage.getItem(DOWNLOAD_COUNTER_KEY);
            let state: { count: number; nextUpdateAt: number };

            try {
                state = storedState
                    ? JSON.parse(storedState) as { count: number; nextUpdateAt: number }
                    : {
                        count: BASE_DOWNLOADS,
                        nextUpdateAt: now + getRandomDelayMs(),
                    };
            } catch {
                state = {
                    count: BASE_DOWNLOADS,
                    nextUpdateAt: now + getRandomDelayMs(),
                };
            }

            let safetyCounter = 0;
            while (state.nextUpdateAt <= now && safetyCounter < 24) {
                state = {
                    count: state.count + getRandomIncrement(),
                    nextUpdateAt: state.nextUpdateAt + getRandomDelayMs(),
                };
                safetyCounter += 1;
            }

            if (state.nextUpdateAt <= now) {
                state.nextUpdateAt = now + getRandomDelayMs();
            }

            window.localStorage.setItem(DOWNLOAD_COUNTER_KEY, JSON.stringify(state));
            setDownloadCount(state.count);

            timeoutId = window.setTimeout(syncCounter, Math.max(60_000, state.nextUpdateAt - now));
        };

        syncCounter();

        return () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    }, []);

    const handleInstallClick = async () => {
        if (installPrompt) {
            await installPrompt.prompt();
            const choice = await installPrompt.userChoice;

            if (choice.outcome === "accepted") {
                setInstallPrompt(null);
            }

            return;
        }

        setShowInstallHelp(true);
    };

    if (pathname !== "/") return null;

    const installInstructions = getInstallInstructions();

    return (
        <>
            {showInstallHelp && !isInstalled && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm md:items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#111111] p-6 text-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Install Krafted</p>
                                <h3 className="mt-2 text-2xl font-black">{installInstructions.title}</h3>
                                <p className="mt-2 text-sm text-white/70">{installInstructions.description}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowInstallHelp(false)}
                                className="rounded-full border border-white/10 p-2 text-white/70 transition-colors hover:text-white"
                                aria-label="Close install help"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-5 space-y-3">
                            {installInstructions.steps.map((step, index) => (
                                <div key={step} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-black text-black">
                                        {index + 1}
                                    </span>
                                    <p className="text-sm text-white/85">{step}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 flex gap-3">
                            {installPrompt && !isIosInstallable && (
                                <button
                                    type="button"
                                    onClick={handleInstallClick}
                                    className="flex-1 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black text-black transition-transform active:scale-[0.98]"
                                >
                                    Install Now
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowInstallHelp(false)}
                                className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-white/85 transition-colors hover:bg-white/5"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {!isInstalled && (
                <motion.button
                    type="button"
                    onClick={handleInstallClick}
                    aria-label={`Download app (${formattedDownloads} installs)`}
                    className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/30 bg-black/85 text-white shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/60"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 220 }}
                    whileTap={{ scale: 0.96 }}
                >
                    <div className="flex flex-col items-center justify-center leading-none">
                        <Download className="h-5 w-5 text-amber-300" />
                        <span className="mt-1 text-[10px] font-black tracking-wide text-white">
                            {formattedDownloads}
                        </span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="absolute right-full mr-3 top-1/2 hidden -translate-y-1/2 md:block"
                    >
                        <div className="relative whitespace-nowrap rounded-lg bg-white px-4 py-2 shadow-lg">
                            <span className="text-sm font-medium text-gray-800">Download App</span>
                            <div className="absolute top-1/2 -right-2 h-0 w-0 -translate-y-1/2 border-b-8 border-l-8 border-t-8 border-b-transparent border-l-white border-t-transparent" />
                        </div>
                    </motion.div>
                </motion.button>
            )}

            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#25D366] animate-whatsapp-pulse" />

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-lg shadow-[#25D366]/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#25D366]/40 md:h-16 md:w-16">
                        <svg
                            viewBox="0 0 24 24"
                            className="h-7 w-7 fill-current text-white md:h-8 md:w-8"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 md:block"
                    >
                        <div className="relative whitespace-nowrap rounded-lg bg-white px-4 py-2 shadow-lg">
                            <span className="text-sm font-medium text-gray-800">Chat with us!</span>
                            <div className="absolute top-1/2 -right-2 h-0 w-0 -translate-y-1/2 border-b-8 border-l-8 border-t-8 border-b-transparent border-l-white border-t-transparent" />
                        </div>
                    </motion.div>
                </div>
            </motion.a>
            </div>
        </>
    );
}
