interface TableData {
  type: 'default' | 'profit' | 'loss',
  content: String,
  currency?: String, 
}

export default function TableData( { type, content, currency } : TableData ){
  
  if (type === 'default'){
    return (
      <td className="p-2.5 border border-overlay-0 text-text text-center">
        {content}
      </td>
    )
  }

  if (type === 'profit'){
    return (
      <td className="p-2.5 border border-overlay-0 text-green text-center font-semibold">
        +{content}{currency}
      </td>
    )
  }

  if (type === 'loss'){
    return (
      <td className="p-2.5 border border-overlay-0 text-red text-center font-semibold">
        {content}{currency}
      </td>
    )
  }
}
