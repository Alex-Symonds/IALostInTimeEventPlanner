import { ReactNode } from "react"


export default function NoPlannerWrapper({mode, children} 
    : {mode : "done" | "error", children : ReactNode}) 
    : JSX.Element{

    const borderCSS = mode === "error" ?
                        "border-red-600"
                        : "border-white";

    return  <div className={"py-4 px-3 w-full"}>
              <div className={"border-l-4 pl-4 pr-8 pt-4 pb-10 " + " " + borderCSS}>
                { children }
              </div>
            </div>
}

export function NoPlannerHeading({children} 
: {children : ReactNode}) 
: JSX.Element{

    return <h2 className={"text-xl font-bold w-full py-2 mb-2"}>{children}</h2>
}

  

