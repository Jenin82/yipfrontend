import React, { useState, useEffect, useContext } from "react"
import Select from "react-select"
import "./Setup.scss"
import setupImg from "../../assets/Kindergarten student-bro 1.png"
import apiGateway from "../../service/apiGateway"
import yip from "../../service/dataHandler"
import { DashboardContext } from "../../utils/DashboardContext"

interface SelectItemProps {
  item: string
  list: any
}

interface DistrictProps {
  id: string
  name: string
}

interface CollegeProps {
  id: string
  title: string
}


const ClubSetup = () => {
  const { dataUpdate, setUpdateData, setCreate } = useContext(DashboardContext)
  const [districts, setDistricts] = useState<DistrictProps[]>([])
  const [college, setCollege] = useState<CollegeProps[]>([])
  const [districtSelected, setDistrictSelected] = useState("")
  const [districtName, setDistrictName] = useState("")
  const [collegeSelected, setCollegeSelected] = useState("")
  const [collegeName, setCollegeName] = useState("")
  const [actions, setActions] = useState("")
  const [error, setError] = useState("")
  const handleDistrict = (data: any) => {
    console.log("dist selected : ", data)
    setDistrictSelected(data.id)
    setDistrictName(data.name)
  }
  useEffect(() => {
    const reqData: any = {
      district: districtName,
    }
    //console.log(districtSelected)
    if (districtSelected) {
      const fetchData = async () => {
        apiGateway.post(`/api/v1/yip/list-colleges/`, reqData)
          .then(({ data }) => {
            const { institutions } = data.response;
            setCollege(institutions);
          })
          .catch(error => console.error(error));
      }
      fetchData()
    }
  }, [districtSelected, dataUpdate])

  const sendData = (): any => {
    const postData: any = {
      club_name: collegeName,
      institute_type: "College",
      institute_id: collegeSelected,
      district_id: districtSelected,
    }
    const createData = async () => {
      // console.log(postData)
      apiGateway.post(`/api/v1/yip/create-college-club/`, postData)
        .then((response) => {
          setUpdateData((prev: any) => !prev)
          setActions("Club created " + " " + collegeName + " " + "IN" + " " + districtName)
        })
        .catch(error => {
          console.log(error)
          setActions("Club already exists")
        })
        .finally(() => {
          setDistrictSelected("")
          setDistrictName("")
          setCollegeSelected("")
          setCollegeName("")
          setTimeout(() => {
            setActions("")
            setCreate(false)
          }, 3000)
        })
    }
    createData()
  }

  return (
    <div className="white-container">
      <h3>Setup a new Club</h3>
      {error && <div className="setup-error">
        {error}
      </div>}
      <div className="setup-club">
        <div className="setup-filter">
          {!actions ? <div className="select-container club">
            <div className="setup-item" id="district">
              <p>District</p>
              <Select
                options={yip.district}
                noOptionsMessage={() => `Districts are Loading`}
                isSearchable={true}
                isClearable={true}
                placeholder={districtName ? districtName : `Select a District`}
                getOptionValue={(option: any) => option.id}
                getOptionLabel={(option: any) => option.name}
                onChange={(e) => {
                  try {
                    handleDistrict(e)
                  } catch (error) {
                    setDistrictSelected('')
                    setDistrictName('')
                  }
                }
                }
              />
            </div>
            {districtSelected && <div className="setup-item" >
              <p>College</p>
              <Select
                options={college}
                noOptionsMessage={() => `Colleges are Loading`}
                isSearchable={true}
                isClearable={true}
                placeholder={collegeName ? collegeName : `Select a College`}
                getOptionValue={(option: any) => option.id}
                getOptionLabel={(option: any) => option.title}
                onChange={(data: any) => {
                  try {
                    setCollegeName(data.title)
                    setCollegeSelected(data.id)

                  } catch (error) {
                    setCollegeName('')
                    setCollegeSelected('')
                  }
                }}
              />
            </div>}
            <div className="create_btn_cntr">
              <button id="create_btn" className={`${collegeName ? 'black-btn' : 'grey-btn'}`}
                onClick={() => {
                  if (!districtName) {
                    setError("Select a District")
                  }
                  else if (!collegeName) {
                    setError("Select a College")
                  }
                  else {
                    sendData()
                  }
                  setTimeout(() => {
                    setError("")
                  }, 3000)
                }
                }>
                Create
              </button>
              <button className="black-btn" onClick={() => setCreate(false)}>
                Cancel
              </button>
            </div>

          </div>
            : <div className="actions">{actions}</div>}
        </div>
        <div className="setup-img">
          <img src={setupImg} alt="HI" />
        </div>
      </div>
    </div >
  )
}

export default ClubSetup
