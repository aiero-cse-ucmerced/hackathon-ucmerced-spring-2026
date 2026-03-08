"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const JOB_SUGGESTIONS = [
  "Software Engineer",
  "Data Analyst",
  "Product Manager",
  "Web Developer",
  "UX Designer",
  "Marketing Intern",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Financial Analyst",
  "Software Developer",
  "DevOps Engineer",
  "Content Writer",
  "Research Intern",
  "Consulting",
] as const;

const MAX_SUGGESTIONS = 10;

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0 text-zinc-500", className)}
    aria-hidden
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0 text-zinc-500", className)}
    aria-hidden
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export interface JobSearchBarProps {
  keywords: string;
  location: string;
  onKeywordsChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
  disabled?: boolean;
  className?: string;
}

export function JobSearchBar({
  keywords,
  location,
  onKeywordsChange,
  onLocationChange,
  onSearch,
  disabled = false,
  className,
}: JobSearchBarProps) {
  const listId = useId();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredSuggestions = useMemo(() => {
    const q = keywords.trim().toLowerCase();
    if (q.length === 0) {
      return JOB_SUGGESTIONS.slice(0, MAX_SUGGESTIONS);
    }
    return JOB_SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(q),
    ).slice(0, MAX_SUGGESTIONS);
  }, [keywords]);

  const showDropdown = dropdownOpen && filteredSuggestions.length > 0;

  const openDropdown = useCallback(() => {
    setDropdownOpen(true);
    setHighlightedIndex(0);
  }, []);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const selectSuggestion = useCallback(
    (suggestion: string) => {
      onKeywordsChange(suggestion);
      closeDropdown();
    },
    [onKeywordsChange, closeDropdown],
  );

  useEffect(() => {
    if (showDropdown && filteredSuggestions.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [showDropdown, filteredSuggestions, keywords]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const handleKeywordsFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    openDropdown();
  };

  const handleKeywordsBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
      setHighlightedIndex(-1);
      blurTimeoutRef.current = null;
    }, 200);
  };

  const handleKeywordsChange = (value: string) => {
    onKeywordsChange(value);
    setDropdownOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (showDropdown && highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        e.preventDefault();
        selectSuggestion(filteredSuggestions[highlightedIndex]);
        return;
      }
      onSearch();
      return;
    }
    if (!showDropdown || filteredSuggestions.length === 0) return;
    if (e.key === "Escape") {
      closeDropdown();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) =>
        i < filteredSuggestions.length - 1 ? i + 1 : 0,
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) =>
        i > 0 ? i - 1 : filteredSuggestions.length - 1,
      );
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-0",
        className,
      )}
    >
      <Popover open={showDropdown} onOpenChange={(open) => !open && closeDropdown()}>
        <PopoverAnchor asChild>
          <div className="relative flex-1 sm:rounded-r-none">
            <SearchIcon className="absolute left-3 top-1/2 z-10 -translate-y-1/2" />
            <Input
              type="text"
              value={keywords}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              onFocus={handleKeywordsFocus}
              onBlur={handleKeywordsBlur}
              onKeyDown={handleKeyDown}
              placeholder="Job title, keywords, or company"
              className="min-w-0 pl-9 sm:rounded-r-none sm:border-r-0"
              aria-label="Job title, keywords, or company"
              aria-autocomplete="list"
              aria-expanded={showDropdown}
              aria-controls={showDropdown ? listId : undefined}
              aria-activedescendant={
                showDropdown && highlightedIndex >= 0
                  ? `${listId}-option-${highlightedIndex}`
                  : undefined
              }
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-h-[280px] w-(--radix-popover-trigger-width) overflow-y-auto p-0"
        >
          <ul
            id={listId}
            role="listbox"
            className="py-1"
            aria-label="Job title suggestions"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm text-zinc-900 outline-none",
                  index === highlightedIndex && "bg-zinc-100",
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(suggestion);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
      <div className="hidden h-8 w-px shrink-0 bg-zinc-200 sm:block" aria-hidden />
      <div className="relative flex-1 sm:rounded-l-none">
        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="City or zip"
          className="min-w-0 pl-9 sm:rounded-l-none sm:border-l-0"
          aria-label="City or zip"
        />
      </div>
      <Button
        type="button"
        onClick={onSearch}
        disabled={disabled}
        className="shrink-0 bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600 sm:ml-2"
      >
        Search
      </Button>
    </div>
  );
}
