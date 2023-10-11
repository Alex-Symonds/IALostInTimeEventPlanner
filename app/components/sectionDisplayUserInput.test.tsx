
import { render, screen } from "@testing-library/react";
import DisplayUserInput from "./sectionDisplayUserInput";

import { defaultGameState } from "../utils/defaults";


describe(DisplayUserInput, () => {
    it("hides game state correctly", () => {
        render(<DisplayUserInput 
            showGameState={false}
            gameState={defaultGameState}
            openGameStateModal={ () => {} }
            mode={ null }

            showOfflinePeriods={true}
            offlinePeriods={ [] }
            openOfflinePeriodsModal = { () => {} }
            offlinePeriodIdxEdit = { 0 }
        />);

        const gameStateSection = screen.queryByText("Game Status")?.closest("section");
        expect(gameStateSection?.classList.contains("sr-only")).toBe(true);
    })

    it("displays game state correctly", () => {
        render(<DisplayUserInput 
            showGameState={true}
            gameState={defaultGameState}
            openGameStateModal={ () => {} }
            mode={ null }

            showOfflinePeriods={true}
            offlinePeriods={ [] }
            openOfflinePeriodsModal = { () => {} }
            offlinePeriodIdxEdit = { 0 }
        />);

        const gameStateSection = screen.queryByText("Game Status")?.closest("section");
        expect(gameStateSection?.classList.contains("sr-only")).toBe(false);
    })

    it("hides offline periods correctly", () => {
        render(<DisplayUserInput 
            showGameState={false}
            gameState={defaultGameState}
            openGameStateModal={ () => {} }
            mode={ null }

            showOfflinePeriods={false}
            offlinePeriods={ [] }
            openOfflinePeriodsModal = { () => {} }
            offlinePeriodIdxEdit = { 0 }
        />);

        const offlinePeriodsSection = screen.queryByText("Offline Periods")?.closest("section");
        expect(offlinePeriodsSection?.classList.contains("sr-only")).toBe(true);

    })

    it("displays offline periods correctly", () => {
        render(<DisplayUserInput 
            showGameState={false}
            gameState={defaultGameState}
            openGameStateModal={ () => {} }
            mode={ null }

            showOfflinePeriods={true}
            offlinePeriods={ [] }
            openOfflinePeriodsModal = { () => {} }
            offlinePeriodIdxEdit = { 0 }
        />);

        const offlinePeriodsSection = screen.queryByText("Offline Periods")?.closest("section");
        expect(offlinePeriodsSection?.classList.contains("sr-only")).toBe(false);
    })


})