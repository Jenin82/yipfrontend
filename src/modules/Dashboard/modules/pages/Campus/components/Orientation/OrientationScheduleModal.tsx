import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CustomSelect } from '../../../../../components/CustomSelect/CustomSelect'
import { privateGateway } from '../../../../../../../services/apiGateway'
import { selectProps } from '../../../../utils/setupUtils'
import { CustomInput } from '../../../../../components/CustomInput/CustomInput'
import '../CampusModal/CampusModal.scss'
import { campusRoutes, tableRoutes } from '../../../../../../../services/urls'
import { updateClubStatus } from '../../../Club/clubAPI'
import { OrientationCompleteProps } from './Orientation'
import { error, errorCheck, errorMessage, success } from '../../../../../components/Toastify/ToastifyConsts'
const OrientationScheduleModal = ({ cancel, district, campusId }: { cancel: () => void, district: string, campusId: string }) => {
    const [coordinatorList, setCoordinatorList] = useState<selectProps[]>([])
    const [coordinator, setCoordinator] = useState<selectProps>({} as selectProps)
    const [modList, setModList] = useState<selectProps[]>([{
        id: 'Online',
        name: 'Online'
    },
    {
        id: 'Offline',
        name: 'Offline'
    }])
    const [mod, setMod] = useState<selectProps>({} as selectProps)
    const [date, setDate] = useState('')
    const [place, setPlace] = useState('')
    console.log(district)
    useEffect(() => {
        getListOfCoordinatorByDistrict(district, setCoordinatorList)
    }, [])
    return (
        <div className='secondary-box'>
            <div className="data-box">
                <div className="content">
                    <CustomSelect
                        option={coordinatorList}
                        header={'Coordinator'}
                        placeholder={'Select Coordinator'}
                        customCSS={{
                            className: "react-select-container",
                            classNamePrefix: "react-select"
                        }}
                        setData={setCoordinator}
                    />
                </div>
            </div>
            <div className="data-box">
                <div className="content">
                    <CustomSelect
                        option={modList}
                        header={'Mode of Delivery'}
                        placeholder={'Online/Offline'}
                        customCSS={{
                            className: "react-select-container",
                            classNamePrefix: "react-select"
                        }}
                        setData={setMod}
                    />
                </div>
            </div>
            <div className="data-box">
                <div className="content">
                    <CustomInput value={'Date'} type={'datetime-local'} data={date} setData={setDate} customCSS={'setup-item'} />
                </div>
            </div>
            <div className="data-box">
                <div className="content">
                    <CustomInput value={'Place'} data={place} setData={setPlace} customCSS={'setup-item'} />
                </div>
            </div>
            <div className='last-container'>
                <div className="modal-buttons">
                    <button className='btn-update ' onClick={() => createEvent(date, place, mod.id, coordinator.id, campusId, cancel)}>Add Orientation</button>
                    <button className="cancel-btn " onClick={cancel}>Cancel</button>
                </div>
            </div>
        </div>

    )
}
export default OrientationScheduleModal
function getListOfCoordinatorByDistrict(district: string, setCoordinatorList: Dispatch<SetStateAction<selectProps[]>>) {
    privateGateway.get(`${campusRoutes.districtCoordinator.listByDistrict}${district}/`)
        .then(res => res.data.response)
        .then(data => setCoordinatorList(data))
        .catch(err => console.error(err))
}
function createEvent(date: string, place: string, mod: string, coordinatorId: string, campusId: string, cancel: () => void) {

    privateGateway.post(campusRoutes.createEvent, {
        scheduled_date: date,
        mode_of_delivery: mod,
        place: place,
        description: 'Orientation Scheduling',
        status: 'Scheduled',
        districtCordinator: coordinatorId,
        clubId: campusId
    })
        .then(res => {
            privateGateway.put(tableRoutes.status.update, { clubId: campusId, clubStatus: 'Orientation Scheduled' })
                .then(res => {
					success();
                    cancel()
                })
                .catch(err => {
					errorCheck(err.response);
					errorMessage(err.response);
				})
        }
        ).catch(err => {
			errorCheck(err.response);
			errorMessage(err.response);
		})
}
export function listEvent(campusId: string, setData: Dispatch<SetStateAction<OrientationCompleteProps[]>>) {
    privateGateway.get(`${campusRoutes.listEvent}${campusId}/`)
        .then(res => res.data.response)
        .then(data => setData(data))
        .catch(err => console.error(err))
}