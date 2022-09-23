import styled from "@emotion/styled";

/* eslint-disable-next-line */
export interface ReactComponentsProps {}

const StyledReactComponents = styled.div`
    color: pink;
`;

export const ReactComponents = (_props: ReactComponentsProps) => {
    return (
        <StyledReactComponents>
            <h1>Welcome to ReactComponents!</h1>
        </StyledReactComponents>
    );
};

export default ReactComponents;
