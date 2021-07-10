import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// format for useSelector will be state.stock.items, stock refer to name attribute here
export const stockSlice = createSlice({
  name: 'stock',

  initialState: {
    items: [
      {
        code: "G3B.SI", name: "STI ETF", marketPlace: "SGX", currency: "SGD",
        marketValue: "30000", investedAmount: "25000",
        investedUnit: "10000", marketUnitPrice: "3", investedUnitPrice: "2.5"
      },
      {
        code: "CLR.SI", name: "Lion Phillip S-REIT", marketPlace: "SGX", currency: "SGD",
        marketValue: "40000", investedAmount: "50000",
        investedUnit: "10000", marketUnitPrice: "4", investedUnitPrice: "5"
      }
    ],
  },

  reducers: {
    add: async (state, action) => {
      const newStock = action.payload;

      // {type: "stock/add", payload: {firstName: "2222", lastName: "3333", userName: "444"}}
      const res = await axios.post('http://localhost:8080/stocks', newStock, {headers: {'content-type': 'application/json'}})
      const saved = res.data;
      if (saved.id) {
        state.items.push({...saved})
      }
    },
    remove: (state) => {
      state.items.pop();
    },
  },
})


export const { add, remove } = stockSlice.actions

export default stockSlice.reducer