import { render, screen } from "@testing-library/react";
import SectionOfflinePeriods from "./sectionOfflinePeriods";

import { defaultGameState } from "../utils/defaults";
import { offlinePeriodOvernight } from "../utils/testHelpers";


describe(SectionOfflinePeriods, () => {

    it("displays correctly when there are no offline periods", () => {
        render(
            <SectionOfflinePeriods  
                offlinePeriods={[]}
                gameState={defaultGameState}
                openModal={() => {}}
                idxEdit={0}
        />)

        expect(screen.queryAllByText("None entered")).toHaveLength(1);
        expect(screen.queryAllByText("1")).toHaveLength(0);
    })

    it("displays one offline period correctly", () => {
        render(
            <SectionOfflinePeriods  
                offlinePeriods={[offlinePeriodOvernight]}
                gameState={ {
                    ...defaultGameState,
                    timestamp: new Date('1995-12-17T03:24:00'),
                    startTime: new Date('1995-12-17T03:24:00')
                } }
                openModal={() => {}}
                idxEdit={0}
        />)

        expect(screen.queryAllByText("None entered")).toHaveLength(3);
        expect(screen.queryAllByText("17 Dec")).toHaveLength(1);
        expect(screen.queryAllByText("18 Dec")).toHaveLength(1);
        expect(screen.queryAllByText("19 Dec")).toHaveLength(1);
        expect(screen.queryAllByText("20 Dec")).toHaveLength(1);

        const sectionWithContent = screen.queryAllByText("18 Dec")[0].closest('section');
        expect(sectionWithContent).toHaveTextContent("18 Dec00:00 - 08:00");

        let sectionWithoutContent = screen.queryAllByText("17 Dec")[0].closest('section');
        expect(sectionWithoutContent).toHaveTextContent("17 DecNone entered");

        sectionWithoutContent = screen.queryAllByText("19 Dec")[0].closest('section');
        expect(sectionWithoutContent).toHaveTextContent("19 DecNone entered");

        sectionWithoutContent = screen.queryAllByText("20 Dec")[0].closest('section');
        expect(sectionWithoutContent).toHaveTextContent("20 DecNone entered");

    })

})