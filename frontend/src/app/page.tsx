"use client";

import Link from "next/link";
import Quiz from "~/components/ui/quiz"
import FileUpload from "~/components/ui/file-upload"

export default function HomePage() {

  const onUpload = async (file: File) => {
    console.log('Uploading file');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {/* <FileUpload onUpload={onUpload}/> */}
        <Quiz />
    </main>
  );
}
