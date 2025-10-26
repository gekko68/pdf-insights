import React from 'react';
import { formatPdfDate } from '../../utils/pdfUtils';

interface MetadataTabProps {
  pdfMeta: any;
}

const MetadataTab: React.FC<MetadataTabProps> = ({ pdfMeta }) => {
  if (!pdfMeta) return <div>Loading metadata...</div>;
  if (pdfMeta.error) return <div>{pdfMeta.error}</div>;
  return (
    <div>
      <table style={{ width: '100%', color: '#fff', fontSize: '0.95rem' }}>
        <tbody>
          {(Object.entries(pdfMeta) as [string, any][]).map(([key, value]) => {
            let displayValue = value;
            if (
              key.toLowerCase().includes('date') &&
              typeof value === 'string' &&
              value.startsWith('D:')
            ) {
              displayValue = formatPdfDate(value);
            }
            return (
              value && (
                <tr key={key}>
                  <td style={{ fontWeight: 'bold', padding: '4px 8px', textTransform: 'capitalize' }}>{key}</td>
                  <td style={{ padding: '4px 8px' }}>{displayValue}</td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MetadataTab; 