

export default function SideHeading({ extraCSS, children } : { extraCSS? : string, children : React.ReactNode }){
    extraCSS = extraCSS === undefined ? "" : " " + extraCSS;
    return  <th className={"font-medium px-1 bg-violet-200 text-black border border-violet-400" + extraCSS}>
                { children }
            </th>
}