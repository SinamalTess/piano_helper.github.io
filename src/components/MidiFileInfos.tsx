import React from 'react'
import { MidiInfos } from '../types'
import './MidiFileInfos.scss'
import { MidiTitle } from './MidiTitle'
import { CHANNElS_COLORS } from '../utils/const/channel_colors'
import { List } from './generics/List'
import { ListItem } from './generics/ListItem'

interface MidiInfosProps {
    midiInfos: MidiInfos
    midiTitle: string
}

export function MidiFileInfos({ midiInfos, midiTitle }: MidiInfosProps) {
    const { ticksPerBeat, format, initialInstruments, msPerBeat } = midiInfos
    return (
        <div className="midifile-infos pd-md">
            <MidiTitle midiTitle={midiTitle} />
            <span>Ticks per beat : {ticksPerBeat}</span>
            <span>Format : {format}</span>
            <span>Ms per beat : {msPerBeat}</span>
            <List>
                {initialInstruments.map(({ channel, name }) => (
                    <ListItem
                        style={{ color: CHANNElS_COLORS[channel] }}
                        key={`${name}-${channel}`}
                    >
                        {channel} : {name}
                    </ListItem>
                ))}
            </List>
        </div>
    )
}
