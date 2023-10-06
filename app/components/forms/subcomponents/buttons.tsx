export interface I_Button {
    size : keyof typeof SIZES,
    colours : keyof typeof COLOURS,
    htmlType? : string,
    onClick? : () => void,
    disabled? : boolean,
    extraCSS? : string,
    toggledOn? : boolean,
    children: React.ReactNode,
}


export const COLOURS = {
    primary: {
        main: "text-white bg-violet-700 hover:bg-violet-600 border-violet-700",
        disabled: "text-gray-500 bg-gray-300",
        toggledOn: "text-white bg-violet-950 hover:bg-violet-800 border-violet-950"
    },
    primaryOnDark: {
        main: "text-violet-950 bg-violet-200 hover:bg-violet-300 border-violet-200",
        disabled: "text-gray-500 bg-gray-300",
        toggledOn: "text-violet-950 bg-violet-400 hover:bg-violet-300 hover:text-violet-950 border-violet-50"
    },
    secondary: {
        main: "border-2 text-violet-600 bg-transparent border-violet-600 hover:bg-violet-50",
        disabled: "border-2 text-gray-500 border-gray-300"
    },
    secondaryOnDark: {
        main: "border-2 text-violet-100 bg-transparent border-violet-100 hover:bg-violet-50 hover:bg-opacity-10",
        disabled: "border-2 text-gray-500 border-gray-300 md:opacity-70"
    },
    warning: {
        main: "border-2 text-violet-600 bg-white bg-opacity-50 border-violet-600 hover:bg-red-700 hover:border-red-700 hover:text-white",
        disabled: "border-2 text-gray-500 border-gray-300",
    },
    more: {
        main: "bg-violet-200      border-violet-200   text-white          hover:bg-violet-100     hover:text-violet-400",
        toggledOn: "bg-violet-300      border-violet-400   text-violet-600     hover:bg-violet-200     hover:text-violet-400",
    },
    moreOffline: {
        main: "bg-greyBlue-400    border-greyBlue-400 text-white          hover:bg-greyBlue-300   hover:text-greyBlue-100",
        toggledOn: "bg-greyBlue-600    border-greyBlue-800 text-white          hover:bg-greyBlue-300   hover:text-greyBlue-100",
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

    if(extraCSS !== undefined){
        css += " " + extraCSS;
    }
    
    return css;
}


function getValidType(htmlType : string | undefined) 
    : "submit" | "reset" | "button" | undefined {

    return htmlType === "submit" || htmlType === "reset" || htmlType === "button" || htmlType === undefined ?
            htmlType
            : "submit";
}



interface I_MoreButtonContainer {
    showMore : boolean,
    setShowMore : React.Dispatch<React.SetStateAction<boolean>>,
    modeKey : 'more' | 'moreOffline' | 'primary',
}
export function MoreButton({showMore, setShowMore, modeKey,} 
    : I_MoreButtonContainer)
    : JSX.Element {

    return  <RoundToggleButtonWrapper
                showMore={showMore}
                setShowMore={setShowMore}
                modeKey={modeKey}
                extraCSS={""}
                >
                <span aria-hidden={true}>...</span>
                <span className={"sr-only"}>more info</span>
            </RoundToggleButtonWrapper>
}


export function InfoButton({showMore, setShowMore, modeKey,} 
    : I_MoreButtonContainer)
    : JSX.Element {

    return <RoundToggleButtonWrapper
                showMore={showMore}
                setShowMore={setShowMore}
                modeKey={modeKey}
                extraCSS={"font-serif text-xl leading-none items-center"}
                >
                <span aria-hidden={true}>i</span>
                <span className={"sr-only"}>see stockpiles</span>
            </RoundToggleButtonWrapper>
}


function RoundToggleButtonWrapper({showMore, setShowMore, modeKey, extraCSS, children} 
    : I_MoreButtonContainer & { extraCSS : string, children : React.ReactNode })
    : JSX.Element {

    const onOffKey = showMore ? 'toggledOn' : 'main';

    modeKey = modeKey !== 'moreOffline' && modeKey !== 'primary' ?
                'more'
                : modeKey;

    let colourTheme = COLOURS[modeKey as keyof typeof COLOURS];
    if(!('main' in colourTheme) || !('toggledOn' in colourTheme)){
        colourTheme = COLOURS.more;
    }
    let CSS = colourTheme[onOffKey];

    return  <button className={"rounded-full border-2 flex justify-center w-7 h-7" + " " + CSS + " " + extraCSS} 
                onClick={() => setShowMore(prev => !prev)}
                type={'button'}
                >
                { children }
            </button>
}


