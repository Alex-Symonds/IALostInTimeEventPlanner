// @ts-nocheck

import { render, screen, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import InputGeneral from "./pageGeneral";
import { defaultGameState, startingTimeRemaining } from "@/app/utils/defaults";
import { useState } from "react";






describe(InputGeneral, () => {

    it("time remaining renders correctly", () => {
        render( <InputGeneral 
                    timestamp={new Date()}
                    setStateOnChange={() => {}}
                    updateTimestamp={() => {}}
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
                    timestamp={new Date()}
                    updateTimestamp={() => {}}
                    timeRemaining={startingTimeRemaining}
                    updateTimeRemaining={onChange}
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


    it("allows valid inputs for time remaining fieldset without showing error", async () => {
        const submitFn = jest.fn((data) => data);
        const Controlled = () => {
            const [timeRemaining, setTimeRemaining] = useState(startingTimeRemaining);

            function handleChange(dhm){
                setTimeRemaining(dhm);
                submitFn();
            }

            return <InputGeneral 
                        timestamp={new Date()}
                        updateTimestamp={() => {}}
                        timeRemaining={timeRemaining}
                        updateTimeRemaining={handleChange}
                        gameState={defaultGameState}
                        handleLevelChange={() => {}}
                        hasAdBoost={false}
                        toggleAdBoost={() => {}}
                    />
        }
        render( <Controlled />);

        const timeRemLegend = screen.queryByText(/time remaining/i);
        const timeRemFieldset = timeRemLegend?.closest('fieldset');
        const dayInput = within(timeRemFieldset).getByLabelText(/d/i);
        const hourInput = within(timeRemFieldset).getByLabelText(/h/i);
        const minuteInput = within(timeRemFieldset).getByLabelText(/m/i);

        await userEvent.type(dayInput, "{selectall}{backspace}2", {delay: 5});
        expect(findTimeRemainingErrorMessage()).toBeNull();

        await userEvent.type(hourInput, "23", {delay: 5});
        expect(findTimeRemainingErrorMessage()).toBeNull();

        await userEvent.type(minuteInput, "50", {delay: 5});
        expect(findTimeRemainingErrorMessage()).toBeNull();
    });
    
    
    it("corrects invalid inputs in the time remaining fieldset and shows/hides warning", async () => {
        const Controlled = () => {
            const [timeRemaining, setTimeRemaining] = useState(startingTimeRemaining);
            return <InputGeneral 
                        timestamp={new Date()}
                        updateTimestamp={() => {}}
                        timeRemaining={timeRemaining}
                        updateTimeRemaining={setTimeRemaining}
                        gameState={defaultGameState}
                        handleLevelChange={() => {}}
                        hasAdBoost={false}
                        toggleAdBoost={() => {}}
                    />
        }
        render( <Controlled />);

        const timeRemLegend = screen.queryByText(/time remaining/i);
        const timeRemFieldset = timeRemLegend?.closest('fieldset');
        const dayInput = within(timeRemFieldset).getByLabelText(/d/i);
        const hourInput = within(timeRemFieldset).getByLabelText(/h/i);
        const minuteInput = within(timeRemFieldset).getByLabelText(/m/i);

        await userEvent.type(dayInput, "{selectall}{backspace}7", {delay: 5});
        expect(dayInput.value).toBe("3");
        let errorMsg = findTimeRemainingErrorMessage();
        expect(errorMsg).not.toBeNull();

        await userEvent.type(dayInput, "{selectall}{backspace}2", {delay: 5});
        expect(dayInput.value).toBe("2");
        errorMsg = findTimeRemainingErrorMessage();
        expect(errorMsg).toBeNull();

        await userEvent.type(hourInput, "{selectall}{backspace}37", {delay: 5});
        expect(hourInput.value).toBe("23");
        errorMsg = findTimeRemainingErrorMessage();
        expect(errorMsg).not.toBeNull();

        await userEvent.type(hourInput, "{selectall}{backspace}{backspace}5", {delay: 5});
        expect(hourInput.value).toBe("5");
        errorMsg = findTimeRemainingErrorMessage();
        expect(errorMsg).toBeNull();

        await userEvent.type(minuteInput, "{selectall}{backspace}70", {delay: 5});
        expect(minuteInput.value).toBe("59");
        errorMsg = findTimeRemainingErrorMessage();
        expect(errorMsg).not.toBeNull();
        
        await userEvent.type(minuteInput, "{selectall}{backspace}{backspace}42", {delay: 5});
        expect(minuteInput.value).toBe("42");
        errorMsg = findTimeRemainingErrorMessage();
        expect(errorMsg).toBeNull();
    });


    it("has a time remaining fieldset which handles letters and negatives correctly", async () => {
        const Controlled = () => {
            const [timeRemaining, setTimeRemaining] = useState(startingTimeRemaining);
            return <InputGeneral 
                        timestamp={new Date()}
                        updateTimestamp={() => {}}
                        timeRemaining={timeRemaining}
                        updateTimeRemaining={setTimeRemaining}
                        gameState={defaultGameState}
                        handleLevelChange={() => {}}
                        hasAdBoost={false}
                        toggleAdBoost={() => {}}
                    />
        }
        render( <Controlled />);

        const timeRemLegend = screen.queryByText(/time remaining/i);
        const timeRemFieldset = timeRemLegend?.closest('fieldset');
        const dayInput = within(timeRemFieldset).getByLabelText(/d/i);
        const hourInput = within(timeRemFieldset).getByLabelText(/h/i);
        const minuteInput = within(timeRemFieldset).getByLabelText(/m/i);

        await userEvent.type(dayInput, "{selectall}{backspace}-", {delay: 5});
        expect(dayInput.value).toBe("0");
        expect(findTimeRemainingErrorMessage()).toBeNull();
        await userEvent.type(dayInput, "{selectall}{backspace}-2", {delay: 5});
        expect(dayInput.value).toBe("2");
        expect(findTimeRemainingErrorMessage()).toBeNull();
        await userEvent.type(dayInput, "{selectall}{backspace}-7", {delay: 5});
        expect(dayInput.value).toBe("3");
        expect(findTimeRemainingErrorMessage()).not.toBeNull();
        await userEvent.type(dayInput, "{selectall}{backspace}a", {delay: 5});
        expect(dayInput.value).toBe("0");
        expect(findTimeRemainingErrorMessage()).toBeNull();

        await userEvent.type(dayInput, "{selectall}{backspace}2", {delay: 5});
        await userEvent.type(hourInput, "{selectall}{backspace}-2", {delay: 5});
        expect(hourInput.value).toBe("2");
        expect(findTimeRemainingErrorMessage()).toBeNull();
        await userEvent.type(hourInput, "{selectall}{backspace}-77", {delay: 5});
        expect(hourInput.value).toBe("23");
        expect(findTimeRemainingErrorMessage()).not.toBeNull();
        await userEvent.type(hourInput, "{selectall}{backspace}a", {delay: 5});
        expect(hourInput.value).toBe("2");
        expect(findTimeRemainingErrorMessage()).toBeNull();

        await userEvent.type(minuteInput, "{selectall}{backspace}-2", {delay: 5});
        expect(minuteInput.value).toBe("2");
        expect(findTimeRemainingErrorMessage()).toBeNull();
        await userEvent.type(minuteInput, "{selectall}{backspace}-77", {delay: 5});
        expect(minuteInput.value).toBe("59");
        expect(findTimeRemainingErrorMessage()).not.toBeNull();
        await userEvent.type(minuteInput, "{selectall}{backspace}{backspace}a", {delay: 5});
        expect(minuteInput.value).toBe("0");
        expect(findTimeRemainingErrorMessage()).toBeNull();
    });


    it("corrects too many days", async () => {
        const Controlled = () => {
            const [timeRemaining, setTimeRemaining] = useState({
                days: 2,
                hours: 5,
                minutes: 42
            });
            return <InputGeneral 
                        timestamp={new Date()}
                        updateTimestamp={() => {}}
                        timeRemaining={timeRemaining}
                        updateTimeRemaining={setTimeRemaining}
                        gameState={defaultGameState}
                        handleLevelChange={() => {}}
                        hasAdBoost={false}
                        toggleAdBoost={() => {}}
                    />
        }
        render( <Controlled />);
    
        const timeRemLegend = screen.queryByText(/time remaining/i);
        const timeRemFieldset = timeRemLegend?.closest('fieldset');
        const dayInput = within(timeRemFieldset).getByLabelText(/d/i);
        const hourInput = within(timeRemFieldset).getByLabelText(/h/i);
    
        expect(dayInput.value).toBe("2");
        expect(hourInput.value).toBe("5");
        let errorMsg = findTimeRemainingErrorMessage();
        expect(errorMsg).toBeNull();
    
        await userEvent.type(dayInput, "{selectall}{backspace}{backspace}3", {delay: 15});
        expect(dayInput.value).toBe("3");
        expect(hourInput.value).toBe("0");
    });


})

function findTimeRemainingErrorMessage(){
    return screen.queryByTestId("timeRemainingInputErrorMessage");
}