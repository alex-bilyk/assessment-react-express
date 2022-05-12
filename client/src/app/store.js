import { configureStore } from '@reduxjs/toolkit'

import documentsReducer from '../features/documents/documentsSlice'

export const store = configureStore({
  reducer: {
    documents: documentsReducer,
  },
})
