import { IconClose } from "./icons";
import { Button } from '../forms/subcomponents/buttons';

export interface I_Modal {
    closeModal : () => void, 
    children : React.ReactNode
}
export default function Modal({closeModal, children} 
    : I_Modal)
    :JSX.Element {

    return(
        <div className={"fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"}>
            <div className={"relative max-h-[calc(100vh-10rem)] overflow-y-auto overflow-x-hidden min-w-[17rem] flex flex-col items-center px-2 py-2 bg-neutral-50 rounded max-w-full m-1"}>
                <CloseButton close={closeModal} />
                <div className={"flex flex-col w-[280px] max-w-full px-3 pb-3 text-sm"}>
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
    return <button className={"absolute font-bold [&_svg]:fill-gray-500 [&_svg]:hover:fill-gray-400" + " " + extraCSS} onClick={close}>
                <IconClose size={'20'} />
                <span className={'sr-only'}>close</span>
            </button>
}


export function ModalHeading({tagName, children} 
    : { tagName? : keyof JSX.IntrinsicElements, children : React.ReactNode })
    : JSX.Element {

    const Tag = tagName !== undefined ?
                    tagName
                    :'h2' as keyof JSX.IntrinsicElements;

    return  <Tag className={"font-bold text-lg mt-2 pl-0.5 self-start w-full border-b border-violet-500"}>
                {children}
            </Tag>
}


export function ModalSubHeading({tagName, children} 
    : { tagName? : keyof JSX.IntrinsicElements, children : React.ReactNode })
    : JSX.Element {

    const Tag = tagName !== undefined ?
                tagName
                :'h3' as keyof JSX.IntrinsicElements;

    return  <Tag className={"pl-0.5 text-md font-medium text-black"}>
                {children}
            </Tag>
}


export function ModalLegend({children} 
    : { children : React.ReactNode })
    : JSX.Element {

    return  <legend className={"pl-0.5 font-semibold mb-4 text-base"}>
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


interface I_ModalMultiPageNav {
    activePage : number, 
    numPages : number, 
    changePage : (pageNum : number) => void,
    submitLabel? : string,
    wantDisableBack : (pageNum : number) => boolean
}
export function ModalMultiPageNav({activePage, numPages, changePage, submitLabel, wantDisableBack}
    : I_ModalMultiPageNav)
    : JSX.Element {

    return  <div aria-hidden={true} className={"flex flex-col justify-center gap-5"}>
                <NavButtonBox activePage={activePage} numPages={numPages} changePage={changePage} submitLabel={submitLabel} wantDisableBack={wantDisableBack}/>
                <ProgressStatus activePage={activePage} numPages={numPages} changePage={changePage} />
            </div>

}


function NavButtonBox({activePage, numPages, changePage, submitLabel, wantDisableBack}
    : I_ModalMultiPageNav)
    : JSX.Element {

    const isLastPage = activePage === numPages

    return  <div className={"flex justify-center"}>
                <div className={"flex justify-between w-full"}>
                    <Button
                        colours={'secondary'}
                        htmlType={'button'}
                        size={'twin'}
                        onClick={() => changePage(activePage - 1)}
                        disabled={wantDisableBack(activePage - 1)}
                        >
                        &laquo;&nbsp;back
                    </Button>
                    {
                        isLastPage ?
                            <Button
                                key={'submitBtn'}
                                colours={'primary'}
                                htmlType={'submit'}
                                size={'twin'}
                                onClick={undefined}
                                disabled={false}
                                extraCSS={"border-2"}
                            >
                                { submitLabel ?? "submit" }
                            </Button>
                        :
                            <Button
                                key={'nextBtn'}
                                colours={'primary'}
                                htmlType={'button'}
                                size={'twin'}
                                onClick={() => changePage(activePage + 1)}
                                disabled={isLastPage}
                                extraCSS={"border-2"}
                            >
                                next&nbsp;&raquo;
                            </Button>
                    }
                </div>
            </div>
}


function ProgressStatus({activePage, numPages, changePage}
    : Pick<I_ModalMultiPageNav, "activePage" | "numPages" | "changePage">)
    : JSX.Element {

    const range = (start : number, stop : number, step : number) =>
        Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

    return  <div aria-hidden={true} className={"w-full flex gap-4 justify-center"}>
                {
                    range(1, numPages, 1).map(ele => {
                        return <CircleButton key={`formProgBtn${ele}`} 
                                    isActive={activePage === ele} 
                                    handleClick={ () => changePage(ele) } 
                                />
                    })
                }
            </div>
}


function CircleButton({isActive, handleClick}
    : { isActive : boolean, handleClick : () => void })
    : JSX.Element {

    const selectionCSS = isActive ? 
            "bg-violet-500"
            :
            "bg-neutral-300 hover:bg-neutral-400";
    return <button type={'button'} className={"rounded-full w-3 h-3" + " " + selectionCSS} onClick={handleClick}></button>
}



