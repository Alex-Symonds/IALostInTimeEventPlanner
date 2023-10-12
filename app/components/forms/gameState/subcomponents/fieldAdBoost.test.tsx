//@ts-nocheck

import { render, screen } from "@testing-library/react";
import AdBoost from "./fieldAdBoost";
import { useState } from "react";
import userEvent from "@testing-library/user-event";


describe(AdBoost, () => {

    it("renders checkbox", () => {
        render( <AdBoost 
                    hasAdBoost={true}
                    toggleAdBoost={() => {}}
                />)

        const adBoostQuery = screen.getAllByLabelText("Ad Boost");
        expect(adBoostQuery).not.toHaveLength(0)
    });

    it("initialises correctly when true", () => {
        render( <AdBoost 
                    hasAdBoost={true}
                    toggleAdBoost={() => {}}
                />)
        
        const adBoostQuery = screen.getAllByLabelText("Ad Boost");
        expect(adBoostQuery[0]).toBeChecked();
    });

    it("initialises correctly when false", () => {
        render( <AdBoost 
                    hasAdBoost={false}
                    toggleAdBoost={() => {}}
                />)
        
        const adBoostQuery = screen.getAllByLabelText("Ad Boost");
        expect(adBoostQuery[0]).not.toBeChecked();
    });


    it("changes when clicked", async () => {
        const Controlled = () => {
            const [isChecked, setIsChecked] = useState(false);
            return  <AdBoost 
                        hasAdBoost={isChecked}
                        toggleAdBoost={() => { setIsChecked(prev => !prev) }}
                    />
        }
        render( <Controlled />);

        const adBoostQuery = screen.getAllByLabelText("Ad Boost");
        expect(adBoostQuery[0]).not.toBeChecked();
        await userEvent.click(adBoostQuery[0]);
        expect(adBoostQuery[0]).toBeChecked();
    });



})