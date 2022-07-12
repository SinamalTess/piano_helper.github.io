import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Button } from '../components/_presentational/Button/Button'

export default {
    title: 'Example/Button',
    component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}>Click me</Button>

export const Default = Template.bind({})
Default.args = {}
