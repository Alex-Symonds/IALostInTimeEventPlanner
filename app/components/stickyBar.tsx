import { T_ModalWithToggle, T_ViewToggle} from '../utils/types';

import { Button } from './forms/subcomponents/buttons';


interface I_StickyBar {
    saveLoadToggles : T_ModalWithToggle[],
    viewToggles : T_ViewToggle[]
}

export default function StickyBar({saveLoadToggles, viewToggles} 
    : I_StickyBar)
    : JSX.Element {    

    return  <div className={'bg-violet-900 px-3 py-2 w-full flex flex-col border-b border-violet-900 sticky top-0 relative z-40 md:[top:calc(4.5rem)] md:[grid-area:buttons]'}>
                <HeaderButtonsContainer viewToggles={viewToggles} saveLoadToggles={saveLoadToggles} />
            </div>
}


interface I_HeaderButtonsContainer extends Pick<I_StickyBar, "saveLoadToggles"> {
    viewToggles : T_ViewToggle[],
}
function HeaderButtonsContainer({viewToggles, saveLoadToggles} : I_HeaderButtonsContainer){
    return  <div className={"flex justify-between"}>
                <div className={"flex gap-2"}>
                    {
                        viewToggles.map(ele => {
                            return <Button key={ele.displayStr}
                                        size={'stickyBar'}
                                        colours={'primaryOnDark'}
                                        onClick={ele.toggle}
                                        toggledOn={ele.value}
                                        extraCSS={"md:hidden"}
                                        >
                                        {ele.displayStr}
                                    </Button>
                        })
                    }
                </div>
                <div className={"flex gap-2"}>
                    {
                        saveLoadToggles.map(ele => {
                            return  <Button key={ele.data.displayStr}
                                        size={'stickyBar'}
                                        colours={'secondaryOnDark'}
                                        onClick={ ele.toggle }
                                        >
                                        {ele.data.displayStr}
                                    </Button>
                        })
                    }
                </div>
            </div>
}






