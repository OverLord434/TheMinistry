import {
    Box,
    Typography
} from '@mui/material'
import { keyframes } from '@emotion/react'


const dotsAnimation = keyframes`
  0% { content: "."; }
  33% { content: ".."; }
  66% { content: "..."; }
`

export const AnimatedDots = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h6" sx={{ fontSize: 24 }}>
                Идёт обработка данных. Подождите немного
                <Box component="span" sx={{
                    display: 'inline-block',
                    width: '1em',
                    textAlign: 'left',
                    '&::after': {
                        content: '"."',
                        animation: `${dotsAnimation} 1.2s steps(3, end) infinite`,
                    },
                }} />
            </Typography>
        </Box>
    )
}