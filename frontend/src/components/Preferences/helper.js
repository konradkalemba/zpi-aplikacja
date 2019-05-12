import React from 'react';

export const DisplayFormikState = props =>
    <div style={{ margin: 'auto', fontSize: 12 }}>
        <h3 style={{ fontFamily: 'monospace' }} />
        <pre
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}
        >
      <strong>props</strong> ={' '}
            {JSON.stringify(props, null, 2)}
    </pre>
    </div>;
