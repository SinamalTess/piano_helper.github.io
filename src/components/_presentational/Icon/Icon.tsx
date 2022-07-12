import React from 'react'
import './Icon.scss'
import clsx from 'clsx'
import { IconName, CSSSpacingSize } from '../types'

interface IconProps {
    className?: string[] | string
    name: IconName
    color?: string
    children?: string
    size?: CSSSpacingSize | number
}

export function Icon({ className, name, children, color, size = 'md' }: IconProps) {
    const classNames = clsx(
        'icon',
        { [`icon-${name}`]: name },
        { [`icon-instrument`]: name.startsWith('instrument') },
        { [`icon-${size}`]: typeof size === 'string' },
        className
    )

    const style = typeof size === 'number' ? { fontSize: size + 'px', color } : { color }

    return (
        // TODO: check if this is the proper usage of aria-label
        <span className={classNames} style={style} aria-label={`icon-${name}`}>
            {children}
        </span>
    )
}
