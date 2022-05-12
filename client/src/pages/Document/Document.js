import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    getDocumentDefinition,
    getLayout,
    saveDocument,
    setIsSuccess,
    clearError,
} from '../../features/documents/documentsSlice'

import {
    Message,
    Field,
} from '../../components'

const Document = () => {
    const dispatch = useDispatch()

    const documentDefinition = useSelector((state) => state.documents.documentDefinition)
    const layout = useSelector((state) => state.documents.layout)
    const loading = useSelector((state) => state.documents.loading)
    const isSuccess = useSelector((state) => state.documents.isSuccess)
    const error = useSelector((state) => state.documents.error)

    const [form, setForm] = useState({})
    const [document, setDocument] = useState([])

    const changeHandler = event => {
        if (isSuccess) {
            dispatch(setIsSuccess(false))
        }

        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const validateForm = () => {
        let isInvalidFields = false

        const formKeys = Object.keys(form)
        const documentFields = document.filter((item) => item.name && item._id)

        documentFields.forEach((field) => {
            if (!form[field.name]) {
                isInvalidFields = true
            }
        })

        if (!document || !formKeys.length || isInvalidFields) {
            return false
        }

        return true
    }

    const saveHandler = async () => {
        if (!validateForm()) {
            return
        }

        dispatch(setIsSuccess(false))
        dispatch(clearError())
        dispatch(saveDocument({ ...form }))
    }

    useEffect(() => {
        dispatch(getDocumentDefinition())
        dispatch(getLayout())
    }, [])

    useEffect(() => {
        const buildDocument = () => {
            if (!documentDefinition || !layout) {
                return null
            }
            
            const document = []
    
            const getValidFields = (column) => {
                const isActionField = !column.fieldId && column.actionType === 'save'
    
                return isActionField ? { ...column, _id: column.label } : documentDefinition.find((item) => item._id === column.fieldId)
            }
    
            layout.forEach((layoutSection) => {
                const fields = layoutSection.columns.map(getValidFields)
    
                document.push(...fields)
            })
    
            setDocument(document)
        }

        buildDocument()
    }, [documentDefinition, layout])

    return (
        <div className="container">
            <Message error={error} isSuccess={isSuccess} />

            {document ? <div className="row mt-4">
                <div className="col s8 offset-s2">
                    <div className="row">
                        {document.map((field) => {
                            return (
                                <Field
                                    key={field._id}
                                    field={field}
                                    loading={loading}
                                    onChangeHandler={changeHandler}
                                    onSaveHandler={saveHandler}
                                />
                            )
                        })}
                    </div>
                </div>
            </div> : null}
        </div>
    )
}

export default Document