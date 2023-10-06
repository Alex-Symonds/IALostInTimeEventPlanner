// @ts-nocheck


import { render, screen, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import FormActiveMode from "./formActiveMode";
import { defaultGameState } from "@/app/utils/defaults";


async function userSubmitsForm(){
    const progressButton = screen.queryByText(/page 4/i);
    await userEvent.click(progressButton);

    const submitBtn = findVisualSubmitButton();
    await userEvent.click(submitBtn);
}

async function checkSelect(selectEle, optionText, optionId){
    await userEvent.selectOptions(selectEle, [within(selectEle).getByText(optionText)]);
    expect(selectEle.value).toBe(optionId);
}




function findGeneralSection(){
    const labelInGeneralSection = screen.queryAllByText("Time Remaining");
    const targetSection = labelInGeneralSection[0].closest('section');
    return targetSection;
}

function findStockpilesSection(){
    const stockpilesHeading = screen.queryAllByText("Current Stockpiles");
    const targetSection = stockpilesHeading[0].closest('section');
    return targetSection;
}

function findWorkerLevelsSection(){
    const stockpilesHeading = screen.queryAllByText("Worker Levels");
    const targetSection = stockpilesHeading[0].closest('section');
    return targetSection;
}

function findOtherLevelsSection(){
    const stockpilesHeading = screen.queryAllByText("Egg Levels");
    const subsection = stockpilesHeading[0].closest('section');
    const aboveTheSubsection = subsection?.parentElement;
    const targetSection = aboveTheSubsection?.closest('section');
    return targetSection;
}

function findCommonElements(){
    return {
        generalSection: findGeneralSection(),
        stockPilesSection: findStockpilesSection(),
        workerLevelsSection: findWorkerLevelsSection(),
        otherLevelsSection: findOtherLevelsSection(),
        nextButton: findNextButton(),
        backButton: findBackButton(),
        accessibleSubmitButton: findAccessibleSubmitButton(),
    }
}


function findNextButton(){
    const nextBtnQuery = screen.queryAllByText("next »");
    return nextBtnQuery.length === 1 ? nextBtnQuery[0] : null;
}

function findBackButton(){
    const backBtnQuery = screen.queryAllByText("« back");
    return backBtnQuery.length === 1 ? backBtnQuery[0] : null;
}

function findVisualSubmitButton(){
    const visSubmitQuery = screen.queryAllByText("enter");
    return visSubmitQuery.length === 1 ? visSubmitQuery[0] : null;
}


function findAccessibleSubmitButton(){
    const submitBtnQuery = screen.queryAllByText("submit");
    return submitBtnQuery.length === 1 ? submitBtnQuery[0] : null;
}


describe(FormActiveMode, () => {

    it("renders all content", () => {
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={(data : any) => {}}
            changeMode={() => {}}
            wantBackToMode={false} 
            closeModal={() => {}}
        />);

        const {
            generalSection,
            stockPilesSection,
            workerLevelsSection,
            otherLevelsSection,
            nextButton,
            backButton,
            accessibleSubmitButton,
        } = findCommonElements();

        expect(generalSection).not.toBeNull();
        expect(stockPilesSection).not.toBeNull();
        expect(workerLevelsSection).not.toBeNull();
        expect(otherLevelsSection).not.toBeNull();
        expect(nextButton).not.toBeNull();
        expect(backButton).not.toBeNull();

        expect(accessibleSubmitButton).not.toBeNull();
        expect(accessibleSubmitButton?.classList.contains("sr-only")).toBe(true);
    })

    it("visually displays only general page when opened", () => {
        render( <FormActiveMode 
                    gameState={defaultGameState} 
                    setGameState={(data : any) => {}}
                    changeMode={() => {}}
                    wantBackToMode={false} 
                    closeModal={() => {}}
                />);

        const {
            generalSection,
            stockPilesSection,
            workerLevelsSection,
            otherLevelsSection,
        } = findCommonElements();

        expect(generalSection).not.toHaveClass("sr-only");
        expect(stockPilesSection).toHaveClass("sr-only");
        expect(workerLevelsSection).toHaveClass("sr-only");
        expect(otherLevelsSection).toHaveClass("sr-only");
    });

    it("visually displays only stockpiles page when next is clicked once", async () => {
        render( <FormActiveMode 
                    gameState={defaultGameState} 
                    setGameState={(data : any) => {}}
                    changeMode={() => {}}
                    wantBackToMode={false} 
                    closeModal={() => {}}
                />);

        const {
            generalSection,
            stockPilesSection,
            workerLevelsSection,
            otherLevelsSection,
            nextButton,
        } = findCommonElements();

        expect(nextButton).not.toBeNull();
        await userEvent.click(nextButton);

        expect(generalSection).toHaveClass("sr-only");
        expect(stockPilesSection).not.toHaveClass("sr-only");
        expect(workerLevelsSection).toHaveClass("sr-only");
        expect(otherLevelsSection).toHaveClass("sr-only");
    });


    it("visually displays only worker levels page when next is clicked twice", async () => {
        render( <FormActiveMode 
                    gameState={defaultGameState} 
                    setGameState={(data : any) => {}}
                    changeMode={() => {}}
                    wantBackToMode={false} 
                    closeModal={() => {}}
                />);


        const {
            generalSection,
            stockPilesSection,
            workerLevelsSection,
            otherLevelsSection,
            nextButton,
        } = findCommonElements();

        expect(nextButton).not.toBeNull();
        await userEvent.click(nextButton);
        await userEvent.click(nextButton);

        expect(generalSection).toHaveClass("sr-only");
        expect(stockPilesSection).toHaveClass("sr-only");
        expect(workerLevelsSection).not.toHaveClass("sr-only");
        expect(otherLevelsSection).toHaveClass("sr-only");
    });

    it("visually displays only other levels page when next is clicked thrice", async () => {
        render( <FormActiveMode 
                    gameState={defaultGameState} 
                    setGameState={(data : any) => {}}
                    changeMode={() => {}}
                    wantBackToMode={false} 
                    closeModal={() => {}}
                />);


        const {
            generalSection,
            stockPilesSection,
            workerLevelsSection,
            otherLevelsSection,
            nextButton,
        } = findCommonElements();

        expect(nextButton).not.toBeNull();
        await userEvent.click(nextButton);
        await userEvent.click(nextButton);
        await userEvent.click(nextButton);

        expect(generalSection).toHaveClass("sr-only");
        expect(stockPilesSection).toHaveClass("sr-only");
        expect(workerLevelsSection).toHaveClass("sr-only");
        expect(otherLevelsSection).not.toHaveClass("sr-only");
    });


    it("visually displays only general page when: next is clicked once and then back is clicked once", async () => {
        render( <FormActiveMode 
                    gameState={defaultGameState} 
                    setGameState={(data : any) => {}}
                    changeMode={() => {}}
                    wantBackToMode={false} 
                    closeModal={() => {}}
                />);

        const {
            generalSection,
            stockPilesSection,
            workerLevelsSection,
            otherLevelsSection,
            nextButton,
            backButton
        } = findCommonElements();

        expect(nextButton).not.toBeNull();
        expect(backButton).not.toBeNull();
        await userEvent.click(nextButton);
        await userEvent.click(backButton);

        expect(generalSection).not.toHaveClass("sr-only");
        expect(stockPilesSection).toHaveClass("sr-only");
        expect(workerLevelsSection).toHaveClass("sr-only");
        expect(otherLevelsSection).toHaveClass("sr-only");
    });


    it("disables back button", () => {
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={(data : any) => {}}
            changeMode={() => {}}
            wantBackToMode={false} 
            closeModal={() => {}}
        />);

        const {
            backButton
        } = findCommonElements();

        expect(backButton).not.toBeNull();
        expect(backButton).toBeDisabled();
    })

    it("enables back button", () => {
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={(data : any) => {}}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const {
            backButton
        } = findCommonElements();

        expect(backButton).not.toBeDisabled();
    })


    it("clicking any progress button skips to correct page", async () => {
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={() => {}}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const {
            generalSection,
            stockPilesSection,
            workerLevelsSection,
            otherLevelsSection,
        } = findCommonElements();

        const progressButtons = screen.queryAllByText(/page \d/i);
        expect(progressButtons).toHaveLength(4);

        await userEvent.click(progressButtons[3]);
        expect(generalSection).toHaveClass("sr-only");
        expect(stockPilesSection).toHaveClass("sr-only");
        expect(workerLevelsSection).toHaveClass("sr-only");
        expect(otherLevelsSection).not.toHaveClass("sr-only");

        await userEvent.click(progressButtons[0]);
        expect(generalSection).not.toHaveClass("sr-only");
        expect(stockPilesSection).toHaveClass("sr-only");
        expect(workerLevelsSection).toHaveClass("sr-only");
        expect(otherLevelsSection).toHaveClass("sr-only");

        await userEvent.click(progressButtons[2]);
        expect(generalSection).toHaveClass("sr-only");
        expect(stockPilesSection).toHaveClass("sr-only");
        expect(workerLevelsSection).not.toHaveClass("sr-only");
        expect(otherLevelsSection).toHaveClass("sr-only");

        await userEvent.click(progressButtons[1]);
        expect(generalSection).toHaveClass("sr-only");
        expect(stockPilesSection).not.toHaveClass("sr-only");
        expect(workerLevelsSection).toHaveClass("sr-only");
        expect(otherLevelsSection).toHaveClass("sr-only");
    });



    it("shows enter button instead of next button on last page", async () => {
        
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={() => {}}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const nextButton = findNextButton();
        expect(nextButton).not.toBeNull();

        const progressButton = screen.queryByText(/page 4/i);
        expect(progressButton).not.toBeNull();
        await userEvent.click(progressButton);

        const submitBtn = findVisualSubmitButton();
        expect(submitBtn).not.toBeNull();

        const nextButtonOnLastPage = findNextButton();
        expect(nextButtonOnLastPage).toBeNull();

    });


    it("clicking visual submit button submits form", async () => {
        const submitFn = jest.fn();
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const progressButton = screen.queryByText(/page 4/i);
        expect(progressButton).not.toBeNull();
        await userEvent.click(progressButton);
        const submitBtn = findVisualSubmitButton();
        expect(submitBtn).not.toBeNull();
        await userEvent.click(submitBtn);
        expect(submitFn).toHaveBeenCalled();
    });


    it("clicking accessible submit button submits form", async () => {
        const submitFn = jest.fn();
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const submitBtn = findAccessibleSubmitButton();
        expect(submitBtn).not.toBeNull();
        await userEvent.click(submitBtn);
        expect(submitFn).toHaveBeenCalled();
    });
})


