import { configureStore } from '@reduxjs/toolkit'
import commonReducer from './features/common'

export const store = configureStore({
  reducer: {
    common: commonReducer,
  },
})

export default store