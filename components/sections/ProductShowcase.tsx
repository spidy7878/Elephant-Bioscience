"use client";

import ShowcaseProductDetails from "./ShowcaseProductDetails";

interface ProductShowcaseProps {
    onOpenLogin?: () => void;
    showButton?: boolean;
    isLoggedIn?: boolean;
}

export default function ProductShowcase({ onOpenLogin, showButton = true, isLoggedIn = false }: ProductShowcaseProps) {
    return (
        <ShowcaseProductDetails
            isLoggedIn={isLoggedIn}
            onOpenLogin={onOpenLogin || (() => { })}
            showButton={showButton && !isLoggedIn}
        />
    );
}
