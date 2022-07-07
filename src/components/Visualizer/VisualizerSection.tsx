import React from 'react'
import './VisualizerSection.scss'
import clsx from 'clsx'
import { MidiVisualizerNoteCoordinates } from '../../types'

interface VisualizerSectionProps {
    index: number
    indexToDraw: number
    height: number
    width: number
    top: string
    notesCoordinates: MidiVisualizerNoteCoordinates[] | null | undefined
    showCanvasNumbers?: boolean
}

interface RectanglesProps {
    notesCoordinates: MidiVisualizerNoteCoordinates[]
    height: number
    indexToDraw: number
}

const Rectangles = React.memo(function Rectangles({
    notesCoordinates,
    height,
    indexToDraw,
}: RectanglesProps) {
    console.log(height)
    return (
        <>
            {notesCoordinates.map(({ channel, y, x, w, h, id }) => (
                <rect
                    key={id}
                    className={`channel-${channel}`}
                    x={x}
                    y={y - indexToDraw * height}
                    rx="5"
                    ry="5"
                    width={w}
                    height={h}
                />
            ))}
        </>
    )
})

export function VisualizerSection({
    index,
    indexToDraw,
    height,
    width,
    top,
    notesCoordinates,
}: VisualizerSectionProps) {
    const className = clsx('visualizer__section', [`visualizer__section--${index}`])

    return (
        <svg
            width={width}
            height={height}
            data-testid={`visualizer__section--${index}`}
            className={className}
            style={{ transform: `scaleY(-1) translateY(${top})` }}
        >
            {notesCoordinates ? (
                <Rectangles
                    notesCoordinates={notesCoordinates}
                    height={height}
                    indexToDraw={indexToDraw}
                />
            ) : null}
        </svg>
    )
}
