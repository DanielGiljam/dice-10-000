import {ComponentMeta, ComponentStory} from "@storybook/react";

import {ReactComponents} from "./ReactComponents";

export default {
    component: ReactComponents,
    title: "ReactComponents",
} as unknown as ComponentMeta<typeof ReactComponents>;

const Template: ComponentStory<typeof ReactComponents> = (args) => (
    <ReactComponents {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
