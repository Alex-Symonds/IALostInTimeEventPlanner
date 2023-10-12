//@ts-nocheck

import { render, screen } from "@testing-library/react";
import AllEggs from "./fieldAllEggs";
import { defaultGameState } from "@/app/utils/defaults";
import { useState } from "react";
import { calcLevelKeyValue } from "../utils/levelSelectHelpers";
import { checkSelect } from "@/app/utils/testHelpers";


describe(AllEggs, () => {

    it("initialises to correct option", () => {
        const NUM_ALL_EGGS = 3;
        render( <AllEggs 
                    gameState={{
                        ...defaultGameState,
                        premiumInfo: {
                            ...defaultGameState.premiumInfo,
                            allEggs: NUM_ALL_EGGS
                        }
                    }}
                />)
        
        const allEggsSelect = screen.queryByLabelText("All Eggs");
        expect(allEggsSelect).not.toBeNull();
        expect(allEggsSelect.value).toBe(`all_${NUM_ALL_EGGS}`);
    });


    it("updates when changed", async () => {
        const Controlled = () => {
            const [allEggs, setAllEggs] = useState<number>(1);

            function handleLevelChange(e){
                const {value} = calcLevelKeyValue(e);
                setAllEggs(value);
            }

            return  <AllEggs 
                        gameState={{
                            ...defaultGameState,
                            premiumInfo: {
                                ...defaultGameState.premiumInfo,
                                allEggs: allEggs
                            }
                        }}
                        handleLevelChange={(e) => handleLevelChange(e)}
                    />
        };
        render(<Controlled />)

        const allEggsSelect = screen.queryByLabelText("All Eggs");
        expect(allEggsSelect.value).toBe("all_1");
        await checkSelect(allEggsSelect, "2", "all_2");
        await checkSelect(allEggsSelect, "5", "all_5");

    })



})