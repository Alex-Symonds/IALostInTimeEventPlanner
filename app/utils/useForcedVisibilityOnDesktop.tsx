/*
  Hook to force the visibility of toggleable sections to "visible" on desktop,
  making them toggleable only on mobile.
*/

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { TAILWIND_MD_BREAKPOINT } from './consts';


type T_VisibilitySetter = Dispatch<SetStateAction<boolean>>;

export default function useForcedVisibilityOnDesktop(showGame : boolean, setGame : T_VisibilitySetter, showOff : boolean, setOff : T_VisibilitySetter){
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


