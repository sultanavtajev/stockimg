"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";

export default function ClientComponent({ initialImages }) {
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");

  const generateImageWithUserPrompt = async () => {
    setLoading(true);
    try {
      const imageResponse = await axios.post(
        "/api/generateImage",
        new URLSearchParams({ prompt: userPrompt })
      );
      const imageUrl = imageResponse.data.imageUrl;

      setImages((prevImages) => [imageUrl, ...prevImages]);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateImageWithPredefinedPrompt = async () => {
    setLoading(true);
    try {
      const promptResponse = await axios.post("/api/generatePrompt");
      const prompt = promptResponse.data.prompt;

      const imageResponse = await axios.post(
        "/api/generateImage",
        new URLSearchParams({ prompt })
      );
      const imageUrl = imageResponse.data.imageUrl;

      setImages((prevImages) => [imageUrl, ...prevImages]);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchInitialImages = async () => {
      try {
        const response = await axios.get("/api/listImages");
        setImages(response.data);
      } catch (error) {
        console.error("Failed to fetch initial images:", error);
      }
    };

    fetchInitialImages();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex flex-col w-full max-w-sm items-center justify-center space-y-4 mb-8">
        <input
          type="text"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Skriv inn din egen prompt..."
          className="p-2 border rounded"
        />
        <Button
          onClick={generateImageWithUserPrompt}
          disabled={loading || !userPrompt}
        >
          {loading ? "Genererer bilde..." : "Generer bilde med egen prompt"}
        </Button>
        <Button onClick={generateImageWithPredefinedPrompt} disabled={loading}>
          {loading
            ? "Genererer bilde..."
            : "Generer bilde med forhåndsdefinert prompt"}
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
              className="rounded-lg shadow-lg"
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
