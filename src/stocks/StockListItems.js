import { useMemo } from 'react'

export default function StockListItems(props) {
    
    // const items = useSelector((state) => state.stock.items) 

    return useMemo(() => {
        const items = props.items;

        if (items.length > 0) {
            return items.map((v, i) =>
                    <tr key={"item-"+i}> 
                        <td>{i+1}</td>
                        <td>{v.code}</td>
                        <td>{v.name}</td>
                        <td>{v.marketPlace}</td>
                        <td>{v.currency}</td>
                        <td>{v.marketValue}</td>
                        <td>{v.investedAmount}</td>
                        <td>{v.unitNumbber}</td>
                        <td>{v.marketUnitPrice}</td>
                        <td>{v.investedUnitPrice}</td>
                    </tr>)
        }
        else {
            return <tr><td colSpan="10">No items</td></tr>
        }

    }, [props.items]);
    
}
