import { useCallback, useEffect, useState } from 'react'
import LoadingIndicator from './Components/LoadingIndicator/LoadingIndicator'
import { Helmet } from 'react-helmet'
import { Switch } from '@headlessui/react'
import { class_names } from './utils/class-names'
import React from 'react'

function App() {
  const [tableData, setTableData] = useState<any[]>([])
  const [selectedPasaran, setSelectedPasaran] = useState<string>('Bangkok')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [show_twin, set_show_twin] = useState(false)
  const [show_yesterday, set_show_yersterday] = useState(false)

  const [expandedRow, setExpandedRow] = useState(null)

  const handleButtonClick = (index: any) => {
    setExpandedRow(index === expandedRow ? null : index)
  }

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
        `/api/generate/fetch-prediksi?pasaran_query=${selectedPasaran.toUpperCase()}&show_kembar=${show_twin}&show_kemarin=${show_yesterday}`
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
  }, [selectedPasaran, isLoading, show_twin])

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
      <Helmet>
        <title>{`[ Live - GENERATOR 4D] - DASHBOARD`}</title>
      </Helmet>
      <header className='bg-blue-500 p-4 text-white'>
        <h1 className='text-2xl'>GENERATOR 4D</h1>
      </header>

      <Switch.Group
        as='div'
        className='bg-blue-50 flex mt-3 items-center ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-chestnut-rose-600 rounded-md px-3 py-4 ml-2'
      >
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
        <div className='flex flex-col'>
          <Switch
            checked={show_twin}
            onChange={set_show_twin}
            className={class_names(
              show_twin ? 'bg-gray-200' : 'bg-gray-200',
              'ml-1 mr-4 mt-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
            )}
          >
            <span
              className={class_names(
                show_twin ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              )}
            >
              <span
                className={class_names(
                  show_twin
                    ? 'opacity-0 duration-100 ease-out'
                    : 'opacity-100 duration-200 ease-in',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                )}
                aria-hidden='true'
              >
                <svg
                  className='h-3 w-3 text-gray-400'
                  fill='none'
                  viewBox='0 0 12 12'
                >
                  <path
                    d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
              <span
                className={class_names(
                  show_twin
                    ? 'opacity-100 duration-200 ease-in'
                    : 'opacity-0 duration-100 ease-out',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                )}
                aria-hidden='true'
              >
                <svg
                  className='h-3 w-3 text-chestnut-rose-600'
                  fill='currentColor'
                  viewBox='0 0 12 12'
                >
                  <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                </svg>
              </span>
            </span>
          </Switch>
          <span className='text-sm ml-1'>Kembar</span>
        </div>
        <div className='flex flex-col'>
          <Switch
            checked={show_yesterday}
            onChange={set_show_yersterday}
            className={class_names(
              show_yesterday ? 'bg-gray-200' : 'bg-gray-200',
              'ml-1 mr-4 mt-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
            )}
          >
            <span
              className={class_names(
                show_yesterday ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              )}
            >
              <span
                className={class_names(
                  show_yesterday
                    ? 'opacity-0 duration-100 ease-out'
                    : 'opacity-100 duration-200 ease-in',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                )}
                aria-hidden='true'
              >
                <svg
                  className='h-3 w-3 text-gray-400'
                  fill='none'
                  viewBox='0 0 12 12'
                >
                  <path
                    d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
              <span
                className={class_names(
                  show_yesterday
                    ? 'opacity-100 duration-200 ease-in'
                    : 'opacity-0 duration-100 ease-out',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                )}
                aria-hidden='true'
              >
                <svg
                  className='h-3 w-3 text-chestnut-rose-600'
                  fill='currentColor'
                  viewBox='0 0 12 12'
                >
                  <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                </svg>
              </span>
            </span>
          </Switch>
          <span className='text-sm ml-1'>Kemarin</span>
        </div>

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
      </Switch.Group>
      <div className='mt-4 border p-4'>
        <table>
          <thead>
            <tr>
              <th className='px-12'>Angka 1</th>
              <th className='px-12'>Angka 2</th>
              <th className='px-12'>Angka 3</th>
              <th className='px-24'>Total Omset</th>
              <th className='px-24'>Profit</th>
              <th className='px-24'>% Margin</th>
              <th className='px-48'></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className='py-2 px-12'>{data.angka_keluar[0]}</td>
                  <td className='py-2 px-12'>{data.angka_keluar[1]}</td>
                  <td className='py-2 px-12'>{data.angka_keluar[2]}</td>
                  <td className='py-2 px-24'>{data.total_omset}</td>
                  <td className='py-2 px-24'>{data.hasil}</td>
                  <td className='py-2 px-24'>
                    {Math.round(
                      (+data.hasil / +data.total_omset) * 100
                    ).toFixed(1)}
                    %
                  </td>
                  <td className='py-2 px-48'>
                    <button
                      className='bg-gray-200 p-1 rounded-lg w-24'
                      onClick={() => handleButtonClick(index)}
                    >
                      {expandedRow === index ? 'Close' : 'See Detail'}
                    </button>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr className='border border-blue-400 border-separate'>
                    <td>2D DEPAN : {data.details[index]['2D Depan']}</td>
                    <td>2D TENGAH : {data.details[index]['2D Tengah']}</td>
                    <td>2D BELAKANG : {data.details[index]['2D Belakang']}</td>
                    <td>3D : {data.details[index]['3D']}</td>
                    <td>4D : {data.details[index]['4D']}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
