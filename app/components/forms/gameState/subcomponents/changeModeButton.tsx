export interface I_ChangeModeButton {
    changeMode: () => void
}

export default function ChangeModeButton({ changeMode } 
    : I_ChangeModeButton) 
    : JSX.Element {

    return  <button
                type={"button"}
                onClick={changeMode}
                className={"absolute [top:calc(2.5rem+1px)] right-1 w-max px-1 pb-0.5 text-xs hover:bg-violet-100 text-violet-500 rounded-b"}
                >
                change mode
            </button>
}
