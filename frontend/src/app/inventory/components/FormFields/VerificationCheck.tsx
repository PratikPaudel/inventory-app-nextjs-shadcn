"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface VerificationCheckProps {
    isVerified: boolean;
    onChange: (checked: boolean) => void;
}

export default function VerificationCheck({
        isVerified,
        onChange,
    }: VerificationCheckProps) {
return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id="verification-check"
                checked={isVerified}
                onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") {
                        onChange(checked);
                    }
                }}
            />
            <label
                htmlFor="verification-check"
                className="text-sm font-medium"
            >
                Verified
            </label>
        </div>
    );
}