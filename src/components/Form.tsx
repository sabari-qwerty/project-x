"use client";
import { FC, FormEvent, useState } from "react";

export const Form: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

    const fromData = new FormData();
    fromData.append("file", file);

    try {
      const res = await fetch("/api/stroage/upload", {
        method: "POST",
        body: fromData,
      });
      const data = await res.json();
      setUrl(data?.url);
    } catch (error) {
      console.log(error);
    }
    setUploading(false);
  };

  return (
    <main>
      <h1>Upload a File to S3</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="file"
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              setFile(files[0]);
            }
          }}
          accept="image/png, image/jpeg"
        />
        <button type="submit" disabled={uploading}>
          Upload
        </button>

        {url && (
          <a href={url} download>
            <p>download</p>
          </a>
        )}
      </form>
    </main>
  );
};