describe("time remaining fieldset", () => {

    it("allows and submits valid inputs", async () => {
        const submitFn = jest.fn((data) => data);
        render( <FormActiveMode 
                    gameState={defaultGameState} 
                    setGameState={submitFn}
                    changeMode={() => {}}
                    wantBackToMode={true} 
                    closeModal={() => {}}
                />);

        const timeRemLegend = screen.queryByText(/time remaining/i);
        const timeRemFieldset = timeRemLegend?.closest('fieldset');
        const dayInput = within(timeRemFieldset).getByLabelText(/d/i);
        const hourInput = within(timeRemFieldset).getByLabelText(/h/i);
        const minuteInput = within(timeRemFieldset).getByLabelText(/m/i);

        await userEvent.type(dayInput, "{selectall}{backspace}2", {delay: 5});
        await userEvent.type(hourInput, "23", {delay: 5});
        await userEvent.type(minuteInput, "50", {delay: 5});

        await userSubmitsForm();

        const expectedTimeRemainingNumber = 2 * 24 * 60 + 23 * 60 + 50;
        expect(submitFn.mock.results[0].value.timeRemaining).toBe(expectedTimeRemainingNumber);
    });


    it("corrects invalid inputs and shows/hides warning", async () => {
        render( <FormActiveMode 
                gameState={defaultGameState} 
                setGameState={() => {}}
                changeMode={() => {}}
                wantBackToMode={true} 
                closeModal={() => {}}
            />);

        const timeRemLegend = screen.queryByText(/time remaining/i);
        const timeRemFieldset = timeRemLegend?.closest('fieldset');
        const dayInput = within(timeRemFieldset).getByLabelText(/d/i);
        const hourInput = within(timeRemFieldset).getByLabelText(/h/i);
        const minuteInput = within(timeRemFieldset).getByLabelText(/m/i);

        await userEvent.type(dayInput, "{selectall}{backspace}7", {delay: 5});
        expect(dayInput.value).toBe("3");
        let errorMsg = screen.getByTestId("timeRemainingInputErrorMessage");
        expect(errorMsg).not.toBeNull();

        await userEvent.type(dayInput, "{selectall}{backspace}2", {delay: 5});
        errorMsg = screen.queryByTestId("timeRemainingInputErrorMessage");
        expect(errorMsg).toBeNull();

        await userEvent.type(hourInput, "{selectall}{backspace}37", {delay: 5});
        expect(hourInput.value).toBe("23");
        errorMsg = screen.getByTestId("timeRemainingInputErrorMessage");
        expect(errorMsg).not.toBeNull();

        await userEvent.type(hourInput, "{selectall}{backspace}{backspace}5", {delay: 5});
        expect(hourInput.value).toBe("5");
        errorMsg = screen.queryByTestId("timeRemainingInputErrorMessage");
        expect(errorMsg).toBeNull();

        await userEvent.type(minuteInput, "{selectall}{backspace}70", {delay: 5});
        expect(minuteInput.value).toBe("59");
        errorMsg = screen.getByTestId("timeRemainingInputErrorMessage");
        expect(errorMsg).not.toBeNull();
        
        await userEvent.type(minuteInput, "{selectall}{backspace}{backspace}42", {delay: 5});
        expect(minuteInput.value).toBe("42");
        errorMsg = screen.queryByTestId("timeRemainingInputErrorMessage");
        expect(errorMsg).toBeNull();

        await userEvent.type(dayInput, "{selectall}{backspace}3", {delay: 5});
        expect(dayInput.value).toBe("3");
        expect(minuteInput.value).toBe("0");
        expect(minuteInput.value).toBe("0");
        errorMsg = screen.getByTestId("timeRemainingInputErrorMessage");
        expect(errorMsg).not.toBeNull();
    });
});


