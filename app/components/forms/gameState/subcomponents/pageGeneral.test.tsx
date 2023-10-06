// @ts-nocheck

import { render, screen, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import InputGeneral from "./pageGeneral";
import { defaultGameState, startingTimeRemaining } from "@/app/utils/defaults";




describe(InputGeneral, () => {

    it("time remaining renders correctly", () => {
        render( <InputGeneral 
                    timeEntered={new Date()}
                    setStateOnChange={() => {}}
                    setTimeEntered={() => {}}
                    timeRemaining={startingTimeRemaining}
                    setTimeRemaining={() => {}}
                    gameState={defaultGameState}
                    handleLevelChange={() => {}}
                    hasAdBoost={false}
                    toggleAdBoost={() => {}}
                />);

        const timeRemLegend = screen.queryByText(/time remaining/i);
        expect(timeRemLegend).not.toBeNull();
        
        const timeRemFieldset = timeRemLegend.closest('fieldset');
        expect(timeRemFieldset).not.toBeNull();

        const dayInput = within(timeRemFieldset).getByLabelText(/d/i);
        expect(dayInput).not.toBeNull();
        expect(dayInput.value).toBe("3");

        const hourInput = within(timeRemFieldset).getByLabelText(/h/i);
        expect(hourInput).not.toBeNull();
        expect(hourInput.value).toBe("0");

        const minuteInput = within(timeRemFieldset).getByLabelText(/m/i);
        expect(minuteInput).not.toBeNull();
        expect(minuteInput.value).toBe("0");
    });

    it("changing an input fires setStateOnChange", async () => {
        const onChange = jest.fn();
        render( <InputGeneral 
                    timeEntered={new Date()}
                    setStateOnChange={() => {}}
                    setTimeEntered={() => {}}
                    timeRemaining={startingTimeRemaining}
                    setTimeRemaining={onChange}
                    gameState={defaultGameState}
                    handleLevelChange={() => {}}
                    hasAdBoost={false}
                    toggleAdBoost={() => {}}
                />);

        const timeRemLegend = screen.queryByText(/time remaining/i);
        const timeRemFieldset = timeRemLegend.closest('fieldset');
        const dayInput = within(timeRemFieldset).getByLabelText(/d/i);
        const hourInput = within(timeRemFieldset).getByLabelText(/h/i);
        const minuteInput = within(timeRemFieldset).getByLabelText(/m/i);

        await userEvent.type(dayInput, "{selectall}{backspace}2", {delay: 5});
        expect(onChange).toBeCalledTimes(2);
        await userEvent.type(hourInput, "23", {delay: 5});
        expect(onChange).toBeCalledTimes(4);
        await userEvent.type(minuteInput, "50", {delay: 5});
        expect(onChange).toBeCalledTimes(6);
    });
})