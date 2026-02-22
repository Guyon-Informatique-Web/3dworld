// Composant accordion pour les FAQ
// Client component avec animations Framer Motion

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  // ID de l'item ouvert (un seul à la fois)
  const [openId, setOpenId] = useState<string | null>(null);

  function toggleItem(id: string) {
    setOpenId(openId === id ? null : id);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary transition-colors"
          >
            {/* Question button */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-text">{item.question}</span>

              {/* Chevron icon avec rotation */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-light flex-shrink-0 transition-transform"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Answer avec animation */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0 text-text-light leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
