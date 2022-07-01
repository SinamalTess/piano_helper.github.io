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
} from './types'
import { Preview } from './components/Preview'
import { IMidiFile } from 'midi-json-parser-worker'
import { AudioPlayer } from './components/AudioPlayer'
import { InstrumentPlayer } from './components/InstrumentPlayer'
import { MidiFileMetas } from './components/MidiFileMetas'
import { MidiMessageManager } from './components/MidiMessageManager'
import { MidiTitle } from './components/MidiTitle'

//TODO: check accessibility

const userInstrument: Instrument = {
    name: 'Acoustic Grand Keyboard',
    channel: 16,
    index: 1,
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
    const [midiCurrentTime, setMidiCurrentTime] = useState<number>(0)
    const [midiTitle, setMidiTitle] = useState<string>('')
    const [midiInput, setMidiInput] = useState<MIDIInput | null>(null)
    const [midiFile, setMidiFile] = useState<IMidiFile | null>(null)
    const [midiMode, setMidiMode] = useState<MidiMode>('autoplay')

    const midiDuration = midiMetas?.midiDuration ?? 0
    const isMidiImported = midiFile !== null
    const playableTracks = midiMetas?.playableTracks ?? []

    function handleMidiImport(title: string, midiJSON: IMidiFile) {
        const metas = getMidiMetas(midiJSON)

        setMidiTitle(title)
        setMidiFile(midiJSON)
        setMidiMetas(metas)
        setMidiCurrentTime(0)
        setInstruments([userInstrument, ...metas.initialInstruments])
        setActiveTracks([...metas.playableTracks])

        console.log(midiJSON)
    }

    const handleAllMidiKeysPlayed = useCallback(
        function handleAllMidiKeysPlayed() {
            if (timeToNextNote && midiMode === 'wait') {
                setIsPlaying(true)
            }
        },
        [midiMode, timeToNextNote]
    )

    useEffect(() => {
        if (
            timeToNextNote &&
            isPlaying &&
            midiCurrentTime >= timeToNextNote &&
            midiMode === 'wait'
        ) {
            setIsPlaying(false)
        }
    }, [midiCurrentTime, isPlaying, midiMode, timeToNextNote])

    return (
        <div className="container">
            <div className="item topbar">
                {isMidiImported ? (
                    <AudioPlayer
                        isMute={isMute}
                        isPlaying={isPlaying}
                        midiCurrentTime={midiCurrentTime}
                        midiDuration={midiDuration}
                        onChangeAudioPlayerState={setAudioPlayerState}
                        onChangeMidiCurrentTime={setMidiCurrentTime}
                        onPlay={setIsPlaying}
                        onToggleSound={setIsMute}
                    />
                ) : null}
                <Settings
                    appMode={appMode}
                    midiMode={midiMode}
                    musicSystem={musicSystem}
                    playableTracks={playableTracks}
                    activeTracks={activeTracks}
                    onMidiInputChange={setMidiInput}
                    onChangeAppMode={setAppMode}
                    onChangeMusicSystem={setMusicSystem}
                    onChangeInstrument={setInstruments}
                    onChangeActiveNotes={setActiveNotes}
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
                {midiMetas ? (
                    <>
                        <MidiFileMetas midiMetas={midiMetas} midiCurrentTime={midiCurrentTime} />
                        <MidiTitle midiTitle={midiTitle} />
                    </>
                ) : null}
                <Preview
                    appMode={appMode}
                    midiMode={midiMode}
                    midiCurrentTime={midiCurrentTime}
                    midiFile={midiFile}
                    midiMetas={midiMetas}
                    activeNotes={activeNotes}
                    audioPlayerState={audioPlayerState}
                    activeTracks={activeTracks}
                    onMidiImport={handleMidiImport}
                    onChangeActiveNotes={setActiveNotes}
                    onChangeTimeToNextNote={setTimeToNextNote}
                />
            </div>
            <div className="item">
                <Keyboard
                    activeKeys={activeNotes}
                    musicSystem={musicSystem}
                    notesPlayed={notesPlayed}
                    onAllMidiKeysPlayed={handleAllMidiKeysPlayed}
                    onKeyPressed={setActiveNotes}
                />
                <>
                    {instruments.map(({ channel, name }) => {
                        return (
                            <InstrumentPlayer
                                key={`${name}-${channel}`}
                                isMute={isMute}
                                audioPlayerState={audioPlayerState}
                                activeKeys={activeNotes}
                                instrument={name}
                                channel={channel}
                                midiFile={midiFile}
                            />
                        )
                    })}
                </>
            </div>
        </div>
    )
}

export default App
