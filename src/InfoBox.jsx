import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import "./InfoBox.css"

function InfoBox({title,cases,active,isRed,total, ...props }) {
  return (
    <Card 
    onClick={props.onClick}
    className={`infoBox ${active && "infoBox--selected"} ${
      isRed && "infoBox--red"
    }`}
    >
        <CardContent>
            <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
            <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
            <Typography className="infoBox__total" color="textSecondary">{total} Total</Typography>
        </CardContent>
    </Card>
  )
}

export default InfoBox