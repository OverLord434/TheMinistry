import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useAppSelector } from 'shared/types/hooks/hooks';
import { useEffect } from 'react';


export const SitesTable = () => {
    const { data, loading } = useAppSelector((state) => state.checkInstitution)
    
    useEffect(() => {
        console.log(data)
    }, [data])

    

    return (
        <TableContainer component={Paper} sx={{width: "100%", marginTop: 2}}>
            <Table sx={{
                    width: "100%",
                    borderCollapse: 'collapse',
                    "& td, & th": {
                        border: "2px solid #ccc"
                    }
                    
                    }} aria-label='customized table'>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#696969z' }}>
                        <TableCell sx={{fontSize: 30}}>№</TableCell>
                        <TableCell sx={{fontSize: 30}}>Раздел сайта</TableCell>
                        <TableCell sx={{fontSize: 30}}>Статус</TableCell>
                        <TableCell sx={{fontSize: 30}}>Найденные атрибуты</TableCell>
                        <TableCell sx={{fontSize: 30}}>Не найденные атрибуты</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.sections.map((section, index) => (
                        <TableRow key={index + 1} sx={{backgroundColor: "#708090"}}>
                            <TableCell sx={{fontSize: 22}}>{index + 1}</TableCell>
                            <TableCell sx={{fontSize: 22}}>{section.name}</TableCell>
                            <TableCell sx={{fontSize: 22, whiteSpace: 'nowrap'}}>{section.status}</TableCell>
                            <TableCell sx={{fontSize: 22, whiteSpace: 'nowrap'}}>{section.found_attrs}</TableCell>
                            <TableCell sx={{fontSize: 22, whiteSpace: 'nowrap'}}>{section.missing_attrs}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}