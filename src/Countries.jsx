import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'

export default function Countries() {
  const [myData, setMyData] = useState([])
  const [searchData, setSearchData] = useState([])
  useEffect(() => {
    const url = 'https://restcountries.com/v3.1/all'
    axios
      .get(url)
      .then((response) => {
        setMyData(response.data)
        setSearchData(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  const fetchData = (word) => {
    axios(`https://restcountries.com/v3.1/name/${word}`)
      .then((results) => {
        setSearchData(results.data)
      })
      .catch(() => {
        axios(`https://restcountries.com/v3.1/lang/${word}`)
          .then((results) => {
            setSearchData(results.data)
          }).catch(() => {
            axios(`https://restcountries.com/v3.1/capital/${word}`)
              .then((results) => {
                setSearchData(results.data)
              })
          })
      }).catch(setSearchData([]))
  }
  console.log(fetch);
  // const arr = name.data.concat(lang.data.filter((item) => name.data.indexOf(item) < 0))
  // const finalArr = arr.concat(city.data.filter((item) => arr.indexOf(item) < 0))
  // setSearchData(finalArr)

  function isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }
  const onChange = (e) => {
    //e.preventDefault()
    if (isBlank(e.target.value)) {
      setSearchData(myData)
    } else {
      fetchData(e.target.value)
    }
  }
  return (
    <div>
      <SearchDiv>
        <SearchBar placeholder='Search countries by name, city and languages' onChange={onChange} />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </SearchDiv>

      <BodyBackground>

        {searchData.map((v, i) => {
          let x = ''
          let y = ''
          const { currencies, languages, capital } = v
          for (const key in currencies) {
            x = currencies[key].name
          }
          for (const key in capital) {
            y = capital[key]
          }
          return (
            <Card key={i}>
              <ImageDiv>
                <CardImage src={v.flags?.png} />
              </ImageDiv>
              <TitleDiv><CountryTitle>{v.name.common}</CountryTitle></TitleDiv>
              <TextContent>
                <TextField>
                  <CountryLabel>Capital:</CountryLabel>
                  <CardText>{y}</CardText>
                </TextField>
                <TextField>
                  {languages &&
                    <><CountryLabel>{Object.keys(languages).length > 1 ? 'Languages:' : 'Language:'}</CountryLabel>
                      <CardText>{Object.keys(languages).map(language => <span key={language}> {languages[language]}</span>)}</CardText>
                    </>}
                </TextField>
                <TextField>
                  <CountryLabel>Population:</CountryLabel>
                  <CardText>{v.population}</CardText>
                </TextField>
                <TextField>
                  <CountryLabel>Currency:</CountryLabel>
                  <CardText>{x}</CardText>
                </TextField>
              </TextContent>
            </Card>
          )
        }
        )}
      </BodyBackground>
    </div>
  )
}

const SearchDiv = styled.div`
  background-color: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 150px;
`
const SearchBar = styled.input`
  font-size: 34px;
  height: fit-content;
  width: 800px;
  border-radius: 30px;
  background-color: rgba(188, 179, 216, 0.11);
  padding: 8px 34px;
  border: 2px solid black;
`

const BodyBackground = styled.div`
    background-color: rgb(240, 240, 240);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding: 24px;
`

const Card = styled.div`
background-color: white;
  width: 410px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 24px;
  margin:24px 24px;
  border-radius: 10px;
  transition: transform 500ms;
  &:hover{
      transform: scale(1.05, 1.05);
      box-shadow: 5px 5px 10px gray;
    }
`
const ImageDiv = styled.div`
  display: flex;
  height: 150px;
  width: 220px;
  justify-content: center;
  align-items: center;
  box-shadow: 10px 10px 20px gray;
`
const CardImage = styled.img`
  width: 100%;
  height: 100%;
`
const TitleDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6px;
  margin-bottom: 6px;
`

const CountryTitle = styled.p`
    font-size: 24px;
    font-weight: 500;
    text-shadow: 1px 1px 2px black;
`
const TextContent = styled.div`
  width: 300px;
`

const TextField = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const CountryLabel = styled.p`
  margin-right: 6px;
  font-size: 22px;
  font-weight: 600;
  color: gray;
  text-shadow: 1px 1px 1px black;
`
const CardText = styled.p`
  font-size: 22px;
  color: black;
  font-weight: 400;
`

