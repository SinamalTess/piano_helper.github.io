import './App.scss'
import React, { useState } from 'react'
import { getMidiInfos, midiJsonToNotes, noteKeyToName } from './utils'
import { Piano } from './components/Piano'
import { Settings } from './components/Settings'
import { MidiJsonNote, AlphabeticalNote, MusicSystem } from './types'
import { AppMode } from './components/ModeSelector'
import { Preview } from './components/Preview'
import { MidiTrackInfos } from './components/Visualizer'
import { IMidiFile } from 'midi-json-parser-worker'

function App() {
    const [midiInputs, setMidiInputs] = useState<MIDIInput[]>([])
    const [notes, setNotes] = useState<AlphabeticalNote[]>([])
    const [musicSystem, setMusicSystem] = useState<MusicSystem>('syllabic')
    const [isSoundOn, setIsSoundOn] = useState<boolean>(true)
    const [appMode, setAppMode] = useState<AppMode>('import')
    const [trackPosition, setTrackPosition] = useState<number>(0)
    const [midiTrackTitle, setMidiTrackTitle] = useState<string>('')
    const [midiTrackNotes, setMidiTrackNotes] = useState<MidiJsonNote[]>([])
    const [midiTrackInfos, setMidiTrackInfos] = useState<MidiTrackInfos | null>(null)

    function onMIDISuccess(midiAccess: MIDIAccess) {
        let inputs: MIDIInput[] = []
        midiAccess.inputs.forEach((input) => {
            inputs.push(input)
        })

        setMidiInputs(inputs)

        if (inputs[0]) {
            inputs[0].onmidimessage = getMIDIMessage
        }
    }

    function onMIDIFailure(msg: string) {
        console.log('Failed to get MIDI access - ' + msg)
    }

    React.useEffect(() => {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
    }, [])

    function onChangeMidiInput(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedInput = event.target.value
        const input = midiInputs.find((e) => e.id === selectedInput)
        if (input) {
            input.onmidimessage = getMIDIMessage
        }
    }

    function getMIDIMessage(message: any) {
        const command = message.data[0]
        const note = noteKeyToName(message.data[1])
        const velocity = message.data.length > 2 ? message.data[2] : 0 // a velocity value might not be included with a noteOff command

        const clearNote = () => {
            const noteIndex = notes.findIndex((key) => key === note)
            if (noteIndex) {
                setNotes((notes) => notes.filter((key) => key !== note))
            }
        }

        switch (command) {
            case 144: // noteOn
                if (velocity > 0) {
                    setNotes((notes) => [...notes, note])
                } else {
                    clearNote()
                }
                break
            case 128: // noteOff
                clearNote()
                break
        }
    }

    function onMidiImport(title: string, midiJSON: IMidiFile) {
        const notes = midiJsonToNotes(midiJSON)
        const midiInfos = getMidiInfos(midiJSON)
        setMidiTrackTitle(title)
        setMidiTrackNotes(notes)
        setMidiTrackInfos(midiInfos)
    }

    return (
        <div className="container">
            <div className="item">
                <Settings
                    appMode={appMode}
                    toggleSound={setIsSoundOn}
                    isSoundOn={isSoundOn}
                    midiInputs={midiInputs}
                    musicSystem={musicSystem}
                    trackPosition={trackPosition}
                    setTrackPosition={setTrackPosition}
                    onChangeMidiInput={onChangeMidiInput}
                    onChangeAppMode={setAppMode}
                    onChangeMusicSystem={setMusicSystem}
                />
            </div>
            <div className="item">
                <Preview
                    appMode={appMode}
                    notes={notes}
                    trackPosition={trackPosition}
                    midiTrackNotes={midiTrackNotes}
                    midiTrackTitle={midiTrackTitle}
                    midiTrackInfos={midiTrackInfos}
                    onMidiImport={onMidiImport}
                />
            </div>
            <div className="item">
                <Piano activeKeys={notes} isMute={!isSoundOn} onKeyPressed={setNotes} />
            </div>
        </div>
    )
}

export default App
