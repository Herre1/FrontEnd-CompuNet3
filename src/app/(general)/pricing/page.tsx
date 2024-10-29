
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ICESI Pricing",
    description: "ICESI University",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col item-center p-24">
        <h1 className="flex items-center">Pricing Page</h1>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis animi, illum numquam hic voluptatum blanditiis fugit at dolore adipisci nulla, delectus enim commodi velit assumenda optio maiores voluptate itaque impedit.</p>
    </div>
  );
}