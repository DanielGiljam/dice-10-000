import {ComponentStory, ComponentMeta} from "@storybook/react";
import {ReactComponents} from "./ReactComponents";

export default {
    component: ReactComponents,
    title: "ReactComponents",
} as ComponentMeta<typeof ReactComponents>;

const Template: ComponentStory<typeof ReactComponents> = (args) => (
    <ReactComponents {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
