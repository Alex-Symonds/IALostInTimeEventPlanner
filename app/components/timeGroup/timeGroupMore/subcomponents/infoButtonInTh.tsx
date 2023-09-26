import Tooltip from "@/app/components/subcomponents/tooltip"

export interface I_TooltipProps {
    isVisible : boolean,
    message : string,
    onClick : () => void,
    close: () => void,
}

export default function InfoButtonInHeader({tooltipProps} : { tooltipProps : I_TooltipProps }){
    return <>
            <button 
                onClick={ tooltipProps.onClick } 
                className={"rounded-full w-4 h-4 bg-violet-500 hover:opacity-80 text-white text-xs font-semibold font-serif leading-none flex items-center justify-center"}
                >
                i
            </button>
            { tooltipProps.isVisible ?
                <Tooltip close={ tooltipProps.close } posAndWidthCSS={"bottom-5 left-2 text-left w-64"}>
                    { tooltipProps.message }
                </Tooltip>
                : null
            }
            </>
}