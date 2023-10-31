// @ts-nocheck

import { render, screen, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import Home from "./page";



describe(Home, () => {

    it("renders gameState modal on load", () => {
        render(<Home />);
        expect(screen.queryAllByText("Select input mode")).not.toHaveLength(0);
    })


    it("displays plan mode fields in the side panel when plan is selected and next is clicked", async () => {
        render(<Home />);

        const radioLabel = screen.getByLabelText(/^Plan/i);
        expect(radioLabel).not.toBeNull();

        expect(radioLabel.checked).toBe(false);
        await userEvent.click(radioLabel.closest('label'));
        expect(radioLabel.checked).toBe(true);
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).not.toBeNull();
        await userEvent.click(nextButton);
        expect(screen.queryByText("Plan Game Status")).not.toBeNull();

        const gameStatusTitle = screen.queryByText("Game Status");
        const gameStatusSection = gameStatusTitle.closest('section');
        const planModeOnlyText = within(gameStatusSection).queryByText("Start Time");
        expect(planModeOnlyText).not.toBeNull();
    });


    it("displays active mode fields in the side panel when active is selected and next is clicked", async () => {
        render(<Home />);
        
        // Jest does not reset the DOM between tests
        // This test will open to the first "plan mode" page, so it's necessary to go back first
        const button = screen.getByRole('button', {  name: "change mode" });
        await userEvent.click(button);

        const radioInput = screen.getByLabelText(/^Active/i);
        expect(radioInput.checked).toBe(false);
        await userEvent.click(radioInput.closest('label'));
        expect(radioInput.checked).toBe(true);
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).not.toBeNull();
        await userEvent.click(nextButton);
        expect(screen.queryByText("Active Game Status")).not.toBeNull();

        const gameStatusTitle = screen.queryByText("Game Status");
        const gameStatusSection = gameStatusTitle.closest('section');
        const activeModeOnlyText = within(gameStatusSection).queryByText("Remaining");
        expect(activeModeOnlyText).not.toBeNull();
    });
})