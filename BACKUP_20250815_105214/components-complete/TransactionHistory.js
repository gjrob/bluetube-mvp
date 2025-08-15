// components/TransactionHistory.js
import { useState, useEffect } from 'react';

const TransactionHistory = ({ userId, role }) => {
  const [transactions, setTransactions] = useState([]);

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const thStyle = {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px'
  };

  const statusStyle = (amount) => ({
    color: amount > 0 ? '#059669' : '#dc2626',
    fontWeight: '600'
  });

  useEffect(() => {
    fetch(`/api/transactions?userId=${userId}&role=${role}`)
      .then(res => res.json())
      .then(setTransactions);
  }, [userId, role]);

  return (
    <div style={containerStyle}>
      <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>
        Transaction History
      </h2>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Job</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Platform Fee</th>
            <th style={thStyle}>Net Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td style={tdStyle}>
                {new Date(transaction.created_at).toLocaleDateString()}
              </td>
              <td style={tdStyle}>{transaction.job_title}</td>
              <td style={tdStyle}>${transaction.total_amount}</td>
              <td style={tdStyle}>${transaction.platform_fee}</td>
              <td style={{...tdStyle, ...statusStyle(transaction.pilot_payout)}}>
                ${role === 'pilot' ? transaction.pilot_payout : transaction.total_amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;