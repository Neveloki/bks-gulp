module.exports = {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % || rem */
    mobileFirst: true, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1170px' /* max-width оn very large screen */
    },
    breakPoints: {
        lg: {
            width: '1280px', /* -> @media (max-width: 1100px) */
            fields: '30px' /* side fields */
        },
        md: {
            width: '992px',
            fields: '30px' /* side fields */
        },
        sm: {
            width: '768px',
            fields: '30px' /* side fields */
        },
        xs: {
            width: '576px',
            fields: '30px' /* side fields */
        },
        xxs: {
            width: '320px',
            fields: '15px' /* set fields only if you want to change container.fields */
        }
        /*
        We can create any quantity of break points.

        some_name: {
            width: 'Npx',
            fields: 'N(px|%|rem)',
            offset: 'N(px|%|rem)'
        }
        */
    }
};