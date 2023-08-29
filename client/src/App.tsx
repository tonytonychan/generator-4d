import { useState } from 'react'
import LoadingIndicator from './Components/LoadingIndicator/LoadingIndicator'

function App() {
  const [inputValue, setInputValue] = useState<any>('')
  const [tableData, setTableData] = useState<any>([])
  const [selectedPasaran, setSelectedPasaran] = useState<any>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleMatchQueryInputChange = (event: any) => {
    setInputValue(event.target.value)
  }

  const handleTarikDataButton = () => {
    setIsLoading(true)
    setTableData([...tableData, inputValue])
    setInputValue('')
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleGenerateButton = () => {
    setIsLoading(true)
    setTableData([...tableData, inputValue])
    setInputValue('')
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleClearData = () => {
    setTableData([])
  }

  const handleSelectChange = (event: any) => {
    setSelectedPasaran(event.target.value)
  }

  return (
    <div className='App'>
      <header className='bg-blue-500 p-4 text-white'>
        <h1 className='text-2xl'>GENERATOR 4D</h1>
      </header>
      <select
        value={selectedPasaran}
        onChange={handleSelectChange}
        className='mt-4 border p-2 pr-10 ml-4 mr-4 rounded-md'
      >
        <option value=''>Pilih Pasaran</option>
        <option value='Bangkok'>Bangkok</option>
        <option value='Brazil'>Brazil</option>
        <option value='Brunei'>Brunei</option>
        <option value='Busan'>Busan</option>
        <option value='Cambodia'>Cambodia</option>
        <option value='Denmark'>Denmark</option>
        <option value='France'>France</option>
        <option value='Germany'>Germany</option>
        <option value='Hongkong'>Hongkong</option>
        <option value='Hungary'>Hungary</option>
        <option value='India'>India</option>
        <option value='Mexico'>Mexico</option>
        <option value='Malaysia'>Malaysia</option>
        <option value='Mongolia'>Mongolia</option>
        <option value='Myanmar'>Myanmar</option>
        <option value='Osaka'>Osaka</option>
        <option value='Philippines'>Philippines</option>
        <option value='Poland'>Poland</option>
        <option value='Seoul'>Seoul</option>
        <option value='Sweden'>Sweden</option>
        <option value='Taiwan'>Taiwan</option>
        <option value='TimorLeste'>TimorLeste</option>
        <option value='Vietnam'>Vietnam</option>
      </select>
      <input
        type='text'
        value={inputValue}
        onChange={handleMatchQueryInputChange}
        className='mt-4 border p-2 mr-4'
        placeholder='Input match query ...'
      />

      <button
        onClick={handleTarikDataButton}
        className='mt-4 bg-green-500 text-white p-2 rounded-md mr-2 w-40 '
      >
        {isLoading ? (
          <LoadingIndicator colorScheme='light' />
        ) : (
          'Tarik Data bet'
        )}
      </button>
      <button
        onClick={handleGenerateButton}
        className='mt-4 bg-blue-500 text-white p-2 rounded-md  w-40'
      >
        {isLoading ? (
          <LoadingIndicator colorScheme='light' />
        ) : (
          'Generate Angka 4D'
        )}
      </button>
      <button
        onClick={handleClearData}
        className='mt-4 bg-red-500 text-white p-2 ml-2 rounded-md'
      >
        Clear
      </button>
      <div className='mt-4 border p-4'>
        <table>
          <thead>
            <tr>
              <th className='px-12'>Angka</th>
              <th className='px-24'>Total Omset</th>
              <th className='px-48'></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data: any, index: any) => (
              <tr key={index}>
                <td className='py-2 px-12'>{data}</td>
                <td className='py-2 px-24'>{data}</td>
                <td className='py-2 px-48'>
                  <button className='bg-yellow-200 p-2 rounded-lg'>
                    See Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
