import React from "react";

interface LinkItem {
    label: string;
    href: string;
}

interface Column {
    heading: string;
    links: LinkItem[];
}

export default function Footer() {
    const columns: Column[] = [
        {
            heading: "Platform",
            links: [
                { label: "Browse Startups", href: "#browse" },
                { label: "How it Works", href: "#how" },
                { label: "Fees & Terms", href: "#fees" },
                { label: "Security", href: "#security" },
            ],
        },
        {
            heading: "Resources",
            links: [
                { label: "Documentation", href: "#docs" },
                { label: "API Reference", href: "#api" },
                { label: "Support Center", href: "#support" },
                { label: "Community", href: "#community" },
            ],
        },
        {
            heading: "Connect",
            links: [
                { label: "Discord", href: "#discord" },
                { label: "Telegram", href: "#telegram" },
                { label: "Twitter", href: "#twitter" },
                { label: "GitHub", href: "#github" },
            ],
        },
    ];

    return (
        <footer className="relative isolate bg-neutral-100">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-12">
                        {/* Brand / blurb */}
                        <div className="sm:col-span-4">
                            <a href="/" className="inline-flex items-center gap-2">
                                <img
                                    src="/assets/images/company-logo.png"
                                    alt="Coworking founders and investors"
                                    className="w-32 object-cover"
                                />
                            </a>
                            <p className="mt-3 max-w-xs text-sm text-gray-600">
                                A decentralized startup investment platform offering stable
                                returns.
                            </p>
                        </div>

                        {/* Link columns */}
                        <div className="sm:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                            {columns.map((col) => (
                                <nav key={col.heading} aria-label={col.heading}>
                                    <div className="text-[12px] uppercase tracking-wide text-gray-500/90 mb-3">
                                        {col.heading}
                                    </div>
                                    <ul className="space-y-2 text-sm">
                                        {col.links.map((link) => (
                                            <li key={link.label}>
                                                <a
                                                    href={link.href}
                                                    className="text-gray-700 hover:text-gray-900 transition"
                                                >
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-10 h-px w-full bg-gray-200" />

                    {/* Bottom bar */}
                    <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-sm text-gray-600">©2025 Plantify</p>

                        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <img
                                src="/assets/images/icp.png"
                                alt="ICP"
                                className="w-6 object-cover"
                            />
                            <span>Built on Internet Computer Protocol.</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
