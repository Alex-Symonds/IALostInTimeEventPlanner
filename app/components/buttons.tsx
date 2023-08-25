interface I_Button{
    size : keyof typeof SIZES,
    colours : keyof typeof COLOURS,
    htmlType? : string,
    onClick? : () => void,
    disabled? : boolean,
    extraCSS? : string,
    toggledOn? : boolean,
    children: React.ReactNode,
}

const COLOURS = {
    primary: {
        main: "text-white bg-violet-700 hover:bg-violet-600",
        disabled: "text-gray-500 bg-gray-300",
        toggledOn: "text-white bg-violet-950 hover:bg-violet-800"
    },
    secondary: {
        main: "border-2 text-violet-600 bg-transparent border-violet-600 hover:bg-violet-50",
        disabled: "border-2 text-gray-500 border-gray-300"
    },
    warning: {
        main: "border-2 text-violet-600 bg-white bg-opacity-50 border-violet-600 hover:bg-red-700 hover:border-red-700 hover:text-white",
        disabled: "border-2 text-gray-500 border-gray-300",
    },
}

const SIZES = {
    default: "w-24 h-8",
    inline: "text-xs px-2 py-0.5",
    stickyBar: "text-sm px-3 py-1",
    twin: "text-sm w-2/5 py-1",
    planner: "text-sm w-20 h-7",
    full: "text-base w-full py-2",
    pos: "px-0.25 py-0.75",
}

export function Button({size, colours, htmlType, extraCSS, onClick, disabled, toggledOn, children} 
    : I_Button)
    : JSX.Element {

    return  <button
                className={ "rounded" + " " + getCSS({size, colours, disabled, toggledOn, extraCSS}) }
                type={ getValidType(htmlType) }
                onClick={ onClick }
                disabled={ disabled }
                >
                { children }
            </button>
}


function getCSS({size, colours, disabled, toggledOn, extraCSS}
    : Pick<I_Button, "size" | "colours" | "disabled" | "toggledOn" | "extraCSS">)
    : string {

    let css: string = size in SIZES ? SIZES[size] : SIZES.default;

    let colourData = colours in COLOURS ? COLOURS[colours] : COLOURS.primary;
    if(colourData !== null){
        if(disabled && 'disabled' in colourData){
            css += " " + colourData.disabled;
        }
        else if(toggledOn && 'toggledOn' in colourData){
            css += " " + colourData.toggledOn;
        }
        else{
            css += " " + colourData.main;
        }
    }

    css += " " + extraCSS ?? '';

    return css;
}


function getValidType(htmlType : string | undefined) 
    : "submit" | "reset" | "button" | undefined {

    return htmlType === "submit" || htmlType === "reset" || htmlType === "button" || htmlType === undefined ?
            htmlType
            : "submit";
}




