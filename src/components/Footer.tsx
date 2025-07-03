"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-background-300 bg-background-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6 md:pb-6">
        <div>
          <div className="max-w-md space-y-1">
            <strong className="block text-sm/[1.5] text-text-500">
              Feedback
            </strong>
            <p className="block text-text-300 text-sm/[1.5]">
              Encountered a bug or have feedback? We'd love to hear from you!
              Reach out to us at{" "}
              <a
                href="mailto:hi@tokenfi.com"
                className="font-bold text-text-400"
              >
                address@example.com
              </a>{" "}
              and help us make our platform even better. Your insights are
              invaluable!
            </p>
          </div>
          <p className="block text-text-300 text-sm/[1.5] mt-5">
            ©2025 All rights reserved.
          </p>
        </div>
        <div className="mt-10">
          <p className="block text-text-300 text-xs/[1.5]">
            <strong>Disclaimer:</strong> Our platform is a facilitator for DeFi
            product creation and does not maintain a direct affiliation or
            endorsement of any cryptocurrency developed using our services. We
            provide the tools for creation and management, but the
            responsibility and governance of each cryptocurrency rest solely
            with its creators and community.
          </p>
        </div>
      </div>
    </footer>
  );
}
