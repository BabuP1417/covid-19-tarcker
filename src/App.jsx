import { useEffect, useState } from "react";
import { Card, CardContent, FormControl, MenuItem, Select } from '@mui/material'
import './App.css'
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
    <h1>COVID-19 Tracker</h1>
    <FormControl className="app__dropdown">
      <Select
        variant="outlined"
        value={country}
        onChange={onCountryChange}
      >
        <MenuItem value="worldwide">Worldwide</MenuItem>
        {countries.map((country) => (
          <MenuItem value={country.value}>{country.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>

  <div className="app__stats">
    <InfoBox 
    isRed
    active={casesType === "cases"} onClick={(e) => setCasesType("cases")} title="Coronavirus Cases" 
    cases={prettyPrintStat(countryInfo.todayCases)}
    total={numeral(countryInfo.cases).format("0.0a")}/>
    
    <InfoBox 
    active={casesType === "recovered"}onClick={(e) => setCasesType("recovered")}title="Recovered"
    cases={prettyPrintStat(countryInfo.todayRecovered)}
    total={numeral(countryInfo.recovered).format("0.0a")}/>

    <InfoBox 
    isRed active={casesType === "deaths"} onClick={(e) => setCasesType("deaths")}
    title="Deaths"
    cases={prettyPrintStat(countryInfo.todayDeaths)}
    total={numeral(countryInfo.deaths).format("0.0a")}/>
  </div>

  <Map
  casesType={casesType}
  countries={mapCountries}
  center={mapCenter}
  zoom={mapZoom}  
  />

    
  </div>
  <Card className="app__right">
    <CardContent>
      <h3>Live cases by Country</h3>
      <Table countries={tableData} />
      <h3>Worldwide new {casesType}</h3>
      <LineGraph casesType={casesType} />
    </CardContent>

  </Card>
  </div>
  )
}

export default App
