import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CobrancasRecorrentes = () => {
    const [cobrancasRecorrentes, setCobrancasRecorrentes] = useState([]);

    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_URL}/asaas.php?param=11`)
        .then((response) => {
            setCobrancasRecorrentes(response.data.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    console.log(cobrancasRecorrentes);

    return (
        <div>
            <h1>Cobranças Recorrentes</h1>
            {cobrancasRecorrentes.map((cobrancaRecorrente, index) => {
                return <p key={index}>{cobrancaRecorrente.id}</p>
            })}
        </div>
    );
}

export default CobrancasRecorrentes;
