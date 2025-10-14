"use client"
import React, { useState } from "react";

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit/debit cards, PayPal, and bank transfers. Cash on Delivery may also be available depending on your location.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are usually processed within 1-2 business days. Delivery typically takes 3-7 business days depending on your location and chosen shipping method.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Yes, we have a 7-day return and exchange policy. Items must be unused and in their original packaging. Please check our Return Policy for more details.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide. Shipping costs and times vary depending on the destination country.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive an email or SMS with a tracking link so you can follow your package in real-time.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index : any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-20 py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-medium hover:bg-gray-50 rounded-xl transition"
            >
              {faq.question}
              <span className="ml-2 text-xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
