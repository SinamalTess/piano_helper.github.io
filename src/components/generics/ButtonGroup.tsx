import { ReactElement } from 'react'
import React from 'react'
import './ButtonGroup.scss'
import { CSSSpacingSize } from '../../types'

interface ButtonGroupProps {
    children: ReactElement[]
    size?: CSSSpacingSize
}

export function ButtonGroup({ children, size = 'md' }: ButtonGroupProps) {
    return (
        <div className="btn-group mg-sm" role="group">
            {children.map((child, index) =>
                React.cloneElement(child, { size, key: 'btn' + index })
            )}
        </div>
    )
}
