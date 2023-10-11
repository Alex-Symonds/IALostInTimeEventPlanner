// @ts-nocheck

import { render, screen, within } from "@testing-library/react";
import FormPlanMode from "./formPlanMode";
import { defaultGameState } from "@/app/utils/defaults";
import userEvent from "@testing-library/user-event";


describe(FormPlanMode, () => {

    it("initialises inputs to correct values", () => {
        const startedAt = new Date('1995-12-17T03:24:00');
        render(
            <FormPlanMode 
                gameState={{
                    ...defaultGameState,
                    startTime: startedAt
                }}          
                setGameState={() => {}}        
                closeModal={() => {}}
                isInitialisingMode={true}
        />)

        const allEggsSelect = screen.queryByLabelText(/all eggs/i);
        expect(allEggsSelect).not.toBeNull();
        expect(allEggsSelect.value).toBe("all_0");

        const adBoostCheckbox = screen.queryByLabelText(/ad boost/i);
        expect(adBoostCheckbox).not.toBeNull();
        expect(adBoostCheckbox).not.toBeChecked();

        const startedLegend = screen.queryByText("Starting At");
        expect(startedLegend).not.toBeNull();
        const startedFieldset = startedLegend.closest('fieldset');
        expect(startedFieldset).not.toBeNull();

        const hourInput = within(startedFieldset).queryByLabelText(/time: hour/i);
        expect(hourInput).not.toBeNull();
        expect(hourInput.value).toBe("3");

        const minuteInput = within(startedFieldset).queryByLabelText(/time: minute/i);
        expect(minuteInput).not.toBeNull();
        expect(minuteInput.value).toBe("24");
    });

    it("calls form submit when submit button is clicked", async () => {
        const submitFn = jest.fn();
        render(
            <FormPlanMode 
                gameState={defaultGameState}          
                setGameState={submitFn}        
                closeModal={() => {}}
                isInitialisingMode={true}
        />)

        const submitButton = screen.getByRole('button', {name: /submit/i});
        await userEvent.click(submitButton);
        expect(submitFn).toBeCalled();
    })

})