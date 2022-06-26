import React from 'react'
import { Dropdown } from './generics/Dropdown'
import { DropdownItem } from './generics/DropdownItem'
import { DropdownToggle } from './generics/DropdownToggle'
import { Checkbox } from './generics/Checkbox'

interface MidiTrackSelectorProps {
    playableTracksIndexes: number[]
    activeTracks: number[]
    onChangeActiveTracks: React.Dispatch<React.SetStateAction<number[]>>
}

export function MidiTrackSelector({
    playableTracksIndexes,
    onChangeActiveTracks,
    activeTracks,
}: MidiTrackSelectorProps) {
    const allChecked = activeTracks.length === playableTracksIndexes.length

    function selectAllPlayableTracks() {
        onChangeActiveTracks([...playableTracksIndexes])
    }

    function unselectAllPlayableTracks() {
        onChangeActiveTracks([])
    }

    function selectTrack(track: number) {
        const existingTrackIndex = activeTracks.findIndex((activeTrack) => activeTrack === track)
        if (existingTrackIndex >= 0) {
            const newActiveTracks = [...activeTracks]
            newActiveTracks.splice(existingTrackIndex, 1)
            onChangeActiveTracks(newActiveTracks)
        } else {
            onChangeActiveTracks([...activeTracks, track])
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target
        const track = parseInt(value)
        if (value === 'all' && !allChecked) {
            selectAllPlayableTracks()
        } else if (value === 'all') {
            unselectAllPlayableTracks()
        } else {
            selectTrack(track)
        }
    }

    return (
        <Dropdown open={false}>
            <DropdownToggle>{`(${playableTracksIndexes.length}) Tracks`}</DropdownToggle>
            <DropdownItem>
                <Checkbox value={'all'} onChange={handleChange} checked={allChecked}>
                    {allChecked ? 'Unselect All' : 'Select all'}
                </Checkbox>
            </DropdownItem>
            {playableTracksIndexes.map((track) => {
                const checked = activeTracks.some((activeTrack) => activeTrack === track)
                const trackString = track.toString()
                return (
                    <DropdownItem key={track}>
                        <Checkbox value={trackString} onChange={handleChange} checked={checked}>
                            {trackString}
                        </Checkbox>
                    </DropdownItem>
                )
            })}
        </Dropdown>
    )
}
