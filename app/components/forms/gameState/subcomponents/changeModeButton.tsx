export interface I_ChangeModeButton {
    changeMode: () => void
}

export default function ChangeModeButton({ changeMode } 
    : I_ChangeModeButton) 
    : JSX.Element {

    return  <button
                type={"button"}
                onClick={changeMode}
                className={"absolute [top:calc(2.75rem+1px)] right-5 text-xs hover:bg-violet-100 w-max px-1 pb-0.5 text-violet-500 rounded-b"}
                >
                change mode
            </button>
}