"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Package } from "lucide-react";

interface LimitedTimeOfferProps {
    endTime?: Date;
    stockLeft?: number;
}

export default function LimitedTimeOffer({
    endTime,
    stockLeft = 5
}: LimitedTimeOfferProps) {
    const [isMount, setIsMount] = useState(false)

    // Memoize the end time to prevent infinite loops caused by new Date() references on every render
    const targetTime = React.useMemo(() => {
        return endTime || new Date(Date.now() + 24 * 60 * 60 * 1000);
    }, [endTime]);

    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        setIsMount(true);

        const calculateTimeLeft = () => {
            const difference = targetTime.getTime() - Date.now();

            if (difference > 0) {
                const totalHours = Math.floor(difference / (1000 * 60 * 60));
                const hours = totalHours; // Keep logic simple for now, can be % 24 if we want days
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({ hours, minutes, seconds });
            } else {
                // Optional: Handle timer expiration
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft(); // Initial call
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetTime]);

    if (!isMount) return null;

    const formatTime = (h: number, m: number, s: number) => {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* Limited Time Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-medium shadow-sm"
            >
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="font-semibold">
                    {formatTime(timeLeft.hours, timeLeft.minutes, timeLeft.seconds)}
                </span>
                <span className="text-white/90 text-xs">left</span>
            </motion.div>

            {/* Limited Stock Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
            >
                <Package className="w-4 h-4" />
                <span className="font-semibold">Only {stockLeft} left</span>
            </motion.div>
        </div>
    );
}
