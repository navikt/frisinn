import React from 'react';

function CalculatorSvg() {
    return (
        <svg width={64} height={64} viewBox="0 0 64 64">
            <title>{'Group'}</title>
            <g fillRule="nonzero" fill="none">
                <g transform="translate(20 13)">
                    <rect fill="#3E3832" width={23} height={37} rx={2} />
                    <path fill="#D8D8D8" d="M2.3 3.469h18.4v8.094H2.3z" />
                    <path fill="#3E3832" d="M13.8 8.094h2.3V9.25h-2.3zM17.25 8.094h2.3V9.25h-2.3z" />
                    <ellipse fill="#D8D8D8" cx={4.6} cy={17.344} rx={2.3} ry={2.313} />
                    <ellipse fill="#E7E9E9" cx={4.6} cy={24.281} rx={2.3} ry={2.313} />
                    <ellipse fill="#E7E9E9" cx={4.6} cy={31.219} rx={2.3} ry={2.313} />
                    <ellipse fill="#D8D8D8" cx={11.5} cy={17.344} rx={2.3} ry={2.313} />
                    <ellipse fill="#E7E9E9" cx={11.5} cy={24.281} rx={2.3} ry={2.313} />
                    <ellipse fill="#FF9100" cx={18.4} cy={17.344} rx={2.3} ry={2.313} />
                    <ellipse fill="#E7E9E9" cx={18.4} cy={24.281} rx={2.3} ry={2.313} />
                    <rect fill="#D8D8D8" x={9.2} y={28.906} width={11.5} height={4.625} rx={2} />
                </g>
            </g>
        </svg>
    );
}

export default CalculatorSvg;
