"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";

export default function ClientComponent({ initialImages }) {
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const isGeneratingRef = useRef(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    console.log("Starter generering...");
    try {
      // Steg 1: Hent en tilfeldig bildeprompt fra OpenAI
      const promptResponse = await axios.post("/api/generatePrompt");
      const prompt = promptResponse.data.prompt;

      // Steg 2: Send prompten til DALL-E for å generere bildet
      const imageResponse = await axios.post("/api/generateImage", { prompt });
      const imageUrl = imageResponse.data.imageUrl;

      // Steg 3: Oppdater bilde-listen
      setImages((prevImages) => [imageUrl, ...prevImages]);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
      console.log("Ferdig med generering.");
      // Start neste generering hvis fortsatt i genereringsmodus
      if (isGeneratingRef.current) {
        console.log("Starter ny generering...");
        generateImage();
      } else {
        console.log("Generering stoppet.");
      }
    }
  };

  const startGenerating = () => {
    if (!isGeneratingRef.current) {
      isGeneratingRef.current = true;
      generateImage(); // Start første generering umiddelbart
    }
  };

  const stopGenerating = () => {
    isGeneratingRef.current = false; // Stoppe den rekursive genereringen
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex w-full max-w-sm items-center space-x-2 mb-8">
        <Button
          type="button"
          onClick={startGenerating}
          disabled={loading || isGeneratingRef.current}
        >
          Start Generering
        </Button>
        <Button
          type="button"
          onClick={stopGenerating}
          disabled={!isGeneratingRef.current}
        >
          Stopp Generering
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div key={index} className="flex justify-center">
            <Image
              src={image}
              alt={`Generated ${index}`}
              width={500}
              height={500}
              className="rounded-lg shadow-lg cursor-pointer"
              onClick={() => handleImageClick(image)}
            />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="relative">
            <Image
              src={selectedImage}
              alt="Selected"
              width={800}
              height={800}
              className="rounded-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2"
              onClick={handleCloseModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
