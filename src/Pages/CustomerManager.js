
import { Typography } from '@mui/material';

import TableCustomers from '../Components/TableCustomers/TableCustomers';

const CustomerManager = () => {
  

    return (
        <>
            <Typography
                sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' } }} variant='h5'
            >
                Gerenciador de Doadores
            </Typography>
            <TableCustomers />

         
        </>
    );
}

export default CustomerManager;
