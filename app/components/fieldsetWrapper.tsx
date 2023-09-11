interface I_FieldsetWrapper {
    children : React.ReactNode
}
export default function FieldsetWrapper({children}
    : I_FieldsetWrapper)
    : JSX.Element {


    return  <fieldset className={"relative rounded-sm max-w-full w-full pb-2 border border-violet-200 bg-violet-50 bg-opacity-40"}>
                { children }
            </fieldset>
}


