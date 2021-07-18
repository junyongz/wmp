import { useMemo } from 'react'

export default function StockListItems(props) {
    
    // const items = useSelector((state) => state.stock.items) 

    const { items, setShowView, setViewItem, setShowAddDividend } = props;

    const showViewDetailModal = (idx) => {
        setShowView(true);
        setViewItem(items[idx]);
    }

    const showDividendButton = (idx) => {
        document.querySelector('#div-add-btn-' + idx).
    }

    const hideDividendButton = (idx) => {
        document.querySelector('#div-add-btn-' + idx)
    }

    return useMemo(() => {
        if (items.length > 0) {
            return items.map((v, i) =>
                    <tr key={v.id} onMouseOver={() => showDividendButton(i)} onMouseOut={() => hideDividendButton(i)}> 
                        <td>{i+1}</td>
                        <td>{v.code}</td>
                        <td><a class="text-decoration-none text-info" href="#" 
                            onClick={() => showViewDetailModal(i)}>{v.name}</a>
                            <button id={'div-add-btn-' + i} type="button" class="btn btn-sm btn-info invisible" 
                                onClick={() => setShowAddDividend()}>Add Dividend</button>
                        </td>
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

    }, [items]);
    
}
