import { parseArrayBuffer } from 'midi-json-parser'
import React from 'react'
import { midiJsonToNotes } from '../../utils'

interface MidiImporterProps {
    onMidiImport: (midiTrackTitle: string) => void
}

export function MidiImporter({ onMidiImport }: MidiImporterProps) {
    function onUpload(e: any) {
        const files = e.target.files
        const filesArr = Array.prototype.slice.call(files)
        const reader = new FileReader()

        reader.onload = function () {
            const arrayBuffer = this.result

            parseArrayBuffer(arrayBuffer as ArrayBuffer).then((json: any) => {
                midiJsonToNotes(json)
                onMidiImport(filesArr[0].name)
            })
        }

        reader.readAsArrayBuffer(filesArr[0])
    }

    return (
        <input
            type="file"
            onChange={onUpload}
            id="myFile"
            name="filename"
            accept=".mid"
        />
    )
}
