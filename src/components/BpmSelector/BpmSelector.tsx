import { Divider } from '../generics/Divider'
import { Tooltip } from '../generics/Tooltip'
import { Button } from '../generics/Button'
import { ButtonGroup } from '../generics/ButtonGroup'
import React, { useContext, useState } from 'react'
import { msPerBeatToBeatPerMin } from '../../utils'
import { MidiVisualizerCoordinates } from '../Visualizer/MidiVisualizerCoordinates'
import { MidiMetas } from '../../types'
import { MidiCurrentTime } from '../TimeContextProvider/TimeContextProvider'
import './BpmSelectors.scss'

interface BpmSelectorProps {
    midiSpeedFactor: number
    midiMetas: MidiMetas
    onChangeMidiSpeedFactor: React.Dispatch<React.SetStateAction<number>>
    onChangeMidiStartingTime: React.Dispatch<React.SetStateAction<number>>
}

export function BpmSelector({
    midiSpeedFactor,
    midiMetas,
    onChangeMidiSpeedFactor,
    onChangeMidiStartingTime,
}: BpmSelectorProps) {
    const midiCurrentTime = useContext(MidiCurrentTime)
    const { allMsPerBeat } = midiMetas
    const [isBPMTooltipOpen, setIsBPMTooltipOpen] = useState<boolean>(false)
    const msPerBeat = MidiVisualizerCoordinates.getMsPerBeatFromTime(
        allMsPerBeat,
        midiCurrentTime
    ).value

    function handleChangeMidiSpeedFactor(value: number) {
        onChangeMidiSpeedFactor(value)
        onChangeMidiStartingTime(midiCurrentTime)
    }

    function handleClickBPM() {
        setIsBPMTooltipOpen((isBPMTooltipOpen) => !isBPMTooltipOpen)
    }

    function onShowTooltip() {
        console.log('show')
        setIsBPMTooltipOpen(true)
    }

    function onHideTooltip() {
        console.log('hide')
        setIsBPMTooltipOpen(false)
    }

    const speedFactors = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    const actualBpm = Math.round(msPerBeatToBeatPerMin(msPerBeat) / midiSpeedFactor)
    return (
        <>
            <Divider orientation="vertical" />
            <Tooltip show={isBPMTooltipOpen} onHide={onHideTooltip} onShow={onShowTooltip}>
                <Button onClick={handleClickBPM}> {actualBpm} </Button>
                <span className="bpm">
                    BPM :
                    <ButtonGroup size={'sm'}>
                        {speedFactors.map((factor, index) => (
                            <Button
                                key={factor}
                                active={factor === midiSpeedFactor}
                                onClick={() => {
                                    handleChangeMidiSpeedFactor(factor)
                                }}
                            >
                                x{speedFactors[index]}
                            </Button>
                        ))}
                    </ButtonGroup>
                </span>
            </Tooltip>
            <Divider orientation="vertical" />
        </>
    )
}
