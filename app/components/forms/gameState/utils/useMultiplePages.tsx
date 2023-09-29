import { MutableRefObject, useState } from "react";

interface I_UseMultiPageGameStateForm {
    wantBackToModeSetter : MutableRefObject<boolean | undefined>,
    changeMode : () => void,
}

type T_OutputUseMultiPageGameStateForm = {
    activePage : number,
    maxPage : number,
    changePage: (targetPage : number) => void,
    wantDisableBack : (targetPage : number) => boolean,
}

export function useMultiPageGameStateForm({wantBackToModeSetter, changeMode}
    : I_UseMultiPageGameStateForm)
    : T_OutputUseMultiPageGameStateForm{

    const [activePage, setActivePage] = useState<number>(1);
    const MAX_PAGE_NUM = 4;

    function changePage(targetPage : number){
        if(targetPage === 0 && wantBackToModeSetter.current){
            changeMode();
        }
        else if(targetPage > 0 && targetPage <= MAX_PAGE_NUM){
            setActivePage(targetPage);
        }
    }

    function wantDisableBack(targetPage : number){
        return targetPage === 0 && !wantBackToModeSetter.current;
    }

    return {
        activePage,
        maxPage: MAX_PAGE_NUM,
        changePage,
        wantDisableBack,
    }
}