describe("form function", () => {

    it("has a functional all eggs select", async () => {
        const submitFn = jest.fn((data) => data);
        render( <FormActiveMode 
            gameState={ {
                ...defaultGameState,
                premiumInfo: {
                    ...defaultGameState.premiumInfo,
                    allEggs: 0
                }
            }} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const allEggsSelect = screen.queryByLabelText(/all eggs/i);
        expect(allEggsSelect).not.toBeNull();
        await checkSelect(allEggsSelect, "2", "all_2");

        await userSubmitsForm();

        expect(submitFn.mock.results[0].value.premiumInfo.allEggs).toBe(2);
    });

    it("has a functional ad boost checkbox", async () => {
        const submitFn = jest.fn((data) => data);
        render( <FormActiveMode 
            gameState={ {
                ...defaultGameState,
                premiumInfo: {
                    ...defaultGameState.premiumInfo,
                    adBoost: false
                }
            }} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const adBoostCheckbox = screen.queryByLabelText(/ad boost/i);
        expect(adBoostCheckbox).not.toBeNull();
        expect(adBoostCheckbox).not.toBeChecked();

        await userEvent.click(adBoostCheckbox);
        expect(adBoostCheckbox).toBeChecked();
        await userSubmitsForm();
        expect(submitFn.mock.results[0].value.premiumInfo.adBoost).toBe(true);

        await userEvent.click(adBoostCheckbox);
        expect(adBoostCheckbox).not.toBeChecked();
        await userSubmitsForm();
        expect(submitFn.mock.results[1].value.premiumInfo.adBoost).toBe(false);
    });

    it("has a functional stockpiles page", async () => {
        const submitFn = jest.fn((data) => data);
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const values = {
            dust: "47845747",
            blue: "46375",
            green: "6674",
            red: "76407",
            yellow: "2"
        }

        const stockpilesSection = findStockpilesSection();

        const dustInput = within(stockpilesSection).queryByLabelText(/dust/i);
        expect(dustInput).not.toBeNull();
        expect(dustInput.value).toBe("0");
        await userEvent.type(dustInput, `{selectall}{backspace}${values.dust}`);
        expect(dustInput.value).toBe(values.dust);

        const blueInput = within(stockpilesSection).queryByLabelText(/blue/i);
        expect(blueInput).not.toBeNull();
        expect(blueInput.value).toBe("0");
        await userEvent.type(blueInput, `{selectall}{backspace}${values.blue}`);
        expect(blueInput.value).toBe(values.blue);

        const greenInput = within(stockpilesSection).queryByLabelText(/green/i);
        expect(greenInput).not.toBeNull();
        expect(greenInput.value).toBe("0");
        await userEvent.type(greenInput, `{selectall}{backspace}${values.green}`);
        expect(greenInput.value).toBe(values.green);

        const redInput = within(stockpilesSection).queryByLabelText(/red/i);
        expect(redInput).not.toBeNull();
        expect(redInput.value).toBe("0");
        await userEvent.type(redInput, `{selectall}{backspace}${values.red}`);
        expect(redInput.value).toBe(values.red);

        const yellowInput = within(stockpilesSection).queryByLabelText(/yellow/i);
        expect(yellowInput).not.toBeNull();
        expect(yellowInput.value).toBe("0");
        await userEvent.type(yellowInput, `{selectall}{backspace}${values.yellow}`);
        expect(yellowInput.value).toBe(values.yellow);

        await userSubmitsForm();
        expect(submitFn.mock.results[0].value.stockpiles.dust).toBe(parseInt(values.dust));
        expect(submitFn.mock.results[0].value.stockpiles.blue).toBe(parseInt(values.blue));
        expect(submitFn.mock.results[0].value.stockpiles.green).toBe(parseInt(values.green));
        expect(submitFn.mock.results[0].value.stockpiles.red).toBe(parseInt(values.red));
        expect(submitFn.mock.results[0].value.stockpiles.yellow).toBe(parseInt(values.yellow));
    });

    it("has a functional worker levels page", async () => {
        const submitFn = jest.fn((data) => data);
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const values = {
            trinity: 10,
            bronte: 9,
            anne: 8,
            petra: 7,
            manny: 6,
            tony: 5,
            ruth: 4,
            rex: 3
        }

        const workerLevelsSection = findWorkerLevelsSection();

        const trinitySelect = within(workerLevelsSection).queryByLabelText(/trinity/i);
        expect(trinitySelect).not.toBeNull();
        await checkSelect(trinitySelect, `${values.trinity}`, `trinity_${values.trinity}`);

        const bronteSelect = within(workerLevelsSection).queryByLabelText(/bronte/i);
        expect(bronteSelect).not.toBeNull();
        await checkSelect(bronteSelect, `${values.bronte}`, `bronte_${values.bronte}`);

        const anneSelect = within(workerLevelsSection).queryByLabelText(/anne/i);
        expect(anneSelect).not.toBeNull();
        await checkSelect(anneSelect, `${values.anne}`, `anne_${values.anne}`);
        
        const petraSelect = within(workerLevelsSection).queryByLabelText(/petra/i);
        expect(petraSelect).not.toBeNull();
        await checkSelect(petraSelect, `${values.petra}`, `petra_${values.petra}`);

        const mannySelect = within(workerLevelsSection).queryByLabelText(/manny/i);
        expect(mannySelect).not.toBeNull();
        await checkSelect(mannySelect, `${values.manny}`, `manny_${values.manny}`);

        const tonySelect = within(workerLevelsSection).queryByLabelText(/tony/i);
        expect(tonySelect).not.toBeNull();
        await checkSelect(tonySelect, `${values.tony}`, `tony_${values.tony}`);

        const ruthSelect = within(workerLevelsSection).queryByLabelText(/ruth/i);
        expect(ruthSelect).not.toBeNull();
        await checkSelect(ruthSelect, `${values.ruth}`, `ruth_${values.ruth}`);

        const rexSelect = within(workerLevelsSection).queryByLabelText(/rex/i);
        expect(rexSelect).not.toBeNull();
        await checkSelect(rexSelect, `${values.rex}`, `rex_${values.rex}`);

        await userSubmitsForm();

        expect(submitFn.mock.results[0].value.levels.trinity).toBe(values.trinity);
        expect(submitFn.mock.results[0].value.levels.bronte).toBe(values.bronte);
        expect(submitFn.mock.results[0].value.levels.anne).toBe(values.anne);
        expect(submitFn.mock.results[0].value.levels.petra).toBe(values.petra);
        expect(submitFn.mock.results[0].value.levels.manny).toBe(values.manny);
        expect(submitFn.mock.results[0].value.levels.tony).toBe(values.tony);
        expect(submitFn.mock.results[0].value.levels.ruth).toBe(values.ruth);
        expect(submitFn.mock.results[0].value.levels.rex).toBe(values.rex);
    })

    it("has a functional other levels page", async () => {
        const submitFn = jest.fn((data) => data);
        render( <FormActiveMode 
            gameState={ {
                ...defaultGameState,
                premiumInfo: {
                    ...defaultGameState.premiumInfo,
                    adBoost: false
                }
            }} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const eggLevels = {
            blue: 4,
            green: 3,
            red: 2,
            yellow: 1,
        }

        const otherLevelsSection = findOtherLevelsSection();

        const blueSelect = within(otherLevelsSection).queryByLabelText(/blue/i);
        expect(blueSelect).not.toBeNull();
        await checkSelect(blueSelect, `${eggLevels.blue}`, `blue_${eggLevels.blue}`);

        const greenSelect = within(otherLevelsSection).queryByLabelText(/green/i);
        expect(greenSelect).not.toBeNull();
        await checkSelect(greenSelect, `${eggLevels.green}`, `green_${eggLevels.green}`);

        const redSelect = within(otherLevelsSection).queryByLabelText(/red/i);
        expect(redSelect).not.toBeNull();
        await checkSelect(redSelect, `${eggLevels.red}`, `red_${eggLevels.red}`);

        const yellowSelect = within(otherLevelsSection).queryByLabelText(/yellow/i);
        expect(yellowSelect).not.toBeNull();
        await checkSelect(yellowSelect, `${eggLevels.yellow}`, `yellow_${eggLevels.yellow}`);

        // In the mobile game, dust and speed are displayed as percentages, so replicate that here
        const speedSelect = within(otherLevelsSection).queryByLabelText(/speed/i);
        expect(speedSelect).not.toBeNull();
        await checkSelect(speedSelect, "-15%", "Speed_3");

        const dustSelect = within(otherLevelsSection).queryByLabelText(/Dust/i);
        expect(dustSelect[0]).not.toBeNull();
        await checkSelect(dustSelect, "100%", "Dust_4");

        await userSubmitsForm();

        expect(submitFn.mock.results[0].value.levels.blue).toBe(eggLevels.blue);
        expect(submitFn.mock.results[0].value.levels.green).toBe(eggLevels.green);
        expect(submitFn.mock.results[0].value.levels.red).toBe(eggLevels.red);
        expect(submitFn.mock.results[0].value.levels.yellow).toBe(eggLevels.yellow);
        expect(submitFn.mock.results[0].value.levels.speed).toBe(3);
        expect(submitFn.mock.results[0].value.levels.dust).toBe(4);
    })
})
