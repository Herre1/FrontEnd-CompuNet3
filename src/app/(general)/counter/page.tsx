import { CartCounter } from "@/components/cart/CartCounter"

export const metadata = {
    title:"Counter Page", 
    description: "Counter Page"
}

export default function  CounterPage (){
    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-slate-400">
            <CartCounter value={10}/>
        </div>
    )
}