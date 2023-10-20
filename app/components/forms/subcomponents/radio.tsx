import { ReactNode } from "react";

interface I_Radio extends React.InputHTMLAttributes<HTMLInputElement>{
    extraCSS? : string,
    children : ReactNode,
}

export default function Radio({extraCSS, children, ...props} 
    : I_Radio)
    : JSX.Element {

    return  <label className={extraCSS}>
                <input 
                    type={"radio"} 
                    className={"sr-only"} 
                    {...props}
                />
                {children}
            </label>
}

