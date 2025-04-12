// src/components/share/massage/massageInput/text-formatter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextColorIcon,
  EraserAutoIcon,
  ArrowDown01Icon,
  Cancel01Icon,
} from "hugeicons-react";
import { Editor } from "@tiptap/react";
import { useState } from "react";

interface TextFormatterProps {
  editor: Editor | null;
  setIsformat: (value: boolean) => void;
}

export const TextFormatter = ({ editor, setIsformat }: TextFormatterProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");

  const handleColorChange = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setCurrentColor(color);
  };

  const eraseAllFormatting = () => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
    <div className="flex flex-col w-full mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-sm shadow-none border-0 bg-neutral-200"
              >
                Default <ArrowDown01Icon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Default</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ToggleGroup type="multiple" className="flex space-x-1">
            <ToggleGroupItem
              value="bold"
              aria-label="Bold"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              data-active={editor?.isActive("bold")}
              className="cursor-pointer"
            >
              <TextBoldIcon className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="italic"
              aria-label="Italic"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              data-active={editor?.isActive("italic")}
              className="cursor-pointer"
            >
              <TextItalicIcon className="w-4 h-4" />
            </ToggleGroupItem>
            <div className="relative">
              <ToggleGroupItem
                value="color"
                aria-label="Text Color"
                onClick={() => setShowColorPicker(!showColorPicker)}
                data-active={editor?.isActive("textStyle")}
                className="cursor-pointer"
              >
                <TextColorIcon className="w-4 h-4" />
              </ToggleGroupItem>
              {showColorPicker && (
                <div className="absolute z-10 bottom-full mb-2 p-2 bg-white border rounded-md shadow-lg">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-8 h-8 cursor-pointer"
                  />
                  <button
                    onClick={() => handleColorChange("#000000")}
                    className="block mt-2 text-xs text-center w-full"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
            <ToggleGroupItem
              value="erase"
              aria-label="Erase format"
              onClick={eraseAllFormatting}
              className="cursor-pointer"
            >
              <EraserAutoIcon className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsformat(false)}
          >
            <Cancel01Icon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextFormatter;
