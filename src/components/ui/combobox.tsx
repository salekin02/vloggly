"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
    options: { [key: string]: string }[]
    value: string
    onValueChange: (value: string, option: { [key: string]: string }) => void
    placeholder?: string
    emptyMessage?: string
    searchPlaceholder?: string
    disabled?: boolean
    className?: string
    maxHeight?: number
}

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = "Select an option",
    emptyMessage = "No results found.",
    searchPlaceholder = "Search...",
    disabled = false,
    className,
    maxHeight = 250,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                    disabled={disabled}
                >
                    {value
                        ? options.find((option) => (option.value) === value || option.isoCode === value)?.label || placeholder
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup
                        className={cn("overflow-y-auto")}
                        style={{ maxHeight: `${maxHeight}px` }}
                    >
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => {
                                    onValueChange(option.value, option)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}