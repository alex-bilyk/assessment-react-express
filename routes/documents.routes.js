const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')

const router = Router()

let documentDefinitionData = null
let layoutData = null

function getDataFiles() {
    try {
        documentDefinitionData = require('../config/document-definition.json')
        layoutData = require('../config/layout.json')
    } catch(error) {
        console.log(error.message)
    }
}

getDataFiles()

const checkValidDocuments = async () => {
    if (!documentDefinitionData || !layoutData) {
        return Promise.reject(new Error('Document is incorrect'))
    }

    const document = []

    const getValidFields = (column) => {
        const isActionField = !column.fieldId && column.actionType === 'save'

        return isActionField ? { ...column, _id: column.label } : documentDefinitionData.schema.fields.find((item) => item._id === column.fieldId)
    }

    layoutData.header.rows.forEach((layoutSection) => {
        const fields = layoutSection.columns.map(getValidFields)

        document.push(...fields)
    })

    if (document.length === 0) {
        return Promise.reject(new Error('Document is empty'))
    }

    return Promise.resolve(true)
}

router.get('/document-definition', async (_, res) => {    
    try {
        await checkValidDocuments()

        res.json(documentDefinitionData)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

router.get('/layout', async (_, res) => {
    try {
        await checkValidDocuments()

        res.json(layoutData)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

router.post(
    '/document-definition',
    [
        check('name', 'Invalid name').isString().not().isEmpty(),
        check('age', 'Invalid age').isInt().not().isEmpty()
    ],
    (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data'
            })
        }

        const { email, age } = req.body
        
        const document = {
            id: uuidv4(),
            email,
            age
        }

        return res.status(201).json({ id: document.id })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router