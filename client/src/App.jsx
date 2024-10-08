import React, { useEffect, useState } from 'react'

function App() {

  const [backData, setBackendData] = useState({}) 

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return (
    <div>
      {(typeof backData.test === 'undefined') ? (
        <p> Loading ...</p>
      ) : (
        backData.test.map((test, i) => (
          <p key={i}> {test} </p>
        ))
      )}
    </div>
  )
}

export default App
