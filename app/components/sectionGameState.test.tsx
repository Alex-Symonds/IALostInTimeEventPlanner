//@ts-nocheck

import { render, screen, within } from "@testing-library/react";
import SectionGameState from "./sectionGameState";

import { PlanMode } from "../utils/usePlanMode";
import { defaultGameState } from "../utils/defaults";
import { capitalise, toThousands } from "../utils/formatting";
import { levels, nonZeroEggStockpiles } from "../utils/testHelpers";


describe(SectionGameState, () => {

    it("renders correct elements in plan mode", () => {
        const { getByRole } = render(
            <SectionGameState   
                gameState={defaultGameState}
                openEditForm={() => {}}
                mode={ PlanMode.plan }
            />
        );

        expect(screen.queryAllByText("All Eggs")).not.toHaveLength(0);
        expect(screen.queryAllByText("Ad Boost")).not.toHaveLength(0);
        expect(getByRole('button').innerHTML).toEqual("edit");

        expect(screen.queryAllByText("Start Time")).not.toHaveLength(0);

        expect(screen.queryAllByText("Updated")).toHaveLength(0);
        expect(screen.queryAllByText("Remaining")).toHaveLength(0);
        expect(screen.queryAllByText("Dust")).toHaveLength(0);
        expect(screen.queryAllByText("Egg Stockpiles")).toHaveLength(0);
        expect(screen.queryAllByText("Upgrade Levels")).toHaveLength(0);
    });


    it("renders correct elements in active mode", () => {
        const {getByRole} = render(
            <SectionGameState   
                gameState={defaultGameState}
                openEditForm={() => {}}
                mode={ PlanMode.active }
            />
        );

        expect(screen.queryAllByText("All Eggs")).not.toHaveLength(0);
        expect(screen.queryAllByText("Ad Boost")).not.toHaveLength(0);
        expect(getByRole('button').innerHTML).toEqual("edit");

        expect(screen.queryAllByText("Start Time")).toHaveLength(0);

        expect(screen.queryAllByText("Updated")).not.toHaveLength(0);
        expect(screen.queryAllByText("Remaining")).not.toHaveLength(0);
        expect(screen.queryAllByText("Dust")).not.toHaveLength(0);
        expect(screen.queryAllByText("Egg Stockpiles")).not.toHaveLength(0);
        expect(screen.queryAllByText("Upgrade Levels")).not.toHaveLength(0);
    });


    it("renders dust correctly", () => {
        const KEY = 'Dust';
        const VALUE = 7000000;
        render(
            <SectionGameState   
                gameState={ { ...defaultGameState,
                            stockpiles: {
                                ...defaultGameState.stockpiles,
                                [KEY.toLowerCase()]: VALUE,
                            }
                        } }
                openEditForm={() => {}}
                mode={ PlanMode.active }
            />
        );

        const stockpileKeyQuery = screen.queryAllByText(KEY);
        expect(stockpileKeyQuery).not.toHaveLength(0);
        const stockpileValueEle = stockpileKeyQuery[0].nextSibling;
        expect(stockpileValueEle).toBeTruthy();
        expect(stockpileValueEle.textContent).toEqual(VALUE.toLocaleString());
    })


    test.each(Object.keys(levels).map((k : string) => {
        if(['blue', 'green', 'red', 'yellow'].includes(k)){
            return [k[0], levels[k]];
        }
        return [capitalise(k.slice(0, 2)), levels[k]];
    }))('.(renders %s level correctly (%i))', (key, level) => {

        const {} = render(
            <SectionGameState   
                gameState={ { 
                            ...defaultGameState,
                            levels
                        } }
                openEditForm={() => {}}
                mode={ PlanMode.active }
            />
        );

        const levelsHeadingQuery = screen.queryAllByText("Upgrade Levels");
        expect(levelsHeadingQuery).toHaveLength(1);
        const levelsSection = levelsHeadingQuery[0].parentElement;

        const unitKeyQuery = within(levelsSection).queryAllByText(key);
        expect(unitKeyQuery).toHaveLength(1);
        const unitValueEle = unitKeyQuery[0].nextSibling;
        expect(unitValueEle).not.toBeNull();
        expect(unitValueEle.textContent).toEqual(level.toString());
    })


    test.each(Object.keys(nonZeroEggStockpiles).map((k : string) => {
        return [k[0], nonZeroEggStockpiles[k]];
    }))('.(renders %s stockpile correctly (%i))', (key, quantity) => {

        render(
            <SectionGameState   
                gameState={ { 
                            ...defaultGameState,
                            stockpiles: {
                                ...nonZeroEggStockpiles,
                                dust: 42,
                            }
                        } }
                openEditForm={() => {}}
                mode={ PlanMode.active }
            />
        );

        const stockpilesHeadingQuery = screen.queryAllByText("Egg Stockpiles");
        expect(stockpilesHeadingQuery).toHaveLength(1);
        const stockpilesSection = stockpilesHeadingQuery[0].parentElement;

        const stockpileKeyQuery = within(stockpilesSection).queryAllByText(key);
        expect(stockpileKeyQuery).toHaveLength(1);
        const stockpileValueEle = stockpileKeyQuery[0].nextSibling;
        expect(stockpileValueEle).not.toBeNull();
        expect(stockpileValueEle.textContent).toEqual(toThousands(quantity));
    });


    it("renders premium 'all eggs' correctly", () => {
        const numberAllEggs = 2;
        render(
            <SectionGameState   
                gameState={ { ...defaultGameState,
                            premiumInfo: {
                                ...defaultGameState.premiumInfo,
                                allEggs: numberAllEggs
                            }
                        } }
                openEditForm={() => {}}
                mode={ PlanMode.active }
            />
        );

        const allEggsKeyEle = screen.queryByText("All Eggs");
        expect(allEggsKeyEle).not.toBeNull();

        const allEggsValueEle = allEggsKeyEle?.nextElementSibling;
        expect(allEggsValueEle).not.toBeNull();
        expect(allEggsValueEle).toHaveTextContent(`+${numberAllEggs}`);
    })


    it("renders ad boost correctly when true", () => {
        const hasAdBoost = true;
        render(
            <SectionGameState   
                gameState={ { ...defaultGameState,
                            premiumInfo: {
                                ...defaultGameState.premiumInfo,
                                adBoost: hasAdBoost
                            }
                        } }
                openEditForm={() => {}}
                mode={ PlanMode.active }
            />
        );

        const adBoostKeyEle = screen.queryByText("Ad Boost");
        expect(adBoostKeyEle).not.toBeNull();

        const adBoostValueEle = adBoostKeyEle?.nextElementSibling;
        expect(adBoostValueEle).not.toBeNull();
        expect(adBoostValueEle).toHaveTextContent(`✔yes`);
    })


    it("renders ad boost correctly when false", () => {
        const hasAdBoost = false;
        render(
            <SectionGameState   
                gameState={ { ...defaultGameState,
                            premiumInfo: {
                                ...defaultGameState.premiumInfo,
                                adBoost: hasAdBoost
                            }
                        } }
                openEditForm={() => {}}
                mode={ PlanMode.active }
            />
        );

        const adBoostKeyEle = screen.queryByText("Ad Boost");
        expect(adBoostKeyEle).not.toBeNull();

        const adBoostValueEle = adBoostKeyEle?.nextElementSibling;
        expect(adBoostValueEle).not.toBeNull();
        expect(adBoostValueEle).toHaveTextContent(`❌no`);
    })


    it("renders start time correctly", () => {
        const startedAt = new Date('1995-12-17T03:24:00')
        render(
            <SectionGameState   
                gameState={ { ...defaultGameState,
                            startTime: startedAt
                         }}
                openEditForm={() => {}}
                mode={ PlanMode.plan }
            />
        );

        const startTimeKeyEle = screen.queryByText("Start Time");
        expect(startTimeKeyEle).not.toBeNull();

        const startTimeValueEle = startTimeKeyEle?.nextElementSibling;
        expect(startTimeValueEle).not.toBeNull();
        expect(startTimeValueEle).toHaveTextContent("17 Dec 03:24");
    })


    it("renders time remaining correctly", () => {
        const daysRemaining = 2;
        const hoursRemaining = 12;
        const minutesRemaining = 42;
        const timeRemaining = daysRemaining * 24 * 60 + hoursRemaining * 60 + minutesRemaining;
        
        render(
            <SectionGameState   
                gameState={ { 
                            ...defaultGameState,
                            timeRemaining
                         }}
                openEditForm={() => {}}
                mode={ PlanMode.active }
            />
        );

        const timeRemainingKeyEle = screen.queryByText("Remaining");
        expect(timeRemainingKeyEle).not.toBeNull();

        const timeRemainingValueEle = timeRemainingKeyEle?.nextElementSibling;
        expect(timeRemainingValueEle).not.toBeNull();
        expect(timeRemainingValueEle).toHaveTextContent(`${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m`);
    })


    it("renders timestamp correctly", () => {
        const timestamp = new Date('1995-12-17T03:24:00')
        render(
            <SectionGameState   
                gameState={ { 
                            ...defaultGameState,
                            timestamp: timestamp
                         }}
                openEditForm={() => {}}
                mode={ PlanMode.active }
            />
        );

        const timeEnteredKeyEle = screen.queryByText("Updated");
        expect(timeEnteredKeyEle).not.toBeNull();

        const timeEnteredValueEle = timeEnteredKeyEle?.nextElementSibling;
        expect(timeEnteredValueEle).not.toBeNull();
        expect(timeEnteredValueEle).toHaveTextContent("17 Dec 03:24");
    })
})

