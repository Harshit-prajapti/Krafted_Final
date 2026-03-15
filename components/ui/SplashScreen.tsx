"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [isZoomingOut, setIsZoomingOut] = useState(false);

    useEffect(() => {
        const zoomOutTimer = setTimeout(() => {
            setIsZoomingOut(true);
        }, 3500);

        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 4500);

        return () => {
            clearTimeout(zoomOutTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
                >
                    <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={isZoomingOut
                            ? { scale: 2.5, opacity: 0, filter: "blur(10px)" }
                            : { scale: 1, opacity: 1, filter: "blur(0px)" }
                        }
                        transition={isZoomingOut
                            ? { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                            : { duration: 1.2, ease: "easeOut", delay: 0.2 }
                        }
                        className="flex flex-col items-center"
                    >
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                            <Image
                                src="/images/logo.png"
                                alt="Krafted Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isZoomingOut
                                ? { opacity: 0, y: -10 }
                                : { opacity: 1, y: 0 }
                            }
                            transition={{ duration: 0.6, delay: 1.5 }}
                            className="mt-4"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-500" />
                                <span className="text-amber-500 text-sm tracking-[0.3em] uppercase font-light">
                                    Luxury Furniture
                                </span>
                                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-500" />
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={isZoomingOut ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
