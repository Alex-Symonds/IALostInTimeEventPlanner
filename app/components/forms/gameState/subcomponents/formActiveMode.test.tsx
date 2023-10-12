// @ts-nocheck
import { render, screen, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import FormActiveMode from "./formActiveMode";
import { defaultGameState } from "@/app/utils/defaults";
import { checkSelect, levels, nonZeroStockpiles, workerLevels } from "@/app/utils/testHelpers";


async function userSubmitsForm(){
    const progressButton = screen.queryByText(/page 4/i);
    await userEvent.click(progressButton);

    const submitBtn = findVisualSubmitButton();
    await userEvent.click(submitBtn);
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

    
    test.each([
        [0],
        [1],
        [2],
        [3],
    ])(`visually displays correct page when next button is clicked %i times`, async (numNextClicks) => {
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={() => {}}
            changeMode={() => {}}
            wantBackToMode={false} 
            closeModal={() => {}}
        />);

        const {
            generalSection,
            stockPilesSection,
            workerLevelsSection,
            otherLevelsSection,
            nextButton
        } = findCommonElements();

        for(let i = 0; i < numNextClicks; i++){
            await userEvent.click(nextButton);
        }
        
        [   generalSection, 
            stockPilesSection, 
            workerLevelsSection, 
            otherLevelsSection
        ].forEach((section, index) => {
            if(index === numNextClicks){
                expect(section).not.toHaveClass("sr-only");
            }
            else{
                expect(section).toHaveClass("sr-only");
            }
        })
    })


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


    it("disables back button on page 1 normally", () => {
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

        expect(backButton).toBeDisabled();
    })

    it("enables back button on page 1 when opened after setting a mode", () => {
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


    test.each([
        [0],
        [3],
        [1],
        [2]
    ])(`clicking progress button %i skips to correct page`, async (idx) => {
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

        await userEvent.click(progressButtons[idx]);

        [
            generalSection, 
            stockPilesSection, 
            workerLevelsSection, 
            otherLevelsSection
        ].forEach((section, index) => {
            if(index === idx){
                expect(section).not.toHaveClass("sr-only");
            }
            else{
                expect(section).toHaveClass("sr-only");
            }
        })
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


describe("form functionality", () => {

    it("has a functional time remaining fieldset", async () => {
        const submitFn = jest.fn((data) => data);
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const NUM_DAYS = 1;
        const NUM_HOURS = 20;
        const NUM_MINUTES = 5;

        const timeRemLegend = screen.queryByText(/time remaining/i);
        const timeRemFieldset = timeRemLegend?.closest('fieldset');
        const dayInput = within(timeRemFieldset).getByLabelText(/d/i);
        const hourInput = within(timeRemFieldset).getByLabelText(/h/i);
        const minuteInput = within(timeRemFieldset).getByLabelText(/m/i);

        await userEvent.type(dayInput, `{selectall}{backspace}${NUM_DAYS}`, {delay: 5});
        await userEvent.type(hourInput, NUM_HOURS.toString(), {delay: 5});
        await userEvent.type(minuteInput, NUM_MINUTES.toString(), {delay: 5});
        await userSubmitsForm();
        expect(submitFn.mock.results[0].value.timeRemaining).toBe(NUM_DAYS * 24 * 60 + NUM_HOURS * 60 + NUM_MINUTES);
    });


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


    test.each(
        Object.keys(nonZeroStockpiles).map((ele) => { 
            return [ele];
        })
    )('.(has a functional stockpile field for %s)', async (key) => {
        const submitFn = jest.fn((data) => data);
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const stockpilesSection = findStockpilesSection();

        const inputEle = within(stockpilesSection).queryByLabelText(new RegExp(`${key}`, "i"));
        expect(inputEle).not.toBeNull();
        expect(inputEle.value).toBe("0");
        await userEvent.type(inputEle, `{selectall}{backspace}${nonZeroStockpiles[key]}`);
        expect(inputEle.value).toBe(nonZeroStockpiles[key].toString());
        await userSubmitsForm();
        expect(submitFn.mock.results[0].value.stockpiles[key]).toBe(parseInt(nonZeroStockpiles[key]));

    })

    test.each(
        Object.keys(workerLevels).map((key) => [key])
    )('.(worker levels page has a functional select for %s)', async (key) => {
        const submitFn = jest.fn((data) => data);
        render( <FormActiveMode 
            gameState={defaultGameState} 
            setGameState={submitFn}
            changeMode={() => {}}
            wantBackToMode={true} 
            closeModal={() => {}}
        />);

        const workerLevelsSection = findWorkerLevelsSection();
        const workerSelect = within(workerLevelsSection).queryByLabelText(new RegExp(`${key}`, "i"));
        expect(workerSelect).not.toBeNull();
        await checkSelect(workerSelect, `${workerLevels[key]}`, `${key}_${workerLevels[key]}`);
        await userSubmitsForm();
        expect(submitFn.mock.results[0].value.levels[key]).toBe(workerLevels[key]);
    })


    test.each([
        ['blue', `${levels.blue}`, `blue_${levels.blue}`, levels.blue],
        ['green', `${levels.green}`, `green_${levels.green}`, levels.green],
        ['red', `${levels.red}`, `red_${levels.red}`, levels.red],
        ['yellow', `${levels.yellow}`, `yellow_${levels.yellow}`, levels.yellow],
        ['speed', "-15%", "Speed_3", 3],
        ['dust', "100%", "Dust_4", 4]
    ])(`.(worker levels page has a functional select for %s)`, async (key, optionStr, optionID, level) => {
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

        const otherLevelsSection = findOtherLevelsSection();
        const targetSelect = within(otherLevelsSection).queryByLabelText(new RegExp(key, "i"));
        expect(targetSelect).not.toBeNull();
        await checkSelect(targetSelect, optionStr, optionID);
        await userSubmitsForm();
        expect(submitFn.mock.results[0].value.levels[key]).toBe(level);
    });


})
