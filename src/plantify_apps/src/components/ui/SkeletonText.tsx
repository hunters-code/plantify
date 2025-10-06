import React from "react";
import { Skeleton } from "@/components/ui";

interface SkeletonTextProps {
    lines?: number;
    height?: number;
    className?: string;
}

const SkeletonText: React.FC<SkeletonTextProps> = ({
    lines = 3,
    height = 14,
    className,
}) => {
    return (
        <div className={`space-y-2 ${className || ""}`}>
            {Array.from({ length: lines }).map((_, idx) => (
                <Skeleton key={idx} height={height} width={`${90 - idx * 10}%`} />
            ))}
        </div>
    );
};

export default SkeletonText;
