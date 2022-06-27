import React, { useEffect, useRef } from 'react'
import { drawRoundRect } from '../../utils'
import { MidiVisualizerNoteCoordinates } from '../../types'
import './VisualizerSection.scss'
import { MIDI_CHANNEL_COLORS } from '../../utils/const'
import clsx from 'clsx'

interface VisualizerSectionProps {
    index: number
    indexToDraw: number
    height: number
    width: number
    top: string
    notesCoordinates: MidiVisualizerNoteCoordinates[] | null | undefined
    showCanvasNumbers?: boolean
}

class MidiVisualizerSection {
    private ctx: CanvasRenderingContext2D

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    drawNumbers(indexToDraw: number, index: number) {
        const { width, height } = this.ctx.canvas
        this.ctx.font = '30px Arial'
        this.ctx.fillText(indexToDraw.toString(), width - 40, height - 20)
        this.ctx.fillText(index.toString(), width - 80, height - 20)
    }

    clearCanvas() {
        const { width, height } = this.ctx.canvas
        this.ctx.clearRect(0, 0, width, height)
    }

    drawNotes(
        notesCoordinates: MidiVisualizerNoteCoordinates[] | null | undefined,
        indexToDraw: number
    ) {
        const canvasOffset = this.ctx.canvas.height

        if (notesCoordinates && notesCoordinates.length) {
            notesCoordinates.forEach(({ x, y, w, h, channel }) => {
                const yComputed = y - indexToDraw * canvasOffset
                this.ctx.fillStyle = MIDI_CHANNEL_COLORS[channel]
                drawRoundRect(this.ctx, x, yComputed, w, h, 5, true, false)
            })
        }
    }
}

export function VisualizerSection({
    index,
    indexToDraw,
    height,
    width,
    top,
    notesCoordinates,
    showCanvasNumbers = true,
}: VisualizerSectionProps) {
    const refCanvas = useRef<HTMLCanvasElement>(null)
    const canvasRef: HTMLCanvasElement | undefined | null = refCanvas.current
    const ctx = canvasRef?.getContext('2d')
    let midiVisualizerSection: MidiVisualizerSection | null = null
    if (ctx) {
        midiVisualizerSection = new MidiVisualizerSection(ctx)
    }

    useEffect(() => {
        if (midiVisualizerSection && notesCoordinates) {
            midiVisualizerSection.clearCanvas()
            midiVisualizerSection.drawNotes(notesCoordinates, indexToDraw)
            if (showCanvasNumbers) {
                midiVisualizerSection.drawNumbers(indexToDraw, index)
            }
        }
    }, [midiVisualizerSection, indexToDraw, notesCoordinates, showCanvasNumbers])

    useEffect(() => {
        function configureCanvas(color: string) {
            if (canvasRef && ctx) {
                canvasRef.width = width
                canvasRef.height = height
                ctx.fillStyle = color
            }
        }
        configureCanvas(MIDI_CHANNEL_COLORS[0])
        if (width && height && midiVisualizerSection) {
            midiVisualizerSection.drawNotes(notesCoordinates, indexToDraw)
        }
    }, [width, height, ctx])

    const className = clsx('visualizer__section', [`visualizer__section--${index}`])

    return (
        <canvas
            ref={refCanvas}
            data-testid={`visualizer__section--${index}`}
            className={className}
            style={{ transform: `scaleY(-1) translateY(${top})` }}
        ></canvas>
    )
}
