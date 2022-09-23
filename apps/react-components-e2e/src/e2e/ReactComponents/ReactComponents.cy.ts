describe("react-components: ReactComponents component", () => {
    beforeEach(() => cy.visit("/iframe.html?id=reactcomponents--primary"));

    it("should render the component", () => {
        cy.get("h1").should("contain", "Welcome to ReactComponents!");
    });
});
