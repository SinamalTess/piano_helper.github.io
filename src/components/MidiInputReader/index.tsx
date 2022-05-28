import React from 'react'
import { MusicSystem } from '../../types/musicSystem'
import { translateKey } from '../../utils'

interface MidiInputReader {
    note: string | null
    musicSystem: MusicSystem
}

export function MidiInputReader({ note, musicSystem }: MidiInputReader) {
    return (
        <div>{note ? translateKey(note, musicSystem) : 'no note playing'}</div>
    )
}
