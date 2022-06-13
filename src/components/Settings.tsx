import React from 'react'
import { MusicSystemSelector } from './MusicSystemSelector'
import { MidiInputSelector, onChangeMidiInput } from './MidiInputSelector'
import './Settings.scss'
import { Instrument, MusicSystem } from '../types'
import { AppMode, ModeSelector } from './ModeSelector'
import { AudioPlayer } from './AudioPlayer'
import { InstrumentSelector } from './InstrumentSelector'

interface SettingsProps {
    isMute: boolean
    isMidiImported: boolean
    toggleSound: (isSoundOn: boolean) => void
    midiInputs: MIDIInput[]
    appMode: AppMode
    musicSystem: MusicSystem
    midiTrackCurrentTime: number
    midiTrackDuration: number
    onChangeMusicSystem: (musicSystem: MusicSystem) => void
    onChangeMidiInput: onChangeMidiInput
    onChangeAppMode: (mode: AppMode) => void
    onChangeInstrument: (instrument: Instrument) => void
    onPlay: (midiTrackCurrentTime: number) => void
    onRewind: (midiTrackCurrentTime: number) => void
    onSeeking: (midiTrackCurrentTime: number) => void
    onPause: () => void
}

export function Settings({
    isMute,
    isMidiImported,
    toggleSound,
    midiInputs,
    appMode,
    musicSystem,
    midiTrackCurrentTime,
    midiTrackDuration,
    onChangeMusicSystem,
    onChangeMidiInput,
    onChangeAppMode,
    onChangeInstrument,
    onPlay,
    onRewind,
    onPause,
    onSeeking,
}: SettingsProps) {
    return (
        <div className="settings">
            {isMidiImported ? (
                <AudioPlayer
                    isMute={isMute}
                    toggleSound={toggleSound}
                    midiTrackCurrentTime={midiTrackCurrentTime}
                    midiTrackDuration={midiTrackDuration}
                    onPlay={onPlay}
                    onRewind={onRewind}
                    onPause={onPause}
                    onSeeking={onSeeking}
                />
            ) : null}
            <MusicSystemSelector onChange={onChangeMusicSystem} musicSystem={musicSystem} />
            <ModeSelector onChange={onChangeAppMode} appMode={appMode} />
            <MidiInputSelector midiInputs={midiInputs} onChange={onChangeMidiInput} />
            <InstrumentSelector onChange={onChangeInstrument} />
        </div>
    )
}
