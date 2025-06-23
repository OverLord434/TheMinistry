import { Checkbox, FormControlLabel } from "@mui/material"
import { Box, styled } from "@mui/system"
import { CheckRun } from "entities/institut-form/model"
import { useForm, SubmitHandler } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "shared/types/hooks/hooks"
import { AnimatedDots } from "shared/ui"

type InstitutionCheckFormTypes = {
  url: string;
  send_to_email: boolean;
  recVersion: string;
}

export const InstitutionCheckForm = () => {
    const {
        register,
        handleSubmit,
    } = useForm<InstitutionCheckFormTypes>() 
    const { loading } = useAppSelector((state) => state.checkInstitution)
    const dispatch = useAppDispatch()

    const onSubmit: SubmitHandler<InstitutionCheckFormTypes> = (data) => {
        dispatch(CheckRun({
            url: data.url,
            send_to_email: data.send_to_email
        }))
        console.log(data)

    }
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <AnimatedDots/>
            </Box>
        )
    }
    return (
        <Container onSubmit={handleSubmit(onSubmit)}>
            <FieldWrapper>
                <label htmlFor="urlUnivers">Адрес сайта образовательного учреждения</label>
                <FieldBlock>
                    <Field 
                        id="urlUnivers" 
                        {...register('url', { required: true })}
                        placeholder="Пример адреса: http(s):/ адрес_сайта.ru"
                    />
                    <FormControlLabel control={<Checkbox {...register("send_to_email")}/>} label="Отправить на почту организации" sx={{display: 'flex', alignItems: 'center', whiteSpace: "nowrap"}}/>
                    <Button>Запуск проверки</Button>
                </FieldBlock>
                
            </FieldWrapper> 
            
        </Container>        
    )
}

const Container = styled("form") ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20
})

const FieldWrapper = styled("div") ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20, 
})

const FieldBlock = styled("div") ({
    display: "flex",
    alignItems: 'center',
    width: "100%",
    gap: 20,
    '@media (max-width:768px)': {
        flexDirection: "column"
    }
})

const Field = styled("input") ({
    width: "100%",
    height: 46,
    borderRadius: 8,
    border: "0.5px solid #ccc",
    paddingLeft: 15,
    fontSize: 20,
    '::placeholder': {
        '@media (max-width:425px)': {
            fontSize: 14   
        }
    }
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