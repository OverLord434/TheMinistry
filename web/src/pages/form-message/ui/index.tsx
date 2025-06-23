import { styled } from "@mui/system"
import { CheckAutomaticRun } from "entities/institut-form/model/actions/send-message";
import { useForm, SubmitHandler } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "shared/types/hooks/hooks"
import { LinearProgress } from '@mui/material'
import { useEffect, useRef, useState } from "react";


type MessageFormType = {
    title: string;
    message: string;
}

export const SendMessagePage = () => {
    const {
        register,
        handleSubmit,
        reset
    } = useForm<MessageFormType>() 
    const { data, loading} = useAppSelector((state) => state.checkAuto)
    const [progress, setProgress] = useState<number | null>(null)
    const socketRef = useRef<WebSocket | null>(null)
    
    const [checked, setChecked] = useState(0);
    const [total, setTotal] = useState(0);

    
    const dispatch = useAppDispatch()

    const onSubmit: SubmitHandler<MessageFormType> = (data) => {
        reset()
        dispatch(CheckAutomaticRun({
            email_subject: data.title,
            email_body: data.message
        }))
        
        

        setProgress(0)
        
    }

    useEffect(() => {
        const socket = new WebSocket("ws://82.202.128.59/ws/progress/");

        socket.onopen = () => console.log("WebSocket открыт");
        socket.onmessage = (event) => {
            const dataWebsoket = JSON.parse(event.data);
            setChecked(dataWebsoket.checked)
            setTotal(dataWebsoket.total)
        };

        return () => socket.close();

    }, [])

    return (
        <Container onSubmit={handleSubmit(onSubmit)}>
            <FieldWrapper>
                <label htmlFor="title" style={{fontSize: 22, fontWeight: 400}}>Заголовок письма</label>
                <FieldBlock>
                    <Field 
                        id="title" 
                        autoComplete="off"
                        {...register('title', { required: true })}
                        disabled={loading}
                        // placeholder="Заголовок пиьсма"
                    />
                    <MessageBlock 
                        sx={{minHeight: 400}} 
                        id="message" 
                        {...register('message', { required: true })}
                        disabled={loading}
                        placeholder="Содержимое письма..."
                    />
                <Button>Начать автоматическую проверку</Button>
                </FieldBlock>
            </FieldWrapper>
            {progress !== null && (
                <div
                    style={{
                        marginBottom: 16,
                        padding: '12px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#f0f4ff',
                        border: '1px solid #c2d4ff',
                        color: '#2c3e50',
                        fontSize: '16px',
                        fontWeight: 500,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    {data.status === "done"
                        ? <p style={{ margin: 0 }}>✅ Проверка завершена</p>
                        : <p style={{ margin: 0 }}>🔍 Проверено: {checked} из {total}</p>}
                </div>
            )}
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
    flexDirection: 'column',
    width: "100%",
    gap: 20,
})

const MessageBlock = styled("textarea") ({
    width: "100%",
    borderRadius: 8,
    border: "0.5px solid #ccc",
    fontSize: 16
})

const Field = styled("input") ({
    width: "100%",
    height: 46,
    borderRadius: 8,
    border: "0.5px solid #ccc",
    fontSize: 20,
    '::placeholder': {
        '@media (max-width:425px)': {
            fontSize: 14   
        }
    }
})

const Button = styled("button") ({
    width: "100%",
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