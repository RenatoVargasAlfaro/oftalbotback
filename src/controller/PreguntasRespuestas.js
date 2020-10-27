//importamos la conexion
const connection = require('../connection/db-PreguntasRespuestas');
const assert = require('assert');
const { ObjectID } = require('mongodb');

const chatbotController = require('./chatbotController');

module.exports = {
    getQuestion: async (req, res) => {
        const db = await connection(); // obtenemos la conexión
        //var docs = await db.collection('PregRpta').find().toArray();
        //res.json(docs);
        await db.collection('PregRpta').find().toArray((err, result) => {
            if (err) throw err;
            console.log("datos obtenidos");
            res.json(result);
        });
    },
    addQuestion: async (req, res) => {
        var preguntas = Array.from(req.body); //se usa esto para volverlo array
        const db = await connection(); // obtenemos la conexión
        //await db.collection('cultura').save(cultura);
        //await db.collection('PregRpta').insertOne(cultura);
        //await db.collection('cultura').insertMany(cultura);
        //console.log("dato agregado");
        //console.log(preguntas);

        var result = await db.collection('PregRpta').find().limit(1).sort({id:-1}).toArray();
        //let n = result[0]._id+1;
        //res.json(result[0]._id);
        //console.log(n);
        //console.log(result);
        

        /*await db.collection('PregRpta').find().limit(1).sort({_id:-1}).toArray(function(err, result) {
            if (err) throw err;
            console.log("datos obtenidos");
            res.json(result[0]._id);
        });*/
        var arreglo =[]
        preguntas.forEach((elemento, index) => {
            if(elemento.estado!='Entrenado'){
                arreglo.push(elemento)
            }
        });
        preguntas=arreglo
        //console.log("------",preguntas)


        var consultas = []
        var respuestas1 = []
        var respuestas2 = []

        //aca guardamos las preguntas
        preguntas.forEach((e, i) => {
            if(e.intencion=="Consulta Malestares"){
                consultas.push(e.consulta)
            }
        })
        console.log(consultas)


        //aca guardaremos las respuestas
        preguntas.forEach((e, i) => {
            if(e.intencion=="Consulta Malestares"){
                respuestas1.push(e.respuestas)
            }
        })
        console.log(respuestas1)
        respuestas1.forEach((e, i) => {
            e.forEach((x, i) => {
                respuestas2.push(x.text)
            })
        })
        console.log(respuestas2)

        
        //var a = ["a", "b", "c"]
        //var b= ["Ra", "Rb", "Rc"]
        chatbotController.testUpdateTraining("f2203c32-3243-4ad4-96d7-25b0091891af", consultas, respuestas2);




//----------------------------------------------------------------

        //OJOOOOOO: Para colocar un id incremental
        let n=0;

        if(result[0]!=null){
            console.log("se hace el proceso");
            n = result[0].id+1;
        }

        preguntas.forEach((elemento, index) => {
            elemento.id=index+n;
            elemento.estado='Entrenado';
        });

        await db.collection('PregRpta').insertMany(preguntas, async (err, result) => {
            if (err) throw err;
            console.log("datos agregados");
            const pgtas = await db.collection('PregRpta').find().toArray();
            res.json(pgtas);
        });

//----------------------------------------------------------------

        //const n = await db.collection('PregRpta').find().count();
                //let a = 0;
                //console.log(n);
                //console.log(cultura.length);  

        /*cultura.forEach((elemento, index) => {
            elemento._id=index+n;
        });*/

                /*for (var i = n; i < n + cultura.length; i++) {
                    console.log(cultura[a]._id=i); 
                    a++;
                }*/

        /*await db.collection('PregRpta').insertMany(cultura, function(err, res) {
            if (err) throw err;
            console.log("datos agregados");
        });*/

//----------------------------------------------------------------
        
        /*req.body.forEach(function(entry, index) {
            //console.log(index, entry.pregunta);
            var myobj = { 
                id: db.collection('PregRpta').find().count()+1, 
                entry
            };
            db.collection('PregRpta').insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("dato agregado");
            });
        });*/
    },
    deleteQuestion: async (req, res) => {
        const dato = req.params.id;
        const db = await connection(); // obtenemos la conexión
        /*await db.collection('cultura').remove({
            _id: id
        });*/
        /*await db.collection('PregRpta').deleteOne({
            _id: ObjectID(dato)
        });
        console.log("Dato borrado");*/
        await db.collection('PregRpta').deleteOne({
            id: parseInt(dato) //como ya no es un id de mongo, se pasa asi como numero
            //_id: ObjectID(dato)
        }, (err, obj) => {
            if (err) throw err;
            console.log("Dato borrado");
            res.json("Borrado");
        });
    },
    updateQuestion: async (req, res) => {
        const dato = req.params.id;
        //obtiene los datos a actualizar
        //const nuevoDato = req.body;
        const nuevoDato = { $set: req.body };
        const db = await connection(); // obtenemos la conexión
        /*await db.collection('PregRpta').updateOne({
            _id: ObjectID(dato)
        }, nuevoDato);
        console.log("Dato actualizado");*/
        await db.collection('PregRpta').updateOne({
            id: parseInt(dato) //como ya no es un id de mongo, se pasa asi como numero
        }, nuevoDato, (err, result) => {
            if (err) throw err;
            console.log("Dato actualizado");
            res.json("Actualizado");
        });
    },
    getQuestionbyId: async (req, res) => {
        const db = await connection(); // obtenemos la conexión
        const dato = req.params.id; 
        //const cultura = await db.collection('PregRpta').find({_id: ObjectID(dato)}).toArray();
        //res.json(cultura);
        //console.log("Dato por id obtenido");
        await db.collection('PregRpta').find({id: parseInt(dato)}).toArray((err, result) => {
            if (err) throw err;
            console.log("Dato por id obtenido");
            res.json(result);
        });
    }
}