import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { http } from '../../lib/fetch'

const initialState = {
    documentDefinition: null,
    layout: null,
    loading: false,
    isSuccess: false,
    error: null,
}

export const getDocumentDefinition = createAsyncThunk(
    'documents/getDocumentDefinition',
    async (_) => {
        try {
            const data = await http('/api/documents/document-definition')

            return data.schema.fields
        } catch (error) {
            throw error
        }
    }
)

export const getLayout = createAsyncThunk(
    'documents/getLayout',
    async (_) => {
        try {
            const data = await http('/api/documents/layout')

            return data.header.rows
        } catch (error) {
            throw error
        }
    },
)

export const saveDocument = createAsyncThunk(
    'documents/saveDocument',
    async (payload, { dispatch }) => {
        try {
            const data = await http('/api/documents/document-definition', 'POST', payload)

            dispatch(setIsSuccess(true))

            return data
        } catch (error) {
            throw error
        }
    },
)

export const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setIsSuccess: (state, action) => {
            state.isSuccess = action.payload
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDocumentDefinition.pending, (state) => {
                state.loading = true
            })
            .addCase(getDocumentDefinition.fulfilled, (state, action) => {
                state.loading = false
                state.documentDefinition = action.payload
            })
            .addCase(getDocumentDefinition.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            })

            .addCase(getLayout.pending, (state) => {
                state.loading = true
            })
            .addCase(getLayout.fulfilled, (state, action) => {
                state.loading = false
                state.layout = action.payload
            })
            .addCase(getLayout.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            })

            .addCase(saveDocument.pending, (state) => {
                state.loading = true
            })
            .addCase(saveDocument.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(saveDocument.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            })
    },
})

export const { setIsSuccess, clearError } = documentsSlice.actions

export default documentsSlice.reducer
