import { useEffect, useReducer } from 'react';

const defaultStocks = [
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
];

const stockReducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return [ ...state.filter( stock => stock.id !== action.stock.id ), action.stock ];

        case 'all':
            return action.allStocks;
        
        default:
            throw new Error('no type provided: ' + action);
    }
}

export default function useStockFetcher() {

    const [items, dispatch] = useReducer(stockReducer, []);

    useEffect(() => {
        fetch('http://localhost:8080/stocks/', {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
            .then(res => res.json())
            .then(allStocks => {
                dispatch({ type: "all", allStocks: allStocks });
            })
            .catch(err => {
                console.error('failed to get all stocks; using any default stocks', err);
                dispatch({ type: "all", allStocks: defaultStocks});
            });
    }, []);

    return { items, dispatch };

}