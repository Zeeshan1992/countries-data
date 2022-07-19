import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import styled from 'styled-components'

function Population({ total, countryPop }) {
  return (
    <div>
      <Bars>
        <TextDiv>
          <BarText>World</BarText>
        </TextDiv>
        <div>
          <BarContainer >
            <Bar width={`${(total / total) * 100}%`} />
          </BarContainer>
        </div>
        <div>
          <BarText>{total}</BarText>
        </div>
      </Bars>
      {countryPop.map((v, i) => {
        return (
          <Bars key={i}>
            <TextDiv>
              <BarText>{Object.keys(v)[0] === "United States" ? "USA" : Object.keys(v)[0]}</BarText>
            </TextDiv>
            <BarContainer >
              <Bar width={`${(Object.values(v)[0] / total) * 100}%`} />
            </BarContainer>
            <BarText>{Object.values(v)[0]}</BarText>
          </Bars>
        )
      })}
    </div>

  )
}

function Language({ total, countryLang }) {
  console.log(countryLang);
  return (
    <Lang>
      {countryLang.map((v, i) => {
        return (
          <Bars key={i}>
            <TextDiv>
              <BarText>{v[0]}</BarText>
            </TextDiv>
            <BarContainer>
              <Bar width={`${(v[1] / total) * 100}%`} />
            </BarContainer>
            <BarText>{v[1]}</BarText>
          </Bars>
        )
      })}
    </Lang>
  )
}

export default function Countries() {
  const [myData, setMyData] = useState([])
  const [searchData, setSearchData] = useState([])
  const [activeTab, setActiveTab] = useState('population')
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
  let total = 0
  const count = {}
  const countryPop = []
  const countryLang = []
  myData.forEach(element => {
    total += element.population
    const { languages } = element
    for (const key in languages) {
      if (count[languages[key]]) {
        count[languages[key]] += 1
      } else {
        count[languages[key]] = 1
      }
    }
    if (element.population > 128932553) {
      countryPop.push({ [element.name.common]: element.population, population: element.population })
    }
  });
  const arr = Object.entries(count)
  arr.forEach(element => {
    if (element[1] > 3) {
      countryLang.push(element)
    }
  })
  const text1 = '10 Most populated countries in the world'
  const text2 = '10 Most spoken languages in the world'
  countryPop.sort((a, b) => a.population - b.population).reverse()
  countryLang.sort((a, b) => a[1] - b[1]).reverse();

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
  const bottom = useRef(null)

  const scrollToBottom = () => {
    bottom.current.scrollIntoView({ behavior: "auto" })
  }
  return (
    <div>
      <SearchDiv>
        <SearchBar placeholder='Search countries by name, city and languages' onChange={onChange} />
        <Icon onClick={scrollToBottom}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </Icon>
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
      <div className='flex flex-col items-center'>
        <Breakline />
        <div>
          <BarButton onClick={() => setActiveTab('population')} >Population</BarButton>
          <BarButton onClick={() => setActiveTab('language')}>Languages</BarButton>
        </div>
        <BarText>{activeTab === 'population' ? text1 : text2}</BarText>
        <BarDiv ref={bottom}>
          <Div>
            {activeTab === 'population' ? <Population total={total} countryPop={countryPop} /> : <Language total={91} countryLang={countryLang.splice(0, 10)} />}
          </Div>
        </BarDiv>
      </div>
      <Breakline className='h-2.5' />
      <Footer>
        <Icon className='flex justify-end' onClick={()=> {window.scrollTo(0,0)}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
        </Icon>
      </Footer>
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

const Footer = styled.div`
  background-color: rgb(240, 240, 240);
  height: 400px;
`
const BarDiv = styled.div`
  background-color: rgb(240, 240, 240);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 482px;
  width: 99%;
  margin-top: 20px;
`
const Icon = styled.span`
  &:hover{
    cursor: pointer;
  }
`
const Div = styled.div`
`
const Bars = styled.div`
  display: flex;
  margin-bottom: 5px;
`

const BarButton = styled.button`
  font-size: 24px;
  border-radius: 4px;
  border: 1px solid red;
  margin-right: 20px;
  margin-bottom: 10px;
  background-color: orange;
  padding: 5px 20px;
`
const BarText = styled.p`
  font-size: 22px;
  color: black;
  font-weight: 500;
`
const TextDiv = styled.div`
width: 128px;
`
const BarContainer = styled.div`
  width: 942px;
  height: 35px;
  margin-right: 10px;
`
const Bar = styled.div`
  width: ${props => props.width};
  height: 35px;
  background-color: orange;
  border-radius: 4px;
`
const Breakline = styled.hr`
  margin-top: 50px;
  margin-bottom: 10px;
  width: 100%;
  box-shadow: 0 0 4px 1px rgba(51,51,51,.2)
`
const Lang = styled.div`
  height: 440px;
`

