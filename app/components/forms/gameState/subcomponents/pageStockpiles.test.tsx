//@ts-nocheck

import { render, screen } from "@testing-library/react";
import InputStockpiles from "./pageStockpiles";
import { nonZeroStockpiles } from "@/app/utils/testHelpers";
import userEvent from "@testing-library/user-event";


describe(InputStockpiles, () => {

    it("renders all elements", () => {
        render( <InputStockpiles 
                    controlledStockpileValue={(key) => 99}
                    updateStockpiles={() => {}}
                />)

        expect(screen.queryByLabelText(/dust/i)).not.toBeNull();
        expect(screen.queryByLabelText(/blue/i)).not.toBeNull();
        expect(screen.queryByLabelText(/green/i)).not.toBeNull();
        expect(screen.queryByLabelText(/red/i)).not.toBeNull();
        expect(screen.queryByLabelText(/yellow/i)).not.toBeNull();
    })

    test.each(
        Object.keys(nonZeroStockpiles).map(ele => [ele])
    )(`changing %s calls handleChange`, async (key) => {
        const handleChange = jest.fn(e => {});
        render( <InputStockpiles 
                    controlledStockpileValue={(key) => 99}
                    updateStockpiles={handleChange}
                />)
        
        const input = screen.queryByLabelText(new RegExp(key, "i"));
        await userEvent.type(input, "{selectall}{backspace}42", {delay: 1});
        expect(handleChange).toBeCalled();
    });


})