import { useState, MutableRefObject } from "react";

export function useAtEndInfoTooltip(adBoost : MutableRefObject<boolean | undefined>){
  
    const [atEndTooltipIsVisible, setAtEndTooltipIsVisible] = useState(false);

    return {
        isVisible: atEndTooltipIsVisible,
        message: `Assuming ad boost remains ${adBoost.current ? "active" : "inactive"} and no further upgrades are purchased`,
        onClick: () => setAtEndTooltipIsVisible(prev => !prev),
        close: () => { setAtEndTooltipIsVisible(false) },
    }
}