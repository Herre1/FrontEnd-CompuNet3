"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";
import style from "./ActiveLink.module.css";

interface Props {
    path: string;
    name: string;
}
export const ActiveLink  = ({path, name}: Props) => {
    const  pathName = usePathname();

    return (
        <Link href={path} 
              className={`p-2 m-2 text-white ${style.link} ${pathName===path?style.active: ""}`} key={path}>
            {name}
        </Link>
    )
}