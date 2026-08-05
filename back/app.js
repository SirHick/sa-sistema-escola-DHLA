//Importa o framework express
const express = require('express');
const cors = require('cors');
const connection = require('./db');
const server = express();

server.use(express.json());
server.use(cors)


//===================================
//Método HTTP: GET
//LISTAR TODOS AS MATERIAS
//localhost:3003/materias
server.get('/materias', (req, res) => {
    const sql = `SELECT m.id_materia, m.nome_materia, 
                m.id_professor_materias, p.nome_professor 
                FROM materias m
                join professores p 
                on m.id_professor_materias = p.id_professor`;
                
    connection.query(sql , (erro , resultados) => {
        if(erro){
            return res.status(500).json({erro: erro.message});
        }
        return res.json(resultados);
    });
});

//Método HTTP: GET
//LISTAR UMA UNICA MATERIA PELO ID
//localhost:3003/materias/2
server.get('/materias/:id', (req, res) => {

    // Desestrutura o parâmetro "index" vindo da URL
    const id = req.params.id;        

    // Retorna o professor correspondente ao índice informado
    return res.json(materias[id]);
});

//Método HTTP: POST
//CRIAR UMA NOVA MATERIA
//localhost:3003/materias
//{ "name": "Curso de Python" }
server.post('/materias', (req, res)=> {
   
    const { nome, id_professor } = req.body
    const sql = 'INSERT INTO materias (nome_materia, id_professor_materias) VALUES (?, ?)';

    connection.query(sql , [nome, id_professor] , (erro , resultados) => {
        if(erro){
            return res.status(500).json({erro: erro.message})
        }
        return res.json({
            mensagem: 'Materia cadastrada com sucesso',
            id: resultados.insertId,
            nome: nome,
            id_professor: id_professor
        })
    });


});

//Método HTTP: PUT
//ATUALIZAR UMA MATERIA
//localhost:3003/materias
server.put('/materias/:id', (req, res) => {

    // Obtém o índice do curso a ser atualizado pela URL
    const id = req.params.id;
    const nome = req.body.nome;
    const id_professor = req.body.id_professor;
    const sql = 'UPDATE materias SET nome_materia = ?, id_professor_materias = ? WHERE id = ?';

    connection.query(sql , [nome, id_professor, id] , (erro , resultados) => {
        if(erro){
            return res.status(500).json({erro: erro.message});
        }
        return res.json({
            mensagem: 'Materia Atualizada com Sucesso!',
            nome: nome,
            id_professor: id_professor,
            id: id
        })
    } );


});

//Método HTTP: DELETE
//DELETAR UMA MATERIA
//localhost:3003/materias/1
server.delete('/materias/:id', (req, res) => {

    // Obtém o índice da materia a ser removida pela URL
    const id = req.params.id;
    const sql = 'DELETE FROM materias WHERE id = ?'

    connection.query(sql , [id], (erro) => {
        if(erro){
            return res.status(500).json({erro: erro.message})
        }
        return res.json({
            mensagem: 'Materia removida com sucesso!'
        })

    });
   
});



//===================================
//
 
//O metodo listen() faz o servidor começar a escutar
// requisiçoes em uma determinada porta.
server.listen(3003 , () => {
    console.log("Servidor rodando na porta 3003");
});