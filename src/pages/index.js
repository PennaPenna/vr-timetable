import React, { useEffect, useState } from "react"
import "../App.css"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import "@fontsource/roboto"
import { makeStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import TableContainer from "@material-ui/core/TableContainer"
import { Container, TextField, Paper } from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import PropTypes from "prop-types"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import SearchTrains from "./SearchTrains"

export default function AsemanJunatiedot() {

  const [trains, setTrains] = useState([])
  const [searchedStation, setSearchedStation] = useState("")
  var stationNameLong = ""
  var stationNameShort = ""
  const [stationNamesAndShortCodesAll, setStationNamesAndShortCodesAll] = useState([])
  var minutes = 300 // 5 hours
  var searchTypeArrival = "ARRIVAL"
  var searchTypeDeparture = "DEPARTURE"
  const classes = useStyles()

  // FETCH STATIONS (SEARCHOPTIONS) 
  useEffect(() => {
    const url = "https://rata.digitraffic.fi/api/v1/metadata/stations"
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        setStationNamesAndShortCodesAll(responseJson)
      })
      .catch(error => {
        alert("Haku ei onnistunut. Yritä myöhemmin uudelleen.", error)
      })
  }, [])
  
  var stationNamesAndShortCodes = stationNamesAndShortCodesAll.filter(function (shorts) {
    return shorts.passengerTraffic === true
  })

  var i = ""
  for (i in stationNamesAndShortCodes) {
    if (stationNamesAndShortCodes[i].stationName === searchedStation) {
      stationNameShort = stationNamesAndShortCodes[i].stationShortCode
    }
    if (stationNamesAndShortCodes[i].stationShortCode === stationNameShort) {
      stationNameLong = stationNamesAndShortCodes[i].stationName
    }
  }
  // FETCH TRAINS FOR THE SELECTED STATION
  function getTrains() {
    const url = "https://rata.digitraffic.fi/api/v1/live-trains/station/"+stationNameShort+"?minutes_before_departure=0&minutes_after_departure=0&minutes_before_arrival="+minutes+"&minutes_after_arrival=0&train_categories=Commuter,Long-distance"
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        setTrains(responseJson)
      })
      .catch(error => {
        alert("Haku ei onnistunut. Yritä myöhemmin uudelleen.", error)
      })
  }
  function getTrainsOnEnter(event) {
    if (event.key === "Enter") {
      getTrains()
    }
  }

  // TABS
  function TabPanel(props) {
    const { children, value, index } = props

    return (
      <div hidden={value !== index}>
        {value === index && <div>{children}</div>}
      </div>
    )
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
  }

  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <AppBar>
          <Toolbar style={{ display: "inline-flex" }}>
            <Typography variant="h6">Aseman junatiedot</Typography>
          </Toolbar>
        </AppBar>
        <Container>
          <div style={{ display: "inline-flex", marginTop: 110 }}>
            <Autocomplete
              id="Search"
              autoSelect
              noOptionsText={"Asemia ei löytynyt."}
              options={stationNamesAndShortCodes}
              getOptionLabel={option => option.stationName}
              getOptionSelected={(option, value) =>
                option.stationName === value.stationName
              }
              style={{ width: 350, backgroundColor: "white" }}
              placeholder=""
              renderInput={params => (
                <TextField
                  {...params}
                  label="Hae aseman nimellä"
                  variant="filled"
                  //onChange={e => setSearchedStation(e.target.value)}
                  onSelect={e => setSearchedStation(e.target.value)}
                  onBlur={e => setSearchedStation(e.target.value)} 
                  onKeyPress={getTrainsOnEnter}
                />
              )}
            />
            <IconButton
              className={classes.SearchIcon}
              color="inherit"
              float="right"
              display="inline-flex"
              onClick={getTrains}>
              <SearchIcon fontSize="large" />
            </IconButton>
            <Typography variant="srOnly">Search</Typography>
          </div>
          <TableContainer
            component={Paper}
            elevation={0}>
            <Tabs
              value={value}
              variant="standard"
              indicatorColor="secondary"
              onChange={handleChange}
              aria-label="välilehdet">
              <Tab label="Saapuvat" />
              <Tab label="Lähtevät" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <SearchTrains
                trains={trains}
                stationNameShort={stationNameShort}
                stationNameLong={stationNameLong}
                stationNamesAndShortCodes={stationNamesAndShortCodes}
                searchType={searchTypeArrival}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <SearchTrains
                trains={trains}
                stationNameShort={stationNameShort}
                stationNameLong={stationNameLong}
                stationNamesAndShortCodes={stationNamesAndShortCodes}
                searchType={searchTypeDeparture}
              />
            </TabPanel>
          </TableContainer>
        </Container>
      </MuiThemeProvider>
    </div>
  )
}
const font = "'Nunito', sans-serif"
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#56a319",
      contrastText: "white",
    },
    secondary: {
      main: "#ffffff",
    },
  },
  typography: {
    fontFamily: font,
    fontWeight: 500,
    h6: {
      fontFamily: font,
      fontSize: "1.2rem",
      fontWeight: 600,
    },
  },
})

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      fontFamily: font,
      fontWeight: 600,
    },
    "& .MuiPaper-rounded": {
      marginTop: 60,
    },
    "& .MuiTabs-flexContainer": {
      borderBottom: "2px solid #eef0f0",
    },
    "& .MuiTab-root": {
      color: "#56a319",
      minWidth: 200,
      opacity: 1,
      backgroundColor: "#ffffff",
      paddingTop: 8,
      borderBottom: "2px #eef0f0 solid",
      bottom: -2,
    },
    "& .MuiTab-wrapper": {
      fontSize: "1rem",
      fontWeight: 600,
      textTransform: "Capitalize",
    },
    "& .MuiTab-textColorInherit.Mui-selected": {
      color: "#888888",
      border: "2px #eef0f0 solid",
      paddingTop: 6,
      borderBottom: "2px #ffffff solid",
      borderRadius: "8px 8px 0px 0px",
    },
    "& .MuiTableRow-root": {
      "&:nth-of-type(odd)": {
        backgroundColor: "#f5f5f5",
      },
    },
    "& .MuiTableCell-root": {
      borderBottom: 1.5,
      fontSize: "1rem",
    },
    "& .MuiTableCell-head": {
      backgroundColor: "#ffffff",
      color: "#b3b3b3",
      fontWeight: 600,
      fontSize: "0.9rem",
    },
    "& .MuiSvgIcon-root": {
      fill: "#000000",
    },
  },
}))
