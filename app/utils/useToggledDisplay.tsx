import { useState, useEffect, Dispatch, SetStateAction } from "react";

import { TAILWIND_MD_BREAKPOINT } from './consts';
import { T_ViewToggle } from "./types";


export default function useToggledDisplay(){
    const [showGameState, setShowGameState] = useState(window.innerWidth >= TAILWIND_MD_BREAKPOINT);
    const [showOfflinePeriods, setShowOfflinePeriods] = useState(window.innerWidth >= TAILWIND_MD_BREAKPOINT);
    
    useForcedVisibilityOnDesktop(
      showGameState, setShowGameState,
      showOfflinePeriods, setShowOfflinePeriods,
    )

    const displayInputToggles : T_ViewToggle[] = [
      { displayStr: "game", toggle: () => setShowGameState(prev => !prev), value: showGameState},
      { displayStr: "offline", toggle: () => setShowOfflinePeriods(prev => !prev), value: showOfflinePeriods},
    ]

    return {
        showGameState,
        showOfflinePeriods,
        displayInputToggles
    }
}


type T_VisibilitySetter = Dispatch<SetStateAction<boolean>>;
function useForcedVisibilityOnDesktop(showGame : boolean, setGame : T_VisibilitySetter, showOff : boolean, setOff : T_VisibilitySetter){
    const [isDesktopWidth, setIsDesktopWidth] = useState(calcIsDesktopWidth());
  
    function calcIsDesktopWidth(){
      return window.innerWidth >= TAILWIND_MD_BREAKPOINT;
    }
  
    function handleResize(){
      setIsDesktopWidth(calcIsDesktopWidth());
    }
  
    useEffect(() => {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);    
    }, []);
  
    useEffect(() => {
      if(isDesktopWidth && !showGame){
        setGame(true);
      }
      if(isDesktopWidth && !showOff){
        setOff(true);
      }
    }, [showGame, setGame, showOff, setOff, isDesktopWidth])

  }