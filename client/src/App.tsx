import { useCallback, useEffect, useState } from 'react'
import LoadingIndicator from './Components/LoadingIndicator/LoadingIndicator'

function App() {
  // const [match_query, set_match_query] = useState<string>('')
  const [tableData, setTableData] = useState<any[]>([])
  const [selectedPasaran, setSelectedPasaran] = useState<string>('Bangkok')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // const handleMatchQueryInputChange = (event: any) => {
  //   set_match_query(event.target.value)
  // }

  const handleTarikDataButton = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/generate/fetch-bet?pasaran=${selectedPasaran.toUpperCase()}`
      )
      const res = await response.json()
      if (!response.ok) throw new Error(res.message)
      alert(res.message)
      setIsLoading(false)
    } catch (error: any) {
      alert(error.message || `Terjadi kesalahan ketika menarik data bet.`)
      setIsLoading(false)
    }
  }, [selectedPasaran, isLoading])

  const handleGenerateButton = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      setIsFetching(true)
      const response = await fetch(
        `/api/generate/fetch-prediksi?pasaran_query=${selectedPasaran.toUpperCase()}`
      )
      const res = await response.json()
      if (!response.ok) throw new Error(res.message)
      alert(res.message)
      setIsFetching(false)
      setIsLoading(false)
    } catch (error: any) {
      alert(error.message || `Terjadi kesalahan ketika menarik data bet.`)
      setIsLoading(false)
      setIsFetching(false)
    }
  }, [selectedPasaran/* , match_query */, isLoading])

  const handleClearData = useCallback(async () => {
    if (isLoading) return
    const confirmResult = window.confirm(
      'Apakah sudah yakin ingin menghapus data prediksi ini?'
    )

    if (confirmResult) {
      setIsLoading(true)
      setIsDeleting(true)
      fetch(`/api/generate/?pasaran_query=${selectedPasaran.toUpperCase()}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message)
        })
        .catch(error => {
          alert(error)
        })

      setIsLoading(false)
    } else {
      window.confirm(`Telah membatalkan menghapus data prediksi`)
    }
    setIsDeleting(false)
    setTableData([])
  }, [isLoading, selectedPasaran])

  useEffect(() => {
    fetch(`/api/generate/?pasaran_query=${selectedPasaran.toUpperCase()}`)
      .then(response => response.json())
      .then(res => {
        setTableData(res.data)
      })
      .catch(error => {
        alert(error)
      })
  }, [
    selectedPasaran,
    handleClearData,
    handleGenerateButton,
    handleTarikDataButton,
    isFetching,
    isDeleting,
  ])

  const handleSelectChange = (event: any) => {
    setSelectedPasaran(event.target.value)
  }

  return (
    <div className='App'>
      <header className='bg-blue-500 p-4 text-white'>
        <h1 className='text-2xl'>GENERATOR 4D(BETA)</h1>
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
      {/* <input
        type='text'
        value={match_query}
        onChange={handleMatchQueryInputChange}
        className='mt-4 border p-2 mr-4 rounded-lg border-gray-200 focus:bg-green-50 hover:bg-green-100'
        placeholder='Input match query ...'
      /> */}

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
        className='mt-4 bg-red-500 text-white p-2 ml-2 rounded-md  w-40'
      >
        {isLoading ? (
          <LoadingIndicator colorScheme='light' />
        ) : (
          'Clear Data Prediksi'
        )}
      </button>
      <div className='mt-4 border p-4'>
        <table>
          <thead>
            <tr>
              <th className='px-12'>Angka 1</th>
              <th className='px-12'>Angka 2</th>
              <th className='px-12'>Angka 3</th>
              <th className='px-24'>Total Omset</th>
              <th className='px-24'>Profit</th>
              <th className='px-48'></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data: any, index: any) => (
              <tr key={index}>
                <td className='py-2 px-12'>{data.angka_keluar[0]}</td>
                <td className='py-2 px-12'>{data.angka_keluar[1]}</td>
                <td className='py-2 px-12'>{data.angka_keluar[2]}</td>
                <td className='py-2 px-24'>{data.total_omset}</td>
                <td className='py-2 px-24'>{data.hasil}</td>
                <td className='py-2 px-48'>
                  <button className='bg-gray-200 p-1 rounded-lg disabled'>
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
