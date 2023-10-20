import { ReactNode } from "react";


export default function HeaderFooterContentWrapper({borderColour, padding, margins, children}
    : {borderColour? : string, padding : string, margins : string, children : ReactNode})
    : JSX.Element{

    borderColour = borderColour ?? "border-violet-500";
    return  <div className={`border-l-4 ${borderColour} ${padding} ${margins}`}>
                {children}
            </div>
}