import { render, screen } from '@testing-library/react'
import React from 'react'
import { Keyboard } from './Keyboard'
import { NB_BLACK_PIANO_KEYS, NB_WHITE_PIANO_KEYS } from '../../utils/const'
import { MidiInputActiveNote, MidiMode } from '../../types'
import { clickKey } from '../../tests/utils'

const props = {
    midiMode: 'autoplay' as MidiMode,
    activeNotes: [],
    onKeyPressed: jest.fn(),
}

describe('Keyboard', () => {
    it('should render the proper number of keys', () => {
        render(<Keyboard {...props}></Keyboard>)
        const blackKeys = screen.getAllByText(/[a-g]\d/)
        const whiteKeys = screen.getAllByText(/[A-G]\d/)

        expect(blackKeys).toHaveLength(NB_BLACK_PIANO_KEYS)
        expect(whiteKeys).toHaveLength(NB_WHITE_PIANO_KEYS)
    })

    it('should highlight the active keys', () => {
        const whiteKey: MidiInputActiveNote = {
            name: 'A0',
            velocity: 100,
            key: 21,
            channel: 0,
        }

        const blackKey: MidiInputActiveNote = {
            name: 'Bb0',
            velocity: 100,
            key: 23,
            channel: 0,
        }

        render(<Keyboard {...props} activeNotes={[whiteKey, blackKey]}></Keyboard>)
        const correspondingWhiteKey = screen.getByTestId(/A0/)
        const correspondingBlackKey = screen.getByTestId(/Bb0/)

        expect(correspondingWhiteKey).toHaveClass('keyboard__whitekey--active')
        expect(correspondingBlackKey).toHaveClass('keyboard__blackkey--active')
    })

    it('should allow the keyboard to be played', async () => {
        render(<Keyboard {...props}></Keyboard>)

        clickKey('A1')

        expect(props.onKeyPressed).toHaveBeenCalledWith([
            { channel: 17, key: 33, name: 'A1', velocity: 100 },
        ])
    })
})
