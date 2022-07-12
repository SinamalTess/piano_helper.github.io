import React, { ReactNode } from 'react'
import './ButtonGroup.scss'
import { CSSSpacingSize } from '../types'
import clsx from 'clsx'

interface ButtonGroupProps {
    children: ReactNode
    size?: CSSSpacingSize
}

const classNames = clsx('btn-group', 'mg-sm')

export function ButtonGroup({ children, size = 'md' }: ButtonGroupProps) {
    if (!children || !Array.isArray(children)) return null

    return (
        <div className={classNames} role="group">
            {children.map((child, index) =>
                React.cloneElement(child, { size, key: 'btn' + index })
            )}
        </div>
    )
}
