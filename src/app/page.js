import fs from "fs";
import path from "path";
import ClientComponent from "@/components/client";

export default function Home() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  const imageFiles = fs
    .readdirSync(imagesDir)
    .map((file) => ({
      file,
      mtime: fs.statSync(path.join(imagesDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.mtime - a.mtime) // Sorter fra nyeste til eldste
    .map((fileData) => `/images/${fileData.file}`);

  return (
    <main className="flex-1">
      <section className="w-full py-12">
        <div className="container items-center justify-center px-4 md:px-6">
          <ClientComponent initialImages={imageFiles} />
        </div>
      </section>
    </main>
  );
}
