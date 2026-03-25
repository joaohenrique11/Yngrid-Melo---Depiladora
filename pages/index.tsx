import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image"; // Importado para usar a logo
import styles from "../styles/Home.module.scss";
import { database } from "../services/firebase";
import { FormEvent, useEffect, useState } from "react";

type Cliente = {
    chave: string;
    nome: string;
    hora: string;
    tipodepilacao: string;
    observacoes: string;
}

const Home: NextPage = () => {

    const [nome, setNome] = useState('')
    const [hora, setHora] = useState('')
    const [tipodepilacao, setTipoDepilacao] = useState('')
    const [observacoes, setObservacoes] = useState('')
    const [clientes, setClientes] = useState<Cliente[]>()
    const [busca, setBusca] = useState<Cliente[]>([]);
    const [estaBuscando, setEstaBuscando] = useState(false);
    const [chave, setChave] = useState('')
    const [atualizando, setAtualizando] = useState(false);

    useEffect(() => {
        const refClientes = database.ref('clientes')
        refClientes.on('value', resultado => {
            const resultadoClientes = Object.entries<Cliente>(resultado.val() ?? {}).map(([key, value]) => {
                return {
                    'chave': key,
                    'nome': value.nome,
                    'hora': value.hora,
                    'tipodepilacao': value.tipodepilacao,
                    'observacoes': value.observacoes
                }
            })
            setClientes(resultadoClientes)
        })
    }, [])

    function gravar(event: FormEvent) {
        event.preventDefault()
        const ref = database.ref('clientes')
        const dados = { nome, hora, tipodepilacao, observacoes }
        ref.push(dados)
        setNome(''); setHora(''); setTipoDepilacao(''); setObservacoes('')
    }

    function deletar(ref: string) {
        database.ref(`clientes/${ref}`).remove()
    }

    function buscar(event: FormEvent<HTMLInputElement>) {
        const palavra = event.currentTarget.value;
        if (palavra.length > 0) {
            setEstaBuscando(true);
            const dados: Cliente[] = []
            clientes?.map(cliente => {
                const regra = new RegExp(palavra, "gi")
                if (regra.test(cliente.nome)) {
                    dados.push(cliente)
                }
            })
            setBusca(dados)
        } else {
            setEstaBuscando(false)
        }
    }

    function editarDados(cliente: Cliente) {
        setAtualizando(true)
        setChave(cliente.chave)
        setNome(cliente.nome)
        setHora(cliente.hora)
        setTipoDepilacao(cliente.tipodepilacao)
        setObservacoes(cliente.observacoes)
    }

    function atualizarCliente() {
        const ref = database.ref('clientes')
        const dados = {
            'nome': nome,
            'hora': hora,
            'tipodepilacao': tipodepilacao,
            'observacoes': observacoes
        }
        ref.child(chave).update(dados)
        setNome(''); setHora(''); setTipoDepilacao(''); setObservacoes('')
        setAtualizando(false)
    }

    return (
        <>
            <Head>
                <title>Yngrid Melo | Gestão de Clientes</title>
            </Head>

            <main className={styles.container}>
                <form onSubmit={atualizando ? (e) => e.preventDefault() : gravar}>
                    
                    <div className={styles.logoContainer}>
                        <Image 
                            src="/logo-v2.png" 
                            alt="Yngrid Melo Logo" 
                            width={500} 
                            height={200} 
                            priority 
                        />
                    </div>

                    <input type="text" placeholder="Nome" value={nome || ''} onChange={event => setNome(event.target.value)} />
                    <input type="time" placeholder="Horário" value={hora || ''} onChange={event => setHora(event.target.value)} />
                    <input type="text" placeholder="Tipo de depilação" value={tipodepilacao || ''} onChange={event => setTipoDepilacao(event.target.value)} />
                    {/* Placeholder com acento para ficar mais bonito */}
                    <textarea placeholder="Observações" value={observacoes || ''} onChange={event => setObservacoes(event.target.value)}></textarea>
                    
                    {atualizando ?
                        <button type="button" onClick={atualizarCliente}>Atualizar</button> :
                        <button type="submit">Agendar</button>
                    }
                </form>

                <div className={styles.caixaclientes}>
                    <input type="text" placeholder="🔍 Buscar cliente..." onChange={buscar}></input>
                    
                    {(estaBuscando ? busca : clientes)?.map(cliente => (
                        <div key={cliente.chave} className={styles.caixaindividual}>
                            <div className={styles.boxtitulo}>
                                <p className={styles.nometitulo}>{cliente.nome}</p>
                                <div>
                                    <a onClick={() => editarDados(cliente)}>Editar</a>
                                    <a onClick={() => deletar(cliente.chave)} style={{color: '#8B6D55', marginLeft: '10px', opacity: 0.5}}>Excluir</a>
                                </div>
                            </div>
                            <div className={styles.dados}>
                                <p><strong>Horário:</strong> {cliente.hora}</p>
                                <p><strong>Serviço:</strong> {cliente.tipodepilacao}</p>
                                {/* Alteração feita aqui para aparecer o nome "Observação" */}
                                <p><strong>Observação:</strong> {cliente.observacoes}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}

export default Home;