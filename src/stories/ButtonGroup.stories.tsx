import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ButtonGroup } from '../components/_presentational/ButtonGroup/ButtonGroup'
import { Button } from '../components/_presentational/Button/Button'

export default {
    title: 'Example/ButtonGroup',
    component: ButtonGroup,
} as ComponentMeta<typeof ButtonGroup>

const Template: ComponentStory<typeof ButtonGroup> = (args) => (
    <ButtonGroup {...args}>
        <Button>Test</Button>
        <Button>Test 2</Button>
    </ButtonGroup>
)

export const Default = Template.bind({})
Default.args = {}