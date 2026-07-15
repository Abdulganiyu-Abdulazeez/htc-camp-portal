"use client";

import React from "react";

// Helper to parse inline markdown: **bold** and _italic_
export function parseInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Bold matches **text**
    const boldMatch = remaining.match(/(\*\*)([\s\S]*?)\1/);
    // Italic matches _text_
    const italicMatch = remaining.match(/(_)([\s\S]*?)\1/);

    const hasBold = !!boldMatch;
    const hasItalic = !!italicMatch;

    if (!hasBold && !hasItalic) {
      tokens.push(<span key={keyIndex++}>{remaining}</span>);
      break;
    }

    const boldIdx = hasBold && boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const italicIdx = hasItalic && italicMatch ? remaining.indexOf(italicMatch[0]) : Infinity;

    if (boldIdx < italicIdx && boldMatch) {
      // Bold occurs first
      const before = remaining.substring(0, boldIdx);
      if (before) {
        tokens.push(<span key={keyIndex++}>{before}</span>);
      }
      tokens.push(
        <strong key={keyIndex++} className="font-bold text-on-surface">
          {parseInlineMarkdown(boldMatch[2])}
        </strong>
      );
      remaining = remaining.substring(boldIdx + boldMatch[0].length);
    } else if (italicMatch) {
      // Italic occurs first
      const before = remaining.substring(0, italicIdx);
      if (before) {
        tokens.push(<span key={keyIndex++}>{before}</span>);
      }
      tokens.push(
        <em key={keyIndex++} className="italic text-on-surface-variant">
          {parseInlineMarkdown(italicMatch[2])}
        </em>
      );
      remaining = remaining.substring(italicIdx + italicMatch[0].length);
    } else {
      // Fallback: If for some reason index comparison fails, output remaining text
      tokens.push(<span key={keyIndex++}>{remaining}</span>);
      break;
    }
  }

  return tokens;
}

interface MarkdownRendererProps {
  text: string;
  className?: string;
}

export function MarkdownRenderer({ text, className = "" }: MarkdownRendererProps) {
  if (!text) return null;

  // Split lines
  const lines = text.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let inList = false;
  let keyIndex = 0;

  const flushList = () => {
    if (currentListItems.length > 0) {
      blocks.push(
        <ul key={`ul-${keyIndex++}`} className="list-disc pl-5 my-2 space-y-1">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if line is a bullet item (starts with "- " or "• ") - no asterisk * allowed
    const listMatch = line.match(/^(\s*)(?:-|•)\s+(.*)$/);

    if (listMatch) {
      if (!inList) {
        inList = true;
      }
      const itemContent = listMatch[2];
      currentListItems.push(
        <li key={`li-${i}`} className="text-inherit">
          {parseInlineMarkdown(itemContent)}
        </li>
      );
    } else {
      if (inList) {
        flushList();
      }

      if (trimmed === "") {
        // Space/paragraph gap
        blocks.push(<div key={`empty-${i}`} className="h-2.5" />);
      } else {
        blocks.push(
          <p key={`p-${i}`} className="my-1.5 leading-relaxed text-inherit">
            {parseInlineMarkdown(line)}
          </p>
        );
      }
    }
  }

  if (inList) {
    flushList();
  }

  return <div className={`prose-sm max-w-none text-inherit ${className}`}>{blocks}</div>;
}
