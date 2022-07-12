import './App.scss'
import React, { useCallback, useEffect, useState } from 'react'
import { getMidiMetas } from './utils'
import { Keyboard } from './components/Keyboard'
import { Settings } from './components/Settings'
import {
    AudioPlayerState,
    Instrument,
    MidiMode,
    MusicSystem,
    AppMode,
    ActiveNote,
    MidiMetas,
    AlphabeticalNote,
} from './types'
import { Preview } from './components/Preview'
import { IMidiFile } from 'midi-json-parser-worker'
import { AudioPlayer } from './components/AudioPlayer'
import { InstrumentPlayer } from './components/InstrumentPlayer'
import { MidiMessageManager } from './components/MidiMessageManager'
import { MidiTitle } from './components/MidiTitle'
import { NOTE_NAMES } from './utils/const'
import { TimeContextProvider } from './components/TimeContextProvider/TimeContextProvider'
import { MidiImporter } from './components/MidiImporter'

//TODO: check accessibility

const userInstrument: Instrument = {
    name: 'Acoustic Grand Keyboard',
    channel: 16,
    index: 1,
    notes: NOTE_NAMES.alphabetical as unknown as AlphabeticalNote[],
}

function App() {
    const [activeNotes, setActiveNotes] = useState<ActiveNote[]>([])
    const [notesPlayed, setNotesPlayed] = useState<string[]>([])
    const [timeToNextNote, setTimeToNextNote] = useState<number | null>(null)
    const [musicSystem, setMusicSystem] = useState<MusicSystem>('alphabetical')
    const [appMode, setAppMode] = useState<AppMode>('import')
    const [instruments, setInstruments] = useState<Instrument[]>([userInstrument])
    const [audioPlayerState, setAudioPlayerState] = useState<AudioPlayerState>('stopped')
    const [isMute, setIsMute] = useState<boolean>(false)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [activeTracks, setActiveTracks] = useState<number[]>([])
    const [midiMetas, setMidiMetas] = useState<MidiMetas | null>(null)
    const [midiSpeedFactor, setMidiSpeedFactor] = useState<number>(1)
    const [midiTitle, setMidiTitle] = useState<string>('')
    const [midiInput, setMidiInput] = useState<MIDIInput | null>(null)
    const [midiFile, setMidiFile] = useState<IMidiFile | null>(null)
    const [midiMode, setMidiMode] = useState<MidiMode>('autoplay')
    const [midiStartingTime, setMidiStartingTime] = useState<number>(0)
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
    const isMidiImported = midiFile !== null

    useEffect(() => {
        const ac = new AudioContext()
        setAudioContext(ac)

        return function cleanup() {
            ac.close()
        }
    }, [])

    function handleMidiImport(title: string, midiJSON: IMidiFile) {
        const metas = getMidiMetas(midiJSON)

        const playableTracks = Array.isArray(metas.tracksMetas)
            ? metas.tracksMetas.filter((track) => track.isPlayable)
            : []

        setMidiTitle(title)
        setMidiFile(midiJSON)
        setMidiMetas(metas)
        setInstruments([userInstrument, ...metas.initialInstruments])
        setActiveTracks(playableTracks.map(({ index }) => index))

        console.log(midiJSON)
        console.log(metas)
    }

    const handleAllMidiKeysPlayed = useCallback(
        function handleAllMidiKeysPlayed() {
            if (timeToNextNote && midiMode === 'wait') {
                setIsPlaying(true)
            }
        },
        [midiMode, timeToNextNote]
    )

    return (
        <TimeContextProvider
            startingTime={midiStartingTime}
            audioPlayerState={audioPlayerState}
            midiSpeedFactor={midiSpeedFactor}
        >
            <div className="container">
                <div className="item topbar">
                    {midiMetas ? (
                        <AudioPlayer
                            isMute={isMute}
                            isPlaying={isPlaying}
                            midiMode={midiMode}
                            timeToNextNote={timeToNextNote}
                            midiTitle={midiTitle}
                            midiMetas={midiMetas}
                            midiSpeedFactor={midiSpeedFactor}
                            onChangeAudioPlayerState={setAudioPlayerState}
                            onChangeMidiStartingTime={setMidiStartingTime}
                            onPlay={setIsPlaying}
                            onToggleSound={setIsMute}
                            onChangeMidiSpeedFactor={setMidiSpeedFactor}
                        />
                    ) : null}
                    <Settings
                        initialInstruments={instruments}
                        appMode={appMode}
                        midiMetas={midiMetas}
                        midiMode={midiMode}
                        isMidiImported={isMidiImported}
                        musicSystem={musicSystem}
                        activeTracks={activeTracks}
                        onMidiInputChange={setMidiInput}
                        onChangeAppMode={setAppMode}
                        onChangeMusicSystem={setMusicSystem}
                        onChangeInstrument={setInstruments}
                        onChangeActiveTracks={setActiveTracks}
                        onMidiModeChange={setMidiMode}
                    />
                    <MidiMessageManager
                        audioPlayerState={audioPlayerState}
                        midiInput={midiInput}
                        activeNotes={activeNotes}
                        onChangeActiveNotes={setActiveNotes}
                        onAllMidiKeysPlayed={handleAllMidiKeysPlayed}
                        onNotePlayed={setNotesPlayed}
                    />
                </div>
                <div className="item preview">
                    {midiMetas ? <MidiTitle midiTitle={midiTitle} /> : null}
                    <MidiImporter onMidiImport={handleMidiImport} />
                    <Preview
                        appMode={appMode}
                        midiMode={midiMode}
                        midiFile={midiFile}
                        midiMetas={midiMetas}
                        activeNotes={activeNotes}
                        audioPlayerState={audioPlayerState}
                        activeTracks={activeTracks}
                        onChangeActiveNotes={setActiveNotes}
                        onChangeTimeToNextNote={setTimeToNextNote}
                    />
                </div>
                <div className="item">
                    <Keyboard
                        activeNotes={activeNotes}
                        musicSystem={musicSystem}
                        midiMode={midiMode}
                        onAllMidiKeysPlayed={handleAllMidiKeysPlayed}
                        onKeyPressed={setActiveNotes}
                    />
                    <>
                        {audioContext &&
                            instruments.map(({ channel, name, notes }) => {
                                return (
                                    <InstrumentPlayer
                                        audioContext={audioContext}
                                        key={`${name}-${channel}`}
                                        isMute={isMute}
                                        activeNotes={activeNotes}
                                        instrumentName={name}
                                        notesToLoad={notes}
                                        channel={channel}
                                    />
                                )
                            })}
                    </>
                </div>
            </div>
        </TimeContextProvider>
    )
}

export default App
