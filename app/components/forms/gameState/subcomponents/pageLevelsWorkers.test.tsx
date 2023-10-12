// @ts-nocheck

import { render, screen, within } from "@testing-library/react";
import InputLevelsWorkers from "./pageLevelsWorkers";
import { defaultGameState, startingLevels } from "@/app/utils/defaults";
import { workerLevels } from "@/app/utils/testHelpers";
import userEvent from "@testing-library/user-event";

describe(InputLevelsWorkers, () => {

    test.each(Object.keys(workerLevels).map(ele => [ele]))(`renders select for %s`, (key) => {
        render( <InputLevelsWorkers 
            gameState={defaultGameState}
            levels={startingLevels}
            handleLevelChange={() => {}}
        />)

        expect(screen.queryAllByLabelText(new RegExp(key, "i"))).toHaveLength(1);
    })

    test.each(Object.keys(workerLevels).map(ele => [ele]))
    (`clicking select for %s calls handleChange`, async (key) => {
        const handleChange = jest.fn();
        render( <InputLevelsWorkers 
                    gameState={defaultGameState}
                    levels={startingLevels}
                    handleLevelChange={handleChange}
                />)

        const selectQuery = screen.queryAllByLabelText(new RegExp(key, "i"));
        const select = selectQuery[0];
        await userEvent.selectOptions(select, [within(select).getByText("1")]);
        expect(handleChange).toHaveBeenCalled();
    })

})