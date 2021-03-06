import { useEffect, useState } from 'react'
import Soundfont, { Player, InstrumentName } from 'soundfont-player'
import { msToSec } from '../../utils'
import {
    InstrumentUserFriendlyName,
    ActiveNote,
    isMidiVisualizerActiveNote,
    AlphabeticalNote,
    AudioPlayerState,
} from '../../types'
import {
    MIDI_INSTRUMENTS,
    MIDI_INSTRUMENTS_FATBOY,
    MIDI_INSTRUMENTS_FLUIDR3_GM,
    MIDI_INSTRUMENTS_MUSYNGKITE,
    MIDI_INPUT_CHANNEL,
} from '../../utils/const'
import { usePrevious } from '../../_hooks'

interface InstrumentPlayerProps {
    audioContext: AudioContext
    midiInput?: MIDIInput | null
    isMute: boolean
    audioPlayerState: AudioPlayerState
    instrumentName: InstrumentUserFriendlyName
    activeNotes: ActiveNote[]
    notesToLoad: AlphabeticalNote[]
    soundfont?: SoundFont
    channel: number
}

export type SoundFont = 'FluidR3_GM' | 'FatBoy' | 'MusyngKite'

const normalizeInstrumentName = (
    instrument: InstrumentUserFriendlyName,
    soundfont: SoundFont
): InstrumentName => {
    const InstrumentIndex = MIDI_INSTRUMENTS.findIndex(
        (midiInstrument) => midiInstrument === instrument
    )

    switch (soundfont) {
        case 'FatBoy':
            return MIDI_INSTRUMENTS_FATBOY[InstrumentIndex] as InstrumentName
        case 'FluidR3_GM':
            return MIDI_INSTRUMENTS_FLUIDR3_GM[InstrumentIndex] as InstrumentName
        case 'MusyngKite':
            return MIDI_INSTRUMENTS_MUSYNGKITE[InstrumentIndex] as InstrumentName
    }
}

const normalizeVelocity = (val: number, max: number, min: number): number =>
    (val - min) / (max - min)

function playNote(note: ActiveNote, instrumentPlayer: Player) {
    const { velocity, key } = note
    const gain = normalizeVelocity(velocity, 127, 0)
    const duration = isMidiVisualizerActiveNote(note) ? note.duration : 0
    instrumentPlayer.play(key.toString(), 0, {
        gain,
        duration: msToSec(duration),
    })
}

export function InstrumentPlayer({
    isMute,
    midiInput,
    audioContext,
    instrumentName,
    notesToLoad,
    activeNotes,
    channel,
    audioPlayerState,
    soundfont = 'MusyngKite',
}: InstrumentPlayerProps) {
    const [instrumentPlayer, setInstrumentPlayer] = useState<Soundfont.Player | null>(null)
    const prevActiveKeys = usePrevious<ActiveNote[]>(activeNotes)

    useEffect(() => {
        switch (audioPlayerState) {
            case 'paused':
                instrumentPlayer?.stop()
                break
            case 'stopped':
                instrumentPlayer?.stop()
                break
        }
    }, [audioPlayerState])

    useEffect(() => {
        return function cleanup() {
            instrumentPlayer?.stop()
        }
    }, [])

    useEffect(() => {
        if (midiInput && instrumentPlayer && channel === MIDI_INPUT_CHANNEL) {
            /*
                This throws a warning in the console.
                There is not much we can do since this comes from the library.
                The warning is harmless though...
                See this : https://github.com/danigb/soundfont-player/issues/61
            */
            instrumentPlayer.listenToMidi(midiInput)
        }
    }, [instrumentPlayer, midiInput, channel])

    useEffect(() => {
        if (isMute) {
            instrumentPlayer?.stop()
            return
        }
        function startInstrument() {
            const soundfontInstrument = normalizeInstrumentName(instrumentName, soundfont)
            Soundfont.instrument(audioContext, soundfontInstrument, {
                soundfont,
                notes: notesToLoad, // We pass only the notes required to play the midi song for better performances.
            })
                .then((instrumentPlayer) => {
                    setInstrumentPlayer(instrumentPlayer)
                })
                .catch(() => {
                    console.error(`Failed to start the instrument ${instrumentName} audio`)
                })
        }

        startInstrument()
    }, [instrumentName, isMute, soundfont])

    useEffect(() => {
        const notes = activeNotes.filter((note) => note.channel === channel)
        if (isMute || !notes.length || !instrumentPlayer || channel === MIDI_INPUT_CHANNEL) return

        let newNotes = notes

        if (prevActiveKeys) {
            const isNewNote = (note: ActiveNote) =>
                !prevActiveKeys.find(
                    (prevActiveKey) =>
                        'id' in prevActiveKey && 'id' in note && prevActiveKey.id === note.id
                )

            newNotes = notes.filter((note) => isNewNote(note))
        }

        newNotes.forEach((note) => {
            playNote(note, instrumentPlayer)
        })
    }, [activeNotes, instrumentPlayer, isMute])

    return null
}
