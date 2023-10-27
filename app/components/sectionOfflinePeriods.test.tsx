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

        expect(screen.queryAllByText("None entered")).not.toHaveLength(0);
        expect(screen.queryAllByText("1")).toHaveLength(0);
    })

    it("displays offline periods correctly", () => {
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

        expect(screen.queryAllByText("None entered")).toHaveLength(0);

        const eleBeginsWith1 = screen.queryByText(/^1$/);
        expect(eleBeginsWith1).not.toBeNull();

        if(eleBeginsWith1 !== null){
            const liEle = eleBeginsWith1.closest('li');
            expect(liEle).not.toBeNull();

            if(liEle !== null){
                expect(liEle).toHaveTextContent("18 Dec 00:00 - 18 Dec 08:00");
            }
        }

        const eleBeginsWith2 = screen.queryByText(/^2$/);
        expect(eleBeginsWith2).toBeNull();
    })

})