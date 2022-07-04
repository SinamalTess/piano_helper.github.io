import React from 'react'
import { Button } from '../generics/Button'
import './SoundButton.scss'
import clsx from 'clsx'

interface SoundButtonProps {
    isMute: boolean
    onToggleSound: (isSoundOn: boolean) => void
}

export function SoundButton({ isMute, onToggleSound }: SoundButtonProps) {
    function handleClick() {
        onToggleSound(!isMute)
    }

    const className = clsx('volume-icon', { 'volume-icon--active': isMute })

    return (
        <Button onClick={handleClick} variant="link" className={className}>
            <svg viewBox="0 0 108 96">
                <path d="M7 28h28L59 8v80L35 68H7a4 4 0 01-4-4V32a4 4 0 014-4z" />
                <path d="M79 62c4-4.667 6-9.333 6-14s-2-9.333-6-14L49 3" />
                <path d="M95 69c6.667-7.333 10-14.667 10-22s-3.333-14.667-10-22L75.5 6 49 33" />
            </svg>
        </Button>
    )
}