import React, { useRef } from 'react'
import { VisualizerSection } from './VisualizerSection'
import { render, screen } from '@testing-library/react'
import { MidiVisualizerNoteCoordinates } from '../../types'
import canvasMock from 'jest-canvas-mock'

jest.mock('react', () => {
    const originReact = jest.requireActual('react')
    const mockUseRef = jest.fn()
    return {
        ...originReact,
        useRef: mockUseRef,
    }
})

const notesCoordinates: MidiVisualizerNoteCoordinates[] = [
    {
        duration: 10,
        velocity: 100,
        name: 'A0',
        key: 21,
        id: '1',
        w: 5,
        h: 10,
        x: 10,
        y: 5,
        channel: 0,
        startingTime: 0,
    },
]

describe('VisualizerSection', () => {
    beforeEach(() => {
        // @ts-ignore
        useRef.mockReturnValue({
            current: canvasMock,
        })
    })

    it('should render a section properly', () => {
        render(
            <VisualizerSection
                notesCoordinates={notesCoordinates}
                width={100}
                height={50}
                index={0}
            ></VisualizerSection>
        )
        const section = screen.getByTestId('visualizer__section--0')

        expect(section).toBeVisible()
    })
})
