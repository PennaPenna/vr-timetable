import React, { useEffect, useState } from "react"
import "../App.css"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import TableContainer from "@material-ui/core/TableContainer"
import { Container, TextField, Paper, TableRow } from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import "@fontsource/roboto"
import PropTypes from "prop-types"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import SearchTrains from "./SearchTrains"

export default function AsemanJunatiedot() {
  const [trains, setTrains] = useState([])
  const [searchedStation, setSearchedStation] = useState("")
  var stationNameLong = ""
  var stationNameShort = ""
  const [
    stationNamesAndShortCodesAll,
    setStationNamesAndShortCodesAll,
  ] = useState([])
  var minutes = 300 // 5 hours
  var searchTypeArrival="ARRIVAL"
  var searchTypeDeparture="DEPARTURE"

  function getTrains() {
    const url =
      "https://rata.digitraffic.fi/api/v1/live-trains/station/"+stationNameShort+"?minutes_before_departure="+ minutes+"&minutes_after_departure=0&minutes_before_arrival="+minutes+"&minutes_after_arrival=0&train_categories=Commuter,Long-distance"
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        setTrains(responseJson)
      })
      .catch(error => {
        alert("Haku ei onnistunut. Yritä myöhemmin uudelleen.", error)
      })
  }
  console.log(trains)

  function getStationShortcode() {
    const url = "https://rata.digitraffic.fi/api/v1/metadata/stations"
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        setStationNamesAndShortCodesAll(responseJson)
      })
      .catch(error => {
        alert("Haku ei onnistunut. Yritä myöhemmin uudelleen.", error)
      })
  }

  var stationNamesAndShortCodes = stationNamesAndShortCodesAll.filter(function (
    shorts
  ) {
    return shorts.passengerTraffic === true
  })

  var i,
    j = ""
  for (i in stationNamesAndShortCodes) {
    if (stationNamesAndShortCodes[i].stationName === searchedStation) {
      stationNameShort = stationNamesAndShortCodes[i].stationShortCode
    }
    if (stationNamesAndShortCodes[i].stationShortCode === stationNameShort) {
      stationNameLong = stationNamesAndShortCodes[i].stationName
    }
  }
  console.log(stationNameShort + " " + stationNameLong + " " + searchedStation)

  useEffect(() => {
    getStationShortcode()
  }, [])

  const classes = useStyles()

  // TABS

  function TabPanel(props) {
    const { children, value, index, id, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && <div>{children}</div>}
      </div>
    )
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  }

  function tabProps(index) {
    return {
      id: `${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    }
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
              options={stationNamesAndShortCodes}
              getOptionLabel={option => option.stationName}
              getOptionSelected={(option, value) =>
                option.stationName === value.stationName
              }
              //autoSelect
              //blurOnSelect
              style={{ width: 250, backgroundColor: "white" }}
              placeholder=""
              renderInput={params => (
                <TextField
                  {...params}
                  label="Hae aseman nimellä"
                  variant="filled"
                  onBlur={e => setSearchedStation(e.target.value)}
                />
              )}
            />
            <IconButton
              className={classes.SearchIcon}
              color="inherit"
              float="right"
              display="inline-flex"
              onClick={getTrains}
            >
              <SearchIcon fontSize="large" />
            </IconButton>
            <Typography variant="srOnly">Search</Typography>
          </div>
          <TableContainer component={Paper} style={{ marginTop: 60 }}>
            <Tabs
              value={0}
              variant="fullWidth"
              onChange={handleChange}
              aria-label="välilehdet"
            >
              <Tab label="Saapuvat" {...tabProps(0)} />
              <Tab label="Lähtevät" {...tabProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <SearchTrains trains={trains} stationNameShort={stationNameShort} stationNameLong={stationNameLong} stationNamesAndShortCodes={stationNamesAndShortCodes} searchType={searchTypeArrival}/>
            </TabPanel>
            <TabPanel value={value} index={1} >
              <SearchTrains trains={trains} stationNameShort={stationNameShort} stationNameLong={stationNameLong} stationNamesAndShortCodes={stationNamesAndShortCodes} searchType={searchTypeDeparture}/>
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
      main: "#f8f8f8",
      contrastText: "white",
    },
    action: { hover: "#eeeeee", active: "#eeeeee" },
    background: { default: "#eeeeee" },
  },
  typography: {
    fontFamily: font,
    fontWeight: 500,
    h6: {
      fontFamily: font,
      fontSize: "1.1rem",
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
    Tab: {
      fontFamily: font,
      fontSize: "1.1rem",
      fontWeight: 600,
    },
  },
  /*
  table: {
    minWidth:650,
    marginTop:10,
  },
  tabPanel: {
    width:'100%',
    minWidth:1000,
    marginTop:10,
  }*/
}))
