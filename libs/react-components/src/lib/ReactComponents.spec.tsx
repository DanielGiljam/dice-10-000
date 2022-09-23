import {render} from "@testing-library/react";

import ReactComponents from "./ReactComponents";

describe("ReactComponents", () => {
    it("should render successfully", () => {
        const {baseElement} = render(<ReactComponents />);
        expect(baseElement).toBeTruthy();
    });
});
