

export default function SideHeading({ extraCSS, children } : { extraCSS? : string, children : React.ReactNode }){
    extraCSS = extraCSS === undefined ? "" : " " + extraCSS;
    return  <th className={"font-medium px-1 bg-neutral-100 text-black border border-neutral-300" + extraCSS}>
                { children }
            </th>
}