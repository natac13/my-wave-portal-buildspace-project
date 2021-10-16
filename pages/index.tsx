import * as React from 'react'

import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
} from '@mui/material'

export default function Index() {
  return (
    <Container maxWidth="lg">
      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          my: 2,
        }}
      >
        <Typography variant="h1" align="center" fontWeight="700">
          Hello Web3
        </Typography>
      </Box>
    </Container>
  )
}
