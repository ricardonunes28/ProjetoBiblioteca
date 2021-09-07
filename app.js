var express = require("express");
var mongoose = require("mongoose");

const app = express();
const port = 8000;


//Conexão com o banco de dados
mongoose.connect("Meu banco", { useNewUrlParser: true, useUnifiedTopology: true });

//Collection
const Biblioteca = mongoose.model("livros", {
    categoria: String,
    nome: String,
    autor: String,
    ano: Number,
    editora: String

});

//rota pagina principal 
app.get("/", (req, res) => {
    res.send("Pagina Principal")
});

//chamando o motor de visualização
app.set("view engine", "ejs");//use como montor de visualização o ejs
app.set("views", __dirname, "/views");//minhas visualizações que vou precisar utilizar 


app.use(express.urlencoded());//permitindo que os dados passos, que haja fluxo(transitem) enrte minhas paginas 
app.use(express.json());// o fluxo dos meus arquivos seja em formato json
app.use(express.static("public")); //Minhas pasta com permisão para css e js

//Lista da Biblioteca armazenada
app.get("/listaBiblioteca", (req, res) => {
    let consulta = Biblioteca.find({}, (err, Livros) => {
        console.log(consulta)
        if (err)
            return res.status(500).send("Ao consultar Biblioteca");
        res.render("listaBiblioteca", { listaBiblioteca: Livros }); 
    });

})

//rota Cadastro Biblioteca
app.get("/cadastroBiblioteca", (req,res)=>{
    res.render("formBiblioteca")
})

app.post("/cadastroBiblioteca" , (req,res)=>{
    let livro = new Biblioteca();

    livro.categoria = req.body.categoria; 
    livro.nome = req.body.nome;
    livro.autor = req.body.autor;
    livro.ano = req.body.ano;
    livro.editora = req.body.editora;

    livro.save((err) => {
        if (err) // como se trata do servidor, preciso verificar se tem algum erro . 
            return res.status(500).send("Erro ao cadastrar")
        return res.redirect("/listaBiblioteca");
    })
})

app.get("/deletarLivro/:id", (req, res) => {
    let chave = req.params.id; // pegando o id do parametro
    Biblioteca.deleteOne({ _id: chave }, (err, result) => {
        if (err)
            return res.status(500).send("Erro ao excluir registro");
        res.redirect("/listaBiblioteca")
    });

});

app.get("/editarBiblioteca/:id", (req, res) => {
    Biblioteca.findById(req.params.id, (err, conteudo) => {
        if (err)
            return res.status(500).send("Erro ao consultar Biblioteca");
        res.render("formeditarBiblioteca", { conteudo_item: conteudo })
    });

});

app.post("/editarBiblioteca", (req, res) => {
    let id = req.body.id
    Biblioteca.findById(id, (err, livro) => {
        if (err)
            return res.status(500).send("Erro ao consultar Biblioteca");
            livro.categoria = req.body.categoria; 
            livro.nome = req.body.nome;
            livro.autor = req.body.autor;
            livro.ano = req.body.ano;
            livro.editora = req.body.editora;
        

        livro.save(err =>{
            if(err)
            return res.status(500).send("Erro ao editar")
            return res.redirect("/listaBiblioteca");
        })
    })
})


app.listen(port, () => {
    console.log("Servidor rodando na porta " + port)
});

