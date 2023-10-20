import { theme } from '../utils/formatting';
import { T_ModalWithToggle, T_ViewToggle} from '../utils/types';

import { Button, COLOURS } from './forms/subcomponents/buttons';
import VisualToggle from './subcomponents/visualToggle';


interface I_StickyBar {
    saveLoadToggles : T_ModalWithToggle[],
    viewToggles : T_ViewToggle[]
}

export default function StickyBar({saveLoadToggles, viewToggles} 
    : I_StickyBar)
    : JSX.Element {    

    return  <div className={`${theme.mainAsBg} ${theme.mainAsBorder} border-b px-3 md:pr-0 pt-1 pb-2 w-full flex flex-col sticky top-0 relative z-40 md:[top:calc(4.5rem)] md:[grid-area:buttons]`}>
                <HeaderButtonsContainer viewToggles={viewToggles} saveLoadToggles={saveLoadToggles} />
            </div>
}


interface I_HeaderButtonsContainer extends Pick<I_StickyBar, "saveLoadToggles"> {
    viewToggles : T_ViewToggle[],
}
function HeaderButtonsContainer({viewToggles, saveLoadToggles} : I_HeaderButtonsContainer){
    return  <div className={"flex justify-between items-end"}>
                <div className={"flex gap-2"}>
                    {
                        viewToggles.map(ele => {
                            return <VisualToggle key={`rkVis_${ele.displayStr}`}
                                        onChange={ele.toggle}
                                        toggledOn={ele.value}
                                        displayText={ele.displayStr}
                                        idStr={`id_vis${ele.displayStr}`}
                                        name={`vis${ele.displayStr}`}
                                        value={`vis${ele.displayStr}`}
                                        />
                        })
                    }
                </div>
                <div className={"flex gap-2"}>
                    {
                        saveLoadToggles.map(ele => {
                            return  <Button key={ele.data.displayStr}
                                        size={'stickyBar'}
                                        colours={theme.secondaryOnToolbar as keyof typeof COLOURS}
                                        onClick={ ele.toggle }
                                        >
                                        {ele.data.displayStr}
                                    </Button>
                        })
                    }
                </div>
            </div>
}






