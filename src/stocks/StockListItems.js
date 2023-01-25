import { useMemo } from 'react'

export default function StockListItems(props) {
    
    // const items = useSelector((state) => state.stock.items) 

    const { items } = props;

    return useMemo(() => {

        const { setShowView, setViewItem } = props;

        const showViewDetailModal = (idx, evt) => {
            evt.preventDefault();
            setShowView(true);
            setViewItem(items[idx]);
        }

        if (items.length > 0) {
            return items.map((v, i) =>
                    <tr key={i}> 
                        <td>{i+1}</td>
                        <td>{v.code}</td>
                        <td><a className="text-decoration-none text-info" href={"stock/showViewDetailModal(" + v.code + ")"} 
                                onClick={(e) => showViewDetailModal(i, e)}>{v.name}</a>
                        </td>
                        <td>{v.marketPlace}</td>
                        <td>{v.currency}</td>
                        <td>{v.marketValue}</td>
                        <td>{v.investedAmount}</td>
                        <td>{v.unitNumber}</td>
                        <td>{v.marketUnitPrice}</td>
                        <td>{v.investedUnitPrice}</td>
                    </tr>)
        }
        else {
            return <tr><td colSpan="10">No items</td></tr>
        }

    }, [items]);
    
}
