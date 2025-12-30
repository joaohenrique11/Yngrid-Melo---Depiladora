import type { NextPage} from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { database } from "../services/firebase";
import { FormEvent, useState } from "react";
import { ref } from "firebase/database";

const Home: NextPage = () => {

    const [nome, setNome] = useState('')
    const [hora, setHora] = useState('')
    const [tipodepilacao, setTipoDepilacao] = useState('')
    const [observacoes, setObservacoes] = useState('')


    console.log(nome, hora, tipodepilacao, observacoes)

    function gravar(event: FormEvent){

        event.preventDefault()
        
        const ref = database.ref('clientes')

        const dados = {
            nome,
            hora,
            tipodepilacao,
            observacoes
        }

        ref.push(dados)
    }

    return (
        <>
            <main className={styles.container}>
                <form onSubmit={gravar}>
                    <input type="text" placeholder="Nome" onChange={event => setNome(event.target.value)}></input>
                    <input type="time" placeholder="Horário" onChange={event => setHora(event.target.value)}></input>
                    <input type="text" placeholder="Tipo de depilação" onChange={event => setTipoDepilacao(event.target.value)}></input>
                    <textarea placeholder="Observações" onChange={event => setObservacoes(event.target.value)}></textarea>
                    <button type="submit">Agendar</button>
                </form>
                <div className={styles.caixaclientes}>
                    <input type="text" placeholder="Buscar"></input>
                    <div className={styles.caixaindividual}>
                        <div className={styles.boxtitulo}>
                            <p className={styles.nometitulo}>Carla Gomes Farias</p>
                            <div>
                                <a>Editar</a>
                                <a>Excluir</a>
                            </div>
                        </div>
                        <div className={styles.dados}>
                            <p>16:00</p>
                            <p>Depilação das pernas</p>
                            <p>Sem Observaçã</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home;