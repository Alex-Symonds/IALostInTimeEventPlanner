// @ts-nocheck

import { render, screen } from "@testing-library/react";

import StatusForm from "./gameState";
import { defaultGameState } from "@/app/utils/defaults";
import { PlanMode } from "@/app/utils/usePlanMode";
import userEvent from "@testing-library/user-event";




describe(StatusForm, () => {

    it("displays a mode setting page when mode is null", () => {

        render(
            <StatusForm 
                setGameState={(data : any) => {}}
                gameState={defaultGameState}
                modeKit={{
                    mode: null,
                    setMode: () => {}
                }}
                closeModal={() => {}}
            />
        )

        expect(screen.getByRole('heading', {name: "Game Status"})).not.toBeNull();
        expect(screen.queryAllByText("Select input mode")).not.toHaveLength(0);
    });

    it("displays the plan mode page when planMode is plan", () => {

        render(
            <StatusForm 
                setGameState={(data : any) => {}}
                gameState={defaultGameState}
                modeKit={{
                    mode: PlanMode.plan,
                    setMode: (data : any) => {}
                }}
                closeModal={() => {}}
            />
        )

        expect(screen.queryAllByText("Select input mode")).toHaveLength(0);
        expect(screen.getByRole('heading', {name: "Plan Game Status"})).not.toBeNull();
    });

    it("displays the active mode page when planMode is active", () => {

        render(
            <StatusForm 
                setGameState={(data : any) => {}}
                gameState={defaultGameState}
                modeKit={{
                    mode: PlanMode.active,
                    setMode: (data : any) => {}
                }}
                closeModal={() => {}}
            />
        )

        expect(screen.getByRole('heading', {name: "Active Game Status"})).not.toBeNull();
    });


    it("displays a button to change mode when mode is 'plan'", () => {
        render(
            <StatusForm 
                setGameState={(data : any) => {}}
                gameState={defaultGameState}
                modeKit={{
                    mode: PlanMode.plan,
                    setMode: (data : any) => {}
                }}
                closeModal={() => {}}
            />
        )

        const modeSwitchBtn = screen.queryByRole('button', {name: "change mode"});
        expect(modeSwitchBtn).not.toBeNull();
    })


    it("displays a button to change mode when mode is 'active'", () => {
        render(
            <StatusForm 
                setGameState={(data : any) => {}}
                gameState={defaultGameState}
                modeKit={{
                    mode: PlanMode.active,
                    setMode: (data : any) => {}
                }}
                closeModal={() => {}}
            />
        )

        const modeSwitchBtn = screen.queryByRole('button', {name: "change mode"});
        expect(modeSwitchBtn).not.toBeNull();
    })


    it("does not display a button to change mode when mode is null", () => {
        render(
            <StatusForm 
                setGameState={(data : any) => {}}
                gameState={defaultGameState}
                modeKit={{
                    mode: null,
                    setMode: (data : any) => {}
                }}
                closeModal={() => {}}
            />
        )

        const modeSwitchBtn = screen.queryByRole('button', {name: "change mode"});
        expect(modeSwitchBtn).toBeNull();
    })


    it("changes display to mode picker when change mode nutton is clicked", async () => {
        render(
            <StatusForm 
                setGameState={(data : any) => {}}
                gameState={defaultGameState}
                modeKit={{
                    mode: PlanMode.plan,
                    setMode: (data : any) => {}
                }}
                closeModal={() => {}}
            />
        )
        
        expect(screen.queryByText("Select input mode")).toBeNull();
        const modeSwitchBtn = screen.queryByRole('button', {name: "change mode"});
        //@ts-ignore
        await userEvent.click(modeSwitchBtn);
        expect(screen.queryByText("Select input mode")).not.toBeNull();
    })

})