import { getMidiMetas } from './midi'
import * as midi from './../tests/midi1.json'
import { IMidiFile } from 'midi-json-parser-worker'
import { MidiMetas } from '../types'

describe('getMidiMetas()', () => {
    it('should extract midi file infos from midi json', () => {
        const midiJson = midi as IMidiFile
        const expectedResult: MidiMetas = {
            format: 1,
            initialInstruments: [{ index: 1, name: 'Bright Acoustic Keyboard', channel: 0 }],
            midiDuration: 152999.267578125,
            msPerBeat: 750,
            playableTracksIndexes: [1],
            ticksPerBeat: 1024,
            trackMetas: {},
            beatsPerMin: 120,
        }

        expect(getMidiMetas(midiJson)).toStrictEqual(expectedResult)
    })
})
