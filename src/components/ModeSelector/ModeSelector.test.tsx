import { render } from '@testing-library/react'
import React from 'react'
import { ModeSelector } from './'
import { clickImportMode, clickLearningMode } from '../../tests/utils/midiMode'

jest.mock('../_presentational/Tooltip', () => ({
    Tooltip: ({ children }: any) => {
        return children
    },
}))

describe('ModeSelector', () => {
    const onChange = jest.fn()

    xit('should call onChange() callback with "learning" mode', () => {
        // for now the button is disabled
        render(<ModeSelector appMode={'import'} onChange={onChange}></ModeSelector>)
        clickLearningMode()

        expect(onChange).toHaveBeenCalledWith('learning')
    })

    it('should call onChange() callback with "import" mode', () => {
        render(<ModeSelector appMode={'learning'} onChange={onChange}></ModeSelector>)
        clickImportMode()

        expect(onChange).toHaveBeenCalledWith('import')
    })
})
