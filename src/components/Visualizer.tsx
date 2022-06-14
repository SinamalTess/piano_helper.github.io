import React, { useEffect, useRef, useState } from 'react'
import { getNotesCoordinates, isEven, roundRect } from '../utils'
import './Visualizer.scss'
import { MidiJsonNote, isHTMLCanvasElement, NoteCoordinates } from '../types'
import isEqual from 'lodash.isequal'
import { ActiveNote } from '../App'
import { AudioPlayerState } from './AudioPlayer'

//TODO: draw vertical lines to see notes better

export interface MidiTrackInfos {
    ticksPerBeat: number
    msPerBeat: number
    trackDuration: number
    notes: MidiJsonNote[]
}

interface VisualizerProps {
    activeNotes: ActiveNote[]
    notes: MidiJsonNote[]
    color?: string
    midiTrackInfos: MidiTrackInfos | null
    midiTrackCurrentTime: number
    heightPerBeat?: number
    audioPlayerState: AudioPlayerState
    onChangeActiveNotes: (notes: ActiveNote[]) => void
}

export function Visualizer({
    activeNotes,
    notes,
    color = '#00E2DC',
    midiTrackCurrentTime,
    heightPerBeat = 100,
    midiTrackInfos,
    audioPlayerState,
    onChangeActiveNotes,
}: VisualizerProps) {
    const visualizerRef = useRef<HTMLDivElement>(null)
    const [notesCoordinates, setNotesCoordinates] = useState<NoteCoordinates[][]>([])
    const [indexCanvas, setIndexCanvas] = useState<number>(0)

    const width = visualizerRef?.current?.clientWidth ?? 0
    const height = visualizerRef?.current?.clientHeight ?? 0
    const canvasChildren = visualizerRef?.current?.childNodes ?? []
    const isIndexEven = isEven(indexCanvas)

    useEffect(() => {
        if (!midiTrackInfos) return
        const coordinates = getNotesCoordinates(width, height, notes, heightPerBeat, midiTrackInfos)
        setNotesCoordinates(coordinates)
    }, [midiTrackInfos])

    useEffect(() => {
        getActiveNotes(midiTrackCurrentTime)
    }, [midiTrackCurrentTime])

    useEffect(() => {
        if (indexCanvas === 0) {
            drawInitialState()
        } else {
            switch (audioPlayerState) {
                case 'playing':
                    drawForward()
                    break
                case 'rewinding':
                    reDrawCurrentState()
                    break
                case 'seeking':
                    reDrawCurrentState()
                    break
                default:
                    break
            }
        }
    }, [indexCanvas, audioPlayerState])

    function drawInitialState() {
        canvasChildren.forEach((child, index) => {
            if (isHTMLCanvasElement(child)) {
                child.width = width
                child.height = height
                const ctx = child.getContext('2d')

                if (ctx) {
                    ctx.fillStyle = color
                    drawNotes(ctx, notesCoordinates, index)
                }
            }
        })
    }

    function drawForward() {
        const canvasToRedraw = isIndexEven ? 1 : 0
        if (canvasChildren[canvasToRedraw]) {
            reDrawCanvas(canvasChildren[canvasToRedraw], indexCanvas + 1)
        }
    }

    function reDrawCurrentState() {
        const canvas1 = isIndexEven ? indexCanvas + 1 : indexCanvas
        const canvas0 = isIndexEven ? indexCanvas : indexCanvas + 1
        canvasChildren.forEach((child, i) => {
            const index = i === 0 ? canvas0 : canvas1
            reDrawCanvas(child, index)
        })
    }

    function reDrawCanvas(canvas: ChildNode, index: number) {
        if (isHTMLCanvasElement(canvas)) {
            const ctx = canvas.getContext('2d')

            if (ctx) {
                ctx.clearRect(0, 0, width, height)
                drawNotes(ctx, notesCoordinates, index)
            }
        }
    }

    function drawNotes(
        ctx: CanvasRenderingContext2D,
        notesCoordinates: NoteCoordinates[][],
        canvasIndex: number
    ) {
        const canvasOffset = ctx.canvas.height

        if (notesCoordinates[canvasIndex] && notesCoordinates[canvasIndex].length) {
            notesCoordinates[canvasIndex].forEach(({ x, y, w, h }) => {
                const yComputed = y - canvasIndex * canvasOffset
                roundRect(ctx, x, yComputed, w, h, 5, true, false)
            })
        }
    }

    function calcTop(canvasIndex: number): string {
        if (midiTrackInfos && visualizerRef.current) {
            const { msPerBeat } = midiTrackInfos
            const nbBeatsPassed = midiTrackCurrentTime / msPerBeat
            const heightDuration = nbBeatsPassed * heightPerBeat
            const nbCanvasPassed = heightDuration / height
            const index = Math.floor(heightDuration / height)
            const percentageTop = Math.round((nbCanvasPassed % 1) * 100)
            const percentageFirstCanvas = `${100 - percentageTop}%`
            const percentageSecondCanvas = `-${percentageTop}%`
            if (index !== indexCanvas) {
                setIndexCanvas(() => index)
            }
            if (canvasIndex === 0) {
                return isIndexEven ? percentageSecondCanvas : percentageFirstCanvas
            } else {
                return isIndexEven ? percentageFirstCanvas : percentageSecondCanvas
            }
        }
        return '0px'
    }

    function getActiveNotes(midiTrackCurrentTime: number) {
        if (!midiTrackInfos) return

        const heightDuration = (midiTrackCurrentTime / midiTrackInfos.msPerBeat) * heightPerBeat

        if (notesCoordinates[indexCanvas] && notesCoordinates[indexCanvas].length) {
            const activeKeys = notesCoordinates[indexCanvas]
                .filter((note) => note.y <= heightDuration && note.y + note.h >= heightDuration)
                .map(({ name, velocity, id, duration, key }) => ({
                    name,
                    velocity,
                    duration,
                    id,
                    key,
                }))

            if (!isEqual(activeKeys, activeNotes)) {
                onChangeActiveNotes(activeKeys)
            }
        }
    }

    return (
        <div className="visualizer" ref={visualizerRef}>
            <canvas
                className={`visualizer__canvas visualizer__canvas--0`}
                style={{ transform: `scaleY(-1) translateY(${calcTop(0)})` }}
            ></canvas>
            <canvas
                className={`visualizer__canvas visualizer__canvas--1`}
                style={{ transform: `scaleY(-1) translateY(${calcTop(1)})` }}
            ></canvas>
        </div>
    )
}
