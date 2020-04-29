import React from 'react';

function CheckSVG(props: any) {
    return (
        <svg height="1.5em" width="1.5em" viewBox="0 0 24 24" {...props}>
            <g fill="none">
                <path
                    d="M12 0C5.383 0 0 5.384 0 12s5.383 12 12 12c6.616 0 12-5.384 12-12S18.616 0 12 0z"
                    fill="#1C6937"
                />
                <path
                    d="M9.64 14.441l6.46-5.839a.997.997 0 011.376.044.923.923 0 01-.046 1.334l-7.15 6.464a.993.993 0 01-.662.252.992.992 0 01-.69-.276l-2.382-2.308a.923.923 0 010-1.334.997.997 0 011.377 0l1.717 1.663z"
                    fill="#FFF"
                />
            </g>
        </svg>
    );
}

export default CheckSVG;
