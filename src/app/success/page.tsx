import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <div className="max-w-xl mx-auto text-center border rounded-2xl p-10 shadow-sm">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Congratulations 🎉
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          You have successfully completed your order.
        </p>

        <Link
          href="/"
          className="inline-block bg-[#2e4857] hover:bg-[#2e4857] text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Explore More
        </Link>
      </div>
    </div>
  );
}