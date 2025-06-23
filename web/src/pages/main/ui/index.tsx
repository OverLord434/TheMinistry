
import { HeaderPage } from 'pages/header';
import { InstitutionCheckForm } from 'pages/field-form';
import { Box, styled } from '@mui/system';
import { SitesTable } from 'pages/table';
import { useAppSelector } from 'shared/types/hooks/hooks';
import { useState } from 'react';
import { SendMessagePage } from 'pages/form-message';
export const MainPage = () => {
    const { data, loading, error} = useAppSelector((state) => state.checkInstitution)
    const [ mode, setMode ] = useState<boolean>(false)

    console.log(data.sections)

    return (
        <div>
            <HeaderPage/>
                <ContentWrapper>
                    { !mode &&
                    <div>
                        <TitleMain>
                            Проверка сайта на соответствие требованиям законодательства в
                            сфере образования
                        </TitleMain>
                        <Text>
                            Данная система предназначена для автоматизации процесса выявления и устранения нарушений требований к сайтам образовательных учреждений.
                            Она позволяет сотрудникам легко запускать проверки, просматривать результаты и автоматически формировать уведомления для управления образования и школ.
                        </Text> 

                        <InstitutionCheckForm/>
                        {!loading && (
                        data.sections.length !== 0 ? (
                            <SitesTable/>
                        ) : error !== null ? (
                            <ErrorText>{error}</ErrorText>
                        ) : null
                        )}
                    
                    </div>
                    }

                    {mode && <SendMessagePage/>}
                    <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <span style={{fontSize: 16}}>Поменять способ проверки на:</span>
                        <Button onClick={() => setMode(!mode)}>{mode ? "Ручная проверка" : "Автоматическая проверка"}</Button>
                    </Box>
                    

                </ContentWrapper>
        </div>
    )
}

const ContentWrapper = styled("div") ({
  maxWidth: 1229,
  display: 'flex',
  flexDirection: 'column',
  margin: "0 auto",
  gap: 20,
  marginBottom: 20,
  padding: 20
})

const TitleMain = styled("p") ({
  fontSize: 40,
  fontWeight: 600,
  '@media (max-width:425px)': {
    fontSize: 22      
  }
})

const Text = styled("p") ({
  fontSize: 22,
  fontWeight: 400,
  '@media (max-width:425px)': {
    fontSize: 16      
  }
})

const ErrorText = styled("p") ({
  fontSize: 40,
  alignSelf: 'center'
})


const Button = styled("button") ({
    minWidth: 210,
    height: 55,
    borderRadius: 22,
    border: "0.5px solid #ccc",
    background: "white",
    fontSize: 22,
    fontWeight: 400,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
        backgroundColor: "#ccc"
    },
    '&:active': {
        backgroundColor: '#ccc',
        transform: 'scale(0.98)',
    },
})