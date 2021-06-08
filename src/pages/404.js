import React from "react"
import "../App.css"
import Typography from "@material-ui/core/Typography"
import { Container, Paper } from "@material-ui/core"

export default function Err404() {
  const font = "'Nunito', sans-serif"

  return (
    <div>
      <Container component={Paper} style={{ padding: 100, marginTop: 80 }}>
        <Typography
          style={{ fontFamily: font, fontSize: "2rem", fontWeight: 600, textAlign:'center' }}
        >
          Sivua ei löydy :(
        </Typography>
      </Container>
    </div>
  )
}
