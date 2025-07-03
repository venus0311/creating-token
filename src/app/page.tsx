"use client";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  useEffect(() => {
    redirect("/tokens");
  }, []);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center overflow-hidden">
        <div className="p-4">Redirecting to tokens page...</div>
      </main>
      <Footer />
    </>
  );
}
