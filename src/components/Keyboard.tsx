import React, { useEffect, useRef, useState } from 'react'
import './Keyboard.scss'
import { NOTES, NB_WHITE_PIANO_KEYS } from '../utils/const'
import { AlphabeticalNote, AudioPlayerState, Instrument, MusicSystem } from '../types'
import Soundfont, { InstrumentName } from 'soundfont-player'
import {
    isSpecialNote as checkIsSpecialNote,
    msToSec,
    noteToKey,
    translateNoteToMusicSystem,
} from '../utils'
import { ActiveNote } from '../App'

interface PianoProps {
    activeKeys: ActiveNote[]
    isMute: boolean
    musicSystem: MusicSystem
    instrument: Instrument
    onKeyPressed: (note: ActiveNote[]) => void
    audioPlayerState: AudioPlayerState
}

const normalizeInstrumentName = (instrument: Instrument): InstrumentName =>
    instrument.replace(/ /g, '_').toLowerCase() as InstrumentName

const normalizeVelocity = (val: number, max: number, min: number): number =>
    (val - min) / (max - min)

export function Keyboard({
    activeKeys,
    isMute,
    musicSystem,
    instrument,
    onKeyPressed,
    audioPlayerState,
}: PianoProps) {
    const notes = NOTES.alphabetical
    const [instrumentPlayer, setInstrumentPlayer] = useState<Soundfont.Player | null>(null)
    const notesAlreadyPlayed: React.MutableRefObject<any[]> = useRef([])

    useEffect(() => {
        if (isMute || audioPlayerState !== 'playing') return
        const ac = startInstrument()

        return function cleanup() {
            ac.close().then(() => setInstrumentPlayer(null))
        }
    }, [instrument, isMute, audioPlayerState])

    useEffect(() => {
        if (isMute || !activeKeys.length || !instrumentPlayer) return
        activeKeys.forEach((note) => {
            playNote(note)
        })
    }, [activeKeys, instrumentPlayer, isMute])

    useEffect(() => {
        if (audioPlayerState === 'rewinding') {
            notesAlreadyPlayed.current = []
        }
    }, [audioPlayerState])

    function startInstrument() {
        const ac = new AudioContext()
        const SoundfontInstrument = normalizeInstrumentName(instrument)
        Soundfont.instrument(ac, SoundfontInstrument, { soundfont: 'FluidR3_GM' })
            .then((instrumentPlayer) => {
                setInstrumentPlayer(instrumentPlayer)
            })
            .catch(() => {
                console.error(`Failed to start the instrument ${instrument} audio`)
            })
        return ac
    }

    function playNote(note: ActiveNote) {
        if (!instrumentPlayer) return
        const { velocity, id, duration, key } = note
        const gain = normalizeVelocity(0, 1, velocity)
        if (!notesAlreadyPlayed.current.find((note) => note.id === id)) {
            instrumentPlayer.play(key.toString(), 0, {
                gain,
                duration: msToSec(duration ?? 0),
            })
            notesAlreadyPlayed.current.push(note)
        }
    }

    function handleMouseDown(note: AlphabeticalNote) {
        onKeyPressed([
            {
                name: note,
                velocity: 100,
                key: noteToKey(note),
            },
        ])
    }

    function handleMouseUp() {
        onKeyPressed([])
    }

    return (
        <ul className="keyboard">
            {notes.map((note, index) => {
                const isBlackKey = note.includes('#')
                const isSpecialNote = checkIsSpecialNote(note)
                const keyClassName = isBlackKey ? 'keyboard__blackkey' : 'keyboard__whitekey'
                const widthWhiteKey = 100 / NB_WHITE_PIANO_KEYS
                const margin = isBlackKey || !isSpecialNote ? `0 0 0 -${widthWhiteKey / 4}%` : '0'
                const width = isBlackKey ? `${widthWhiteKey / 2}%` : `${widthWhiteKey}%`
                const isActive = activeKeys.find((currentKey) => currentKey.name === note)
                const styleKeyName = isActive ? { display: 'block' } : {}
                const keyTranslated =
                    musicSystem !== 'alphabetical'
                        ? translateNoteToMusicSystem(note, musicSystem)
                        : note

                return (
                    <li
                        key={note}
                        style={{ width, margin }}
                        onMouseDown={() => handleMouseDown(note)}
                        onMouseUp={handleMouseUp}
                        className={`
                            ${keyClassName} 
                            ${noteToKey(note)} 
                            ${note} ${isActive ? `${keyClassName}--active` : ''}`}
                    >
                        <span style={styleKeyName}>{keyTranslated}</span>
                    </li>
                )
            })}
        </ul>
    )
}
