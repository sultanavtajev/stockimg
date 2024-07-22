"use client";
import ClientComponent from "@/components/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [initialImages, setInitialImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/fetchImages");
        setInitialImages(response.data);
      } catch (error) {
        console.error("Failed to fetch images from API:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <main className="flex-1">
      <section className="w-full py-12">
        <div className="container items-center justify-center px-4 md:px-6">
          <ClientComponent initialImages={initialImages} />
        </div>
      </section>
    </main>
  );
}
