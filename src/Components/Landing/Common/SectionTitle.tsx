import { cn } from '@/lib/utils';
import React from 'react'

type SectionTitleProps = {
    title: string;
    className?: string;
}
export default function SectionTitle({ title, className }: SectionTitleProps) {
    return (
        <h1 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold md:tracking-normal leading-tight leading-normal text-blue-900", className)}>
            {title}
        </h1>
    )
}
