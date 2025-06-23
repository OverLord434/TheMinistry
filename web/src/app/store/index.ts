import { configureStore } from '@reduxjs/toolkit'
import { institutionReducer } from 'entities/institut-form/model/slice'
import { institutionAutoCheckReducer } from 'entities/institut-form/model/slice-auto-check'

export const store = configureStore({
  reducer: {
    checkInstitution: institutionReducer,
    checkAuto: institutionAutoCheckReducer
  },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch