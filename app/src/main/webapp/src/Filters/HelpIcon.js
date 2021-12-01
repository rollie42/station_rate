import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import { Div, Context } from 'Shared'
import styled from 'styled-components'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

const Container = styled.span`
    position: absolute;
    top: 3px;
    right: 10px;
    cursor: default;
`


export default function HelpIcon({helpText}) {
    if (!helpText)
        return null

    return (
        <Container>
            <Tippy content={helpText}>
                <span>?</span>
            </Tippy>
        </Container>
    )
}