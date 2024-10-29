import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ICESI About us",
    description: "ICESI University",
  };

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col item-center p-24">
        <h1 className="flex items-center">About Page</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam et, numquam sapiente rem cupiditate illum nisi asperiores tempore, ex odit amet quaerat unde modi impedit perspiciatis recusandae dignissimos dicta nulla?</p>
    </div>
  );
}