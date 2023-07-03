import { Container, Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";

import Logo from "../../assets/img/LogoNexusTech.png";

const Footer = () => {
    const theme = useTheme();
    // Pegar o ano atual
    const ano = new Date().getFullYear();
    return(
        <Box sx={{background: theme.palette.background.green, margin: 0}} >
            <Container maxWidth='xl' sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0'}}>

            <img width='60px' src={Logo} alt="Logo Nexus Tech" />
            <Typography sx={{color: theme.palette.text.secondary, textAlign: 'center', padding: 2}} variant='body2'>
                © {ano} - Todos os direitos reservados
            </Typography>
            <Typography sx={{color: theme.palette.text.secondary, textAlign: 'center', padding: 2}} variant='body2'>
                Desenvolvido por <a href="https://www.nexustech.net.br" target="_blank" rel="noreferrer">Nexus Tech</a>
            </Typography>
            </Container>
        </Box>
    )
}

export default Footer;