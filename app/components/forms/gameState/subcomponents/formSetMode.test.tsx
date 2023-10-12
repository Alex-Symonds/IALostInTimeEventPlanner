//@ts-nocheck

import { render, screen } from "@testing-library/react";
import FormSetMode from "./formSetMode";
import { PlanMode } from "@/app/utils/usePlanMode";
import userEvent from "@testing-library/user-event";



function findPlanRadio(){
    return screen.getByLabelText(/^Plan/i);
}

function findActiveRadio(){
    return screen.getByLabelText(/^Active/i);
}

function findNextButton(){
    return screen.getByRole('button');
}




describe(FormSetMode, () => {

    it("renders content correctly", () => {
        render( <FormSetMode 
                    mode={null}
                    setMode={() => {}}
                    close={() => {}}
                />)

        expect(screen.queryAllByText("Select input mode")).not.toHaveLength(0);
        expect(findPlanRadio()).not.toBeNull();
        expect(findActiveRadio()).not.toBeNull();
        expect(findNextButton()).not.toBeNull();
    });

    it("initialises radio correctly when mode is null", () => {
        render( <FormSetMode 
                    mode={null}
                    setMode={() => {}}
                    close={() => {}}
                />)

        expect(findPlanRadio()).not.toBeChecked();
        expect(findActiveRadio()).not.toBeChecked();
    });

    it("initialises radio correctly when mode is Plan", () => {
        render( <FormSetMode 
                    mode={PlanMode.plan}
                    setMode={() => {}}
                    close={() => {}}
                />)

        expect(findPlanRadio()).toBeChecked();
        expect(findActiveRadio()).not.toBeChecked();
    });

    it("initialises radio correctly when mode is Active", () => {
        render( <FormSetMode 
                    mode={PlanMode.active}
                    setMode={() => {}}
                    close={() => {}}
                />)

        expect(findPlanRadio()).not.toBeChecked();
        expect(findActiveRadio()).toBeChecked();
    });

    it("deactivates button when there is no selection", () => {
        render( <FormSetMode 
                    mode={null}
                    setMode={() => {}}
                    close={() => {}}
                />)

        expect(findNextButton()).toBeDisabled();
    });

    it("activates button when Plan is selected", () => {
        render( <FormSetMode 
                    mode={PlanMode.plan}
                    setMode={() => {}}
                    close={() => {}}
                />)

        expect(findNextButton()).not.toBeDisabled();
    });

    it("activates button when Active is selected", () => {
        render( <FormSetMode 
                    mode={PlanMode.active}
                    setMode={() => {}}
                    close={() => {}}
                />)

        expect(findNextButton()).not.toBeDisabled();
    });

    
    it("calls setMode and close when radio changes and button is clicked", async () => {
        const setMode = jest.fn();
        const close = jest.fn();
        render( <FormSetMode 
                    mode={PlanMode.active}
                    setMode={setMode}
                    close={close}
                />)

        await userEvent.click(findPlanRadio());
        await userEvent.click(findNextButton());
        expect(setMode).toBeCalled();
        expect(close).toBeCalled();
    });


    it("calls close and not setMode when the radio hasn't changed and the button is clicked", async () => {
        const setMode = jest.fn();
        const close = jest.fn();
        render( <FormSetMode 
                    mode={PlanMode.active}
                    setMode={setMode}
                    close={close}
                />)

        await userEvent.click(findNextButton());
        expect(setMode).not.toBeCalled();
        expect(close).toBeCalled();
    });


    it("activates and deactives radio when options are clicked", async () => {
        render( <FormSetMode 
                    mode={null}
                    setMode={() => {}}
                    close={() => {}}
                />)
        
        let planRadio = findPlanRadio();
        let activeRadio = findActiveRadio();
        expect(findPlanRadio()).not.toBeChecked();
        expect(findActiveRadio()).not.toBeChecked();

        await userEvent.click(planRadio);
        expect(findPlanRadio()).toBeChecked();
        expect(findActiveRadio()).not.toBeChecked();

        await userEvent.click(activeRadio);
        expect(findPlanRadio()).not.toBeChecked();
        expect(findActiveRadio()).toBeChecked();
    });

    

});



