import React from 'react';

const FormattedSize = ({bytes}) => {
    const GB_IN_BYTES = 1073741824;
    const MB_IN_BYTES = 1048576;
    const KB_IN_BYTES = 1024;

    if (bytes > GB_IN_BYTES) {
        return `${(bytes / GB_IN_BYTES).toFixed(2)}GB`
    }


    if (bytes > MB_IN_BYTES) {
        return `${(bytes / MB_IN_BYTES).toFixed(2)}MB`
    }

    if (bytes > KB_IN_BYTES) {
        return `${(bytes / KB_IN_BYTES).toFixed(2)}KB`

    }

    return `${bytes}B`;
};

export default FormattedSize;