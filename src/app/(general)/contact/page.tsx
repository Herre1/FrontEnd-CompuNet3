
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ICESI Contact Us",
    description: "ICESI University",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col item-center p-24">
        <h1 className="flex items-center">Contact Page</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, nisi ex odio sit optio iste aspernatur mollitia id soluta officiis, vel laudantium culpa nulla cum, nemo eligendi ipsa similique possimus?</p>
    </div>
  );
}