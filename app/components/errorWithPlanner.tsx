import NoPlannerWrapper, { NoPlannerHeading } from "./subcomponents/noPlanner"

export default function ErrorWithPlanner(){
    return  <NoPlannerWrapper mode={"error"}>
                <NoPlannerHeading>Error</NoPlannerHeading>
                  <p>The planner isn&apos;t working right now.</p>
                  <h3 className={"text-base font-semibold mt-6 mb-1"}>Some types of errors can be fixed by:</h3>
                  <ul className={"list-disc ml-8"}>
                    <li>Re-entering game status</li>
                    <li>Deleting all offline periods and re-entering</li>
                    <li>Starting again by refreshing the page (on Windows, try the <kbd className={"bg-neutral-100 rounded px-0.5"}>F5</kbd> key)</li>
                  </ul>
                  <p className={"mt-6"}>If you&apos;ve tried those steps and you&apos;re still seeing this message, it&apos;s a techie problem at our end. Sorry! Please try again later.</p>
            </NoPlannerWrapper>
  }