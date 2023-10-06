/*
    Hook for production "interrupt".

    Note: only to be used at the start of the plan, before the first unbought upgrade.
    Switches anywhere else in the plan should useSwitchProductionFuture instead.

    ----

    Assumption: while users /could/ switch production at any time they please, it's unlikely that they'll
    have a burning desire to switch to producing, say, green at precisely 16:32. It'd make more sense for
    them to want to do it at one of these three times:
        1) When they've just purchased an upgrade and they'd benefit from different settings going forwards
        2) Now (e.g. it's mid-event, they just realised they're producing the wrong thing and they want to 
           see how badly that's messed up their performance and whether they can fix it)
        3) Once a particular quantity of eggs have been produced

    This hook is intended for case #2. We can't guarantee that users will adjust the initial production
    settings /immediately/ after they update their gameState, so altering the settings "now" means the 
    production time of the first upgrade will need to account for:
        > Stockpiles as entered in gameState
        > One period of production from gameState.timeEntered until "now", where the old production settings apply
        > One period of production from "now" onwards, where the new production settings apply

    This requires a different calculation to the standard "actions-based" production switches, but it
    will use the same UI component for requesting input, so as not to confuse the user with two different 
    means of switching production.
*/


import { MutableRefObject, useState } from 'react';

import { convertDateToTimeID } from '../../../utils/dateAndTimeHelpers';
import { maxLevels } from '../../../utils/defaults';
import { I_ProductionSwitcherModalUniversal, T_ProductionSettings, T_TimeGroup, T_GameState, T_Levels, T_ProductionSettingsNow } from '../../../utils/types';
import { exactMatch } from '../../../utils/productionSettingsHelpers';

interface I_UseSwitchProductionNow {
    initialProdSettings : T_ProductionSettings,
    gameState : T_GameState, 
    timeIDGroups : T_TimeGroup[],
    setProdSettingsNow : (data : T_ProductionSettingsNow | null) => void,
    prodSettingsBeforeNowRef : MutableRefObject<T_ProductionSettings | undefined>
}

export type T_PropsSwitchProdNowModal = 
    I_ProductionSwitcherModalUniversal & {
    initialProdSettings : T_ProductionSettings,
    levelsAtStart : T_Levels
}

type T_OutputUseSwitchProductionNow = {
    openModal : () => void,
    props : T_PropsSwitchProdNowModal,
}
export function useSwitchProductionNow({ initialProdSettings, setProdSettingsNow, gameState, timeIDGroups, prodSettingsBeforeNowRef }
    : I_UseSwitchProductionNow)
    : T_OutputUseSwitchProductionNow {

    const [isVisible, setIsVisible] = useState(false);

    function updateSettings(newSettings : T_ProductionSettings) 
        : void {

        if(prodSettingsBeforeNowRef.current !== undefined && exactMatch(newSettings, prodSettingsBeforeNowRef.current)){
            setProdSettingsNow(null);
            return;
        }
        setProdSettingsNow({
            productionSettings: newSettings,
            timeID: convertDateToTimeID(new Date(), gameState),
        })
    }

    let props : T_PropsSwitchProdNowModal = {
        isVisible: isVisible,
        closeModal: () => setIsVisible(false),
        initialProdSettings,
        updateProdSettings: updateSettings,
        levelsAtStart: timeIDGroups.length > 0 ? timeIDGroups[0].levelsAtEnd : maxLevels()
    }

    return {
        openModal: () => setIsVisible(true),
        props: props
    }
}