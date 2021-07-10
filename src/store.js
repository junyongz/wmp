import { configureStore } from '@reduxjs/toolkit'
import stockReducer from './features/stockSlicer';

export default configureStore({
  reducer: {
      stock: stockReducer
  },
})