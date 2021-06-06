import React from "react"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, theme } from "@material-ui/core/styles"

const SearchTrains=(props)=>  {

  const trains=props.trains
  var stationNameShort = props.stationNameShort
  const stationNamesAndShortCodes=props.stationNamesAndShortCodes
  var searchType = props.searchType
  var scheduledTimes = []
 
  console.log(searchType)
 
  var j,i = ""
  for (j in trains) {
    for (i in trains[j].timeTableRows) {
      if (
        trains[j].timeTableRows[i].stationShortCode === stationNameShort &&
        trains[j].timeTableRows[i].type === searchType
      ) {
        var time = new Date(trains[j].timeTableRows[i].scheduledTime)
        let scheduledTime = {
          trainType: trains[j].trainType,
          trainNumber: trains[j].trainNumber,
          departureStation: trains[j].timeTableRows[0].stationShortCode,
          destinationStation:
            trains[j].timeTableRows[trains[j].timeTableRows.length - 1]
.stationShortCode,
          time: time,
        }
        scheduledTimes.push(scheduledTime)
        scheduledTimes.sort(function (a, b) {
          return a.time.getTime() - b.time.getTime()
        })
      }
    }
  }
  console.log(scheduledTimes)

  function getLongName(short) {
    var i = ""
    for (i in stationNamesAndShortCodes) {
      if (stationNamesAndShortCodes[i].stationShortCode === short) {
        return stationNamesAndShortCodes[i].stationName
      }
    }
  }

  const classes = useStyles()

  return (
    <Table className={classes.table} aria-label="aikataulutaulukko">
      <TableHead>
        <TableRow>
          <TableCell>Juna</TableCell>
          <TableCell align="right">L&auml;ht&ouml;asema</TableCell>
          <TableCell align="right">P&auml;&auml;teasema</TableCell>
          <TableCell align="right">{searchType}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {scheduledTimes.map((scheduledTimes, idx) => (
          <TableRow key={idx}>
            <TableCell component="th" scope="row">
              {scheduledTimes.trainType}&nbsp;{scheduledTimes.trainNumber}
            </TableCell>
            <TableCell align="right">
              {getLongName(scheduledTimes.departureStation)}
            </TableCell>
            <TableCell align="right">
              {getLongName(scheduledTimes.destinationStation)}
            </TableCell>
            <TableCell align="right">
              {scheduledTimes.time.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "numeric",
                minute: "numeric",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
const font = "'Nunito', sans-serif"

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      fontFamily: font,
    },
    Tab: {
      fontFamily: font,
      fontSize: "1.1rem",
      fontWeight: 600,
    },
  },
  table: {
    minWidth: 450,
    marginTop: 10,
  },
}))
export default SearchTrains