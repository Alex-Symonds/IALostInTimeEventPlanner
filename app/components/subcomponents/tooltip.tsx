import { ReactNode } from 'react';

export default function Tooltip({close, posAndWidthCSS, children} : { close : () => void, posAndWidthCSS? : string, children : ReactNode }){

    posAndWidthCSS = posAndWidthCSS ?? "top-0.5 right-8 z-30 w-11/12";

    return  <button 
                className={'absolute border-2 border-neutral-300 bg-neutral-50 text-neutral-900 shadow-lg rounded-md [max-width:90vw] py-2 px-3' + ' ' + posAndWidthCSS}
                onClick={close}
                type={'button'}
                >
                { children }
            </button>
}