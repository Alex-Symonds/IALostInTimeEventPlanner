// @ts-nocheck

import { render, screen, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import Home from "./page";



describe(Home, () => {

    it("renders gameState modal on load", () => {
        render(<Home />);
        expect(screen.queryAllByText("Select input mode")).not.toHaveLength(0);
    })


    it("switches from mode picker to plan when plan is selected and next is clicked", async () => {
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


    it("switches from mode picker to active when active is selected and next is clicked", async () => {
        render(<Home />);

        const radioLabel = screen.getByLabelText(/^Active/i);
        expect(radioLabel).not.toBeNull();

        expect(radioLabel.checked).toBe(false);
        await userEvent.click(radioLabel.closest('label'));
        expect(radioLabel.checked).toBe(true);
        
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