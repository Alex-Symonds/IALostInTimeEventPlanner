// @ts-nocheck

import { render, screen, within } from "@testing-library/react";
import InputLevelsOther from "./pageLevelsOther";
import { defaultGameState, startingLevels } from "@/app/utils/defaults";
import userEvent from "@testing-library/user-event";

describe(InputLevelsOther, () => {

    it("renders all expected elements", () => {
        render( <InputLevelsOther 
                    handleLevelChange={() => {}} 
                    gameState={defaultGameState} 
                    levels={startingLevels}
                />)

        const eggLevelsHeadingQuery = screen.queryAllByText("Egg Levels");
        expect(eggLevelsHeadingQuery).toHaveLength(1);
        const eggLevelsSection = eggLevelsHeadingQuery[0].parentElement;
        expect(eggLevelsSection).not.toBeNull();
        expect(within(eggLevelsSection).queryAllByLabelText("Blue")).toHaveLength(1);
        expect(within(eggLevelsSection).queryAllByLabelText("Green")).toHaveLength(1);
        expect(within(eggLevelsSection).queryAllByLabelText("Red")).toHaveLength(1);
        expect(within(eggLevelsSection).queryAllByLabelText("Yellow")).toHaveLength(1);

        const buffsLevelsHeadingQuery = screen.queryAllByText("Buff Levels");
        expect(buffsLevelsHeadingQuery).toHaveLength(1);
        const buffLevelsSection = buffsLevelsHeadingQuery[0].parentElement;
        expect(buffLevelsSection).not.toBeNull();
        expect(within(buffLevelsSection).queryAllByLabelText("Speed")).toHaveLength(1);
        expect(within(buffLevelsSection).queryAllByLabelText("Dust")).toHaveLength(1);
    })


    test.each([
        ["Egg Levels", "Blue", "1"],
        ["Egg Levels", "Green", "1"],
        ["Egg Levels", "Red", "1"],
        ["Egg Levels", "Yellow", "1"],
        ["Buff Levels", "Speed", "-5%"],
        ["Buff Levels", "Dust", "25%"],
    ])(`calls the onChange function onChange for %s: %s`, async (headingStr, labelStr, optionStr) => {
        const handleChange = jest.fn();
        render( <InputLevelsOther 
                    handleLevelChange={handleChange} 
                    gameState={defaultGameState} 
                    levels={startingLevels}
                />);
        const headingQuery = screen.queryAllByText(headingStr);
        const section = headingQuery[0].parentElement;
        const selectQuery = within(section).queryAllByLabelText(labelStr);
        const select = selectQuery[0];
        await userEvent.selectOptions(select, [within(select).getByText(optionStr)]);
        expect(handleChange).toBeCalled();
    })


})