import { maxWidth, styled } from '@mui/system';
import LogoUrl from 'assets/images/Logo.svg'

export const HeaderPage = () => {

    return (
        <Container>
            <Wrapper>
                <ImageLogo src={LogoUrl} alt='Logo'></ImageLogo>
                <TitleText>
                    Система автоматической проверки и отработки <br/>
                    нарушений на сайтах образовательных учреждений
                </TitleText>
            </Wrapper>
            
        </Container>
    )
}


const Container = styled("div") ({
    width: "100%",
    height: 154,
    backgroundColor: "#D8D7D7",
    
})

const Wrapper = styled("div") ({
    maxWidth: 1229,
    margin: "0 auto",
    height: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 20
})

const ImageLogo = styled("img") ({
    width: 65,
    height: 66
})

const TitleText = styled("p") ({
    textAlign: "left",
    fontSize: 22,
    fontWeight: 400,
    '@media (max-width:425px)': {
        fontSize: 16      
    }
})