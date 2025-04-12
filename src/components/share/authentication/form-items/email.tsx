import React from 'react';
import {
    FormControl,

    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
const Email = ({ labelClassName = "", label = "Email", ...props }) => {
    return (
        <FormItem>
            <FormLabel className={cn("text-sm leading-4.5 font-normal text-neutral-900", labelClassName)}>
                {label}
            </FormLabel>
            <FormControl>
                <Input
                    placeholder="Enter your email address"
                    type="email"
                    className="text-neutral-1000 h-10 rounded-sm border-neutral-300 bg-neutral-300 px-2.5 focus-visible:ring-0"
                    {...props}
                />
            </FormControl>
            <FormMessage className="text-danger-600" />
        </FormItem>
    );
};

export default Email;