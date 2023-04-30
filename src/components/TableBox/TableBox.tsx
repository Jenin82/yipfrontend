import React, { useState, useEffect } from 'react'
import './TableBox.scss'
import fakeData from './fakeData.json'
import Select, { StylesConfig } from 'react-select';
import apiGateway from '../../service/apiGateway';
import yip from '../../service/dataHandler';
const schoolTableTitle = ["SL", "Name", "District", "Status", "Legislative Assembly", "Block", "Manage"]
const clubTableTitle = ["SL", "Name", "District", "Status", "Manage"]
const userTableTitle = ["SL", "Name", "Email", "Phone", "Role", "Status"]


interface tableProps {
    current_option: string
    institutions: any
    update: any
    setCreate: any
    setUpdateData: any
    dataUpdate: any
}

interface tableBoxProps {
    id: string,
    name: string,
    institute_type: string,
    legislative_assembly: string,
    status: boolean,
}


const TableBox: React.FC<tableProps> = ({ current_option, institutions, update, dataUpdate, setCreate, setUpdateData }) => {
    const [showFilterBox, setShowFilterBox] = useState(false);
    const [filterItem, setFilterItem] = useState("All")
    const [showSortBox, setShowSortBox] = useState(false);
    const [districts, setDistricts] = useState([])
    const [tableData, setTableData] = useState<tableBoxProps[]>([])
    const [modalTrigger, setModalTrigger] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleteId, setDeleteId] = useState("")
    const [deleteData, setDelete] = useState<boolean>(false)
    const [status, setStatus] = useState([])
    const [statusFilter, setStatusFilter] = useState("All")
    const [selectedData, setSelectedData] = useState<any>({})
    useEffect(() => {
        setPagination(1)
        if (statusFilter === "All" && filterItem === "All") {
            setTableData(institutions)
        }
        else if (statusFilter !== "All" && filterItem !== "All") {
            setTableData(institutions.filter((item: any) => {
                return item.club_status === statusFilter && item.district === filterItem
            }))
        }
        else if (filterItem !== "All" && statusFilter === "All") {
            setTableData(institutions.filter((item: any) => item.district === filterItem && true))
        }
        else if (statusFilter !== "All" && filterItem === "All") {

            setTableData(institutions.filter((item: any) => item.club_status === statusFilter && true))
            console.log(institutions.filter((item: any) => item.club_status === statusFilter && true))
        }
    }, [filterItem, statusFilter, update])
    const [club, setClub] = useState<any>({})

    const sendData = (club_id: string, club_status: string): any => {
        const postData: any = {
            club_id: club_id,
            club_status: club_status
        }
        const updateStatus = async () => {
            apiGateway.put(`/api/v1/yip/update-club/`, postData)
                .then((res) => {
                    setClub({})
                    setUpdateData((prev: any) => !prev)
                })
                .catch(error => console.error(error))
        }
        updateStatus()
    }

    let tableTitle = []
    if (current_option === "Model School") {
        tableTitle = schoolTableTitle
    } else if (current_option === "YIP Club") {
        tableTitle = clubTableTitle
    } else {
        tableTitle = userTableTitle
    }

    const handleFilterClick = () => {
        setShowFilterBox(!showFilterBox);
        setShowSortBox(false);
    }

    const handleSortClick = () => {
        setShowSortBox(!showSortBox);
        setShowFilterBox(false);
    }

    const handleDelete = (schoolId: any) => {
        const fetchData = async () => {
            apiGateway.delete(`/api/v1/yip/delete-model-schools/${schoolId}/`)
                .then(res => {
                    setUpdateData((prev: any) => !prev)
                })
                .catch(error => console.error(error));
        }
        fetchData()
    }

    const [page, setPagination] = useState(1)

    function paginateArray<T>(array: T[], page: number): T[] {
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        return array.slice(startIndex, endIndex);
    }

    useEffect(() => {
        if (confirmDelete) {
            handleDelete(deleteId)
        }
        setModalTrigger(false)
        setConfirmDelete(false)
    }, [confirmDelete])

    return (
        <>

            {modalTrigger && <div className="modal-overlay">

                <table className="modal">
                    <div className='close'>
                        <div onClick={() => { setConfirmDelete(false); setModalTrigger(false) }}>x</div>
                    </div>
                    <tbody className='outer'>
                        <tr className='inner'>
                            <td>{yip.page}</td>
                            <td>{selectedData.name}</td>
                        </tr>
                        <tr className='inner'>
                            <td className=''>District</td>
                            <td>{selectedData.district}</td>
                        </tr>
                        {selectedData.legislative_assembly &&
                            <tr className='inner'>
                                <td className=''>Legislative Assembly</td>
                                <td>{selectedData.legislative_assembly}</td>
                            </tr>
                        }
                        {selectedData.block &&
                            <tr className='inner'>
                                <td className=''>BRC</td>
                                <td>{selectedData.block}</td>
                            </tr>
                        }
                        <tr className='inner'>
                            <td><Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={yip.clubStatus}
                                isSearchable={true}
                                placeholder={selectedData.club_status}
                                getOptionValue={(option: any) => option.id}
                                getOptionLabel={(option: any) => option.name}
                                onChange={(data: any) => {
                                    setClub({ id: selectedData.id, status: data.name })
                                }}
                            />
                            </td>
                            <td>
                                <div className={`${(club.status && selectedData.club_status !== club.status) ? 'btn-update ' : 'btn-disabled'}`}
                                    onClick={() => {
                                        if (club) {
                                            sendData(club.id, club.status)
                                            setModalTrigger(false)
                                        }
                                    }}>
                                    Update Status
                                </div>
                            </td>

                        </tr>
                    </tbody>
                    {deleteData && <p>Are you sure you want to delete this item?</p>}
                    <div className="modal-buttons">
                        {deleteData ?
                            <button onClick={() => {
                                handleDelete(selectedData.id)
                                setSelectedData('')
                                setDelete(false)
                                setModalTrigger(false)
                                update()
                            }} className="confirm-delete">Delete</button>
                            : <button onClick={() => { setDelete(true) }} className="confirm-delete">Delete</button>}
                        <button onClick={() => { setConfirmDelete(false); setModalTrigger(false); selectedData({}) }} className="cancel-delete">Cancel</button>
                    </div>
                </table>
            </div>}

            <div className='white-container container-table'>
                <div className="table-top">
                    <h3>{current_option} List</h3>

                    <div className='table-fn'>
                        <div className="table-fn-btn" onClick={() => {
                            setCreate(true)
                        }}>
                            <i className="fa-solid fa-plus"></i>
                            <p>Add {current_option}</p>
                        </div>
                        <div className="table-fn-btn" onClick={handleFilterClick}>
                            <i className="fa-solid fa-filter"></i>
                            <p>Filter</p>
                        </div>
                        {showFilterBox && <button
                            className='table-fn-btn '
                            onClick={() => {
                                setShowFilterBox(false);
                                setFilterItem("All")
                                setStatusFilter("All")
                            }}
                        >Close</button>}
                    </div>
                </div>

                {showFilterBox && <div className="filter-container">

                    <div className="filter-box">
                        <Select
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    minWidth: "200px",
                                }),
                            }}
                            options={yip.district}
                            isSearchable={true}
                            isClearable={true}
                            placeholder={`Select a District`}
                            getOptionValue={(option: any) => option.id}
                            getOptionLabel={(option: any) => option.name}
                            onChange={(data: any) => {
                                try {
                                    setFilterItem(data.name)
                                } catch (error) {
                                    setFilterItem("All")
                                }
                            }}
                        />
                        <Select
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    minWidth: "200px",
                                }),
                            }}
                            options={yip.clubStatus}
                            isSearchable={true}
                            isClearable={true}
                            placeholder={`Select a Status`}
                            getOptionValue={(option: any) => option.id}
                            getOptionLabel={(option: any) => option.name}
                            onChange={(data: any) => {
                                try {
                                    setStatusFilter(data.name)
                                } catch (error) {
                                    setStatusFilter("All")
                                }
                            }}
                        />

                    </div>

                </div>}

                <table>
                    <thead>
                        <tr>
                            {
                                tableTitle.map((item: any, index: number) => {
                                    return <th key={index} className={`${item === 'Status' ? 'stat' : ''}`} > {item}</th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (paginateArray(tableData, page))
                                .map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td >{(page - 1) * 10 + i + 1}</td>
                                        <td className='name'>{item.name}</td>
                                        <td className='district'>{item.district}</td>
                                        {item.club_status && <td className='status' >
                                            {item.club_status}
                                        </td>}
                                        {item.legislative_assembly && <td >{item.legislative_assembly}</td>}
                                        {item.block && <td >{item.block}</td>}
                                        {item.club_status && <td >
                                            <a onClick={() => { setModalTrigger(true); setDeleteId(item.id); setSelectedData(item) }}>
                                                <i className="fas fa-trash"></i>Edit
                                            </a>
                                        </td>}
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
                {!(tableData.length) && <div className="no-data-table">
                    No data available{filterItem !== 'All' ? ` for district ${filterItem}` : ''} {statusFilter !== 'All' ? ` for status ${statusFilter}` : ''}
                </div>}
                <Paginator setPagination={setPagination} page={page} tableData={tableData} />

            </div >
        </>
    )
}
const Paginator = (props: any) => {
    return (
        <div className='paginator'>
            <div>
                <div onClick={() => { props.setPagination(1) }}>
                    <i   >{"|<<"}</i>
                </div>
                <div onClick={() => { props.setPagination(props.page > 1 ? props.page - 1 : 1) }}>
                    <i >{"|<"}</i>
                </div>

                <input type="text" value={`${props.page} / ${Math.trunc(props.tableData.length / 10) + (props.tableData.length % 10 ? 1 : 0)}`} min={1} max={props.tableData.length / 10 + (props.tableData.length % 10 ? 0 : 1)} onChange={(e) => {
                    props.setPagination(Number(e.target.value))
                }} />
                <div onClick={() => { if (props.page < Math.trunc(props.tableData.length / 10) + (props.tableData.length % 10 ? 1 : 0)) props.setPagination(props.page + 1) }}>
                    <i >{">|"}</i></div>
                <div onClick={() => { props.setPagination(Math.trunc(props.tableData.length / 10) + (props.tableData.length % 10 ? 1 : 0)) }}>
                    <i >{">>|"}</i>
                </div>
            </div>
        </div>
    )
}
export default TableBox
