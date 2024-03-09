"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import React from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState<boolean>(false);

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    return null;
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <React.Fragment>
      <FontAwesomeIcon
        icon={!copied ? faCopy : faCheck}
        style={{
          display: "inline-block",
          color: `${!copied ? "#1e1e1e" : "#014923"}`,
          fontSize: "1rem",
          width: "1rem",
          cursor: "pointer",
          transition: "color 0.15s",
          WebkitTransition: "color 0.15s",
        }}
        title="Copy citation"
        onClick={() => copyText(text)}
      />
      <p
        style={{
          userSelect: "none",
          color: "#014923",
          display: "inline-block",
          opacity: `${copied ? "1" : "0"}`,
          transition: "opacity 0.15s",
          WebkitTransition: "opacity 0.15s",
        }}
      >
        &nbsp;Copied!
      </p>
    </React.Fragment>
  );
}
