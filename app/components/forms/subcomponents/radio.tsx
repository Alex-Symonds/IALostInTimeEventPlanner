// interface I_Radio {
//     checked : boolean, 
//     extraCSS? : string, 
//     disabled : boolean, 
//     handleSelection: () => void, 
//     value : string, 
//     groupName : string,
//     children : React.ReactNode
// }

import { ReactNode } from "react";

// function OLDRadio({checked, extraCSS, disabled, handleSelection, value, groupName, children} 
//     : I_Radio)
//     : JSX.Element {

//     disabled = disabled ?? false;
    
//     return  <label className={extraCSS}>
//                 <input 
//                     type={"radio"} 
//                     className={"sr-only"} 
//                     value={value} 
//                     checked={checked} 
//                     disabled={disabled} 
//                     name={groupName}
//                     onChange={() => handleSelection()} 
//                     onClick={() => handleSelection()} 
//                 />
//                 {children}
//             </label>
// }


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

