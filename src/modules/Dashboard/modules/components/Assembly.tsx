import React, { useContext, useState, useEffect } from 'react'
import Select from 'react-select'
import yip from '../../service/dataHandler'
import apiGateway from '../../service/apiGateway'
import setupImg from '../../assets/Kindergarten student-bro 1.png'
import { DashboardContext } from '../../utils/DashboardContext'
import { clearError } from '../../utils/utils'
const assembly = () => {
    const { setCreate, setUpdateData } = useContext(DashboardContext)
    const [assembly, setAssembly] = useState('')
    const [district, setDistrict] = useState({ id: '', name: '' })
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState(false)
    const sendData = (): any => {
        if (isEvaluated()) {
            const postData: any = {
                name: assembly,
                district_id: district.id
            }
            const addUser = async (postData: any) => {
                apiGateway.post('/api/v1/yip/create-legislative-assembly/', postData)
                    .then((res) => {

                        setAssembly("")
                        setDistrict({ id: "", name: "" })
                        setSuccess(true)
                    })
                    .catch((err) => {
                        setError(err.response.data.message.general)
                        clearError(setError)
                    })
                    .finally(() => {
                        setTimeout(() => {
                            setSuccess(false)
                            setCreate(false)
                            setUpdateData((prev: boolean) => !prev)
                        }, 3000);
                    })
            }
            addUser(postData)

        }
    }

    return (
        <div className="white-container">
            <h3>Setup a new Legislative assembly</h3>
            <div className="setup-club">
                <div className="setup-filter">
                    <div className="select-container club">
                        <div className="setup-item" id="district">
                            <p>Name</p>
                            <input
                                type="text"
                                name="name"
                                placeholder='Type assembly Name'
                                id="username"
                                onChange={(e) => {
                                    if (e.target.value.length !== null && e.target.value.length !== undefined)
                                        setAssembly(e.target.value)
                                }} />
                        </div>
                        <div className="setup-item">
                            <p>District</p>
                            <Select
                                options={yip.district}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={`Select a District`}
                                getOptionValue={(option: any) => option.id}
                                getOptionLabel={(option: any) => option.name}
                                onChange={(data: any) => {
                                    if (data) {
                                        setDistrict(data)
                                    }
                                    else {
                                        setDistrict({ id: "", name: "" })
                                    }
                                }}
                            />
                        </div>
                        <div className="create_btn_cntr">
                            <button className={`${assembly === "" || district.id === '' ? 'grey-btn' : 'black-btn'}`} onClick={() => {
                                if (!(assembly === "" || district.id === ''))
                                    sendData()
                            }}>Add assembly</button>
                            <button className='black-btn' onClick={() => {
                                setCreate(false)
                                setAssembly("")
                                setDistrict({ id: "", name: "" })
                            }}>Cancel</button>
                        </div>

                    </div>

                </div>
                <div className="setup-img">
                    <img src={setupImg} alt="HI" />
                </div>

            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">User Added Successfully</p>}
        </div >
    )
    function isEvaluated() {
        if (assembly === '') {
            setError("Enter a assembly name")
            clearError(setError)
            return false
        }
        else if (district.name === '') {
            setError("Select a district")
            clearError(setError)
            return false
        }
        return true
    }
}

export default assembly