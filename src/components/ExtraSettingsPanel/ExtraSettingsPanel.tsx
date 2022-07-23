import { SideBar } from '../_presentational/SideBar'
import { MusicSystemSelector } from '../MusicSystemSelector'
import { InstrumentSelector } from '../InstrumentSelector'
import React from 'react'
import { Instrument, InstrumentUserFriendlyName, MidiMetas, MusicSystem } from '../../types'
import './ExtraSettingsPanel.scss'
import { MidiTrackList } from '../MidiTrackList'
import { Switch } from '../_presentational/Switch'

interface ExtraSettingsPanelProps {
    isOpen: boolean
    showNotes: boolean
    userInstrument: InstrumentUserFriendlyName
    musicSystem: MusicSystem
    midiMetas: MidiMetas | null
    activeTracks: number[]
    activeInstruments: Instrument[]
    onClose: () => void
    onChangeMusicSystem: (musicSystem: MusicSystem) => void
    onChangeActiveTracks: React.Dispatch<React.SetStateAction<number[]>>
    onChangeInstrument: React.Dispatch<React.SetStateAction<Instrument[]>>
    onChangeShowNotes: React.Dispatch<React.SetStateAction<boolean>>
}

const BASE_CLASS = 'extra-settings'

export function ExtraSettingsPanel({
    isOpen,
    showNotes,
    userInstrument,
    musicSystem,
    midiMetas,
    activeTracks,
    activeInstruments,
    onClose,
    onChangeMusicSystem,
    onChangeActiveTracks,
    onChangeInstrument,
    onChangeShowNotes,
}: ExtraSettingsPanelProps) {
    function handleClick() {
        onChangeShowNotes((showNotes) => !showNotes)
    }

    return (
        <SideBar open={isOpen} onClose={onClose}>
            <div className={BASE_CLASS} role="toolbar" aria-orientation="vertical">
                <Switch isOn={showNotes} onClick={handleClick}>
                    Show notes
                </Switch>
                <h4>User Instrument</h4>
                <div className={`${BASE_CLASS}__user-instrument`}>
                    <img
                        src={`img/svg/instruments/instrument_${userInstrument}.svg`}
                        alt={`instrument ${userInstrument}`}
                        style={{ width: 48 }}
                    />
                    <InstrumentSelector onChange={onChangeInstrument} value={userInstrument} />
                </div>
                {midiMetas ? (
                    <>
                        <h4>File infos</h4>
                        <p>Ticks per beat : {midiMetas.ticksPerBeat}</p>
                        <p>Format : {midiMetas.format}</p>
                        <h4>Music System</h4>
                        <MusicSystemSelector
                            onChange={onChangeMusicSystem}
                            musicSystem={musicSystem}
                        />
                        <h4>Tracks</h4>
                        <MidiTrackList
                            activeInstruments={activeInstruments}
                            tracks={midiMetas.tracksMetas}
                            activeTracks={activeTracks}
                            instruments={midiMetas.instruments}
                            onChangeActiveTracks={onChangeActiveTracks}
                        />
                    </>
                ) : null}
            </div>
        </SideBar>
    )
}
