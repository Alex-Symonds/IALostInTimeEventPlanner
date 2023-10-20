import { IconClose } from "./icons";
import { Button } from '../forms/subcomponents/buttons';
import { theme } from "@/app/utils/formatting";
import HeaderFooterContentWrapper from "../planner/subcomponents/sideBorderWrapper";

export interface I_Modal {
    heading: string,
    closeModal : () => void, 
    children : React.ReactNode
}
export default function Modal({heading, closeModal, children} 
    : I_Modal)
    :JSX.Element {

    return(
        <div className={"fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"}>
            <div className={"relative max-h-[calc(100vh-10rem)] overflow-y-auto overflow-x-hidden min-w-[17rem] flex flex-col items-center bg-neutral-50 rounded max-w-full m-1"}>
                <h2 className={`relative w-full bg-neutral-300 font-bold text-black px-2 py-2`}>
                    <HeaderFooterContentWrapper
                        borderColour={"border-neutral-400"}
                        padding={"pl-2"}
                        margins={"ml-1"}
                        >
                        {heading}
                        </HeaderFooterContentWrapper>
                    <CloseButton close={closeModal} />
                </h2>
                <div className={"flex flex-col w-[280px] max-w-full px-4 pb-4 text-sm"}>
                    {children}
                </div>
            </div>
        </div>
    )
}


interface I_CloseButton {
    close : () => void, 
    extraCSS? : string
};
function CloseButton({close, extraCSS} 
    : I_CloseButton)
    : JSX.Element {

    extraCSS = extraCSS ?? "top-2 right-2";
    return <button className={"absolute font-bold [&_svg]:fill-neutral-500 [&_svg]:hover:fill-neutral-400" + " " + extraCSS} onClick={close}>
                <IconClose size={'20'} />
                <span className={'sr-only'}>close</span>
            </button>
}


export function ModalLegend({children} 
    : { children : React.ReactNode })
    : JSX.Element {

    return  <legend className={"pl-2 font-semibold mb-4 text-base"}>
                {children}
            </legend>
}       


export function ModalFieldsWrapper({children}
    : { children : React.ReactNode })
    : JSX.Element {

    return  <div className={"pt-6 pb-10"}>
                {children}
            </div>
}


export function ModalSubmitButton({label, extraCSS, disabled} 
    : { label? : string, extraCSS? : string, disabled? : boolean })
    : JSX.Element {

    return <Button 
                extraCSS={extraCSS} 
                colours={"primary"}
                size={"default"}
                disabled={disabled}
                >
                { label ?? "submit" }
            </Button>
}









