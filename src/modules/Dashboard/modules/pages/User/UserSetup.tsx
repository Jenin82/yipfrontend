import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import setupImg from '../../../../../assets/Kindergarten student-bro 1.png'
import { CustomInput } from '../../../components/CustomInput/CustomInput'
import { CustomSelect } from '../../../components/CustomSelect/CustomSelect'
import '../../components/Setup.scss'
import { initialState, selectProps } from '../../utils/setupUtils'
import * as yup from 'yup'
import { showAlert, Error, Success } from '../../../components/Error/Alerts'
import { createUser, fetchUserRoles } from './UserApi'

interface UserTableProps {
    setViewSetup: Dispatch<SetStateAction<boolean>>
    updateUserData: Function
}
const UserSetup: FC<UserTableProps> = ({ setViewSetup, updateUserData }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState<string>('')
    const [password, setPassword] = useState("")
    const [role, setRole] = useState(initialState)
    const [roleList, setRoleList] = useState<selectProps[]>([])
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")


    const reset = () => {
        setName("")
        setEmail("")
        setPhone("")
        setPassword("")
        setRole(initialState)
        setViewSetup(false)
    }
    useEffect(() => {
        fetchUserRoles(setRoleList)
    }, [])

    function validate() {
        const validationSchema = yup.object().shape({
            name: yup.string().required('Name is required')
                .min(3, 'Name must be at least 3 characters'),
            email: yup.string().email('Invalid email').required('Email is required'),
            phone: yup
                .string()
                .matches(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/, 'Invalid phone number')
                .required('Phone number is required'),
            role: yup.string().required('Role is required'),
            password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        })
        return validationSchema.validate(
            { name: name, email: email, phone: phone, role: role.id, password: password },
            { abortEarly: true })
    }

    function handleCreate() {

        validate()
            .then(() => {
                createUser(name, email, phone, role.id, password, updateUserData, setViewSetup, setSuccessMessage, setErrorMessage)
            })
            .catch((err) => {
                console.log(err)
                showAlert(err.message, setErrorMessage)
            })
    }



    return (
        <div className="white-container">
            <h3>Setup a User</h3>
            <div className="setup-club">
                <div className="setup-filter">
                    <div className="select-container club">
                        <CustomInput value="Name" setData={setName} data={name} />
                        <CustomInput value="Email" type='email' setData={setEmail} data={email} />
                        <CustomInput value="Phone" type='phone' setData={setPhone} data={phone} />
                        <CustomSelect
                            option={roleList}
                            header='Role'
                            setData={setRole}
                            isSearchable={false}

                        />
                        <CustomInput value="Password" type="password" setData={setPassword} data={password} />
                        <div className="create-btn-container">
                            <button className="black-btn"
                                onClick={handleCreate}>Create</button>
                            <button className="black-btn"
                                onClick={reset}
                            >Cancel</button>
                        </div>
                    </div>
                </div>
                <div className="setup-img">
                    <img src={setupImg} alt="HI" />
                </div>
            </div>
            {errorMessage && <Error error={errorMessage} />}
            {successMessage && <Success success={successMessage} />}
        </div>
    )
}


export default UserSetup 